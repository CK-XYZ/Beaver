const eslintPluginJest = require('eslint-plugin-jest');

module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        setTimeout: 'readonly',
        setImmediate: 'readonly',
        window: 'readonly',
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'readonly',
        global: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['**/*.test.js', '**/*.spec.js'],
    ...eslintPluginJest.configs['flat/recommended'],
    rules: {
      ...eslintPluginJest.configs['flat/recommended'].rules,
      'jest/expect-expect': 'warn',
    },
  },
];
