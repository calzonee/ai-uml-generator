// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView   from '../views/HomeView.vue'
import ChatUMLView from '../views/ChatUMLView.vue'
import LoginView  from '../views/LoginView.vue'

const routes = [
  // 1️⃣  Root → ChatUML
  { path: '/', redirect: '/chatuml' },

  { path: '/chatuml', name: 'ChatUMLDemo', component: ChatUMLView },

  // (Optional) HomeView unter eigenem Pfad
  { path: '/home', name: 'Home', component: HomeView },

  { path: '/login', name: 'Login', component: LoginView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
