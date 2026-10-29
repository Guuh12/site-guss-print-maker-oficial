import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import OrderDetailCard from "@/components/OrderDetailCard";
import AddressManager from "@/components/AddressManager";
import AccountProfile from "@/components/AccountProfile";
import { asOrders, type Order } from "@/types/order";

const MyAccountPage = () => {
  const { user, loading: authLoading } = useAuth();
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
      setOrders(asOrders(data));
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (authLoading || !user) return null;

  return (
    <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-pixel text-xl text-primary text-glow-cyan text-center mb-8">👤 MINHA CONTA</h1>

          <AccountProfile />

          <div className="mb-10">
            <AddressManager />
          </div>

          <h2 className="font-pixel text-sm text-primary text-glow-cyan mb-4">📦 MEUS PEDIDOS</h2>
          {loading ? (
            <div className="flex justify-center py-12"><div className="loading-retro" /></div>
          ) : orders.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="font-body text-muted-foreground mb-4">Nenhum pedido ainda.</p>
              <Link to="/produtos" className="inline-flex px-4 py-2 bg-primary text-primary-foreground font-display font-bold text-sm rounded-lg">
                Ver produtos
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, i) => (
                <OrderDetailCard
                  key={order.id}
                  order={order}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
    </div>
  );
};

export default MyAccountPage;
