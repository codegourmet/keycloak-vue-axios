## Installation

```bash
npm install @codegourmet/vue-keycloak-refresh
````

## Usage

### Basic Usage

```js
import Vue from 'vue'
import KeycloakPlugin from '@codegourmet/vue-keycloak-refresh'

Vue.use(KeycloakPlugin, {
  url: 'https://auth.example.com/auth',
  realm: 'myrealm',
  clientId: 'my-vue-client'
})

new Vue({
  render: h => h(App)
}).$mount('#app')
```

### Advanced Configuration

The plugin now supports extensive configuration options:

```js
import Vue from 'vue'
import KeycloakPlugin from '@codegourmet/vue-keycloak-refresh'
import axios from 'axios'

// Create custom axios instance if needed
const myApiClient = axios.create({
  baseURL: 'https://api.example.com/v1'
})

Vue.use(KeycloakPlugin, {
  // Keycloak connection config
  keycloakConfig: {
    url: 'https://auth.example.com/auth',
    realm: 'myrealm',
    clientId: 'my-vue-client'
  },
  
  // Keycloak initialization options
  initOptions: {
    onLoad: 'check-sso', // Alternatives: 'login-required', 'check-sso'
    pkceMethod: 'S256',
    checkLoginIframe: true,
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
  },
  
  // Callback when authentication is successful
  onAuthSuccess: (keycloak) => {
    console.log('User authenticated:', keycloak.tokenParsed.preferred_username)
  },
  
  // Axios configuration options
  tokenHeader: 'Authorization', // Header name for the auth token
  tokenPrefix: 'Bearer ', // Prefix for the auth token value
  logoutOnRefreshError: true, // Whether to logout when token refresh fails
  minTokenValidity: 30, // Minimum token validity in seconds before refresh
  axiosInstance: myApiClient // Custom axios instance (optional)
})

new Vue({
  render: h => h(App)
}).$mount('#app')
```

## Accessing Keycloak in Components

The plugin adds a `$keycloak` property to the Vue instance that you can use in your components:

```js
export default {
  name: 'MyComponent',
  methods: {
    logout() {
      this.$keycloak.logout()
    },
    getUserInfo() {
      return this.$keycloak.tokenParsed
    }
  }
}
```
