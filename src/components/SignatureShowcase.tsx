import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { products } from "@/data/products";
import { cn, formatBRL } from "@/lib/utils";
import { useSiteMode } from "@/vitrine/siteMode";

type Tone = "cyan" | "purple" | "green";

type Spot = {
  id: string;
  tone: Tone;
  tagline: string;
  featured?: boolean;
};

const spots: Spot[] = [
  {
    id: "boneco-punk-pet",
    tone: "purple",
    tagline: "o bichinho em versão punk",
  },
  {
    id: "boneco-punk-humano",
    tone: "cyan",
    tagline: "retrato impresso sob medida",
    featured: true,
  },
  {
    id: "porte-cotonetes",
    tone: "green",
    tagline: "organização impressa em 3D",
  },
];

const tones: Record<Tone, { frame: string; hover: string; line: string }> = {
  cyan: {
    frame: "border-primary/60 box-glow-cyan",
    hover: "group-hover:shadow-[0_0_36px_hsl(180_100%_50%/0.45)]",
    line: "bg-primary",
  },
  purple: {
    frame: "border-secondary/55 box-glow-purple",
    hover: "group-hover:shadow-[0_0_28px_hsl(270_80%_60%/0.45)]",
    line: "bg-secondary",
  },
  green: {
    frame: "border-accent/55 box-glow-green",
    hover: "group-hover:shadow-[0_0_28px_hsl(140_100%_50%/0.4)]",
    line: "bg-accent",
  },
};

const SignatureShowcase = () => {
  const { path } = useSiteMode();
  const stage = spots.flatMap((spot) => {
    const product = products.find((item) => item.id === spot.id);
    return product ? [{ ...spot, product }] : [];
  });

  if (stage.length === 0) return null;

  return (
    <section className="relative z-10 py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="font-pixel text-sm md:text-lg text-primary text-glow-cyan mb-3">
            PRINCIPAIS
          </h2>
          <p className="font-display text-xl md:text-2xl text-foreground font-bold">
            Bonecos e utilidades em 3D
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          <div className="pointer-events-none absolute left-1/2 -bottom-6 h-16 w-[78%] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

          <div className="grid grid-cols-2 items-end gap-3 md:grid-cols-[1fr_1.28fr_1fr] md:gap-6">
            {stage.map((spot, index) => {
              const tone = tones[spot.tone];
              const price = spot.product.priceLabel || formatBRL(spot.product.price);

              return (
                <motion.div
                  key={spot.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className={cn(
                    spot.featured
                      ? "order-1 col-span-2 md:order-2 md:col-span-1"
                      : spot.id === "boneco-punk-pet"
                        ? "order-2 md:order-1"
                        : "order-3",
                  )}
                >
                  <Link
                    to={path(`/produto/${spot.product.id}`)}
                    className={cn(
                      "group relative block overflow-hidden rounded-2xl border bg-card transition-shadow duration-300",
                      tone.frame,
                      tone.hover,
                    )}
                  >
                    <div
                      className={cn(
                        "relative overflow-hidden",
                        spot.featured
                          ? "aspect-[4/5] md:aspect-[3/4]"
                          : "aspect-[3/5] md:aspect-[4/5]",
                      )}
                    >
                      <img
                        src={spot.product.image}
                        alt={spot.product.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background from-[18%] via-background/80 via-[42%] to-transparent" />
                      <span className={cn("absolute left-0 right-0 top-0 h-0.5", tone.line)} />

                      <div className="absolute inset-x-0 bottom-0 p-3 md:p-5">
                        <p
                          className={cn(
                            "font-body text-xs leading-snug md:text-base",
                            spot.tone === "cyan" && "text-primary",
                            spot.tone === "purple" && "text-secondary",
                            spot.tone === "green" && "text-accent",
                          )}
                        >
                          {spot.tagline}
                        </p>
                        <h3 className="mt-1 font-display text-sm font-bold leading-tight text-foreground md:text-lg">
                          {spot.product.name}
                        </h3>
                        <p className="mt-1.5 font-display text-sm font-bold leading-tight text-primary md:mt-2 md:text-xl">
                          {price}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignatureShowcase;
