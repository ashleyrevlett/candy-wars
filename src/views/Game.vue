<script setup lang="ts">
import { ref, Ref, onMounted, onUpdated } from 'vue'

import SETTINGS from '../settings'
import { GameState } from '../types';
import { TradeGood } from "../models/tradegood.model"
import { useUtils } from '../composables/useUtils'

import { useMainStore } from "../stores/index"
import { useCalendarStore } from "../stores/calendar"
import { useInventoryStore } from "../stores/inventory"

import HighScores from '../components/HighScores.vue';
import InventoryItem from '../components/InventoryItem.vue';
import StatsBox from '../components/StatsBox.vue';
import LocationsBox from '../components/LocationsBox.vue';
import OrderModal from '../components/OrderModal.vue';
import LoanModal from '../components/LoanModal.vue'
import WinModal from '../components/WinModal.vue'
import AlertModal from '../components/AlertModal.vue'
import LoseModal from '../components/LoseModal.vue'
import BankModal from '../components/BankModal.vue'
import ShopModal from '../components/ShopModal.vue'

import moneySFX from '../assets/audio/chaching.mp3'
import yeahSFX from '../assets/audio/403828__alshred__16-ohyeah.wav'
import clockSFX from '../assets/audio/ticktock.mp3'

const props = defineProps({
  loadGame: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'startEncounter'): void,
  (e: 'endGame'): void,
}>()

const { randomNumberInRange } = useUtils()

const store = useMainStore()
const calendarStore = useCalendarStore()
const inventory = useInventoryStore()

const gameState: Ref<GameState> = ref('Default')
const activeGood: Ref<TradeGood | undefined | null> = ref(null) // which good is currently being traded

onMounted(() => {
  if (!props.loadGame) {
    restart()
  }
})

onUpdated(() => {
  if (store.debt == 0 && calendarStore.daysSinceStart <= SETTINGS.maxDays && gameState.value != 'HighScore') {
    gameState.value = 'Win'
  } else if (calendarStore.daysSinceStart > SETTINGS.maxDays && store.debt > 0) {
    // max days passed and didn't pay off debt
    gameState.value = 'Lose'
  } else if (store.cash == 0 && store.bank == 0 && inventory.inventorySpace == SETTINGS.inventorySpace) {
    // no money, no goods = stalemate
    gameState.value = 'Lose'
  }
})

function restart() {
  gameState.value = 'Default'
  activeGood.value = null
  store.initStore()
  calendarStore.initStore()
  inventory.initStore()
}

function onAdvanceTime(days : number) {
  while (days > 0) {
    days--
    inventory.randomizeGoods()
    store.updateDebt()
    store.recoverHealth()
    calendarStore.advanceDate()
  }
  if (Math.random() < SETTINGS.eventChance) {
    randomEvent()
  }
}

function randomEvent() {
  // select random non-player good at currentLocation
  const locationGoods = inventory.getCurrentLocationGoods
  const randomIndex = randomNumberInRange(0, locationGoods.length)
  const randomGood = locationGoods[randomIndex]
  if (!randomGood) return
  const rng = Math.random()
  if (rng < 0.4) {
    inventory.priceSpike(randomGood.id)
    showAlert(`<span class="text-blue">${randomGood.goodType} has spiked in value!</span>`)
  } else if (rng < .8) {
    inventory.priceDrop(randomGood.id)
    showAlert(`<span class="text-blue">${randomGood.goodType} has dropped in value!</span>`)
  } else {
    emit('startEncounter')
  }
}

const clockAudio = new Audio(clockSFX)
clockAudio.volume = .2
const isWaiting = ref(false)
function waitDay() {
  if (isWaiting.value) return
  isWaiting.value = true
  clockAudio.play()
  setTimeout(() => {
    gameState.value = 'Default'
    onAdvanceTime(1)
    isWaiting.value = false
  }, 2100)
}

