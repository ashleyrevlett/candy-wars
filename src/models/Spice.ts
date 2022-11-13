import { SpiceType, NumberRange } from '../types'

const priceRanges = {
  'Pepper': { min: 10, max: 60},
  'Cinnamon': { min: 200, max: 500},
  'Nutmeg': { min: 600, max: 1000},
}

const quantityRanges = {
  'Pepper': { min: 100, max: 300},
  'Cinnamon': { min: 40, max: 100},
  'Nutmeg': { min: 5, max: 30},
}

const volatility = {
  min: 0.05,
  max: 0.25
}

export class Spice {
  price: number
  quantity: number
  name: SpiceType
  priceRange: NumberRange
  quantityRange: NumberRange
  constructor(name : SpiceType, price?: number, quantity?: number) {
    this.name = name
    this.priceRange = priceRanges[name]
    this.quantityRange = quantityRanges[name]
    this.price = price ? price : Math.floor(Math.random() * (this.priceRange.max - this.priceRange.min + 1)) + this.priceRange.min
    this.quantity = quantity ? quantity : Math.floor(Math.random() * (this.quantityRange.max - this.quantityRange.min + 1)) + this.quantityRange.min
  }
  simulateTrade() {
    const plusOrMinus = Math.random() < 0.5 ? -1 : 1
    const percentChange = (Math.random() * (volatility.max - volatility.min) + volatility.min) * plusOrMinus
    this.price += Math.floor(this.price * percentChange)
    this.price = Math.min( Math.max(this.priceRange.min, this.price), this.priceRange.max)
    this.quantity += Math.floor(this.quantity * percentChange)
    this.quantity = Math.max(this.quantityRange.min, this.quantity)
  }
}