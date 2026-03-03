import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo-pixel.png";

const Navbar = () => {
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Home" },
    { to: "/produtos", label: "Produtos" },
    { to: "/projeto-personalizado", label: "Projeto 3D" },
    { to: "/contato", label: "Contato" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Guss Print Maker" className="w-10 h-10" />
          <span className="font-display font-bold text-lg text-foreground hidden sm:block">
            GUSS <span className="text-primary">PRINT</span>
          </span>
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

        <div className="flex items-center gap-3">
          {/* User Menu */}
          {user ? (
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
                    <button onClick={() => { signOut(); setUserMenuOpen(false); navigate("/"); }} className="flex items-center gap-2 px-4 py-3 font-body text-sm text-destructive hover:bg-muted transition-colors w-full text-left">
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

          <Link to="/carrinho" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
            <ShoppingCart className="w-6 h-6 text-foreground" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center font-pixel"
              >
                {itemCount}
              </motion.span>
            )}
          </Link>

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
              {user ? (
                <>
                  <Link to="/minha-conta" onClick={() => setMobileOpen(false)} className="font-body text-lg font-semibold text-muted-foreground hover:text-primary py-2">Minha Conta</Link>
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="font-body text-lg font-semibold text-destructive py-2 text-left">Sair</button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileOpen(false)} className="font-body text-lg font-semibold text-primary py-2">Entrar</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
