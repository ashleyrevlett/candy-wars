import { CityName, GoodType, NumberRange, Position, WeaponType, GearType } from "../types"

type Locations = {
  [key in CityName]: {
    position: Position,
    hasBank: boolean,
    hasShop: boolean
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
  startDate: new Date('June 1, 1984 12:01:01'),
  startingHealth: 12,
  maxDays: 30,
  cash: 20,
  debt: 100,
  debtAPR: 0.01,
  volatility: {
    min: 0.05,
    max: 0.25
  },
  eventChance: 0.5,
  locations: {
    'Playground': { position: { x: 190, y: 50 },  hasBank: true, hasShop: true },
    'Gym':        { position: { x: 150, y: 40 },  hasBank: false, hasShop: false },
    'Cafeteria':  { position: { x: 130, y: 50 },  hasBank: true, hasShop: false },
    'Library':    { position: { x: 120, y: 60 },  hasBank: false, hasShop: false },
    'Bathroom':   { position: { x: 130, y: 110 }, hasBank: false, hasShop: true },
    'Hallway':    { position: { x: 20, y: 80 },   hasBank: true, hasShop: true },
  },
  goods: {
    'Hard Candy':     { priceRange: { min: 1,   max: 3   }, quantityRange: { min: 600, max: 1200 } },
    'Jelly Beans':    { priceRange: { min: 3,   max: 6  },  quantityRange: { min: 300, max: 900  } },
    'Gummy Bears':    { priceRange: { min: 5,  max: 12  }, quantityRange: { min: 100, max: 500  } },
    'Lollipops':      { priceRange: { min: 10,  max: 15  }, quantityRange: { min: 50,  max: 200  } },
    'Chocolate Bars': { priceRange: { min: 15, max: 25 },   quantityRange: { min: 10,  max: 50   } },
  },
  weapons: [
    { weaponType: 'Fists',            price: 0,  damage: 2 },
    { weaponType: 'Spitball Shooter', price: 10, damage: 5 },
    { weaponType: 'Slingshot',        price: 20, damage: 8 },
    { weaponType: 'Cherrybomb',       price: 50, damage: 12 },
  ],
  gear: [
    { gearType: 'Pockets',    price: 0,   space: 10 },
    { gearType: 'Belt Bag',   price: 20,  space: 40 },
    { gearType: 'Backpack',   price: 35,  space: 100 },
    { gearType: 'Duffel Bag', price: 60,  space: 250 },
  ],
}

export default SETTINGS