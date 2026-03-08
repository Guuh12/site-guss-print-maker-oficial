import productControllerStand from "@/assets/product-controller-stand.jpg";
import productGeekFigure from "@/assets/product-geek-figure.jpg";
import productSpaceLamp from "@/assets/product-space-lamp.jpg";
import productHeadsetStand from "@/assets/product-headset-stand.jpg";
import productKeychains from "@/assets/product-keychains.jpg";
import productPixelPlaque from "@/assets/product-pixel-plaque.jpg";

export interface ProductMedia {
  type: "image" | "video";
  url: string;
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
}

export const products: Product[] = [
  {
    id: "1",
    name: "Suporte Controle Gamer",
    price: 89.90,
    image: productControllerStand,
    category: "Gamer",
    description: "Suporte iluminado para controle de videogame. Design futurista com acabamento premium.",
    material: "PLA+",
    color: "Preto com LED cyan",
    size: "15x10x12cm",
    productionTime: "3-5 dias",
  },
  {
    id: "2",
    name: "Boneco Geek 3D",
    price: 149.90,
    image: productGeekFigure,
    category: "Geek",
    description: "Figura colecionável impressa em 3D com detalhes incríveis e pintura artesanal.",
    material: "Resina",
    color: "Multicolorido",
    size: "18cm altura",
    productionTime: "5-7 dias",
  },
  {
    id: "3",
    name: "Luminária Espacial",
    price: 199.90,
    image: productSpaceLamp,
    category: "Espacial",
    description: "Luminária em formato de foguete com iluminação LED integrada. Perfeita para decoração geek.",
    material: "PLA+ / LED",
    color: "Branco perolizado",
    size: "30cm altura",
    productionTime: "5-7 dias",
  },
  {
    id: "4",
    name: "Suporte Headset Pro",
    price: 119.90,
    image: productHeadsetStand,
    category: "Gamer",
    description: "Suporte para headset com base iluminada LED. Organização com estilo gamer.",
    material: "PLA+",
    color: "Preto com LED verde",
    size: "25x15x15cm",
    productionTime: "3-5 dias",
  },
  {
    id: "5",
    name: "Chaveiros Pixel Art",
    price: 29.90,
    image: productKeychains,
    category: "Geek",
    description: "Kit de chaveiros em pixel art. Personagens retrô adoráveis para levar a nostalgia no bolso.",
    material: "PLA",
    color: "Variado",
    size: "4x4cm cada",
    productionTime: "2-3 dias",
  },
  {
    id: "6",
    name: "Placa Decorativa Pixel",
    price: 159.90,
    image: productPixelPlaque,
    category: "Decoração",
    description: "Placa decorativa com arte pixel e iluminação neon. Ideal para setup gamer.",
    material: "PLA+ / LED",
    color: "Multicolorido neon",
    size: "30x30cm",
    productionTime: "5-7 dias",
  },
];
