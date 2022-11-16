import { CityName, SpiceType, NumberRange } from "../types"

type PriceRanges = {
  [key in SpiceType]: NumberRange
}

interface Settings {
  startDate: Date,
  maxDays: number,
  cash: number,
  debt: number,
  bank: number,
  inventorySpace: number,
  spiceOrder: Array<SpiceType>,
  locationOrder: Array<CityName>,
  volatility: NumberRange,
  priceRanges: PriceRanges,
  debt_apr: number,
  event_chance: number
}

const SETTINGS : Settings = {
  startDate: new Date('January 1, 1572 12:01:01'),
  maxDays: 30,
  cash: 1000,
  debt: 5000,
  bank: 0,
  inventorySpace: 100,
  spiceOrder: [ 'Pepper', 'Cinnamon', 'Nutmeg', 'Saffron' ],
  locationOrder: [ 'New York', 'Detroit', 'Chicago', 'St. Louis', 'New Orleans', 'Los Angeles' ],
  volatility: {
    min: 0.05,
    max: 0.25
  },
  priceRanges: {
    'Pepper': { min: 20, max: 50},
    'Cinnamon': { min: 100, max: 300},
    'Nutmeg': { min: 500, max: 800},
    'Saffron': { min: 1200, max: 2200}
  },
  debt_apr: 0.005,
  event_chance: 0.2,
}

export default SETTINGS