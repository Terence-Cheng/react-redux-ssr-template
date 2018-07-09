const path = require('path')

module.exports = {
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "globals": {
    "Mlink": false,
    "location": false,
    "filterXSS": false,
    "wx": false
  },
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "extends": "airbnb",
  "rules": {
    "semi": [0],
    "react/jsx-filename-extension": [0],
    "jsx-a11y/anchor-is-valid": [0],
    "react/require-default-props": [0],
    "react/forbid-prop-types": [0],
    "react/sort-comp": [0],
    "linebreak-style": [0],
    "func-names": [0],
    "no-console": [0],
    "radix": [0],
    "prefer-promise-reject-errors": [0],
    "no-unused-vars": [0],
    "indent": [0],
    "no-script-url": [0],
    "no-trailing-spaces": [0],
    "react/no-find-dom-node": [0],  // 以下全为1
    "dot-notation": [0],
    "react/jsx-one-expression-per-line": [0],
    "no-shadow": [0],
    "react/jsx-curly-spacing": [0],
    "spaced-comment": [0]
  },
  "settings": {
    "import/resolver": {
      "alias": {
        "map": [
          ["component", path.resolve(__dirname, '../client/component')],
        ],
        "extensions": [".ts", ".js", ".jsx", ".json"]
      }
    }
  }
}
