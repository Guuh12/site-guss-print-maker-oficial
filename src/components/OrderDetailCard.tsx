import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronDown, ChevronUp, MapPin, FileText, XCircle, Package, Hash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OrderProduct {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

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
  cancelled: { label: "❌ Cancelado", color: "text-destructive" },
};

const canCancel = (status: string) => status === "pending" || status === "in_production";

interface Props {
  order: Order;
  index: number;
  onCancelled: (id: string) => void;
}

const OrderDetailCard = ({ order, index, onCancelled }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const s = statusLabels[order.status] || statusLabels.pending;
  const products: OrderProduct[] = Array.isArray(order.products) ? order.products : [];
  const orderDate = new Date(order.created_at);

  const handleCancel = async () => {
    if (!confirm("Tem certeza que deseja cancelar este pedido?")) return;
    setCancelling(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "cancelled" as any })
        .eq("id", order.id);
      if (error) throw error;
      onCancelled(order.id);
      toast.success("Pedido cancelado com sucesso.");
    } catch {
      toast.error("Erro ao cancelar pedido.");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-xl border border-border overflow-hidden"
    >
      {/* Clickable Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 text-left flex justify-between items-start hover:bg-muted/30 transition-colors"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-pixel text-[8px] text-muted-foreground">
              PEDIDO #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <p className="font-body text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> {orderDate.toLocaleDateString("pt-BR")}
          </p>
          <div className="mt-2 space-y-0.5">
            {products.map((p, j) => (
              <p key={j} className="font-body text-sm text-foreground">
                {p.quantity}x {p.name}
              </p>
            ))}
          </div>
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
            <span className="font-body text-muted-foreground text-sm">Total</span>
            <span className="font-display font-bold text-primary">
              R$ {Number(order.total).toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 ml-4 shrink-0">
          <span className={`font-pixel text-[8px] ${s.color}`}>{s.label}</span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expandable Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
              {/* Products with images */}
              <div>
                <h3 className="font-pixel text-[8px] text-primary mb-3 flex items-center gap-2">
                  <Package className="w-3.5 h-3.5" /> ITENS DO PEDIDO
                </h3>
                <div className="space-y-3">
                  {products.map((p, j) => (
                    <div key={j} className="flex gap-3 items-center">
                      {p.image && (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover border border-border"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-body text-sm text-foreground font-semibold">{p.name}</p>
                        <p className="font-body text-xs text-muted-foreground">
                          {p.quantity}x R$ {Number(p.price).toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                      <span className="font-body text-sm text-foreground">
                        R$ {(p.quantity * p.price).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order ID */}
              <div>
                <h3 className="font-pixel text-[8px] text-primary mb-2 flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5" /> CÓDIGO DO PEDIDO
                </h3>
                <p className="font-body text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 break-all">
                  {order.id}
                </p>
              </div>

              {/* Address */}
              {order.address && (
                <div>
                  <h3 className="font-pixel text-[8px] text-primary mb-2 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> ENDEREÇO DE ENTREGA
                  </h3>
                  <p className="font-body text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                    {order.address}
                  </p>
                </div>
              )}

              {/* Invoice */}
              <div>
                <h3 className="font-pixel text-[8px] text-primary mb-2 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> NOTA FISCAL
                </h3>
                {order.status === "completed" || order.status === "shipped" ? (
                  <p className="font-body text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                    Nota fiscal disponível em breve.
                  </p>
                ) : (
                  <p className="font-body text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                    A nota fiscal será emitida após o envio do pedido.
                  </p>
                )}
              </div>

              {/* Order date details */}
              <div>
                <h3 className="font-pixel text-[8px] text-primary mb-2 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" /> DATA DO PEDIDO
                </h3>
                <p className="font-body text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                  {orderDate.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Cancel button */}
              {canCancel(order.status) && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="w-full py-3 bg-destructive/10 text-destructive font-display font-bold rounded-lg border border-destructive/30 hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  {cancelling ? "Cancelando..." : "Cancelar Pedido"}
                </button>
              )}

              {order.status === "cancelled" && (
                <p className="font-body text-sm text-destructive text-center bg-destructive/10 rounded-lg py-2">
                  Este pedido foi cancelado.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrderDetailCard;
