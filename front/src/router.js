import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Page from './views/Page.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    //100m:
    // { path: '/', component: Vue.component_async('PageGeneric', PageGeneric), meta: { access: ['user'] } },

    // Tuto:
    //{ path: "/photos", name: "photos", component: () => import("@/pages/Photos.vue") },
    { path: '/', name: 'home', component: Home },
    { path: '/lga/:screen', name: 'lga', component: Page },
    { path: '/test/:screen', name: 'test', component: () => import("./pages/PageGeneric.vue") },
    { path: '/about', name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: function () {
        return import( './views/About.vue')
      }
    }
  ]
})
