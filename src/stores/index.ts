import { TradeGood, generateStartingData, calculatePrice, getUpdatedQuantity } from "../models/tradegood.model"
import { Location } from "../models/location.model"
import { defineStore } from "pinia"
import { CityName, GameState, Position } from "../types"
import SETTINGS from "../settings";

export type RootState = {
  tradeGoods: TradeGood[],
  cash: number,
  locations: Location[],
  currentLocationIndex: number,
  messages: string[],
};

export const useMainStore = defineStore({
  id: "mainStore",
  state: () => ({
      tradeGoods: [],
      cash: SETTINGS.cash,
      locations: [],
      currentLocationIndex: 0,
      messages: [],
  } as RootState),
  persist: true,
  actions: {
    initStore() {
      this.currentLocationIndex = 0
      this.cash = SETTINGS.cash
      this.messages = []

      // location goods
      this.tradeGoods = []
      Object.keys(SETTINGS.locations).forEach((city, i) => {
        SETTINGS.spiceOrder.forEach((s, j) => {
          const id = i.toString() + '-' + j.toString()
          this.tradeGoods.push(generateStartingData(id, s, city as CityName))
        })
      })

      // player goods
      SETTINGS.spiceOrder.forEach((s, i) => {
        const id = 'player-' + i.toString()
        const good : TradeGood = {
          id: id,
          price: 0,
          quantity: 0,
          spiceType: s,
        }
        this.tradeGoods.push(good)
      })

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

    buy(id: string, quantity: number) {
      const locationGoodIndex = this.findIndexById(id)
      if (locationGoodIndex == -1) return
      const locationGood = this.tradeGoods[locationGoodIndex]

      const playerGoodIndex = this.tradeGoods.findIndex((item) => item.spiceType === locationGood.spiceType && item.location == null)
      if (playerGoodIndex == -1) return
      const playerGood = this.tradeGoods[playerGoodIndex]

      playerGood.quantity += quantity
      playerGood.price = locationGood.price
      locationGood.quantity -= quantity
      this.cash -= (locationGood.price * quantity)
    },

    sell(id: string, quantity: number, location: CityName) {
      const playerGoodIndex = this.findIndexById(id)
      if (playerGoodIndex == -1) return
      const playerGood = this.tradeGoods[playerGoodIndex]

      const locationGoodIndex = this.tradeGoods.findIndex((item) => item.spiceType === playerGood.spiceType && item.location == location);
      if (locationGoodIndex == -1) return
      const locationGood = this.tradeGoods[locationGoodIndex]

      playerGood.quantity -= quantity
      if (playerGood.quantity == 0) playerGood.price = 0
      locationGood.quantity += quantity
      this.cash += locationGood.price * quantity
    },

    findIndexById(id: string) {
      return this.tradeGoods.findIndex((item) => item.id === id);
    },

    spendCash(amount: number) {
      this.cash -= amount
    },

    randomizeGoods() {
      // calculatePrice
      this.tradeGoods.forEach(good => {
        if (!good.location) return // ignore player goods
        good.quantity = getUpdatedQuantity(good.spiceType, good.quantity)
        good.price = calculatePrice(good.spiceType, good.quantity)
      });
    },

    priceSpike(idx: number) {
      const priceRange = SETTINGS.priceRanges[this.tradeGoods[idx].spiceType]
      this.tradeGoods[idx].price = priceRange.max + Math.ceil(priceRange.max * .25)
    },

    priceDrop(idx: number) {
      const priceRange = SETTINGS.priceRanges[this.tradeGoods[idx].spiceType]
      this.tradeGoods[idx].price = priceRange.min - Math.ceil(priceRange.min * .15)
    },

    logMessage(message: string) {
      this.messages.push(message)
    }

  },
  getters: {
    getCurrentLocationGoods: state => {
      const loc = state.locations[state.currentLocationIndex]
      if (loc)
        return state.tradeGoods.filter(good => good.location == loc.name)
      else
        return []
    },
    getPlayerGoods: state => () => state.tradeGoods.filter(good => good.location == null),
    maxBuyQuantity: state => (spiceId : string | null) => {
      if (spiceId === null) return 0
      const idx = state.tradeGoods.findIndex((item) => item.id === spiceId)
      if (idx === -1) return 0
      const price = state.tradeGoods[idx].price
      return Math.floor(state.cash / price)
    },
    maxSellQuantity: state => (spiceId : string | null) => {
      if (spiceId === null) return 0
      const idx = state.tradeGoods.findIndex((item) => item.id === spiceId)
      if (idx === -1) return 0
      return state.tradeGoods[idx].quantity
    },
    inventorySpace: state => {
      const goods = state.tradeGoods.filter(good => good.location == null)
      if (!goods || goods.length == 0) return 0
      const qtys = goods.map((g: TradeGood) => g.quantity)
      const sum = qtys.reduce((partialSum: number, a: number) => partialSum + a, 0);
      return SETTINGS.inventorySpace - sum
    },
    currentLocation: state => {
      return state.locations[state.currentLocationIndex]
    },
    getTransactionPrice: state => (gameState : GameState, spice: TradeGood) => {
      if (gameState == 'Buy') {
        return spice.price
      } else if (gameState == 'Sell') {
        // find current going price for this spice at current location
        const loc = state.locations[state.currentLocationIndex]
        const locSpice = state.tradeGoods.find(good => good.location == loc.name && good.spiceType == spice.spiceType)
        if (locSpice) return locSpice.price
      }
      return 0
    }
  },
});