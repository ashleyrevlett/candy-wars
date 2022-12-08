import { CityName, Position } from '../types'

export interface Location {
  name: CityName
  position: Position,
  hasShop: boolean,
  hasBank: boolean,
}

export function travelTimeTo(here: Position, there: Position) {
  // return # days' journey
  let dist = Math.floor(Math.sqrt( Math.pow(there.x - here.x, 2) +  Math.pow(there.y - here.y, 2)))
  if (dist == 0) return 0 // same city
  dist *= 14 // scale the map coords to real life-ish distances
  const days = Math.max(1, Math.floor(dist / 500)) // min 1 day travel, assume 400 fake miles / day
  return days
}
