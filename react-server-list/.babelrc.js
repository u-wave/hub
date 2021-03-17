const pkg = require('./package.json');

module.exports = (api) => {
  api.cache.never();

  const envOptions = {
    modules: false,
    loose: true,
  };

  if (process.env.NODE_ENV === 'test') {
    envOptions.modules = 'commonjs'
    envOptions.targets = { node: 'current' }
  }

  return {
    presets: [
      ['@babel/env', envOptions],
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
