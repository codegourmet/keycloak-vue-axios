import { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js'
import { AxiosInstance } from 'axios'

export interface AxiosSetupOptions {
  /**
   * Header name for the auth token (default: 'Authorization')
   */
  tokenHeader?: string

  /**
   * Prefix used before the token value (default: 'Bearer ')
   */
  tokenPrefix?: string

  /**
   * Whether to log out when token refresh fails (default: true)
   */
  logoutOnRefreshError?: boolean

  /**
   * Minimum validity for token in seconds (default: 0)
   */
  minTokenValidity?: number

  /**
   * Custom axios instance to use (default: axios default instance)
   */
  axiosInstance?: AxiosInstance
}

export interface KeycloakPluginOptions extends AxiosSetupOptions {
  /**
   * Keycloak configuration (can be a URL or configuration object)
   */
  keycloakConfig?: KeycloakConfig

  /**
   * Options used when initializing Keycloak
   */
  initOptions?: KeycloakInitOptions

  /**
   * Callback function called when authentication is successful
   */
  onAuthSuccess?: () => void

  /**
   * Legacy support for passing Keycloak connection directly in the root
   * Supports: url, realm, clientId
   */
  [key: string]: any
}
