module.exports = {
  // "parser": "babel-eslint",
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  // "installedESLint": true,
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      // "jsx": true
    },
    "sourceType": "module"
  },
  // "plugins": [
  //   "react" 
  // ],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single",
      { "allowTemplateLiterals": true }
    ],
    "semi": [
      "error",
      "never"
    ],
    "no-unused-vars": "error",
    "no-console": 0
  }
}