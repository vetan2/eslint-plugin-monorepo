import type { ESLint } from "eslint";

export = {
  extends: ["@vetan2/ts"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      plugins: ["react", "react-hooks"],
      extends: [
        "@vetan2/ts",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
      ],
    },
  ],
} satisfies ESLint.ConfigData;
