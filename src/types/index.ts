export interface Jersey {
  id: string;
  name: string;
  team: string;
  type: string;
  price: number;
  description: string;
  photos: string[];
  createdBy: string;
  createdAt: number;
}

export interface UserPrice {
  userId: string;
  jerseyId: string;
  price: number;
  updatedAt: number;
}

export interface AppUser {
  uid: string;
  email: string;
  role: 'admin' | 'member';
  displayName: string;
}

export type JerseyFormData = Omit<Jersey, 'id' | 'photos' | 'createdBy' | 'createdAt'> & {
  photos: File[];
  existingPhotos?: string[];
};
