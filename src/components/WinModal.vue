
<script setup lang="ts">
import { computed } from 'vue'
import SETTINGS from '../settings'

const props = defineProps({
  totalDays: {
    type: Number,
    required: true
  },
  endWorth: {
    type: Number,
    required: true
  },
})

const debt = computed(() =>  SETTINGS.debt)

const emit = defineEmits<{
  (e: 'restart'): void
  (e: 'closeForm'): void
}>()

</script>


<template>
  <div>
    <section class="modal">
      <div class="text-center">
        <h3>Congratulations!</h3>
        <p>You have successfully paid off your loan within the time limit!</p>
        <p>${{debt.toLocaleString()}} repaid in {{totalDays}} days.</p>
        <p class="text-green">Net Worth: ${{endWorth.toLocaleString()}}</p>
      </div>
      <div class="flex">
        <button @click.prevent="emit('restart')">New Game</button>
        <button @click.prevent="emit('closeForm')">Keep Playing</button>
      </div>
    </section>
    <div class="modal-overlay-bg"></div>
  </div>
</template>


<style scoped>

section {
  height: 250px;
  width: 400px;
  display: flex;
  flex-direction: column;
  margin-left: -200px;
  margin-top: 100px;
}


div {
  padding: 0 10px 10px 10px;
  margin-bottom: 10px;
}

h3 {
  margin: 25px 0 10px 0;
}

p {
  margin: 0;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

button {
  margin: 5px 5px 0 5px;
}

</style>
