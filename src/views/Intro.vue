<script setup lang="ts">
import SETTINGS from '../settings'
import PriceList from '../components/PriceList.vue'

const emit = defineEmits<{
  (e: 'start'): void
  (e: 'load'): void
}>()

function hasSaveGame() {
  // has the player moved beyond the first turn
  const calendarStore = localStorage.getItem('calendarStore')
  if (calendarStore) {
    const currentDate = new Date(JSON.parse(calendarStore).currentDay)
    if (currentDate.getTime() !== SETTINGS.startDate.getTime()) {
      return true
    }
  }
  // has the player spent any money
  const mainStore = localStorage.getItem('mainStore')
  if (mainStore) {
    const gameData = JSON.parse(mainStore)
    if (gameData.cash != SETTINGS.cash || gameData.debt != SETTINGS.debt) {
      return true
    }
  }
  // no savegame found in localstorage or player hasn't taken a turn yet
  return false
}

</script>

<template>

  <div class="text-center main">
    <h2>Candy Wars</h2>
    <p>You have {{  SETTINGS.maxDays }} days to pay off your loan and make as much money as you can.<br />School ends at {{ SETTINGS.schoolEndHour % 12 }}pm.</p>
    <PriceList />
    <div v-if="hasSaveGame()">
      <button @click="emit('load')">Continue Game</button>
      <button @click="emit('start')">New Game</button>
    </div>
    <div v-else>
      <button @click="emit('start')">Start Game</button>
    </div>
  </div>

</template>


<style scoped>
  .main {
    max-width: 80%;
    margin: 0 auto;
  }

  button {
    margin-right: 5px;
    margin-left: 5px;
  }
</style>
