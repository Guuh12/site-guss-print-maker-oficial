import type { Provider } from "@supabase/supabase-js";
import { supabase } from "./client";

const POST_LOGIN_PATH_KEY = "guss_auth_redirect";

export type SocialProvider = Extract<Provider, "google" | "facebook">;

function safeInternalPath(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return "/";
  return path;
}

export function rememberPostLoginPath(path: string) {
  sessionStorage.setItem(POST_LOGIN_PATH_KEY, safeInternalPath(path));
}

export function consumePostLoginPath(fallback = "/"): string {
  const stored = sessionStorage.getItem(POST_LOGIN_PATH_KEY);
  if (!stored) return safeInternalPath(fallback);
  sessionStorage.removeItem(POST_LOGIN_PATH_KEY);
  return safeInternalPath(stored);
}

export function peekPostLoginPath(): string | null {
  const stored = sessionStorage.getItem(POST_LOGIN_PATH_KEY);
  return stored ? safeInternalPath(stored) : null;
}

/** URL fixa cadastrada em Authentication → URL Configuration → Redirect URLs. */
export function buildAuthCallbackUrl(): string {
  return new URL("/auth", window.location.origin).toString();
}

export async function signInWithOAuth(provider: SocialProvider, postLoginPath: string): Promise<void> {
  rememberPostLoginPath(postLoginPath);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: buildAuthCallbackUrl(),
      scopes: provider === "facebook" ? "email,public_profile" : undefined,
      queryParams: provider === "google" ? { prompt: "select_account" } : undefined,
    },
  });

  if (error) throw error;
  if (data?.url) {
    window.location.assign(data.url);
    return;
  }

  const label = provider === "google" ? "Google" : "Facebook";
  throw new Error(`Não foi possível iniciar o login com o ${label}.`);
}
