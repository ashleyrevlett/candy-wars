import { Broker } from './Broker'
import { CityName } from '../types'

export class Location {
  name: CityName
  broker : Broker
  constructor(name : CityName, brokerName : string) {
    this.name = name
    this.broker = new Broker(brokerName, 1000)
  }
}