<script setup>
import {computed} from 'vue';
import {useRouter} from 'vue-router';
import {useCartStore} from '../stores/cart.js';
import BaseButton from '@/BaseButton.vue';

const cartStore = useCartStore();

const router = useRouter();
// Verwenden des Stores

const goToProducts = () => {
  router.push("/products");
};

const goToCheckout = () => {
  router.push({name: "Checkout"});
};

// Berechnet, ob der Warenkorb leer ist
const isCartEmpty = computed(() => cartStore.items.length === 0);

</script>

<template>

  <div class="cart-container">
    <h2>Your Shopping Cart</h2>

    <div v-if="isCartEmpty" class="cart-empty">
      <p>Your cart is empty. Add some products to start shopping!</p>
      <BaseButton type="primary" @click="goToProducts">
        Go to the Products List
      </BaseButton>
    </div>

    <div v-else>
      <div v-for="item in cartStore.items" :key="item.product_id" class="cart-item">

        <div class="item-details">
          <h3>{{ item.product_name }}</h3>
          <p>Unit Price: €{{ parseFloat(item.list_price).toFixed(2) }}</p>
        </div>

        <div class="item-quantity-controls">
          <BaseButton @click="cartStore.decreaseQuantity(item.product_id)">-</BaseButton>
          <span>{{ item.quantity }}</span>
          <BaseButton @click="cartStore.increaseQuantity(item.product_id)">+</BaseButton>
        </div>

        <div class="remove-button">
          <BaseButton @click="cartStore.removeItem(item.product_id)">Remove item</BaseButton>
        </div>

        <p class="item-subtotal">
          € {{ (parseFloat(item.list_price) * item.quantity).toFixed(2) }}
        </p>
      </div>
    </div>
  </div>

  <div v-if="!isCartEmpty" class="cart-total-footer">

    <p class="total-price">Total Price: € {{ cartStore.totalPrice.toFixed(2) }} </p>
  </div>

  <div v-if="!isCartEmpty" class="checkout-actions">
    <BaseButton type="secondary" @click="cartStore.clearCart()">
      Clear Cart
    </BaseButton>
    <BaseButton type="primary" class="btn-checkout" @click="goToCheckout">
      Proceed to Checkout
    </BaseButton>
  </div>

</template>

<style scoped>

.cart-container {
  padding: 1.5rem;
  background-color: #9093a3;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
  max-width: 48rem;
  margin: 2rem auto;
}

.cart-empty {
  text-align: center;
  padding: 3rem;
  color: #131313;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #7ae623;
  padding-top: 1rem;
  padding-bottom: 1rem;
  gap: 1rem;
  transition: background-color 150ms ease-in-out;
}

.cart-item:hover {
  background-color: #f9fafb;
}

.item-quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  width: 9rem;
  flex-shrink: 0;
}

.cart-total-footer {
  margin-top: 2rem;
  padding-top: 1rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.total-price {
  font-size: 1.875rem;
  font-weight: 800;
  color: #131313;
  margin-right: 15px;
}

.checkout-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-checkout {
  background-color: #10b981;
}

.btn-checkout:hover {
  background-color: #059669;
}
</style>