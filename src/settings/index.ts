import { CityName, GoodType, NumberRange, Position, WeaponType } from "../types"

type LocationPositions = {
  [key in CityName]: Position
}

type WeaponStats = {
  [key in WeaponType]: number
}

type Goods = {
  [key in GoodType]: {
    quantityRange: NumberRange,
    priceRange: NumberRange,
  }
}

interface Settings {
  startDate: Date,
  maxDays: number,
  cash: number,
  debt: number,
  debtAPR: number,
  inventorySpace: number,
  locations: LocationPositions,
  goods: Goods
  volatility: NumberRange,
  eventChance: number,
  weapons: WeaponStats,
  startingHealth: number,
}

const SETTINGS : Settings = {
  startDate: new Date('June 1, 1984 12:01:01'),
  maxDays: 30,
  cash: 100,
  debt: 500,
  debtAPR: 0.005,
  inventorySpace: 500,
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
  goods: {
    'Candy':   { quantityRange: { min: 600, max: 1200 }, priceRange: { min: 1,   max: 3   } },
    'Gummy Bears': { quantityRange: { min: 300, max: 900  }, priceRange: { min: 5,   max: 9  } },
    'Lollipops':   { quantityRange: { min: 100, max: 500  }, priceRange: { min: 10,  max: 20  } },
    'Caramels':  { quantityRange: { min: 50,  max: 200  }, priceRange: { min: 15,  max: 25  } },
    'Chocolate Bars':     { quantityRange: { min: 10,  max: 50   }, priceRange: { min: 20, max: 40 } },
  },
  eventChance: 0.5,
  weapons: {
    'Fists': 2,
    'Pistol': 10,
  },
  startingHealth: 12,
}

export default SETTINGS