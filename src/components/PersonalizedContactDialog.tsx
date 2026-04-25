import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PersonalizedContactDialogProps {
  productId: string;
  productName: string;
  triggerClassName?: string;
  triggerLabel?: string;
}

const PersonalizedContactDialog = ({
  productId,
  productName,
  triggerClassName,
  triggerLabel = "Entre em contato",
}: PersonalizedContactDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const formatPhone = (value: string) => {
    const raw = value.replace(/\D/g, "").slice(0, 11);
    if (raw.length > 6) return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
    if (raw.length > 2) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    if (raw.length > 0) return `(${raw}`;
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const description = [
        "Interesse em produto personalizado",
        `Produto: ${productName}`,
        `Codigo: ${productId}`,
      ].join("\n");

      const { error } = await supabase.from("custom_project_requests").insert({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        description,
      });

      if (error) throw error;

      toast.success("Recebemos seu contato! Vamos falar com voce em breve.");
      setName("");
      setEmail("");
      setPhone("");
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Nao foi possivel enviar agora. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className={triggerClassName}>
          <MessageCircle className="w-4 h-4" />
          {triggerLabel}
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fale com a gente sobre este personalizado</DialogTitle>
          <DialogDescription>
            Preencha seus dados para receber orientacoes e detalhes deste produto.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="font-body text-sm font-semibold text-foreground block mb-1">Nome</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg font-body text-foreground focus:border-primary focus:outline-none"
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label className="font-body text-sm font-semibold text-foreground block mb-1">Telefone</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              maxLength={15}
              className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg font-body text-foreground focus:border-primary focus:outline-none"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <label className="font-body text-sm font-semibold text-foreground block mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg font-body text-foreground focus:border-primary focus:outline-none"
              placeholder="voce@email.com"
            />
          </div>

          <DialogFooter>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground font-display font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Enviar contato"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalizedContactDialog;
