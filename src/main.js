import Vue from 'vue'
import './plugins/vuetify'
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader
import App from './App.vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import Vuex from 'vuex'
import store from '@/store'
import VueRouter from 'vue-router'
import routes from './router/router'
import HighchartsVue from 'highcharts-vue'
import Highcharts from "highcharts";
import mapInit from 'highcharts/modules/map';
import stockInit from 'highcharts/modules/stock'



import darkUnica from "highcharts/themes/dark-unica";
import indicators from "highcharts/indicators/indicators"

import { VUEX_SET_USER_AUTHENTICATED } from './store/constants/authentication'

Vue.use(Vuex)
Vue.use(Vuetify)
Vue.use(VueRouter)
stockInit(Highcharts)
mapInit(Highcharts)
darkUnica(Highcharts)
indicators(Highcharts)
Vue.use(HighchartsVue)

Vue.use(Vuetify, { iconfont: 'fa' })

Vue.config.productionTip = false
import VueJWT from 'vuejs-jwt'
 
let jwtOptions = {keyName: 'token'}

Vue.use(VueJWT, jwtOptions)

export const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  try {
      if(to.meta.requiresAuth) {
        if (Vue.$jwt.hasToken() && Vue.$jwt.decode().exp > Date.now() / 1000) {
            store.dispatch(VUEX_SET_USER_AUTHENTICATED, true)
            next() 
        }
        else {
            store.dispatch(VUEX_SET_USER_AUTHENTICATED, false)
            next('/login')
        }
      }
      else {
          next()
      }
  } catch (err) {
    console.log(err)
    next('/login')
  }

})



new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
