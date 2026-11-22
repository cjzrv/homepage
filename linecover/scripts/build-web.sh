#!/usr/bin/env bash
set -euo pipefail
project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
command -v emcmake >/dev/null || { echo 'Activate Emscripten 4.0.20 with source /path/to/emsdk/emsdk_env.sh first.' >&2; exit 1; }
emcmake cmake -S "$project_dir" -B "$project_dir/build/web" -DCMAKE_BUILD_TYPE=Release "$@"
cmake --build "$project_dir/build/web" --parallel 4
node "$project_dir/scripts/package-web.mjs" "$project_dir/build/web"
