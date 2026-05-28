import { useJerseys } from '@/hooks/useJerseys';
import JerseyCard from '@/components/JerseyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag } from 'lucide-react';

export default function Gallery() {
  const { jerseys, loading } = useJerseys();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (jerseys.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Aucun maillot pour le moment</h2>
        <p className="text-muted-foreground">
          Revenez bientôt, de nouveaux maillots arrivent !
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Collection de maillots</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {jerseys.map((jersey) => (
          <JerseyCard key={jersey.id} jersey={jersey} />
        ))}
      </div>
    </div>
  );
}
