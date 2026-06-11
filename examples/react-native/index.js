/**
 * Entry point of the application. Registers the main App component with Expo's root component registry.
 * This allows the app to run in both development (Expo Go) and production (standalone build) environments.
 */

import { registerRootComponent } from 'expo';
import App from './App';

/**
 * Calls `AppRegistry.registerComponent('main', () => App)`.
 * Ensures the correct environment is set up for the app whether it's running in Expo Go or a native build.
 */
registerRootComponent(App);
