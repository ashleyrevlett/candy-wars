import { LocationSpice } from './LocationSpice'
import { CityName, SpiceType } from '../types'

export class Location {
  name: CityName
  inventory : Array<LocationSpice> = [
    new LocationSpice('Pepper'),
    new LocationSpice('Cinnamon'),
    new LocationSpice('Nutmeg'),
  ]

  constructor(name : CityName) {
    this.name = name
  }

  getPrice(spiceName : SpiceType) {
    const spice = this.inventory.find(spice => spice.spiceType == spiceName)
    return spice ? spice.price : 0
  }
}