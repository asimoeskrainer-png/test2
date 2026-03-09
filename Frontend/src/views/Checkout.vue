<script setup>

import {ref} from 'vue';
import BaseButton from '@/BaseButton.vue';
import {useCartStore} from '@/stores/cart.js';
import {useRouter} from 'vue-router'; // Router für Weiterleitung hinzufügen

const cart = useCartStore();
const router = useRouter(); // Instanziieren
const isLoading = ref(false);

const form = ref({
  ship_name: '',
  ship_city: '',
  ship_zip_postal_code: '',
  ship_address: ''
});

const submitOrder = async () => {
  isLoading.value = true;

  const orderData = {
    customer: {
      ship_name: form.value.ship_name,
      ship_city: form.value.ship_city,
      ship_zip_postal_code: form.value.ship_zip_postal_code,
      ship_address: form.value.ship_address
    },

    items: cart.items.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.list_price
    }))
  };

  try {
    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(orderData)
    });

    if (response.ok) {
      alert('Order successfully sent!');
      cart.clearCart();

      await router.push({name: 'OrderConfirmation'});

    } else {

      const errorData = await response.json();
      alert(`Error in the order: ${errorData.message || response.statusText}`);
    }
  } catch (error) {
    console.error('Order error:', error);
    alert('Network error: Order could not be sent.');
  } finally {
    isLoading.value = false;
  }
};

</script>

<template>
  <div class="checkout-wrapper">
    <h1>Checkout</h1>

    <form @submit.prevent="submitOrder">
      <div>
        <label>Receiver Name</label>
        <input v-model="form.ship_name" required/>
      </div>

      <div>
        <label>City</label>
        <input v-model="form.ship_city" required/>
      </div>

      <div>
        <label>Postal Code</label>
        <input v-model="form.ship_zip_postal_code" required/>
      </div>

      <div>
        <label>Address</label>
        <textarea v-model="form.ship_address" required></textarea>
      </div>

      <BaseButton type="submit"
                  :disabled="isLoading || cart.items.length === 0"
      >
        <span v-if="!isLoading">Send Order</span>
        <span v-else>Will be sent...</span>
      </BaseButton>
    </form>
  </div>
</template>

<style scoped>
.checkout-wrapper {
  max-width: 500px;
  margin: 40px auto;
  padding: 25px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 25px;
  font-size: 26px;
  font-weight: 700;
  color: #333;
}

form div {
  margin-bottom: 20px;
  margin-right: 30px;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 6px;
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

input,
textarea {
  width: 100%;
  padding: 10px 14px;
  font-size: 15px;
  border: 1px solid #9a4848;
  border-radius: 10px;
  background: #fafafa;
  transition: border 0.2s ease, box-shadow 0.2s ease;
}

input:focus,
textarea:focus {
  border-color: #0066ff;
  box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.2);
  outline: none;
}

textarea {
  height: 90px;
  resize: none;
}

BaseButton {
  margin-top: 15px;
  width: 100%;
}

@media (max-width: 500px) {
  .checkout-wrapper {
    margin: 20px;
    padding: 20px;
  }
}

</style>