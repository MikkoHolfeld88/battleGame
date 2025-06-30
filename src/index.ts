import { AuthService } from './core/auth.service';
import { InputService } from './core/input.service';
import { MatchmakingService } from './network/matchmaking.service';
import { GatheringService } from './game/gathering.service';
import { CraftingService } from './game/crafting.service';
import { BattleService } from './game/battle.service';
import { Player, Resource } from './core/types';
import { Creature, InputConfiguration } from './game/types';

async function main() {
  console.log('Initializing game systems...');

  const authService = new AuthService();
  const inputService = new InputService();
  const matchmakingService = new MatchmakingService();
  const gatheringService = new GatheringService();
  const craftingService = new CraftingService();
  const battleService = new BattleService();

  console.log('\\n--- Game Simulation Start ---');

  // 1. Player Registration & Login
  console.log('\\n--- 1. Authentication ---');
  let player1: Player | null = await authService.register('Alice');
  let player2: Player | null = await authService.register('Bob');

  if (!player1 || !player2) {
    console.error('Failed to register players. Exiting simulation.');
    return;
  }
  console.log('Players registered:', player1.username, player2.username);
  player1 = await authService.login('Alice'); // Re-assign to get simulated logged-in player
  player2 = await authService.login('Bob'); // (in real app, token/session would be managed)


  if (!player1 || !player2) {
    console.error('Failed to login players. Exiting simulation.');
    return;
  }

  // 2. Input Configuration (Example for Player 1)
  console.log('\\n--- 2. Input Setup (Player 1) ---');
  const keyboardConfig: InputConfiguration = {
    deviceId: 'keyboard_mouse_main',
    mappings: [
      { inputId: 'w_press', actionName: 'move_forward' },
      { inputId: 's_press', actionName: 'move_backward' },
      { inputId: 'space_press', actionName: 'jump' },
      { inputId: 'mouse_left_press', actionName: 'primary_attack' },
    ],
  };
  inputService.loadConfiguration(keyboardConfig);
  inputService.onAction('move_forward', (action) => {
    console.log(`[${player1?.username}] Action received: ${action.actionName} (from ${action.inputId})`);
  });
  inputService.onAction('primary_attack', (action) => {
    console.log(`[${player1?.username}] Action received: ${action.actionName} (from ${action.inputId})`);
  });


  // 3. Gathering Phase
  console.log('\\n--- 3. Gathering Phase ---');
  gatheringService.startGatheringPhase(player1);
  gatheringService.startGatheringPhase(player2);

  // Simulate resource collection
  const p1_res1: Resource = { id: 'dna_strand', name: 'Alien DNA', type: 'dna', quantity: 5 };
  const p1_res2: Resource = { id: 'metal_scrap', name: 'Scrap Metal', type: 'metal', quantity: 10 };
  gatheringService.collectResource(player1, p1_res1);
  gatheringService.collectResource(player1, p1_res2);

  const p2_res1: Resource = { id: 'bio_gel', name: 'Bio-Gel', type: 'organic', quantity: 8 };
  const p2_res2: Resource = { id: 'crystal_shard', name: 'Energy Crystal', type: 'crystal', quantity: 3 };
  gatheringService.collectResource(player2, p2_res1);
  gatheringService.collectResource(player2, p2_res2);

  const player1CollectedResources = gatheringService.endGatheringPhase(player1);
  const player2CollectedResources = gatheringService.endGatheringPhase(player2);


  // 4. Crafting Phase
  console.log('\\n--- 4. Crafting Phase ---');
  // Player 1 crafts
  const p1_leg = craftingService.craftBodyPart('Sturdy Leg', [player1CollectedResources.find(r=>r.type === 'metal')!]);
  const p1_arm = craftingService.craftBodyPart('Claw Arm', [player1CollectedResources.find(r=>r.type === 'dna')!]);
  const p1_weapon = craftingService.craftWeapon('Laser Pointer', [player1CollectedResources.find(r=>r.type === 'metal')!]); // Not very threatening

  let player1Creature: Creature | null = null;
  if (p1_leg && p1_arm && p1_weapon) {
    player1Creature = craftingService.assembleCreature(player1.id, [p1_leg, p1_arm], [p1_weapon], []);
  }

  // Player 2 crafts
  const p2_wing = craftingService.craftBodyPart('Membrane Wing', [player2CollectedResources.find(r=>r.type === 'organic')!]);
  const p2_eye = craftingService.craftBodyPart('Focusing Eye', [player2CollectedResources.find(r=>r.type === 'crystal')!]);
  const p2_ability = craftingService.developAbility('Energy Shield', [player2CollectedResources.find(r=>r.type === 'crystal')!]);

  let player2Creature: Creature | null = null;
  if (p2_wing && p2_eye && p2_ability) {
    player2Creature = craftingService.assembleCreature(player2.id, [p2_wing, p2_eye], [], [p2_ability]);
  }

  if (!player1Creature || !player2Creature) {
    console.error('Failed to create creatures. Exiting simulation.');
    return;
  }
  console.log(`${player1.username}'s Creature HP: ${player1Creature.totalHp}`);
  console.log(`${player2.username}'s Creature HP: ${player2Creature.totalHp}`);


  // 5. Matchmaking
  console.log('\\n--- 5. Matchmaking ---');
  let match = await matchmakingService.findMatch(player1);
  if (!match) { // If player1 is queued, player2 joining should find them
    match = await matchmakingService.findMatch(player2);
  } else { // if player1 found someone else (not possible in this 2 player sim), player 2 queues
      const _ = await matchmakingService.findMatch(player2);
  }


  // 6. Battle
  console.log('\\n--- 6. Battle ---');
  if (match && match.players.length === 2) {
    console.log(`Match found: ${match.players[0].username} vs ${match.players[1].username}`);
    battleService.startBattle(match);

    // Simulate some inputs for player 1 during battle
    inputService.simulateKeyPress('keyboard_mouse_main', 'w'); // mapped to 'move_forward'
    inputService.simulateKeyPress('keyboard_mouse_main', 'mouse_left'); // mapped to 'primary_attack'


    // Simulate battle progression (a very simple loop)
    let battleTicks = 0;
    const maxTicks = 100; // Max ticks before auto-ending (if no win condition met by service)
    while(match.status === 'active' && battleTicks < maxTicks) {
        battleService.updateBattleState(match.id, 16); // Simulate 16ms delta time
        battleTicks++;
        // In a real game, this loop would be driven by requestAnimationFrame or a server tick
        await new Promise(resolve => setTimeout(resolve, 50)); // Small delay to simulate time passing
    }

    if (match.status !== 'finished') { // If loop finished due to maxTicks
        console.log("Battle ended due to timeout (max ticks reached).");
        // Force end, maybe declare a draw or based on HP
        const p1Hp = player1Creature.totalHp; // In real game, get current HP from battle state
        const p2Hp = player2Creature.totalHp;
        const winner = p1Hp > p2Hp ? player1 : (p2Hp > p1Hp ? player2 : null);
        battleService.endBattle(match.id, winner);
    }

    console.log(`Battle finished. Winner: ${match.winner ? match.winner.username : 'Draw'}`);

  } else {
    console.log('No match could be formed in this simulation run.');
  }

  console.log('\\n--- Game Simulation End ---');
}

main().catch(error => {
  console.error("An error occurred during the simulation:", error);
});
