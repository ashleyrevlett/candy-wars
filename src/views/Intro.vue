<script setup lang="ts">
import SETTINGS from '../settings'
import { GoodType, NumberRange } from '../types'

interface Good {
  goodType: GoodType,
  priceRange: NumberRange
}

function getGoods() {
  return SETTINGS.goodOrder.map(good => {
    const s: Good = {
      goodType: good,
      priceRange: SETTINGS.priceRanges[good]
    }
    return s
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
    <h2>Trade Wars</h2>
    <p>This is a game of buying and selling. The object of the game is to pay off your debt to the bank. Then, make as much money as you can in a 1 year period. The prices of goods per unit are:</p>
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
