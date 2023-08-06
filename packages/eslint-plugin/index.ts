import typescriptConfig from "@vetan2/eslint-config-ts";
import baseConfig from "@vetan2/eslint-config-base";
import type { ESLint } from "eslint";

export = {
  configs: {
    base: baseConfig,
    ts: typescriptConfig,
  },
} satisfies ESLint.Plugin;
