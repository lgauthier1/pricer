import Vue from 'vue'
import App from './App.vue'
import router from './router'

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
const mixins = [test]

Vue.config.productionTip = false
window.vm = window.$root = new Vue({
  router,
  ...App,
  mixins: mixins,
  render: function (h) { return h(App) }
}).$mount('#app')
