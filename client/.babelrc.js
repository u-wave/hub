module.exports = (api) => {
  api.cache(true);

  return {
    presets: ['module:next/babel'],
  };
};
