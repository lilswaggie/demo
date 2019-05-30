module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: { sourceType: 'module' },
  env: { browser: true, node: true, es6: true },
  extends: ['react-app', 'prettier'],
  rules: {
    indent: ['error', 2, { SwitchCase: 1, flatTernaryExpressions: false }],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-console': 'off',
    'no-useless-concat': 2,
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 禁止使用嵌套的三元表达式
    // 'no-nested-ternary': 'error'
  }
};
