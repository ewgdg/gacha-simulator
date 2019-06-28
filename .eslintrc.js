module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'prettier/vue',
    'plugin:prettier/recommended',
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'prettier'
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    // 'no-console': 'off'
  }
}
