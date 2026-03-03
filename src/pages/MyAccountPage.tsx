import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, User, LogOut, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";

interface Order {
  id: string;
  products: any;
  total: number;
  status: string;
  address: string | null;
  created_at: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "⏳ Pendente", color: "text-yellow-400" },
  in_production: { label: "🔧 Em Produção", color: "text-blue-400" },
  printed: { label: "🖨 Impresso", color: "text-purple-400" },
  shipped: { label: "📦 Enviado", color: "text-cyan-400" },
  completed: { label: "✅ Finalizado", color: "text-green-400" },
};

const MyAccountPage = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=/minha-conta");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      setOrders(data || []);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <StarField />
      <Navbar />
      <div className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-pixel text-xl text-primary text-glow-cyan text-center mb-8">👤 MINHA CONTA</h1>

          {/* Profile Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 mb-8 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-primary" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-display font-bold text-lg text-foreground">{user.user_metadata?.full_name || user.email}</h2>
              <p className="font-body text-muted-foreground">{user.email}</p>
            </div>
            <button onClick={() => { signOut(); navigate("/"); }} className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg font-display font-bold text-sm hover:bg-destructive/20 transition-colors flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </motion.div>

          {/* Orders */}
          <h2 className="font-pixel text-sm text-primary text-glow-cyan mb-4">📦 MEUS PEDIDOS</h2>
          {loading ? (
            <div className="flex justify-center py-12"><div className="loading-retro" /></div>
          ) : orders.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="font-body text-muted-foreground">Nenhum pedido ainda.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => {
                const s = statusLabels[order.status] || statusLabels.pending;
                const products = Array.isArray(order.products) ? order.products : [];
                return (
                  <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl border border-border p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-pixel text-[8px] text-muted-foreground">PEDIDO #{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="font-body text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" /> {new Date(order.created_at).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <span className={`font-pixel text-[8px] ${s.color}`}>{s.label}</span>
                    </div>
                    <div className="space-y-1 mb-3">
                      {products.map((p: any, j: number) => (
                        <p key={j} className="font-body text-sm text-foreground">{p.quantity}x {p.name}</p>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <span className="font-body text-muted-foreground text-sm">Total</span>
                      <span className="font-display font-bold text-primary">R$ {Number(order.total).toFixed(2).replace(".", ",")}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyAccountPage;
