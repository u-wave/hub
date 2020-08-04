exports.target = 'serverless'

exports.exportPathMap = () => ({
  '/': { page: '/' }
})

exports.env = {
  HUB_SERVER: process.env.HUB_SERVER || 'https://announce.u-wave.net'
}

exports.webpack = (config) => {
  Object.assign(config.resolve.alias, {
    '@material-ui/core': '@material-ui/core/esm',
    '@material-ui/icons': '@material-ui/icons/esm',
    '@material-ui/styles': '@material-ui/styles/esm'
  })

  return config
}
