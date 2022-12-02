<script setup lang="ts">
import { ref, Ref, onMounted, onUpdated } from 'vue'

import SETTINGS from '../settings'
import { GameState } from '../types';
import { TradeGood } from "../models/tradegood.model"
import { useUtils } from '../composables/useUtils'

import { useMainStore } from "../stores/index"
import { useCalendarStore } from "../stores/calendar"
import { useInventoryStore } from "../stores/inventory"

import InventoryItem from '../components/InventoryItem.vue';
import StatsBox from '../components/StatsBox.vue';
import MessageBox from '../components/MessageBox.vue';
import LocationsBox from '../components/LocationsBox.vue';
import OrderModal from '../components/OrderModal.vue';
import LoanModal from '../components/LoanModal.vue'
import WinModal from '../components/WinModal.vue'
import LoseModal from '../components/LoseModal.vue'
import BankModal from '../components/BankModal.vue'

const props = defineProps({
  loadGame: {
    type: Boolean,
    required: true
  }
})

const { randomNumberInRange } = useUtils()

const store = useMainStore()
const calendarStore = useCalendarStore()
const inventory = useInventoryStore()

const gameState: Ref<GameState> = ref('Default')
const activeSpice: Ref<TradeGood | null> = ref(null) // which spice is currently being traded


onMounted(() => {
  if (!props.loadGame) {
    restart()
  }
})

onUpdated(() => {
  if (store.debt == 0 && calendarStore.daysSinceStart <= SETTINGS.maxDays) {
    gameState.value = 'Win'
    store.logMessage(`Loan paid off!`)
  } else if (calendarStore.daysSinceStart > SETTINGS.maxDays && store.debt > 0) {
    gameState.value = 'Lose'
  }
})

function restart() {
  gameState.value = 'Default'
  activeSpice.value = null
  store.initStore()
  calendarStore.initStore()
  inventory.initStore()
  store.logMessage("New game started...")
}

function onAdvanceTime(days : number) {
  while (days > 0) {
    nextDay()
    days--
  }
}

function nextDay() {
  inventory.randomizeGoods()
  store.updateDebt()
  calendarStore.advanceDate()

  if (Math.random() < SETTINGS.event_chance) {
    randomEvent()
  }
}

function randomEvent() {
  // select random non-player good
  const randomIndex = randomNumberInRange(0, Object.keys(SETTINGS.locations).length * SETTINGS.spiceOrder.length)
  const randomGood = inventory.getGoodByIndex(randomIndex)
  if (!randomGood) return
  const rng = Math.random()
  if (rng < 0.4) {
    inventory.priceSpike(randomIndex)
    store.logMessage(`<span class="text-blue">${randomGood.spiceType} has spiked in value at ${randomGood.location}!</span>`)
  } else if (rng < .8) {
    inventory.priceDrop(randomIndex)
    store.logMessage(`<span class="text-blue">${randomGood.spiceType} has dropped in value at ${randomGood.location}!</span>`)
  } else {
    const randomCashAmount = randomNumberInRange(store.cash * .4, store.cash * .8)
    if (randomCashAmount > 0) {
      store.spendCash(randomCashAmount)
      store.logMessage(`<span class="text-red">You were robbed! You lost $${randomCashAmount.toLocaleString()}! Shoulda put it in the bank.</span>`)
    }
  }
}

</script>

<template>

  <WinModal
    v-if="gameState == 'Win'"
    @restart="restart"
    @closeForm="gameState = 'Default'"
  />

  <LoseModal
    v-if="gameState == 'Lose'"
    @restart="restart"
  />

  <BankModal
    v-if="gameState == 'Bank'"
    @closeForm="gameState = 'Default'"
  />

  <LoanModal
    v-if="gameState == 'Loan'"
    @closeForm="gameState = 'Default'"
  />

  <OrderModal
    v-if="(gameState == 'Buy' || gameState == 'Sell') && activeSpice != null"
    :transaction-type="gameState"
    :spice="activeSpice"
    @closeForm="gameState = 'Default'"
  />

  <div class="row top">
    <StatsBox />
    <LocationsBox @advanceTime="onAdvanceTime" />
  </div>

  <div class="row">
    <section>
      <h4 v-if="store.currentLocation">Current Location: {{ store.currentLocation.name }}</h4>
      <table>
        <thead>
          <tr>
            <th>Spice</th>
            <th colspan="2">Price</th>
          </tr>
        </thead>
        <tbody>
          <InventoryItem
            v-if="store.currentLocation"
            v-for="(item, index) in inventory.getCurrentLocationGoods"
            :key="`item-${store.currentLocation.name}-${index}`"
            :good="item"
            :disabled="inventory.inventorySpace == 0 || store.cash < item.price"
            transaction-type="Buy"
            @order="activeSpice = item; gameState = 'Buy'"
          />
        </tbody>
      </table>
    </section>
    <section>
      <h4>Player Inventory ({{ inventory.inventorySpace }} / {{ SETTINGS.inventorySpace }} )</h4>
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
            v-for="(item, index) in inventory.getPlayerGoods()"
            :key="`item-${index}`"
            :good="item"
            transaction-type="Sell"
            @order="activeSpice = item; gameState = 'Sell'"
          />
        </tbody>
      </table>
    </section>
  </div>

  <div class="row">
    <MessageBox />
  </div>

  <div class="actions">
    <button @click.prevent="store.logMessage('Waited a day'); gameState = 'Default'; nextDay(); ">Wait a day</button>
    <button @click.prevent="gameState = 'Loan'">Pay Loan</button>
    <button @click.prevent="gameState = 'Bank'">Visit Bank</button>
    <button class="ml-auto" @click.prevent="restart">New Game</button>
  </div>

</template>


<style scoped>
.top {
  padding-top: 35px;
}
.row {
  display: flex;
  flex-flow: column;
  width: 100%;
}

@media screen and (min-width: 768px) {
  .row {
    flex-flow: row;
  }
}

.row > section {
  margin: 5px;
  padding: 10px;
  flex-basis: 100%;
}

h4 {
  margin: 10px 0 5px;
}

.actions  {
  display: flex;
  margin: 5px;
  flex-basis: 100%;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: space-between;
}

@media screen and (min-width: 768px) {
  .actions {
    flex-wrap: no-wrap;
    justify-content: flex-start;
  }
}

.actions button {
  flex-basis: 48.5%;
  margin-bottom: 10px;
}

@media screen and (min-width: 768px) {
  .actions button {
    flex-basis: auto;
    margin-right: 10px;
  }
}


.ml-auto {
  margin-left: auto
}

</style>
