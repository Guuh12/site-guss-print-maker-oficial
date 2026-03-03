import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, CreditCard, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";
import { useToast } from "@/hooks/use-toast";

const CheckoutPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=/checkout");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && user && items.length === 0 && !success) {
      navigate("/carrinho");
    }
  }, [items, user, authLoading, navigate, success]);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        products: items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
        total,
        address,
        status: "pending" as const,
      });
      if (error) throw error;
      clearCart();
      setSuccess(true);
      toast({ title: "Pedido realizado! 🚀", description: "Acompanhe em Minha Conta." });
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) return null;

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <StarField />
        <Navbar />
        <div className="pt-24 flex flex-col items-center justify-center min-h-[70vh] relative z-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 rounded-full bg-accent/20 border-4 border-accent flex items-center justify-center mb-6">
            <Check className="w-12 h-12 text-accent" />
          </motion.div>
          <h1 className="font-pixel text-sm text-accent text-glow-green mb-2">PEDIDO CONFIRMADO!</h1>
          <p className="font-body text-muted-foreground mb-6">Seu pedido foi registrado com sucesso.</p>
          <div className="flex gap-4">
            <button onClick={() => navigate("/minha-conta")} className="px-6 py-3 bg-primary text-primary-foreground font-display font-bold rounded-lg">Meus Pedidos</button>
            <button onClick={() => navigate("/produtos")} className="px-6 py-3 bg-muted text-foreground font-display font-bold rounded-lg border border-border">Continuar Comprando</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StarField />
      <Navbar />
      <div className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-pixel text-xl text-primary text-glow-cyan text-center mb-8">💳 CHECKOUT</h1>

          <div className="grid md:grid-cols-5 gap-6">
            {/* Order Summary */}
            <div className="md:col-span-2 bg-card rounded-2xl border border-border p-5">
              <h2 className="font-pixel text-[10px] text-primary mb-4">RESUMO</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-body text-sm text-foreground">{item.name}</p>
                      <p className="font-body text-xs text-muted-foreground">{item.quantity}x R$ {item.price.toFixed(2).replace(".", ",")}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-border flex justify-between items-center">
                <span className="font-display font-bold text-foreground">Total</span>
                <span className="font-display text-2xl font-bold text-primary">R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            {/* Address Form */}
            <form onSubmit={handleOrder} className="md:col-span-3 bg-card rounded-2xl border border-border p-6 space-y-4">
              <h2 className="font-pixel text-[10px] text-primary mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> ENDEREÇO DE ENTREGA</h2>
              <textarea
                placeholder="Endereço completo (Rua, número, complemento, bairro, cidade, estado, CEP)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 bg-muted border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none"
              />

              <div className="pt-4">
                <h2 className="font-pixel text-[10px] text-primary mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4" /> PAGAMENTO</h2>
                <p className="font-pixel text-[8px] text-muted-foreground mb-4">* Integração de pagamento em breve. O pedido será registrado como pendente.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-accent text-accent-foreground font-display font-bold text-lg rounded-xl box-glow-green hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Processando..." : "Confirmar Pedido 🚀"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
