const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
// Permite que o app reconheça a base de 33 plantas em arquivos .sql
config.resolver.sourceExts.push('sql');

module.exports = withNativeWind(config, { input: "./src/global.css" });