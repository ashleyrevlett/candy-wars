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

</script>

<template>

  <div class="text-center">
    <p>Candy price ranges:</p>
    <table>
      <tr v-for="good in getGoods()">
        <td>{{ good.goodType }}</td>
        <td>${{good.priceRange.min.toLocaleString(undefined, {minimumFractionDigits: 2})}} – {{good.priceRange.max.toLocaleString(undefined, {minimumFractionDigits: 2})}}</td>
      </tr>
    </table>
  </div>

</template>


<style scoped>
  table {
    margin: 1rem auto 2rem auto;
    width: auto;
  }

  td {
    padding: .2rem 1rem;
  }
</style>
