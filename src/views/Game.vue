<script lang="ts">
import { defineComponent } from 'vue'

import { TransactionType, SpiceType } from '../types';
import { Location } from '../models/Location'
import { Player } from '../models/Player'

import InventoryItem from '../components/InventoryItem.vue';
import StatsBox from '../components/StatsBox.vue';
import LocationsBox from '../components/LocationsBox.vue';

export default defineComponent({
  components: {
    InventoryItem,
    StatsBox,
    LocationsBox
  },
  data() {
    return {
      currentDay :  new Date('January 1, 1572 12:00:00'),
      locations: [
        new Location('New York'),
        new Location('New Orleans'),
        new Location('Los Angeles'),
        new Location('Chicago'),
        new Location('Detroit'),
      ],
      currentLocationIndex: 0,
      player: new Player('Jane', 1000),
    }
  },
  computed: {
    currentLocation() {
      return this.locations[this.currentLocationIndex]
    }
  },
  methods: {
    buy(spice: SpiceType, quantity : number) {
      const price = this.currentLocation.getPrice(spice)
      if (price * quantity > this.player.cash)
        return
      this.player.buy(spice, quantity, price)
      console.log(`\n!!! ${this.player.name} bought ${quantity} ${spice} in ${this.currentLocation.name} for a total of $${(quantity * price).toLocaleString()}`)
    },

    sell(spice: SpiceType, quantity : number) {
      if (quantity > this.player.getQuantity(spice))
        return
      const price = this.currentLocation.getPrice(spice)
      this.player.sell(spice, quantity, price)
      console.log(`\n!!! ${this.player.name} sold ${quantity} ${spice} in ${this.currentLocation.name} for a total of $${(quantity * price).toLocaleString()}`)
    },

    travelTo(index : number) {
      const currentLocation = this.locations[this.currentLocationIndex]
      const newLocation = this.locations[index]
      console.log(`\n!!! Traveling from ${currentLocation.name} to ${newLocation.name}...`)
      this.currentLocationIndex = index
      this.nextDay()
    },

    nextDay() {
      console.log("Another day has begun ...")
      this.locations.forEach(location => {
        location.inventory.forEach(spice => {
          spice.simulateTrade()
        });
      });
      this.currentDay.setDate(this.currentDay.getDate() + 1)
      this.currentDay = new Date(this.currentDay) // have to create new date object for vue to detect changes
    },

  }
})


</script>

<template>

  <div class="top-row">
    <StatsBox :cash="player.cash" :day="currentDay" />
    <LocationsBox :locations="locations" :currentLocation="currentLocation" @travelTo="travelTo" />
  </div>

  <div class="trade-box">
    <section>
      <h4>{{ currentLocation.name }}</h4>
      <InventoryItem
        v-for="(item, index) in currentLocation.inventory"
        :key="`item-${currentLocation.name}-${index}`"
        :name="item.spiceType"
        :price="item.price"
        :canBuy="true"
        @buy="(qty) => buy(item.spiceType, qty)"
      />
    </section>
    <section>
      <h4>Player Inventory</h4>
      <InventoryItem
        v-for="(item, index) in player.inventory"
        :key="`item-${player.name}-${index}`"
        :name="item.spiceType"
        :quantity="item.quantity"
        :price="item.price"
        :canSell="true"
        @sell="(qty) => sell(item.spiceType, qty)"
      />
      <p v-if="player.inventory.length == 0">Empty</p>
    </section>
  </div>

  <button @click="nextDay()">Wait a day</button>

</template>


<style scoped>

.top-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 0px;
}
.trade-box {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 0px;
  margin-bottom: 10px;
}

.trade-box > section {
  border: 1px solid white;
  padding: 0 1rem;
}
</style>
