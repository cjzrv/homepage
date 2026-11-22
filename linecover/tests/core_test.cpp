#include "linecover/core.hpp"
#include <algorithm>
#include <cmath>
#include <iostream>
#include <limits>
#include <random>
#include <stdexcept>

using namespace linecover;
static int checks=0;
void check(bool value,const char* message) { ++checks; if(!value) throw std::runtime_error(message); }
void near(double a,double b,double tolerance,const char* message) { check(std::abs(a-b)<=tolerance,message); }
template<class F> void rejects(F f) { bool rejected=false; try {f();} catch(const std::invalid_argument&) {rejected=true;} check(rejected,"invalid input must fail"); }
// Independent spatial check: test sample points against capsule unions, not renderer pixels.
void check_coverage(const Result& r,double minimum) {
    std::size_t uncovered=0,reachable=0;
    std::vector<Vec> inset;
    for(std::size_t i=0;i<r.vertices.size();++i) {
        const auto p=r.vertices[i], prev=r.vertices[(i+r.vertices.size()-1)%r.vertices.size()], next=r.vertices[(i+1)%r.vertices.size()];
        const auto u=p-prev, v=next-p;
        const Vec a{-u.y/length(u),u.x/length(u)}, b{-v.y/length(v),v.x/length(v)};
        const double c=dot(a,p)+minimum, d=dot(b,p)+minimum, det=cross(a,b);
        inset.push_back({(c*b.y-a.y*d)/det,(a.x*d-c*b.x)/det});
    }
    for(int y=40;y<=440;y+=5) for(int x=25;x<=575;x+=5) {
        Vec p{static_cast<double>(x)+.371,static_cast<double>(y)+.219};
        if(!inside(r.vertices,p)) continue;
        bool can_reach=inside(inset,p);
        for(std::size_t i=0;i<inset.size();++i) if(point_segment_distance(p,inset[i],inset[(i+1)%inset.size()])<=minimum) can_reach=true;
        if(!can_reach) continue;
        bool covered=false;
        for(const auto& t:r.strokes) if(point_segment_distance(p,t.a,t.b)<=t.radius+1e-7) {covered=true;break;}
        if(!covered) ++uncovered;
        ++reachable;
    }
    check(reachable>0,"coverage grid populated");
    check(uncovered==0,"all sampled geometrically reachable points are covered");
}
void check_zigzag(const std::vector<Vec>& vertices,double minimum,Precision precision=Precision::Continuous) {
    const auto base=cover(vertices,Method::Improved,{minimum,precision});
    const auto r=cover(vertices,Method::Improved,{minimum,precision,true});
    const auto n=r.vertices.size();
    check(r.corner_zigzag,"zig-zag enabled for supported polygon");
    if(precision==Precision::Continuous) check_coverage(r,minimum);
    near(r.metrics.drawing_length,base.metrics.drawing_length,0,"reordering preserves total drawing length");
    near(r.metrics.footprint_sum,base.metrics.footprint_sum,0,"reordering preserves footprint accounting");
    check(r.strokes.size()==base.strokes.size(),"no coverage arms added or removed");
    std::vector<bool> matched(base.strokes.size());
    for(const auto& t:r.strokes) {
        bool found=false;
        for(std::size_t i=0;i<base.strokes.size();++i) if(!matched[i]) {
            const auto& original=base.strokes[i];
            if(t.radius==original.radius && t.stage==original.stage &&
               ((distance(t.a,original.a)==0 && distance(t.b,original.b)==0) ||
                (distance(t.a,original.b)==0 && distance(t.b,original.a)==0))) {
                matched[i]=true; found=true; break;
            }
        }
        check(found,"identical capsule multiset including brush radii");
    }
    std::vector<bool> visited(n);
    int corner=-1,previous_side=-1,large=0,switches=0;
    double previous_radius=0,ink=0,lifted=0,area=0;
    for(std::size_t j=0;j<r.strokes.size();++j) {
        const auto& t=r.strokes[j];
        if(t.corner!=corner) {
            if(corner>=0) check(switches==1,"one side switch per completed corner");
            check(t.corner>=0 && t.corner<static_cast<int>(n) && !visited[t.corner],"finish each corner before visiting another");
            visited[t.corner]=true; corner=t.corner; previous_side=t.side; switches=0;
            check(t.stage==0,"each corner starts with its large edge");
            near(t.radius,r.initial_radius,0,"each corner begins at maximum radius");
            const auto v=r.vertices[corner],a=r.vertices[(corner+1)%n]-v,b=r.vertices[(corner+n-1)%n]-v;
            const double angle=std::atan2(std::abs(cross(a,b)),dot(a,b));
            const auto bisector=(a*(1/length(a))+b*(1/length(b)));
            const auto center=v+bisector*(t.radius/(length(bisector)*std::sin(angle/2)));
            near(distance(t.b,center),0,1e-8,"large edge arrives at its corner");
        } else {
            check(t.stage==1,"one initial edge per corner");
            if(t.side!=previous_side) {
                ++switches;
                near(previous_radius,minimum,0,"finish first side at minimum before switching");
                near(t.radius,minimum,0,"start return side at minimum");
            }
            check(switches<=1,"complete a side before changing sides");
            check(switches==0?t.radius<=previous_radius:t.radius>=previous_radius,"descend first side, ascend second");
            previous_side=t.side;
        }
        check(t.side==0 || t.side==1,"local side exported");
        previous_radius=t.radius;
        check(t.radius>=minimum,"zig-zag respects minimum radius");
        if(t.stage==0) ++large;
        for(std::size_t i=0;i<n;++i) {
            const auto e=r.vertices[(i+1)%n]-r.vertices[i];
            for(auto q:{t.a,t.b}) check(cross(e,q-r.vertices[i])/length(e)>=t.radius-1e-7,"zig-zag capsule contained");
        }
        const double d=distance(t.a,t.b); ink+=d; area+=2*t.radius*d+pi*t.radius*t.radius;
        if(j) lifted+=distance(r.strokes[j-1].b,t.a);
    }
    check(switches==1,"last corner completes both sides");
    check(large==static_cast<int>(n),"initial edges distributed once among all corners");
    near(ink,r.metrics.drawing_length,1e-8,"actual drawing length accounted");
    near(lifted,r.metrics.lifted_length,1e-8,"all lifted relocations accounted");
    near(area,r.metrics.footprint_sum,1e-7,"area follows actual strokes");
    check(to_json(r).find("\"cornerZigzag\":true")!=std::string::npos,"mode exported in JSON");
}
// Independent exhaustive oracle for arm orientation, with the chosen side and
// corner order fixed. Unlike the optimizer, this enumerates every direction.
void check_orientation_optimum(const Result& r) {
    double shortest=std::numeric_limits<double>::infinity();
    const auto search=[&](const auto& self,std::size_t i,Vec previous,double total)->void {
        if(i==r.strokes.size()) { shortest=std::min(shortest,total); return; }
        const auto& t=r.strokes[i];
        self(self,i+1,t.b,total+(i?distance(previous,t.a):0));
        if(t.stage!=0) self(self,i+1,t.a,total+(i?distance(previous,t.b):0));
    };
    search(search,0,{},0);
    near(r.metrics.lifted_length,shortest,1e-8,"orientation agrees with exhaustive search for fixed order");
}
int main() {
    try {
        for(const auto& sample:samples()) for(auto method:{Method::Improved,Method::Reference}) {
            const auto r=cover(sample.vertices,method);
            check(!r.strokes.empty(),"strokes generated");
            check(std::isfinite(r.metrics.overlap_ratio) && r.metrics.overlap_ratio>=1,"finite overlap");
            check(r.metrics.effective_area<r.metrics.polygon_area,"corner margins excluded");
            for(const auto& t:r.strokes) {
                check(t.radius>=7,"minimum radius respected");
                // A disk swept along an endpoint segment stays inside a convex polygon
                // exactly when both endpoint disks satisfy every edge's half plane.
                for(std::size_t i=0;i<r.vertices.size();++i) {
                    const auto a=r.vertices[i], e=r.vertices[(i+1)%r.vertices.size()]-a;
                    for(const auto q:{t.a,t.b}) check(cross(e,q-a)/length(e)>=t.radius-1e-7,"capsule contained");
                }
            }
            check_coverage(r,7);
            auto scaled=sample.vertices; for(auto& p:scaled) p=p*10;
            auto bigger=cover(scaled,method,{70,Precision::Continuous});
            near(bigger.metrics.overlap_ratio,r.metrics.overlap_ratio,1e-10,"scale invariant overlap at fixed brush ratio");
            near(bigger.metrics.drawing_ratio,r.metrics.drawing_ratio,1e-10,"scale invariant drawing ratio");
            std::reverse(scaled.begin(),scaled.end());
            // Reverse triangle winding; trapezoids use a designated parallel edge pair.
            if(scaled.size()==3) near(cover(scaled,method,{70}).metrics.overlap_ratio,bigger.metrics.overlap_ratio,1e-10,"winding invariant");
        }
        for(const auto& sample:samples()) {
            const auto base=cover(sample.vertices,Method::Improved);
            const auto zig=cover(sample.vertices,Method::Improved,{7,Precision::Continuous,true});
            check_zigzag(sample.vertices,7);
            check_orientation_optimum(zig);
            check(zig.metrics.drawing_length+zig.metrics.lifted_length<base.metrics.drawing_length+base.metrics.lifted_length,"sample zig-zag total travel reduced");
            check_zigzag(sample.vertices,7,Precision::OriginalRadiusRules);
            check(to_json(cover(sample.vertices,Method::Reference))==to_json(cover(sample.vertices,Method::Reference,{7,Precision::Continuous,true})),"reference unchanged by option");
        }
        // Independent closed-form oracle: a 300-400-500 right triangle has
        // perimeter 1200 and inradius 100. At minimum brush radius r, the inset
        // perimeter is 1200*(1-r/100). V arms telescope to that same length;
        // the reference stamps contribute no drawing travel before its border.
        const std::vector<Vec> right_triangle{{0,0},{300,0},{0,400}};
        for(double minimum:{1.0,7.0,20.0,50.0})
            for(auto precision:{Precision::Continuous,Precision::OriginalRadiusRules})
                for(auto method:{Method::Improved,Method::Reference}) for(bool zigzag:{false,true}) {
                    const auto audit=cover(right_triangle,method,{minimum,precision,zigzag});
                    near(audit.metrics.perimeter,1200,1e-9,"3-4-5 triangle perimeter is 1200");
                    near(audit.metrics.drawing_length,1200-12*minimum,1e-8,"drawing length matches independent inset perimeter formula");
                    near(audit.metrics.drawing_ratio,1-minimum/100,1e-11,"normalized drawing length excludes lifted travel");
                    if(minimum==7) near(audit.metrics.drawing_ratio*100,93,1e-9,"known 3-4-5 triangle drawing percentage is 93 percent");
                }
        const double s=300, h=std::sqrt(3.0)*s/2;
        const std::vector<Vec> equilateral{{0,0},{s,0},{s/2,h}};
        const auto r=cover(equilateral,Method::Improved,{1});
        check_zigzag(equilateral,1);
        const auto same_size=cover(equilateral,Method::Improved,{r.initial_radius,Precision::Continuous,true});
        check(same_size.strokes.size()==cover(equilateral,Method::Improved,{r.initial_radius}).strokes.size(),"maximum equals minimum preserves base capsules");
        near(r.initial_radius,h/6,1e-10,"equilateral initial radius");
        const auto& t=r.strokes[3];
        near(t.radius,r.initial_radius/4,1e-10,"V radius recurrence");
        near(r.metrics.polygon_area,s*h/2,1e-9,"triangle area");
        near(r.metrics.effective_area,s*h/2-3*(std::sqrt(3.0)-pi/3),1e-9,"effective area formula");
        const auto legacy=cover(equilateral,Method::Improved,{1,Precision::OriginalRadiusRules});
        near(legacy.initial_radius,std::floor(h/6),0,"original triangle initial radius truncation");
        near(legacy.strokes[3].radius,std::floor(legacy.initial_radius/4),1e-10,"original corner radius truncation");
        rejects([]{cover({{0,0},{1,1},{2,2}},Method::Improved);});
        rejects([]{cover({{0,0},{0,0},{200,300}},Method::Improved);});
        rejects([]{cover(samples()[0].vertices,Method::Improved,{0});});
        rejects([]{cover(samples()[0].vertices,Method::Reference,{10000});});
        rejects([]{cover(samples()[0].vertices,Method::Improved,{std::numeric_limits<double>::quiet_NaN()});});
        rejects([]{cover({{0,0},{200,0},{90,20},{0,200}},Method::Improved);});
        rejects([]{cover({{0,0},{200,0},{170,200},{10,180}},Method::Improved);});
        const auto rectangle=cover({{0,0},{400,0},{400,200},{0,200}},Method::Improved,{1});
        near(rectangle.metrics.polygon_area,80000,1e-8,"trapezoid area");
        check_zigzag({{40,50},{540,50},{540,430},{40,430}},1);
        check_zigzag({{100,60},{410,60},{550,420},{35,420}},7);
        check_zigzag(equilateral,r.initial_radius);
        std::mt19937 generator(20261121);
        std::uniform_real_distribution<double> x(35,565), y(45,435);
        int accepted=0;
        for(int attempt=0;attempt<300 && accepted<40;++attempt) {
            const std::vector<Vec> triangle{{x(generator),y(generator)},{x(generator),y(generator)},{x(generator),y(generator)}};
            Result a,b;
            try { a=cover(triangle,Method::Improved,{1}); b=cover(triangle,Method::Reference,{1}); }
            catch(const std::invalid_argument&) {continue;}
            check_coverage(a,1); check_coverage(b,1); check_zigzag(triangle,1); ++accepted;
        }
        check(accepted==40,"deterministic triangle coverage sample completed");
        int accepted_trapezoids=0;
        for(int attempt=0;attempt<400 && accepted_trapezoids<40;++attempt) {
            const double top=45+std::fmod(x(generator),80),bottom=330+std::fmod(y(generator),100);
            const std::vector<Vec> trapezoid{{100+std::fmod(x(generator),80),top},{360+std::fmod(x(generator),100),top},{470+std::fmod(x(generator),90),bottom},{30+std::fmod(x(generator),60),bottom}};
            try {cover(trapezoid,Method::Improved,{1});} catch(const std::invalid_argument&) {continue;}
            check_zigzag(trapezoid,1); ++accepted_trapezoids;
        }
        check(accepted_trapezoids==40,"deterministic trapezoid coverage sample completed");
        std::cout<<checks<<" geometry, coverage and metric checks passed.\n";
    } catch(const std::exception& e) { std::cerr<<e.what()<<'\n'; return 1; }
}
