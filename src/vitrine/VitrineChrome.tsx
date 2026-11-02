import { Link } from "react-router-dom";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { SHOP_HOME } from "@/vitrine/siteMode";
import { VITRINE_HELLO, whatsAppLink } from "@/vitrine/whatsapp";

export const VitrineBanner = () => (
  <div className="sticky top-16 z-40 mt-16 border-y border-primary/30 bg-background/95 backdrop-blur-xl">
    <div className="container mx-auto px-4 py-3 flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between">
      <p className="font-body text-base text-foreground leading-snug">
        <span className="font-display font-bold text-primary">Você está na vitrine.</span>{" "}
        Dá para ver os produtos, os preços e os detalhes. Aqui não tem carrinho: se quiser uma peça, o pedido segue pelo WhatsApp.
      </p>
      <div className="flex flex-wrap gap-2 shrink-0">
        <a
          href={whatsAppLink(VITRINE_HELLO)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-accent text-accent-foreground font-display font-bold text-sm rounded-lg inline-flex items-center gap-2 box-glow-green"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
        <Link
          to={SHOP_HOME}
          className="px-4 py-2 border border-primary/40 text-primary font-display font-bold text-sm rounded-lg inline-flex items-center gap-2 hover:bg-primary/10 transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          Quero comprar no site
        </Link>
      </div>
    </div>
  </div>
);

export const VitrineWhatsAppFloat = () => (
  <a
    href={whatsAppLink(VITRINE_HELLO)}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-5 right-4 z-50 px-4 py-3 bg-accent text-accent-foreground font-display font-bold rounded-full inline-flex items-center gap-2 box-glow-green animate-pulse-glow"
  >
    <MessageCircle className="w-5 h-5" />
    WhatsApp
  </a>
);
