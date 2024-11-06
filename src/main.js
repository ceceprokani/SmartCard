import { createApp } from 'vue'
import App from './App.vue'
import Vue3Lottie from 'vue3-lottie'

import Toast, {useToast} from "vue-toastification";
import "vue-toastification/dist/index.css";

import './assets/css/main.css'
import 'bootstrap'

const app = createApp(App)

app.use(Vue3Lottie)

app.use(Toast, {
    transition: "Vue-Toastification__bounce",
    maxToasts: 1,
    newestOnTop: true,
    pauseOnHover: false,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnFocusLoss: false,
    timeout: 2000,
    position: "top-right",
});

app.config.globalProperties.$toast = useToast()

app.mount('#app')