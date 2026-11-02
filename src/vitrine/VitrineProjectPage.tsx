import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageCircle, Sparkles } from "lucide-react";
import { useSiteMode } from "@/vitrine/siteMode";
import { whatsAppLink } from "@/vitrine/whatsapp";

const MESSAGE =
  "Olá! Vi a vitrine da Guss Print Maker e quero um projeto personalizado. Vou contar a ideia por aqui.";

const VitrineProjectPage = () => {
  const { path } = useSiteMode();

  return (
    <div className="pt-8 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="font-pixel text-lg md:text-xl text-primary text-glow-cyan mb-4">PROJETO PERSONALIZADO</h1>
          <p className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Uma peça que ainda não está na vitrine
          </p>
          <p className="font-body text-lg text-muted-foreground mt-4">
            Descreve a ideia no WhatsApp: o que é, o tamanho, a cor e se você já tem um arquivo STL, OBJ ou 3MF. A gente responde com prazo e valor. Nesta versão não tem formulário nem envio de arquivo pelo site.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
          {[
            "Conta a ideia no WhatsApp",
            "Combinamos modelo, material e prazo",
            "A peça é impressa e enviada para você",
          ].map((step, index) => (
            <div key={step} className="rounded-xl border border-border bg-card p-4">
              <p className="font-pixel text-[8px] text-secondary mb-2">0{index + 1}</p>
              <p className="font-body text-foreground">{step}</p>
            </div>
          ))}
        </div>

        <motion.a
          href={whatsAppLink(MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-8 w-full py-4 bg-accent text-accent-foreground font-display font-bold text-lg rounded-lg box-glow-green flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          Pedir no WhatsApp
        </motion.a>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Link to={path("/produtos")} className="px-5 py-3 border border-primary/40 text-primary font-display font-bold rounded-lg text-center hover:bg-primary/10 transition-colors">
            Ver produtos da vitrine
          </Link>
          <Link to="/loja" className="px-5 py-3 text-muted-foreground font-body font-semibold inline-flex items-center justify-center gap-2 hover:text-foreground">
            <Sparkles className="w-4 h-4" />
            Enviar o projeto pela loja
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VitrineProjectPage;
