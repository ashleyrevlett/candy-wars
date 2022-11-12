import { Entity } from './Entity';
import { Spice } from './Spice'

export class Broker extends Entity {
  initInventory() {
    const inventory = [
      new Spice('Pepper'),
      new Spice('Cinnamon'),
      new Spice('Nutmeg'),
    ]
    return inventory
  }
  randomizeCash() {
    const maxChange = 0.3
    const minChange = 0.1
    const plusOrMinus = Math.random() < 0.5 ? -1 : 1
    const percentChange = (Math.random() * (maxChange - minChange) + minChange) * plusOrMinus
    this.cash += Math.floor(this.cash * percentChange)
    this.cash = Math.max(300, this.cash)
  }
}