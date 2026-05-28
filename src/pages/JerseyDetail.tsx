import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useJerseys, useUserPrice } from '@/hooks/useJerseys';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeft, ChevronLeft, ChevronRight, Euro, ImageOff } from 'lucide-react';
import { useEffect } from 'react';

export default function JerseyDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { jerseys, loading } = useJerseys();
  const { price: userPrice, loading: priceLoading, setUserPrice } = useUserPrice(user?.uid, id);

  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [priceInput, setPriceInput] = useState('');
  const [saving, setSaving] = useState(false);

  const jersey = jerseys.find((j) => j.id === id);
  const photos = jersey?.photos || [];

  useEffect(() => {
    if (userPrice) {
      setPriceInput(String(userPrice.price));
    }
  }, [userPrice]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Skeleton className="aspect-square rounded-lg mb-4" />
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!jersey) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl mb-4">Maillot introuvable</p>
        <Link to="/" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium h-8 px-2.5 hover:bg-primary/80">Retour à la galerie</Link>
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
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium hover:underline mb-4 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Retour
      </Link>

      {/* Photos */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <div className="relative aspect-square bg-muted">
            {photos.length > 0 ? (
              <img
                src={photos[currentPhoto]}
                alt={`${jersey.name} - Photo ${currentPhoto + 1}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <ImageOff className="h-16 w-16" />
              </div>
            )}

            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentPhoto((p) => (p - 1 + photos.length) % photos.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentPhoto((p) => (p + 1) % photos.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {photos.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {photos.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPhoto(i)}
                  className={`h-16 w-16 shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                    i === currentPhoto ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">{jersey.name}</h1>
          <p className="text-muted-foreground">{jersey.team} · {jersey.type}</p>
        </div>

        {jersey.description && (
          <p className="text-sm text-muted-foreground">{jersey.description}</p>
        )}

        <p className="text-xl font-semibold">
          Prix indicatif : {jersey.price.toLocaleString('fr-FR')} €
        </p>

        {/* Price input for logged-in users */}
        {user ? (
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label htmlFor="user-price">Proposer mon prix</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="user-price"
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-9"
                    placeholder="0.00"
                    value={priceInput}
                    onChange={(e) => setPriceInput(e.target.value)}
                  />
                </div>
                <Button onClick={handleSavePrice} disabled={saving || priceLoading}>
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
              {userPrice && (
                <p className="text-xs text-muted-foreground">
                  Dernière modification : {new Date((userPrice.updatedAt as any)?.toDate?.() || Date.now()).toLocaleDateString('fr-FR')}
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-muted-foreground mb-2">
                Connectez-vous pour proposer votre prix
              </p>
              <Link to="/login" className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium h-8 px-2.5 hover:bg-primary/80">Se connecter</Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
