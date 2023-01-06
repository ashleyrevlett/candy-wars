import { CityName, GoodType, NumberRange, WeaponType, GearType } from "../types"

type Locations = {
  [key in CityName]: {
    hasBank: boolean,
  }
}

type Weapon = {
  weaponType: WeaponType
  damage: number,
  price: number,
}

type Gear = {
  gearType: GearType,
  price: number,
  space: number,
}

type Goods = {
  [key in GoodType]: {
    quantityRange: NumberRange,
    priceRange: NumberRange,
  }
}

interface Settings {
  startDate: Date,
  schoolEndHour: number,
  lunchCost: number,
  maxDays: number,
  cash: number,
  debt: number,
  debtAPR: number,
  locations: Locations,
  goods: Goods
  volatility: NumberRange,
  eventChance: number,
  weapons: Weapon[],
  gear: Gear[],
  startingHealth: number,
}

const SETTINGS : Settings = {
  startDate: new Date('May 16, 1990 09:00:00'),
  schoolEndHour: 15, // 3pm
  lunchCost: 5,
  startingHealth: 12,
  maxDays: 5,
  cash: 20,
  debt: 100,
  debtAPR: 0.04,
  volatility: {
    min: 0.05,
    max: 0.25
  },
  eventChance: 0.4,
  locations: {
    'Playground': { hasBank: false, },
    'Gym':        { hasBank: false, },
    'Cafeteria':  { hasBank: false, },
    'Library':    { hasBank: false, },
    'Bathroom':   { hasBank: false, },
    'Hallway':    { hasBank: true,  },
  },
  goods: {
    'Hard Candy':     { priceRange: { min: .5,  max: 1   }, quantityRange: { min: 600, max: 1200 } },
    'Bubblegum':      { priceRange: { min: .6,  max: 1.5 }, quantityRange: { min: 80,  max: 120  } },
    'Peppermints':    { priceRange: { min: .75, max: 2   }, quantityRange: { min: 500, max: 800  } },
    'Jelly Beans':    { priceRange: { min: 1,   max: 2   }, quantityRange: { min: 300, max: 900  } },
    'Gummy Bears':    { priceRange: { min: 1.5, max: 3   }, quantityRange: { min: 100, max: 500  } },
    'Lollipops':      { priceRange: { min: 2,   max: 3.5 }, quantityRange: { min: 50,  max: 200  } },
    'Chocolate Bars': { priceRange: { min: 3,   max: 8   }, quantityRange: { min: 10,  max: 50   } },
  },
  weapons: [
    { weaponType: 'Fists',            price: 0,  damage: 2 },
    { weaponType: 'Spitball Shooter', price: 5, damage: 5 },
    { weaponType: 'Slingshot',        price: 10, damage: 8 },
    { weaponType: 'Cherrybomb',       price: 40, damage: 12 },
  ],
  gear: [
    { gearType: 'Pockets',    price: 0,   space: 10 },
    { gearType: 'Belt Bag',   price: 15,  space: 20 },
    { gearType: 'Backpack',   price: 30,  space: 50 },
    { gearType: 'Duffel Bag', price: 60,  space: 100 },
  ],
}

export default SETTINGS