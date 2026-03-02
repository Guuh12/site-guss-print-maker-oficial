import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  { name: "Lucas M.", text: "Qualidade incrível! O suporte do controle ficou perfeito, recomendo demais!", rating: 5 },
  { name: "Ana P.", text: "Encomendei um boneco personalizado e superou minhas expectativas. Detalhes incríveis!", rating: 5 },
  { name: "Rafael S.", text: "Entrega rápida e atendimento excelente. A luminária espacial é show!", rating: 5 },
  { name: "Carla B.", text: "Os chaveiros pixel art são muito fofos! Já comprei de presente para vários amigos.", rating: 5 },
];

const Reviews = () => (
  <section className="py-20 relative z-10 bg-muted/30">
    <div className="container mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-pixel text-lg md:text-xl text-primary text-glow-cyan text-center mb-12"
      >
        💬 AVALIAÇÕES
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviews.map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card p-6 rounded-xl border border-border"
          >
            <div className="flex gap-1 mb-3">
              {Array.from({ length: review.rating }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <p className="font-body text-foreground mb-3">"{review.text}"</p>
            <p className="font-display font-bold text-primary text-sm">{review.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Reviews;
