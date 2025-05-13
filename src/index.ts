import { App } from 'vue'
import { createKeycloakInstance, initKeycloak } from './keycloak'
import { setupAxios } from './axios'
import { KeycloakPluginOptions } from './types'

export * from './types'

export default {
  install(app: App, options: KeycloakPluginOptions = {}) {
    // Extract keycloak connection settings
    const { keycloakConfig, initOptions, onAuthSuccess, ...otherOptions } = options

    // Create Keycloak instance with provided config
    const kc = createKeycloakInstance(keycloakConfig || options)

    // Initialize Keycloak with optional custom init options
    initKeycloak(onAuthSuccess || (() => {}), initOptions || {})

    // Setup Axios with any options
    setupAxios(otherOptions)

    // Expose keycloak instance
    app.config.globalProperties.$keycloak = kc
  }
}
