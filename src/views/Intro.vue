<script lang="ts">
import { defineComponent } from 'vue'
import { SPICE_ORDER } from '../types'
import { LocationSpice } from '../models/LocationSpice'

export default defineComponent({
  methods: {
    getSpices() {
      const spices : Array<LocationSpice> = Array();
      SPICE_ORDER.forEach(spice => {
        spices.push(new LocationSpice(spice))
      });
      return spices
    },
  }
})
</script>

<template>

  <main class="text-center">
    <p>This is a game of buying and selling. The object of the game is to pay off your debt to the bank. Then, make as much money as you can in a 1 year period. The prices of spices per unit are:</p>
    <ul>
      <li v-for="spice in getSpices()">{{ spice.spiceType }}: ${{spice.priceRange.min}} – {{spice.priceRange.max}} </li>
    </ul>
    <button @click="$emit('start')">Start Game</button>
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
