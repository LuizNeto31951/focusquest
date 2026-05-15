const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
  '@/domain': path.resolve(__dirname, 'src/domain'),
  '@/application': path.resolve(__dirname, 'src/application'),
  '@/infrastructure': path.resolve(__dirname, 'src/infrastructure'),
  '@/presentation': path.resolve(__dirname, 'src/presentation'),
  '@/shared': path.resolve(__dirname, 'src/shared'),
};

module.exports = config;
