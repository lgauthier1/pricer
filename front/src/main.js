import Vue from 'vue'
import App from './App.vue'
import router from './router'

import firebase from 'firebase/app'
import 'firebase/database'

export const db = window.db =  firebase
  .initializeApp({ databaseURL: 'https://pricer-c75a5.firebaseio.com/' })
  .database()
// Gestion des composants:
import NavTop from './components/layout/NavTop.vue'
import NavLeft from './components/layout/NavLeft.vue'
import Screen1 from './screens/screen1.vue'

//Gestion des Composants
const components = {
  NavTop,
  NavLeft,
  Screen1
}
Object.keys(components).map(name => Vue.component(name, components[name]))

//Gestion des mixins
import test from './mixins/test.js'
import database from './mixins/database.js'
const mixins = [test, database]

Vue.config.productionTip = false
window.vm = window.$root = new Vue({
  router,
  ...App,
  mixins: mixins,
  render: function (h) { return h(App) }
}).$mount('#app')
