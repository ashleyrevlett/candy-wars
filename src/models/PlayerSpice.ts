import { Spice } from './Spice'
import { SpiceType } from '../types'

export class PlayerSpice extends Spice {
  quantity: number
  constructor(spiceType : SpiceType, quantity: number, price: number) {
    super(spiceType)
    this.quantity = quantity
    this.price = price
  }

  addQuantity(newQuantity : number, newPrice : number) {
    const priceList = Array(this.quantity).fill(this.price)
    const newList = Array(newQuantity).fill(newPrice)
    const allPrices = priceList.concat(newList)
    const total = allPrices.reduce((acc, c) => acc + c, 0);
    const avgPrice = Math.ceil(total / allPrices.length)
    this.quantity += newQuantity
    this.price = avgPrice
  }
}