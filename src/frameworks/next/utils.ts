import type { Header, Redirect, Rewrite } from "next/dist/lib/load-custom-routes";
import type { Manifest, RoutesManifestRewrite } from "./interfaces";
import { isUrl } from "../utils";

/**
 * Whether the given path has a regex or not.
 * According to the Next.js documentation:
 * ```md
 *  To match a regex path you can wrap the regex in parentheses
 *  after a parameter, for example /post/:slug(\\d{1,}) will match /post/123
 *  but not /post/abc.
 * ```
 * See: https://nextjs.org/docs/api-reference/next.config.js/redirects#regex-path-matching
 */
export function pathHasRegex(path: string): boolean {
  // finds parentheses that are not preceded by double backslashes
  return /(?<!\\)\(/.test(path);
}

/**
 * Remove double backslashes from a string
 */
export function cleanEscapedChars(path: string): string {
  return path.replace(/\\/g, "");
}

/**
 * Whether a Next.js rewrite is supported by Firebase.
 */
export function isRewriteSupportedByFirebase(rewrite: Rewrite): boolean {
  if ("has" in rewrite || pathHasRegex(rewrite.source) || isUrl(rewrite.destination)) {
    return false;
  }

  return true;
}

/**
 * Whether a Next.js redirect is supported by Firebase.
 */
export function isRedirectSupportedByFirebase(redirect: Redirect): boolean {
  if ("has" in redirect || pathHasRegex(redirect.source) || "internal" in redirect) {
    return false;
  }

  return true;
}

/**
 * Whether a Next.js header is supported by Firebase.
 */
export function isHeaderSupportedByFirebase(header: Header): boolean {
  if ("has" in header || pathHasRegex(header.source)) {
    return false;
  }

  return true;
}

/**
 * Firebase Rewrites that can be supported by firebase.json.
 */
export function getNextjsRewritesToUse(
  nextJsRewrites: Manifest["rewrites"]
): RoutesManifestRewrite[] {
  if (Array.isArray(nextJsRewrites)) {
    return nextJsRewrites;
  }

  if (nextJsRewrites?.beforeFiles) {
    return nextJsRewrites.beforeFiles;
  }

  return [];
}
