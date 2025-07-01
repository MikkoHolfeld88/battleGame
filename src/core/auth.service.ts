import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser, // Firebase's User type
  updateProfile,
} from 'firebase/auth';
import { auth as firebaseAuth } from '@/core/firebase.config'; // Use aliased path
import { Player } from '@/core/types'; // Use aliased path

// We will define this service later, for now, it's a placeholder type
// It will be responsible for creating/updating user data in Firestore.
interface UserService {
  createUserProfile(firebaseUser: FirebaseUser, username: string): Promise<Player>;
  getUserProfile(uid: string): Promise<Player | null>;
}

export class AuthService {
  private auth: Auth;
  private userService: UserService; // Will be injected or instantiated

  constructor(userService: UserService) { // Accept UserService dependency
    this.auth = firebaseAuth; // Use the initialized Firebase auth instance
    this.userService = userService;
    console.log('AuthService initialized with Firebase Auth');
  }

  /**
   * Registers a new user with email, password, and a username.
   * Creates a corresponding user profile in Firestore.
   */
  async register(email: string, password_raw: string, username: string): Promise<Player | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password_raw);
      const firebaseUser = userCredential.user;

      // Update Firebase Auth profile with username (optional, but good practice)
      await updateProfile(firebaseUser, { displayName: username });

      // Create user profile in Firestore via UserService
      // This assumes createUserProfile will return a Player object
      const appUser = await this.userService.createUserProfile(firebaseUser, username);

      console.log('User registered successfully with Firebase and profile created:', appUser);
      return appUser;
    } catch (error: any) {
      console.error('Firebase registration error:', error.message, 'Code:', error.code);
      // Consider mapping Firebase error codes to user-friendly messages
      throw error; // Re-throw for the UI to handle
    }
  }

  /**
   * Logs in an existing user with email and password.
   * Fetches the user profile from Firestore.
   */
  async login(email: string, password_raw: string): Promise<Player | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password_raw);
      const firebaseUser = userCredential.user;

      // Fetch the user profile from Firestore
      const appUser = await this.userService.getUserProfile(firebaseUser.uid);
      if (!appUser) {
          // This case should ideally not happen if registration always creates a profile.
          // Could be a sign of data inconsistency or a user from a different auth method.
          console.warn(`User ${firebaseUser.uid} logged in via Firebase, but no Firestore profile found. Creating one now.`);
          // Potentially create a profile here if missing, or handle as an error.
          // For now, let's assume it must exist or login is incomplete for our app's purposes.
          throw new Error("User profile not found in Firestore after Firebase login.");
      }

      console.log('User logged in successfully with Firebase:', appUser);
      return appUser;
    } catch (error: any) {
      console.error('Firebase login error:', error.message, 'Code:', error.code);
      throw error; // Re-throw for the UI to handle
    }
  }

  /**
   * Logs out the current user.
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('User logged out successfully from Firebase.');
    } catch (error: any) {
      console.error('Firebase logout error:', error.message);
      throw error;
    }
  }

  /**
   * Sends a password reset email to the given email address.
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log('Password reset email sent successfully to:', email);
    } catch (error: any) {
      console.error('Firebase password reset error:', error.message);
      throw error;
    }
  }

  /**
   * Gets the current Firebase authenticated user.
   * Note: This returns FirebaseUser. The UI layer might then fetch the full Player profile.
   */
  getCurrentFirebaseUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }

  /**
   * Returns a Player profile if a user is logged in, otherwise null.
   * This is an example of how you might combine Firebase auth state with Firestore profile.
   */
  async getCurrentAppPlayer(): Promise<Player | null> {
    const firebaseUser = this.getCurrentFirebaseUser();
    if (firebaseUser) {
      try {
        const appUser = await this.userService.getUserProfile(firebaseUser.uid);
        return appUser;
      } catch (error) {
        console.error("Error fetching app user profile for current Firebase user:", error);
        return null;
      }
    }
    return null;
  }

  /**
   * Listens to Firebase authentication state changes.
   * @param callback - Function to call with the FirebaseUser or null.
   * @returns Unsubscribe function.
   */
  onAuthStateChanged(callback: (firebaseUser: FirebaseUser | null) => void): () => void {
    return this.auth.onAuthStateChanged(callback);
  }
}
