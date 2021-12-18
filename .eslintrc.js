const path = require('path');

module.exports = {
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 2021,
  },

  rules: {
    // MongoDB IDs
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    // I disagree that this is bad
    'max-classes-per-file': 'off',
  },

  overrides: [
    {
      files: ['server/src/*.js', 'plugin/src/*.js'],
      env: {
        node: true,
      },
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
      files: ['server/src/*.js'],
      parser: '@babel/eslint-parser',
      parserOptions: {
        requireConfigFile: false,
        ecmaVersion: 2021,
        babelOptions: {
          plugins: ['@babel/plugin-syntax-top-level-await'],
        },
      },
      rules: {
        'import/extensions': ['error', 'ignorePackages'],
      },
    },

    {
      extends: ['airbnb', 'airbnb/hooks'],
      files: ['client/**/*.js', 'react-server-list/src/**/*.js'],
      plugins: ['@babel/eslint-plugin'],
      parser: '@babel/eslint-parser',
      env: {
        browser: true,
      },
      rules: {
        'react/jsx-filename-extension': 'off',
        'react/no-unused-prop-types': ['error', { skipShapeProps: true }],
        'react/forbid-prop-types': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/require-default-props': 'off',
        'react/static-property-placement': 'off',
        'react/jsx-one-expression-per-line': 'off',
        'react/function-component-definition': ['error', {
          namedComponents: 'function-declaration',
          unnamedComponents: 'arrow-function',
        }],
      },
    },

    {
      files: ['client/**/*.js'],
      extends: ['next'],
      settings: {
        next: {
          rootDir: './client/',
        },
      },
    },

    {
      files: ['react-server-list/src/**/*.js'],
      parserOptions: {
        babelOptions: {
          configFile: path.join(__dirname, './react-server-list/.babelrc.js'),
        },
      },
    },

    {
      files: ['react-server-list/test/**/*.js'],
      env: {
        mocha: true,
      },
      rules: {
        'import/no-extraneous-dependencies': ['error', {
          devDependencies: true,
        }],
      },
    },
  ],
};
