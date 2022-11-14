<script lang="ts">
import { defineComponent } from 'vue'

import { TransactionType, SpiceType } from '../types';
import { Location } from '../models/Location'
import { Player } from '../models/Player'

import InventoryItem from '../components/InventoryItem.vue';
import StatsBox from '../components/StatsBox.vue';
import LocationsBox from '../components/LocationsBox.vue';
import OrderForm from '../components/OrderForm.vue';
import { Spice } from '../models/Spice';

export default defineComponent({
  components: {
    InventoryItem,
    StatsBox,
    LocationsBox,
    OrderForm
  },
  data() : {
    activeSpice:  undefined | Spice,
    activeTransaction: undefined | TransactionType,
    currentDay : Date,
    locations: Array<Location>,
    currentLocationIndex: number,
    player: Player
  } {
    return {
      activeSpice: undefined,
      activeTransaction: undefined,
      currentDay : new Date('January 1, 1572 12:00:00'),
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
    },
    minTransaction() {
      if (!this.activeSpice || !this.activeTransaction) return 0
      if (this.activeTransaction == 'Buy') {
        return Math.min(this.player.inventorySpace, 1)
      } else if (this.activeTransaction == 'Sell' && this.player.getQuantity(this.activeSpice?.spiceType) > 0) {
        return 1
      }
      return 0
    },
    maxTransaction() {
      if (!this.activeSpice || !this.activeTransaction) return 0
      if (this.activeTransaction == 'Buy') {
        const budgetMax = Math.floor(this.player.cash / this.activeSpice?.price)
        return Math.min(this.player.inventorySpace, budgetMax)
      } else if (this.activeTransaction == 'Sell') {
        return this.player.getQuantity(this.activeSpice?.spiceType)
      }
      return 0
    }
  },
  methods: {
    buy(spice: SpiceType, quantity : number) {
      const price = this.currentLocation.getPrice(spice)
      if (price * quantity > this.player.cash)
        return
      this.player.buy(spice, quantity, price)
      console.log(`\n!!! ${this.player.name} bought ${quantity} ${spice} in ${this.currentLocation.name} for a total of $${(quantity * price).toLocaleString()}`)
      this.activeSpice = undefined;
      this.activeTransaction = undefined;
    },

    sell(spice: SpiceType, quantity : number) {
      const price = this.currentLocation.getPrice(spice)
      this.player.sell(spice, quantity, price)
      console.log(`\n!!! ${this.player.name} sold ${quantity} ${spice} in ${this.currentLocation.name} for a total of $${(quantity * price).toLocaleString()}`)
      this.activeSpice = undefined;
      this.activeTransaction = undefined;
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

  <OrderForm
    v-if="activeSpice != null"
    :transaction-type="activeTransaction"
    :spice="activeSpice"
    :price="currentLocation.getPrice(activeSpice.spiceType)"
    :allowed-range="{ min: minTransaction, max: maxTransaction  }"
    @buy="buy"
    @sell="sell"
    @closeForm="activeSpice = undefined"
  />

  <div class="top-row">
    <StatsBox :cash="player.cash" :day="currentDay" />
    <LocationsBox :locations="locations" :currentLocation="currentLocation" @travelTo="travelTo" />
  </div>

  <div class="trade-box">
    <section>
      <h4>{{ currentLocation.name }}</h4>
      <table>
        <thead>
          <tr>
            <th>Spice</th>
            <th>Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <InventoryItem
            v-for="(item, index) in currentLocation.inventory"
            :key="`item-${currentLocation.name}-${index}`"
            :name="item.spiceType"
            :price="item.price"
            transaction-type="Buy"
            @order="activeSpice = item; activeTransaction = 'Buy'"
          />
        </tbody>
      </table>
    </section>
    <section>
      <h4>Player Inventory ({{ 100 - player.inventorySpace }} / 100 )</h4>
      <table>
        <thead>
          <tr>
            <th>Spice</th>
            <th>Qty</th>
            <th colspan="2">Avg Price</th>
          </tr>
        </thead>
        <tbody>
          <InventoryItem
            v-for="(item, index) in player.inventory"
            :key="`item-${player.name}-${index}`"
            :name="item.spiceType"
            :quantity="item.quantity"
            :price="item.price"
            transaction-type="Sell"
            @order="activeSpice = item; activeTransaction = 'Sell'"
          />
        </tbody>
      </table>
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
