import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import VueQrcode from 'vue-qrcode'

import { createRouter, createWebHistory } from 'vue-router'

import AppView from './App.vue'
import StartView from './components/Start.vue'
import CheckView from './components/Check.vue'



const routes = [
  { path: '/', component: AppView },
  { path: '/start', component: StartView },
  { path: '/check', component: CheckView  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

createApp(App)
.use(router)
.component('vue-qrcode', VueQrcode)
.mount('#app')
