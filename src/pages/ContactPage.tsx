import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, Instagram, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";
import { toast } from "sonner";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada com sucesso! 🦆");
    setFormData({ name: "", email: "", message: "" });
  };

  const contacts = [
    { icon: MessageCircle, label: "WhatsApp", value: "(11) 96645-1672", href: "https://wa.me/5511966451672", color: "text-accent" },
    { icon: Instagram, label: "Instagram", value: "@guss_print_maker", href: "https://instagram.com/guss_print_maker", color: "text-secondary" },
    { icon: Mail, label: "E-mail", value: "gussprintmaker@gmail.com", href: "mailto:gussprintmaker@gmail.com", color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <StarField />
      <Navbar />
      <div className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-pixel text-xl text-primary text-glow-cyan text-center mb-8">📞 CONTATO</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="font-display font-bold text-foreground text-xl mb-4">Fale Conosco</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Seu nome"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-card border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-card border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                />
                <textarea
                  placeholder="Sua mensagem..."
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-card border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-primary text-primary-foreground font-display font-bold rounded-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Enviar Mensagem
                </motion.button>
              </form>
            </div>

            <div className="space-y-4">
              <h2 className="font-display font-bold text-foreground text-xl mb-4">Nossos Canais</h2>
              {contacts.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-4 bg-card rounded-xl border border-border p-4 hover:border-primary transition-colors"
                >
                  <contact.icon className={`w-8 h-8 ${contact.color}`} />
                  <div>
                    <p className="font-display font-bold text-foreground">{contact.label}</p>
                    <p className="font-body text-muted-foreground">{contact.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
