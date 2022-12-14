import { copy, readFile, existsSync } from "fs-extra";
import { join } from "path";
import { findDependency, FrameworkType, relativeRequire, SupportLevel } from "..";
import { getConfig, viteDiscoverWithNpmDependency } from "../vite";
// TODO figure out why relativeRequire was not working
const { dynamicImport } = require(true && "../../dynamicImport");

export const name = "SvelteKit";
export const support = SupportLevel.Experimental;
export const type = FrameworkType.MetaFramework;
// export const init = initViteTemplate("svelte");

export const discover = viteDiscoverWithNpmDependency("@sveltejs/kit");
// export async function discover(dir: string) {
//   if (!existsSync(join(dir, "package.json"))) return;
//   if (!findDependency("@sveltejs/kit", { cwd: dir, depth: 0, omitDev: false })) return;

//   const { publicDir: publicDirectory } = await getConfig(dir);

//   return { publicDirectory, mayWantBackend: true };
// }

export async function build(root: string) {
  const { build } = relativeRequire(root, "vite");
  const result = await build({ root });
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
