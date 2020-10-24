import VueRouter from "vue-router"
import Vue from "vue"
import Home from "./components/Home"
import Rooms from "./components/Rooms"
import Room from "./components/Room"

const routes = [
    { 
        path: '/', 
        component: Home,
        name: "home"
    },
    {
        path: "/rooms",
        component: Rooms,
        name: "rooms"
    },
    {
        path: "/room/:room",
        component: Room,
        name: "room"
    }
  ]
  
const router = new VueRouter({
    mode: 'history',
    routes
})

Vue.use(VueRouter)

export default router