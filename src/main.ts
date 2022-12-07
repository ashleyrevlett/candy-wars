import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { VueFire } from 'vuefire'
import { firebaseApp } from './firebaseConfig'

import './style.css'
import App from './App.vue'

const app = createApp(App);
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app
  .use(VueFire, {
    firebaseApp,
    modules: [],
  })
app.mount("#app")
