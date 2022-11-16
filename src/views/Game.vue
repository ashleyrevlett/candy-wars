<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import type { Ref } from 'vue'
import SETTINGS from '../settings'
import { SpiceType, GameState, CityName } from '../types';
import { Location } from '../models/Location'
import { Player } from '../models/Player'
import { Spice } from '../models/Spice';
import InventoryItem from '../components/InventoryItem.vue';
import StatsBox from '../components/StatsBox.vue';
import LocationsBox from '../components/LocationsBox.vue';
import OrderModal from '../components/OrderModal.vue';
import LoanModal from '../components/LoanModal.vue'
import BankModal from '../components/BankModal.vue'
import WinModal from '../components/WinModal.vue'
import LoseModal from '../components/LoseModal.vue'

const gameState: Ref<GameState> = ref('Default')
const activeSpice: Ref<Spice | null> = ref(null)
const currentDay = ref(SETTINGS.startDate)
const locations: Ref<Array<Location>> = ref(SETTINGS.locationOrder.map((name : CityName) => new Location(name)))
const currentLocationIndex : Ref<number> = ref(0)
const player: Ref<Player> = ref(new Player())
const debt = ref(SETTINGS.debt)
const bank = ref(SETTINGS.bank)
const messages: Ref<Array<string>> = ref([])

const currentLocation = computed(() => locations.value[currentLocationIndex.value] )

const minTransaction = computed(() => {
  if (activeSpice.value == null) return 0
  if (gameState.value == 'Buy') {
    return Math.min(player.value.inventorySpace, 1)
  } else if (gameState.value == 'Sell' && player.value.getQuantity(activeSpice.value.spiceType) > 0) {
    return 1
  }
  return 0
})

const maxTransaction = computed(() => {
  if (activeSpice.value == null) return 0
  if (gameState.value == 'Buy') {
    const budgetMax = Math.floor(player.value.cash / activeSpice.value.price)
    return Math.min(player.value.inventorySpace, budgetMax)
  } else {
    return player.value.getQuantity(activeSpice.value.spiceType)
  }
})

const daysSinceStart = computed(() => {
  const time_difference = currentDay.value.getTime() - SETTINGS.startDate.getTime();
  let days_difference = Math.ceil(time_difference / (1000 * 3600 * 24))
  days_difference = SETTINGS.startDate == currentDay.value ? 1 : days_difference + 2
  return days_difference
})

function restart() {
  gameState.value = 'Default'
  activeSpice.value = null
  currentLocationIndex.value = 0
  player.value = new Player()
  bank.value = SETTINGS.bank
  debt.value = SETTINGS.debt
  currentDay.value = SETTINGS.startDate
  messages.value = []
  locations.value = SETTINGS.locationOrder.map((name) => new Location(name))
  logMessage("New game started...")
}

function buy(spice: SpiceType, quantity : number) {
  const price = currentLocation.value.getPrice(spice)
  if (price * quantity > player.value.cash)
    return
  player.value.buy(spice, quantity, price)
  logMessage(`Bought ${quantity} ${spice} in ${currentLocation.value.name} for a total of $${(quantity * price).toLocaleString()}`)
  gameState.value = 'Default'
}

function sell(spice: SpiceType, quantity : number) {
  const price = currentLocation.value.getPrice(spice)
  const profit = (quantity * price) - (player.value.getPrice(spice) * quantity)
  const msg = profit >= 0 ? `<span class="text-green">Profit: $${profit.toLocaleString()}</span>` : `<span class="text-red">Loss: $${Math.abs(profit).toLocaleString()}</span>`
  player.value.sell(spice, quantity, price)
  logMessage(`Sold ${quantity} ${spice} in ${currentLocation.value.name} for a total of $${(quantity * price).toLocaleString()}. ${msg}`)
  gameState.value = 'Default'
}

function travelTo(index : number) {
  const newLocation = locations.value[index]
  currentLocationIndex.value = index
  logMessage(`Traveled to ${newLocation.name}`)
  nextDay()
}

function nextDay() {
  locations.value.forEach(location => {
    location.inventory.forEach(spice => {
      spice.simulateTrade()
    })
  })
  currentDay.value.setDate(currentDay.value.getDate() + 1)
  currentDay.value = new Date(currentDay.value) // have to create new date object for vue to detect changes
  debt.value += Math.floor(debt.value * SETTINGS.debt_apr)
  if (daysSinceStart.value > SETTINGS.maxDays && debt.value > 0) {
    gameState.value = 'Lose'
  }
}

