import { Player, Resource } from '../core/types';

export class GatheringService {
  constructor() {
    console.log('GatheringService initialized');
  }

  startGatheringPhase(player: Player): void {
    // Initialize the gathering environment for the player
    // This might involve generating resources on a map, etc.
    console.log(`Starting gathering phase for player ${player.username}.`);
    // Example: this.playerResourceMap.set(player.id, []);
  }

  // Called when a player collects a resource
  collectResource(player: Player, resource: Resource): void {
    if (!player || !resource) {
        console.error('Player or resource undefined in collectResource');
        return;
    }
    console.log(`Player ${player.username} collected ${resource.quantity} of ${resource.name} (${resource.type}).`);
    // Add resource to player's inventory (this would be stored more persistently)
    // Example:
    // let inventory = this.playerResourceMap.get(player.id) || [];
    // const existingResource = inventory.find(r => r.id === resource.id);
    // if (existingResource) {
    //   existingResource.quantity += resource.quantity;
    // } else {
    //   inventory.push({...resource});
    // }
    // this.playerResourceMap.set(player.id, inventory);
  }

  // Potentially updates the gathering environment, e.g., respawning resources
  updateGatheringState(deltaTime: number): void {
    // console.log(`Updating gathering state, deltaTime: ${deltaTime}`);
    // For example, resources might regenerate or new ones might appear.
  }

  endGatheringPhase(player: Player): Resource[] {
    console.log(`Ending gathering phase for player ${player.username}.`);
    // Return all collected resources
    // const collectedResources = this.playerResourceMap.get(player.id) || [];
    // this.playerResourceMap.delete(player.id); // Clear for next phase/player
    // For now, returning a dummy list
    const dummyResources: Resource[] = [
        {id: 'res1', name: 'Iron Ore', type: 'metal', quantity: 10},
        {id: 'res2', name: 'Ancient DNA', type: 'dna', quantity: 2},
    ];
    console.log('Collected resources (simulated):', dummyResources);
    return dummyResources;
  }
}
