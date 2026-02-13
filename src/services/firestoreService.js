import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    addDoc,
    collection,
    query,
    where,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ========================
// USERS
// ========================

/**
 * Create a new user profile document in Firestore.
 */
export async function createUserProfile(uid, data) {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
        name: data.name,
        email: data.email,
        role: data.role, // 'student' or 'landlord'
        university: null,
        verificationStatus: 'none', // 'none' | 'pending' | 'verified'
        photoURL: null,
        createdAt: serverTimestamp(),
    });
}

/**
 * Get user profile by UID.
 */
export async function getUserProfile(uid) {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
    }
    return null;
}

/**
 * Update user profile fields.
 */
export async function updateUserProfile(uid, data) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
}

// ========================
// LISTINGS (Hostels)
// ========================

/**
 * Create a new hostel listing.
 */
export async function createListing(data) {
    const listingsRef = collection(db, 'listings');
    const docRef = await addDoc(listingsRef, {
        landlordId: data.landlordId,
        title: data.title,
        description: data.description || '',
        price: Number(data.price),
        location: data.location,
        position: data.position || [0, 0],
        gender: data.gender || 'Any',
        amenities: data.amenities || [],
        photos: data.photos || [],
        rating: 0,
        reviews: 0,
        active: true,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

/**
 * Get all active listings, optionally filtered.
 */
export async function getListings() {
    const listingsRef = collection(db, 'listings');
    const snapshot = await getDocs(listingsRef);
    const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort client-side to avoid needing a composite Firestore index
    return listings.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}

/**
 * Get listings belonging to a specific landlord.
 */
export async function getListingsByLandlord(landlordId) {
    const listingsRef = collection(db, 'listings');
    const q = query(listingsRef, where('landlordId', '==', landlordId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ========================
// BOOKINGS
// ========================

/**
 * Create a new booking request.
 */
export async function createBooking(data) {
    const bookingsRef = collection(db, 'bookings');
    const docRef = await addDoc(bookingsRef, {
        studentId: data.studentId,
        studentName: data.studentName,
        landlordId: data.landlordId,
        listingId: data.listingId,
        listingTitle: data.listingTitle,
        roomType: data.roomType || 'Single Room',
        moveInDate: data.moveInDate,
        status: 'pending',
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

/**
 * Get bookings for a landlord.
 */
export async function getBookingsByLandlord(landlordId) {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('landlordId', '==', landlordId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Update booking status (accept/decline).
 */
export async function updateBookingStatus(bookingId, status) {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { status });
}

// ========================
// VERIFICATIONS
// ========================

/**
 * Submit verification data for a user.
 */
export async function submitVerification(uid, data) {
    const verificationRef = doc(db, 'verifications', uid);
    await setDoc(verificationRef, {
        role: data.role,
        nic: data.nic,
        studentId: data.studentId || null,
        nicPhotoURL: data.nicPhotoURL || null,
        studentIdPhotoURL: data.studentIdPhotoURL || null,
        status: 'pending',
        submittedAt: serverTimestamp(),
    });

    // Also update the user's verification status
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { verificationStatus: 'pending' });
}

/**
 * Get verification status for a user.
 */
export async function getVerificationStatus(uid) {
    const verificationRef = doc(db, 'verifications', uid);
    const snap = await getDoc(verificationRef);
    if (snap.exists()) {
        return snap.data();
    }
    return null;
}
