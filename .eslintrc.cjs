module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
    },
    plugins: ["@typescript-eslint", "unused-imports"],
    rules: {
        indent: ["error", 4],
        "linebreak-style": ["off", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "no-empty": "off",
        "no-unused-vars": "off",
        "unused-imports/no-unused-imports": "warn",
        "@typescript-eslint/ban-ts-comment": "off",
    },
};
