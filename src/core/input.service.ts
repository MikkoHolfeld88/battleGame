import { InputConfiguration, InputAction } from '../game/types';

// This would typically be a more complex event emitter or subject/observer pattern
type ActionListener = (action: InputAction) => void;

export class InputService {
  private configurations: Map<string, InputConfiguration> = new Map(); // deviceId -> config
  private listeners: Map<string, ActionListener[]> = new Map(); // actionName -> listeners

  constructor() {
    console.log('InputService initialized');
    // In a real game, this would set up global event listeners for keyboard, mouse, gamepad, touch.
    // For this placeholder, we'll just log.
    this.setupGlobalListeners();
  }

  private setupGlobalListeners(): void {
    // Placeholder: Simulating how global listeners might be set up.
    // In a browser environment, you'd use document.addEventListener, window.addEventListener, etc.
    // In Node.js for a server, this might be less relevant unless you're processing client inputs directly.
    console.log('Setting up global input listeners (simulated).');

    // Example: Simulate a key press event after a delay
    // setTimeout(() => {
    //   this.handleRawInput('keyboard', 'w_press');
    // }, 5000);
  }

  // Load a configuration for a specific device
  loadConfiguration(config: InputConfiguration): void {
    console.log(`Loading input configuration for device: ${config.deviceId}`, config.mappings);
    this.configurations.set(config.deviceId, config);
  }

  // Register a listener for a specific game action (e.g., 'jump', 'attack')
  onAction(actionName: string, callback: ActionListener): void {
    const existingListeners = this.listeners.get(actionName) || [];
    this.listeners.set(actionName, [...existingListeners, callback]);
    console.log(`Listener registered for action: ${actionName}`);
  }

  removeListener(actionName: string, callback: ActionListener): void {
    let existingListeners = this.listeners.get(actionName);
    if (existingListeners) {
      existingListeners = existingListeners.filter(cb => cb !== callback);
      if (existingListeners.length > 0) {
        this.listeners.set(actionName, existingListeners);
      } else {
        this.listeners.delete(actionName);
      }
      console.log(`Listener removed for action: ${actionName}`);
    }
  }

  // This method would be called by the raw input handlers (e.g., onkeydown, onmousedown)
  // It translates a raw input (like a key press) into a game action based on current configurations.
  private handleRawInput(deviceId: string, inputId: string, value?: any): void {
    const config = this.configurations.get(deviceId);
    if (!config) {
      // console.warn(`No input configuration loaded for device: ${deviceId}`);
      return;
    }

    const mapping = config.mappings.find(m => m.inputId === inputId);
    if (mapping) {
      console.log(`Raw input: ${inputId} on ${deviceId} -> Action: ${mapping.actionName}`);
      const action: InputAction = { ...mapping, inputId };
      if (value !== undefined) {
        (action as any).value = value; // For analog inputs, etc.
      }
      const actionListeners = this.listeners.get(mapping.actionName);
      if (actionListeners) {
        actionListeners.forEach(listener => listener(action));
      }
    }
  }

  // --- Public methods to simulate receiving input events ---
  // These would normally not be public; they'd be triggered by system events.

  public simulateKeyPress(deviceId: string, keyId: string): void {
    this.handleRawInput(deviceId, `${keyId}_press`);
  }

  public simulateKeyRelease(deviceId: string, keyId: string): void {
    this.handleRawInput(deviceId, `${keyId}_release`);
  }

  public simulateMouseMove(deviceId: string, x: number, y: number): void {
    this.handleRawInput(deviceId, 'mouse_move', { x, y });
  }

  public simulateMouseButton(deviceId: string, buttonId: string, state: 'press' | 'release'): void {
    this.handleRawInput(deviceId, `mouse_${buttonId}_${state}`);
  }
}
