<script setup>
import BaseNavBar from "@/BaseNavBar.vue";
import {useCartStore} from "@/stores/cart.js";
import {RouterLink} from "vue-router";
import BaseButton from "@/BaseButton.vue";

//Zugriff auf den Pinia Store
const cartStore = useCartStore();

</script>

<template>
  <BaseNavBar>

    <template #left>
      <RouterLink to="/" class="logo">Anginni's Products</RouterLink>
    </template>

    <template #center>
      <div class="nav-center">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/products" class="nav-link">Products</RouterLink>
      </div>
    </template>

    <template #right>
      <div class="nav-right">
        <RouterLink to="/cart" class="cart-link">
          <BaseButton> 🛒 Cart
            <span v-if="cartStore.totalCount > 0" class="cart-badge">
                {{ cartStore.totalCount }}
          </span>
          </BaseButton>
        </RouterLink>
      </div>
    </template>

  </BaseNavBar>
  <main class="container mx-auto p-6">
    <RouterView/>
  </main>

  </template>

<style scoped>
.container {
  max-width: 4200px;
  background-color: lightblue;
}

.logo {
  font-size: 22px;
  font-weight: bold;
  text-decoration: none;
  color: #131313;
  flex-shrink: 0;
  margin-left: 20px;
}

.nav-center {
  display: flex;
  justify-content: center;
  gap: 20px;
  text-align: center;
}

.nav-link {
  text-decoration: none;
  color: #131313;
  font-size: 18px;
  font-weight: 500;
}

.nav-link:hover {
  color: #4e73df;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto; /* schiebt das Element nach rechts */
  margin-right: 20px;
}

.cart-link {
  text-decoration: none;
  color: #0b0a0a;
  font-weight: 600;
}
.cart-link:hover {
  color: #4e73df;
}
</style>
