import { copy } from "fs-extra";
import { join } from "path";
import { FrameworkType, SupportLevel } from "..";
import { viteDiscoverWithNpmDependency } from "../vite";
// TODO figure out why relativeRequire was not working
const { dynamicImport } = require(true && "../../dynamicImport");

export const name = "SvelteKit";
export const support = SupportLevel.Experimental;
export const type = FrameworkType.MetaFramework;
export { build } from "../vite";

// export const init = initViteTemplate("svelte");
export const discover = viteDiscoverWithNpmDependency("@sveltejs/kit");

export async function ɵcodegenPublicDirectory(root: string, dest: string) {
  const config = await dynamicImport(join(root, "svelte.config.js"));
  const outDir = config.outDir || ".svelte-kit";
  const prerenderedPath = join(root, outDir, "output", "prerendered", "pages");
  const assetsPath = join(root, outDir, "output", "client");

  console.log("copying files...");
  await Promise.all([copy(prerenderedPath, dest), copy(assetsPath, dest)]);
}

export async function ɵcodegenFunctionsDirectory(sourceDir: string, destDir: string) {
  console.log("codegenFunctionsDirectory sveltekit");
}
