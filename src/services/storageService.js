import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Upload an image from a URI to Firebase Storage.
 * @param {string} uri - local file URI
 * @param {string} storagePath - path in Firebase Storage (e.g., 'listings/abc/photo_0.jpg')
 * @returns {Promise<string>} download URL
 */
export async function uploadImage(uri, storagePath) {
    // Fetch the image as a blob
    const response = await fetch(uri);
    const blob = await response.blob();

    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
}

/**
 * Upload a verification document.
 * @param {string} uid - user ID
 * @param {string} uri - local file URI
 * @param {string} docType - 'nic_front' | 'nic_back' | 'student_id'
 * @returns {Promise<string>} download URL
 */
export async function uploadVerificationDoc(uid, uri, docType) {
    const storagePath = `verifications/${uid}/${docType}_${Date.now()}.jpg`;
    return uploadImage(uri, storagePath);
}

/**
 * Upload a listing photo.
 * @param {string} listingId
 * @param {string} uri - local file URI
 * @param {number} index - photo index
 * @returns {Promise<string>} download URL
 */
export async function uploadListingPhoto(listingId, uri, index) {
    const storagePath = `listings/${listingId}/photo_${index}_${Date.now()}.jpg`;
    return uploadImage(uri, storagePath);
}
