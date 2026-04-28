import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageOff } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Props {
  images: string[];
  alt: string;
}

/**
 * Galería con imagen principal grande (aspect 3:4) + thumbnails clicables
 * abajo. Si no hay imágenes, fallback con icono.
 */
export function ImageGallery({ images, alt }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-muted rounded-sm flex items-center justify-center text-muted-foreground">
        <ImageOff size={48} />
      </div>
    );
  }

  const currentImage = images[Math.min(selectedIndex, images.length - 1)];

  return (
    <div className="space-y-3">
      <div className="aspect-[3/4] bg-muted rounded-sm overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedIndex}
            src={currentImage}
            alt={alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {images.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              aria-label={`Imagen ${idx + 1}`}
              aria-pressed={idx === selectedIndex}
              className={cn(
                'aspect-square bg-muted rounded-sm overflow-hidden border-2 transition-colors',
                idx === selectedIndex
                  ? 'border-foreground'
                  : 'border-transparent hover:border-border',
              )}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
