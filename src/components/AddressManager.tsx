import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Pencil, Trash2, X, Check, Home, Building } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Address {
  id: string;
  label: string;
  type: "delivery" | "billing";
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
}

const emptyAddress: Omit<Address, "id"> = {
  label: "",
  type: "delivery",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  zip_code: "",
  is_default: false,
};

const AddressManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyAddress);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchAddresses();
  }, [user]);

  const fetchAddresses = async () => {
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    setAddresses((data as Address[]) || []);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      if (editing) {
        const { error } = await supabase
          .from("addresses")
          .update({ ...form })
          .eq("id", editing);
        if (error) throw error;
        toast({ title: "Endereço atualizado! ✅" });
      } else {
        const { error } = await supabase
          .from("addresses")
          .insert({ ...form, user_id: user.id });
        if (error) throw error;
        toast({ title: "Endereço adicionado! ✅" });
      }
      await fetchAddresses();
      resetForm();
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (addr: Address) => {
    setForm({
      label: addr.label,
      type: addr.type,
      street: addr.street,
      number: addr.number,
      complement: addr.complement,
      neighborhood: addr.neighborhood,
      city: addr.city,
      state: addr.state,
      zip_code: addr.zip_code,
      is_default: addr.is_default,
    });
    setEditing(addr.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
    } else {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast({ title: "Endereço removido" });
    }
  };

  const resetForm = () => {
    setForm(emptyAddress);
    setEditing(null);
    setShowForm(false);
  };

  const updateField = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const inputClass =
    "w-full px-3 py-2.5 bg-muted border border-border rounded-lg font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors";

  if (loading) {
    return <div className="flex justify-center py-8"><div className="loading-retro" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-pixel text-sm text-primary text-glow-cyan">📍 MEUS ENDEREÇOS</h2>
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setEditing(null); setForm(emptyAddress); }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-display font-bold text-xs hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showForm && (
          <motion.form
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSave}
            className="bg-card rounded-2xl border border-border p-5 mb-4 space-y-3 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-display font-bold text-sm text-foreground">
                {editing ? "Editar Endereço" : "Novo Endereço"}
              </span>
              <button type="button" onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="font-body text-xs text-muted-foreground mb-1 block">Apelido (ex: Casa, Trabalho)</label>
                <input className={inputClass} placeholder="Casa" value={form.label} onChange={(e) => updateField("label", e.target.value)} required />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-body text-xs text-muted-foreground mb-1 block">Tipo</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateField("type", "delivery")}
                    className={`flex-1 py-2 rounded-lg text-xs font-display font-bold flex items-center justify-center gap-1.5 border transition-colors ${form.type === "delivery" ? "bg-primary/20 border-primary text-primary" : "bg-muted border-border text-muted-foreground"}`}
                  >
                    <Home className="w-3.5 h-3.5" /> Entrega
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField("type", "billing")}
                    className={`flex-1 py-2 rounded-lg text-xs font-display font-bold flex items-center justify-center gap-1.5 border transition-colors ${form.type === "billing" ? "bg-primary/20 border-primary text-primary" : "bg-muted border-border text-muted-foreground"}`}
                  >
                    <Building className="w-3.5 h-3.5" /> Cobrança
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3">
              <div className="col-span-6 sm:col-span-4">
                <label className="font-body text-xs text-muted-foreground mb-1 block">Rua</label>
                <input className={inputClass} placeholder="Rua Example" value={form.street} onChange={(e) => updateField("street", e.target.value)} required />
              </div>
              <div className="col-span-3 sm:col-span-2">
                <label className="font-body text-xs text-muted-foreground mb-1 block">Número</label>
                <input className={inputClass} placeholder="123" value={form.number} onChange={(e) => updateField("number", e.target.value)} required />
              </div>
              <div className="col-span-3 sm:col-span-2">
                <label className="font-body text-xs text-muted-foreground mb-1 block">Complemento</label>
                <input className={inputClass} placeholder="Apto 4B" value={form.complement} onChange={(e) => updateField("complement", e.target.value)} />
              </div>
              <div className="col-span-6 sm:col-span-4">
                <label className="font-body text-xs text-muted-foreground mb-1 block">Bairro</label>
                <input className={inputClass} placeholder="Centro" value={form.neighborhood} onChange={(e) => updateField("neighborhood", e.target.value)} required />
              </div>
              <div className="col-span-4 sm:col-span-3">
                <label className="font-body text-xs text-muted-foreground mb-1 block">Cidade</label>
                <input className={inputClass} placeholder="São Paulo" value={form.city} onChange={(e) => updateField("city", e.target.value)} required />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="font-body text-xs text-muted-foreground mb-1 block">Estado</label>
                <input className={inputClass} placeholder="SP" maxLength={2} value={form.state} onChange={(e) => updateField("state", e.target.value.toUpperCase())} required />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label className="font-body text-xs text-muted-foreground mb-1 block">CEP</label>
                <input className={inputClass} placeholder="00000-000" value={form.zip_code} onChange={(e) => updateField("zip_code", e.target.value)} required />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_default} onChange={(e) => updateField("is_default", e.target.checked)} className="accent-primary w-4 h-4" />
              <span className="font-body text-xs text-muted-foreground">Definir como endereço padrão</span>
            </label>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-primary text-primary-foreground font-display font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? "Salvando..." : <><Check className="w-4 h-4" /> {editing ? "Atualizar" : "Salvar"}</>}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {addresses.length === 0 && !showForm ? (
        <div className="bg-card rounded-2xl border border-border p-10 text-center">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-body text-muted-foreground text-sm">Nenhum endereço cadastrado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <motion.div
              key={addr.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-4 flex items-start gap-3"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${addr.type === "delivery" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                {addr.type === "delivery" ? <Home className="w-4 h-4" /> : <Building className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-display font-bold text-sm text-foreground">{addr.label || (addr.type === "delivery" ? "Entrega" : "Cobrança")}</span>
                  {addr.is_default && (
                    <span className="text-[10px] font-pixel text-primary bg-primary/10 px-1.5 py-0.5 rounded">PADRÃO</span>
                  )}
                  <span className={`text-[10px] font-pixel px-1.5 py-0.5 rounded ${addr.type === "delivery" ? "text-primary bg-primary/10" : "text-accent bg-accent/10"}`}>
                    {addr.type === "delivery" ? "ENTREGA" : "COBRANÇA"}
                  </span>
                </div>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">
                  {addr.street}, {addr.number}{addr.complement ? ` - ${addr.complement}` : ""} · {addr.neighborhood} · {addr.city}/{addr.state} · CEP {addr.zip_code}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => handleEdit(addr)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(addr.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressManager;