const moneyAudio = new Audio(moneySFX)
const yeahAudio = new Audio(yeahSFX)
moneyAudio.volume = 0.2
yeahAudio.volume = 0.5
function onBuyDone() {
  moneyAudio.play()
  gameState.value = 'Default'
}
function onSellDone() {
  moneyAudio.play()
  yeahAudio.play()
  gameState.value = 'Default'
}


const alertMessage = ref('')
function showAlert(msg: string) {
  alertMessage.value = msg
}

function onBuy(id: string) {
  activeGood.value = inventory.getGoodById(id)
  gameState.value = 'Buy'
}

function onSell(id: string) {
  activeGood.value = inventory.getGoodById(id)
  gameState.value = 'Sell'
}

</script>

<template>

  <HighScores
    v-if="gameState == 'HighScore'"
    @restart="restart"
   />

  <AlertModal
    v-if="alertMessage"
    :message="alertMessage"
    @closeAlert="alertMessage = ''"
  />

  <WinModal
    v-if="gameState == 'Win'"
    @restart="restart"
    @highScore="gameState = 'HighScore'"
  />

  <LoseModal
    v-if="gameState == 'Lose'"
    @restart="restart"
  />

  <ShopModal
    v-if="gameState == 'Shop'"
    @closeForm="gameState = 'Default'"
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
    v-if="(gameState == 'Buy' || gameState == 'Sell') && activeGood != null"
    :transaction-type="gameState"
    :good="activeGood"
    @closeForm="gameState = 'Default'"
    @buyDone="onBuyDone"
    @sellDone="onSellDone"
  />

  <div class="row top">
    <StatsBox />
    <LocationsBox @advanceTime="onAdvanceTime" />
  </div>

  <div class="row">
    <section>
      <h4 v-if="store.currentLocation">
        <span>
          Current Location: {{ store.currentLocation.name }}
        </span>
        <span>
          Space Available: {{ inventory.inventorySpace }} / {{ SETTINGS.inventorySpace }}
        </span>
      </h4>
      <table>
        <thead>
          <tr>
            <th class="xl"></th>
            <th>Price</th>
            <th>Paid</th>
            <th>Qty</th>
            <th class="xl"></th>
          </tr>
        </thead>
        <tbody>
          <InventoryItem
            v-if="store.currentLocation"
            v-for="(item, index) in inventory.getCurrentLocationGoods"
            :key="`item-${store.currentLocation.name}-${index}`"
            :good="item"
            @buy="onBuy"
            @sell="onSell"
          />
        </tbody>
      </table>
    </section>
  </div>

  <div class="actions">
    <button class="waitBtn" :disabled="isWaiting" @click.prevent="waitDay()">
        <span v-if="isWaiting">Waiting...</span>
        <span v-else>Wait a day</span>
    </button>
    <button @click.prevent="gameState = 'Loan'">Pay Loan</button>
    <button v-if="store.currentLocation.hasBank" @click.prevent="gameState = 'Bank'">Visit Bank</button>
    <button v-if="store.currentLocation.hasShop" @click.prevent="gameState = 'Shop'">Shop</button>
    <button @click.prevent="emit('endGame')">New Game</button>
  </div>

</template>


<style scoped>
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

.actions  {
  display: flex;
  margin: 5px;
  width: 100%;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: space-between;
}

@media screen and (min-width: 768px) {
  .actions {
    flex-wrap: nowrap;
    justify-content: flex-start;
  }
}

.actions button {
  flex-basis: 48%;
  margin: 5px 1%;
}

@media screen and (min-width: 768px) {
  .actions button {
    flex-basis: auto;
    margin-right: 10px;
  }

  .actions button:last-child {
    margin-left: auto !important;
    margin-right: 5px;
  }
}

.waitBtn span {
  display: inline-block;
  text-align: center;
}

h4 {
  display: flex;
  width: 100%;
  flex-flow: column;
}

@media screen and (min-width: 768px) {
  h4 {
    flex-flow: row;
  }

  h4 span:last-child {
    margin-left: auto;
  }
}

th {
  width: 16%;
}
th.xl {
  width: 25%;
}

</style>
