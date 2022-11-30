import { TradeGood } from "../models/tradegood.model"
import { Location } from "../models/location.model"
import { defineStore } from "pinia"
import { CityName, SpiceType } from "../types"
import SETTINGS from "../settings";

export type RootState = {
  tradeGoods: TradeGood[],
  cash: number,
  locations: Location[],
  currentLocationIndex: number,
};

export const useMainStore = defineStore({
  id: "mainStore",
  state: () =>
    ({
      tradeGoods: [],
      cash: SETTINGS.cash,
      locations: [],
      currentLocationIndex: 0
    } as RootState),

  actions: {
    travelTo(index: number) {
      if (index < 0 || index > this.locations.length ) return
      this.currentLocationIndex = index
    },

    createNewItem(item: TradeGood) {
      if (!item) return

      this.tradeGoods.push(item)
    },

    createLocation(loc: Location) {
      if (!loc) return
      this.locations.push(loc)
    },

    buy(id: string, quantity: number) {
      const locationGoodIndex = this.findIndexById(id)
      if (locationGoodIndex == -1) return
      const locationGood = this.tradeGoods[locationGoodIndex]

      const playerGoodIndex = this.findPlayerGoodIndexByName(locationGood.spiceType)
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

      const locationGoodIndex = this.findLocationGoodIndexByName(playerGood.spiceType, location)
      if (locationGoodIndex == -1) return
      const locationGood = this.tradeGoods[locationGoodIndex]

      playerGood.quantity -= quantity
      if (playerGood.quantity == 0) playerGood.price = 0
      locationGood.quantity += quantity
      this.cash += locationGood.price * quantity
    },

    findPlayerGoodIndexByName(spiceType: SpiceType) {
      return this.tradeGoods.findIndex((item) => item.spiceType === spiceType && item.location == null);
    },
    findLocationGoodIndexByName(spiceType: SpiceType, location: CityName) {
      return this.tradeGoods.findIndex((item) => item.spiceType === spiceType && item.location == location);
    },
    findIndexById(id: string) {
      return this.tradeGoods.findIndex((item) => item.id === id);
    },
  },
  getters: {
    getGoodsForLocation: state => (cityName : CityName)  => state.tradeGoods.filter(good => good.location == cityName),
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
    }
  },
});