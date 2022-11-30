import { SpiceType, CityName } from '../types'
import SETTINGS from '../settings'

export interface TradeGood {
  id: string
  price: number
  quantity: number
  spiceType: SpiceType
  location?: CityName
}

function calculatePrice(spiceType: SpiceType, qty: number) : number {
  const priceRange = SETTINGS.priceRanges[spiceType]
  const quantityRange = SETTINGS.quantityRanges[spiceType]
  const oldRange = (quantityRange.max - quantityRange.min)
  const newRange = (priceRange.max - priceRange.min)
  const price = (((qty - quantityRange.min) * newRange) / oldRange) + priceRange.min
  return Math.floor(priceRange.max - price) + priceRange.min
}

function getRandomQty(spiceType: SpiceType) : number  {
  const quantityRange = SETTINGS.quantityRanges[spiceType]
  return Math.floor(Math.random() * (quantityRange.max - quantityRange.min + 1)) + quantityRange.min
}

export function generateStartingData(id: string, spiceType: SpiceType, location?: CityName): TradeGood {
  const qty = getRandomQty(spiceType)
  const price = calculatePrice(spiceType, qty)
  return {
    id: id,
    quantity: qty,
    spiceType: spiceType,
    location: location,
    price: price,
  }
}