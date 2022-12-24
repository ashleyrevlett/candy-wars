<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const theme = ref("dark")

watch(theme, (newValue) => {
  const el = document.getElementsByTagName('html')[0]
  if (!el.classList.contains(newValue)) {
    el.className = ""
    el.classList.add(newValue)
    localStorage.setItem('candyTheme', newValue)
  }
})

onMounted(() => {
  const setting = localStorage.getItem('candyTheme')
  if (setting) {
    theme.value = setting;
  }
})

</script>

<template>
  <form>
    <select name="theme" v-model="theme">
      <option selected value="dark">Dark Theme</option>
      <option value="light">Light Theme</option>
      <option value="vintage">Vintage Theme</option>
    </select>
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

  select {
    font-size: 11px;
  }
</style>
