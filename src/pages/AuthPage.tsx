import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Rocket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, redirectTo]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (resetMode) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast({ title: "E-mail enviado!", description: "Verifique sua caixa de entrada para redefinir a senha." });
        setResetMode(false);
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        if (password !== confirmPassword) {
          toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({ title: "Conta criada! 🚀", description: "Verifique seu e-mail para confirmar." });
      }
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/auth?redirect=" + encodeURIComponent(redirectTo),
      });
      if (result.error) throw result.error;
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <StarField />
      <Navbar />
      <div className="pt-24 pb-16 flex items-center justify-center min-h-screen relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-4"
        >
          <div className="bg-card rounded-2xl border border-border p-8 box-glow-cyan">
            <div className="text-center mb-8">
              <h1 className="font-pixel text-sm text-primary text-glow-cyan mb-2">
                {resetMode ? "🔑 RESETAR SENHA" : isLogin ? "🔐 LOGIN" : "🚀 CRIAR CONTA"}
              </h1>
              {searchParams.get("redirect") === "/checkout" && (
                <p className="font-body text-muted-foreground text-sm mt-2">
                  Para finalizar sua compra, faça login ou crie uma conta.
                </p>
              )}
            </div>

            {/* Google Login */}
            {!resetMode && (
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-muted border border-border rounded-xl font-display font-bold text-foreground hover:border-primary/50 transition-all mb-6 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Entrar com Google
              </button>
            )}

            {!resetMode && (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-border" />
                <span className="font-pixel text-[8px] text-muted-foreground">OU</span>
                <div className="flex-1 h-px bg-border" />
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {!isLogin && !resetMode && (
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-muted border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-muted border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              {!resetMode && (
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-11 pr-11 py-3 bg-muted border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              )}

              {!isLogin && !resetMode && (
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Confirmar senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-11 pr-4 py-3 bg-muted border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-primary-foreground font-display font-bold rounded-xl box-glow-cyan hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="loading-retro scale-50" />
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    {resetMode ? "Enviar Link" : isLogin ? "Entrar" : "Criar Conta"}
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              {!resetMode && (
                <>
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {isLogin ? "Não tem conta? Criar conta" : "Já tem conta? Entrar"}
                  </button>
                  {isLogin && (
                    <button
                      onClick={() => setResetMode(true)}
                      className="block mx-auto font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Esqueci minha senha
                    </button>
                  )}
                </>
              )}
              {resetMode && (
                <button
                  onClick={() => setResetMode(false)}
                  className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Voltar ao login
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default AuthPage;
