export interface Player {
  id: string; // This will be the Firebase UID
  username: string; // Display name, can be separate from email
  email: string; // Email used for auth
  elo: number;
  profileImageUrl?: string;
  // Timestamps managed by Firestore
  createdAt?: any; // Firestore Timestamp or Date after fetch
  updatedAt?: any; // Firestore Timestamp or Date after fetch
  lastLoginAt?: any; // Firestore Timestamp or Date after fetch
  // Add other player-specific data here in the future
}

export interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  // Other common properties for game objects
}

// Basic type for resources
export interface Resource {
  id: string;
  name: string;
  type: string; // e.g., 'dna', 'protein', 'metal'
  quantity: number;
}
