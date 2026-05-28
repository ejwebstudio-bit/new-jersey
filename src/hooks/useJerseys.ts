import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import type { Jersey, JerseyFormData, UserPrice } from '@/types';

export function useJerseys() {
  const [jerseys, setJerseys] = useState<Jersey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'jerseys'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Jersey[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Jersey[];
      setJerseys(list);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const uploadPhotos = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of files) {
      const storageRef = ref(storage, `jerseys/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }
    return urls;
  };

  const createJersey = async (data: JerseyFormData, userId: string): Promise<string> => {
    const photoUrls = await uploadPhotos(data.photos);
    const docRef = await addDoc(collection(db, 'jerseys'), {
      name: data.name,
      team: data.team,
      type: data.type,
      price: data.price,
      description: data.description,
      photos: photoUrls,
      createdBy: userId,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  };

  const updateJersey = async (id: string, data: JerseyFormData, existingPhotos: string[] = []): Promise<void> => {
    const newPhotoUrls = data.photos.length > 0 ? await uploadPhotos(data.photos) : [];
    const allPhotos = [...existingPhotos, ...newPhotoUrls];
    await updateDoc(doc(db, 'jerseys', id), {
      name: data.name,
      team: data.team,
      type: data.type,
      price: data.price,
      description: data.description,
      photos: allPhotos,
    });
  };

  const deleteJersey = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'jerseys', id));
  };

  return { jerseys, loading, createJersey, updateJersey, deleteJersey };
}

export function useUserPrice(userId: string | undefined, jerseyId: string | undefined) {
  const [price, setPrice] = useState<UserPrice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !jerseyId) {
      setLoading(false);
      return;
    }
    const docRef = doc(db, 'userPrices', `${userId}_${jerseyId}`);
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setPrice(snap.data() as UserPrice);
      } else {
        setPrice(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [userId, jerseyId]);

  const setUserPrice = useCallback(async (newPrice: number) => {
    if (!userId || !jerseyId) return;
    await setDoc(doc(db, 'userPrices', `${userId}_${jerseyId}`), {
      userId,
      jerseyId,
      price: newPrice,
      updatedAt: serverTimestamp(),
    });
  }, [userId, jerseyId]);

  return { price, loading, setUserPrice };
}
