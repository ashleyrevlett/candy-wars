import SETTINGS from '../settings'
import { SpiceType } from '../types'
import { Spice } from './Spice'

export class Player {
  cash : number = SETTINGS.cash
  inventory : Array<Spice> = SETTINGS.spiceOrder.map((s) => new Spice(s, 0, 0))
  inventorySpace: number = SETTINGS.inventorySpace

  constructor() {}

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

  sell(playerSpice : Spice, quantity : number, price : number) {
    this.cash += quantity * price
    this.inventorySpace += quantity
    playerSpice.quantity -= quantity
    if (playerSpice.quantity == 0) playerSpice.price = 0
  }

  buy(sellerSpice : Spice, quantity : number) {
    const mySpice = this.getSpice(sellerSpice.spiceType)
    mySpice?.addQuantity(quantity, sellerSpice.price)

    this.cash -= quantity * sellerSpice.price
    this.inventorySpace -= quantity
  }

  loseCash(amount : number) {
    this.cash = Math.max(0, this.cash - amount)
  }
}
