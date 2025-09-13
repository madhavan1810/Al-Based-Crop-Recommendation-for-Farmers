
import { collection, writeBatch, getDocs, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type CropPrice = {
  name: string;
  price: number;
  change: number;
};

type SeedPrice = {
  name: string;
  variety: string;
  price: number;
};

export async function updateCropPrices(prices: CropPrice[]): Promise<void> {
  const batch = writeBatch(db);
  const cropPricesRef = collection(db, 'crop-prices');

  // Optional: Delete existing documents to prevent stale data
  const existingDocs = await getDocs(cropPricesRef);
  existingDocs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  prices.forEach((price) => {
    const docRef = doc(cropPricesRef, price.name.replace(/ /g, '-').toLowerCase());
    batch.set(docRef, price);
  });

  await batch.commit();
  console.log('Crop prices updated in Firestore.');
}

export async function updateSeedPrices(prices: SeedPrice[]): Promise<void> {
  const batch = writeBatch(db);
  const seedPricesRef = collection(db, 'seed-prices');

  // Optional: Delete existing documents to prevent stale data
  const existingDocs = await getDocs(seedPricesRef);
  existingDocs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  prices.forEach((price) => {
    const docRef = doc(seedPricesRef, `${price.name}-${price.variety}`.replace(/ /g, '-').toLowerCase());
    batch.set(docRef, price);
  });

  await batch.commit();
  console.log('Seed prices updated in Firestore.');
}
