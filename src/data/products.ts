import { productImageUrl } from "./productAssets";

export interface ProductMedia {
  type: "image" | "video";
  url: string;
}

export interface ProductVariationOption {
  key: string;
  label: string;
}

export interface ProductPurchaseOptions {
  triggerLabel?: string;
  modalTitle?: string;
  modalDescription?: string;
  options: ProductVariationOption[];
  defaultSelectionLabel?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  media?: ProductMedia[];
  category: string;
  description: string;
  material: string;
  color: string;
  size: string;
  productionTime: string;
  purchaseOptions?: ProductPurchaseOptions;
}

const imageMedia = (paths: string[]): ProductMedia[] =>
  paths.map((path) => ({ type: "image", url: productImageUrl(path) }));

export const products: Product[] = [
  {
    id: "porte-cotonetes",
    name: "Porta cotonetes",
    price: 49.9,
    image: productImageUrl("Cuidados Pessoais/porta-cotonete1.jpg"),
    media: [{ type: "image", url: productImageUrl("Cuidados Pessoais/porta-cotonete2.jpg") }],
    category: "Cuidados Pessoais",
    description: "Organizador para cotonetes com acabamento impresso em 3D. Prático para banheiro ou penteadeira.",
    material: "PLA+",
    color: "Sob consulta",
    size: "Sob medida",
    productionTime: "3-5 dias",
    purchaseOptions: {
      triggerLabel: "Escolher cor/quantidade",
      modalTitle: "Variações de Porta cotonetes",
      modalDescription: "Selecione quantas unidades de cada cor deseja adicionar.",
      defaultSelectionLabel: "cor padrao",
      options: [
        { key: "branca", label: "Branca" },
        { key: "preta", label: "Preta" },
        { key: "rosa", label: "Rosa" },
        { key: "azul", label: "Azul" },
      ],
    },
  },
  {
    id: "papagaio-minecraft",
    name: "Papagaio estilo Minecraft",
    price: 129.9,
    image: productImageUrl("Bonecos/papaguio-mine1.jpg"),
    media: [
      { type: "image", url: productImageUrl("Bonecos/papaguio-mine2.jpg") },
      { type: "image", url: productImageUrl("Bonecos/papaguio-mine3.jpg") },
      { type: "image", url: productImageUrl("Bonecos/papaguio-mine4.jpg") },
      { type: "image", url: productImageUrl("Bonecos/papaguio-mine5.jpg") },
      { type: "image", url: productImageUrl("Bonecos/papaguio-mine6.jpg") },
    ],
    category: "Bonecos",
    description: "Boneco papagaio em estilo blocos, inspirado em Minecraft. Várias fotos do mesmo modelo para você ver os detalhes.",
    material: "PLA+",
    color: "Multicolorido",
    size: "Aprox. 15-20 cm (varia conforme peça)",
    productionTime: "5-7 dias",
  },
  {
    id: "boneco-punk-humano",
    name: "Boneco personalizado — humano (estilo punk)",
    price: 189.9,
    image: productImageUrl("Personalizados/Bonecos Humanos/punko-humano1.jpg"),
    media: [{ type: "image", url: productImageUrl("Personalizados/Bonecos Humanos/punko-humano2.jpg") }],
    category: "Personalizados",
    description: "Linha personalizada estilo punk para retrato humano. Podemos adaptar cores e detalhes no pedido.",
    material: "PLA+ / pintura",
    color: "Personalizado",
    size: "Sob medida",
    productionTime: "7-10 dias",
    // Personalizacao sob medida sera implementada em uma etapa futura.
  },
  {
    id: "boneco-punk-pet",
    name: "Boneco personalizado — pet (estilo punk)",
    price: 169.9,
    image: productImageUrl("Personalizados/Bonecos Pets/punko-pet1.jpg"),
    media: imageMedia([
      "Personalizados/Bonecos Pets/boneco-pet2.jpg",
      "Personalizados/Bonecos Pets/boneco-pet3.jpg",
      "Personalizados/Bonecos Pets/boneco-pet4.jpg",
      "Personalizados/Bonecos Pets/boneco-pet5.jpg",
    ]),
    category: "Personalizados",
    description: "Versão pet do estilo punk. Ideal para homenagear seu bichinho com um boneco único.",
    material: "PLA+ / pintura",
    color: "Personalizado",
    size: "Sob medida",
    productionTime: "7-10 dias",
  },
  {
    id: "boneco-animais-personalizados",
    name: "Bonecos personalizados — animais",
    price: 159.9,
    image: productImageUrl("Personalizados/Bonecos Outros/animais-personalizados1.jpg"),
    category: "Personalizados",
    description: "Bonecos de animais em versão personalizada para presente ou decoração temática.",
    material: "PLA+ / pintura",
    color: "Personalizado",
    size: "Sob medida",
    productionTime: "7-10 dias",
  },
  {
    id: "chaveiros-personalizados",
    name: "Chaveiros personalizados",
    price: 34.9,
    image: productImageUrl("Personalizados/Chaveiros Personalizados/chaveiro-personalizado1.jpg"),
    media: imageMedia([
      "Personalizados/Chaveiros Personalizados/chaveiro-personalizado2.jpg",
      "Personalizados/Chaveiros Personalizados/chaveiro-nexgn.jpg",
    ]),
    category: "Personalizados",
    description: "Chaveiros em impressão 3D com nome, logo ou tema escolhido por você.",
    material: "PLA+",
    color: "Sob consulta",
    size: "Sob medida",
    productionTime: "3-5 dias",
  },
  {
    id: "luminaria-com-foto",
    name: "Luminária com foto",
    price: 139.9,
    image: productImageUrl("Personalizados/Luminaria com Foto/luminaria-quadrada-pers1.jpg"),
    media: imageMedia(["Personalizados/Luminaria com Foto/luminaria-quadrada-pers2.jpg"]),
    category: "Personalizados",
    description: "Luminária personalizada com foto para decorar ambientes com um toque único.",
    material: "PLA+ / LED",
    color: "Sob consulta",
    size: "Sob medida",
    productionTime: "5-7 dias",
  },
  {
    id: "guarda-fio-dental",
    name: "Guarda fio dental",
    price: 39.9,
    image: productImageUrl("Cuidados Pessoais/Guarda Fio Dental/guarda-fio-dental1.jpg"),
    media: imageMedia(["Cuidados Pessoais/Guarda Fio Dental/guarda-fio-dental2.jpg"]),
    category: "Cuidados Pessoais",
    description: "Estojo compacto para fio dental, ideal para manter higiene e organização no dia a dia.",
    material: "PLA+",
    color: "Sob consulta",
    size: "Sob medida",
    productionTime: "3-5 dias",
  },
  {
    id: "guarda-remedio",
    name: "Guarda remédio",
    price: 59.9,
    image: productImageUrl("Cuidados Pessoais/Guarda Remedio/guarda-remedio1.jpg"),
    media: imageMedia([
      "Cuidados Pessoais/Guarda Remedio/guarda-remedio2.jpg",
      "Cuidados Pessoais/Guarda Remedio/guarda-remedio3.jpg",
      "Cuidados Pessoais/Guarda Remedio/guarda-remedio4.jpg",
      "Cuidados Pessoais/Guarda Remedio/guarda-remedio5.jpg",
    ]),
    category: "Cuidados Pessoais",
    description: "Organizador para remédios com compartimentos práticos para rotina em casa ou viagem.",
    material: "PLA+",
    color: "Sob consulta",
    size: "Sob medida",
    productionTime: "3-5 dias",
  },
  {
    id: "marca-paginas-3d",
    name: "Marca páginas 3D",
    price: 19.9,
    image: productImageUrl("Utilidades/Marca Paginas/marca-pagina-bicho1.jpg"),
    media: imageMedia([
      "Utilidades/Marca Paginas/marca-pagina-escopo1.jpg",
      "Utilidades/Marca Paginas/marca-pagina-gato1.jpg",
      "Utilidades/Marca Paginas/marca-pagina-navio1.jpg",
    ]),
    category: "Utilidades",
    description: "Marca páginas em impressão 3D com temas criativos para leitores de todas as idades.",
    material: "PLA",
    color: "Variado",
    size: "Padrão",
    productionTime: "2-4 dias",
  },
  {
    id: "prendedor-alimento",
    name: "Prendedor de alimento",
    price: 14.9,
    image: productImageUrl("Utilidades/Prendendor Alimento/prendedor-alimento1.jpg"),
    media: imageMedia(["Utilidades/Prendendor Alimento/prendedor-alimento2.jpg"]),
    category: "Utilidades",
    description: "Prendedor reutilizável para fechar embalagens e manter alimentos conservados.",
    material: "PLA",
    color: "Variado",
    size: "Padrão",
    productionTime: "2-4 dias",
  },
];
