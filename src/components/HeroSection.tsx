import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Rocket, Sparkles } from "lucide-react";
import NeonPortal from "@/components/NeonPortal";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 gradient-space opacity-70" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <NeonPortal />

          <h1 className="font-pixel text-2xl md:text-4xl text-foreground mb-2 text-glow-cyan tracking-wider">
            GUSS PRINT MAKER
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-display text-lg md:text-xl text-primary mt-2 mb-8 max-w-2xl"
          >
            Impressão 3D Geek com Criatividade Sem Limites 🚀
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
            <Link to="/produtos" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(140 100% 50% / 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-8 py-4 bg-accent text-accent-foreground font-display font-bold text-lg rounded-lg box-glow-green flex items-center justify-center gap-2"
              >
                <Rocket className="w-5 h-5" />
                Explorar Produtos
              </motion.button>
            </Link>

            <Link to="/projeto-personalizado" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(270 80% 60% / 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-8 py-4 bg-secondary text-secondary-foreground font-display font-bold text-lg rounded-lg box-glow-purple flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Projeto Personalizado
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
