import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronDown, ChevronUp, MapPin, XCircle, Package, Hash, CreditCard } from "lucide-react";
import { formatBRL } from "@/lib/utils";
import { canCancelOrder, orderItems, type Order } from "@/types/order";

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "⏳ Pendente", color: "text-yellow-400" },
  in_production: { label: "🔧 Em Produção", color: "text-blue-400" },
  printed: { label: "🖨 Impresso", color: "text-purple-400" },
  shipped: { label: "📦 Enviado", color: "text-cyan-400" },
  completed: { label: "✅ Finalizado", color: "text-green-400" },
  cancelled: { label: "❌ Cancelado", color: "text-destructive" },
};

const progressSteps = [
  { key: "pending", label: "Recebido" },
  { key: "in_production", label: "Produção" },
  { key: "printed", label: "Impresso" },
  { key: "shipped", label: "Enviado" },
  { key: "completed", label: "Entregue" },
];

const paymentNote = (status: string) => {
  if (status === "cancelled") return "Pedido cancelado. Nenhum valor foi cobrado por aqui.";
  if (status === "pending") return "Pagamento ainda não confirmado. A cobrança entra quando o meio de pagamento estiver ativo.";
  return "Pedido seguido na produção. O comprovante de pagamento aparece aqui quando a cobrança estiver ligada.";
};

interface Props {
  order: Order;
  index: number;
}

const OrderDetailCard = ({ order, index }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const s = statusLabels[order.status] || statusLabels.pending;
  const products = orderItems(order.products);
  const orderDate = new Date(order.created_at);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-xl border border-border overflow-hidden"
    >
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
              {formatBRL(order.total)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 ml-4 shrink-0">
          <span className={`font-display text-xs font-bold ${s.color}`}>{s.label}</span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

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
              {order.status === "cancelled" ? (
                <p className="font-body text-sm text-destructive text-center bg-destructive/10 rounded-lg py-2">
                  Este pedido foi cancelado.
                </p>
              ) : (
                <ol className="grid grid-cols-5 gap-1">
                  {progressSteps.map((step, stepIndex) => {
                    const currentIndex = progressSteps.findIndex((item) => item.key === order.status);
                    const reached = currentIndex >= stepIndex;
                    return (
                      <li key={step.key} className="text-center">
                        <div className={`h-1.5 rounded-full mb-1 ${reached ? "bg-primary" : "bg-muted"}`} />
                        <span className={`font-body text-[10px] leading-tight ${reached ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.label}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              )}

              <div>
                <h3 className="font-pixel text-[8px] text-primary mb-2 flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5" /> PAGAMENTO
                </h3>
                <p className="font-body text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                  {paymentNote(order.status)}
                </p>
              </div>

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
                          {p.quantity}x {formatBRL(p.price)}
                        </p>
                      </div>
                      <span className="font-body text-sm text-foreground">
                        {formatBRL(p.quantity * p.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-pixel text-[8px] text-primary mb-2 flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5" /> CÓDIGO DO PEDIDO
                </h3>
                <p className="font-body text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 break-all">
                  {order.id}
                </p>
              </div>

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

              {canCancelOrder(order.status) && (
                <button
                  type="button"
                  onClick={() => navigate(`/pedido/${order.id}/cancelar`)}
                  className="w-full py-3 bg-destructive/10 text-destructive font-display font-bold rounded-lg border border-destructive/30 hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Cancelar Pedido
                </button>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrderDetailCard;
