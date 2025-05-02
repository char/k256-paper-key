import { build } from "@char/aftercare/esbuild";
import * as esbuild from "npm:esbuild@0.24";

const nodeShimPlugin: esbuild.Plugin = {
  name: "node-shim",
  setup: (build) => {
    build.onResolve({ filter: /.*/, namespace: "node" }, (args) => {
      if (args.path === "buffer") {
        return { path: "//esm.sh/buffer@6.0.3?pin=v135", namespace: "https" };
      }

      return undefined;
    });

    build.onResolve({ filter: /^events$/ }, () => ({
      path: "//esm.sh/events@3.3.0?pin=v135",
      namespace: "https",
    }));
  },
};

if (import.meta.main) {
  const watch = Deno.args.includes("--watch");
  await build({
    in: ["./src/main.tsx"],
    outDir: "./web/dist",
    plugins: [nodeShimPlugin],
    watch,
    serve: watch
      ? { port: 3000, host: "127.0.0.1", servedir: "./web" }
      : undefined,
    extraOptions: {
      loader: { ".wasm": "file" },
      splitting: true,
      minify: true,
      inject: ["./_buffer_shim.js"],
    },
  });
}
