import Keycloak, { KeycloakConfig, KeycloakInitOptions } from 'keycloak-js'

let kc: Keycloak | null = null

export function createKeycloakInstance(options: KeycloakConfig): Keycloak {
  kc = new Keycloak(options)
  return kc
}

function setupTokenRefresh(): void {
  // every minute, if token expires in <60s, call updateToken()
  setInterval(() => {
    if (!kc) return

    kc.updateToken(60).catch(() => {
      console.warn('failed to refresh, logging out')
      kc?.logout()
    })
  }, 60_000)
}

export function initKeycloak(
  onAuthenticatedCallback: () => void,
  initOptions: KeycloakInitOptions = {}
): Promise<boolean> {
  if (!kc) throw new Error('Keycloak instance not created')

  // Default init options
  const defaultOptions: KeycloakInitOptions = {
    onLoad: 'login-required',
    pkceMethod: 'S256',
    checkLoginIframe: false,
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
  }

  // Merge default options with user-provided options
  const mergedOptions: KeycloakInitOptions = { ...defaultOptions, ...initOptions }

  return kc.init(mergedOptions).then(authenticated => {
    if (authenticated) {
      setupTokenRefresh()
      onAuthenticatedCallback()
    } else {
      console.warn('not authenticated!')
    }
    return authenticated
  })
}

export function getKeycloak(): Keycloak {
  if (!kc) throw new Error('Keycloak not initialized')
  return kc
}
