# GameContainerPage Component

The `GameContainerPage` is a React component designed to provide an immersive environment for hosting web-based games. It manages fullscreen display, a pause state triggered by the ESC key, and a modal for user interaction when the game is paused.

## Features

1.  **Fullscreen Mode:**
    *   Upon loading, the page attempts to switch the browser to fullscreen mode, focusing on the game area (specifically, the main `Box` component of the page).
    *   It uses the browser's Fullscreen API (`requestFullscreen`, `exitFullscreen` and vendor-prefixed versions).
    *   Fullscreen mode aims to hide browser chrome (address bar, tabs, etc.) and operating system elements like the taskbar, providing an uninterrupted game view.
    *   The component includes a cleanup effect to exit fullscreen mode if the component is unmounted (e.g., when navigating away from the page).

2.  **ESC Key Listener for Pause:**
    *   An event listener is attached to the `window` to detect `keydown` events.
    *   If the 'Escape' (`ESC`) key is pressed while the game is active (assumed to be when the page is in fullscreen and not already paused), the game's pause state (`isPaused`) is toggled to `true`.
    *   When `isPaused` becomes `true`:
        *   A placeholder comment `// TODO: Add game loop pause logic here` indicates where the actual game engine's pause function should be called.
        *   A pause modal is displayed.
    *   The ESC key typically also serves as the default browser key to exit fullscreen. The component's logic primarily focuses on game pause state; browser handling of ESC for exiting fullscreen will still occur. If the game is paused and then ESC is pressed again, the current modal implementation prevents closing via ESC by default, relying on button clicks.

3.  **Pause Modal:**
    *   When the game is paused (`isPaused === true`), a Material-UI `Modal` is shown.
    *   The modal overlays the game area and informs the user that the game is paused.
    *   It provides two main actions:
        *   **"Resume" Button:** Sets `isPaused` to `false`, hides the modal, and calls a placeholder for resuming the game loop (`// TODO: Add game loop resume logic here`). It also re-requests fullscreen in case it was exited.
        *   **"Quit to Menu" Button:** Sets `isPaused` to `false`, calls a placeholder for any game cleanup logic, exits fullscreen mode programmatically, and navigates the user back to the `GAME_START_PATH` (e.g., `/home` or `/start-game`).
    *   The cursor, normally hidden during active gameplay (`cursor: 'none'`), is made visible when the modal is active.

## Game Loop and State Interaction (Conceptual)

This component is designed as a container and does not implement a game loop itself. It provides hooks and placeholders for interacting with an external game engine or game logic:

*   **Pausing the Game:** When `isPaused` is set to `true` (e.g., by pressing ESC), the comment `// TODO: Add game loop pause logic here` in `useEffect` (for ESC key) and within the `GameContainerPage` component (before showing modal, if applicable) marks the spot where you should call your game's specific pause function. This might involve:
    *   Stopping animation loops (`cancelAnimationFrame`).
    *   Disabling input processing for game actions.
    *   Saving any transient state if necessary.

*   **Resuming the Game:** When the "Resume" button is clicked, `isPaused` is set to `false`. The comment `// TODO: Add game loop resume logic here` in `handleResumeGame` indicates where to call your game's resume function. This might involve:
    *   Restarting animation loops (`requestAnimationFrame`).
    *   Re-enabling input processing.

*   **Game States:** The `isPaused` state variable within `GameContainerPage` directly reflects one critical game state. Your actual game logic might have more detailed states (e.g., `LOADING`, `PLAYING`, `PAUSED`, `GAME_OVER`, `MENU`). The `GameContainerPage` primarily manages the `PAUSED` state from the container's perspective, allowing the game itself to handle its internal state transitions.

## Usage

To use `GameContainerPage`, ensure it's part of your `react-router-dom` routing setup. Navigation to its assigned route (e.g., `/play`) will activate the component. The actual game content needs to be rendered within this component, replacing the placeholder "Game Area" text. This could be a `<canvas>` element managed by a game engine, or other React components that constitute the game.

## Styling and Customization

*   The page uses Material-UI components for the modal and buttons, allowing for theming consistent with the rest of the application.
*   The main game area is a `Box` component styled to take up the full viewport (`100vw`, `100vh`) with a black background by default. This can be customized as needed.
*   The cursor is hidden when `isPaused` is `false` to enhance immersion, and shown when `isPaused` is `true` (modal is visible).

## Important Considerations

*   **Fullscreen API Limitations:** Browser support and behavior for the Fullscreen API can vary. Some browsers might require user interaction (like a click) to initiate fullscreen. The current implementation calls `requestFullscreen` on mount, which might be blocked by some browsers if not triggered by a direct user action. It's generally more reliable to trigger fullscreen on a button press (e.g., the "Start Game" button that navigates to this page could also be responsible for initiating the fullscreen request for the game container element *after* navigation).
*   **ESC Key Behavior:** The ESC key has a default browser behavior of exiting fullscreen. If the game is in fullscreen and ESC is pressed, the browser will likely exit fullscreen *and* our component will trigger the pause modal. This is generally acceptable.
*   **Game Logic Integration:** The `TODO` comments are crucial. You must integrate your actual game's pause, resume, and cleanup logic at these points for the container to function correctly with your game.
*   **Layout:** This component assumes it takes over the entire viewport. If your application has a global header/footer, you might need a specific layout for this route that omits them, or use CSS to hide them when this page is active.
