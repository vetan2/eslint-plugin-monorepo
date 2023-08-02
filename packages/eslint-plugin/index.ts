import { ESLint } from "eslint"
import { typescriptConfig } from "@vetan2/eslint-config-ts"

export = {
  configs: {
    ts: typescriptConfig,
  },
} satisfies ESLint.Plugin
