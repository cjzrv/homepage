#pragma once
#include <array>
#include <cstddef>
#include <string>
#include <vector>

namespace linecover {
constexpr double pi = 3.14159265358979323846;
struct Vec { double x = 0, y = 0; };
Vec operator+(Vec a, Vec b);
Vec operator-(Vec a, Vec b);
Vec operator*(Vec a, double k);
double dot(Vec a, Vec b);
double cross(Vec a, Vec b);
double length(Vec a);
double distance(Vec a, Vec b);
struct Stroke {
    Vec a, b;
    double radius;
    int stage; // 0: initial fill; 1: V-shaped corner fill; 2: minimum-radius border
    int corner;
    int side = -1; // local outgoing (0) / incoming (1) side; -1 when not annotated
};
enum class Method { Improved, Reference };
enum class Precision { Continuous, OriginalRadiusRules };
struct Options {
    double minimum_radius = 7;
    Precision precision = Precision::Continuous;
    bool corner_zigzag = false;
};
struct Metrics {
    double polygon_area = 0, effective_area = 0, perimeter = 0;
    double footprint_sum = 0, drawing_length = 0, lifted_length = 0;
    double overlap_ratio = 0, drawing_ratio = 0;
};
struct Result {
    std::vector<Vec> vertices;
    std::vector<Stroke> strokes;
    Metrics metrics;
    double initial_radius = 0;
    Method method = Method::Improved;
    bool corner_zigzag = false;
};
struct Sample { const char* key; std::vector<Vec> vertices; };
const std::array<Sample, 4>& samples();
// Accepts nondegenerate triangles and convex trapezoids (parallel edges 0-1 / 2-3).
// Throws std::invalid_argument for invalid/unsupported geometry or an oversized brush.
Result cover(const std::vector<Vec>& polygon, Method method, Options options = {});
double point_segment_distance(Vec p, Vec a, Vec b);
bool inside(const std::vector<Vec>& polygon, Vec p, double tolerance = 1e-8);
std::string to_json(const Result& result);
}
