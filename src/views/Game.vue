<script lang="ts">
import { defineComponent } from 'vue'

import { TransactionType, SpiceType } from '../types';
import { Location } from '../models/Location'
import { Player } from '../models/Player'
import { Broker } from '../models/Broker'

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
      // dateOptions: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      locations: [
        new Location('New York', 'Jackie B.'),
        new Location('New Orleans', 'Monique'),
        new Location('Los Angeles', 'Mel C.'),
        new Location('Chicago', 'Del H.'),
        new Location('Detroit', 'Marky M.'),
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
    getLocation(index : number) {
      return this.locations[index]
    },
    onTravelTo(index : number) {
      const currentLocation = this.locations[this.currentLocationIndex]
      const newLocation = this.locations[index]
      console.log(`\n!!! Traveling from ${currentLocation.name} to ${newLocation.name}...`)
      this.currentLocationIndex = index
      this.nextDay()
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
      this.currentDay = new Date(this.currentDay) // have to create new date object for vue to detect changes
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
})


</script>

<template>

  <div class="top-row">
    <StatsBox :cash="player.cash" :day="currentDay" />
    <LocationsBox :locations="locations" :currentLocation="getLocation(currentLocationIndex)" @travelTo="onTravelTo" />
  </div>

  <div class="trade-box">
    <section>
      <h4>{{ currentLocation.name }} - {{ currentLocation.broker.name }} (${{currentLocation.broker.cash.toLocaleString()}})</h4>
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
