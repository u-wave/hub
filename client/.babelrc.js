module.exports = (api) => {
  api.cache.never()

  return {
    presets: [
      'next/babel'
    ],
    plugins: [
      'transform-inline-environment-variables'
    ]
  }
}
