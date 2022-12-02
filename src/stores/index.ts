import { defineStore } from "pinia"
import { Location } from "../models/location.model"
import { CityName, Position } from "../types"
import SETTINGS from "../settings";

export type RootState = {
  cash: number,
  debt: number,
  bank: number,
  locations: Location[],
  currentLocationIndex: number,
  messages: string[],
};

export const useMainStore = defineStore({
  id: "mainStore",
  state: () => ({
      cash: SETTINGS.cash,
      debt: SETTINGS.debt,
      bank: 0,
      locations: [],
      currentLocationIndex: 0,
      messages: [],
  } as RootState),
  persist: true,
  actions: {
    initStore() {
      this.currentLocationIndex = 0
      this.cash = SETTINGS.cash
      this.debt = SETTINGS.debt
      this.bank = 0
      this.messages = []

      // locations
      this.locations = []
      Object.keys(SETTINGS.locations).forEach((loc) => {
        const l : unknown = SETTINGS.locations[loc as CityName]
        const location : Location = {
          name: loc as CityName,
          position: l as Position,
        }
        this.locations.push(location)
      })
    },

    travelTo(index: number) {
      if (index < 0 || index > this.locations.length ) return
      this.currentLocationIndex = index
    },

    spendCash(amount: number) {
      amount = Math.min(this.cash, amount)
      this.cash -= amount
    },

    receiveCash(amount: number) {
      amount = Math.max(0, amount)
      this.cash += amount
    },

    payDebt(payment: number) {
      payment = Math.min(this.debt, Math.max(0, Math.min(this.cash, payment)))
      this.debt -= payment
      this.cash -= payment
      this.logMessage(`Paid $${payment.toLocaleString()} on loan`)
    },

    updateDebt() {
      // apply interest
      this.debt += Math.floor(this.debt * SETTINGS.debt_apr)
    },

    deposit(amount: number) {
      amount = Math.max(0, Math.min(this.cash, amount))
      this.bank += amount
      this.cash -= amount
      this.logMessage(`Deposited $${amount.toLocaleString()} in bank`)
    },

    withdrawal(amount: number) {
      amount = Math.max(0, Math.min(this.bank, amount))
      this.bank -= amount
      this.cash += amount
      this.logMessage(`Withdrew $${amount.toLocaleString()} in bank`)
    },

    logMessage(message: string) {
      this.messages.push(message)
    }
  },

  getters: {
    currentLocation: state => {
      return state.locations[state.currentLocationIndex]
    }
  }

});