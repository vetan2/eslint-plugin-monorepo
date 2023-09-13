import typescriptConfig from "@vetan2/eslint-config-ts";
import baseConfig from "@vetan2/eslint-config-base";
import reactConfig from "@vetan2/eslint-config-react";
import rules from "./rules";

export = {
  configs: {
    base: baseConfig,
    ts: typescriptConfig,
    react: reactConfig,
  },
  rules,
};
