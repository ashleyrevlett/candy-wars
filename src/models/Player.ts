import SETTINGS from '../settings'
import { SpiceType } from '../types'
import { PlayerSpice } from './PlayerSpice'

export class Player {
  name : string
  cash : number
  inventory : Array<PlayerSpice> = SETTINGS.spiceOrder.map((s) => new PlayerSpice(s, 0, 0))
  inventorySpace: number = SETTINGS.inventorySpace

  constructor(name: string, cash: number){
    this.name = name
    this.cash = cash
  }

  getSpice(spiceName : SpiceType) {
    const mySpice = this.inventory.find(spice => spice.spiceType == spiceName)
    return mySpice ? mySpice : null
  }

  getQuantity(spiceName : SpiceType) {
    const mySpice = this.getSpice(spiceName)
    return mySpice ? mySpice.quantity : 0
  }

  getPrice(spiceName : SpiceType) {
    const mySpice = this.getSpice(spiceName)
    return mySpice ? mySpice.price : 0
  }

  sell (spiceName : SpiceType, quantity : number, price : number) {
    const mySpice = this.getSpice(spiceName)
    if (!mySpice || quantity > mySpice.quantity)
      return
    this.cash += quantity * price
    this.inventorySpace += quantity
    mySpice.quantity -= quantity
    if (mySpice.quantity == 0) mySpice.price = 0
  }

  buy (spiceName : SpiceType, quantity : number, price : number) {
    const mySpice = this.getSpice(spiceName)
    mySpice?.addQuantity(quantity, price)
    this.cash -= quantity * price
    this.inventorySpace -= quantity
  }
}
