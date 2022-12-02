
<script setup lang="ts">
import { computed } from 'vue'
import SETTINGS from '../settings'
import { useMainStore } from "../stores/index"
import { useCalendarStore } from "../stores/calendar"

const store = useMainStore()
const calendar = useCalendarStore()

const endWorth = computed(() => store.bank + store.cash)

const emit = defineEmits<{
  (e: 'restart'): void
  (e: 'closeForm'): void
}>()

</script>


<template>
  <section class="modal">
    <div class="text-center">
      <h3>Congratulations!</h3>
      <p>You have successfully paid off your loan within the time limit!</p>
      <p>${{SETTINGS.debt.toLocaleString()}} repaid in {{calendar.daysSinceStart}} days.</p>
      <p class="text-green">Net Worth: ${{endWorth.toLocaleString()}}</p>
    </div>
    <div class="flex">
      <button @click.prevent="emit('restart')">New Game</button>
      <button @click.prevent="emit('closeForm')">Keep Playing</button>
    </div>
  </section>
  <div class="modal-overlay-bg"></div>
</template>


<style scoped>

section {
  height: 250px;
  width: 400px;
  display: flex;
  flex-direction: column;
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
