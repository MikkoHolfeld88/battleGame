import { Match, Creature, InputAction } from './types';
import { Player } from '../core/types';

export class BattleService {
  private activeBattles: Map<string, Match> = new Map(); // Key is matchId

  constructor() {
    // Could initialize connections to a real-time battle server or physics engine.
    console.log('BattleService initialized');
  }

  startBattle(match: Match): void {
    if (!match || !match.id) {
      console.error('Cannot start battle: Invalid match data provided.');
      return;
    }
    console.log(`Starting battle for match: ${match.id}`);
    match.status = 'active';
    match.startTime = new Date(); // Reset start time to actual battle start
    this.activeBattles.set(match.id, match);
    // Further setup: initialize player positions, creatures, game state, etc.
    // This would involve loading player-created Creatures.
  }

  // This would be called frequently, e.g., on a game loop tick
  updateBattleState(matchId: string, deltaTime: number): void {
    const match = this.activeBattles.get(matchId);
    if (!match || match.status !== 'active') {
      // console.warn(`Battle ${matchId} not active or not found for update.`);
      return;
    }

    // Placeholder for battle logic:
    // - Process inputs
    // - Update creature positions/states based on physics, abilities
    // - Detect collisions, damage
    // - Check for win/loss conditions
    // console.log(`Updating battle state for match ${matchId}, deltaTime: ${deltaTime}`);

    // Simulate some game progression or win condition for demonstration
    if (Math.random() < 0.001) { // Low chance to end the match
        this.endBattle(matchId, match.players[0]); // Simulate player 0 winning
    }
  }

  handlePlayerAction(matchId: string, playerId: string, action: InputAction): void {
    const match = this.activeBattles.get(matchId);
    if (!match || match.status !== 'active') {
      console.warn(`Cannot handle action for inactive/non-existent match ${matchId}`);
      return;
    }
    // In a real game, this would translate 'action' into game mechanics
    // e.g., move a creature, use an ability, etc.
    console.log(`Player ${playerId} in match ${matchId} performed action: ${action.actionName} (Input: ${action.inputId})`);
    // Example: match.gameState.creatures[playerId].perform(action.actionName);
  }

  endBattle(matchId: string, winner: Player | null): void {
    const match = this.activeBattles.get(matchId);
    if (!match) {
      console.error(`Match ${matchId} not found to end.`);
      return;
    }
    console.log(`Ending battle for match: ${matchId}. Winner: ${winner ? winner.username : 'Draw/None'}`);
    match.status = 'finished';
    match.winner = winner;

    // Further cleanup: update player ELOs, save results, etc.
    this.activeBattles.delete(matchId);
  }

  getBattleState(matchId: string): Match | undefined {
    return this.activeBattles.get(matchId);
  }
}
