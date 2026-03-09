import {createRouter, createWebHistory} from 'vue-router';
import HomeView from "../views/HomeView.vue";
import CartView from "../views/CartView.vue";
import Checkout from "../views/Checkout.vue";
import ProductsCard from "@/ProductsCard.vue";


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: 'Home',
            component: HomeView
        },
        {
            path: "/products",
            name: "Products",
            component: ProductsCard
        },
        {
            path: "/cart",
            name: "Cart",
            component: CartView
        },
        {
            path: "/checkout",
            name: "Checkout",
            component: Checkout
        },
    ],
});


export default router