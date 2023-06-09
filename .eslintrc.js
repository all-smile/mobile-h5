module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    // 'standard'
  ],
  // required to lint *.vue files
  plugins: [],
  // add your custom rules here
  rules: {
    // “off” or 0 - 关闭(禁用)规则 
    // “warn” or 1 - 将规则视为一个警告（并不会导致检查不通过） 
    // “error” or 2 - 将规则视为一个错误 (退出码为1，检查不通过)
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "prefer-promise-reject-errors": "off",
    "no-undef": "off",
    /* === */
    "eqeqeq": 0,
    /* 缩进 */
    "indent": 0,
    /* 
    before:
        ()=>
            sss
     now:
        ()=>sss
    */
    "implicit-arrow-linebreak": ["error", "beside"],
    /* fn ()====>fn() */
    "func-call-spacing": [0, "never"],
    /* 
    anonymous is for anonymous function expressions (e.g. function () {}).
    named is for named function expressions (e.g. function foo () {}).
    asyncArrow is for async arrow function expressions (e.g. async () => {}). 
    */
    "space-before-function-paren": [0, {
      "anonymous": "always",
      "named": "never",
      "asyncArrow": "always"
    }],
    "no-extend-native": 0,
    'no-useless-escape': 'off',
    'prefer-const': 0,
    'quote-props': 0,
    "no-unused-vars": 'off',
    'no-useless-catch': 0,
    "vue/return-in-computed-property": [0, {
      "treatUndefinedAsUnspecified": false
    }],
    "vue/no-unused-components": [0, {
      "ignoreWhenBindingPresent": true
    }],
    'object-curly-spacing': 0,
    'no-prototype-builtins': 0
  }
}

