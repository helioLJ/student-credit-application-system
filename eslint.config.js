const typescript = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");

module.exports = [
  {
    files: ["**/*.js", "**/*.ts"],  // This replaces the --ext option
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
    },
    rules: {
      // Your TypeScript-specific rules here
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-explicit-any": "error",
      // ... other rules
    },
    ignores: [
      // Add your ignore patterns here, for example:
      '**/node_modules/**',
      'build/**',
      // ... other patterns from your .eslintignore file
    ],
  },
  // You can add more configurations for other file types if needed
];