import { motion } from "framer-motion";

const NeonDivider = () => {
  const sparks = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    delay: i * 1.5,
  }));

  return (
    <div className="relative z-10 h-0 flex items-center justify-center overflow-visible -my-px">
      {/* Base glow spread */}
      <div className="absolute w-full h-8 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-xl" />

      {/* Main neon line */}
      <div className="relative w-full max-w-5xl mx-auto h-[2px]">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, transparent 0%, hsl(180 100% 50%) 20%, hsl(270 80% 60%) 50%, hsl(180 100% 50%) 80%, transparent 100%)",
            boxShadow: "0 0 12px hsl(180 100% 50% / 0.6), 0 0 30px hsl(270 80% 60% / 0.3)",
          }}
        />

        {/* Energy pulse traveling along the line */}
        <motion.div
          className="absolute top-[-3px] h-[8px] w-24 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(180 100% 70% / 0.9), transparent)",
            boxShadow: "0 0 20px hsl(180 100% 50% / 0.8)",
          }}
          animate={{ left: ["-10%", "110%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
        />

        {/* Rising particles */}
        {sparks.map((s) => (
          <motion.span
            key={s.id}
            className="absolute bottom-0 w-1 h-1 rounded-full bg-primary"
            style={{
              left: `${15 + s.id * 14}%`,
              boxShadow: "0 0 4px hsl(180 100% 50%)",
            }}
            animate={{ y: [0, -20, -30], opacity: [0, 1, 0], scale: [0.5, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: s.delay, ease: "easeOut" }}
          />
        ))}
      </div>
    </div>
  );
};

export default NeonDivider;
