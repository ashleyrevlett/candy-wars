import { defineStore } from "pinia"
import { Location } from "../models/location.model"
import { CityName, WeaponType, GearType } from "../types"
import SETTINGS from "../settings";

export type RootState = {
  cash: number,
  debt: number,
  bank: number,
  locations: Location[],
  currentLocationIndex: number,
  health: number,
  activeWeapon: WeaponType,
  weapons: WeaponType[],
  activeGear: GearType,
  gear: GearType[],
};

export const useMainStore = defineStore({
  id: "mainStore",
  state: () => ({
      cash: SETTINGS.cash,
      debt: SETTINGS.debt,
      bank: 0,
      locations: [],
      currentLocationIndex: 0,
      health: SETTINGS.startingHealth,
      activeWeapon: 'Fists',
      weapons: [],
      activeGear: 'Pockets',
      gear: [],
  } as RootState),
  persist: true,
  actions: {
    initStore() {
      this.currentLocationIndex = 0
      this.cash = SETTINGS.cash
      this.debt = SETTINGS.debt
      this.bank = 0
      this.health = SETTINGS.startingHealth
      this.weapons = ['Fists']
      this.activeWeapon = this.weapons[0]
      this.gear = ['Pockets']
      this.activeGear = this.gear[0]

      // locations
      this.locations = []
      Object.keys(SETTINGS.locations).forEach((loc) => {
        const l : any = SETTINGS.locations[loc as CityName]
        const location : Location = {
          name: loc as CityName,
          hasBank: l.hasBank as boolean,
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
    },

    updateDebt() {
      // apply interest
      this.debt += Math.floor(this.debt * SETTINGS.debtAPR)
    },

    deposit(amount: number) {
      amount = Math.max(0, Math.min(this.cash, amount))
      this.bank += amount
      this.cash -= amount
    },

    withdrawal(amount: number) {
      amount = Math.max(0, Math.min(this.bank, amount))
      this.bank -= amount
      this.cash += amount
    },

    takeDamage(amount: number) {
      this.health = Math.max(0, this.health - amount)
    },

    recoverHealth() {
      this.health = Math.min(SETTINGS.startingHealth, this.health + 1)
    },

    restoreHealth() {
      this.health = SETTINGS.startingHealth
    },

    changeWeapon(weapon: WeaponType) {
      this.activeWeapon = weapon
    },

    purchaseWeapon(weapon: WeaponType) {
      const price = SETTINGS.weapons.find(w => w.weaponType == weapon)?.price
      if (!price) return
      if (!this.weapons.includes(weapon) && this.cash >= price) {
        this.spendCash(price)
        this.weapons.push(weapon)
        this.activeWeapon = weapon
      }
    },

    sellWeapon(weapon: WeaponType) {
      const price = SETTINGS.weapons.find(w => w.weaponType == weapon)?.price
      if (!price || !this.weapons.includes(weapon)) return
      this.receiveCash(price)
      this.weapons = this.weapons.filter((w) => w != weapon)
      this.activeWeapon = this.weapons[this.weapons.length - 1]
    },

    purchaseGear(g: GearType) {
      const price = SETTINGS.gear.find(x => x.gearType == g)?.price
      if (!price) return
      if (!this.gear.includes(g) && this.cash >= price) {
        this.spendCash(price)
        this.gear.push(g)
        this.activeGear = g
      }
    },

    sellGear(g: GearType) {
      const price = SETTINGS.gear.find(x => x.gearType == g)?.price
      if (!price || !this.gear.includes(g)) return
      this.receiveCash(price)
      this.gear = this.gear.filter((x) => x != g)
      this.activeGear = this.gear[this.gear.length - 1]
    }
  },

  getters: {
    currentLocation: state => {
      return state.locations[state.currentLocationIndex]
    },

    totalSpace: state => {
      return SETTINGS.gear.find((e) => e.gearType == state.activeGear )?.space
    },

    getLocationIndex: state => {
      return (name: string) => state.locations.findIndex((l) => l.name == name )
    }

  }

});