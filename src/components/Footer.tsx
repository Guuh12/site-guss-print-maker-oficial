import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, MessageCircle } from "lucide-react";
import logo from "@/assets/logo-pixel.png";

const Footer = () => (
  <footer className="relative z-10 bg-card border-t border-border py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="Guss" className="w-10 h-10" />
            <span className="font-display font-bold text-lg text-foreground">
              GUSS <span className="text-primary">PRINT MAKER</span>
            </span>
          </div>
          <p className="font-body text-muted-foreground">
            Transformamos suas ideias em realidade com impressão 3D de alta qualidade. 🦆
          </p>
          <div className="mt-3 inline-block px-3 py-1 rounded-full bg-muted border border-border">
            <span className="font-pixel text-[8px] text-primary">🏷 Impresso com tecnologia 3D</span>
          </div>
        </div>

        <div>
          <h3 className="font-display font-bold text-foreground mb-4">Links</h3>
          <div className="flex flex-col gap-2">
            {[
              { to: "/", label: "Home" },
              { to: "/produtos", label: "Produtos" },
              { to: "/projeto-personalizado", label: "Projeto 3D" },
              { to: "/contato", label: "Contato" },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="font-body text-muted-foreground hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display font-bold text-foreground mb-4">Contato</h3>
          <div className="flex flex-col gap-3">
            <a href="https://wa.me/5511966451672" target="_blank" rel="noopener" className="flex items-center gap-2 font-body text-muted-foreground hover:text-accent transition-colors">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <a href="https://instagram.com/guss_print_maker" target="_blank" rel="noopener" className="flex items-center gap-2 font-body text-muted-foreground hover:text-secondary transition-colors">
              <Instagram className="w-4 h-4" /> @guss_print_maker
            </a>
            <a href="mailto:gussprintmaker@gmail.com" className="flex items-center gap-2 font-body text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-4 h-4" /> gussprintmaker@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border text-center">
        <p className="font-pixel text-[8px] text-muted-foreground">
          © 2026 GUSS PRINT MAKER — Todos os direitos reservados 🦆
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
