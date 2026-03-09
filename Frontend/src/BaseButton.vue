<script setup>
// Definiert die erlaubten Props und deren Typen, inkl. Standardwert
defineProps({
  type: {
    type: String,
    default: 'button',
  },
});

defineEmits(['click']);
</script>

<template>
  <button :type="type"
          class="base-button"
          @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<style scoped>
.base-button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  background-color: #007bff;
  color: white;

  transition: background-color 0.3s ease;
}

.base-button:hover {
  background-color: #0056b3;
}

.base-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.8;
}
</style>