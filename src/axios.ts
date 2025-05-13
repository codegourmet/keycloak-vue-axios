import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import { getKeycloak } from './keycloak'
import { AxiosSetupOptions } from './types'

let refreshPromise: Promise<void> | null = null

export function setupAxios(options: AxiosSetupOptions = {}): void {
  const {
    tokenHeader = 'Authorization',
    tokenPrefix = 'Bearer ',
    logoutOnRefreshError = true,
    minTokenValidity = 0,
    axiosInstance = axios
  } = options

  // request interceptor
  axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
    const keycloak = getKeycloak()
    if (keycloak.token) {
      config.headers = config.headers || {}
      config.headers[tokenHeader] = `${tokenPrefix}${keycloak.token}`
    }
    return config
  })

  // response interceptor
  axiosInstance.interceptors.response.use(
    res => res,
    async (error: AxiosError) => {
      const original = error.config as AxiosRequestConfig & { _retry?: boolean }
      if (error.response?.status === 401 && !original._retry) {
        original._retry = true
        if (!refreshPromise) {
          refreshPromise = getKeycloak()
            .updateToken(minTokenValidity)
            .then(() => {
              refreshPromise = null
            })
            .catch((err: Error) => {
              refreshPromise = null
              throw err
            })
        }

        try {
          await refreshPromise
          if (original.headers) {
            original.headers[tokenHeader] = `${tokenPrefix}${getKeycloak().token}`
          }
          return axiosInstance(original)
        } catch (err) {
          if (logoutOnRefreshError) {
            getKeycloak().logout()
          }
          return Promise.reject(err)
        }
      }
      return Promise.reject(error)
    }
  )
}
