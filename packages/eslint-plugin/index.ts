import typescriptConfig from "@vetan2/eslint-config-ts";
import baseConfig from "@vetan2/eslint-config-base";
import reactConfig from "@vetan2/eslint-config-react";
import type { ESLint } from "eslint";

export = {
  configs: {
    base: baseConfig,
    ts: typescriptConfig,
    react: reactConfig,
  },
} satisfies ESLint.Plugin;
