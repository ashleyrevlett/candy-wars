<script setup lang="ts">
import SETTINGS from '../settings'
import { SpiceType, NumberRange } from '../types'

interface Good {
  spiceType: SpiceType,
  priceRange: NumberRange
}

function getSpices() {
  return SETTINGS.spiceOrder.map(spice => {
    const s: Good = {
      spiceType: spice,
      priceRange: SETTINGS.priceRanges[spice]
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

  <div class="text-center">
    <h2>Spice Wars</h2>
    <p>This is a game of buying and selling. The object of the game is to pay off your debt to the bank. Then, make as much money as you can in a 1 year period. The prices of spices per unit are:</p>
    <ul>
      <li v-for="spice in getSpices()">{{ spice.spiceType }}: ${{spice.priceRange.min}} – {{spice.priceRange.max}} </li>
    </ul>
    <div>
      <button v-if="hasSaveGame" @click="emit('load')">Continue Game</button>
      <button @click="emit('start')">New Game</button>
    </div>
  </div>

</template>


<style scoped>

  main {
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
