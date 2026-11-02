export type PaymentMethod = "pix" | "credit_card" | "boleto";

export interface PaymentChoice {
  code: PaymentMethod;
  name: string;
  detail: string;
}

export const paymentMethods: PaymentChoice[] = [
  { code: "pix", name: "Pix", detail: "Aprovação na hora" },
  { code: "credit_card", name: "Cartão de crédito", detail: "Visa, Master e Elo" },
  { code: "boleto", name: "Boleto", detail: "No teste local também aprova na hora" },
];

export interface PaymentChargeInput {
  amount: number;
  method: PaymentMethod;
  description: string;
  payerEmail: string;
}

export interface PaymentCharge {
  provider: "mercadopago";
  simulated: boolean;
  status: "approved";
  paymentId: string;
  method: PaymentMethod;
}

export function paymentMethodLabel(code: string | null | undefined) {
  return paymentMethods.find((method) => method.code === code)?.name ?? "Mercado Pago";
}

/**
 * Cobrança de exemplo. Devolve aprovado, no mesmo formato que o Mercado Pago
 * mandaria no webhook, sem sair do navegador e sem token.
 */
export function chargeFictitious(input: PaymentChargeInput): PaymentCharge {
  const stamp = Date.now().toString(36).toUpperCase();
  return {
    provider: "mercadopago",
    simulated: true,
    status: "approved",
    paymentId: `SIM-${stamp}`,
    method: input.method,
  };
}

export async function chargePayment(input: PaymentChargeInput): Promise<PaymentCharge> {
  if (!input.method) {
    throw new Error("Escolha Pix, cartão ou boleto.");
  }
  if (!(input.amount > 0)) {
    throw new Error("O total do pedido precisa ser maior que zero.");
  }

  await new Promise((resolve) => setTimeout(resolve, 1200));
  return chargeFictitious(input);

  // Com a conta Mercado Pago e o Access Token guardado no Supabase,
  // crie a Edge Function create-mercadopago-checkout e troque a linha acima por:
  // return createMercadoPagoCheckout(input);
}

export function isMissingPaymentColumn(message: string) {
  return /payment_(method|id|status)/i.test(message);
}

/*
  Checkout Pro do Mercado Pago. Deixe comentado até existir a conta.

  O navegador nunca vê o token. A Edge Function cria a preferência e devolve
  init_point. O cliente paga na página do Mercado Pago. Outra função, o webhook,
  recebe o aviso e só então marca o pedido como in_production.

  Segredos no Supabase (nunca no .env do Vite):
  - MERCADOPAGO_ACCESS_TOKEN: credencial de produção, ou a de teste (TEST-...)
  - SITE_URL: origem pública do site, sem barra no final
  - SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY: já existem nas Edge Functions

  No painel do Mercado Pago, a URL de notificação fica:
  https://<ref>.supabase.co/functions/v1/mercadopago-webhook

  // supabase/functions/create-mercadopago-checkout/index.ts
  //
  // serve(async (req) => {
  //   if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  //
  //   const token = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
  //   const siteUrl = Deno.env.get("SITE_URL");
  //   if (!token || !siteUrl) throw new Error("Mercado Pago ainda não configurado.");
  //
  //   const { orderId, amount, description, payerEmail, method } = await req.json();
  //   const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       items: [{
  //         id: orderId,
  //         title: description.slice(0, 120) || "Pedido Guss Print Maker",
  //         quantity: 1,
  //         currency_id: "BRL",
  //         unit_price: Number(amount),
  //       }],
  //       payer: { email: payerEmail },
  //       payment_methods: {
  //         default_payment_method_id: method === "credit_card" ? "visa" : method,
  //       },
  //       external_reference: orderId,
  //       back_urls: {
  //         success: `${siteUrl}/checkout/retorno?status=success&order=${orderId}`,
  //         failure: `${siteUrl}/checkout/retorno?status=failure&order=${orderId}`,
  //         pending: `${siteUrl}/checkout/retorno?status=pending&order=${orderId}`,
  //       },
  //       auto_return: "approved",
  //       notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/mercadopago-webhook`,
  //     }),
  //   });
  //
  //   const preference = await response.json();
  //   if (!response.ok) throw new Error(preference.message ?? "Mercado Pago recusou a cobrança.");
  //   const initPoint = token.startsWith("TEST-") ? preference.sandbox_init_point : preference.init_point;
  //   return new Response(JSON.stringify({ init_point: initPoint, preference_id: preference.id }), {
  //     headers: { ...corsHeaders, "Content-Type": "application/json" },
  //   });
  // });
  //
  // No cliente, no lugar de chargeFictitious:
  //
  // async function createMercadoPagoCheckout(input: PaymentChargeInput & { orderId: string }) {
  //   const { data, error } = await supabase.functions.invoke("create-mercadopago-checkout", {
  //     body: input,
  //   });
  //   if (error) throw new Error(error.message);
  //   if (!data?.init_point) throw new Error("Mercado Pago não devolveu o link de pagamento.");
  //   window.location.assign(data.init_point);
  //   return new Promise(() => {});
  // }
  //
  // supabase/functions/mercadopago-webhook/index.ts
  //
  // serve(async (req) => {
  //   const url = new URL(req.url);
  //   const topic = url.searchParams.get("topic") ?? url.searchParams.get("type");
  //   const paymentId = url.searchParams.get("id") ?? url.searchParams.get("data.id");
  //   if (topic !== "payment" || !paymentId) {
  //     return new Response("ignorado", { status: 200 });
  //   }
  //
  //   const token = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN")!;
  //   const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   const payment = await paymentResponse.json();
  //   if (payment.status !== "approved") return new Response("ainda não aprovado", { status: 200 });
  //
  //   const admin = createClient(
  //     Deno.env.get("SUPABASE_URL")!,
  //     Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  //   );
  //   await admin.from("orders").update({
  //     status: "in_production",
  //     payment_status: "approved",
  //     payment_id: String(payment.id),
  //     payment_method: payment.payment_method_id,
  //   }).eq("id", payment.external_reference);
  //
  //   return new Response("ok", { status: 200 });
  // });
*/
