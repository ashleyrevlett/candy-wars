
<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const useDarkMode = ref(true)

watchEffect(() => {
  const el = document.getElementsByTagName('html')[0]
  if (useDarkMode.value == true && !el.classList.contains('dark-theme')) {
    el.classList.add('dark-theme')
  } else if (useDarkMode.value == false && el.classList.contains('dark-theme')) {
    el.classList.remove('dark-theme')
  }
})

</script>

<template>
  <form>
    <label for="useDarkMode">Dark Mode</label>
    <input type="checkbox" id="useDarkMode" v-model="useDarkMode" />
  </form>
</template>

<style scoped>
  form {
    position: absolute;
    top: 5px;
    right: 5px;
  }
</style>
