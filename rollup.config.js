import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { readFileSync, mkdirSync, writeFileSync, readdirSync } from "fs";
import { resolve, basename } from "path";

const { version } = JSON.parse(readFileSync("package.json", "utf-8"));
const banner = `/*! aDOMonitions v${version} https://github.com/carlosperate/aDOMonitions | MIT License | Copyright (C) ${new Date().getFullYear()} Carlos Pereira Atencio */`;

// Inline plugin: import .css files as exported strings (comments stripped)
function cssString() {
  return {
    name: "css-string",
    transform(code, id) {
      if (id.endsWith(".css")) {
        const stripped = code.replace(/\/\*[\s\S]*?\*\//g, "").trim();
        return {
          code: `export default ${JSON.stringify(stripped)};`,
          map: { mappings: "" },
        };
      }
    },
  };
}

// Inline plugin: copy standalone CSS files to dist/themes/
function copyThemes() {
  return {
    name: "copy-themes",
    writeBundle() {
      const srcDir = resolve("src/themes");
      const outDir = resolve("dist/themes");
      mkdirSync(outDir, { recursive: true });
      try {
        const files = readdirSync(srcDir).filter((f) => f.endsWith(".css"));
        for (const file of files) {
          const content = readFileSync(resolve(srcDir, file), "utf-8");
          writeFileSync(resolve(outDir, file), content);
        }
      } catch {
        // src/themes may not exist yet during early development
      }
    },
  };
}

const shared = {
  input: "src/index.ts",
  plugins: [cssString(), typescript({ tsconfig: "./tsconfig.json" })],
};

export default [
  // ESM
  {
    ...shared,
    output: {
      file: "dist/adomonitions.esm.js",
      format: "es",
      sourcemap: true,
    },
  },
  // UMD (unminified)
  {
    ...shared,
    output: {
      file: "dist/adomonitions.umd.js",
      format: "umd",
      name: "adomonitions",
      sourcemap: true,
    },
  },
  // UMD (minified)
  {
    ...shared,
    plugins: [
      ...shared.plugins,
      terser({ format: { comments: /^!/ } }),
      copyThemes(),
    ],
    output: {
      file: "dist/adomonitions.umd.min.js",
      format: "umd",
      name: "adomonitions",
      sourcemap: true,
      banner,
    },
  },
];
