import { Resource } from '../core/types';
import { BodyPart, Weapon, Ability, Creature } from './types';

export class CraftingService {
  constructor() {
    console.log('CraftingService initialized');
  }

  // Example: Craft a body part from resources
  craftBodyPart(name: string, resources: Resource[]): BodyPart | null {
    console.log(`Attempting to craft body part "${name}" with resources:`, resources.map(r => `${r.quantity}x ${r.name}`));
    // Placeholder logic: check if sufficient resources are provided (not implemented)
    // For now, just simulate creation if any resources are given.
    if (resources.length > 0) {
      const newBodyPart: BodyPart = {
        id: `bp_${Date.now()}_${name.replace(/\s+/g, '_')}`,
        name,
        hp: 50, // Default HP
        defense: 5, // Default defense
        x: 0, y: 0, width: 10, height: 10, // Default GameObject props
        // resourcesRequired: resources, // Store what it took
      };
      console.log('Body part crafted (simulated):', newBodyPart);
      return newBodyPart;
    }
    console.log(`Crafting body part "${name}" failed (simulated - no resources or invalid recipe).`);
    return null;
  }

  // Example: Craft a weapon
  craftWeapon(name: string, resources: Resource[]): Weapon | null {
    console.log(`Attempting to craft weapon "${name}" with resources:`, resources.map(r => `${r.quantity}x ${r.name}`));
    if (resources.length > 0) {
      const newWeapon: Weapon = {
        id: `wpn_${Date.now()}_${name.replace(/\s+/g, '_')}`,
        name,
        damage: 10, // Default damage
        range: 2, // Default range
        x: 0, y: 0, width: 5, height: 5, // Default GameObject props
        // resourcesRequired: resources,
      };
      console.log('Weapon crafted (simulated):', newWeapon);
      return newWeapon;
    }
    console.log(`Crafting weapon "${name}" failed (simulated).`);
    return null;
  }

  // Example: Develop an ability
  developAbility(name: string, resources: Resource[]): Ability | null {
    console.log(`Attempting to develop ability "${name}" with resources:`, resources.map(r => `${r.quantity}x ${r.name}`));
    if (resources.length > 0) {
      const newAbility: Ability = {
        id: `abil_${Date.now()}_${name.replace(/\s+/g, '_')}`,
        name,
        description: `A newly developed ability: ${name}`,
        // cost, effect, etc.
      };
      console.log('Ability developed (simulated):', newAbility);
      return newAbility;
    }
    console.log(`Developing ability "${name}" failed (simulated).`);
    return null;
  }

  // Assemble a creature from parts, weapons, and abilities
  assembleCreature(
    playerId: string,
    bodyParts: BodyPart[],
    weapons: Weapon[],
    abilities: Ability[]
  ): Creature | null {
    console.log(`Assembling creature for player ${playerId}`);
    if (!bodyParts || bodyParts.length === 0) {
      console.error('Cannot assemble creature without body parts.');
      return null;
    }

    const newCreature: Creature = {
      id: `creature_${playerId}_${Date.now()}`,
      playerId,
      bodyParts,
      weapons,
      abilities,
      totalHp: bodyParts.reduce((sum, part) => sum + part.hp, 0),
      moveSpeed: 5, // Default, could be derived from parts
    };
    console.log('Creature assembled (simulated):', newCreature);
    return newCreature;
  }
}
