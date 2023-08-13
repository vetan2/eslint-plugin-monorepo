import type { ESLint } from "eslint";

export = {
  plugins: ["react", "react-hooks"],
  extends: [
    "@vetan2/ts",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  rules: {
    "react/react-in-jsx-scope": 0,
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "react/jsx-curly-brace-presence": [
      1,
      {
        props: "never",
        children: "never",
      },
    ],
    "react/prop-types": 0,
    "react/require-default-props": 0,
  },
} satisfies ESLint.ConfigData;
