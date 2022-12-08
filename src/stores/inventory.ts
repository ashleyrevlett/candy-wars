import { defineStore } from "pinia"
import { TradeGood, generateStartingData, calculatePrice, getUpdatedQuantity } from "../models/tradegood.model"
import { CityName, GameState, GoodType } from "../types"
import SETTINGS from "../settings";
import { useMainStore } from "./index";

export type InventoryState = {
  tradeGoods: TradeGood[],
};

export const useInventoryStore = defineStore({
  id: "inventoryStore",
  state: () => ({
      tradeGoods: [],
  } as InventoryState),
  persist: true,
  actions: {
    initStore() {
      // location goods
      this.tradeGoods = []
      Object.keys(SETTINGS.locations).forEach((city, i) => {
        SETTINGS.goodOrder.forEach((s, j) => {
          const id = i.toString() + '-' + j.toString()
          this.tradeGoods.push(generateStartingData(id, s, city as CityName))
        })
      })

      // player goods
      SETTINGS.goodOrder.forEach((s, i) => {
        const id = 'player-' + i.toString()
        const good : TradeGood = {
          id: id,
          price: 0,
          quantity: 0,
          goodType: s,
        }
        this.tradeGoods.push(good)
      })
    },

    getAvgPricePaid(good: TradeGood, newQuantity : number, newPrice : number) {
      if (good.quantity == 0) return newPrice
      const priceList = Array(good.quantity).fill(good.price)
      const newList = Array(newQuantity).fill(newPrice)
      const allPrices = priceList.concat(newList)
      const total = allPrices.reduce((acc, c) => acc + c, 0)
      return Math.ceil(total / allPrices.length)
    },

    buy(id: string, quantity: number) {
      const locationGoodIndex = this.findIndexById(id)
      if (locationGoodIndex == -1) return
      const locationGood = this.tradeGoods[locationGoodIndex]

      const playerGoodIndex = this.tradeGoods.findIndex((item) => item.goodType === locationGood.goodType && item.location == null)
      if (playerGoodIndex == -1) return
      const playerGood = this.tradeGoods[playerGoodIndex]

      playerGood.price = this.getAvgPricePaid(playerGood, quantity, locationGood.price)
      playerGood.quantity += quantity
      locationGood.quantity -= quantity

      const store = useMainStore()
      store.spendCash(locationGood.price * quantity)
    },

    sell(id: string, quantity: number) {
      const store = useMainStore()
      const location = store.currentLocation

      const playerGoodIndex = this.findIndexById(id)
      if (playerGoodIndex == -1) return
      const playerGood = this.tradeGoods[playerGoodIndex]

      const locationGoodIndex = this.tradeGoods.findIndex((item) => item.goodType === playerGood.goodType && item.location == location.name);
      if (locationGoodIndex == -1) return
      const locationGood = this.tradeGoods[locationGoodIndex]

      playerGood.quantity -= quantity
      if (playerGood.quantity == 0) playerGood.price = 0
      locationGood.quantity += quantity

      store.receiveCash(locationGood.price * quantity)
    },

    findIndexById(id: string) {
      return this.tradeGoods.findIndex((item) => item.id === id);
    },

    randomizeGoods() {
      // calculatePrice
      this.tradeGoods.forEach(good => {
        if (!good.location) return // ignore player goods
        good.quantity = getUpdatedQuantity(good.goodType, good.quantity)
        good.price = calculatePrice(good.goodType, good.quantity)
      });
    },

    priceSpike(id: string) {
      const goodIndex = this.tradeGoods.findIndex((item) => item.id === id)
      if (goodIndex == -1) return
      const priceRange = SETTINGS.priceRanges[this.tradeGoods[goodIndex].goodType]
      this.tradeGoods[goodIndex].price = priceRange.max + Math.ceil(priceRange.max * .25)
    },

    priceDrop(id: string) {
      const goodIndex = this.tradeGoods.findIndex((item) => item.id === id)
      if (goodIndex == -1) return
      const priceRange = SETTINGS.priceRanges[this.tradeGoods[goodIndex].goodType]
      this.tradeGoods[goodIndex].price = priceRange.min - Math.ceil(priceRange.min * .15)
    },

  },
  getters: {
    getGoodById: state => (id: string) => {
      return state.tradeGoods.find((item) => item.id === id)
    },
    getGoodByIndex: state => (index: number) => {
      if (index > 0 && index <= state.tradeGoods.length) {
        return state.tradeGoods[index]
      }
      return null
    },
    getPlayerGoodByName: state => (goodType: GoodType ) => {
      return state.tradeGoods.find((item) => item.goodType === goodType && item.location == null)
    },
    getCurrentLocationGoods: state => {
      const store = useMainStore()

      const loc = store.currentLocation
      if (loc)
        return state.tradeGoods.filter(good => good.location == loc.name)
      else
        return []
    },
    getPlayerGoods: state => () => state.tradeGoods.filter(good => good.location == null),
    maxBuyQuantity: state => (goodId : string | null) => {
      const store = useMainStore()

      if (goodId === null) return 0
      const idx = state.tradeGoods.findIndex((item) => item.id === goodId)
      if (idx === -1) return 0
      const price = state.tradeGoods[idx].price
      return Math.floor(store.cash / price)
    },
    maxSellQuantity: state => (goodId : string | null) => {
      if (goodId === null) return 0
      const idx = state.tradeGoods.findIndex((item) => item.id === goodId)
      if (idx === -1) return 0
      return state.tradeGoods[idx].quantity
    },
    inventorySpace: state => {
      const goods = state.tradeGoods.filter(good => good.location == null)
      if (!goods || goods.length == 0) return 0 // should never happen
      const qtys = goods.map((g: TradeGood) => g.quantity)
      const sum = qtys.reduce((partialSum: number, a: number) => partialSum + a, 0);
      return SETTINGS.inventorySpace - sum
    },
    transactionPrice: state => (gameState : GameState, good: TradeGood) => {
      if (gameState == 'Buy') {
        return good.price
      } else if (gameState == 'Sell') {
        // find current going price for this good at current location
        const store = useMainStore()
        const loc = store.currentLocation
        const locGood = state.tradeGoods.find(good => good.location == loc.name && good.goodType == good.goodType)
        if (locGood) return locGood.price
      }
      return 0
    },
  },
});