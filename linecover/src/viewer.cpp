#include "linecover/core.hpp"
#include "raylib.h"
#include <algorithm>
#include <cmath>
#include <sstream>
#include <string>
#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#define LC_EXPORT EMSCRIPTEN_KEEPALIVE
#else
#define LC_EXPORT
#endif

namespace {
using namespace linecover;
std::vector<Vec> polygon=samples()[0].vertices;
Result results[2];
Metrics perimeter_first_metrics;
Options options;
int sample_index=0, progress=0, dragged=-1, drag_panel=0, revision=0;
bool playing=false, distinguish=true, full_travel=false;
double accumulator=0, rate=6;
int logical_width=1000, logical_height=410;
double render_scale=1;
std::string error, buffer;

int maximum() { return static_cast<int>(std::max(results[0].strokes.size(),results[1].strokes.size())); }
bool calculate(const std::vector<Vec>& candidate,Options next) {
    try {
        auto a=cover(candidate,Method::Improved,next);
        auto b=cover(candidate,Method::Reference,next);
        auto standard=next; standard.corner_zigzag=false;
        perimeter_first_metrics=a.corner_zigzag ? cover(candidate,Method::Improved,standard).metrics : a.metrics;
        polygon=a.vertices; results[0]=std::move(a); results[1]=std::move(b); options=next;
        progress=0; playing=false; accumulator=0; error.clear(); ++revision;
        return true;
    } catch(const std::exception& e) { error=e.what(); return false; }
}
struct View { Rectangle rect; double scale; Vector2 origin; };
View view(int panel) {
#ifdef __EMSCRIPTEN__
    const float w=static_cast<float>(logical_width), h=static_cast<float>(logical_height);
#else
    const float w=static_cast<float>(GetScreenWidth()), h=static_cast<float>(GetScreenHeight());
#endif
    const bool stacked=w<620;
    Rectangle rect=stacked ? Rectangle{0,panel*h/2,w,h/2} : Rectangle{panel*w/2,0,w/2,h};
    // Reserve space on every side for exterior labels, separate from the panel title/count.
    const double scale=std::max(.05,std::min((rect.width-64)/600.0,(rect.height-108)/480.0));
    return {rect,scale,{rect.x+rect.width/2-static_cast<float>(300*scale),rect.y+56+(rect.height-104)/2-static_cast<float>(240*scale)}};
}
Vector2 screen(Vec p,const View& v) { return {v.origin.x+static_cast<float>(p.x*v.scale),v.origin.y+static_cast<float>(p.y*v.scale)}; }
Vec world(Vector2 p,const View& v) { return {(p.x-v.origin.x)/v.scale,(p.y-v.origin.y)/v.scale}; }
Vector2 label_position(std::size_t i,const View& v) {
    const auto p=polygon[i];
    auto a=polygon[(i+polygon.size()-1)%polygon.size()]-p;
    auto b=polygon[(i+1)%polygon.size()]-p;
    a=a*(1/length(a)); b=b*(1/length(b));
    auto outward=(a+b)*-1; outward=outward*(1/length(outward));
    // The full text box, not just its center, stays beyond the vertex's supporting line.
    const double offset=11+6*std::abs(outward.x)+10*std::abs(outward.y);
    const auto q=screen(p,v);
    return {q.x+static_cast<float>(outward.x*offset),q.y+static_cast<float>(outward.y*offset)};
}
std::vector<Vector2> capsule_ring(const Stroke& t,const View& v) {
    const auto a=screen(t.a,v), b=screen(t.b,v);
    const float r=static_cast<float>(t.radius*v.scale);
    // One convex mesh per footprint avoids alpha accumulating inside a single brush.
    std::vector<Vector2> ring;
    const double theta=std::atan2(b.y-a.y,b.x-a.x);
    const double physical_radius=std::max(1.0,r*render_scale);
    const int segments=std::clamp(static_cast<int>(std::ceil(pi/(2*std::acos(1-.1/physical_radius)))),32,192);
    for(int side=0;side<2;++side) for(int i=0;i<=segments;++i) {
        const double angle=theta-pi/2+side*pi+i*pi/segments;
        const auto c=side==0 ? b : a;
        ring.push_back({c.x+r*static_cast<float>(std::cos(angle)),c.y+r*static_cast<float>(std::sin(angle))});
    }
    std::reverse(ring.begin(),ring.end());
    return ring;
}
void capsule(const Stroke& t,const View& v,Color color) {
    auto ring=capsule_ring(t,v);
    DrawTriangleFan(ring.data(),static_cast<int>(ring.size()),color);
}
void outline(const Stroke& t,const View& v,Color color,float width) {
    const auto ring=capsule_ring(t,v);
    for(std::size_t i=0;i<ring.size();++i) DrawLineEx(ring[i],ring[(i+1)%ring.size()],width,color);
}
Color stroke_color(std::size_t index) {
    static const Color palette[]={{0,100,158,255},{177,82,0,255},{0,120,88,255},{143,80,133,255},{133,104,0,255},{70,91,148,255}};
    return palette[index%6];
}
void direction_arrow(Vector2 a,Vector2 b,Color color) {
    const double d=std::hypot(b.x-a.x,b.y-a.y);
    if(d<=10) return;
    const Vector2 tip{a.x+(b.x-a.x)*.65f,a.y+(b.y-a.y)*.65f};
    const float ux=static_cast<float>((b.x-a.x)/d),uy=static_cast<float>((b.y-a.y)/d);
    DrawLineEx(tip,{tip.x-5*ux+3*uy,tip.y-5*uy-3*ux},1.6f,color);
    DrawLineEx(tip,{tip.x-5*ux-3*uy,tip.y-5*uy+3*ux},1.6f,color);
}
// The complete center trajectory is stroke a->b, then lifted b->next.a.
// Only the visited prefix is shown during playback. There is no invented
// initial positioning move or final return to the start.
void travel_trace(const Result& result,std::size_t count,const View& v) {
    if(!count) return;
    const Color ink{28,28,28,255},lifted{85,85,85,255};
    for(std::size_t i=0;i<count;++i) {
        const auto& t=result.strokes[i];
        const auto a=screen(t.a,v),b=screen(t.b,v);
        if(i) {
            const auto previous=screen(result.strokes[i-1].b,v);
            const double d=std::hypot(a.x-previous.x,a.y-previous.y);
            if(d>1e-6) {
                // At least two dashes even for a short brush-change relocation.
                const double period=std::min(10.0,d/2);
                auto point=[&](double offset) { return Vector2{previous.x+static_cast<float>((a.x-previous.x)*offset/d),previous.y+static_cast<float>((a.y-previous.y)*offset/d)}; };
                for(double offset=0;offset<d;offset+=period) DrawLineEx(point(offset),point(std::min(offset+period*.6,d)),1.6f,lifted);
                direction_arrow(previous,a,lifted);
            }
        }
        if(distance(t.a,t.b)>1e-8) {
            DrawLineEx(a,b,1.8f,ink);
            direction_arrow(a,b,ink);
        } else DrawCircleV(a,1.8f,ink); // stationary circular stamp
    }
    const auto start=screen(result.strokes.front().a,v),end=screen(result.strokes[count-1].b,v);
    DrawCircleV(start,5,WHITE); DrawCircleV(start,4,{0,120,88,255});
    DrawCircleV(end,3,{148,35,34,255});
}
void frame() {
    if(playing) {
        accumulator+=std::min(static_cast<double>(GetFrameTime()),.1)*rate;
        if(accumulator>=1) { const int advance=static_cast<int>(accumulator); accumulator-=advance; progress=std::min(maximum(),progress+advance); }
        if(progress>=maximum()) playing=false;
    }
    if(IsKeyPressed(KEY_SPACE)) { if(progress>=maximum()) progress=0; playing=!playing; }
    if(IsKeyPressed(KEY_RIGHT)) { playing=false; progress=std::min(maximum(),progress+1); }
    if(IsKeyPressed(KEY_LEFT)) { playing=false; progress=std::max(0,progress-1); }
#ifndef __EMSCRIPTEN__
    if(IsKeyPressed(KEY_I)) distinguish=!distinguish;
    if(IsKeyPressed(KEY_T)) full_travel=!full_travel;
    if(IsKeyPressed(KEY_R)) calculate(samples()[std::max(0,sample_index)].vertices,options);
    if(IsKeyPressed(KEY_C)) { sample_index=(sample_index+1)%4; calculate(samples()[sample_index].vertices,options); }
    if(IsKeyPressed(KEY_Z)) { auto next=options; next.corner_zigzag=!next.corner_zigzag; calculate(polygon,next); }
#endif
    auto mouse=GetMousePosition();
#ifdef __EMSCRIPTEN__
    mouse.x/=static_cast<float>(render_scale); mouse.y/=static_cast<float>(render_scale);
#endif
    if(IsMouseButtonPressed(MOUSE_BUTTON_LEFT)) {
        for(int panel=0;panel<2;++panel) for(std::size_t i=0;i<polygon.size();++i) {
            const auto q=screen(polygon[i],view(panel));
            if(CheckCollisionPointCircle(mouse,q,12)) { dragged=static_cast<int>(i); drag_panel=panel; }
        }
    }
    if(dragged>=0 && IsMouseButtonDown(MOUSE_BUTTON_LEFT)) {
        auto next=polygon; auto q=world(mouse,view(drag_panel));
        q.x=std::clamp(q.x,20.0,580.0); q.y=std::clamp(q.y,35.0,445.0);
        if(distance(next[dragged],q)>.5) {
            next[dragged]=q;
            if(next.size()==4) next[dragged==0?1:dragged==1?0:dragged==2?3:2].y=q.y;
            if(calculate(next,options)) { sample_index=-1; progress=maximum(); }
        }
    }
    if(IsMouseButtonReleased(MOUSE_BUTTON_LEFT)) dragged=-1;
    BeginDrawing(); ClearBackground(WHITE);
#ifdef __EMSCRIPTEN__
    BeginMode2D({{0,0},{0,0},0,static_cast<float>(render_scale)});
#endif
    for(int panel=0;panel<2;++panel) {
        const auto v=view(panel); const auto& result=results[panel];
        DrawRectangleLinesEx(v.rect,1,{204,204,204,255});
#ifndef __EMSCRIPTEN__
        DrawText(panel==0?"A. V-shaped method":"B. Reference method (2020)",static_cast<int>(v.rect.x+14),static_cast<int>(v.rect.y+14),16,{30,30,30,255});
#endif
        for(std::size_t i=1;i+1<polygon.size();++i) DrawTriangle(screen(polygon[0],v),screen(polygon[i+1],v),screen(polygon[i],v),{246,246,246,255});
        const auto count=std::min(static_cast<std::size_t>(progress),result.strokes.size());
        const int active=static_cast<int>(count)-1;
        for(std::size_t i=0;i<count;++i) {
            const auto& t=result.strokes[i];
            Color fill=t.stage==1 ? Color{172,124,48,150} : Color{53,111,154,125};
            if(distinguish) { fill=stroke_color(i); fill.a=65; }
            capsule(t,v,fill);
        }
        // Draw every footprint boundary after all fills so later paint cannot hide it.
        if(distinguish) for(std::size_t i=0;i<count;++i) {
            auto color=stroke_color(i);
            outline(result.strokes[i],v,color,1.2f);
        }
        // Outline and paths are drawn after footprints. No clipping hides overflow or gaps.
        for(std::size_t i=0;i<polygon.size();++i) DrawLineEx(screen(polygon[i],v),screen(polygon[(i+1)%polygon.size()],v),1.5,{30,30,30,255});
        if(!full_travel && distinguish) for(std::size_t i=0;i<count;++i) {
            const auto& t=result.strokes[i];
            const auto color=stroke_color(i);
            const auto a=screen(t.a,v),b=screen(t.b,v);
            if(distance(t.a,t.b)>0) { DrawLineEx(a,b,1.6f,color); direction_arrow(a,b,color); }
        }
        if(count) {
            const auto& t=result.strokes[active];
            if(distinguish) {
                outline(t,v,WHITE,4.5f);
                outline(t,v,{148,35,34,255},2.5f);
                DrawCircleV(screen(t.a,v),3,{148,35,34,255});
            }
            DrawLineEx(screen(t.a,v),screen(t.b,v),2,{126,45,30,255});
            DrawCircleLinesV(screen(t.b,v),static_cast<float>(t.radius*v.scale),{126,45,30,255});
        }
        // Keep the full trajectory above all brush highlights and fills.
        if(full_travel) travel_trace(result,count,v);
#ifndef __EMSCRIPTEN__
        for(std::size_t i=0;i<polygon.size();++i) {
            const auto q=screen(polygon[i],v);
            DrawCircleV(q,5,WHITE); DrawCircleLinesV(q,5,{30,30,30,255});
            const auto label=label_position(i,v);
            const char* text=TextFormat("%d",static_cast<int>(i+1));
            DrawText(text,static_cast<int>(label.x-MeasureText(text,16)/2.0),static_cast<int>(label.y-8),16,{30,30,30,255});
        }
        DrawText(TextFormat("%d / %d",static_cast<int>(count),static_cast<int>(result.strokes.size())),static_cast<int>(v.rect.x+14),static_cast<int>(v.rect.y+v.rect.height-25),16,{70,70,70,255});
#endif
    }
#ifdef __EMSCRIPTEN__
    EndMode2D();
#endif
    EndDrawing();
}
}

