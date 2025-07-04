# Battle Game Project (Placeholder Name)

This project is a TypeScript-based online 2D battle game, now featuring Firebase integration for authentication and data storage, and a React frontend.

## Project Structure

-   `public/`: Static assets for the frontend, including `index.html`.
-   `src/`: Contains all the TypeScript source code.
    -   `core/`: Core backend functionalities.
        -   `types.ts`: Core data structures (Player, GameObject, Resource, etc.).
        -   `firebase.config.ts`: Firebase SDK initialization and configuration.
        -   `auth.service.ts`: Firebase Authentication service (registration, login, logout, etc.).
        -   `user.service.ts`: Firestore service for managing user profiles.
        -   `input.service.ts`: (Backend) Placeholder for handling player input logic.
    -   `frontend/`: React (TSX) frontend application.
        -   `index.tsx`: Entry point for the React app.
        -   `App.tsx`: Main application component with routing/view management.
        -   `components/`: Reusable UI components.
            -   `auth/`: Authentication-related components (LoginForm, RegisterForm, etc.).
            -   `common/`: Common UI elements (Button, FormField, etc.).
        -   `context/`: React Context providers (e.g., `AuthContext.tsx`).
        -   `assets/`: Static assets for the frontend (CSS, images).
    -   `game/`: Backend game-specific logic and types.
        -   `types.ts`: Game-related data structures (Match, Creature, etc.).
        -   `battle.service.ts`: Placeholder for real-time battle logic.
        -   `crafting.service.ts`: Placeholder for crafting mechanics.
        -   `gathering.service.ts`: Placeholder for resource gathering.
    -   `network/`: Backend network-related services.
        -   `matchmaking.service.ts`: Placeholder for finding opponents.
    -   `index.ts`: (Backend) Main entry point for the backend simulation/server logic (if applicable).
-   `dist/`: Root directory for build outputs.
    -   Contains the compiled JavaScript output for the backend (after running `npm run build:backend`). For example, `dist/index.js`.
    -   `frontend/`: Contains the built frontend assets from Vite (after running `npm run build:frontend`). For example, `dist/frontend/index.html`.
-   `.env.example`: Example environment variables file for Firebase configuration.
-   `.gitignore`: Specifies intentionally untracked files.
-   `package.json`: Manages project dependencies and scripts.
-   `tsconfig.json`: Base TypeScript configuration.
-   `tsconfig.frontend.json`: TypeScript configuration for the React frontend.
-   `tsconfig.backend.json`: TypeScript configuration for the Node.js backend.
-   `vite.config.ts`: Configuration file for Vite (frontend build tool).

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Firebase Setup:**
    *   Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
    *   Enable **Authentication** (Email/Password provider).
    *   Enable **Firestore** (start in test mode for easy setup, then configure security rules).
    *   Enable **Realtime Database** (if you plan to use it for features like live battle state).
    *   In your Firebase project settings, find your web app's configuration details.
    *   Copy the `.env.example` file to a new file named `.env`:
        ```bash
        cp .env.example .env
        ```
    *   Open the `.env` file and replace the placeholder values (e.g., `YOUR_API_KEY`) with your actual Firebase project configuration values. Ensure all `VITE_FIREBASE_...` variables are correctly set.

3.  **Running the Development Server (Frontend with Vite):**
    *   This command starts the Vite development server for the React frontend (usually on `http://localhost:3000`).
    *   It includes Hot Module Replacement (HMR) for a fast development experience.
    ```bash
    npm run dev
    ```
    You can now open your browser and navigate to the provided local URL to see the frontend application and interact with the authentication UI.

4.  **Building the Project:**
    *   **To build the frontend application (for deployment):**
        ```bash
        npm run build:frontend
        ```
        This will create an optimized static build of the React app in the `dist` folder (by default, Vite outputs here).
    *   **To build the backend application (if applicable):**
        ```bash
        npm run build:backend
        ```
        This compiles the backend TypeScript code from `src` (excluding `src/frontend`) into JavaScript in the `dist/` directory (as configured in `tsconfig.backend.json`).

5.  **Running the Backend Simulation (Original Entry Point):**
    *   If you wish to run the original backend simulation from `src/index.ts`:
        1.  Ensure the backend is built: `npm run build:backend`
        2.  Run the compiled output: `node dist/index.js` (Note: `src/index.ts` would need updates to work with ES Modules if it hasn't been already).

## Key Features Implemented/In Progress

*   **Firebase Authentication:** User registration, login, logout, forgot password.
*   **Firestore User Profiles:** User data (username, email, ELO) stored in Firestore and synced with Firebase Auth.
*   **React Frontend:** Basic UI for authentication flows.
*   **Vite Build System:** Modern, fast frontend development and build tooling.
*   **TypeScript:** Type safety for both frontend and backend.

## Development Goals (Ongoing)

The aim is to build a game with features like:
1.  Player registration (Implemented with Firebase Auth & UI).
2.  ELO-based matchmaking.
3.  Real-time battle mode.
4.  A pre-battle gathering phase.
5.  Crafting system.
6.  Input configuration system.
7.  Pixel-art/Stardew Valley-inspired UI styling.

This codebase is evolving. The next phases will focus on expanding data structures and integrating core game logic with Firebase.

