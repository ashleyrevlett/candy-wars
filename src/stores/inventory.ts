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
      this.resetLocationInventory()

      // init player goods
      Object.keys(SETTINGS.goods).forEach((good, i) => {
        const id = 'player-' + i.toString()
        const g : TradeGood = {
          id: id,
          price: 0,
          quantity: 0,
          goodType: good as GoodType,
        }
        this.tradeGoods.push(g)
      })
    },

    resetLocationInventory() {
      // clear all non-player goods
      this.tradeGoods = this.tradeGoods.filter(g => g.location == null)
      // re-init location goods
      Object.keys(SETTINGS.locations).forEach((city, i) => {
        Object.keys(SETTINGS.goods).forEach((good, j) => {
          const id = i.toString() + '-' + j.toString()
          const g = generateStartingData(id, good as GoodType, city as CityName)
          const rng = Math.random()
          // 12% chance this good doesn't exist at this location
          if (rng <= .12) {
            g.price = 0
            g.quantity = 0
          }
          this.tradeGoods.push(g)
        })
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
        if (!good.location || good.price == 0) return // ignore player goods and empty goods
        good.quantity = getUpdatedQuantity(good.goodType, good.quantity)
        good.price = calculatePrice(good.goodType, good.quantity)
      });
    },

    priceSpike(id: string) {
      const goodIndex = this.tradeGoods.findIndex((item) => item.id === id)
      if (goodIndex == -1) return
      const priceRange = SETTINGS.goods[this.tradeGoods[goodIndex].goodType].priceRange
      const p = (priceRange.max + (priceRange.max * .25)).toFixed(2)
      this.tradeGoods[goodIndex].price = Number(p)
    },

    priceDrop(id: string) {
      const goodIndex = this.tradeGoods.findIndex((item) => item.id === id)
      if (goodIndex == -1) return
      const priceRange = SETTINGS.goods[this.tradeGoods[goodIndex].goodType].priceRange
      const p = (priceRange.min - (priceRange.min * .15)).toFixed(2)
      this.tradeGoods[goodIndex].price = Number(p)
    },

    clearPlayerInventory() {
      this.tradeGoods.forEach(g => {
        if (!g.location) {
          g.price = 0
          g.quantity = 0
        }
      });
    }

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
    spaceUsed: (state) => {
      const goods = state.tradeGoods.filter(good => good.location == null)
      if (!goods || goods.length == 0) return 0 // should never happen
      const qtys = goods.map((g: TradeGood) => g.quantity)
      const sum = qtys.reduce((partialSum: number, a: number) => partialSum + a, 0)
      return sum ? sum : 0
    },
    inventorySpace () {
      // remaining inventory space
      const store = useMainStore()
      const maxSpace = store.totalSpace ? store.totalSpace : 0
      const used : number = this.spaceUsed
      return maxSpace - used
    },
    transactionPrice: state => (gameState : GameState, good: TradeGood) => {
      if (gameState == 'Buy') {
        return good.price
      } else if (gameState == 'Sell') {
        // find current going price for this good at current location
        const store = useMainStore()
        const loc = store.currentLocation
        const locGood = state.tradeGoods.find(g => g.location == loc.name && g.goodType == good.goodType)
        if (locGood) return locGood.price
      }
      return 0
    },
  },
});