extern "C" {
LC_EXPORT int lc_configure(int sample,double minimum,int original,int zigzag) {
    if(sample<0 || sample>=4) return 0;
    Options next{minimum,original ? Precision::OriginalRadiusRules : Precision::Continuous,zigzag!=0};
    if(!calculate(samples()[sample].vertices,next)) return 0;
    sample_index=sample; return 1;
}
LC_EXPORT int lc_load(const double* coordinates,int count,double minimum,int original,int zigzag) {
    if(!coordinates || (count!=3 && count!=4)) { error="shape"; return 0; }
    std::vector<Vec> next;
    for(int i=0;i<count;++i) {
        const auto x=coordinates[2*i], y=coordinates[2*i+1];
        if(!std::isfinite(x+y) || x<20 || x>580 || y<35 || y>445) { error="coordinates"; return 0; }
        next.push_back({x,y});
    }
    if(count==4 && (std::abs(next[0].y-next[1].y)>1e-6 || std::abs(next[2].y-next[3].y)>1e-6)) { error="trapezoid"; return 0; }
    if(!calculate(next,{minimum,original ? Precision::OriginalRadiusRules : Precision::Continuous,zigzag!=0})) return 0;
    sample_index=-1; return 1;
}
LC_EXPORT int lc_zigzag(int enabled) {
    auto next=options; next.corner_zigzag=enabled!=0;
    return calculate(polygon,next)?1:0;
}
LC_EXPORT void lc_seek(int value) { playing=false; progress=std::clamp(value,0,maximum()); }
LC_EXPORT void lc_step(int delta) { lc_seek(progress+delta); }
LC_EXPORT void lc_play(int value) {
    if(value) { if(progress>=maximum()) progress=0; }
    playing=value!=0;
}
LC_EXPORT void lc_rate(double value) { if(std::isfinite(value)) rate=std::clamp(value,1.0,30.0); }
LC_EXPORT void lc_display(int identify) { distinguish=identify!=0; }
LC_EXPORT void lc_travel(int enabled) { full_travel=enabled!=0; }
LC_EXPORT void lc_resize(int width,double density) {
    logical_width=std::clamp(width,240,1600); logical_height=logical_width<620 ? 700 : 410;
    render_scale=std::isfinite(density) ? std::clamp(density,1.0,3.0) : 2;
    SetWindowSize(static_cast<int>(std::round(logical_width*render_scale)),static_cast<int>(std::round(logical_height*render_scale)));
}
LC_EXPORT const char* lc_state() {
    std::ostringstream s;
    s<<"{\"revision\":"<<revision<<",\"sample\":"<<sample_index<<",\"cornerZigzag\":"<<(results[0].corner_zigzag?"true":"false")<<",\"distinguish\":"<<(distinguish?"true":"false")<<",\"travel\":"<<(full_travel?"true":"false")<<",\"progress\":"<<progress<<",\"maximum\":"<<maximum()<<",\"playing\":"<<(playing?"true":"false")<<",\"error\":\""<<error<<"\",\"counts\":["<<results[0].strokes.size()<<','<<results[1].strokes.size()<<"],\"current\":[";
    for(int i=0;i<2;++i) {
        if(i) s<<',';
        const auto count=std::min(static_cast<std::size_t>(progress),results[i].strokes.size());
        if(!count) s<<"null";
        else { const auto& t=results[i].strokes[count-1]; s<<"{\"radius\":"<<t.radius<<",\"stage\":"<<t.stage<<",\"corner\":"<<t.corner<<",\"side\":"<<t.side<<'}'; }
    }
    s<<"],\"view\":{\"width\":"<<logical_width<<",\"height\":"<<logical_height<<",\"density\":"<<render_scale<<",\"panels\":[";
    for(int panel=0;panel<2;++panel) {
        if(panel) s<<',';
        const auto v=view(panel);
        s<<"{\"x\":"<<v.rect.x<<",\"y\":"<<v.rect.y<<",\"width\":"<<v.rect.width<<",\"height\":"<<v.rect.height<<",\"vertices\":[";
        for(std::size_t i=0;i<polygon.size();++i) {
            if(i) s<<',';
            const auto q=screen(polygon[i],v), label=label_position(i,v);
            s<<"{\"x\":"<<q.x<<",\"y\":"<<q.y<<",\"labelX\":"<<label.x<<",\"labelY\":"<<label.y<<'}';
        }
        s<<"]}";
    }
    s<<"]}}"; buffer=s.str(); return buffer.c_str();
}
LC_EXPORT const char* lc_export() {
    buffer="{\"schema\":1,\"minimumRadius\":"+std::to_string(options.minimum_radius)+",\"precision\":\""+(options.precision==Precision::Continuous?"continuous":"original-radius-rules")+"\",\"cornerZigzag\":"+(results[0].corner_zigzag?"true":"false")+",\"perimeterFirstTotal\":"+std::to_string(perimeter_first_metrics.drawing_length+perimeter_first_metrics.lifted_length)+",\"perimeterFirstLifted\":"+std::to_string(perimeter_first_metrics.lifted_length)+",\"improved\":"+to_json(results[0])+",\"reference\":"+to_json(results[1])+"}";
    return buffer.c_str();
}
}

int main() {
    SetConfigFlags(FLAG_MSAA_4X_HINT);
    InitWindow(1000,410,"linecover | Space: play, arrows: step, C: case, R: reset");
    SetTargetFPS(60);
    calculate(polygon,options);
    progress=maximum();
#ifdef __EMSCRIPTEN__
    emscripten_set_main_loop(frame,0,1);
#else
    while(!WindowShouldClose()) frame();
    CloseWindow();
#endif
    return 0;
}
