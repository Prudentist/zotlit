import { atom } from "jotai";
import { BINARY_VERSION, getBinaryFullPath } from "../version";
import type { InstallGuideModal } from ".";

export const modalAtom = atom<InstallGuideModal>(null as never);

export const binaryNameAtom = atom((get) => {
  const { arch, platform, modules } = get(modalAtom).platform;
  return `better-sqlite3-${BINARY_VERSION}-electron-v${modules}-${platform}-${arch}.tar.gz`;
});

export const binaryLinkAtom = atom(
  (get) =>
    `https://github.com/WiseLibs/better-sqlite3/releases/download/${BINARY_VERSION}/${get(
      binaryNameAtom,
    )}`
);

export const binaryLinkFastgitAtom = atom((get) =>
  get(binaryLinkAtom).replace("github.com", "download.fastgit.org")
);

export const binaryFullPathAtom = atom(() => getBinaryFullPath());

export const guideModeAtom = atom<GuideMode>((get) => get(modalAtom).mode);

export type GuideMode = "install" | "reset";
