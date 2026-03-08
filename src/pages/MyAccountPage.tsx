import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";
import OrderDetailCard from "@/components/OrderDetailCard";
import AddressManager from "@/components/AddressManager";

interface Order {
  id: string;
  products: any;
  total: number;
  status: string;
  address: string | null;
  created_at: string;
}

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

  const handleOrderCancelled = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
    );
  };

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
            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center shrink-0">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-lg text-foreground truncate">{user.user_metadata?.full_name || user.email}</h2>
              <p className="font-body text-muted-foreground truncate">{user.email}</p>
            </div>
            <button onClick={() => { signOut(); navigate("/"); }} className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg font-display font-bold text-sm hover:bg-destructive/20 transition-colors flex items-center gap-2 shrink-0">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </motion.div>

          {/* Addresses */}
          <div className="mb-10">
            <AddressManager />
          </div>

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
              {orders.map((order, i) => (
                <OrderDetailCard
                  key={order.id}
                  order={order}
                  index={i}
                  onCancelled={handleOrderCancelled}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyAccountPage;
