import { Player, GameObject, Resource } from '../core/types';

export interface Match {
  id: string;
  players: [Player, Player];
  startTime: Date;
  status: 'pending' | 'active' | 'finished';
  // Winner might be null if pending or active
  winner?: Player | null;
  // Game state specific to the match
  gameState: any; // This will be refined later
}

export interface BodyPart extends GameObject {
  name: string;
  hp: number;
  defense: number;
  // resourcesRequired: Resource[]; // Resources needed to build this
  // other properties like attack power if it's an attacking part
}

export interface Weapon extends GameObject {
  name: string;
  damage: number;
  range: number;
  // resourcesRequired: Resource[];
  // special effects, etc.
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  // cost (e.g. energy, cooldown)
  // effect (function or data describing the effect)
}

// This could represent the player's created being/character
export interface Creature {
  id: string;
  playerId: string;
  bodyParts: BodyPart[];
  weapons: Weapon[];
  abilities: Ability[];
  // Overall stats derived from parts
  totalHp: number;
  moveSpeed: number;
}

// For mapping inputs to actions
export interface InputAction {
  inputId: string; // e.g., 'w_press', 'mouse_left_click', 'phone_tilt_forward'
  actionName: string; // e.g., 'move_forward', 'primary_attack'
  // parameters for the action, if any
}

export interface InputConfiguration {
  deviceId: string; // e.g., 'keyboard_mouse', 'gamepad_xbox', 'mobile_touch'
  mappings: InputAction[];
}
