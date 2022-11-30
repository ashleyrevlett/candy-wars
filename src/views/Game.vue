<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import type { Ref } from 'vue'
import SETTINGS from '../settings'
import { GameState } from '../types';
import { TradeGood } from "../models/tradegood.model"
import { useMainStore } from "../stores/index"
import InventoryItem from '../components/InventoryItem.vue';
import StatsBox from '../components/StatsBox.vue';
import LocationsBox from '../components/LocationsBox.vue';
import OrderModal from '../components/OrderModal.vue';
// import LoanModal from '../components/LoanModal.vue'
// import BankModal from '../components/BankModal.vue'
// import WinModal from '../components/WinModal.vue'
// import LoseModal from '../components/LoseModal.vue'

/* store values */
const mainStore = useMainStore()
const maxInventory = computed(() => SETTINGS.inventorySpace )
const currentLocation = computed(() => mainStore.currentLocation)
const currentLocationGoods = computed(() =>  mainStore.getGoodsForLocation(currentLocation?.value.name))
const playerGoods = computed(() => mainStore.getPlayerGoods())

/* local data */
const gameState: Ref<GameState> = ref('Default')
const activeSpice: Ref<TradeGood | null> = ref(null)
const debt = ref(SETTINGS.debt)
const bank = ref(SETTINGS.bank)
const currentDay = ref(SETTINGS.startDate)
const daysSinceStart = computed(() => {
  const time_difference = currentDay.value.getTime() - SETTINGS.startDate.getTime();
  let days_difference = Math.ceil(time_difference / (1000 * 3600 * 24))
  days_difference = SETTINGS.startDate == currentDay.value ? 1 : days_difference + 2
  return days_difference
})

const messages: Ref<Array<string>> = ref([])
const messageBox = ref()
async function logMessage(message: string) {
  messages.value.push(message)
  await nextTick()
  const lastP = (messageBox.value as any).lastElementChild
  lastP?.scrollIntoView({behavior: "smooth", block: "end"})
}

function restart() {
  gameState.value = 'Default'
  activeSpice.value = null
  currentDay.value = SETTINGS.startDate
  bank.value = SETTINGS.bank
  debt.value = SETTINGS.debt
  messages.value = []
  mainStore.initStore()
  logMessage("New game started...")
}

function buy(sellerSpice: TradeGood, quantity : number) {
  mainStore.buy(sellerSpice.id,quantity)
  logMessage(`Bought ${quantity} ${sellerSpice.spiceType} in ${currentLocation.value.name}`)
  gameState.value = 'Default'
}

function sell(playerSpice: TradeGood, quantity : number) {
  mainStore.sell(playerSpice.id, quantity, currentLocation.value.name)
  logMessage(`Sold ${quantity} ${playerSpice.spiceType} in ${currentLocation.value.name}`)
  gameState.value = 'Default'
}

function onAdvanceTime(days : number) {
  while (days > 0) {
    nextDay()
    days--
  }
}

function nextDay() {
  // locations.value.forEach(location => {
  //   location.inventory.forEach(spice => {
  //     spice.update()
  //   })
  // })
  currentDay.value.setDate(currentDay.value.getDate() + 1)
  currentDay.value = new Date(currentDay.value) // have to create new date object for vue to detect changes
  debt.value += Math.floor(debt.value * SETTINGS.debt_apr)
  if (daysSinceStart.value > SETTINGS.maxDays && debt.value > 0) {
    gameState.value = 'Lose'
  } else {
    const rng = Math.random()
    if (rng < SETTINGS.event_chance) {
      // randomEvent()
    }
  }
}

// function payLoan(debtPayment : number) {
//   debtPayment = Math.min(debt.value, Math.min(debtPayment, player.value.cash))
//   debt.value -= debtPayment
//   player.value.cash -= debtPayment
//   logMessage(`Paid $${debtPayment.toLocaleString()} on loan`)
//   if (debt.value == 0) {
//     gameState.value = 'Win'
//     logMessage(`Loan paid off!`)
//   } else {
//     gameState.value = 'Default'
//   }
// }

// function makeDeposit(deposit : number) {
//   deposit = Math.min(deposit, player.value.cash)
//   bank.value += deposit
//   player.value.cash -= deposit
//   gameState.value = 'Default'
//   logMessage(`Deposited $${deposit.toLocaleString()} in bank`)
// }

