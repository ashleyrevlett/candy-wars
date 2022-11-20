import SETTINGS from '../settings'
import { Spice } from './Spice'
import { CityName, SpiceType, Position } from '../types'

export class Location {
  name: CityName
  position: Position
  inventory : Array<Spice> = SETTINGS.spiceOrder.map((s) => new Spice(s))

  constructor(name : CityName, position: Position) {
    this.name = name
    this.position = position
  }

  getDistanceFrom(otherCity: Position) {
    // return # days' journey
    let dist = Math.floor(Math.sqrt( Math.pow(otherCity.x - this.position.x, 2) +  Math.pow(otherCity.y - this.position.y, 2)))
    if (dist == 0) return 0 // same city
    dist *= 14 // scale the map coords to real life-ish distances
    const days = Math.max(1, Math.floor(dist / 500)) // min 1 day travel, assume 400 fake miles / day
    return days
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