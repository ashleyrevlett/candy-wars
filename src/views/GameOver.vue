<script setup lang="ts">
import { PropType } from 'vue'

import WinModal from '../components/WinModal.vue'
import LoseModal from '../components/LoseModal.vue'
import { GameState } from '../types'

const props = defineProps({
  gameState: {
    type: String as PropType<GameState>,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'restartGame'): void,
}>()

</script>

<template>

<WinModal
  v-if="gameState == 'Win'"
  @restart="emit('restartGame')"
/>

<LoseModal
  v-if="gameState == 'Lose'"
  @restart="emit('restartGame')"
/>

</template>


<style scoped>

  .main {
    max-width: 80%;
    margin: 0 auto;
  }

  ul {
    padding: 0;
  }

  li {
    list-style-type: none;
  }

  button {
    margin-right: 5px;
    margin-left: 5px;
  }

</style>
