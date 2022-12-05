
<script setup lang="ts">

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'closeAlert'): void
}>()
</script>

<template>
  <section class="modal">
    <div class="text-center">
      <h4>ALERT!</h4>
      <p v-html="message"></p>
      <button @click.prevent="emit('closeAlert')">OK</button>
    </div>
  </section>
  <div class="modal-overlay-bg"></div>
</template>

<style scoped>
section {
  height: 200px;
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

div {
  padding: 10px;
}
</style>