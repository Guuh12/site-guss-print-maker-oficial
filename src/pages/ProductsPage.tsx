import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import PersonalizedContactDialog from "@/components/PersonalizedContactDialog";
import ProductOptionsDialog from "@/components/ProductOptionsDialog";

const categories = ["Todos", "Cuidados Pessoais", "Bonecos", "Personalizados", "Utilidades", "Outros"];

const ProductsPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const { addItem } = useCart();

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Todos" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-background">
      <StarField />
      <Navbar />
      <div className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <h1 className="font-pixel text-xl text-primary text-glow-cyan text-center mb-8">🛍 PRODUTOS</h1>

          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-1.5 rounded-full font-body font-semibold text-sm transition-all ${
                    category === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-card rounded-xl border border-border overflow-hidden group"
              >
                <Link to={`/produto/${product.id}`}>
                  <div className="aspect-square overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </Link>
                <div className="p-4">
                  <span className="font-pixel text-[10px] text-primary">{product.category}</span>
                  <h3 className="font-display font-bold text-foreground mt-1">{product.name}</h3>
                  <p className="font-display text-2xl font-bold text-primary mt-2">
                    {product.priceLabel || `R$ ${product.price.toFixed(2).replace(".", ",")}`}
                  </p>
                  {product.category === "Personalizados" ? (
                    <PersonalizedContactDialog
                      productId={product.id}
                      productName={product.name}
                      triggerClassName="mt-3 w-full py-2.5 bg-secondary text-secondary-foreground font-display font-bold rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-secondary/30 transition-all"
                    />
                  ) : product.purchaseOptions ? (
                    <div className="mt-3 space-y-2">
                      <button
                        onClick={() =>
                          addItem({
                            id: product.id,
                            name: `${product.name} (${product.purchaseOptions?.defaultSelectionLabel || "padrao"})`,
                            price: product.price,
                            image: product.image,
                          })
                        }
                        className="w-full py-2.5 bg-primary text-primary-foreground font-display font-bold rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all"
                      >
                        <ShoppingCart className="w-4 h-4" /> Adicionar ({product.purchaseOptions.defaultSelectionLabel || "padrao"})
                      </button>
                      <ProductOptionsDialog
                        productId={product.id}
                        productName={product.name}
                        productPrice={product.price}
                        productImage={product.image}
                        purchaseOptions={product.purchaseOptions}
                        triggerClassName="w-full py-2.5 bg-muted text-foreground font-display font-bold rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-border"
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })}
                      className="mt-3 w-full py-2.5 bg-primary text-primary-foreground font-display font-bold rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all"
                    >
                      <ShoppingCart className="w-4 h-4" /> Adicionar
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="font-pixel text-sm text-muted-foreground">Nenhum produto encontrado 😢</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
