import Vue from 'vue'
import App from './App.vue'
import router from './router'

// Gestion des composants:
import NavTop from './components/layout/NavTop.vue'
import Screen1 from './screens/screen1.vue'

const components = {
  NavTop,
  Screen1
}
Object.keys(components).map(name => Vue.component(name, components[name]))


Vue.config.productionTip = false
window.vm = window.$root = new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
