const { EnvironmentPlugin, ProvidePlugin } = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
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
  output: {
    filename: '[contenthash:7].js',
    chunkFilename: '[chunkhash:7].js',
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
      },
      {
        test: /\.css/,
        use: [
          MiniCssExtractPlugin.loader || 'style-loader',
          'css-loader',
        ],
      }
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
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
    new MiniCssExtractPlugin({
      filename: '[contenthash:7].css',
      chunkFilename: '[chunkhash:7].css',
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
