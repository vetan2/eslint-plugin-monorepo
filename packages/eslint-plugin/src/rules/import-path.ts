import { existsSync, readFileSync } from "node:fs";
import { createRule } from "../utils";
import { dirname, join, relative } from "node:path";

const TS_CONFIG_FILE_NAMES = ["tsconfig.path.json", "tsconfig.json"];

/**
 * map에 path가 존재하는지 확인한다.
 * @param map 확인하려는 map
 * @param path 확인하려는 path
 * @returns path가 존재하면 true, 아니면 false
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const has = (map: Record<string, any>, path: string) => {
  let inner = map;
  for (const step of path.split(".")) {
    inner = inner[step];
    if (inner === undefined) {
      return false;
    }
  }
  return true;
};

/**
 * initialPath에서 시작하여 filename의 절대 경로를 탐색한다.
 * @param filename 탐색하려는 파일 이름
 * @param initialPath 탐색을 시작하는 위치
 * @returns filename의 절대 경로. 없으면 undefined
 */
const findFilePath = (filename: string, initialPath: string) => {
  let dir = initialPath;

  do {
    dir = dirname(dir);
  } while (!existsSync(join(dir, filename)) && dir !== "/");

  const filePath = join(dir, filename);

  if (!existsSync(filePath)) {
    return;
  }

  return filePath;
};

const getAbsolutePathInfo = (fileName: string) => {
  for (const configPath of TS_CONFIG_FILE_NAMES) {
    const filePath = findFilePath(configPath, fileName);

    if (filePath === undefined) {
      continue;
    }

    const baseDir = dirname(filePath);

    const tsPathConfig = JSON.parse(
      readFileSync(filePath, {
        encoding: "utf-8",
      }),
    );

    const result: { baseUrl: string; paths: Record<string, string[]> } = {
      baseUrl: "",
      paths: {},
    };

    if (has(tsPathConfig, "compilerOptions.baseUrl")) {
      result.baseUrl = join(baseDir, tsPathConfig.compilerOptions.baseUrl);
    }

    if (has(tsPathConfig, "compilerOptions.paths")) {
      result.paths = Object.fromEntries(
        Object.entries<string[]>(tsPathConfig.compilerOptions.paths).map(
          ([key, value]) => [
            key.replace(/\/\*$/, "/"),
            value.map((path) => join(baseDir, path).replace(/\/\*$/, "/")),
          ],
        ),
      );
    }

    return result;
  }

  return;
};

type MessageIds = "shouldBeRelativePath" | "shouldBeAbsolutePath";

export default createRule<[], MessageIds>({
  name: "import-path",
  meta: {
    type: "suggestion",
    fixable: "code",
    messages: {
      shouldBeRelativePath:
        'When importing a child module, you must use the relative path. Use "{{expectedPath}}" instead of "{{source}}".',
      shouldBeAbsolutePath:
        'When importing a parent module, you must use the absolute path. Use "{{expectedPath}}" instead of "{{source}}".',
    },
    schema: [],
    docs: {
      description:
        "Enforce import path according to the location of the imported file.",
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      ImportDeclaration: (node) => {
        const fileName = context.getFilename();
        const absolutePathInfo = getAbsolutePathInfo(fileName);

        if (absolutePathInfo === undefined) {
          return;
        }
        // console.log("fileName", fileName);
        // console.log("absolutePathInfo", absolutePathInfo);

        const source = node.source.value;
        // console.log("source", source);

        if (source.startsWith("..")) {
          const sourceAbsolutePath = join(dirname(fileName), source);
          // console.log("sourceAbsolutePath", sourceAbsolutePath);

          for (const [alias, paths] of Object.entries(absolutePathInfo.paths)) {
            for (const path of paths) {
              if (sourceAbsolutePath.startsWith(path)) {
                const expectedPath = sourceAbsolutePath.replace(path, alias);

                context.report({
                  node,
                  messageId: "shouldBeAbsolutePath",
                  data: {
                    expectedPath,
                    source,
                  },
                  fix(fixer) {
                    return fixer.replaceText(node.source, `"${expectedPath}"`);
                  },
                });

                return;
              }
            }
          }

          return;
        }

        let sourceAbsolutePath: string | undefined;
        for (const [alias, paths] of Object.entries(absolutePathInfo.paths)) {
          for (const path of paths) {
            if (source.startsWith(alias)) {
              sourceAbsolutePath = join(path, source.replace(alias, ""));
              break;
            }
          }

          if (sourceAbsolutePath !== undefined) {
            break;
          }
        }

        if (sourceAbsolutePath === undefined) {
          return;
        }

        // console.log("sourceAbsolutePath", sourceAbsolutePath);
        const sourceRelativePath = relative(
          dirname(fileName),
          sourceAbsolutePath,
        );

        if (sourceRelativePath.startsWith("..")) {
          return;
        }

        const expectedPath = "./" + sourceRelativePath;

        context.report({
          node,
          messageId: "shouldBeRelativePath",
          data: {
            expectedPath,
            source,
          },
          fix(fixer) {
            return fixer.replaceText(node.source, `"${expectedPath}"`);
          },
        });

        return;
      },
    };
  },
});
