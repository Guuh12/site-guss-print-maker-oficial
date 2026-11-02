import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, User, LogOut, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo-pixel.png";
import { useSiteMode } from "@/vitrine/siteMode";
import { VITRINE_HELLO, whatsAppLink } from "@/vitrine/whatsapp";

const Navbar = () => {
  const { itemCount, notice } = useCart();
  const { user, signOut } = useAuth();
  const { isVitrine, path } = useSiteMode();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const navigate = useNavigate();
  const home = path("/");

  useEffect(() => {
    if (!notice) return;
    setCartPulse(true);
    setShowNotice(true);
    const pulseTimer = setTimeout(() => setCartPulse(false), 650);
    const noticeTimer = setTimeout(() => setShowNotice(false), 2400);
    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(noticeTimer);
    };
  }, [notice]);

  const links = [
    { to: home, label: "Home" },
    { to: path("/produtos"), label: "Produtos" },
    { to: path("/projeto-personalizado"), label: "Projeto 3D" },
    { to: path("/contato"), label: "Contato" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to={home} className="flex items-center gap-2">
          <img src={logo} alt="Guss Print Maker" className="w-10 h-10" />
          <span className="font-display font-bold text-lg text-foreground hidden sm:block">
            GUSS <span className="text-primary">PRINT</span>
          </span>
          {isVitrine && (
            <span className="font-pixel text-[8px] text-primary border border-primary/40 rounded px-1.5 py-1">
              VITRINE
            </span>
          )}
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-body text-lg font-semibold text-muted-foreground hover:text-primary transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/" className="hidden lg:inline font-body font-semibold text-sm text-muted-foreground hover:text-primary transition-colors">
            Trocar versão
          </Link>

          {isVitrine ? (
            <a
              href={whatsAppLink(VITRINE_HELLO)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-accent text-accent-foreground font-display font-bold text-sm rounded-lg inline-flex items-center gap-2 box-glow-green"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-primary" />
                )}
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 top-12 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    <Link to="/minha-conta" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 font-body text-sm text-foreground hover:bg-muted transition-colors">
                      <User className="w-4 h-4" /> Minha Conta
                    </Link>
                    <button onClick={() => { signOut(); setUserMenuOpen(false); navigate(home); }} className="flex items-center gap-2 px-4 py-3 font-body text-sm text-destructive hover:bg-muted transition-colors w-full text-left">
                      <LogOut className="w-4 h-4" /> Sair
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/auth" className="hidden md:flex px-4 py-2 font-display font-bold text-sm text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">
              Entrar
            </Link>
          )}

          {!isVitrine && (
            <div className="relative">
              <Link to="/carrinho" className="relative block p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Carrinho">
                <motion.span
                  className="block"
                  animate={cartPulse ? { scale: [1, 1.28, 0.92, 1.08, 1], rotate: [0, -16, 10, 0] } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.55 }}
                >
                  <ShoppingCart className={`w-6 h-6 transition-colors ${cartPulse ? "text-primary" : "text-foreground"}`} />
                </motion.span>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0.4 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center font-pixel"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </Link>
              <AnimatePresence>
                {showNotice && notice && (
                  <motion.div
                    key={notice.token}
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-12 w-64 bg-card border border-primary rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.55)] p-3 flex items-center gap-3 z-[110]"
                  >
                    <img src={notice.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="font-pixel text-[8px] text-primary">ADICIONADO</p>
                      <p className="font-body text-sm text-foreground leading-snug line-clamp-2">{notice.name}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-3">
              {links.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="font-body text-lg font-semibold text-muted-foreground hover:text-primary py-2">
                  {link.label}
                </Link>
              ))}
              {isVitrine ? (
                <a href={whatsAppLink(VITRINE_HELLO)} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="font-body text-lg font-semibold text-accent py-2">WhatsApp</a>
              ) : user ? (
                <>
                  <Link to="/minha-conta" onClick={() => setMobileOpen(false)} className="font-body text-lg font-semibold text-muted-foreground hover:text-primary py-2">Minha Conta</Link>
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="font-body text-lg font-semibold text-destructive py-2 text-left">Sair</button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="font-body text-lg font-semibold text-primary py-2">Entrar</Link>
              )}
              <Link to="/" onClick={() => setMobileOpen(false)} className="font-body text-lg font-semibold text-muted-foreground hover:text-primary py-2">Trocar versão</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
