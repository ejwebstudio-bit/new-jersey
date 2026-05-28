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
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';

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

  useEffect(() => {
    if (!authLoading && (!user || appUser?.role !== 'admin')) {
      navigate('/');
    }
  }, [user, appUser, authLoading, navigate]);

  if (authLoading || !appUser) {
    return <div className="p-8 text-center">Chargement...</div>;
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
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium hover:underline mb-4 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Retour à la galerie
      </Link>

      <Tabs defaultValue="manage">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Administration</h1>
          <TabsList>
            <TabsTrigger value="manage">Maillots</TabsTrigger>
            <TabsTrigger value="create">Nouveau</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Gérer les maillots</CardTitle>
              <CardDescription>{jerseys.length} maillot(s) dans la collection</CardDescription>
            </CardHeader>
            <CardContent>
              {jerseysLoading ? (
                <p>Chargement...</p>
              ) : jerseys.length === 0 ? (
                <p className="text-muted-foreground">Aucun maillot pour le moment</p>
              ) : (
                <div className="space-y-3">
                  {jerseys.map((jersey) => (
                    <div
                      key={jersey.id}
                      className="flex items-center gap-4 rounded-lg border p-3"
                    >
                      <div className="h-16 w-16 rounded-md overflow-hidden bg-muted shrink-0">
                        {jersey.photos?.[0] ? (
                          <img
                            src={jersey.photos[0]}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{jersey.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {jersey.team} · {jersey.type} · {jersey.price} €
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => navigate(`/admin/edit/${jersey.id}`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Dialog open={deleteTarget?.id === jersey.id} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                              <DialogTrigger render={<Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>} />
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Supprimer le maillot</DialogTitle>
                              <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer "{jersey.name}" ?
                                Cette action est irréversible.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
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
              navigate('/admin');
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Edit page (separate route)
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
    return <div className="p-8 text-center">Maillot introuvable</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-medium hover:underline mb-4 -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Retour à l'administration
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Modifier le maillot</CardTitle>
          <CardDescription>{jersey.name}</CardDescription>
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
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom du maillot *</Label>
        <Input
          id="name"
          placeholder="Ex: Cavaliers City Edition"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="team">Équipe *</Label>
        <Input
          id="team"
          placeholder="Ex: Cleveland Cavaliers"
          value={team}
          onChange={(e) => setTeam(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type *</Label>
          <Select value={type} onValueChange={(v) => v && setType(v)} required>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un type" />
          </SelectTrigger>
          <SelectContent>
            {JERSEY_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Prix indicatif (€) *</Label>
        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          placeholder="99.99"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Description du maillot..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Photos * (3-4 recommandées)</Label>
        <PhotoUploader
          photos={photos}
          existingPhotos={existingPhotos}
          onChange={setPhotos}
          onRemoveExisting={(i) =>
            setExistingPhotos((prev) => prev.filter((_, idx) => idx !== i))
          }
        />
      </div>

      <Button type="submit" className="w-full" disabled={saving}>
        {saving
          ? 'Enregistrement...'
          : initialData
          ? 'Mettre à jour'
          : 'Créer le maillot'}
      </Button>
    </form>
  );
}
