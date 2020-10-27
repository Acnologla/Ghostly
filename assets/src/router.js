import VueRouter from 'vue-router'
import Vue from 'vue'
import Rooms from './components/Rooms'
import Room from './components/Room'

const routes = [
  {
    path: '/',
    component: Rooms,
    name: 'rooms'
  },
  {
    path: '/room/:room',
    name: 'room',
    component: Room
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

Vue.use(VueRouter)

export default router
