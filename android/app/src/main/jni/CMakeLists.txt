cmake_minimum_required(VERSION 3.13)
project(appmodules)

include(${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)

# Fix libc++ ABI linker errors caused by OBJECT codegen libraries (react_codegen_*)
# not explicitly linking c++_shared. Adding it to appmodules resolves the symbols.
target_link_libraries(appmodules c++_shared)
