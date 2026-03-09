<script setup>
import BaseButton from '@/BaseButton.vue';
import {useCartStore} from "@/stores/cart.js";

const cart = useCartStore();

// Definiert die erwarteten Props
const props = defineProps({
  product: {
    type: Object,
    required: true,
  }
  });

// Die Funktion zum Hinzufügen zum Warenkorb
const addToCart = () => {
  cart.addItem(props.product);
};

</script>

<template>
  <div class="product-card">
  <p class="product-grid"></p>

      <h3 class="product-name">{{ props.product.product_name }}</h3>
      <p class="product-category">{{ props.product.category }}</p>
      <p class="product-price">{{ props.product.list_price }}</p>

      <BaseButton class="add-to-cart-button" @click="addToCart">Add to Cart</BaseButton>

  </div>
</template>

<style scoped>

.product-grid {
  display: grid;
  gap: 40px;

  /* Responsive Grid-Spalten: */
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.product-card {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: white;
  transition: box-shadow 0.3s ease-in-out;
  cursor: pointer;
}

.product-card:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.product-name {
  font-size: 1.125rem;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.product-category {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 8px;
}

.product-price {
  font-size: 1.25rem;
  font-weight: 800;
  color: #16a34a;
  margin-bottom: 12px;
}

.add-to-cart-button {
  width: 100%;
  margin-top: 12px;
}
</style>