// function makeWithdrawal(withdrawal: number) {
//   withdrawal = Math.min(withdrawal, bank.value)
//   bank.value -= withdrawal
//   player.value.cash += withdrawal
//   gameState.value = 'Default'
//   logMessage(`Withdrew $${withdrawal.toLocaleString()} from bank`)
// }

function randomNumberInRange(min:number, max:number) {
  return Math.floor(Math.random() * (max - min) + min)
}

// function randomEvent() {
//   const location = locations.value[randomNumberInRange(0, locations.value.length)]
//   const randomSpice = location.inventory[randomNumberInRange(0, location.inventory.length)]
//   const rng = Math.random()
//   if (rng < 0.4) {
//     logMessage(`<span class="text-blue">${randomSpice.spiceType} has spiked in value at ${location.name}!</span>`)
//     randomSpice.priceSpike()
//   } else if (rng < .8) {
//     logMessage(`<span class="text-blue">${randomSpice.spiceType} has dropped in value at ${location.name}!</span>`)
//     randomSpice.priceDrop()
//   } else {
//     const randomCashAmount = randomNumberInRange(player.value.cash * .4, player.value.cash * .8)
//     if (randomCashAmount > 0) {
//       player.value.loseCash(randomCashAmount)
//       logMessage(`<span class="text-red">You were robbed! You lost $${randomCashAmount.toLocaleString()}! Shoulda put it in the bank.</span>`)
//     }
//   }
// }

onMounted(() => {
  logMessage(`Started game...`)
  mainStore.initStore()
})
</script>

<template>
  <!-- <WinModal
    v-if="gameState == 'Win'"
    :totalDays="daysSinceStart"
    :endWorth="bank + player.cash"
    @restart="restart"
    @closeForm="gameState = 'Default'"
  /> -->

  <!-- <LoseModal
    v-if="gameState == 'Lose'"
    :totalDays="daysSinceStart"
    :endWorth="bank + player.cash - debt"
    :debtRemaining="debt"
    @restart="restart"
  /> -->

  <!-- <BankModal
    v-if="gameState == 'Bank'"
    :max-deposit="player.cash"
    :max-withdrawal="bank"
    @deposit="makeDeposit"
    @withdrawal="makeWithdrawal"
    @closeForm="gameState = 'Default'"
  /> -->

  <!-- <LoanModal
    v-if="gameState == 'Loan'"
    :debt="debt"
    :max-payment="Math.min(debt, player.cash)"
    @payLoan="payLoan"
    @closeForm="gameState = 'Default'"
  /> -->

  <OrderModal
    v-if="(gameState == 'Buy' || gameState == 'Sell') && activeSpice != null"
    :transaction-type="gameState"
    :spice="activeSpice"
    @buy="buy"
    @sell="sell"
    @closeForm="gameState='Default'"
  />

  <div class="top-row">
    <StatsBox
      :cash="mainStore.cash"
      :debt="debt"
      :bank="bank"
      :day="currentDay"
      :daysSinceStart="daysSinceStart"
    />
    <LocationsBox @advanceTime="onAdvanceTime" />
  </div>

  <div class="trade-box">
    <section>
      <h4 v-if="currentLocation">Current Location: {{ currentLocation.name }}</h4>
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
            v-if="currentLocation"
            v-for="(item, index) in currentLocationGoods"
            :key="`item-${currentLocation.name}-${index}`"
            :good="item"
            :disabled="mainStore.inventorySpace == 0 || mainStore.cash < item.price"
            transaction-type="Buy"
            @order="activeSpice=item; gameState='Buy'"
          />
        </tbody>
      </table>
    </section>
    <section>
      <h4>Player Inventory ({{ mainStore.inventorySpace }} / {{ maxInventory }} )</h4>
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
            v-for="(item, index) in playerGoods"
            :key="`item-${index}`"
            :good="item"
            transaction-type="Sell"
            @order="activeSpice=item; gameState = 'Sell'"
          />
        </tbody>
      </table>
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

h4 {
  margin: 10px 0 5px;
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
  font-size: 14px;
  line-height: 1.3;
}

.ml-auto {
  margin-left: auto
}

</style>
