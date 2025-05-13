<template>
  <div class="secured">
    <h1>Secured Page</h1>
    <p>This page demonstrates making authenticated API calls using Axios with Keycloak tokens</p>
    
    <div class="api-test">
      <h2>API Test</h2>
      <div class="controls">
        <input 
          v-model="apiUrl" 
          placeholder="Enter API URL" 
          class="api-input"
        />
        <button @click="makeApiCall" :disabled="loading">
          {{ loading ? 'Loading...' : 'Make API Call' }}
        </button>
      </div>
      
      <div v-if="error" class="error">
        <h3>Error</h3>
        <pre>{{ error }}</pre>
      </div>
      
      <div v-if="response" class="response">
        <h3>Response</h3>
        <pre>{{ JSON.stringify(response, null, 2) }}</pre>
      </div>
    </div>
    
    <div class="token-info">
      <h2>Token Information</h2>
      <div v-if="accessToken" class="token-display">
        <h3>Access Token</h3>
        <div class="token-value">
          <pre>{{ accessToken }}</pre>
        </div>
        <p><strong>Expires:</strong> {{ tokenExpiry }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { keycloak } from '@codegourmet/vue-keycloak-refresh'
import axios from 'axios'

export default defineComponent({
  name: 'SecuredView',
  setup() {
    const apiUrl = ref('https://jsonplaceholder.typicode.com/todos/1')
    const response = ref(null)
    const error = ref('')
    const loading = ref(false)
    
    const accessToken = computed(() => keycloak.token)
    
    const tokenExpiry = computed(() => {
      if (!keycloak.tokenParsed) return 'Unknown'
      const exp = keycloak.tokenParsed.exp * 1000 // Convert to milliseconds
      return new Date(exp).toLocaleString()
    })
    
    const makeApiCall = async () => {
      if (!apiUrl.value) {
        error.value = 'Please enter an API URL'
        return
      }
      
      loading.value = true
      error.value = ''
      response.value = null
      
      try {
        // The axios instance is already configured by the plugin to include the token
        const result = await axios.get(apiUrl.value)
        response.value = result.data
      } catch (err: any) {
        error.value = err.message || 'An error occurred'
        if (err.response) {
          error.value += `\nStatus: ${err.response.status}\nData: ${JSON.stringify(err.response.data)}`
        }
      } finally {
        loading.value = false
      }
    }
    
    return {
      apiUrl,
      response,
      error,
      loading,
      accessToken,
      tokenExpiry,
      makeApiCall
    }
  }
})
</script>

<style scoped>
.secured {
  padding: 20px;
}

.api-test, .token-info {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 5px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.controls {
  display: flex;
  margin-bottom: 20px;
}

.api-input {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background-color: #3aa876;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  margin-top: 20px;
  padding: 15px;
  background-color: #ffebee;
  border-radius: 4px;
  color: #b71c1c;
}

.response {
  margin-top: 20px;
  padding: 15px;
  background-color: #e8f5e9;
  border-radius: 4px;
  color: #2e7d32;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  max-height: 300px;
  overflow: auto;
}

.token-display {
  margin-top: 15px;
}

.token-value {
  max-height: 150px;
  overflow: auto;
}
</style>