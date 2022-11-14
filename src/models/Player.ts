import { SpiceType, SPICE_ORDER } from '../types'
import { PlayerSpice } from './PlayerSpice'

export class Player {
  name : string
  cash : number
  inventory : Array<PlayerSpice> = []

  constructor(name: string, cash: number){
    this.name = name
    this.cash = cash
    SPICE_ORDER.forEach(spice => {
      this.inventory.push(new PlayerSpice(spice, 0, 0))
    });
  }

  getQuantity(spiceName : SpiceType) {
    const spice = this.inventory.find(spice => spice.spiceType == spiceName)
    return spice ? spice.quantity : 0
  }

  sell (spiceName : SpiceType, quantity : number, price : number) {
    const mySpice = this.inventory.find(spice => spice.spiceType == spiceName)
    if (!mySpice || quantity > mySpice.quantity)
      return
    this.cash += quantity * price
    mySpice.quantity -= quantity
    if (mySpice.quantity == 0) mySpice.price = 0
  }

  buy (spiceName : SpiceType, quantity : number, price : number) {
    let mySpice = this.inventory.find(spice => spice.spiceType == spiceName)
    if (!mySpice) {
      mySpice = new PlayerSpice(spiceName, quantity, price)
      this.inventory.push(mySpice)
    } else {
      mySpice.addQuantity(quantity, price)
    }
    this.cash -= quantity * price
  }
}
