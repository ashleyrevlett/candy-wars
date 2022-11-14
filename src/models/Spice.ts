import { SpiceType } from '../types'

export abstract class Spice {
  price: number = 0
  spiceType: SpiceType
  constructor(spiceType : SpiceType) {
    this.spiceType = spiceType
  }
}