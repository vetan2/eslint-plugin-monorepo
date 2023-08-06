import type { ESLint } from "eslint";
import process from "node:process";

export = {
  extends: ["@vetan2/base"],
  overrides: [
    {
      parserOptions: {
        tsconfigRootDir: process.cwd(),
        project: ["tsconfig.json"],
      },
      parser: "@typescript-eslint/parser",
      files: ["*.ts", "*.tsx"],
      plugins: ["@typescript-eslint"],
      rules: {
        // eslint
        "object-shorthand": 1,
        "no-unused-vars": 0,
        "@typescript-eslint/no-unused-vars": [
          1,
          {
            ignoreRestSiblings: true,
            vars: "all",
            args: "after-used",
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
          },
        ],
        "no-param-reassign": [
          2,
          {
            props: true,
            ignorePropertyModificationsForRegex: ["^draft$", "Draft$"],
          },
        ],
        camelcase: [1, { allow: ["^\\w*_[A-Z]*$"] }],
        "no-var": 2,
      },
    },
  ],
} satisfies ESLint.ConfigData;
