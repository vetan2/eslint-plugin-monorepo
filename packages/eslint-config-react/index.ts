import type { ESLint } from "eslint";

export = {
  plugins: ["react", "react-hooks"],
  extends: [
    "@vetan2/ts",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
} satisfies ESLint.ConfigData;
