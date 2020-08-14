const { EnvironmentPlugin, ProvidePlugin } = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  context: __dirname + '/src',
  entry: {
    polyfills: [
      'whatwg-fetch',
      'event-source-polyfill',
    ],
    app: {
      import: './app.js',
      dependOn: 'polyfills',
    },
  },
  module: {
    rules: [
      {
        test: /\.png$/,
        use: 'file-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      }
    ],
  },
  resolve: {
    alias: {
      path: require.resolve('path-browserify'),
    },
  },
  plugins: [
    new ProvidePlugin({
      process: 'process',
    }),
    new EnvironmentPlugin({
      HUB_SERVER: 'https://announce.u-wave.net/',
    }),
    new HtmlPlugin({
      template: 'index.html',
      inject: true,
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ],
};
