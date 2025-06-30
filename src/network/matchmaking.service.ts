import { Player } from '../core/types';
import { Match } from '../game/types';

export class MatchmakingService {
  private queue: Player[] = [];

  constructor() {
    // This could connect to a matchmaking server or use a DB queue.
    console.log('MatchmakingService initialized');
  }

  async findMatch(player: Player): Promise<Match | null> {
    console.log(`Player ${player.username} (ELO: ${player.elo}) is looking for a match.`);
    this.queue.push(player);

    // Simple matchmaking: try to pair two players from the queue.
    // A real system would have more complex ELO matching, regions, etc.
    if (this.queue.length >= 2) {
      const player1 = this.queue.shift();
      const player2 = this.queue.shift();

      if (player1 && player2) {
        console.log(`Match found between ${player1.username} and ${player2.username}`);
        const newMatch: Match = {
          id: `match_${Date.now()}`,
          players: [player1, player2],
          startTime: new Date(),
          status: 'pending', // Or 'active' if it starts immediately
          gameState: {}, // Initial empty game state
        };
        // In a real system, this match would be created in a database
        // and players would be notified.
        return newMatch;
      }
    }

    console.log('No suitable match found yet. Player added to queue.');
    return null; // No match found yet
  }

  async cancelSearch(playerId: string): Promise<void> {
    console.log(`Player ${playerId} is cancelling matchmaking search.`);
    this.queue = this.queue.filter(p => p.id !== playerId);
    return Promise.resolve();
  }
}
