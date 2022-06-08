const pkg = require('./package.json');

module.exports = (api) => {
  api.cache.never();

  return {
    targets: {
      esmodules: true,
    },
    presets: [
      ['@babel/env', { modules: false }],
      ['@babel/react', { runtime: 'automatic' }],
    ],
    plugins: [
      '@babel/transform-react-constant-elements',
      ['@babel/transform-runtime', {
        version: pkg.dependencies['@babel/runtime'],
      }],
      ['transform-react-remove-prop-types', { mode: 'wrap' }],
    ],
  };
}
