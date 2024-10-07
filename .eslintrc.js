module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:node/recommended',
      'plugin:express/recommended',
      'prettier/@typescript-eslint',
      'plugin:prettier/recommended',
    ],
    plugins: ['@typescript-eslint', 'node', 'express'],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
      'node/no-missing-import': ['error', {
        allowModules: [],
        resolvePaths: [__dirname],
        tryExtensions: ['.js', '.json', '.node', '.ts']
      }],
      'express/no-sync': 'error',
      'express/no-unused-vars': 'error',
    },
    settings: {
      node: {
        tryExtensions: ['.js', '.json', '.node', '.ts']
      }
    }
};