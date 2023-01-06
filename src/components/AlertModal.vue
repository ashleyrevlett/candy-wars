
<script setup lang="ts">

const emit = defineEmits<{
  (e: 'closeAlert'): void
}>()
</script>

<template>
  <section class="modal">
    <div class="text-center">
      <slot></slot>
      <button @click.prevent="emit('closeAlert')">OK</button>
    </div>
  </section>
  <div class="modal-overlay-bg"></div>
</template>

<style scoped>
section {
  height: 200px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

div {
  padding: 10px;
}
</style>