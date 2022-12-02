<script setup lang="ts">
import { ref, Ref, computed, onMounted, onUpdated } from 'vue'
import SETTINGS from '../settings'
import { GameState } from '../types';
import { TradeGood } from "../models/tradegood.model"
import { useMainStore } from "../stores/index"
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

const store = useMainStore()
const gameState: Ref<GameState> = ref('Default')
const activeSpice: Ref<TradeGood | null> = ref(null)

function restart() {
  gameState.value = 'Default'
  activeSpice.value = null
  store.initStore()
  store.logMessage("New game started...")
}

function onAdvanceTime(days : number) {
  while (days > 0) {
    nextDay()
    days--
  }
}

function nextDay() {
  store.randomizeGoods()
  store.updateDebt()
  store.advanceDate()

  if (Math.random() < SETTINGS.event_chance) {
    randomEvent()
  }
}

function randomNumberInRange(min:number, max:number) {
  return Math.floor(Math.random() * (max - min) + min)
}

function randomEvent() {
  const rng = Math.random()
  const min = 0
  const max = Object.keys(SETTINGS.locations).length * SETTINGS.spiceOrder.length
  const randomIndex = randomNumberInRange(min, max)
  const randomGood = store.tradeGoods[randomIndex]
  if (rng < 0.4) {
    store.logMessage(`<span class="text-blue">${randomGood.spiceType} has spiked in value at ${randomGood.location}!</span>`)
    store.priceSpike(randomIndex)
  } else if (rng < .8) {
    store.logMessage(`<span class="text-blue">${randomGood.spiceType} has dropped in value at ${randomGood.location}!</span>`)
    store.priceDrop(randomIndex)
  } else {
    const randomCashAmount = randomNumberInRange(store.cash * .4, store.cash * .8)
    if (randomCashAmount > 0) {
      store.spendCash(randomCashAmount)
      store.logMessage(`<span class="text-red">You were robbed! You lost $${randomCashAmount.toLocaleString()}! Shoulda put it in the bank.</span>`)
    }
  }
}

onUpdated(() => {
  if (store.debt == 0 && store.daysSinceStart <= SETTINGS.maxDays) {
    gameState.value = 'Win'
    store.logMessage(`Loan paid off!`)
  } else if (store.daysSinceStart > SETTINGS.maxDays && store.debt > 0) {
    gameState.value = 'Lose'
  }
})

onMounted(() => {
  if (!props.loadGame) {
    store.initStore()
    store.logMessage(`Started game...`)
  }
})

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
    @closeForm="gameState='Default'"
  />

  <div class="top-row">
    <StatsBox />
    <LocationsBox @advanceTime="onAdvanceTime" />
  </div>

  <div class="trade-box">
    <section>
      <h4 v-if="store.currentLocation">Current Location: {{ store.currentLocation.name }}</h4>
      <table>
        <thead>
          <tr>
            <th>Spice</th>
            <th>Qty</th>
            <th colspan="2">Price</th>
          </tr>
        </thead>
        <tbody>
          <InventoryItem
            v-if="store.currentLocation"
            v-for="(item, index) in store.getCurrentLocationGoods"
            :key="`item-${store.currentLocation.name}-${index}`"
            :good="item"
            :disabled="store.inventorySpace == 0 || store.cash < item.price"
            transaction-type="Buy"
            @order="activeSpice=item; gameState='Buy'"
          />
        </tbody>
      </table>
    </section>
    <section>
      <h4>Player Inventory ({{ store.inventorySpace }} / {{ SETTINGS.inventorySpace }} )</h4>
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
            v-for="(item, index) in store.getPlayerGoods()"
            :key="`item-${index}`"
            :good="item"
            transaction-type="Sell"
            @order="activeSpice=item; gameState = 'Sell'"
          />
        </tbody>
      </table>
    </section>
  </div>

  <MessageBox />

  <div class="actions">
    <button @click.prevent="store.logMessage('Waited a day'); gameState='Default'; nextDay(); ">Wait a day</button>
    <button @click.prevent="gameState='Loan'">Pay Loan</button>
    <button @click.prevent="gameState='Bank'">Visit Bank</button>
    <button class="ml-auto" @click.prevent="restart">New Game</button>
  </div>

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

h4 {
  margin: 10px 0 5px;
}

.actions  {
  display: flex;
}

.actions button {
  margin-right: 10px;
}

.ml-auto {
  margin-left: auto
}

</style>
