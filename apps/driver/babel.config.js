module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // O plugin de worklets é obrigatório para o Reanimated 4 e precisa ser o último.
    plugins: ["react-native-worklets/plugin"],
  };
};
