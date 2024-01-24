import { createRouter, createWebHistory } from "vue-router";
import Home from '../../pages/home/Home.vue'
import Trains from '../../pages/trains/Trains.vue'
const routes = [
{
    path:"/",
    component: Home
},
{
    path:'/trains',
    component: Trains
}
]
const router = createRouter({
    history: createWebHistory(),
    routes

})
export default router