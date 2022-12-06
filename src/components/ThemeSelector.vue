
<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const useDarkMode = ref(true)

watchEffect(() => {
  const el = document.getElementsByTagName('html')[0]
  if (useDarkMode.value == true && !el.classList.contains('dark-theme')) {
    el.classList.add('dark-theme')
    el.classList.remove('light-theme')
  } else if (useDarkMode.value == false && el.classList.contains('dark-theme')) {
    el.classList.remove('dark-theme')
    el.classList.add('light-theme')
  }
})

</script>

<template>
  <form>
    <label for="useDarkMode">Dark</label>
    <input type="checkbox" id="useDarkMode" v-model="useDarkMode" />
  </form>
</template>

<style scoped>
  form {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 15;
    display: flex;
  }

  label {
    font-size: 12px;
    text-transform: uppercase;
  }
</style>
