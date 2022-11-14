import { Spice } from './Spice'
import { SpiceType } from '../types'

export class PlayerSpice extends Spice {
  quantity: number
  constructor(spiceType : SpiceType, quantity: number, price: number) {
    super(spiceType)
    this.quantity = quantity
    this.price = price
  }
}