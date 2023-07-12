import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import api from './connections/api.js'
import dccApi from './connections/dccApi.js'

api.connect()
dccApi.connect()

const app = createApp(App)

app.use(router)

app
  .mount('#app')
