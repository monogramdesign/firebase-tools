import { FrameworkType } from "..";
import { viteDiscoverWithNpmDependency } from "../vite";

export * from "../vite";

export const name = "SvelteKit";
export const type = FrameworkType.MetaFramework;

// export const init = initViteTemplate("svelte");
export const discover = viteDiscoverWithNpmDependency("@sveltejs/kit");

export async function ɵcodegenPublicDirectory(root: string, dest: string) {
  console.log("codegenPublicDirectory sveltekit");
}

export async function ɵcodegenFunctionsDirectory(sourceDir: string, destDir: string) {
  console.log("codegenFunctionsDirectory sveltekit");
}
