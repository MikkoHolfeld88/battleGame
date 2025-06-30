export interface Player {
  id: string;
  username: string;
  elo: number;
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
