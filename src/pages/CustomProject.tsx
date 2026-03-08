import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";
import { toast } from "sonner";

const CustomProject = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", description: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Orçamento solicitado com sucesso! Entraremos em contato em breve. 🦆");
  };

  return (
    <div className="min-h-screen bg-background">
      <StarField />
      <Navbar />
      <div className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-pixel text-xl text-primary text-glow-cyan text-center mb-3">🧠 PROJETO PERSONALIZADO</h1>
            <p className="font-body text-lg text-muted-foreground text-center mb-8">
              Peça sua impressão 3D exclusiva!
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-display font-bold text-foreground text-sm mb-1 block">Nome</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-card border border-border rounded-lg font-body text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-display font-bold text-foreground text-sm mb-1 block">E-mail</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-card border border-border rounded-lg font-body text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-display font-bold text-foreground text-sm mb-1 block">Telefone <span className="text-muted-foreground font-normal">(opcional)</span></label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-card border border-border rounded-lg font-body text-foreground focus:outline-none focus:border-primary"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label className="font-display font-bold text-foreground text-sm mb-1 block">Descrição do Projeto</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-card border border-border rounded-lg font-body text-foreground focus:outline-none focus:border-primary resize-none"
                  placeholder="Descreva o que você deseja imprimir..."
                />
              </div>

              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                <p className="font-body text-muted-foreground">Arraste seu arquivo STL aqui ou clique para enviar</p>
                <p className="font-pixel text-[8px] text-muted-foreground mt-1">STL, OBJ, 3MF até 50MB</p>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-secondary text-secondary-foreground font-display font-bold text-lg rounded-lg box-glow-purple flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" /> Solicitar Orçamento
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomProject;
