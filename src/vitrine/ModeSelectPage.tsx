import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Eye, MessageCircle, ShoppingBag, Sparkles, UserRound } from "lucide-react";
import StarField from "@/components/StarField";
import NeonPortal from "@/components/NeonPortal";
import { SHOP_HOME, VITRINE_HOME } from "@/vitrine/siteMode";

const doors = [
  {
    to: VITRINE_HOME,
    kicker: "Só para olhar",
    title: "Vitrine",
    description:
      "O mesmo visual de hoje, em modo mostruário. Você passeia pelos produtos, vê fotos, preços e como cada peça é feita. Não tem carrinho nem cadastro.",
    points: [
      { icon: Eye, text: "Ver o catálogo com calma" },
      { icon: Sparkles, text: "Entender materiais, tamanhos e prazos" },
      { icon: MessageCircle, text: "Chamar no WhatsApp se quiser uma peça" },
    ],
    action: "Entrar na vitrine",
    accent: "primary" as const,
  },
  {
    to: SHOP_HOME,
    kicker: "Para comprar online",
    title: "Loja",
    description:
      "O site de compra que já existe hoje. Você monta o carrinho, cria uma conta e finaliza o pedido por aqui, com checkout e área do cliente.",
    points: [
      { icon: ShoppingBag, text: "Adicionar produtos ao carrinho" },
      { icon: UserRound, text: "Entrar na conta e acompanhar pedidos" },
      { icon: Sparkles, text: "Pedir um projeto 3D pelo formulário" },
    ],
    action: "Entrar na loja",
    accent: "accent" as const,
  },
];

const ModeSelectPage = () => (
  <div className="relative min-h-screen overflow-hidden bg-background">
    <StarField />
    <div className="absolute inset-0 gradient-space opacity-80" />
    <motion.div
      className="pointer-events-none absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-primary/15 to-transparent"
      initial={{ top: "-15%" }}
      animate={{ top: "115%" }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    />

    <div className="relative z-10 container mx-auto px-4 py-10 md:py-14 flex flex-col items-center">
      <div className="scale-[0.72] md:scale-90 -mb-8 md:-mb-4">
        <NeonPortal />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="font-pixel text-[10px] md:text-xs text-primary text-glow-cyan text-center mb-4"
      >
        GUSS PRINT MAKER
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="font-display font-bold text-3xl md:text-5xl text-foreground text-center max-w-3xl"
      >
        Duas portas. Escolha a sua.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="font-body text-lg md:text-xl text-muted-foreground text-center max-w-2xl mt-4 mb-10"
      >
        Antes de abrir o site, diga como quer entrar. A vitrine é para conhecer as peças. A loja é para comprar. Elas ficam separadas, e dá para trocar depois.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-5xl">
        {doors.map((door, index) => {
          const isShop = door.accent === "accent";
          return (
            <motion.div
              key={door.to}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + index * 0.12, duration: 0.45 }}
            >
              <Link to={door.to} className="block h-full group focus:outline-none">
                <motion.article
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.985 }}
                  className={`h-full rounded-2xl border bg-card/80 backdrop-blur-md p-6 md:p-7 flex flex-col transition-shadow ${
                    isShop
                      ? "border-accent/40 hover:box-glow-green"
                      : "border-primary/40 hover:box-glow-cyan"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <span
                      className={`font-pixel text-[8px] px-2 py-1 rounded-full border ${
                        isShop ? "text-accent border-accent/40" : "text-primary border-primary/40"
                      }`}
                    >
                      {door.kicker}
                    </span>
                    <span
                      className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                        isShop ? "bg-accent/15 text-accent" : "bg-primary/15 text-primary"
                      }`}
                    >
                      {isShop ? <ShoppingBag className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </span>
                  </div>

                  <h2 className="font-display font-bold text-2xl text-foreground">{door.title}</h2>
                  <p className="font-body text-lg text-muted-foreground mt-3">{door.description}</p>

                  <ul className="mt-5 space-y-3">
                    {door.points.map((point) => (
                      <li key={point.text} className="flex items-start gap-3 font-body text-foreground">
                        <point.icon className={`w-4 h-4 mt-1 shrink-0 ${isShop ? "text-accent" : "text-primary"}`} />
                        <span>{point.text}</span>
                      </li>
                    ))}
                  </ul>

                  <div
                    className={`mt-7 inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg font-display font-bold ${
                      isShop
                        ? "bg-accent text-accent-foreground box-glow-green"
                        : "bg-primary text-primary-foreground box-glow-cyan"
                    }`}
                  >
                    {door.action}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.article>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="font-body text-muted-foreground text-center mt-8 max-w-xl"
      >
        Isso fica assim por enquanto, até o site completo ficar pronto. Dentro de cada versão tem o caminho para voltar aqui e escolher de novo.
      </motion.p>
    </div>
  </div>
);

export default ModeSelectPage;
