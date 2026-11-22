#include "linecover/core.hpp"
#include <fstream>
#include <iostream>
#include <stdexcept>

int main(int argc,char** argv) {
    try {
        linecover::Options options;
        auto polygon=linecover::samples()[0].vertices;
        auto method=linecover::Method::Improved;
        for (int i=1;i<argc;++i) {
            std::string arg=argv[i];
            if (arg=="--help") { std::cout<<"linecover-cli [--case triangle|slender|acute|trapezoid] [--method improved|reference] [--radius 7] [--original-radius-rules] [--corner-zigzag] [--input vertices.txt]\nOutput: JSON, with drawing and lifted travel reported separately.\n"; return 0; }
            if (arg=="--original-radius-rules") { options.precision=linecover::Precision::OriginalRadiusRules; continue; }
            if (arg=="--corner-zigzag") { options.corner_zigzag=true; continue; }
            if (++i>=argc) throw std::invalid_argument("missing argument");
            std::string value=argv[i];
            if (arg=="--case") {
                bool found=false;
                for (const auto& sample:linecover::samples()) if(value==sample.key) { polygon=sample.vertices; found=true; }
                if(!found) throw std::invalid_argument("unknown case");
            } else if(arg=="--method") {
                if(value!="improved" && value!="reference") throw std::invalid_argument("unknown method");
                method=value=="improved" ? linecover::Method::Improved : linecover::Method::Reference;
            } else if(arg=="--radius") {
                std::size_t end=0; options.minimum_radius=std::stod(value,&end);
                if(end!=value.size()) throw std::invalid_argument("radius");
            } else if(arg=="--input") {
                std::ifstream input(value); if(!input) throw std::invalid_argument("cannot open input");
                polygon.clear(); double x,y;
                while(input>>x) { if(!(input>>y)) throw std::invalid_argument("invalid vertices"); polygon.push_back({x,y}); }
                if(!input.eof()) throw std::invalid_argument("invalid vertices");
            } else throw std::invalid_argument("unknown option");
        }
        std::cout<<linecover::to_json(linecover::cover(polygon,method,options))<<'\n';
    } catch(const std::exception& e) { std::cerr<<"linecover: "<<e.what()<<'\n'; return 1; }
}
