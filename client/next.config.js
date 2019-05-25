exports.target = 'serverless'

exports.webpack = (config) => {
  config.module.rules.push({
    test: /\.js$/,
    include: [
      /strip-indent/,
      /@material-ui\/.*?\/es/
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
    '@material-ui/core': '@material-ui/core/es'
  })

  return config
}

exports.exportPathMap = () => ({
  '/': { page: '/' }
})
