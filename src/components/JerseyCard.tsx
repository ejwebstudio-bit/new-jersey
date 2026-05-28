import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import type { Jersey } from '@/types';

interface Props {
  jersey: Jersey;
  userPrice?: number | null;
}

export default function JerseyCard({ jersey, userPrice }: Props) {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const photos = jersey.photos || [];

  const nextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPhoto((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length);
      } else {
        setCurrentPhoto((prev) => (prev + 1) % photos.length);
      }
    }
    setTouchStart(null);
  };

  return (
    <Link to={`/jersey/${jersey.id}`} className="block group">
      <div className="overflow-hidden rounded-2xl bg-white border border-border/50 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]">
        {/* Photo */}
        <div
          className="relative aspect-[4/5] bg-gradient-to-br from-neutral-100 to-neutral-200 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {photos.length > 0 ? (
            <>
              <img
                src={photos[currentPhoto]}
                alt={`${jersey.name}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageOff className="h-8 w-8 text-muted-foreground/40" />
            </div>
          )}

          {/* Photo counter badge */}
          {photos.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
              {currentPhoto + 1}/{photos.length}
            </div>
          )}

          {/* Arrow buttons (desktop hover) */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-sm p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block hover:bg-white"
                aria-label="Photo précédente"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-sm p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block hover:bg-white"
                aria-label="Photo suivante"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </>
          )}

          {/* Dots (mobile) */}
          {photos.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {photos.map((_, i) => (
                <span
                  key={i}
                  className={`block h-1 rounded-full transition-all duration-300 ${
                    i === currentPhoto ? 'w-4 bg-white' : 'w-1 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm leading-tight truncate">{jersey.name}</h3>
              <p className="text-xs text-muted-foreground truncate">{jersey.team}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary/80 text-[10px] font-medium text-secondary-foreground">
              {jersey.type}
            </span>
            <span className="font-bold text-sm text-court">
              {jersey.price?.toLocaleString('fr-FR')} €
            </span>
          </div>

          {userPrice !== undefined && userPrice !== null && (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground border-t pt-1.5 mt-0.5">
              <span>Mon prix :</span>
              <span className="font-medium text-court">{userPrice.toLocaleString('fr-FR')} €</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
