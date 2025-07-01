import { Firestore, doc, setDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { firestore as db } from '@/core/firebase.config'; // Aliased path
import { Player } from '@/core/types'; // Aliased path

// Define a constant for the users collection name
export const USERS_COLLECTION = 'users';

export class UserService {
  private firestore: Firestore;

  constructor() {
    this.firestore = db; // Use the initialized Firestore instance
    console.log('UserService initialized with Firestore');
  }

  /**
   * Creates or updates a user profile in Firestore.
   * This is typically called after a new user registers via Firebase Auth.
   * @param firebaseUser - The user object from Firebase Authentication.
   * @param username - The chosen display name for the user.
   * @returns The created or updated Player profile.
   */
  async createUserProfile(firebaseUser: FirebaseUser, username: string): Promise<Player> {
    if (!firebaseUser) {
      throw new Error('Firebase user object is required to create a user profile.');
    }
    if (!username || username.trim() === '') {
        // Fallback to a generic username or part of email if not provided, though UI should enforce it.
        username = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || `User_${firebaseUser.uid.substring(0,5)}`;
    }

    const userRef = doc(this.firestore, USERS_COLLECTION, firebaseUser.uid);

    const newPlayerProfile: Player = {
      id: firebaseUser.uid, // Corresponds to Firebase Auth UID
      username: username,
      email: firebaseUser.email || '', // Email should always be present from Auth
      elo: 1000, // Default ELO score
      profileImageUrl: firebaseUser.photoURL || undefined, // Use Firebase Auth photoURL if available
      // Add any other default fields for a new player
      createdAt: serverTimestamp() as Timestamp, // Firestore server timestamp
      lastLoginAt: serverTimestamp() as Timestamp, // Mark first login
    };

    try {
      // Using setDoc with merge: true might be an option if you want to allow partial updates
      // or ensure it doesn't overwrite existing fields unintentionally if called multiple times.
      // For initial creation, a direct setDoc is fine.
      await setDoc(userRef, newPlayerProfile);
      console.log(`User profile created/updated in Firestore for UID: ${firebaseUser.uid}`);

      // Note: serverTimestamp() fields won't be populated on the client-side object immediately.
      // If you need them right away, you'd have to fetch the document again or use local Date.
      // For now, we return the profile as is, assuming client might not need exact server timestamps instantly.
      return {
        ...newPlayerProfile,
        // Simulate what serverTimestamp would do for local object if needed, but this is not the actual server time.
        // createdAt: new Date() as any,
        // lastLoginAt: new Date() as any,
      };
    } catch (error: any) {
      console.error('Error creating/updating user profile in Firestore:', error.message);
      throw error; // Re-throw for higher-level handling
    }
  }

  /**
   * Retrieves a user profile from Firestore by UID.
   * @param uid - The User ID (should match Firebase Auth UID).
   * @returns The Player profile if found, otherwise null.
   */
  async getUserProfile(uid: string): Promise<Player | null> {
    if (!uid) {
      console.warn('UID is required to fetch a user profile.');
      return null;
    }
    const userRef = doc(this.firestore, USERS_COLLECTION, uid);
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        // TODO: Add data validation here (e.g., using Zod or a simple type check)
        // to ensure the data from Firestore matches the Player interface.
        const playerData = docSnap.data() as Player; // Assume data matches Player type for now
        console.log(`User profile fetched from Firestore for UID: ${uid}`);
        return playerData;
      } else {
        console.warn(`No user profile found in Firestore for UID: ${uid}`);
        return null;
      }
    } catch (error: any) {
      console.error('Error fetching user profile from Firestore:', error.message);
      throw error;
    }
  }

  /**
   * Updates specific fields of a user's profile in Firestore.
   * @param uid - The User ID.
   * @param updates - An object containing fields to update.
   *                  Example: { username: "NewName", elo: 1200 }
   */
  async updateUserProfile(uid: string, updates: Partial<Player>): Promise<void> {
    if (!uid) {
      throw new Error('UID is required to update a user profile.');
    }
    if (!updates || Object.keys(updates).length === 0) {
      console.warn('No updates provided for user profile.');
      return;
    }

    const userRef = doc(this.firestore, USERS_COLLECTION, uid);
    try {
      // Add an 'updatedAt' timestamp automatically
      const updatesWithTimestamp = {
        ...updates,
        updatedAt: serverTimestamp() as Timestamp,
      };
      await setDoc(userRef, updatesWithTimestamp, { merge: true }); // Use merge: true for partial updates
      console.log(`User profile updated in Firestore for UID: ${uid}. Updates:`, updates);
    } catch (error: any) {
      console.error(`Error updating user profile for UID ${uid}:`, error.message);
      throw error;
    }
  }

  // TODO: Implement logic for when a Firebase Auth user is deleted.
  // This often requires a Cloud Function triggered by Firebase Auth's onDelete event
  // to ensure data consistency, as client-side deletion can be unreliable.
  // async deleteUserProfile(uid: string): Promise<void> { ... }
}
