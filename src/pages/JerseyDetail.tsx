import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useJerseys, useUserPrice } from '@/hooks/useJerseys';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, ChevronLeft, ChevronRight, Euro, Camera } from 'lucide-react';

export default function JerseyDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { jerseys, loading } = useJerseys();
  const { price: userPrice, loading: priceLoading, setUserPrice } = useUserPrice(user?.uid, id);

  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [priceInput, setPriceInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const jersey = jerseys.find((j) => j.id === id);
  const photos = jersey?.photos || [];

  useEffect(() => {
    if (userPrice) {
      setPriceInput(String(userPrice.price));
    }
  }, [userPrice]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentPhoto((p) => (p - 1 + photos.length) % photos.length);
      } else {
        setCurrentPhoto((p) => (p + 1) % photos.length);
      }
    }
    setTouchStart(null);
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-0 sm:px-6 py-0 sm:py-6">
        <div className="aspect-[4/3] sm:aspect-square skeleton-shimmer sm:rounded-2xl" />
        <div className="p-4 sm:p-0 space-y-3 mt-4">
          <div className="h-6 w-3/4 skeleton-shimmer rounded" />
          <div className="h-4 w-1/2 skeleton-shimmer rounded" />
          <div className="h-4 w-1/3 skeleton-shimmer rounded" />
        </div>
      </div>
    );
  }

  if (!jersey) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <p className="text-lg mb-4">Maillot introuvable</p>
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-court hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Retour à la galerie
        </Link>
      </div>
    );
  }

  const handleSavePrice = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const value = parseFloat(priceInput);
    if (isNaN(value) || value < 0) {
      toast.error('Veuillez entrer un prix valide');
      return;
    }
    setSaving(true);
    try {
      await setUserPrice(value);
      toast.success('Prix enregistré !');
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button (desktop) */}
      <div className="hidden sm:block px-6 pt-6 pb-2">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>
      </div>

      {/* Photo carousel - full width on mobile */}
      <div
        className="relative aspect-[4/3] sm:aspect-square sm:rounded-2xl sm:mx-6 overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {photos.length > 0 ? (
          <img
            src={photos[currentPhoto]}
            alt={`${jersey.name}`}
            className="h-full w-full object-contain sm:object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            <Camera className="h-12 w-12 mb-2 opacity-30" />
            <span className="text-sm opacity-50">Aucune photo</span>
          </div>
        )}

        {/* Nav arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={() => setCurrentPhoto((p) => (p - 1 + photos.length) % photos.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-md p-2 hover:bg-white transition-colors"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentPhoto((p) => (p + 1) % photos.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-md p-2 hover:bg-white transition-colors"
              aria-label="Photo suivante"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
              {currentPhoto + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails strip */}
      {photos.length > 1 && (
        <div className="flex gap-2 px-4 sm:px-6 py-3 overflow-x-auto scrollbar-none">
          {photos.map((url, i) => (
            <button
              key={i}
              onClick={() => setCurrentPhoto(i)}
              className={`h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                i === currentPhoto
                  ? 'border-court ring-1 ring-court/30'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Info section */}
      <div className="px-4 sm:px-6 pb-6 space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{jersey.name}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{jersey.team}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary/80 text-xs font-medium text-secondary-foreground">
              {jersey.type}
            </span>
          </div>
        </div>

        {jersey.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{jersey.description}</p>
        )}

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-court">
            {jersey.price.toLocaleString('fr-FR')} €
          </span>
          <span className="text-xs text-muted-foreground">prix indicatif</span>
        </div>

        {/* Price input section */}
        {user ? (
          <Card className="border-court/20 bg-gradient-to-br from-court/[0.03] to-transparent">
            <CardContent className="p-4 sm:p-5 space-y-3">
              <Label htmlFor="user-price" className="text-sm font-medium">
                Proposer mon prix
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-court/50" />
                  <Input
                    id="user-price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-9 h-11 rounded-xl border-court/20 focus:border-court"
                    placeholder="0.00"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleSavePrice}
                  disabled={saving || priceLoading}
                  className="h-11 px-5 rounded-xl bg-gradient-to-r from-court to-court-dark hover:from-court-dark hover:to-court-light shadow-sm"
                >
                  {saving ? '...' : 'Valider'}
                </Button>
              </div>
              {userPrice && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-court/50" />
                  Dernière modification : {new Date(
                    (userPrice.updatedAt as any)?.toDate?.() || Date.now()
                  ).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-5 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Connectez-vous pour proposer votre prix
              </p>
              <Button
                onClick={() => navigate('/login')}
                className="rounded-xl bg-gradient-to-r from-court to-court-dark hover:from-court-dark hover:to-court-light shadow-sm"
              >
                Se connecter
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
