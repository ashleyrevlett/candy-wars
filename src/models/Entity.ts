import { Spice } from './Spice';
import { SpiceType } from '../types'

export abstract class Entity {
  name : string
  cash : number
  inventory : Array<Spice> = []

  constructor(name: string, cash: number){
    this.name = name
    this.cash = cash
    this.inventory = this.initInventory()
  }

  abstract initInventory() : Array<Spice>

  getPrice(spiceName : SpiceType) {
    const spice = this.inventory.find(spice => spice.name == spiceName)
    return spice ? spice.price : 0
  }

  getQuantity(spiceName : SpiceType) {
    const spice = this.inventory.find(spice => spice.name == spiceName)
    return spice ? spice.quantity : 0
  }

  sell (spiceName : SpiceType, quantity : number, price : number) {
    const mySpice = this.inventory.find(spice => spice.name == spiceName)
    if (!mySpice || quantity > mySpice.quantity) return 0
    mySpice.quantity -= quantity
    this.cash += quantity * price
  }

  buy (spiceName : SpiceType, quantity : number, price : number) {
    let mySpice = this.inventory.find(spice => spice.name == spiceName)
    if (!mySpice) {
      mySpice = new Spice(spiceName, price, quantity)
      this.inventory.push(mySpice)
    } else {
      mySpice.quantity += quantity
      mySpice.price = price
    }
    this.cash -= quantity * price
  }

  describe() {
    console.log(`\n#### ${this.name}: $${this.cash.toLocaleString()}`)
    if (this.inventory.length == 0 ) console.log("Empty Inventory")
    this.inventory.forEach(spice => spice.describe())
  }
}