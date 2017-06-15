// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import router from './router'
import VueRouter from 'vue-router'
import Func from './func'
import store from './store'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)
Vue.use(VueRouter)
Vue.use(Func)
Vue.use(VueResource)

// export default {
//   name: 'app',
//   router: router,
//   store: store
// }

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<router-view/>',
  router: router,
  store: store  // 注入到vue
})
