module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: false,
      targets: {
        esmodules: true,
      },
      bugfixes: true,
    }],
    ['@babel/preset-react', {
      runtime: 'automatic',
    }],
  ],
};
