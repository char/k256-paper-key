import { build } from "@char/aftercare/esbuild";

if (import.meta.main) {
  const watch = Deno.args.includes("--watch");
  await build({
    in: ["./src/main.tsx"],
    outDir: "./web/dist",
    watch,
    serve: watch
      ? { port: 3000, host: "127.0.0.1", servedir: "./web" }
      : undefined,
    extraOptions: {
      loader: { ".wasm": "file" },
      splitting: true,
      minify: true,
    },
  });
}
