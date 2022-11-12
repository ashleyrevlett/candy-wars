const prompt = require('prompt-sync')({sigint: true});

type SpiceType = 'Nutmeg' | 'Pepper' | 'Cinnamon'
type TransactionType = 'Buy' | 'Sell'
type CityName = 'Los Angeles' | 'New York' | 'New Orleans'
type NumberRange = { min: number, max: number }

const priceRanges = {
  'Pepper': { min: 10, max: 60},
  'Cinnamon': { min: 200, max: 500},
  'Nutmeg': { min: 600, max: 1000},
}

const quantityRanges = {
  'Pepper': { min: 100, max: 300},
  'Cinnamon': { min: 40, max: 100},
  'Nutmeg': { min: 5, max: 30},
}

const volatility : NumberRange = {
  min: 0.05,
  max: 0.25
}

const dateOptions : Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}

class Spice {
  price: number
  quantity: number
  name: SpiceType
  priceRange: NumberRange
  quantityRange: NumberRange
  constructor(name : SpiceType, price?: number, quantity?: number) {
    this.name = name
    this.priceRange = priceRanges[name]
    this.quantityRange = quantityRanges[name]
    this.price = price ? price : Math.floor(Math.random() * (this.priceRange.max - this.priceRange.min + 1)) + this.priceRange.min
    this.quantity = quantity ? quantity : Math.floor(Math.random() * (this.quantityRange.max - this.quantityRange.min + 1)) + this.quantityRange.min
  }
  simulateTrade() {
    const plusOrMinus = Math.random() < 0.5 ? -1 : 1
    const percentChange = (Math.random() * (volatility.max - volatility.min) + volatility.min) * plusOrMinus
    this.price += Math.floor(this.price * percentChange)
    this.price = Math.min( Math.max(this.priceRange.min, this.price), this.priceRange.max)
    this.quantity += Math.floor(this.quantity * percentChange)
    this.quantity = Math.max(this.quantityRange.min, this.quantity)
  }
  describe() {
    console.log(`${this.name} – Price: $${this.price.toLocaleString()}, Qty: ${this.quantity}`)
  }
}

class Location {
  name: CityName
  broker : Broker
  constructor(name : CityName, brokerName : string) {
    this.name = name
    this.broker = new Broker(brokerName, 1000)
  }
  describe() {
    console.log(`\n#### Current Location: ${this.name} - Broker ${this.broker.name} ($${this.broker.cash.toLocaleString()}) ####`)
    this.broker.inventory.forEach(spice => spice.describe())
  }
}

abstract class Entity {
  name : string
  cash : number
  inventory : Array<Spice> = []

  constructor(name: string, cash: number){
    this.name = name
    this.cash = cash
    this.inventory = this.initInventory()
  }

  abstract initInventory() : Array<Spice>

  getPrice(spiceName : SpiceType) {
    const spice = this.inventory.find(spice => spice.name == spiceName)
    return spice ? spice.price : 0
  }

  getQuantity(spiceName : SpiceType) {
    const spice = this.inventory.find(spice => spice.name == spiceName)
    return spice ? spice.quantity : 0
  }

  sell (spiceName : SpiceType, quantity : number, price : number) {
    const mySpice = this.inventory.find(spice => spice.name == spiceName)
    if (!mySpice || quantity > mySpice.quantity) return 0
    mySpice.quantity -= quantity
    this.cash += quantity * price
  }

  buy (spiceName : SpiceType, quantity : number, price : number) {
    let mySpice = this.inventory.find(spice => spice.name == spiceName)
    if (!mySpice) {
      mySpice = new Spice(spiceName, price, quantity)
      this.inventory.push(mySpice)
    } else {
      mySpice.quantity += quantity
      mySpice.price = price
    }
    this.cash -= quantity * price
  }

  describe() {
    console.log(`\n#### ${this.name}: $${this.cash.toLocaleString()}`)
    if (this.inventory.length == 0 ) console.log("Empty Inventory")
    this.inventory.forEach(spice => spice.describe())
  }
}


class Broker extends Entity {
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

class Player extends Entity {
  initInventory() {
    const inventory : Array<Spice> = []
    return inventory
  }
}

class Game {
  player : Player
  locations = Game.initLocations()
  currentLocation : Location
  currentDay : Date

  constructor() {
    this.player = new Player('Jane', 1000)
    this.currentLocation = this.locations[0]
    this.currentDay = new Date('January 1, 1572 12:00:00')
    this.doTurn()
  }

  private static initLocations() {
    return [
      new Location('New York', 'Jackie B.'),
      new Location('New Orleans', 'Monique'),
      new Location('Los Angeles', 'Mel C.'),
    ]
  }

