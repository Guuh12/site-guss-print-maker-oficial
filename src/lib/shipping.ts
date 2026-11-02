export interface ShippingOption {
  code: string;
  name: string;
  price: number;
  deadlineDays: number;
  deadlineLabel: string;
  pickup: boolean;
}

export interface ShippingQuoteInput {
  destinationCep: string;
  itemCount: number;
}

export interface ShippingPackage {
  weightGrams: number;
  comprimento: number;
  largura: number;
  altura: number;
}

/** CEP de onde a loja posta. Troque pelo CEP real antes de ligar os Correios. */
export const ORIGIN_CEP = "01310100";

const GRAMS_PER_UNIT = 300;
const BOX = { comprimento: 20, largura: 16, altura: 8 };

export function digitsCep(cep: string) {
  return cep.replace(/\D/g, "").slice(0, 8);
}

export function formatCep(cep: string) {
  const digits = digitsCep(cep);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function isValidCep(cep: string) {
  return digitsCep(cep).length === 8;
}

/** Cada peça entra com peso e volume de exemplo. O catálogo ainda não tem peso próprio. */
export function estimatePackage(itemCount: number): ShippingPackage {
  const units = Math.max(itemCount, 1);
  return {
    weightGrams: units * GRAMS_PER_UNIT,
    comprimento: BOX.comprimento,
    largura: BOX.largura,
    altura: BOX.altura + (units - 1) * 2,
  };
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

/**
 * Cotação de exemplo. O preço muda com a região do CEP (primeiro dígito)
 * e com o peso estimado do carrinho, no mesmo formato que a API devolveria.
 */
export function quoteFictitious(input: ShippingQuoteInput): ShippingOption[] {
  const cep = digitsCep(input.destinationCep);
  const region = Number(cep[0] || "0");
  const pack = estimatePackage(input.itemCount);
  const extraKg = Math.max(0, Math.ceil(pack.weightGrams / 1000) - 1);
  const pac = roundMoney(16 + region * 1.8 + extraKg * 6);
  const sedex = roundMoney(pac * 1.85 + 8);
  const pacDays = 7 + (region % 4);
  const sedexDays = 2 + (region % 2);

  return [
    {
      code: "RETIRADA",
      name: "Retirada",
      price: 0,
      deadlineDays: 0,
      deadlineLabel: "Combine o horário",
      pickup: true,
    },
    {
      code: "PAC",
      name: "PAC",
      price: pac,
      deadlineDays: pacDays,
      deadlineLabel: `${pacDays} dias úteis`,
      pickup: false,
    },
    {
      code: "SEDEX",
      name: "SEDEX",
      price: sedex,
      deadlineDays: sedexDays,
      deadlineLabel: `${sedexDays} dias úteis`,
      pickup: false,
    },
  ];
}

export async function quoteShipping(input: ShippingQuoteInput): Promise<ShippingOption[]> {
  if (!isValidCep(input.destinationCep)) {
    throw new Error("Informe um CEP com 8 dígitos.");
  }

  await new Promise((resolve) => setTimeout(resolve, 400));
  return quoteFictitious(input);

  // Com contrato, cartão de postagem e os serviços 38202/38210 no CWS,
  // mova quoteCorreios para uma Edge Function e troque a linha acima por:
  // return quoteCorreios(input);
}

export function isMissingShippingColumn(message: string) {
  return /shipping_(method|cost|deadline)/i.test(message);
}

/*
  Cotação oficial dos Correios (CWS). Deixe comentada até existir contrato.

  Pré-requisitos, todos no servidor (nunca no navegador):
  - CORREIOS_USUARIO e CORREIOS_SENHA: senha de API criada no CWS
  - CORREIOS_CARTAO: número do cartão de postagem
  - CORREIOS_CONTRATO e CORREIOS_DR: contrato e regional, se a API de preço exigir
  - Serviços 38202 (API Preços) e 38210 (API Prazos) ligados ao contrato
  - Códigos abaixo são os do manual (PAC 03298, SEDEX 03220). Confira os seus no CWS.

  O token dura algumas horas. Guarde em cache e gere outro só perto do vencimento.

  async function correiosToken(): Promise<string> {
    const usuario = Deno.env.get("CORREIOS_USUARIO") ?? "";
    const senha = Deno.env.get("CORREIOS_SENHA") ?? "";
    const cartao = Deno.env.get("CORREIOS_CARTAO") ?? "";
    const credentials = btoa(`${usuario}:${senha}`);

    const response = await fetch("https://api.correios.com.br/token/v1/autentica/cartaopostagem", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ numero: cartao }),
    });

    if (!response.ok) {
      throw new Error("Não foi possível autenticar nos Correios.");
    }

    const data = await response.json();
    return data.token as string;
  }

  function parseCorreiosMoney(value: string) {
    return Number(String(value).replace(/\./g, "").replace(",", "."));
  }

  async function quoteCorreios(input: ShippingQuoteInput): Promise<ShippingOption[]> {
    const token = await correiosToken();
    const pack = estimatePackage(input.itemCount);
    const destino = digitsCep(input.destinationCep);
    const servicos = [
      { code: "03298", name: "PAC" },
      { code: "03220", name: "SEDEX" },
    ];

    const opcoes = await Promise.all(
      servicos.map(async (servico) => {
        const precoParams = new URLSearchParams({
          cepOrigem: ORIGIN_CEP,
          cepDestino: destino,
          psObjeto: String(pack.weightGrams),
          tpObjeto: "2",
          comprimento: String(pack.comprimento),
          largura: String(pack.largura),
          altura: String(pack.altura),
        });

        const precoResponse = await fetch(
          `https://api.correios.com.br/preco/v1/nacional/${servico.code}?${precoParams}`,
          { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } },
        );
        if (!precoResponse.ok) return null;
        const preco = await precoResponse.json();

        const prazoParams = new URLSearchParams({
          cepOrigem: ORIGIN_CEP,
          cepDestino: destino,
        });
        const prazoResponse = await fetch(
          `https://api.correios.com.br/prazo/v3/nacional/${servico.code}?${prazoParams}`,
          { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } },
        );
        if (!prazoResponse.ok) return null;
        const prazo = await prazoResponse.json();

        const dias = Number(prazo.prazoEntrega);
        const option: ShippingOption = {
          code: servico.code,
          name: servico.name,
          price: parseCorreiosMoney(preco.pcFinal),
          deadlineDays: dias,
          deadlineLabel: prazo.dataMaxima
            ? `Até ${String(prazo.dataMaxima).slice(0, 10).split("-").reverse().join("/")}`
            : `${dias} dias úteis`,
          pickup: false,
        };
        return option;
      }),
    );

    const correios = opcoes.filter((option): option is ShippingOption => option !== null);
    return [
      {
        code: "RETIRADA",
        name: "Retirada",
        price: 0,
        deadlineDays: 0,
        deadlineLabel: "Combine o horário",
        pickup: true,
      },
      ...correios,
    ];
  }
*/
