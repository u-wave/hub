exports.webpack = (config) => {
  config.module.rules.push({
    test: /\.js$/,
    include: [
      /strip-indent/
    ],
    use: {
      loader: 'babel-loader',
      query: {
        babelrc: false,
        presets: ['env']
      }
    }
  })

  return config
}
