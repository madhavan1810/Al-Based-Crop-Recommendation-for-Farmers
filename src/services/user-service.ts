
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type UserProfile = {
  name: string;
  email: string;
};

export async function createUserProfile(userId: string, data: Omit<UserProfile, 'email'> & { email: string }): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, data);
  } catch (error) {
    console.error("Error creating user profile: ", error);
    throw new Error('Failed to create user profile.');
  }
}
