import VueRouter from "vue-router"
import Vue from "vue"
import Home from "./components/Home"
const routes = [
    { 
        path: '/', 
        component: Home,
        name: "home"
    },
  ]
  
const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})

Vue.use(VueRouter)

export default router