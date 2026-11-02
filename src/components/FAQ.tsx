import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSiteMode } from "@/vitrine/siteMode";

const faqs = [
  { q: "Quanto tempo leva para produzir?", a: "O prazo varia de 2 a 7 dias úteis dependendo da complexidade do produto. Peças personalizadas podem levar um pouco mais." },
  { q: "Vocês fazem modelagem 3D?", a: "Sim! Temos uma equipe de modelagem que pode criar seu modelo do zero ou ajustar arquivos existentes." },
  { q: "Qual material é usado?", a: "Trabalhamos com PLA, PLA+, ABS, PETG e Resina. Cada material tem características específicas para diferentes usos." },
  { q: "Como funciona o frete?", a: "Enviamos para todo o Brasil. No checkout, informe o CEP para ver retirada, PAC e SEDEX com o valor e o prazo." },
  { q: "Posso enviar meu arquivo STL?", a: "Claro! Aceitamos arquivos STL, OBJ e 3MF. Basta usar nossa página de Projeto Personalizado para enviar." },
  { q: "Vocês fazem projetos sob encomenda?", a: "Sim! Criamos peças exclusivas sob encomenda. Entre em contato para solicitar um orçamento personalizado." },
];

const FAQ = () => {
  const { isVitrine } = useSiteMode();
  const items = isVitrine
    ? faqs.map((faq) => {
        if (faq.q === "Como funciona o frete?") {
          return { ...faq, a: "Enviamos para todo o Brasil. Na vitrine, o valor do frete é combinado com você pelo WhatsApp." };
        }
        if (faq.q === "Posso enviar meu arquivo STL?") {
          return { ...faq, a: "Pode sim. Na vitrine, manda o arquivo ou descreve a ideia pelo WhatsApp. Aceitamos STL, OBJ e 3MF." };
        }
        return faq;
      })
    : faqs;

  return (
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
        {items.map((faq, i) => (
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
};

export default FAQ;