function payLoan(debtPayment : number) {
  debtPayment = Math.min(debt.value, Math.min(debtPayment, player.value.cash))
  debt.value -= debtPayment
  player.value.cash -= debtPayment
  logMessage(`Paid $${debtPayment.toLocaleString()} on loan`)
  if (debt.value == 0) {
    gameState.value = 'Win'
    logMessage(`Loan paid off!`)
  } else {
    gameState.value = 'Default'
  }
}

function makeDeposit(deposit : number) {
  deposit = Math.min(deposit, player.value.cash)
  bank.value += deposit
  player.value.cash -= deposit
  gameState.value = 'Default'
  logMessage(`Deposited $${deposit.toLocaleString()} in bank`)
}

function makeWithdrawal(withdrawal: number) {
  withdrawal = Math.min(withdrawal, bank.value)
  bank.value -= withdrawal
  player.value.cash += withdrawal
  gameState.value = 'Default'
  logMessage(`Withdrew $${withdrawal.toLocaleString()} from bank`)
}

const messageBox = ref()
async function logMessage(message: string) {
  messages.value.push(message)
  await nextTick()
  const lastP = (messageBox.value as any).lastElementChild
  lastP?.scrollIntoView({behavior: "smooth", block: "end"})
}

onMounted(() => {
  logMessage(`Started game...`)
})
</script>

<template>

  <WinModal
    v-if="gameState == 'Win'"
    :totalDays="daysSinceStart"
    :endWorth="bank + player.cash"
    @restart="restart"
    @closeForm="gameState = 'Default'"
  />

  <LoseModal
    v-if="gameState == 'Lose'"
    :totalDays="daysSinceStart"
    :endWorth="bank + player.cash - debt"
    :debtRemaining="debt"
    @restart="restart"
  />

  <BankModal
    v-if="gameState == 'Bank'"
    :max-deposit="player.cash"
    :max-withdrawal="bank"
    @deposit="makeDeposit"
    @withdrawal="makeWithdrawal"
    @closeForm="gameState = 'Default'"
  />

  <LoanModal
    v-if="gameState == 'Loan'"
    :debt="debt"
    :max-payment="Math.min(debt, player.cash)"
    @payLoan="payLoan"
    @closeForm="gameState = 'Default'"
  />

  <OrderModal
    v-if="(gameState == 'Buy' || gameState == 'Sell') && activeSpice != null"
    :transaction-type="gameState"
    :spice="activeSpice"
    :price="currentLocation.getPrice(activeSpice.spiceType)"
    :allowed-range="{ min: minTransaction, max: maxTransaction  }"
    @buy="buy"
    @sell="sell"
    @closeForm="gameState='Default'"
  />

  <div class="top-row">
    <StatsBox
      :cash="player.cash"
      :debt="debt"
      :bank="bank"
      :day="currentDay"
      :daysSinceStart="daysSinceStart"
    />
    <LocationsBox
      :locations="locations"
      :currentLocation="locations[currentLocationIndex]"
      @travelTo="travelTo" />
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
            :disabled="player.inventorySpace == 0 || player.cash < item.price"
            transaction-type="Buy"
            @order="activeSpice=item; gameState='Buy'"
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
            @order="activeSpice=item; gameState = 'Sell'"
          />
        </tbody>
      </table>
      <p v-if="player.inventory.length == 0">Empty</p>
    </section>
  </div>

  <div ref="messageBox" class="messageBox">
    <p v-for="msg in messages" v-html="msg"></p>
  </div>

  <div class="actions">
    <button @click.prevent="logMessage('Waited a day'); gameState='Default'; nextDay(); ">Wait a day</button>
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

.actions  {
  display: flex;
}

.actions button {
  margin-right: 10px;
}

.messageBox {
  border: 1px solid white;
  height: 50px;
  margin-bottom: 10px;
  padding: 10px;
  overflow-y:scroll;
  padding-bottom: 5px;
}

.messageBox p {
  margin: 0;
  font-size: 13px;
  line-height: 1.2;
}

.ml-auto {
  margin-left: auto
}

</style>
