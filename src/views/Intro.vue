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

const hasSaveGame = localStorage.getItem('mainStore') != null ? true : false

</script>

<template>

  <div class="text-center main">
    <h2>Candy Wars</h2>
    <p>You have {{  SETTINGS.maxDays }} days to pay off your loan and make as much money as you can.<br />School is open from 9am - 3pm.</p>
    <p>The prices of goods per unit are:</p>
    <ul>
      <li v-for="good in getGoods()">{{ good.goodType }}: ${{good.priceRange.min}} – {{good.priceRange.max}} </li>
    </ul>
    <div>
      <button v-if="hasSaveGame" @click="emit('load')">Continue Game</button>
      <button @click="emit('start')">New Game</button>
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
