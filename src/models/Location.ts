import { Broker } from './Broker'
import { CityName } from '../types'

export class Location {
  name: CityName
  broker : Broker
  constructor(name : CityName, brokerName : string) {
    this.name = name
    this.broker = new Broker(brokerName, 1000)
  }
  describe() {
    console.log(`\n#### Current Location: ${this.name} - Broker ${this.broker.name} ($${this.broker.cash.toLocaleString()}) ####`)
    this.broker.inventory.forEach(spice => spice.describe())
  }
}