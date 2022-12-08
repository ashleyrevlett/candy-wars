
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import SETTINGS from '../settings'
import { useMainStore } from "../stores/index"
import { useCalendarStore } from "../stores/calendar"
import loseSFX from '../assets/audio/gameLose.wav'

const store = useMainStore()
const calendar = useCalendarStore()

const debtPaid = computed(() => Math.max(0, SETTINGS.debt - store.debt))
const endWorth = computed(() => store.bank + store.cash - store.debt)

const emit = defineEmits<{
  (e: 'restart'): void
}>()

const loseAudio = new Audio(loseSFX)
loseAudio.volume = 0.8
onMounted(() => {
  setTimeout(() => {loseAudio.play() }, 350)
})

</script>

<template>
  <section class="modal">
    <div class="text-center">
      <h3>You Lost!</h3>
      <p>You didn't repay your loan within the time limit!</p>
      <p>${{debtPaid.toLocaleString()}} of ${{SETTINGS.debt.toLocaleString()}} loan repaid in {{calendar.daysSinceStart - 1}} days.</p>
      <p class="text-green">Net Worth: ${{endWorth.toLocaleString()}}</p>
    </div>
    <div class="flex">
      <button @click.prevent="emit('restart')">New Game</button>
    </div>
  </section>
  <div class="modal-overlay-bg"></div>
</template>

<style scoped>
section {
  height: auto;
  width: 320px;
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