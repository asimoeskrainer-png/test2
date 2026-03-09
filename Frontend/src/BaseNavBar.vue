<script setup>

const props = defineProps({
  type: {type: String, default: "primary"},
  disabled: {type: Boolean, default: false}
})

const emit = defineEmits(["click"])
const handleClick = e => !props.disabled && emit("click", e)
</script>

<template>
  <header class="navbar-header">

    <div class="navbar-nav"></div>

    <div class="navbar-item is-left">
      <slot name="left"></slot>
    </div>

    <div class="navbar-item is-center">
      <slot name="center"></slot>
    </div>

    <div class="navbar-item is-right">
      <slot name="right"></slot>
    </div>

  </header>
  <button
      class="base-btn"
      :class="{
      primary: props.type === 'primary',
      secondary: props.type === 'secondary',
      danger: props.type === 'danger',
      disabled: props.disabled
    }"
      :disabled="props.disabled"
      @click="handleClick"
  >
    <slot/>
  </button>
</template>


<style scoped>

.navbar-header {
  background-color: #9c8876;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem
}

.navbar-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 20px;
}

.navbar-item {
  min-width: 0;
  padding: 0 10px;
}

.is-center {
  flex-grow: 1;
  text-align: center;
  display: flex;
  justify-content: center;
}

.is-left, .is-right {
  flex-shrink: 0;
}

</style>
