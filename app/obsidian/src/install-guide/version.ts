/* eslint-disable @typescript-eslint/naming-convention */

import { join } from "path/posix";
import { betterSqlite3 } from "@obzt/common";
import { Platform } from "obsidian";

// npm version is "12.8.0"; WiseLibs release tags and prebuilt filenames
// use the "v12.8.0" form, so prepend the "v" here and hand out the prefixed
// form everywhere downstream.
export const BINARY_VERSION = `v${process.env.BETTER_SQLITE3_VERSION}`;

// Injected at build time by esbuild as a bare identifier (see env.d.ts for the
// `declare const`). Shape: { [modules]: { [platform]: arch[] } }.
// Esbuild textually substitutes BETTER_SQLITE3_SUPPORT with the JS object
// literal — no runtime JSON.parse needed.
// DEV builds inject `{}` (no fetch), and the helpers below detect the empty
// object and short-circuit — dev never gates on the matrix.
export const PLATFORM_SUPPORT = BETTER_SQLITE3_SUPPORT;

const isPlatformCheckBypassed = () =>
  Object.keys(PLATFORM_SUPPORT).length === 0;

const appDataDir: string | null = Platform.isDesktopApp
  ? // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("@electron/remote").app.getPath("userData")
  : null;

export const {
  arch,
  platform,
  versions: { modules, electron },
} = process;

export interface PlatformDetails {
  /**
   * The operating system CPU architecture for which the Node.js binary was compiled.
   * Possible values are: `'arm'`, `'arm64'`, `'ia32'`, `'mips'`,`'mipsel'`, `'ppc'`,`'ppc64'`, `'s390'`, `'s390x'`, `'x32'`, and `'x64'`.
   **/
  arch: string;
  platform: NodeJS.Platform;
  modules: string;
  electron: string;
}

/**
 * @returns 0 if the current electron module version is supported OR if the
 *            matrix is empty (dev build — check bypassed),
 *          1 if it's newer than anything in the matrix (user needs to update plugin),
 *         -1 if it's older than anything in the matrix (user needs to update obsidian).
 */
export const compareElectronVer = ({ modules }: PlatformDetails): number => {
  if (isPlatformCheckBypassed()) return 0;
  if (modules in PLATFORM_SUPPORT) return 0;
  const supported = Object.keys(PLATFORM_SUPPORT)
    .map((v) => parseInt(v, 10))
    .sort((a, b) => a - b);
  const cur = parseInt(modules, 10);
  return cur > supported[supported.length - 1] ? 1 : -1;
};

export const isPlatformSupported = ({
  modules,
  platform,
  arch,
}: PlatformDetails) => {
  if (isPlatformCheckBypassed()) return true;
  return PLATFORM_SUPPORT[modules]?.[platform]?.includes(arch) ?? false;
};

export const getPlatformDetails = (): PlatformDetails | null => {
  if (!Platform.isDesktopApp) return null;
  return {
    arch: process.arch,
    platform: process.platform,
    modules: process.versions.modules,
    electron: process.versions.electron,
  };
};

export const getBinaryFullPath = (): string | null => {
  if (!appDataDir) return null;
  return join(appDataDir, betterSqlite3(BINARY_VERSION));
};
