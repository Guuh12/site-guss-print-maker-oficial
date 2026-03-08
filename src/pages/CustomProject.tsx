import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Send, X, FileBox } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarField from "@/components/StarField";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CustomProject = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", description: "" });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    const maxSize = 50 * 1024 * 1024;
    if (selected.size > maxSize) {
      toast.error("Arquivo muito grande! Máximo 50MB.");
      return;
    }
    setFile(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      const maxSize = 50 * 1024 * 1024;
      if (dropped.size > maxSize) {
        toast.error("Arquivo muito grande! Máximo 50MB.");
        return;
      }
      setFile(dropped);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fileUrl: string | null = null;
      let fileName: string | null = null;

      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("project-files")
          .upload(path, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("project-files")
          .getPublicUrl(path);

        fileUrl = urlData.publicUrl;
        fileName = file.name;
      }

      const { error } = await supabase.from("custom_project_requests").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        description: formData.description,
        file_url: fileUrl,
        file_name: fileName,
      });

      if (error) throw error;

      toast.success("Orçamento solicitado com sucesso! Entraremos em contato em breve. 🦆");
      setFormData({ name: "", email: "", phone: "", description: "" });
      setFile(null);
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao enviar solicitação. Tente novamente.");
    } finally {
      setLoading(false);
    }
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

              <div>
                <label className="font-display font-bold text-foreground text-sm mb-1 block">
                  Arquivo 3D <span className="text-muted-foreground font-normal">(opcional)</span>
                </label>

                {file ? (
                  <div className="flex items-center gap-3 p-4 bg-card border border-primary/30 rounded-xl">
                    <FileBox className="w-8 h-8 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-foreground text-sm truncate">{file.name}</p>
                      <p className="font-body text-muted-foreground text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button type="button" onClick={() => setFile(null)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer"
                  >
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="font-body text-muted-foreground">Arraste seu arquivo aqui ou clique para enviar</p>
                    <p className="font-pixel text-[8px] text-muted-foreground mt-1">STL, OBJ, 3MF até 50MB • não obrigatório</p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".stl,.obj,.3mf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 bg-secondary text-secondary-foreground font-display font-bold text-lg rounded-lg box-glow-purple flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-5 h-5" /> {loading ? "Enviando..." : "Solicitar Orçamento"}
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
