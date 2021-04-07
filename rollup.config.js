import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import scss from "rollup-plugin-scss";
import { writeFileSync } from "fs";
import path from "path";

const TEST_VAULT_PLUGIN = "../test_vault/.obsidian/plugins/obsidian-git-store/";
const isDev = String(process.env.NODE_ENV).toLowerCase() === "development";
const plugins = [];

if (!isDev) {
  plugins.push(terser());
}

const Config = {
  input: "src/main.ts",
  output: [
    {
      file: "dist/main.js",
      sourcemap: "inline",
      format: "cjs",
      exports: "default",
      plugins,
    },
  ],
  external: ["obsidian", "fs", "path", "util"],
  plugins: [
    typescript(),
    nodeResolve({ browser: true }),
    commonjs(),
    scss({
      output: function (styles) {
        writeFileSync("dist/styles.css", styles);
        if (isDev) {
          writeFileSync(path.join(TEST_VAULT_PLUGIN, "styles.css"), styles);
        }
      },
      sass: require("sass"),
    }),
  ],
};

if (isDev) {
  Config.output.push({
    file: path.join(TEST_VAULT_PLUGIN, "main.js"),
    sourcemap: "inline",
    format: "cjs",
    exports: "default",
    plugins,
  });
}

export default Config;
