const prompt = require('prompt-sync')({sigint: true});

import { SpiceType, TransactionType } from './types'
import { Location } from './models/Location'
import { Broker } from './models/Broker'
import { Player } from './models/Player'

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
      const dateOptions : Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
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
