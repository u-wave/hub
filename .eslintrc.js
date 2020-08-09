module.exports = {
  extends: 'airbnb-base',

  rules: {
    // MongoDB IDs
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    // I disagree that this is bad
    'max-classes-per-file': 'off',
  },

  overrides: [
    {
      files: ['server/src/*.js', 'plugin/src/*.js'],
      rules: {
        // Allow `for..of` in server-side code
        'no-restricted-syntax': [
          'error',
          {
            selector: 'ForInStatement',
            message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
          },
          {
            selector: 'LabeledStatement',
            message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
          },
          {
            selector: 'WithStatement',
            message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
          },
        ],
      },
    },

    {
      files: ['client/**/*.js'],
      parser: '@babel/eslint-parser',
      rules: {
        'react/jsx-filename-extension': 'off',
        'react/no-unused-prop-types': ['error', { skipShapeProps: true }],
        'react/forbid-prop-types': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/require-default-props': 'off',
        'react/static-property-placement': 'off',
        'react/jsx-one-expression-per-line': 'off',
      },
    },
  ],
};
