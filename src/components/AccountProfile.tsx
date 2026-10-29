import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Phone, Lock, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const providerLabels: Record<string, string> = {
  email: "E-mail",
  google: "Google",
  facebook: "Facebook",
};

const inputClass =
  "w-full px-3 py-2.5 bg-muted border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors";

const AccountProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user?.user_metadata?.full_name || user?.user_metadata?.name || "");
  const [phone, setPhone] = useState(user?.user_metadata?.phone || "");
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  if (!user) return null;

  const providers = user.identities?.map((identity) => identity.provider) ?? [];
  const canChangePassword = providers.includes("email");
  const memberSince = new Date(user.created_at).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedName) {
      toast({ title: "Informe seu nome", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: trimmedName,
          phone: trimmedPhone,
        },
      });
      if (error) throw error;

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        name: trimmedName,
        email: user.email,
        phone: trimmedPhone || null,
        avatar_url: user.user_metadata?.avatar_url || null,
      });
      if (profileError && !/relation|column|schema/i.test(profileError.message)) {
        throw profileError;
      }

      setEditing(false);
      toast({ title: "Dados atualizados" });
    } catch (error: unknown) {
      const description = error instanceof Error ? error.message : "Não foi possível salvar.";
      toast({ title: "Erro", description, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.email) return;
    if (newPassword.length < 6) {
      toast({ title: "A senha precisa ter pelo menos 6 caracteres", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "As senhas não coincidem", variant: "destructive" });
      return;
    }

    setSavingPassword(true);
    try {
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (reauthError) throw new Error("A senha atual está incorreta.");

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      toast({ title: "Senha atualizada" });
    } catch (error: unknown) {
      const description = error instanceof Error ? error.message : "Não foi possível trocar a senha.";
      toast({ title: "Erro", description, variant: "destructive" });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center shrink-0 overflow-hidden">
          {user.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-lg text-foreground truncate">
            {user.user_metadata?.full_name || user.user_metadata?.name || "Sua conta"}
          </h2>
          <p className="font-body text-muted-foreground truncate">{user.email}</p>
          <p className="font-body text-xs text-muted-foreground mt-1">
            Cliente desde {memberSince}
            {phone ? ` · ${phone}` : ""}
          </p>
          {providers.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {providers.map((provider) => (
                <span key={provider} className="text-[10px] font-pixel text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  {providerLabels[provider] || provider}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setEditing((open) => !open)}
            className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-display font-bold text-sm hover:bg-primary/20 transition-colors"
          >
            {editing ? "Fechar" : "Editar dados"}
          </button>
          <button
            type="button"
            onClick={() => { signOut(); navigate("/"); }}
            className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg font-display font-bold text-sm hover:bg-destructive/20 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </div>

      {editing && (
        <form onSubmit={saveProfile} className="mt-6 pt-6 border-t border-border grid sm:grid-cols-2 gap-3">
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1 block">Nome</label>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Phone className="w-3 h-3" /> Telefone
            </label>
            <input
              className={inputClass}
              type="tel"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="font-body text-xs text-muted-foreground mb-1 block">E-mail</label>
            <input className={inputClass} value={user.email || ""} disabled />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="sm:col-span-2 py-3 bg-primary text-primary-foreground font-display font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> {saving ? "Salvando..." : "Salvar dados"}
          </button>
        </form>
      )}

      <div className="mt-6 pt-6 border-t border-border">
        {canChangePassword ? (
          <>
            <button
              type="button"
              onClick={() => setShowPassword((open) => !open)}
              className="font-display font-bold text-sm text-foreground flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Lock className="w-4 h-4" /> {showPassword ? "Fechar senha" : "Trocar senha"}
            </button>
            {showPassword && (
              <form onSubmit={savePassword} className="mt-4 grid sm:grid-cols-3 gap-3">
                <input
                  className={inputClass}
                  type="password"
                  placeholder="Senha atual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
                <input
                  className={inputClass}
                  type="password"
                  placeholder="Nova senha"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <input
                  className={inputClass}
                  type="password"
                  placeholder="Confirmar nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="sm:col-span-3 py-3 bg-muted text-foreground font-display font-bold rounded-xl border border-border disabled:opacity-50"
                >
                  {savingPassword ? "Atualizando..." : "Atualizar senha"}
                </button>
              </form>
            )}
          </>
        ) : (
          <p className="font-body text-sm text-muted-foreground">
            Esta conta entra com {providers.map((provider) => providerLabels[provider] || provider).join(" e ") || "rede social"}. A senha fica nesse serviço.
          </p>
        )}
      </div>
    </div>
  );
};

export default AccountProfile;
