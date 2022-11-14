import { LocationSpice } from './LocationSpice'
import { CityName, SpiceType, SPICE_ORDER } from '../types'

export class Location {
  name: CityName
  inventory : Array<LocationSpice> = []

  constructor(name : CityName) {
    this.name = name
    SPICE_ORDER.forEach(spice => {
      this.inventory.push(new LocationSpice(spice))
    });
  }

  getPrice(spiceName : SpiceType) {
    const spice = this.inventory.find(spice => spice.spiceType == spiceName)
    return spice ? spice.price : 0
  }
}