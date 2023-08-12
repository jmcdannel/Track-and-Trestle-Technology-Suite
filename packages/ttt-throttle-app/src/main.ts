import './assets/main.css'

import { createApp, provide, h } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import store from "./store/store";
import actionStore from "./store/actions";

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(store)
app.use(actionStore)

app.mount('#app')
