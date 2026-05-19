const { withAppBuildGradle, withDangerousMod } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

const JNI_CMAKE_CONTENT = `cmake_minimum_required(VERSION 3.13)
project(appmodules)

include(\${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)

# Fix libc++ ABI linker errors caused by OBJECT codegen libraries (react_codegen_*)
# not explicitly linking c++_shared. Adding it to appmodules resolves the symbols.
target_link_libraries(appmodules c++_shared)
`;

function withExternalNativeBuild(config) {
  return withAppBuildGradle(config, (mod) => {
    if (mod.modResults.contents.includes('externalNativeBuild')) return mod;
    mod.modResults.contents = mod.modResults.contents.replace(
      /(\n    androidResources \{[^}]*\}\n)/,
      '$1    externalNativeBuild {\n        cmake {\n            path "src/main/jni/CMakeLists.txt"\n            version "3.22.1"\n        }\n    }\n',
    );
    return mod;
  });
}

function withJniCMake(config) {
  return withDangerousMod(config, [
    'android',
    (mod) => {
      const jniDir = path.join(
        mod.modRequest.projectRoot,
        'android', 'app', 'src', 'main', 'jni',
      );
      fs.mkdirSync(jniDir, { recursive: true });
      fs.writeFileSync(path.join(jniDir, 'CMakeLists.txt'), JNI_CMAKE_CONTENT);
      return mod;
    },
  ]);
}

module.exports = function withAndroidNativeFix(config) {
  config = withExternalNativeBuild(config);
  config = withJniCMake(config);
  return config;
};
