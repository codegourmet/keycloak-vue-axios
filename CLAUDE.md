# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue plugin that integrates Keycloak authentication with Axios for making authenticated API requests. It automatically handles authentication token management and refreshes expired tokens when needed. The package is written in TypeScript and supports both Vue 2 and Vue 3.

## Core Components

1. **Keycloak Integration** (`src/keycloak.ts`): Creates and initializes the Keycloak instance, handling authentication and token refreshing.

2. **Axios Setup** (`src/axios.ts`): Configures Axios interceptors to automatically:
   - Add authentication tokens to outgoing requests
   - Handle 401 errors by refreshing tokens and retrying requests
   - Redirect to login if token refresh fails

3. **Plugin Export** (`src/index.ts`): Exports a Vue plugin that initializes Keycloak and sets up Axios with token management.

4. **Type Definitions** (`src/types.ts`): Provides TypeScript interfaces for configuration options.

## Development Commands

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Format code with prettier
npm run format

# Check code formatting
npm run lint

# Link locally for testing
npm link
# Then in your test project
npm link @codegourmet/vue-keycloak-refresh
```

## Code Structure Notes

- The package has a TypeScript-based architecture with four main files:
  - `index.ts`: Entry point that exports the Vue plugin
  - `keycloak.ts`: Handles Keycloak setup and authentication
  - `axios.ts`: Configures Axios with token management
  - `types.ts`: Defines TypeScript interfaces for configuration

## Common Patterns

- **Singleton Pattern**: The Keycloak instance is created once and accessed via getter functions
- **Promise Caching**: Token refresh operations are cached to prevent multiple simultaneous refresh attempts 
- **Error Handling**: Appropriate error checks ensure Keycloak is initialized before use
- **TypeScript Integration**: Strong typing throughout the codebase

## Configuration Options

The plugin supports the following configuration options:

```typescript
interface KeycloakPluginOptions {
  // Keycloak configuration
  keycloakConfig?: KeycloakConfig;
  initOptions?: KeycloakInitOptions;
  onAuthSuccess?: () => void;
  
  // Axios configuration
  tokenHeader?: string;        // Default: 'Authorization'
  tokenPrefix?: string;        // Default: 'Bearer '
  logoutOnRefreshError?: boolean; // Default: true
  minTokenValidity?: number;   // Default: 0
  axiosInstance?: AxiosInstance; // Default: axios default instance
}
```

## Usage in Applications

Install the package and integrate it with Vue as shown in the README:

```js
import Vue from 'vue'
import KeycloakPlugin from '@codegourmet/vue-keycloak-refresh'

Vue.use(KeycloakPlugin, {
  url: 'https://auth.example.com/auth',
  realm: 'myrealm',
  clientId: 'my-client-id'
})
```

For advanced configuration with custom axios instances and initialization options, refer to the README.md.
