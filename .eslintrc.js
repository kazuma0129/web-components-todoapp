module.exports = {
  extends: 'prettier',
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
  },
};
