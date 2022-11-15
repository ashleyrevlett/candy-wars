<script lang="ts">
import { defineComponent, nextTick} from 'vue'

import { TransactionType, SpiceType } from '../types';
import { Location } from '../models/Location'
import { Player } from '../models/Player'
import { Spice } from '../models/Spice';

import InventoryItem from '../components/InventoryItem.vue';
import StatsBox from '../components/StatsBox.vue';
import LocationsBox from '../components/LocationsBox.vue';
import OrderForm from '../components/OrderForm.vue';
import LoanForm from '../components/LoanForm.vue'
import BankForm from '../components/BankForm.vue'

export default defineComponent({
  components: {
    InventoryItem,
    StatsBox,
    LocationsBox,
    OrderForm,
    LoanForm,
    BankForm,
  },
  data() : {
    showBankForm: boolean
    showLoanForm: boolean
    activeSpice:  undefined | Spice,
    activeTransaction: undefined | TransactionType,
    currentDay : Date,
    locations: Array<Location>,
    currentLocationIndex: number,
    player: Player,
    debt: number,
    bank: number,
    messages: Array<string>,
  } {
    return {
      showBankForm: false,
      showLoanForm: false,
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
      debt: 5000,
      bank: 0,
      messages: []
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
      this.logMessage(`Bought ${quantity} ${spice} in ${this.currentLocation.name} for a total of $${(quantity * price).toLocaleString()}`)
      this.activeSpice = undefined;
      this.activeTransaction = undefined;
    },

    sell(spice: SpiceType, quantity : number) {
      const price = this.currentLocation.getPrice(spice)
      const profit = (quantity * price) - (this.player.getPrice(spice) * quantity)
      const msg = profit >= 0 ? `<span class="text-green">Profit: $${profit.toLocaleString()}</span>` : `<span class="text-red">Loss: $${Math.abs(profit).toLocaleString()}</span>`
      this.player.sell(spice, quantity, price)
      this.logMessage(`Sold ${quantity} ${spice} in ${this.currentLocation.name} for a total of $${(quantity * price).toLocaleString()}. ${msg}`)
      this.activeSpice = undefined;
      this.activeTransaction = undefined;
    },

    travelTo(index : number) {
      const currentLocation = this.locations[this.currentLocationIndex]
      const newLocation = this.locations[index]
      this.currentLocationIndex = index
      this.logMessage(`Traveled to ${newLocation.name}`)
      this.nextDay()
    },

    nextDay() {
      this.locations.forEach(location => {
        location.inventory.forEach(spice => {
          spice.simulateTrade()
        });
      });
      this.currentDay.setDate(this.currentDay.getDate() + 1)
      this.currentDay = new Date(this.currentDay) // have to create new date object for vue to detect changes
      this.debt += Math.floor(this.debt * 0.0005)
    },

    payLoan(debtPayment : number) {
      debtPayment = Math.min(this.debt, Math.min(debtPayment, this.player.cash))
      this.debt -= debtPayment
      this.player.cash -= debtPayment
      this.showLoanForm = false
      this.logMessage(`Paid $${debtPayment.toLocaleString()} on loan`)
      if (this.debt == 0)
        this.logMessage(`Loan paid off!`)
    },

    makeDeposit(deposit : number) {
      deposit = Math.min(deposit, this.player.cash)
      this.bank += deposit
      this.player.cash -= deposit
      this.showBankForm = false
      this.logMessage(`Deposited $${deposit.toLocaleString()} in bank`)
    },

    makeWithdrawal(withdrawal: number) {
      withdrawal = Math.min(withdrawal, this.bank)
      this.bank -= withdrawal
      this.player.cash += withdrawal
      this.showBankForm = false
      this.logMessage(`Withdrew $${withdrawal.toLocaleString()} from bank`)
    },

    async logMessage(message: string) {
      this.messages.push(message)
      await nextTick()
      const lastP = (this.$refs.messageBox as any).lastElementChild
      lastP?.scrollIntoView({behavior: "smooth", block: "end"});
    }

  },
  mounted() {
    this.logMessage(`Started game...`)
  },
})


</script>

<template>

  <BankForm
    v-if="showBankForm"
    :max-deposit="player.cash"
    :max-withdrawal="bank"
    @deposit="makeDeposit"
    @withdrawal="makeWithdrawal"
    @closeForm="showBankForm = false"
  />

  <LoanForm
    v-if="showLoanForm"
    :debt="debt"
    :max-payment="Math.min(debt, player.cash)"
    @payLoan="payLoan"
    @closeForm="showLoanForm = false"
  />

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
    <StatsBox :cash="player.cash" :debt="debt" :bank="bank" :day="currentDay" />
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

  <div ref="messageBox" class="messageBox">
    <p v-for="msg in messages" v-html="msg"></p>
  </div>

  <div class="actions">
    <button @click.prevent="nextDay(); showLoanForm=false; showBankForm=false; activeSpice = undefined">Wait a day</button>
    <button @click.prevent="showLoanForm=true; showBankForm=false; activeSpice = undefined">Pay Loan</button>
    <button @click.prevent="showBankForm=true; showLoanForm=false; activeSpice = undefined ">Visit Bank</button>
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

</style>
