import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useJerseys } from '@/hooks/useJerseys';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import PhotoUploader from '@/components/PhotoUploader';
import type { Jersey } from '@/types';
import { Pencil, Trash2, ArrowLeft, Plus, ShoppingBag } from 'lucide-react';

const JERSEY_TYPES = [
  'City Edition',
  'Classic Edition',
  'Statement Edition',
  'Association Edition',
  'Icon Edition',
  'Earned Edition',
  'Player Edition',
  'Custom',
];

export default function Admin() {
  const { user, appUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { jerseys, loading: jerseysLoading, createJersey, deleteJersey } = useJerseys();
  const [deleteTarget, setDeleteTarget] = useState<Jersey | null>(null);
  const [activeTab, setActiveTab] = useState('manage');

  useEffect(() => {
    if (!authLoading && (!user || appUser?.role !== 'admin')) {
      navigate('/');
    }
  }, [user, appUser, authLoading, navigate]);

  if (authLoading || !appUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-4 w-4 rounded-full border-2 border-court border-t-transparent animate-spin" />
          Chargement...
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteJersey(deleteTarget.id);
      toast.success('Maillot supprimé');
      setDeleteTarget(null);
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-8 max-w-4xl mx-auto pb-24 md:pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/" className="shrink-0">
          <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Administration</h1>
          <p className="text-xs text-muted-foreground">Gestion des maillots</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-xs mb-6 rounded-xl">
          <TabsTrigger value="manage" className="rounded-lg text-xs">Maillots</TabsTrigger>
          <TabsTrigger value="create" className="rounded-lg text-xs">Nouveau</TabsTrigger>
        </TabsList>

        <TabsContent value="manage">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Tous les maillots</CardTitle>
                  <CardDescription>{jerseys.length} maillot(s)</CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => setActiveTab('create')}
                  className="rounded-xl bg-gradient-to-r from-court to-court-dark text-xs h-8"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Ajouter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {jerseysLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border skeleton-shimmer">
                      <div className="h-14 w-14 rounded-lg" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-3/4 rounded" />
                        <div className="h-3 w-1/2 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : jerseys.length === 0 ? (
                <div className="py-8 text-center">
                  <ShoppingBag className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">Aucun maillot pour le moment</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {jerseys.map((jersey) => (
                    <div
                      key={jersey.id}
                      className="flex items-center gap-3 rounded-xl border border-border/50 p-3 transition-colors hover:bg-accent/30"
                    >
                      <div className="h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                        {jersey.photos?.[0] ? (
                          <img src={jersey.photos[0]} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-neutral-100 to-neutral-200" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{jersey.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {jersey.team} · {jersey.type} · {jersey.price} €
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          onClick={() => navigate(`/admin/edit/${jersey.id}`)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Dialog open={deleteTarget?.id === jersey.id} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                          <DialogTrigger render={
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/10">
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                          } />
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Supprimer le maillot</DialogTitle>
                              <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer <strong>{jersey.name}</strong> ?
                                Cette action est irréversible.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex-col sm:flex-row gap-2">
                              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                                Annuler
                              </Button>
                              <Button variant="destructive" onClick={handleDelete}>
                                Supprimer
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <JerseyFormPage
            onSubmit={async (data) => {
              await createJersey(data, user!.uid);
              toast.success('Maillot créé !');
              setActiveTab('manage');
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function EditJersey() {
  const { id } = useParams<{ id: string }>();
  const { user, appUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { jerseys, updateJersey } = useJerseys();
  const jersey = jerseys.find((j) => j.id === id);

  useEffect(() => {
    if (!authLoading && (!user || appUser?.role !== 'admin')) {
      navigate('/');
    }
  }, [user, appUser, authLoading, navigate]);

  if (!jersey) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">Maillot introuvable</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-8 max-w-2xl mx-auto pb-24 md:pb-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin">
          <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg sm:text-xl font-bold">Modifier</h1>
          <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-none">{jersey.name}</p>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Modifier le maillot</CardTitle>
        </CardHeader>
        <CardContent>
          <JerseyFormPage
            initialData={jersey}
            onSubmit={async (data) => {
              await updateJersey(jersey.id, data, data.existingPhotos);
              toast.success('Maillot mis à jour !');
              navigate('/admin');
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// Reusable form component
function JerseyFormPage({
  initialData,
  onSubmit,
}: {
  initialData?: Jersey;
  onSubmit: (data: any) => Promise<void>;
}) {
  const [name, setName] = useState(initialData?.name || '');
  const [team, setTeam] = useState(initialData?.team || '');
  const [type, setType] = useState(initialData?.type || '');
  const [price, setPrice] = useState(String(initialData?.price || ''));
  const [description, setDescription] = useState(initialData?.description || '');
  const [photos, setPhotos] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>(initialData?.photos || []);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !team || !type || !price) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    if (photos.length === 0 && existingPhotos.length === 0) {
      toast.error('Ajoutez au moins une photo');
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        name,
        team,
        type,
        price: parseFloat(price),
        description,
        photos,
        existingPhotos,
      });
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-xs font-medium">Nom du maillot *</Label>
        <Input
          id="name"
          placeholder="Ex: Cavaliers City Edition"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="h-11 rounded-xl"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="team" className="text-xs font-medium">Équipe *</Label>
          <Input
            id="team"
            placeholder="Ex: Cleveland Cavaliers"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            required
            className="h-11 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type" className="text-xs font-medium">Type *</Label>
          <Select value={type} onValueChange={(v) => v && setType(v)} required>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {JERSEY_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price" className="text-xs font-medium">Prix indicatif (€) *</Label>
        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          placeholder="99.99"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="h-11 rounded-xl max-w-[200px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-xs font-medium">Description</Label>
        <Textarea
          id="description"
          placeholder="Description du maillot..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium">Photos * (3-4 recommandées)</Label>
        <PhotoUploader
          photos={photos}
          existingPhotos={existingPhotos}
          onChange={setPhotos}
          onRemoveExisting={(i) =>
            setExistingPhotos((prev) => prev.filter((_, idx) => idx !== i))
          }
        />
      </div>

      <Button
        type="submit"
        className="w-full h-11 rounded-xl bg-gradient-to-r from-court to-court-dark hover:from-court-dark hover:to-court-light shadow-sm"
        disabled={saving}
      >
        {saving
          ? 'Enregistrement...'
          : initialData
          ? 'Mettre à jour'
          : 'Créer le maillot'}
      </Button>
    </form>
  );
}
