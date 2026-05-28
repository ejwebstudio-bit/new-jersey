import { useJerseys } from '@/hooks/useJerseys';
import JerseyCard from '@/components/JerseyCard';
import { ShoppingBag } from 'lucide-react';

export default function Gallery() {
  const { jerseys, loading } = useJerseys();

  // Skeleton loader
  if (loading) {
    return (
      <div className="px-3 py-4 sm:px-6 sm:py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-court/30 to-court/10" />
          <div className="h-6 w-40 skeleton-shimmer rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-white border border-border/50">
              <div className="aspect-[4/5] skeleton-shimmer" />
              <div className="p-3 space-y-2">
                <div className="h-3 w-3/4 skeleton-shimmer rounded" />
                <div className="h-3 w-1/2 skeleton-shimmer rounded" />
                <div className="h-3 w-1/3 skeleton-shimmer rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (jerseys.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-court/20 to-court/5 flex items-center justify-center mb-4">
          <ShoppingBag className="h-8 w-8 text-court" />
        </div>
        <h2 className="text-lg font-semibold mb-1">Aucun maillot pour le moment</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          La collection arrive bientôt. Reviens vite !
        </p>
      </div>
    );
  }

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Collection</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {jerseys.length} maillot{jerseys.length > 1 ? 's' : ''} disponible{jerseys.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Grid - Mobile first: 2 cols, tablet: 3, desktop: 4 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {jerseys.map((jersey) => (
          <JerseyCard key={jersey.id} jersey={jersey} />
        ))}
      </div>
    </div>
  );
}
