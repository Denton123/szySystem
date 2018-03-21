// http://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    env: {
        es6: true,
        commonjs: true,
        browser: true,
    },
    extends: [
        // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
        'standard',
        // https://github.com/feross/eslint-config-standard-react
        'standard-react'
    ],
    // https://github.com/yannickcr/eslint-plugin-react
    plugins: [
        'react',
        'babel',
        'promise'
    ],
    globals: {
        '__DEV__': true,
        '__PROD__': true,
        '__COMPONENT_DEVTOOLS__': false,
        '__WHY_DID_YOU_UPDATE__': false
    },
    // add your custom rules here
    'rules': {
        'indent': ['error', 4, { 'SwitchCase': 1 }],
        'space-before-function-paren': ['error', 'never'],
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'react/jsx-indent': ['error', 4],
        'react/jsx-indent-props': ['error', 4],
        'react/prop-types': [0],
        'react/self-closing-comp': ['error', {
            'component': true,
            'html': true
        }],
        'jsx-quotes': ["error", "prefer-double"],
        // allow 未使用的变量
        'no-unused-vars': 0,
        // 允许使用未声明的变量，除非在/*global */注释中提及
        'no-undef': 0,
        'no-tabs': 0,
        'standard/no-callback-literal': 0,
        "comma-dangle": 'off',
        "no-console": 'off',
        "one-var": 0,
        "no-unneeded-ternary": 0,
        "no-unused-expressions": 0
    }
}
