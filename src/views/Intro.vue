<script setup lang="ts">
import SETTINGS from '../settings'
import { Spice } from '../models/Spice'

function getSpices() {
  const spices : Array<Spice> = Array();
  SETTINGS.spiceOrder.forEach(spice => {
    spices.push(new Spice(spice))
  });
  return spices
}

const emit = defineEmits<{
  (e: 'start'): void
}>()

</script>

<template>

  <main class="text-center">
    <h2>Spice Wars</h2>
    <p>This is a game of buying and selling. The object of the game is to pay off your debt to the bank. Then, make as much money as you can in a 1 year period. The prices of spices per unit are:</p>
    <ul>
      <li v-for="spice in getSpices()">{{ spice.spiceType }}: ${{spice.priceRange.min}} – {{spice.priceRange.max}} </li>
    </ul>
    <button @click="emit('start')">Start Game</button>
  </main>


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

</style>
