import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { SHOP_HOME } from "@/vitrine/siteMode";
import { VITRINE_HELLO, WHATSAPP_DISPLAY, whatsAppLink } from "@/vitrine/whatsapp";

const VitrineContactPage = () => (
  <div className="pt-8 pb-24">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-pixel text-xl text-primary text-glow-cyan text-center mb-4">CONTATO</h1>
        <p className="font-body text-lg text-muted-foreground text-center mb-8">
          Na vitrine, o jeito de falar com a Guss é o WhatsApp. Manda o que você viu, o que quer encomendar ou qualquer dúvida. A gente responde por lá.
        </p>

        <a
          href={whatsAppLink(VITRINE_HELLO)}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl border border-accent/40 bg-card p-6 md:p-8 box-glow-green hover:-translate-y-1 transition-transform"
        >
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
              <MessageCircle className="w-7 h-7" />
            </span>
            <div>
              <p className="font-display font-bold text-xl text-foreground">Chamar no WhatsApp</p>
              <p className="font-body text-lg text-accent">{WHATSAPP_DISPLAY}</p>
            </div>
          </div>
          <p className="font-body text-muted-foreground mt-4">
            Abre uma conversa já com uma mensagem pronta. Pode editar antes de enviar.
          </p>
        </a>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <a
            href="https://instagram.com/guss_print_maker"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 hover:border-secondary/50 transition-colors"
          >
            <Instagram className="w-5 h-5 text-secondary" />
            <span className="font-body text-foreground">@guss_print_maker</span>
          </a>
          <a
            href="mailto:gussprintmaker@gmail.com"
            className="rounded-xl border border-border bg-card p-4 flex items-center gap-3 hover:border-primary/50 transition-colors"
          >
            <Mail className="w-5 h-5 text-primary" />
            <span className="font-body text-foreground">gussprintmaker@gmail.com</span>
          </a>
        </div>

        <p className="font-body text-muted-foreground text-center mt-8">
          Prefere montar o carrinho e pagar pelo site?{" "}
          <Link to={SHOP_HOME} className="text-primary font-semibold hover:underline">
            Abrir a loja
          </Link>
        </p>
      </motion.div>
    </div>
  </div>
);

export default VitrineContactPage;
