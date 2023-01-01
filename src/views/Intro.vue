<script setup lang="ts">
import SETTINGS from '../settings'
import { GoodType, NumberRange } from '../types'

interface IntroGood {
  goodType: GoodType,
  priceRange: NumberRange
}

function getGoods() {
  return Object.keys(SETTINGS.goods).map(good => {
    const g: IntroGood = {
      goodType: good as GoodType,
      priceRange: SETTINGS.goods[good as GoodType].priceRange
    }
    return g
  })
}

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
    <p>You have {{  SETTINGS.maxDays }} days to pay off your loan and make as much money as you can.<br />School is open from 9am - 3pm.</p>
    <p>The prices of goods per unit are:</p>
    <ul>
      <li v-for="good in getGoods()">{{ good.goodType }}: ${{good.priceRange.min}} – {{good.priceRange.max}} </li>
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
