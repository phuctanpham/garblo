module.exports = {
  root: true,
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  overrides: [
    {
      files: ["worker-configuration.d.ts"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off"
      }
    }
  ]
};
