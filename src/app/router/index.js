import { createRouter, createWebHistory } from "vue-router";
import Home from '../../pages/home/Home.vue'
import Factories from '../../pages/factories/Factories.vue'
const routes = [
{
    path:"/",
    component: Home
},
{
    path:'/factories',
    component: Factories
}
]
const router = createRouter({
    history: createWebHistory(),
    routes

})
export default router