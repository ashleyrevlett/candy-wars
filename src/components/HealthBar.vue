
<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  remaining: {
    type: Number,
    required: true,
  }
})
</script>

<template>
  <aside class="healthBar">
    <span class="label">{{ title }}: </span>
    <div v-for="(n,index) in total" :key="index" :class="{'alive': n <= remaining}" class="bars">
      <span v-if="(n <= remaining)">|</span>
      <span v-else>.</span>
    </div>
  </aside>
</template>

<style scoped>
div {
  display: inline-block;
}
div.alive {
  color: var(--success-color)
}

.bars {
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
}
</style>