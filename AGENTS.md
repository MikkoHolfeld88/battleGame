# Agent Instructions for Battle Game Project

## General Guidelines

1.  **Understand the Goal:** The primary goal is to build an online 2D battle game with features like player registration, matchmaking, resource gathering, crafting, and real-time battles. Refer to `README.md` for more details on the features.
2.  **Modularity:** Keep the code modular. Services should have clear responsibilities. Use the existing `src/core`, `src/game`, `src/network`, and `src/ui` (when applicable) directories.
3.  **TypeScript Best Practices:**
    *   Use strong typing. Avoid `any` where possible. Define clear interfaces in the `*.types.ts` files.
    *   Prefer classes for services and interfaces/types for data structures.
    *   Ensure `npm run build` (which runs `tsc`) completes without errors.
4.  **Readability:** Write clear, concise, and well-commented code. Explain complex logic.
5.  **Extensibility:** Design components with future expansion in mind. The current placeholders are very basic; they will need to be fleshed out with actual logic.
6.  **Focus on Core Logic First:** While UI (`src/ui`) is planned, the initial focus is on the backend and core game mechanics.

## Working with Services

*   **AuthService (`src/core/auth.service.ts`):**
    *   Currently a placeholder. Future work will involve integrating a real authentication system (e.g., Firebase Auth, OAuth, custom JWT).
*   **InputService (`src/core/input.service.ts`):**
    *   Manages mapping raw device inputs to game actions.
    *   Will need to be adapted for client-side environments (browsers) to capture actual events. For server-side, it might process validated input commands from clients.
*   **MatchmakingService (`src/network/matchmaking.service.ts`):**
    *   Needs to be expanded with ELO-based matching logic.
    *   Will likely interact with a database or a dedicated matchmaking server/queue.
*   **GatheringService (`src/game/gathering.service.ts`):**
    *   The gathering phase logic needs to be implemented (e.g., timed phase, map interaction).
    *   Resource types and spawn logic will need to be defined.
*   **CraftingService (`src/game/crafting.service.ts`):**
    *   Implement actual crafting recipes and resource consumption.
    *   Define stats and attributes for crafted items (BodyParts, Weapons, Abilities).
*   **BattleService (`src/game/battle.service.ts`):**
    *   This is a critical component. Future work includes:
        *   Implementing a game loop.
        *   Handling creature states, positions, and physics (basic 2D for now).
        *   Collision detection, damage calculation.
        *   Processing actions derived from `InputService`.
        *   Real-time state synchronization if this service runs on a server.

## Data Structures (`*.types.ts`)

*   Ensure all new complex data types are defined in the relevant `types.ts` files (`src/core/types.ts` or `src/game/types.ts`).
*   Keep interfaces focused and clearly named.

## Running and Testing

*   Always ensure the project builds using `npm run build`.
*   The `src/index.ts` file currently runs a simulation. This can be expanded to test new features in isolation or integrated flows.
*   Future: Implement a proper testing framework (e.g., Jest) with unit and integration tests.

## Commits and Branches

*   Use descriptive commit messages.
*   For new features or significant changes, use separate branches.

This `AGENTS.md` will evolve as the project grows. Always check for updates.
