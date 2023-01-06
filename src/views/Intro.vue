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
    <p class="intro">You're an enterprising teen, trying to make it big by hustling candy in the mean hallways of middle-school.
      Do you have what it takes to make it to the candy-slinger hall of fame?</p>

    <p style="margin-bottom:0"><strong class="text-green">HOW TO PLAY:</strong></p>
    <ul>
      <li><strong>BUY LOW</strong> and <strong>SELL HIGH</strong> to turn candy into cash.</li>
      <li>Look out for bullies and teachers.</li>
      <li>Pay off your loan before school's out for the summer.</li>
    </ul>

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

  h2 {
    margin-bottom: .5rem;
  }

  .intro {
    font-style:italic;
    margin: 0 auto 2rem;
  }

  button {
    margin-right: 5px;
    margin-left: 5px;
    background-color: transparent;
    border: 1px solid var(--success-color);
    color: var(--text-color);

    &:hover {
      background-color: var(--success-color);
      color: var(--bg-color);
    }
  }

  p {
    margin: 1.5rem auto;
  }

  ul {
    margin: 0 auto 2rem;
  }

  li {
    text-align: left;
    max-width: 80%;
    margin: .5rem 0;
  }
</style>
