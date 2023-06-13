module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/no-mutating-props": "off",
    "vue/multi-word-component-names": "off",
    "no-unused-vars": "off",
    "vue/attributes-order": "error",
    "vue/no-confusing-v-for-v-if": "error",
    "vue/order-in-components": "error",
    "vue/this-in-template": "error",
    "vue/eqeqeq": "error",
    "vue/attribute-hyphenation": "error",
    "vue/html-end-tags": "error",
    "vue/html-quotes": "error",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
};
