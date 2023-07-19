import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import api from './connections/api.js'

api.connect()

const app = createApp(App)

app.use(router)

app
  .mount('#app')
