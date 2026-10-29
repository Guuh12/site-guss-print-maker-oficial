import { useEffect, useRef } from "react";

const STAR_COUNT = 90;

const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      if (nextWidth === width && nextHeight === height) return;
      width = nextWidth;
      height = nextHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.6 + 0.4,
      speed: Math.random() * 0.35 + 0.08,
      opacity: Math.random(),
      twinkle: Math.random() * 0.015 + 0.004,
    }));

    let animationId = 0;
    let last = 0;

    const draw = (time: number) => {
      animationId = requestAnimationFrame(draw);
      if (document.hidden || time - last < 33) return;
      last = time;

      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.opacity += star.twinkle;
        if (star.opacity > 1 || star.opacity < 0.25) star.twinkle *= -1;
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
        ctx.fillStyle = `rgba(200, 230, 255, ${star.opacity})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      }
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export default StarField;
