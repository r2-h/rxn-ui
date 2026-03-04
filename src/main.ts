import { createApp } from 'vue'

import App from './App.vue'
import { initTheme } from './composables/useTheme'
import './styles/style.css'

initTheme()

createApp(App).mount('#app')
