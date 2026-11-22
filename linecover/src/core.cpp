#include "linecover/core.hpp"
#include <algorithm>
#include <cmath>
#include <iomanip>
#include <limits>
#include <sstream>
#include <stdexcept>

namespace linecover {
Vec operator+(Vec a, Vec b) { return {a.x+b.x, a.y+b.y}; }
Vec operator-(Vec a, Vec b) { return {a.x-b.x, a.y-b.y}; }
Vec operator*(Vec a, double k) { return {a.x*k, a.y*k}; }
double dot(Vec a, Vec b) { return a.x*b.x+a.y*b.y; }
double cross(Vec a, Vec b) { return a.x*b.y-a.y*b.x; }
double length(Vec a) { return std::hypot(a.x,a.y); }
double distance(Vec a, Vec b) { return length(a-b); }
static Vec unit(Vec a) { return a*(1/length(a)); }
static Vec normal(Vec a, Vec b) { const auto u=unit(b-a); return {-u.y,u.x}; }
double point_segment_distance(Vec p, Vec a, Vec b) {
    const auto v=b-a;
    const double d=dot(v,v);
    return distance(p,a+v*(d>0 ? std::clamp(dot(p-a,v)/d,0.0,1.0) : 0));
}
bool inside(const std::vector<Vec>& p, Vec q, double tol) {
    double sign=0;
    for (std::size_t i=0; i<p.size(); ++i) {
        const double c=cross(p[(i+1)%p.size()]-p[i],q-p[i]);
        if (std::abs(c)<=tol) continue;
        if (sign*c<0) return false;
        sign=c;
    }
    return true;
}
const std::array<Sample,4>& samples() {
    static const std::array<Sample,4> values{{
        {"triangle", {{110,400},{500,400},{270,65}}},
        {"slender", {{70,350},{550,350},{145,170}}},
        {"acute", {{80,410},{540,410},{470,90}}},
        {"trapezoid", {{170,100},{430,100},{530,400},{70,400}}}
    }};
    return values;
}
static double lifted_travel(const std::vector<Stroke>& strokes) {
    double total=0;
    for(std::size_t i=1;i<strokes.size();++i) total+=distance(strokes[i-1].b,strokes[i].a);
    return total;
}
// Orient each arm to minimize lifted travel for a fixed side/corner order.
// Initial large edges always arrive at their corner. The two-state dynamic
// program chooses which endpoint to enter for each remaining capsule.
static std::vector<Stroke> orient_arms(std::vector<Stroke> strokes) {
    const auto count=strokes.size();
    std::vector<std::array<double,2>> cost(count);
    std::vector<std::array<int,2>> parent(count);
    const double infinity=std::numeric_limits<double>::infinity();
    auto start=[](const Stroke& t,int flipped) { return flipped?t.b:t.a; };
    auto end=[](const Stroke& t,int flipped) { return flipped?t.a:t.b; };
    cost[0]={0,strokes[0].stage==0?infinity:0};
    for(std::size_t i=1;i<count;++i) for(int next=0;next<2;++next) {
        cost[i][next]=infinity;
        if(next && strokes[i].stage==0) continue;
        for(int previous=0;previous<2;++previous) {
            const double candidate=cost[i-1][previous]+distance(end(strokes[i-1],previous),start(strokes[i],next));
            if(candidate<cost[i][next]) { cost[i][next]=candidate; parent[i][next]=previous; }
        }
    }
    int flipped=cost.back()[1]<cost.back()[0]?1:0;
    for(std::size_t i=count;i-->0;) {
        if(flipped) std::swap(strokes[i].a,strokes[i].b);
        if(i) flipped=parent[i][flipped];
    }
    return strokes;
}
// Keep the original capsules and radius recurrence. Finish one side down to
// the smallest brush, then return along the other side from small to large,
// like tracing the two sides of a simple Christmas tree.
static std::vector<Stroke> corner_zigzag(const Result& original) {
    const int n=static_cast<int>(original.vertices.size());
    std::vector<Stroke> best;
    double best_length=std::numeric_limits<double>::infinity();
    // A shared boundary direction assigns each large initial edge exactly once.
    // Compare both directions and every corner order (12 / 48 candidates).
    for(int direction=0;direction<2;++direction) {
        std::vector<std::vector<Stroke>> groups(n);
        for(int corner=0;corner<n;++corner) {
            auto& group=groups[corner];
            const int first_side=direction?0:1;
            auto large=original.strokes[direction?corner:(corner+n-1)%n];
            if(direction) std::swap(large.a,large.b);
            large.corner=corner; large.side=first_side;
            group.push_back(large);
            std::array<std::vector<Stroke>,2> arms;
            int arm=0;
            for(auto t:original.strokes) if(t.stage==1 && t.corner==corner) {
                t.side=arm++%2;
                arms[t.side].push_back(t);
            }
            const auto& inward=arms[first_side];
            group.insert(group.end(),inward.begin(),inward.end());
            const auto& outward=arms[1-first_side];
            group.insert(group.end(),outward.rbegin(),outward.rend());
        }
        std::vector<int> order;
        for(int i=0;i<n;++i) order.push_back(i);
        do {
            std::vector<Stroke> candidate;
            candidate.reserve(original.strokes.size());
            for(int corner:order) candidate.insert(candidate.end(),groups[corner].begin(),groups[corner].end());
            candidate=orient_arms(std::move(candidate));
            const double total=lifted_travel(candidate);
            if(total<best_length) { best_length=total; best=std::move(candidate); }
        } while(std::next_permutation(order.begin(),order.end()));
    }
    return best;
}
Result cover(const std::vector<Vec>& input, Method method, Options options) {
    if (input.size()!=3 && input.size()!=4) throw std::invalid_argument("shape");
    if (!std::isfinite(options.minimum_radius) || options.minimum_radius<=0) throw std::invalid_argument("radius");
    Result out;
    out.vertices=input; out.method=method;
    auto& p=out.vertices;
    const auto n=p.size();
    for (auto q:p) if (!std::isfinite(q.x) || !std::isfinite(q.y) || std::abs(q.x)>1e8 || std::abs(q.y)>1e8) throw std::invalid_argument("coordinates");
    double signed_area=0;
    for (std::size_t i=0;i<n;++i) signed_area+=cross(p[i]-p[0],p[(i+1)%n]-p[0]);
    if (signed_area<0) {
        // Preserve vertex 0 and the trapezoid's chosen pair of parallel edges.
        if (n==3) std::swap(p[1],p[2]);
        else { std::swap(p[0],p[1]); std::swap(p[2],p[3]); }
        signed_area=-signed_area;
    }
    auto& m=out.metrics;
    m.polygon_area=signed_area/2;
    if (!(m.polygon_area>1e-6)) throw std::invalid_argument("degenerate");
    double longest=0;
    for (std::size_t i=0;i<n;++i) {
        const auto e=p[(i+1)%n]-p[i];
        longest=std::max(longest,length(e));
        if (length(e)<1e-6 || cross(e,p[(i+2)%n]-p[(i+1)%n])<=1e-10*m.polygon_area) throw std::invalid_argument("convex");
        m.perimeter+=length(e);
    }
    if (m.polygon_area/(longest*longest)<1e-5) throw std::invalid_argument("degenerate");
    std::vector<double> angle(n);
    std::vector<Vec> bisector(n);
    double corner_coefficient=0;
    for (std::size_t i=0;i<n;++i) {
        const auto u=unit(p[(i+1)%n]-p[i]), v=unit(p[(i+n-1)%n]-p[i]);
        angle[i]=std::atan2(std::abs(cross(u,v)),dot(u,v));
        bisector[i]=unit(u+v)*(1/std::sin(angle[i]/2));
        corner_coefficient+=1/std::tan(angle[i]/2)-(pi-angle[i])/2;
    }
    auto center=[&](std::size_t i,double r) { return p[i]+bisector[i]*r; };
    double max_radius=2*m.polygon_area/m.perimeter;
    if (n==4) {
        const auto base=p[1]-p[0], other=p[2]-p[3];
        if (std::abs(cross(base,other))>1e-8*length(base)*length(other)) throw std::invalid_argument("trapezoid");
        max_radius=std::abs(cross(base,p[3]-p[0]))/length(base)/2;
    }
    double initial=max_radius/2;
    const bool original=options.precision==Precision::OriginalRadiusRules;
    if (original) {
        if (options.minimum_radius<1 || std::floor(options.minimum_radius)!=options.minimum_radius) throw std::invalid_argument("integer_radius");
        initial=n==3 ? std::floor(initial) : std::floor(max_radius/2)+1;
    }
    const double rmin=options.minimum_radius;
    if (initial<rmin || rmin<=longest*1e-6) throw std::invalid_argument("brush_fit");
    // Some sharply tapering trapezoids lose an offset edge. They are outside this implementation's domain.
    for (double r:{initial,rmin,max_radius}) for (std::size_t i=0;i<n;++i) {
        const auto c=center(i,r);
        for (std::size_t j=0;j<n;++j) if (dot(c-p[j],normal(p[j],p[(j+1)%n]))<r-longest*1e-8) throw std::invalid_argument("brush_fit");
    }
    m.effective_area=m.polygon_area-rmin*rmin*corner_coefficient;
    if (!(m.effective_area>0)) throw std::invalid_argument("brush_fit");
    auto add=[&](Vec a,Vec b,double r,int stage,int corner) {
        if (out.strokes.size()>=4096) throw std::invalid_argument("step_limit");
        if (!std::isfinite(r) || r<=0 || !std::isfinite(a.x+a.y+b.x+b.y)) throw std::invalid_argument("numeric");
        const double d=distance(a,b);
        m.footprint_sum+=2*r*d+pi*r*r;
        m.drawing_length+=d;
        if (!out.strokes.empty()) m.lifted_length+=distance(out.strokes.back().b,a);
        out.strokes.push_back({a,b,r,stage,corner});
    };
    if (method==Method::Improved) {
        out.initial_radius=initial;
        for (std::size_t i=0;i<n;++i) add(center(i,initial),center((i+1)%n,initial),initial,0,-1);
        for (std::size_t i=0;i<n;++i) {
            double previous=initial;
            Vec previous_center=center(i,previous);
            for (int iteration=0;iteration<128;++iteration) {
                double r=previous*(1-std::sin(angle[i]/2))/2;
                if (original) r=n==3 ? std::floor(r) : std::round(r);
                r=std::max(rmin,r);
                const auto middle=center(i,r);
                const auto right=previous_center-normal(p[i],p[(i+1)%n])*(previous-r);
                const auto left=previous_center-normal(p[(i+n-1)%n],p[i])*(previous-r);
                add(right,middle,r,1,static_cast<int>(i));
                add(middle,left,r,1,static_cast<int>(i));
                if (r<=rmin) break;
                previous=r; previous_center=middle;
                if (iteration==127) throw std::invalid_argument("step_limit");
            }
        }
    } else {
        out.initial_radius=max_radius;
        auto next_radius=[](double r,double a,double minimum) {
            const double t=1/std::tan(a/2);
            const double d=r*t+std::sqrt(std::max(0.0,4*r*minimum-4*minimum*minimum));
            const double e=t*t, f=2*d*t+4*minimum, g=d*d+4*minimum*minimum;
            return (f+std::sqrt(std::max(0.0,f*f-4*e*g)))/(2*e);
        };
        if (n==3) {
            for (std::size_t i=0;i<n;++i) {
                add(center(i,rmin),center(i,rmin),rmin,0,static_cast<int>(i));
                double r=2*rmin/(1-std::sin(angle[i]/2));
                if (original) r=std::round(r);
                while (r<max_radius) {
                    add(center(i,r),center(i,r),r,0,static_cast<int>(i));
                    const double next=next_radius(r,angle[i],rmin);
                    if (!(next>r*(1+1e-12))) throw std::invalid_argument("numeric");
                    r=next;
                }
            }
            add(center(0,max_radius),center(0,max_radius),max_radius,0,-1);
        } else {
            const double a=*std::min_element(angle.begin(),angle.end());
            double r=2*rmin/(1-std::sin(a/2));
            while (r<max_radius) {
                add(center(0,r),center(1,r),r,0,-1);
                add(center(3,r),center(2,r),r,0,-1);
                const double next=next_radius(r,a,rmin);
                if (!(next>r*(1+1e-12))) throw std::invalid_argument("numeric");
                r=next;
            }
            add(center(0,max_radius),center(1,max_radius),max_radius,0,-1);
        }
        for (std::size_t i=0;i<n;++i) add(center(i,rmin),center((i+1)%n,rmin),rmin,2,-1);
    }
    if(options.corner_zigzag && method==Method::Improved) {
        out.strokes=corner_zigzag(out);
        out.corner_zigzag=true;
        m.lifted_length=lifted_travel(out.strokes);
    }
    m.overlap_ratio=m.footprint_sum/m.effective_area;
    m.drawing_ratio=m.drawing_length/m.perimeter;
    return out;
}
std::string to_json(const Result& r) {
    std::ostringstream s; s<<std::setprecision(15);
    const auto& m=r.metrics;
    s<<"{\"method\":\""<<(r.method==Method::Improved?"improved":"reference")<<"\",\"cornerZigzag\":"<<(r.corner_zigzag?"true":"false")<<",\"vertices\":[";
    for (std::size_t i=0;i<r.vertices.size();++i) { if(i) s<<','; s<<'['<<r.vertices[i].x<<','<<r.vertices[i].y<<']'; }
    s<<"],\"initialRadius\":"<<r.initial_radius<<",\"metrics\":{\"polygonArea\":"<<m.polygon_area<<",\"effectiveArea\":"<<m.effective_area<<",\"perimeter\":"<<m.perimeter<<",\"footprintSum\":"<<m.footprint_sum<<",\"drawingLength\":"<<m.drawing_length<<",\"liftedLength\":"<<m.lifted_length<<",\"overlapRatio\":"<<m.overlap_ratio<<",\"drawingRatio\":"<<m.drawing_ratio<<"},\"strokes\":[";
    auto write_strokes=[&](const std::vector<Stroke>& strokes) {
        for(std::size_t i=0;i<strokes.size();++i) {
            const auto& t=strokes[i]; if(i) s<<',';
            s<<"{\"a\":["<<t.a.x<<','<<t.a.y<<"],\"b\":["<<t.b.x<<','<<t.b.y<<"],\"radius\":"<<t.radius<<",\"stage\":"<<t.stage<<",\"corner\":"<<t.corner<<",\"side\":"<<t.side<<'}';
        }
    };
    write_strokes(r.strokes);
    s<<"]}"; return s.str();
}
}
