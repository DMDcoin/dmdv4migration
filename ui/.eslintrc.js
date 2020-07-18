module.exports = {
    env: {
      browser: true,
      mocha: true,
    },
    extends: ['airbnb', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {},
      },
    },
    rules: {
      'no-console': 0,
      'no-param-reassign': [1, { "props": false }],
      'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
      'import/no-extraneous-dependencies': [2, { devDependencies: ['**/test.tsx', '**/test.ts'] }],
      '@typescript-eslint/indent': [2, 2],
      '@typescript-eslint/no-use-before-define': 0,
      // TODO: Eliminate by refining global property injection.
      '@typescript-eslint/no-non-null-assertion': 0,
    },
  };