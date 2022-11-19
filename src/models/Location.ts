import SETTINGS from '../settings'
import { Spice } from './Spice'
import { CityName, SpiceType } from '../types'

export class Location {
  name: CityName
  inventory : Array<Spice> = SETTINGS.spiceOrder.map((s) => new Spice(s))

  constructor(name : CityName) {
    this.name = name
  }

  getPrice(spiceName : SpiceType) {
    const spice = this.inventory.find(spice => spice.spiceType == spiceName)
    return spice ? spice.price : 0
  }

  getSpice(spiceName : SpiceType) {
    const mySpice = this.inventory.find(spice => spice.spiceType == spiceName)
    return mySpice ? mySpice : null
  }
}