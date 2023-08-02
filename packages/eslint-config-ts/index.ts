import type { ESLint } from "eslint"
import process from "node:process"

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
    },
  ],
  ignorePatterns: ["node_modules/", "dist/", "build/", "coverage/"],
  rules: {
    // eslint
    "comma-dangle": [2, "only-multiline"],
    "object-shorthand": 1,
    "no-unused-vars": [
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

    // prettier
    "prettier/prettier": [
      1,
      {
        trailingComma: "all",
        tabWidth: 2,
        semi: false,
        singleQuote: false,
        endOfLine: "auto",
      },
    ],

    // import
    "import/no-unresolved": 0,
    "import/no-extraneous-dependencies": [
      2,
      {
        devDependencies: [
          "**/*.test.*",
          "**/*.stories.*",
          "**/*.config.*",
          "**/*.spec.*",
        ],
      },
    ],

    // unused-imports
    "unused-imports/no-unused-imports": 2,
  },
} satisfies ESLint.ConfigData
