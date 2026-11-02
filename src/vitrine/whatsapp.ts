export const WHATSAPP_NUMBER = "5511966451672";
export const WHATSAPP_DISPLAY = "(11) 96645-1672";

export const VITRINE_HELLO =
  "Olá! Vi a vitrine da Guss Print Maker e quero saber mais.";

export const SHOP_HELLO =
  "Olá! Estou na loja da Guss Print Maker e quero falar com vocês.";

export function whatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function productWhatsAppMessage(productName: string) {
  return `Olá! Vi o produto "${productName}" na vitrine da Guss Print Maker e quero conversar sobre ele.`;
}
