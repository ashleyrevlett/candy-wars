import { Entity } from './Entity';
import { Spice } from './Spice'

export class Player extends Entity {
  initInventory() {
    const inventory : Array<Spice> = []
    return inventory
  }
}
