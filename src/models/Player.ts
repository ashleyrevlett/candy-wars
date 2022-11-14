import { SpiceType } from '../types'
import { PlayerSpice } from './PlayerSpice'

export class Player {
  name : string
  cash : number
  inventory : Array<PlayerSpice> = []

  constructor(name: string, cash: number){
    this.name = name
    this.cash = cash
  }

  getQuantity(spiceName : SpiceType) {
    const spice = this.inventory.find(spice => spice.spiceType == spiceName)
    return spice ? spice.quantity : 0
  }

  sell (spiceName : SpiceType, quantity : number, price : number) {
    const mySpice = this.inventory.find(spice => spice.spiceType == spiceName)
    if (!mySpice || quantity > mySpice.quantity)
      return
    mySpice.quantity -= quantity
    this.cash += quantity * price
  }

  buy (spiceName : SpiceType, quantity : number, price : number) {
    let mySpice = this.inventory.find(spice => spice.spiceType == spiceName)
    if (!mySpice) {
      mySpice = new PlayerSpice(spiceName, quantity, price)
      this.inventory.push(mySpice)
    } else {
      mySpice.quantity += quantity
      mySpice.price = price
    }
    this.cash -= quantity * price
  }
}
