<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)

const { x, y, style } = useDraggable(el, {
  initialValue: { x: 40, y: 40 },
})

const emit = defineEmits<{
  (e: 'closeWindow'): void
}>()
</script>

<template>
  <div class="dragModal modal" ref="el" :style="style" style="position: fixed">
    <button class="cancel" @click.prevent="emit('closeWindow')">X</button>
    <slot></slot>
  </div>
</template>


<style scoped>
.dragModal {
  width: 320px;
  display: flex;
  flex-direction: column;
  text-align: center;
  box-shadow: none;
  cursor: move;
}

button.cancel {
  margin-left: auto;
  margin-bottom: 10px;
  border: 0;
}
</style>
