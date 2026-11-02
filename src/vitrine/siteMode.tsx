import { createContext, useContext, type ReactNode } from "react";

export type SiteMode = "loja" | "vitrine";

export const SHOP_HOME = "/loja";
export const VITRINE_HOME = "/vitrine";

type SiteModeValue = {
  mode: SiteMode;
  isVitrine: boolean;
  path: (to: string) => string;
};

const SiteModeContext = createContext<SiteModeValue | null>(null);

function prefixPath(mode: SiteMode, to: string) {
  const hashIndex = to.indexOf("#");
  const hash = hashIndex >= 0 ? to.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? to.slice(0, hashIndex) : to;
  const queryIndex = withoutHash.indexOf("?");
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex) : "";
  const pathname = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (mode === "vitrine") {
    const base = normalized === "/" ? VITRINE_HOME : `${VITRINE_HOME}${normalized}`;
    return `${base}${query}${hash}`;
  }

  const base = normalized === "/" ? SHOP_HOME : normalized;
  return `${base}${query}${hash}`;
}

export function SiteModeProvider({ mode, children }: { mode: SiteMode; children: ReactNode }) {
  const value: SiteModeValue = {
    mode,
    isVitrine: mode === "vitrine",
    path: (to: string) => prefixPath(mode, to),
  };

  return <SiteModeContext.Provider value={value}>{children}</SiteModeContext.Provider>;
}

export function useSiteMode() {
  return (
    useContext(SiteModeContext) ?? {
      mode: "loja" as const,
      isVitrine: false,
      path: (to: string) => prefixPath("loja", to),
    }
  );
}
