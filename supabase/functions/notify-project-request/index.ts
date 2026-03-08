import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY não configurada");
    }

    const { name, email, phone, description, file_url, file_name } =
      await req.json();

    const htmlContent = `
      <h2>🧠 Novo Pedido de Projeto Personalizado</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Nome</td><td style="padding:8px;border-bottom:1px solid #eee;">${name}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">E-mail</td><td style="padding:8px;border-bottom:1px solid #eee;">${email}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Telefone</td><td style="padding:8px;border-bottom:1px solid #eee;">${phone || "Não informado"}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Descrição</td><td style="padding:8px;border-bottom:1px solid #eee;">${description}</td></tr>
        ${file_url ? `<tr><td style="padding:8px;font-weight:bold;">Arquivo</td><td style="padding:8px;"><a href="${file_url}">${file_name || "Download"}</a></td></tr>` : ""}
      </table>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Guss Print Maker <onboarding@resend.dev>",
        to: ["gussprintmaker@gmail.com"],
        subject: `🖨️ Novo Orçamento 3D - ${name}`,
        html: htmlContent,
        reply_to: email,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(`Resend error [${res.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
