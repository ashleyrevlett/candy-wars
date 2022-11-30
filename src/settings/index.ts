import { CityName, SpiceType, NumberRange, Position } from "../types"

type LocationPositions = {
  [key in CityName]: Position
}

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
  locations: LocationPositions,
  volatility: NumberRange,
  priceRanges: PriceRanges,
  quantityRanges: PriceRanges,
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
  volatility: {
    min: 0.05,
    max: 0.25
  },
  locations: {
    'New York': { x: 190, y: 50 },
    'Detroit': { x: 150, y: 40 },
    'Chicago': { x: 130, y: 50 },
    'St. Louis': { x: 120, y: 60 },
    'New Orleans': { x: 130, y: 110 },
    'Los Angeles': { x: 20, y: 80 },
  },
  quantityRanges: {
    'Pepper': { min: 600, max: 1200},
    'Cinnamon': { min: 300, max: 900},
    'Nutmeg': { min: 100, max: 500},
    'Saffron': { min: 50, max: 200}
  },
  priceRanges: {
    'Pepper': { min: 1, max: 50},
    'Cinnamon': { min: 10, max: 100},
    'Nutmeg': { min: 100, max: 400},
    'Saffron': { min: 600, max: 1000}
  },
  debt_apr: 0.005,
  event_chance: 0.2,
}

export default SETTINGS