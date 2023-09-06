module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended', 'prettier/@typescript-eslint'],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    rules: {
        indent: ['error', 4],
        'no-undef': 'off',
        'prefer-template': 'off',
        'operator-linebreak': ['off'],
        'comma-dangle': ['error', 'never'],
        'no-console': ['error'],
        'no-trailing-spaces': 'error',
        'no-var': 'error',
        'prefer-const': 'error',
        'space-before-function-paren': [
            'error',
            {
                anonymous: 'always',
                asyncArrow: 'always',
                named: 'never'
            }
        ]
    }
};
