<script setup>
import { ref, computed } from 'vue'
import Home from './components/Home.vue'
import Login from './components/auth/Login.vue'

const routes = {
  '/': Home,
  '/login': Login,
  '/home': Home
}

const currentPath = ref(window.location.hash)

// if (currentPath !== '#/login' && sessionStorage.getItem('token') === null) {
//   window.location.href = '/#/login'
// }

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})
</script>

<template>
  <div class="container">
    <component :is="currentView" />
  </div>
</template>