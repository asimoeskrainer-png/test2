<script setup>
import BaseButton from "@/BaseButton.vue";
import {useRouter} from 'vue-router';
import homePic from "../assets/homePic.jpg";

const router = useRouter();

function goToProducts() {
  router.push("/products");
}
</script>

<template>
  <div class="hero">
    <img class="hero-image" :src="homePic" alt="home picture"/>

    <div class="hero-content">
      <h1>Welcome to Your Online Webshop!</h1>
      <BaseButton type="primary" @click="goToProducts">
        Products
      </BaseButton>
    </div>
  </div>
</template>


<style scoped>
.hero {
  position: relative;
  width: 100%;
  height: 60vh;
  overflow: hidden;
}

/* Responsive Design */
.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Text & Button links positionieren */
.hero-content {
  position: absolute;
  top: 50%;
  left: 5%;
  transform: translateY(-50%);
  text-align: left;
  color: white;
  text-shadow: 0 3px 8px rgba(0, 0, 0, 0.7);
  max-width: 400px;
}

.hero-content h1 {
  margin-bottom: 45px;
  font-size: 2.5rem;
}

@media (max-width: 600px) {
  .hero {
    height: 50vh;
  }

  .hero-content {
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    padding: 0 15px; /* Etwas Platz am Rand */
    text-align: center;
    max-width: none;
  }

  .hero-content h1 {
    font-size: 1.6rem;
    margin-bottom: 20px;
  }
}

</style>
