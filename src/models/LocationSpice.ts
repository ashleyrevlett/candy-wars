import SETTINGS from '../settings'
import { SpiceType, NumberRange } from '../types'
import { Spice } from './Spice'

export class LocationSpice extends Spice {
  priceRange: NumberRange

  constructor(spiceType : SpiceType, price?: number) {
    super(spiceType)
    this.priceRange = SETTINGS.priceRanges[spiceType]
    this.price = Math.floor(Math.random() * (this.priceRange.max - this.priceRange.min + 1)) + this.priceRange.min
  }

  simulateTrade() {
    const plusOrMinus = Math.random() < 0.5 ? -1 : 1
    const percentChange = (Math.random() * (SETTINGS.volatility.max - SETTINGS.volatility.min) + SETTINGS.volatility.min) * plusOrMinus
    this.price += Math.floor(this.price * percentChange)
    this.price = Math.min( Math.max(this.priceRange.min, this.price), this.priceRange.max)
  }

  priceSpike() {
    this.price = this.priceRange.max + Math.floor(this.priceRange.max * .25)
  }

  priceDrop() {
    this.price = this.priceRange.min - Math.floor(this.priceRange.min * .15)
  }
}