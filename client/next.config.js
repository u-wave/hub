exports.webpack = (config) => {
  config.module.rules.push({
    test: /\.js$/,
    include: [
      /strip-indent/,
      /material-ui\/es/,
      /material-ui-icons\/es/,
    ],
    use: {
      loader: 'babel-loader',
      query: {
        babelrc: false,
        presets: ['@babel/preset-env']
      }
    }
  })

  Object.assign(config.resolve.alias, {
    'material-ui': 'material-ui/es',
    'material-ui-icons': 'material-ui-icons/es',
  })

  return config
}

exports.exportPathMap = () => ({
  '/': { page: '/' }
})
