// rollup.config.types.mjs
import dts from "rollup-plugin-dts";

export default {
  input: "dist/dts/index.d.ts",
  output: [{ file: "dist/index.d.ts", format: "es" }],
  plugins: [dts()],
};
