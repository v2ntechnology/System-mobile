module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          /*
           * O zustand lê `import.meta.env.MODE` para detectar produção. No bundle
           * web isso vira `Uncaught SyntaxError: Cannot use 'import.meta' outside
           * a module`, porque o Metro serve script clássico. Esta opção do preset
           * reescreve a expressão; nada muda para iOS e Android.
           */
          unstable_transformImportMeta: true,
        },
      ],
    ],
  };
};
