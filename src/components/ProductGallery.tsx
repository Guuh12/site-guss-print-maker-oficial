import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import type { ProductMedia } from "@/data/products";

interface ProductGalleryProps {
  mainImage: string;
  media?: ProductMedia[];
  productName: string;
}

const ProductGallery = ({ mainImage, media, productName }: ProductGalleryProps) => {
  // Build the full media list: main image first, then extras
  const allMedia: ProductMedia[] = [
    { type: "image", url: mainImage },
    ...(media || []),
  ];

  const [current, setCurrent] = useState(0);

  const goTo = (index: number) => {
    setCurrent((index + allMedia.length) % allMedia.length);
  };

  const item = allMedia[current];

  return (
    <div className="space-y-3">
      {/* Main display */}
      <div className="relative rounded-xl overflow-hidden border border-border bg-muted aspect-square">
        <AnimatePresence mode="wait">
          {item.type === "video" ? (
            <motion.video
              key={`video-${current}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={item.url}
              controls
              className="w-full h-full object-cover"
              playsInline
            />
          ) : (
            <motion.img
              key={`img-${current}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={item.url}
              alt={`${productName} - ${current + 1}`}
              className="w-full h-full object-cover"
            />
          )}
        </AnimatePresence>

        {/* Navigation arrows - only show if more than 1 media */}
        {allMedia.length > 1 && (
          <>
            <button
              onClick={() => goTo(current - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => goTo(current + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {allMedia.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-primary w-5" : "bg-foreground/30"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails - only show if more than 1 media */}
      {allMedia.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allMedia.map((m, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${i === current ? "border-primary" : "border-border opacity-60 hover:opacity-100"}`}
            >
              {m.type === "video" ? (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Play className="w-5 h-5 text-primary" />
                </div>
              ) : (
                <img src={m.url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
