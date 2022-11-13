<script lang="ts">
import { TransactionType, SpiceType } from '../types';
import { Location } from '../models/Location'
import { Player } from '../models/Player'
import { Broker } from '../models/Broker'

import InventoryItem from '../components/InventoryItem.vue';

export default {
  components: {
    InventoryItem
  },
  data() {
    return {
      currentDay : new Date('January 1, 1572 12:00:00'),
      // dateOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      locations: [
        new Location('New York', 'Jackie B.'),
        new Location('New Orleans', 'Monique'),
        new Location('Los Angeles', 'Mel C.'),
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
    travelTo(index : number) {
      const currentLocation = this.locations[this.currentLocationIndex]
      const newLocation = this.locations[index]
      console.log(`\n!!! Traveling from ${currentLocation.name} to ${newLocation.name}...`)
      this.currentLocationIndex = index
    },
    nextDay() {
      console.log("Another day has begun ...")
      this.locations.forEach(location => {
        location.broker.inventory.forEach(spice => {
          spice.simulateTrade()
        });
        location.broker.randomizeCash()
      });
      this.currentDay.setDate(this.currentDay.getDate() + 1)
    },
    sell(spice: SpiceType, quantity : number) {
      if (!this.canTrade('Sell', this.currentLocation.broker, spice, quantity))
        return
      const price = this.currentLocation.broker.getPrice(spice)
      this.currentLocation.broker.buy(spice, quantity, price)
      this.player.sell(spice, quantity, price)
      console.log(`\n!!! ${this.player.name} sold ${quantity} ${spice} to ${this.currentLocation.broker.name} for a total of $${(quantity * price).toLocaleString()}`)
    },
    buy(spice: SpiceType, quantity : number) {
      if (!this.canTrade('Buy', this.currentLocation.broker, spice, quantity))
        return
      const price = this.currentLocation.broker.getPrice(spice)
      this.currentLocation.broker.sell(spice, quantity, price)
      this.player.buy(spice, quantity, price)
      console.log(`\n!!! ${this.player.name} bought ${quantity} ${spice} from ${this.currentLocation.broker.name} for a total of $${(quantity * price).toLocaleString()}`)
    },
    canTrade(transaction: TransactionType, broker: Broker, spiceType: SpiceType, quantity: number) {
      let price = broker.getPrice(spiceType)
      if (transaction == 'Buy') {
        if (price * quantity > this.player.cash) {
          console.log("Player doesn't have enough cash")
          return false
        } else if (quantity > broker.getQuantity(spiceType)) {
          console.log("Broker doesn't have enough spice")
          return false
        }
      } else {
        if (price * quantity > broker.cash) {
          console.log("Broker doesn't have enough cash")
          return false
        } else if (quantity > this.player.getQuantity(spiceType)) {
          console.log("Player doesn't have enough spice")
          return false
        }
      }
      return true
    }
  },
  mounted() {
  }
}


</script>

<template>

  <p>{{ currentDay.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}}</p>
  <p>{{player.name}}: ${{player.cash.toLocaleString()}}</p>
  <section>
    <h4>Player Inventory</h4>
    <InventoryItem
      v-for="(item, index) in player.inventory"
      :key="`item-${player.name}-${index}`"
      :name="item.name"
      :quantity="item.quantity"
      :price="item.price"
      :canSell="true"
      @sell="(qty) => sell(item.name, qty)"
    />
    <p v-if="player.inventory.length == 0">Empty</p>
  </section>

  <h4>{{ currentLocation.name }} - {{ currentLocation.broker.name }} (${{currentLocation.broker.cash.toLocaleString()}})</h4>
  <section>
    <InventoryItem
      v-for="(item, index) in currentLocation.broker.inventory"
      :key="`item-${currentLocation.name}-${index}`"
      :name="item.name"
      :quantity="item.quantity"
      :price="item.price"
      :canBuy="true"
      @buy="(qty) => buy(item.name, qty)"
    />
  </section>


  <h4>Travel to...</h4>
  <button v-for="(location, index) in locations" :key="location.name" :disabled="currentLocation.name == location.name" @click="travelTo(index)">{{ location.name }}</button>
  <br />
  <button @click="nextDay()">Wait a day</button>

</template>


<style scoped>
</style>
