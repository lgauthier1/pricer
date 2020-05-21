import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', name: 'home', component: () => import("./pages/PageGeneric.vue") },
    { path: '/:screen', name: 'page', component: () => import("./pages/PageGeneric.vue") }
    // { path: '/about', name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: function () {
    //     return import( './views/About.vue')
    //   }
    // }
  ]
})
