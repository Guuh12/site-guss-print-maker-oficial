import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";
import { useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }: { product: typeof products[0] }) => {
  const { addItem } = useCart();
  const [coinAnim, setCoinAnim] = useState(false);

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    setCoinAnim(true);
    setTimeout(() => setCoinAnim(false), 700);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="relative bg-card rounded-xl border border-border overflow-hidden group"
    >
      <Link to={`/produto/${product.id}`}>
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>

      <div className="p-4">
        <span className="font-pixel text-[10px] text-primary">{product.category}</span>
        <h3 className="font-display font-bold text-foreground mt-1">{product.name}</h3>
        <p className="font-display text-2xl font-bold text-primary mt-2">
          R$ {product.price.toFixed(2).replace(".", ",")}
        </p>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="mt-3 w-full py-2.5 bg-primary text-primary-foreground font-display font-bold rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-primary/30"
          >
            <ShoppingCart className="w-4 h-4" />
            Adicionar
          </motion.button>

          {coinAnim && (
            <motion.span
              className="absolute top-0 left-1/2 font-pixel text-primary text-sm"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              +1 🪙
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const FeaturedProducts = () => {
  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-pixel text-lg md:text-xl text-primary text-glow-cyan mb-2">
            🛍 PRODUTOS
          </h2>
          <p className="font-display text-2xl text-foreground font-bold">
            Destaques da Loja
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/produtos">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 border-glow-cyan text-primary font-display font-bold rounded-lg"
            >
              Ver Todos os Produtos →
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
