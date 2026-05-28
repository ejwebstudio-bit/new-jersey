import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import type { Jersey } from '@/types';

interface Props {
  jersey: Jersey;
  userPrice?: number | null;
}

export default function JerseyCard({ jersey, userPrice }: Props) {
  const [currentPhoto, setCurrentPhoto] = useState(0);
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

  return (
    <Link to={`/jersey/${jersey.id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-0">
          {/* Photo carousel */}
          <div className="relative aspect-square bg-muted">
            {photos.length > 0 ? (
              <img
                src={photos[currentPhoto]}
                alt={`${jersey.name} - Photo ${currentPhoto + 1}`}
                className="h-full w-full object-cover transition-opacity"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <ImageOff className="h-12 w-12" />
              </div>
            )}

            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Photo précédente"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Photo suivante"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {photos.map((_, i) => (
                    <span
                      key={i}
                      className={`block h-1.5 w-1.5 rounded-full transition-colors ${
                        i === currentPhoto ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Info */}
          <div className="p-3 space-y-1">
            <h3 className="font-semibold text-sm truncate">{jersey.name}</h3>
            <p className="text-xs text-muted-foreground">{jersey.team} · {jersey.type}</p>
            <p className="text-sm font-medium">{jersey.price?.toLocaleString('fr-FR')} €</p>
            {userPrice !== undefined && userPrice !== null && (
              <p className="text-xs text-primary">
                Mon prix : {userPrice.toLocaleString('fr-FR')} €
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
