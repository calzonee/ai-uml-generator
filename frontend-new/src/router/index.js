import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChatUMLView from '../views/ChatUMLView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/chatuml', name: 'ChatUMLDemo', component: ChatUMLView },
  { path: '/login', name: 'Login', component: LoginView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
