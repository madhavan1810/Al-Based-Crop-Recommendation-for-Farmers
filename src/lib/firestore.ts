import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  type Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { v4 as uuidv4 } from 'uuid';

// Data Models
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  location?: string;
  soilType?: string;
  waterSource?: string;
  annualBudget?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Farm {
  id?: string;
  ownerId: string;
  farmName: string;
  location: string;
  district: string;
  sizeAcres: number;
  soilType: string;
  topography: string;
  waterSource: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Crop {
  id?: string;
  farmId: string;
  ownerId: string;
  cropType: string;
  variety?: string;
  plantingDate: Timestamp;
  expectedHarvestDate: Timestamp;
  actualHarvestDate?: Timestamp;
  status: 'planned' | 'planted' | 'growing' | 'harvested' | 'failed';
  expectedYield?: number;
  actualYield?: number;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SensorData {
  id?: string;
  farmId: string;
  sensorId: string;
  timestamp: Timestamp;
  type: 'temperature' | 'humidity' | 'soil_moisture' | 'ph' | 'light' | 'rainfall';
  value: number;
  unit: string;
  location?: string;
  createdAt: Timestamp;
}

export interface CultivationPlan {
  id?: string;
  ownerId: string;
  farmId?: string;
  cropType: string;
  district: string;
  sowingDate: Timestamp;
  planData: any; // The AI-generated plan structure
  status: 'active' | 'completed' | 'archived';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SoilReport {
  id?: string;
  ownerId: string;
  farmId?: string;
  year: number;
  reportType: 'pdf' | 'image' | 'manual';
  fileUrl?: string;
  data: {
    ph?: number;
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
    organicMatter?: number;
    notes?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// User Profile CRUD Operations
export async function createUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...data,
    uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() } as UserProfile;
  }
  return null;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Farm CRUD Operations
export async function addFarm(userId: string, farmData: Omit<Farm, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const farmsRef = collection(db, 'farms');
  const docRef = await addDoc(farmsRef, {
    ...farmData,
    ownerId: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getFarmsForUser(userId: string): Promise<Farm[]> {
  const farmsRef = collection(db, 'farms');
  const q = query(farmsRef, where('ownerId', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Farm[];
}

export async function getFarm(farmId: string): Promise<Farm | null> {
  const farmRef = doc(db, 'farms', farmId);
  const farmSnap = await getDoc(farmRef);
  
  if (farmSnap.exists()) {
    return { id: farmSnap.id, ...farmSnap.data() } as Farm;
  }
  return null;
}

export async function updateFarm(farmId: string, updateData: Partial<Farm>): Promise<void> {
  const farmRef = doc(db, 'farms', farmId);
  await updateDoc(farmRef, {
    ...updateData,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteFarm(farmId: string): Promise<void> {
  const farmRef = doc(db, 'farms', farmId);
  await deleteDoc(farmRef);
}

// Crop CRUD Operations
export async function addCrop(cropData: Omit<Crop, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const cropsRef = collection(db, 'crops');
  const docRef = await addDoc(cropsRef, {
    ...cropData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getCropsForFarm(farmId: string): Promise<Crop[]> {
  const cropsRef = collection(db, 'crops');
  const q = query(cropsRef, where('farmId', '==', farmId), orderBy('plantingDate', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Crop[];
}

export async function getCropsForUser(userId: string): Promise<Crop[]> {
  const cropsRef = collection(db, 'crops');
  const q = query(cropsRef, where('ownerId', '==', userId), orderBy('plantingDate', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Crop[];
}

export async function updateCrop(cropId: string, updateData: Partial<Crop>): Promise<void> {
  const cropRef = doc(db, 'crops', cropId);
  await updateDoc(cropRef, {
    ...updateData,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCrop(cropId: string): Promise<void> {
  const cropRef = doc(db, 'crops', cropId);
  await deleteDoc(cropRef);
}

// Sensor Data Operations
export async function addSensorData(sensorData: Omit<SensorData, 'id' | 'createdAt'>): Promise<string> {
  const sensorRef = collection(db, 'sensorData');
  const docRef = await addDoc(sensorRef, {
    ...sensorData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getSensorDataForFarm(farmId: string, limit: number = 50): Promise<SensorData[]> {
  const sensorRef = collection(db, 'sensorData');
  const q = query(
    sensorRef, 
    where('farmId', '==', farmId), 
    orderBy('timestamp', 'desc')
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.slice(0, limit).map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as SensorData[];
}

// Cultivation Plan Operations
export async function saveCultivationPlan(planData: Omit<CultivationPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const plansRef = collection(db, 'cultivationPlans');
  const docRef = await addDoc(plansRef, {
    ...planData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getCultivationPlansForUser(userId: string): Promise<CultivationPlan[]> {
  const plansRef = collection(db, 'cultivationPlans');
  const q = query(plansRef, where('ownerId', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as CultivationPlan[];
}

export async function updateCultivationPlan(planId: string, updateData: Partial<CultivationPlan>): Promise<void> {
  const planRef = doc(db, 'cultivationPlans', planId);
  await updateDoc(planRef, {
    ...updateData,
    updatedAt: serverTimestamp(),
  });
}

// Soil Report Operations
export async function saveSoilReport(reportData: Omit<SoilReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const reportsRef = collection(db, 'soilReports');
  const docRef = await addDoc(reportsRef, {
    ...reportData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getSoilReportsForUser(userId: string): Promise<SoilReport[]> {
  const reportsRef = collection(db, 'soilReports');
  const q = query(reportsRef, where('ownerId', '==', userId), orderBy('year', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as SoilReport[];
}

export async function updateSoilReport(reportId: string, updateData: Partial<SoilReport>): Promise<void> {
  const reportRef = doc(db, 'soilReports', reportId);
  await updateDoc(reportRef, {
    ...updateData,
    updatedAt: serverTimestamp(),
  });
}