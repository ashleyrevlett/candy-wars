import { CityName, SpiceType, NumberRange } from "./types"

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
  debt_apr: number
}

const SETTINGS : Settings = {
  startDate: new Date('January 1, 1572 12:01:01'),
  maxDays: 30,
  cash: 1000,
  debt: 1000,
  bank: 0,
  inventorySpace: 100,
  spiceOrder: [ 'Pepper', 'Cinnamon', 'Nutmeg' ],
  locationOrder: [ 'New York', 'New Orleans', 'Los Angeles', 'Chicago', 'Detroit' ],
  volatility: {
    min: 0.05,
    max: 0.25
  },
  priceRanges: {
    'Pepper': { min: 10, max: 60},
    'Cinnamon': { min: 200, max: 500},
    'Nutmeg': { min: 600, max: 1000},
  },
  debt_apr: 0.05
}

export default SETTINGS