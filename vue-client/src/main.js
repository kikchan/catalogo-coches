import Vue from 'vue'
import App from './App.vue'
import persistentState from 'vue-persistent-state'

Vue.config.productionTip = false

let initialState = {
  loginStatus: 'KO',
  carIDtoEdit: -1,
  username: null,
  token: null
}

Vue.use(persistentState, initialState)

new Vue({
  render: h => h(App)
}).$mount('#app')
