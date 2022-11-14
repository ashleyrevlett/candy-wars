import { SpiceType, NumberRange } from '../types'
import { Spice } from './Spice'

const priceRanges = {
  'Pepper': { min: 10, max: 60},
  'Cinnamon': { min: 200, max: 500},
  'Nutmeg': { min: 600, max: 1000},
}

const volatility = {
  min: 0.05,
  max: 0.25
}

export class LocationSpice extends Spice {
  priceRange: NumberRange

  constructor(spiceType : SpiceType, price?: number) {
    super(spiceType)
    this.priceRange = priceRanges[spiceType]
    this.price = Math.floor(Math.random() * (this.priceRange.max - this.priceRange.min + 1)) + this.priceRange.min
  }

  simulateTrade() {
    const plusOrMinus = Math.random() < 0.5 ? -1 : 1
    const percentChange = (Math.random() * (volatility.max - volatility.min) + volatility.min) * plusOrMinus
    this.price += Math.floor(this.price * percentChange)
    this.price = Math.min( Math.max(this.priceRange.min, this.price), this.priceRange.max)
  }
}