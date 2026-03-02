import { motion } from "framer-motion";
import { Lightbulb, Cpu, Printer, Truck } from "lucide-react";

const steps = [
  { icon: Lightbulb, title: "Escolha ou Envie", desc: "Você escolhe um produto ou envia sua ideia", color: "text-primary" },
  { icon: Cpu, title: "Modelagem", desc: "Modelamos ou ajustamos seu arquivo 3D", color: "text-secondary" },
  { icon: Printer, title: "Impressão", desc: "Impressão 3D de alta qualidade", color: "text-accent" },
  { icon: Truck, title: "Envio", desc: "Enviamos para sua casa com segurança", color: "text-neon-pink" },
];

const HowItWorks = () => (
  <section className="py-20 relative z-10">
    <div className="container mx-auto px-4">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-pixel text-lg md:text-xl text-primary text-glow-cyan text-center mb-12"
      >
        🧩 COMO FUNCIONA
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center"
          >
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className={`inline-flex items-center justify-center w-20 h-20 rounded-xl bg-muted border border-border mb-4 ${step.color}`}
            >
              <step.icon className="w-9 h-9" />
            </motion.div>
            <div className="font-pixel text-xs text-muted-foreground mb-2">0{i + 1}</div>
            <h3 className="font-display font-bold text-foreground text-lg">{step.title}</h3>
            <p className="font-body text-muted-foreground mt-1">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
