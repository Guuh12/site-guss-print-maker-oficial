import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Quanto tempo leva para produzir?", a: "O prazo varia de 2 a 7 dias úteis dependendo da complexidade do produto. Peças personalizadas podem levar um pouco mais." },
  { q: "Vocês fazem modelagem 3D?", a: "Sim! Temos uma equipe de modelagem que pode criar seu modelo do zero ou ajustar arquivos existentes." },
  { q: "Qual material é usado?", a: "Trabalhamos com PLA, PLA+, ABS, PETG e Resina. Cada material tem características específicas para diferentes usos." },
  { q: "Como funciona o frete?", a: "Enviamos para todo o Brasil via Correios ou transportadora. O frete é calculado automaticamente pelo CEP no checkout." },
  { q: "Posso enviar meu arquivo STL?", a: "Claro! Aceitamos arquivos STL, OBJ e 3MF. Basta usar nossa página de Projeto Personalizado para enviar." },
  { q: "Vocês fazem projetos sob encomenda?", a: "Sim! Criamos peças exclusivas sob encomenda. Entre em contato para solicitar um orçamento personalizado." },
];

const FAQ = () => (
  <section className="py-20 relative z-10">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="font-pixel text-lg md:text-xl text-primary text-glow-cyan text-center mb-12"
      >
        ❓ FAQ
      </motion.h2>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <AccordionItem value={`faq-${i}`} className="bg-card border border-border rounded-xl px-4">
              <AccordionTrigger className="font-display font-bold text-foreground hover:text-primary py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQ;
