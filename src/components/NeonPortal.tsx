import { motion } from "framer-motion";
import mascotGif from "@/assets/mascot-portal.gif";

const NeonPortal = () => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (360 / 12) * i,
    delay: i * 0.3,
    size: Math.random() * 3 + 2,
  }));

  return (
    <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6">
      {/* Orbiting particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-full h-full"
          style={{ left: 0, top: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 8 + p.delay,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        >
          <motion.span
            className="absolute block rounded-full"
            style={{
              width: p.size,
              height: p.size,
              top: -p.size / 2,
              left: "50%",
              marginLeft: -p.size / 2,
              background: p.id % 2 === 0
                ? "hsl(180 100% 50%)"
                : "hsl(270 80% 60%)",
              boxShadow: p.id % 2 === 0
                ? "0 0 6px hsl(180 100% 50% / 0.8)"
                : "0 0 6px hsl(270 80% 60% / 0.8)",
            }}
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, delay: p.delay * 0.5 }}
          />
        </motion.div>
      ))}

      {/* Outer glow */}
      <div className="absolute inset-[-12px] rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl" />

      {/* Rotating neon border */}
      <motion.div
        className="absolute inset-[-4px] rounded-full"
        style={{
          background: "conic-gradient(from 0deg, hsl(180 100% 50%), hsl(270 80% 60%), hsl(140 100% 50% / 0.3), hsl(180 100% 50%))",
          padding: 3,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-full h-full rounded-full bg-background" />
      </motion.div>

      {/* Glassmorphism container with GIF */}
      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{
          backdropFilter: "blur(8px)",
          background: "hsl(230 25% 7% / 0.5)",
          boxShadow:
            "0 0 30px hsl(180 100% 50% / 0.25), 0 0 60px hsl(270 80% 60% / 0.15), 0 20px 40px hsl(220 60% 30% / 0.4)",
        }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src={mascotGif}
          alt="Guss Print Maker Mascot"
          className="w-full h-full object-cover scale-110"
        />
      </motion.div>
    </div>
  );
};

export default NeonPortal;
