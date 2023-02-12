module.exports = {
  env: {
    es2021: true,
    node: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    project: 'tsconfig.json'
  },
  rules: {
    '@typescript-eslint/strict-boolean-expressions': ['off'],
    '@typescript-eslint/ban-types': ['error', {
      types: {
        Object: false
      },
      extendDefaults: true
    }]
  }
}
