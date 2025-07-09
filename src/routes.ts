// Defines the application's route paths
// Using constants for route paths helps prevent typos and makes them easy to manage.

export const LANDING_PATH = '/'; // For the existing LandingPage, or a general pre-login page
export const LOGIN_PATH = '/login'; // Path for the login page
export const GAME_START_PATH = '/game-start'; // Primary path for the page after login, where game can be started
export const HOME_PATH = GAME_START_PATH; // Alias HOME_PATH to GAME_START_PATH for clarity or future use if a general dashboard is added
export const GAME_CONTAINER_PATH = '/play'; // Path for the GameContainerPage
