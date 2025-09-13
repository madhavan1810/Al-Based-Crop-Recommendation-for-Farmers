
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type UserProfile = {
  name: string;
  email: string;
  location: string;
  landSize: number;
};

export async function createUserProfile(userId: string, data: UserProfile): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, data);
  } catch (error) {
    console.error("Error creating user profile: ", error);
    throw new Error('Failed to create user profile.');
  }
}
