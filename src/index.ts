const prompt = require('prompt-sync')({sigint: true});

type NumberRange = { min: number, max: number }
type SpiceType = 'Nutmeg' | 'Pepper' | 'Cinnamon'
type CityName = 'Los Angeles' | 'New York' | 'New Orleans'
type TransactionType = 'Buy' | 'Sell'

class Spice {
  price: number
  quantity: number
  name: SpiceType
  constructor(name : SpiceType, price?: number, quantity?: number) {
    const minPrice = 2
    const maxPrice = 20
    const minQty = 1
    const maxQty = 10
    this.name = name
    this.price = price ? price : Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice
    this.quantity = quantity ? quantity : Math.floor(Math.random() * (maxQty - minQty + 1)) + minQty
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
    console.log(`\n#### Location: ${this.name} - ${this.broker.name} ($${this.broker.cash.toLocaleString()}) ####`)
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
      new Spice('Pepper', this.randomNumber({ min: 1, max: 10}), this.randomNumber({ min: 100, max: 200})),
      new Spice('Cinnamon', this.randomNumber({ min: 10, max: 50}), this.randomNumber({ min: 30, max: 100})),
      new Spice('Nutmeg', this.randomNumber({ min: 50, max: 200}), this.randomNumber({ min: 0, max: 20})),
    ]
    return inventory
  }
  randomNumber( range: NumberRange ) {
    return Math.floor(Math.random() * range.max) + range.min;
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

  constructor() {
    this.player = new Player('Jane', 1000)
    this.currentLocation = this.locations[0]
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
      this.player.describe()
      this.currentLocation.describe()

      console.log("\nChoose an action:")
      console.log("[1] Travel to new city")
      console.log("[2] Buy Spice")
      console.log("[3] Sell Spice")

      const nextMove = Number(prompt("Enter a number from above: "))
      switch(nextMove) {
        case 1:
          this.travelMenu()
          break;
        case 2:
          this.buyMenu()
          break;
        case 3:
          this.sellMenu()
          break;
        default:
          // code block
      }
    }
  }

  travelMenu() {
    console.log("\nAvailable Cities:")
    this.locations.forEach((city, index) => {
      const msg = city.name == this.currentLocation.name ? ' (You are here) ' : ''
      console.log(`[${index}] ${city.name} ${msg}`)
    });
    const cityIndex = Number(prompt("\nEnter a number from above to go to that city: "))
    this.travelTo(this.locations[cityIndex])
  }

  buyMenu() {
    if (this.player.cash <= 0) {
      console.log("No money!")
      return
    }
    console.log(`\n${this.currentLocation.name} Prices:`)
    console.log("Spice\t\tPrice\tQty")
    this.currentLocation.broker.inventory.forEach((spice, index) => {
      console.log(`[${index}] ${spice.name} \t$${spice.price.toLocaleString()}\t${spice.quantity}`)
    })
    const spiceIndex = Number(prompt("\nEnter a number from above to choose a spice: "))
    const qty = Number(prompt("\nEnter a quantity to buy: "))
    this.buy(this.currentLocation.broker.inventory[spiceIndex].name, qty)
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
      console.log(`[${index}] ${spice.name} \t${spice.quantity}\t$${spice.price.toLocaleString()}\t$${brokerPrice.toLocaleString()}`)
    })
    const spiceIndex = Number(prompt("\nEnter a number from above to choose a spice: "))
    const qty = Number(prompt("\nEnter a quantity to sell: "))
    this.sell(this.player.inventory[spiceIndex].name, qty)
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
  }
}

const g = new Game()
