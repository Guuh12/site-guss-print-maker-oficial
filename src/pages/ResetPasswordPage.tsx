import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Rocket } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    const looksLikeRecovery =
      hash.includes("type=recovery") || params.has("code") || params.get("type") === "recovery";

    if (!looksLikeRecovery) {
      navigate("/auth", { replace: true });
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Erro", { description: "As senhas não coincidem." });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Senha atualizada! 🚀", { description: "Você já pode fazer login." });
      navigate("/");
    } catch (error: unknown) {
      const description = error instanceof Error ? error.message : "Não foi possível atualizar a senha.";
      toast.error("Erro", { description });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 flex items-center justify-center min-h-[70vh]">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-4">
          <div className="bg-card rounded-2xl border border-border p-8 box-glow-cyan">
            <h1 className="font-pixel text-sm text-primary text-glow-cyan text-center mb-8">🔑 NOVA SENHA</h1>
            {!ready ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="loading-retro" />
                <p className="font-body text-sm text-muted-foreground text-center">Confirmando o link de recuperação...</p>
              </div>
            ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input type="password" placeholder="Nova senha" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full pl-11 pr-4 py-3 bg-muted border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input type="password" placeholder="Confirmar senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} className="w-full pl-11 pr-4 py-3 bg-muted border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors" />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground font-display font-bold rounded-xl box-glow-cyan hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                <Rocket className="w-5 h-5" /> Redefinir Senha
              </button>
            </form>
            )}
          </div>
        </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
