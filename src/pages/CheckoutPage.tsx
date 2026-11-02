import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, CreditCard, Check, Truck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { formatBRL } from "@/lib/utils";
import {
  formatCep,
  isMissingShippingColumn,
  isValidCep,
  quoteShipping,
  type ShippingOption,
} from "@/lib/shipping";

const CheckoutPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [quoting, setQuoting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const quoteRequest = useRef(0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const selected = options.find((option) => option.code === selectedCode) ?? null;
  const shippingCost = selected?.price ?? 0;
  const grandTotal = total + shippingCost;

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

  useEffect(() => {
    quoteRequest.current += 1;
    setOptions([]);
    setSelectedCode("");
    setQuoting(false);
  }, [cep, itemCount]);

  const handleQuote = async () => {
    if (!isValidCep(cep)) {
      toast.error("CEP inválido", { description: "Informe os 8 dígitos do CEP de entrega." });
      return;
    }

    const request = ++quoteRequest.current;
    setQuoting(true);
    try {
      const quoted = await quoteShipping({ destinationCep: cep, itemCount });
      if (request !== quoteRequest.current) return;
      setOptions(quoted);
      setSelectedCode("");
    } catch (error: unknown) {
      if (request !== quoteRequest.current) return;
      const description = error instanceof Error ? error.message : "Não foi possível calcular a entrega.";
      toast.error("Entrega", { description });
    } finally {
      if (request === quoteRequest.current) setQuoting(false);
    }
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selected) return;
    setLoading(true);

    const deliveryAddress = selected.pickup ? "Retirada com o Guss Print Maker" : address.trim();
    const order = {
      user_id: user.id,
      products: items.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      total: grandTotal,
      address: deliveryAddress,
      status: "pending" as const,
    };

    try {
      let { error } = await supabase.from("orders").insert({
        ...order,
        shipping_method: selected.name,
        shipping_cost: selected.price,
        shipping_deadline: selected.deadlineLabel,
      });

      if (error && isMissingShippingColumn(error.message)) {
        const fallback = await supabase.from("orders").insert({
          ...order,
          address: selected.pickup
            ? deliveryAddress
            : `Frete: ${selected.name} — ${formatBRL(selected.price)} — ${selected.deadlineLabel}\n${deliveryAddress}`,
        });
        error = fallback.error;
      }

      if (error) throw new Error(error.message);
      clearCart();
      setSuccess(true);
      toast.success("Pedido realizado! 🚀", { description: "Acompanhe em Minha Conta." });
    } catch (error: unknown) {
      const description = error instanceof Error ? error.message : "Não foi possível registrar o pedido.";
      toast.error("Erro", { description });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) return null;

  if (success) {
    return (
        <div className="pt-24 pb-16 flex flex-col items-center justify-center min-h-[70vh]">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 rounded-full bg-accent/20 border-4 border-accent flex items-center justify-center mb-6">
            <Check className="w-12 h-12 text-accent" />
          </motion.div>
          <h1 className="font-pixel text-sm text-accent text-glow-green mb-2">PEDIDO CONFIRMADO!</h1>
          <p className="font-body text-muted-foreground mb-6">Seu pedido foi registrado com sucesso.</p>
          <div className="flex flex-col sm:flex-row gap-4 px-6 w-full max-w-md">
            <button onClick={() => navigate("/minha-conta")} className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-display font-bold rounded-lg text-center">Meus Pedidos</button>
            <button onClick={() => navigate("/produtos")} className="flex-1 px-6 py-3 bg-muted text-foreground font-display font-bold rounded-lg border border-border text-center">Continuar Comprando</button>
          </div>
        </div>
    );
  }

  return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-pixel text-xl text-primary text-glow-cyan text-center mb-8">💳 CHECKOUT</h1>

          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-2 bg-card rounded-2xl border border-border p-5">
              <h2 className="font-pixel text-[10px] text-primary mb-4">RESUMO</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-body text-sm text-foreground">{item.name}</p>
                      <p className="font-body text-xs text-muted-foreground">{item.quantity}x {formatBRL(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-body text-sm text-muted-foreground">Produtos</span>
                  <span className="font-body text-sm text-foreground">{formatBRL(total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-sm text-muted-foreground">Frete</span>
                  <span className="font-body text-sm text-foreground">
                    {selected ? (selected.price === 0 ? "Grátis" : formatBRL(selected.price)) : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-display font-bold text-foreground">Total</span>
                  <span className="font-display text-2xl font-bold text-primary">{formatBRL(grandTotal)}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleOrder} className="md:col-span-3 bg-card rounded-2xl border border-border p-6 space-y-4">
              <div>
                <h2 className="font-pixel text-[10px] text-primary mb-2 flex items-center gap-2"><Truck className="w-4 h-4" /> ENTREGA</h2>
                <div className="flex gap-2">
                  <input
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="CEP"
                    value={cep}
                    onChange={(e) => setCep(formatCep(e.target.value))}
                    className="flex-1 px-4 py-3 bg-muted border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleQuote}
                    disabled={quoting}
                    className="px-4 py-3 bg-primary text-primary-foreground font-display font-bold rounded-xl disabled:opacity-50"
                  >
                    {quoting ? "..." : "Calcular"}
                  </button>
                </div>
                <p className="font-pixel text-[8px] text-muted-foreground mt-3">
                  * Cotação de exemplo. A API dos Correios está no código, desligada até o contrato.
                </p>
              </div>

              {options.length > 0 && (
                <div className="space-y-2">
                  {options.map((option) => {
                    const active = option.code === selectedCode;
                    return (
                      <button
                        key={option.code}
                        type="button"
                        onClick={() => setSelectedCode(option.code)}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${
                          active ? "border-primary bg-primary/10" : "border-border bg-muted hover:border-primary/40"
                        }`}
                      >
                        <span>
                          <span className="block font-display font-bold text-sm text-foreground">{option.name}</span>
                          <span className="block font-body text-xs text-muted-foreground">{option.deadlineLabel}</span>
                        </span>
                        <span className="font-display font-bold text-primary">
                          {option.price === 0 ? "Grátis" : formatBRL(option.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div>
                <h2 className="font-pixel text-[10px] text-primary mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> ENDEREÇO DE ENTREGA</h2>
                <textarea
                  placeholder={selected?.pickup ? "Não precisa de endereço na retirada" : "Endereço completo (Rua, número, complemento, bairro, cidade, estado, CEP)"}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required={!selected?.pickup}
                  disabled={selected?.pickup}
                  rows={4}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none disabled:opacity-50"
                />
              </div>

              <div className="pt-2">
                <h2 className="font-pixel text-[10px] text-primary mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4" /> PAGAMENTO</h2>
                <p className="font-pixel text-[8px] text-muted-foreground mb-4">* Integração de pagamento em breve. O pedido será registrado como pendente.</p>
              </div>

              <button
                type="submit"
                disabled={loading || !selected}
                className="w-full py-4 bg-accent text-accent-foreground font-display font-bold text-lg rounded-xl box-glow-green hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? "Processando..." : "Confirmar Pedido 🚀"}
              </button>
            </form>
          </div>
        </div>
      </div>
  );
};

export default CheckoutPage;
