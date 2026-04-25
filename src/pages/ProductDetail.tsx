import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, Package, Palette, Ruler, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";
import ProductGallery from "@/components/ProductGallery";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import PersonalizedContactDialog from "@/components/PersonalizedContactDialog";
import ProductOptionsDialog from "@/components/ProductOptionsDialog";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-pixel text-primary">Produto não encontrado</p>
      </div>
    );
  }

  const specs = [
    { icon: Package, label: "Material", value: product.material },
    { icon: Palette, label: "Cor", value: product.color },
    { icon: Ruler, label: "Tamanho", value: product.size },
    { icon: Clock, label: "Produção", value: product.productionTime },
  ];

  return (
    <div className="min-h-screen bg-background">
      <StarField />
      <Navbar />
      <div className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <Link to="/produtos" className="inline-flex items-center gap-2 font-body text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ProductGallery
                mainImage={product.image}
                media={product.media}
                productName={product.name}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="font-pixel text-xs text-primary">{product.category}</span>
              <h1 className="font-display text-3xl font-bold text-foreground mt-2">{product.name}</h1>
              <p className="font-display text-4xl font-bold text-primary mt-4">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </p>
              <p className="font-body text-lg text-muted-foreground mt-4">{product.description}</p>

              <div className="grid grid-cols-2 gap-3 mt-6">
                {specs.map((spec) => (
                  <div key={spec.label} className="bg-muted rounded-lg p-3 border border-border">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <spec.icon className="w-4 h-4" />
                      <span className="font-display text-sm font-bold">{spec.label}</span>
                    </div>
                    <p className="font-body text-foreground">{spec.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-8">
                {product.category === "Personalizados" ? (
                  <PersonalizedContactDialog
                    productId={product.id}
                    productName={product.name}
                    triggerLabel="Entre em contato"
                    triggerClassName="flex-1 py-3 bg-secondary text-secondary-foreground font-display font-bold rounded-lg flex items-center justify-center gap-2"
                  />
                ) : product.purchaseOptions ? (
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        addItem({
                          id: product.id,
                          name: `${product.name} (${product.purchaseOptions?.defaultSelectionLabel || "padrao"})`,
                          price: product.price,
                          image: product.image,
                        })
                      }
                      className="py-3 bg-primary text-primary-foreground font-display font-bold rounded-lg flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" /> Adicionar ({product.purchaseOptions.defaultSelectionLabel || "padrao"})
                    </motion.button>
                    <ProductOptionsDialog
                      productId={product.id}
                      productName={product.name}
                      productPrice={product.price}
                      productImage={product.image}
                      purchaseOptions={product.purchaseOptions}
                      triggerClassName="py-3 bg-muted text-foreground font-display font-bold rounded-lg flex items-center justify-center gap-2 border border-border hover:bg-border transition-colors"
                    />
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })}
                    className="flex-1 py-3 bg-primary text-primary-foreground font-display font-bold rounded-lg flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" /> Adicionar ao Carrinho
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
