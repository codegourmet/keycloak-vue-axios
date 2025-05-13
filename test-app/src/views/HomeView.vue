<template>
  <div class="home">
    <h1>Vue Keycloak Axios Test App</h1>
    <p>Welcome to the test application demonstrating Keycloak integration with Vue and Axios</p>
    
    <div class="user-info" v-if="keycloakReady">
      <h2>User Information</h2>
      <p><strong>Username:</strong> {{ keycloak.tokenParsed?.preferred_username }}</p>
      <p><strong>Email:</strong> {{ keycloak.tokenParsed?.email }}</p>
      <p><strong>Roles:</strong> {{ keycloakRoles.join(', ') }}</p>
      
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { keycloak, isKeycloakInitialized } from '@codegourmet/vue-keycloak-refresh'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const keycloakReady = ref(false)
    
    const keycloakRoles = computed(() => {
      if (!keycloak.tokenParsed) return []
      return keycloak.tokenParsed.realm_access?.roles || []
    })
    
    onMounted(() => {
      keycloakReady.value = isKeycloakInitialized()
    })
    
    const logout = () => {
      keycloak.logout()
    }
    
    return {
      keycloak,
      keycloakReady,
      keycloakRoles,
      logout
    }
  }
})
</script>

<style scoped>
.home {
  padding: 20px;
}

.user-info {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 5px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3aa876;
}
</style>