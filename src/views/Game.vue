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
import TravelModal from '../components/TravelModal.vue';
import OrderModal from '../components/OrderModal.vue';
import LoanModal from '../components/LoanModal.vue'
import AlertModal from '../components/AlertModal.vue'
import BankModal from '../components/BankModal.vue'

import moneySFX from '../assets/audio/chaching.mp3'
import yeahSFX from '../assets/audio/403828__alshred__16-ohyeah.wav'
import clockSFX from '../assets/audio/ticktock.mp3'

const props = defineProps({
  continueGame: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'startEncounter'): void,
  (e: 'restartGame'): void,
  (e: 'lose'): void,
  (e: 'win'): void,
  (e: 'dayEnd'): void,
}>()

const { randomNumberInRange } = useUtils()

const store = useMainStore()
const calendarStore = useCalendarStore()
const inventory = useInventoryStore()

const gameState: Ref<GameState> = ref('Default')
const activeGood: Ref<TradeGood | undefined | null> = ref(null) // which good is currently being traded

onMounted(() => {
  if (!props.continueGame) {
    restart()
  }
})

onUpdated(() => {
  checkWinOrLose()
})

function checkWinOrLose() {
  if (calendarStore.daysSinceStart > SETTINGS.maxDays) {
    // time's up
    if (store.debt <= 0) {
      gameState.value = 'Win'
    } else {
      gameState.value = 'Lose'
    }
  } else if (store.cash == 0 && store.bank == 0 && inventory.inventorySpace == store.totalSpace && store.debt > 0) {
    // no money, no goods = stalemate
    gameState.value = 'Lose'
  }
  // if we set win or lose state, emit event to show gameover view
  if (gameState.value == 'Win') {
    emit('win')
  } else if (gameState.value == 'Lose') {
    emit('lose')
  }
}

function restart() {
  gameState.value = 'Default'
  activeGood.value = null
  store.initStore()
  calendarStore.initStore()
  inventory.initStore()
}

function doTurn() {
  if (calendarStore.currentHour + 1 < SETTINGS.schoolEndHour) {
    // this turn will be on the same day
    gameState.value = 'Default' // close any open modals
    inventory.randomizeGoods()
    store.recoverHealth()
    store.updateDebt()
    calendarStore.advanceTime()

    if (Math.random() < SETTINGS.eventChance) {
      randomEvent()
    }
  } else {
    if (SETTINGS.maxDays - calendarStore.daysSinceStart > 0) {
      // a new day should start
      inventory.resetLocationInventory()
      store.restoreHealth()
      store.updateDebt()
      calendarStore.advanceTime()
      emit('dayEnd')
    } else {
      // time's up
      calendarStore.advanceTime()
      checkWinOrLose()
    }
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
    doTurn()
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

  <TravelModal
    v-if="gameState == 'Travel'"
    @advanceTime="doTurn"
    @closeForm="gameState = 'Default'"
  />

  <AlertModal
    v-if="alertMessage"
    :message="alertMessage"
    @closeAlert="alertMessage = ''"
  />

  <BankModal
    v-if="gameState == 'Bank'"
    @closeForm="gameState = 'Default'"
  />

  <LoanModal
    v-if="gameState == 'Loan'"
    @closeForm="gameState = 'Default'"
    @changeState="(s) => gameState = s"
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
  </div>

  <div class="row">
    <section>
      <h4 v-if="store.currentLocation">
        <span>
          Current Location: {{ store.currentLocation.name }}
        </span>
        <span>
          {{ store.activeGear }}: {{ inventory.spaceUsed }} / {{ store.totalSpace }}
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

  <div class="actions" v-if="store.currentLocation">
    <button @click.prevent="gameState = 'Travel'">Travel</button>
    <button class="waitBtn" :disabled="isWaiting" @click.prevent="waitDay()">
        <span v-if="isWaiting">Waiting...</span>
        <span v-else>Wait</span>
    </button>
    <button v-if="store.debt > 0" @click.prevent="gameState = 'Loan'">Pay Loan</button>
    <button v-if="store.currentLocation.hasBank" @click.prevent="gameState = 'Bank'">Visit Locker</button>
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
  /* margin-bottom: 2rem; */
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
  background-color: transparent;
  border: 1px solid var(--success-color);
  color: var(--text-color);

  &:hover {
    background-color: var(--success-color);
    color: var(--bg-color);
  }
}

@media screen and (min-width: 768px) {
  .actions button {
    flex-basis: auto;
    margin-right: 10px;
    flex: 1;
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
