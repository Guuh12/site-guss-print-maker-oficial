import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";
import { useCart } from "@/contexts/CartContext";

const CartPage = () => {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <StarField />
        <Navbar />
        <div className="pt-24 flex flex-col items-center justify-center min-h-[60vh] relative z-10">
          <ShoppingBag className="w-20 h-20 text-muted-foreground mb-4" />
          <p className="font-pixel text-sm text-muted-foreground mb-4">Seu carrinho está vazio</p>
          <Link to="/produtos">
            <button className="px-6 py-3 bg-primary text-primary-foreground font-display font-bold rounded-lg">
              Explorar Produtos
            </button>
          </Link>
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
          <h1 className="font-pixel text-xl text-primary text-glow-cyan text-center mb-8">🛒 CARRINHO</h1>

          <div className="space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-4 bg-card rounded-xl border border-border p-4"
              >
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-display font-bold text-foreground">{item.name}</h3>
                  <p className="font-display text-primary font-bold">R$ {item.price.toFixed(2).replace(".", ",")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 bg-muted rounded flex items-center justify-center hover:bg-border transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-display font-bold w-8 text-center text-foreground">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 bg-muted rounded flex items-center justify-center hover:bg-border transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button onClick={() => removeItem(item.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 bg-card rounded-xl border border-border p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-display text-lg text-foreground">Total</span>
              <span className="font-display text-3xl font-bold text-primary">R$ {total.toFixed(2).replace(".", ",")}</span>
            </div>
            <Link to="/checkout">
              <button className="w-full py-3 bg-accent text-accent-foreground font-display font-bold text-lg rounded-lg box-glow-green hover:shadow-lg transition-all">
                Finalizar Compra 🚀
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
