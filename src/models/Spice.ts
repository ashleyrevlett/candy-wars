import SETTINGS from '../settings'
import { SpiceType, NumberRange } from '../types'

export class Spice {
  price: number = 0
  quantity: number = 0
  spiceType: SpiceType
  priceRange: NumberRange
  quantityRange: NumberRange

  constructor(spiceType : SpiceType, price? : number, quantity? : number) {
    this.spiceType = spiceType
    this.priceRange = SETTINGS.priceRanges[spiceType]
    this.quantityRange = SETTINGS.quantityRanges[spiceType]
    this.quantity = quantity != undefined ? quantity : Math.floor(Math.random() * (this.quantityRange.max - this.quantityRange.min + 1)) + this.quantityRange.min
    this.price = price != undefined ? price : this.calculatePrice()
  }

  scaleQtyToPriceRange(qty: number) {
    // return price
    const OldRange = (this.quantityRange.max - this.quantityRange.min)
    const NewRange = (this.priceRange.max - this.priceRange.min)
    const price = (((qty - this.quantityRange.min) * NewRange) / OldRange) + this.priceRange.min
    return price
  }

  calculatePrice() : number {
    const p  = this.scaleQtyToPriceRange(this.quantity)
    return Math.floor(this.priceRange.max - p) + this.priceRange.min
  }

  addQuantity(newQuantity : number, newPrice : number) {
    // update price to avg price paid for this spice
    const priceList = Array(this.quantity).fill(this.price)
    const newList = Array(newQuantity).fill(newPrice)
    const allPrices = priceList.concat(newList)
    const total = allPrices.reduce((acc, c) => acc + c, 0);
    const avgPrice = Math.ceil(total / allPrices.length)
    this.quantity += newQuantity
    this.price = avgPrice
  }

  update() {
    // randomize quantity then update price
    const plusOrMinus = Math.random() < 0.5 ? -1 : 1
    const percentChange = (Math.random() * (SETTINGS.volatility.max - SETTINGS.volatility.min) + SETTINGS.volatility.min) * plusOrMinus
    this.quantity += Math.floor(this.quantity * percentChange)
    this.quantity = Math.min( Math.max(this.quantityRange.min, this.quantity), this.quantityRange.max)
    this.price = this.calculatePrice()
  }

  priceSpike() {
    this.price = this.priceRange.max + Math.floor(this.priceRange.max * .25)
  }

  priceDrop() {
    this.price = this.priceRange.min - Math.floor(this.priceRange.min * .15)
  }

}