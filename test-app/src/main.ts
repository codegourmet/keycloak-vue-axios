import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import KeycloakPlugin from '@codegourmet/vue-keycloak-refresh'

// Create the Vue app
const app = createApp(App)

// Use the router
app.use(router)

// Configure Keycloak
app.use(KeycloakPlugin, {
  keycloakConfig: {
    url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8180/auth',
    realm: import.meta.env.VITE_KEYCLOAK_REALM || 'test-realm',
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'vue-test-client'
  },
  initOptions: {
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    checkLoginIframe: true,
    checkLoginIframeInterval: 30 // Check for SSO session changes every 30 seconds
  },
  // Optional callback when authentication is successful
  onAuthSuccess: () => {
    console.log('Successfully authenticated with Keycloak')
  }
})

// Mount the app
app.mount('#app')