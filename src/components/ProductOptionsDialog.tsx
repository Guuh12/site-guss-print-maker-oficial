import { useMemo, useState } from "react";
import { Palette } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import type { ProductPurchaseOptions } from "@/data/products";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProductOptionsDialogProps {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  purchaseOptions: ProductPurchaseOptions;
  triggerClassName?: string;
}

const ProductOptionsDialog = ({
  productId,
  productName,
  productPrice,
  productImage,
  purchaseOptions,
  triggerClassName,
}: ProductOptionsDialogProps) => {
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(purchaseOptions.options.map((option) => [option.key, 0]))
  );

  const total = useMemo(
    () => Object.values(quantities).reduce((sum, value) => sum + value, 0),
    [quantities]
  );

  const handleQuantityChange = (key: string, value: string) => {
    const parsed = Number(value);
    const safe = Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0;
    setQuantities((prev) => ({ ...prev, [key]: safe }));
  };

  const handleConfirm = () => {
    if (total <= 0) {
      toast.error("Escolha pelo menos uma unidade para adicionar.");
      return;
    }

    const selected = purchaseOptions.options
      .map((option) => ({ label: option.label, quantity: quantities[option.key] || 0 }))
      .filter((item) => item.quantity > 0);

    const variationLabel = selected.map((item) => `${item.label} x${item.quantity}`).join(", ");
    const variationId = selected
      .map((item) => `${item.label.toLowerCase().replace(/\s+/g, "-")}-${item.quantity}`)
      .join("_");

    const itemId = `${productId}::${variationId}`;
    const itemName = `${productName} (${variationLabel})`;

    for (let i = 0; i < total; i += 1) {
      addItem({ id: itemId, name: itemName, price: productPrice, image: productImage });
    }

    toast.success(`Adicionado ao carrinho: ${variationLabel}`);
    setOpen(false);
    setQuantities(Object.fromEntries(purchaseOptions.options.map((option) => [option.key, 0])));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className={triggerClassName}>
          <Palette className="w-4 h-4" />
          {purchaseOptions.triggerLabel || "Escolher variacoes"}
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{purchaseOptions.modalTitle || `Variacoes de ${productName}`}</DialogTitle>
          <DialogDescription>
            {purchaseOptions.modalDescription || "Selecione as variacoes e quantidades desejadas."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {purchaseOptions.options.map((option) => (
            <div key={option.key} className="flex items-center justify-between gap-3">
              <label className="font-body text-sm font-semibold text-foreground">{option.label}</label>
              <input
                type="number"
                min={0}
                value={quantities[option.key] || 0}
                onChange={(e) => handleQuantityChange(option.key, e.target.value)}
                className="w-24 px-3 py-2 bg-muted border border-border rounded-lg font-body text-foreground text-center focus:border-primary focus:outline-none"
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <div className="w-full flex items-center justify-between gap-3">
            <span className="font-body text-sm text-muted-foreground">Total selecionado: {total}</span>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2.5 bg-primary text-primary-foreground font-display font-bold rounded-lg"
            >
              Adicionar ao carrinho
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductOptionsDialog;
