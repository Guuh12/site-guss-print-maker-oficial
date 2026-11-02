import { Check, Loader2 } from "lucide-react";
import { formatBRL } from "@/lib/utils";

interface Props {
  open: boolean;
  phase: "connecting" | "approved";
  amount: number;
  methodName: string;
}

const PaymentSandbox = ({ open, phase, amount, methodName }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/75 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white text-slate-900 shadow-2xl overflow-hidden">
        <div className="bg-[#009ee3] text-white px-5 py-4 flex items-center justify-between gap-3">
          <span className="font-display font-bold tracking-wide">Mercado Pago</span>
          <span className="text-[10px] uppercase tracking-wider bg-white/20 rounded px-2 py-1">Teste local</span>
        </div>
        <div className="p-6 space-y-4">
          <p className="font-body text-sm text-slate-500">
            A loja entregou a cobrança. Esta tela imita o checkout externo: o cartão e o Pix ficariam aqui, no Mercado Pago.
          </p>
          <div className="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3">
            <span className="font-body text-sm text-slate-600">Guss Print Maker</span>
            <span className="font-display font-bold text-slate-900">{formatBRL(amount)}</span>
          </div>
          <p className="font-body text-sm text-slate-700">Forma escolhida: {methodName}</p>
          {phase === "connecting" ? (
            <p className="font-body text-sm text-slate-600 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#009ee3]" />
              Confirmando com o serviço de pagamento...
            </p>
          ) : (
            <p className="font-body text-sm font-semibold text-emerald-700 flex items-center gap-2">
              <Check className="w-4 h-4" />
              Pagamento aprovado
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSandbox;
