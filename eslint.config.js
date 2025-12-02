const eslintPluginTypescript = require('@typescript-eslint/eslint-plugin')
const typescriptParser = require('@typescript-eslint/parser')

module.exports = [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTypescript,
    },
    rules: {
      ...eslintPluginTypescript.configs['eslint-recommended'].rules,
      ...eslintPluginTypescript.configs['recommended'].rules,
      'no-unused-vars': 'warn',
    },
  },
]
