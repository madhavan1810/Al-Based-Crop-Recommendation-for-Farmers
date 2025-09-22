import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads an image file to Firebase Storage
 * @param file - The file to upload
 * @param userId - The user ID for organizing files
 * @param folder - Optional folder name (defaults to 'images')
 * @returns Promise<string> - The public download URL
 */
export async function uploadImage(
  file: File, 
  userId: string, 
  folder: string = 'images'
): Promise<string> {
  try {
    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    
    // Create storage reference
    const storageRef = ref(storage, `users/${userId}/${folder}/${uniqueFilename}`);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file. Please try again.');
  }
}

/**
 * Uploads a soil report (PDF or image) to Firebase Storage
 * @param file - The soil report file
 * @param userId - The user ID
 * @returns Promise<string> - The public download URL
 */
export async function uploadSoilReport(file: File, userId: string): Promise<string> {
  return uploadImage(file, userId, 'soil-reports');
}

/**
 * Uploads a plant disease image to Firebase Storage
 * @param file - The plant image file
 * @param userId - The user ID
 * @returns Promise<string> - The public download URL
 */
export async function uploadPlantImage(file: File, userId: string): Promise<string> {
  return uploadImage(file, userId, 'plant-images');
}

/**
 * Converts a file to base64 data URI for AI processing
 * @param file - The file to convert
 * @returns Promise<string> - Base64 data URI
 */
export function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/*
IMPORTANT: Configure CORS rules in Firebase Console for the following domains:
- https://*.stackblitz.io
- https://*.bolt.new
- http://localhost:3000

To configure CORS:
1. Go to Firebase Console > Storage > Rules
2. Add the allowed origins to your storage rules
3. Or use gsutil to configure CORS if needed
*/