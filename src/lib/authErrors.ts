const KNOWN_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "E-mail ou senha incorretos.",
  "Email not confirmed": "Confirme o e-mail antes de entrar. Olhe também a caixa de spam.",
  "User already registered": "Este e-mail já tem conta. Entre ou recupere a senha.",
  "Signup requires a valid password": "A senha precisa ter pelo menos 6 caracteres.",
  "Password should be at least 6 characters": "A senha precisa ter pelo menos 6 caracteres.",
};

export function authErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : "Não foi possível concluir agora.";
  if (KNOWN_MESSAGES[raw]) return KNOWN_MESSAGES[raw];
  if (/provider is not enabled/i.test(raw) || /unsupported provider/i.test(raw)) {
    return "Esse login social ainda não está ativo no Supabase. Ative Google ou Facebook em Authentication → Providers.";
  }
  return raw;
}
