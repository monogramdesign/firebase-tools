import { copy, readFile } from "fs-extra";
import { join } from "path";
import { FrameworkType, relativeRequire, SupportLevel } from "..";
import { getConfig, viteDiscoverWithNpmDependency } from "../vite";
// TODO figure out why relativeRequire was not working
const { dynamicImport } = require(true && "../../dynamicImport");

export const name = "SvelteKit";
export const support = SupportLevel.Experimental;
export const type = FrameworkType.MetaFramework;
export const discover = viteDiscoverWithNpmDependency("@sveltejs/kit");
// export const init = initViteTemplate("svelte");

export async function build(root: string) {
  const { build } = relativeRequire(root, "vite");
  await build({ root });
  // TODO can we be smart about this?
  return { wantsBackend: true };
}

export async function ɵcodegenPublicDirectory(root: string, dest: string) {
  const config = await dynamicImport(join(root, "svelte.config.js"));
  const outDir = config.outDir || ".svelte-kit";
  const prerenderedPath = join(root, outDir, "output", "prerendered", "pages");
  const assetsPath = join(root, outDir, "output", "client");

  console.log("copying files...");
  await Promise.all([copy(prerenderedPath, dest), copy(assetsPath, dest)]);
}

export async function ɵcodegenFunctionsDirectory(sourceDir: string, destDir: string) {
  const packageJsonBuffer = await readFile(join(sourceDir, "package.json"));
  const packageJson = JSON.parse(packageJsonBuffer.toString());

  await copy(join(sourceDir, ".svelte-kit", "output", "server"), join(destDir));

  return { packageJson: { ...packageJson }, frameworksEntry: "sveltekit" };
}
