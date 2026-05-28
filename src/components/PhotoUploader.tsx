import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, X } from 'lucide-react';

interface Props {
  photos: File[];
  existingPhotos?: string[];
  onChange: (files: File[]) => void;
  onRemoveExisting?: (index: number) => void;
  maxPhotos?: number;
}

export default function PhotoUploader({
  photos,
  existingPhotos = [],
  onChange,
  onRemoveExisting,
  maxPhotos = 6,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleSelect = () => {
    inputRef.current?.click();
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = maxPhotos - photos.length - existingPhotos.length;
    const selected = files.slice(0, remaining);

    // Create previews
    const newPreviews = selected.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);

    onChange([...photos, ...selected]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeNew = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    onChange(photos.filter((_, i) => i !== index));
  };

  const totalPhotos = existingPhotos.length + photos.length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {/* Existing photos */}
        {existingPhotos.map((url, i) => (
          <div key={`existing-${i}`} className="relative h-20 w-20 rounded-md overflow-hidden border">
            <img src={url} alt="" className="h-full w-full object-cover" />
            {onRemoveExisting && (
              <button
                type="button"
                onClick={() => onRemoveExisting(i)}
                className="absolute top-0.5 right-0.5 rounded-full bg-destructive text-destructive-foreground p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}

        {/* New photos */}
        {previews.map((url, i) => (
          <div key={`new-${i}`} className="relative h-20 w-20 rounded-md overflow-hidden border">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeNew(i)}
              className="absolute top-0.5 right-0.5 rounded-full bg-destructive text-destructive-foreground p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* Add button */}
        {totalPhotos < maxPhotos && (
          <Button
            type="button"
            variant="outline"
            className="h-20 w-20"
            onClick={handleSelect}
          >
            <ImagePlus className="h-6 w-6" />
          </Button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
      <p className="text-xs text-muted-foreground">
        {totalPhotos}/{maxPhotos} photos · Formats image acceptés
      </p>
    </div>
  );
}