  doTurn() {
    while (true) {
      console.log(`\nDate: ${this.currentDay.toLocaleDateString("en-US", dateOptions)}`)
      this.player.describe()
      this.currentLocation.describe()

      console.log("\nChoose an action:")
      console.log("[1] Travel to new city")
      console.log("[2] Buy Spice")
      console.log("[3] Sell Spice")
      console.log("[4] Wait 1 Day")

      const nextMove = Number(prompt("Enter a number from above: "))
      switch(nextMove) {
        case 1:
          this.travelMenu()
          break
        case 2:
          this.buyMenu()
          break
        case 3:
          this.sellMenu()
          break
        case 4:
          this.nextDay()
          break
        default:
      }
    }
  }

  nextDay() {
    console.log("... another day has begun ...")
    this.locations.forEach(location => {
      location.broker.inventory.forEach(spice => {
        spice.simulateTrade()
      });
      location.broker.randomizeCash()
    });
    this.currentDay.setDate(this.currentDay.getDate() + 1)
  }

  travelMenu() {
    console.log("\nAvailable Cities:")
    this.locations.forEach((city, index) => {
      const msg = city.name == this.currentLocation.name ? ' (You are here) ' : ''
      console.log(`[${index + 1}] ${city.name} ${msg}`)
    });
    const cityIndex = Number(prompt("\nEnter a number from above to go to that city: "))
    this.travelTo(this.locations[cityIndex - 1])
  }

  buyMenu() {
    if (this.player.cash <= 0) {
      console.log("No money!")
      return
    }
    console.log(`\n${this.currentLocation.name} Prices:`)
    console.log("Spice\t\tPrice\tQty")
    this.currentLocation.broker.inventory.forEach((spice, index) => {
      console.log(`[${index + 1}] ${spice.name} \t$${spice.price.toLocaleString()}\t${spice.quantity}`)
    })
    const spiceIndex = Number(prompt("\nEnter a number from above to choose a spice: "))
    const qty = Number(prompt("\nEnter a quantity to buy: "))
    this.buy(this.currentLocation.broker.inventory[spiceIndex - 1].name, qty)
  }

  sellMenu() {
    if (this.player.inventory.length == 0) {
      console.log("No inventory to sell!")
      return
    }
    console.log("\nCurrent Inventory and Going Prices:")
    console.log("Name\t\tQty\tPaid\tAsking Price")
    this.player.inventory.forEach((spice, index) => {
      const brokerPrice = this.currentLocation.broker.getPrice(spice.name)
      console.log(`[${index + 1}] ${spice.name} \t${spice.quantity}\t$${spice.price.toLocaleString()}\t$${brokerPrice.toLocaleString()}`)
    })
    const spiceIndex = Number(prompt("\nEnter a number from above to choose a spice: "))
    const qty = Number(prompt("\nEnter a quantity to sell: "))
    this.sell(this.player.inventory[spiceIndex - 1].name, qty)
  }

  canTrade(transaction: TransactionType, broker: Broker, spiceType: SpiceType, quantity: number) {
    let price = broker.getPrice(spiceType)
    if (transaction == 'Buy') {
      if (price * quantity > this.player.cash) {
        console.log("Player doesn't have enough cash")
        return false
      } else if (quantity > broker.getQuantity(spiceType)) {
        console.log("Broker doesn't have enough spice")
        return false
      }
    } else {
      if (price * quantity > broker.cash) {
        console.log("Broker doesn't have enough cash")
        return false
      } else if (quantity > this.player.getQuantity(spiceType)) {
        console.log("Player doesn't have enough spice")
        return false
      }
    }
    return true
  }

  buy(spice : SpiceType, quantity : number) {
    if (!this.canTrade('Buy', this.currentLocation.broker, spice, quantity))
      return
    const broker = this.currentLocation.broker
    const price = broker.getPrice(spice)
    broker.sell(spice, quantity, price)
    this.player.buy(spice, quantity, price)
    console.log(`\n!!! ${this.player.name} bought ${quantity} ${spice} from ${broker.name} for a total of $${(quantity * price).toLocaleString()}`)
  }

  sell(spice : SpiceType, quantity : number) {
    if (!this.canTrade('Sell', this.currentLocation.broker, spice, quantity))
      return
    const broker = this.currentLocation.broker
    const price = broker.getPrice(spice)
    broker.buy(spice, quantity, price)
    this.player.sell(spice, quantity, price)
    console.log(`\n!!! ${this.player.name} sold ${quantity} ${spice} to ${broker.name} for a total of $${(quantity * price).toLocaleString()}`)
  }

  travelTo(location : Location) {
    if (location == this.currentLocation) {
      console.log("Already there!")
      return
    }
    console.log(`\n!!! Traveling from ${this.currentLocation.name} to ${location.name}...`)
    this.currentLocation = location
    this.nextDay()
  }
}

const g = new Game()
