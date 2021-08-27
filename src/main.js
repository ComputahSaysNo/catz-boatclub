import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import firebase from "firebase/app";
import "firebase/auth";
import Vue2Editor from "vue2-editor";
import VueParticles from "vue-particles";

Vue.use(Vue2Editor);
Vue.use(Buefy)
Vue.use(VueParticles)

Vue.config.productionTip = false

let app
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})


