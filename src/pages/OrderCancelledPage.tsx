import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";
import { useToast } from "@/hooks/use-toast";

interface OrderProduct {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  products: OrderProduct[] | null;
  total: number;
  status: string;
  address: string | null;
  created_at: string;
}

const OrderCancelledPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [missingTable, setMissingTable] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/auth?redirect=/pedido/${id}/cancelar`, { replace: true });
    }
  }, [user, authLoading, navigate, id]);

  useEffect(() => {
    if (!user || !id) return;
    const load = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, products, total, status, address, created_at")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        if (error.message.includes("schema cache") || error.code === "PGRST205") {
          setMissingTable(true);
        } else {
          toast({ title: "Erro", description: error.message, variant: "destructive" });
        }
        setLoading(false);
        return;
      }

      setOrder(data as Order | null);
      setLoading(false);
    };
    load();
  }, [user, id, toast]);

  const confirmCancel = async () => {
    if (!order) return;
    setCancelling(true);
    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", order.id);

    if (error) {
      toast({ title: "Não foi possível cancelar", description: error.message, variant: "destructive" });
      setCancelling(false);
      return;
    }

    setOrder({ ...order, status: "cancelled" });
    setCancelling(false);
  };

  if (authLoading || !user) return null;

  const products = Array.isArray(order?.products) ? order.products : [];
  const cancelled = order?.status === "cancelled";
  const canCancel = order?.status === "pending" || order?.status === "in_production";

  return (
    <div className="min-h-screen bg-background">
      <StarField />
      <Navbar />
      <div className="pt-24 pb-16 flex flex-col items-center justify-center min-h-[70vh] relative z-10 px-4">
        {loading ? (
          <div className="loading-retro" />
        ) : missingTable ? (
          <div className="w-full max-w-md text-center">
            <h1 className="font-pixel text-sm text-destructive mb-3">PEDIDOS INDISPONÍVEIS</h1>
            <p className="font-body text-muted-foreground mb-6">
              A tabela de pedidos ainda não existe neste Supabase. Rode o SQL de criação e tente de novo.
            </p>
            <Link to="/minha-conta" className="inline-flex px-6 py-3 bg-primary text-primary-foreground font-display font-bold rounded-lg">
              Voltar para Minha Conta
            </Link>
          </div>
        ) : !order ? (
          <div className="w-full max-w-md text-center">
            <h1 className="font-pixel text-sm text-primary text-glow-cyan mb-3">PEDIDO NÃO ENCONTRADO</h1>
            <p className="font-body text-muted-foreground mb-6">Esse pedido não está na sua conta.</p>
            <Link to="/minha-conta" className="inline-flex px-6 py-3 bg-primary text-primary-foreground font-display font-bold rounded-lg">
              Meus Pedidos
            </Link>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
            <div className="flex flex-col items-center text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`w-24 h-24 rounded-full border-4 flex items-center justify-center mb-6 ${
                  cancelled ? "bg-destructive/15 border-destructive" : "bg-muted border-border"
                }`}
              >
                <XCircle className={`w-12 h-12 ${cancelled ? "text-destructive" : "text-muted-foreground"}`} />
              </motion.div>
              <h1 className={`font-pixel text-sm mb-2 ${cancelled ? "text-destructive" : "text-foreground"}`}>
                {cancelled ? "PEDIDO CANCELADO" : "CANCELAR PEDIDO"}
              </h1>
              <p className="font-body text-muted-foreground">
                {cancelled
                  ? "O pedido foi encerrado. Nenhum valor foi cobrado por aqui."
                  : canCancel
                    ? "Confira os itens antes de cancelar. Essa ação não pode ser desfeita."
                    : "Este pedido já avançou e não pode mais ser cancelado."}
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-5 mb-6">
              <p className="font-pixel text-[8px] text-muted-foreground mb-3">
                PEDIDO #{order.id.slice(0, 8).toUpperCase()}
              </p>
              <div className="space-y-3 mb-4">
                {products.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="flex gap-3 items-center">
                    {item.image ? (
                      <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <Package className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-foreground">{item.name}</p>
                      <p className="font-body text-xs text-muted-foreground">
                        {item.quantity}x R$ {Number(item.price).toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-border flex justify-between items-center">
                <span className="font-display font-bold text-foreground">Total</span>
                <span className="font-display text-2xl font-bold text-primary">
                  R$ {Number(order.total).toFixed(2).replace(".", ",")}
                </span>
              </div>
              {order.address && (
                <p className="font-body text-xs text-muted-foreground mt-3">Entrega: {order.address}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {canCancel && (
                <button
                  type="button"
                  onClick={confirmCancel}
                  disabled={cancelling}
                  className="flex-1 px-6 py-3 bg-destructive text-destructive-foreground font-display font-bold rounded-lg disabled:opacity-50"
                >
                  {cancelling ? "Cancelando..." : "Confirmar cancelamento"}
                </button>
              )}
              <Link
                to="/minha-conta"
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-display font-bold rounded-lg text-center"
              >
                Meus Pedidos
              </Link>
              <Link
                to="/produtos"
                className="flex-1 px-6 py-3 bg-muted text-foreground font-display font-bold rounded-lg border border-border text-center"
              >
                Continuar Comprando
              </Link>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderCancelledPage;
