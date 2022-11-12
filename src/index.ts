const prompt = require('prompt-sync')({sigint: true});

type SpiceType = 'Nutmeg' | 'Pepper' | 'Cinnamon'
type CityName = 'Los Angeles' | 'New York' | 'New Orleans'

class Game {
  player : Player
  cities : Array<City> = []
  constructor() {
    this.createCities()
    const playerName = prompt("What's your name? ");
    this.player = new Player(playerName, 100, this.cities[0])
    this.doTurn()
  }

  createCities() {
    this.cities.push(new City('Los Angeles'))
    this.cities.push(new City('New York'))
    this.cities.push(new City('New Orleans'))
  }

  doTurn() {
    while (true) {
      this.player.describe()
      this.player.location.describe()

      console.log("\nChoose an action:")
      console.log("[1] Travel to new city")
      console.log("[2] Buy Spice")
      console.log("[3] Sell Spice")

      const nextMove = Number(prompt("Enter a number from above: "))
      switch(nextMove) {
        case 1:
          this.travel()
          break;
        case 2:
          this.buySpice()
          break;
        case 3:
          this.sellSpice()
          break;
        default:
          // code block
      }
    }
  }

  buySpice() {
    if (this.player.money <= 0) {
      console.log("No money!")
      return
    }
    console.log("\nCurrent Location's Going Prices:")
    console.log("Spice\t\tPrice\tQty")
    this.player.location.spices.forEach((spice, index) => {
      console.log(`[${index}] ${spice.name} \t$${spice.price.toLocaleString()}\t${spice.quantity}`)
    })
    let spiceIndex, qty
    while (spiceIndex == undefined || spiceIndex < 0 || spiceIndex > this.player.location.spices.length) {
      spiceIndex = Number(prompt("\nEnter a number from above to choose a spice: "))
    }
    while (qty == undefined || qty < 0) {
      qty = Number(prompt("\nEnter a quantity to buy: "))
    }
    this.player.buy(this.player.location.spices[spiceIndex], qty)
  }

  sellSpice() {
    if (this.player.inventory.length == 0) {
      console.log("No inventory to sell!")
      return
    }
    console.log("\nCurrent Inventory and Going Prices:")
    console.log("Name\t\tQty\tPaid\tAsking Price")
    this.player.inventory.forEach((spice, index) => {
      const locationSpice = this.player.location.getSpice(spice.name)
      console.log(`[${index}] ${spice.name} \t${spice.quantity}\t$${spice.price.toLocaleString()}\t$${locationSpice?.price.toLocaleString()}`)
    })
    let spiceIndex, qty
    while (spiceIndex == undefined || spiceIndex < 0 || spiceIndex > this.player.inventory.length) {
      spiceIndex = Number(prompt("\nEnter a number from above to choose a spice: "))
    }
    while (qty == undefined || qty < 0) {
      qty = Number(prompt("\nEnter a quantity to sell: "))
    }
    this.player.sell(this.player.inventory[spiceIndex], qty)
  }

  travel() {
    console.log("\nAvailable Cities:")
    this.cities.forEach((city, index) => {
      const msg = city.name == this.player.location.name ? ' (You are here) ' : ''
      console.log(`[${index}] ${city.name} ${msg}`)
    });
    var cityIndex;
    while (cityIndex == undefined || cityIndex < 0 || cityIndex > this.cities.length) {
      cityIndex = Number(prompt("\nEnter a number from above to go to that city: "))
    }
    this.player.moveTo(this.cities[cityIndex])
  }
}

class Player {
  name : string
  money : number
  inventory : Array<Spice> = []
  location : City

  constructor(name: string, money: number, location : City){
    this.name = name
    this.money = money
    this.location = location
  }

  describe() {
    console.log(`\nPlayer ${this.name}\nCurrent Location: ${this.location.name}\nMoney: $${this.money.toLocaleString()}`)
    console.log("\n#### Player Inventory ####")
    if (this.inventory.length == 0 ) console.log("Empty")
    this.inventory.forEach(spice => spice.describe())
  }
  moveTo(newCity : City) {
    console.log(`Moving from ${this.location.name} to ${newCity.name}...`)
    this.location = newCity
  }
  sell(mySpice : Spice, quantity: number ) {
    console.log(`Selling ${quantity} ${mySpice.name}...`)
    const theirSpice = this.location.getSpice(mySpice.name)
    if (mySpice && theirSpice) {
      const maxQuantity = Math.min(mySpice?.quantity, quantity)
      theirSpice.quantity += maxQuantity
      mySpice.quantity -= maxQuantity
      this.money += maxQuantity * theirSpice.price
      console.log(`Earned $${(maxQuantity * theirSpice.price).toLocaleString()} selling ${maxQuantity} ${mySpice.name}!`)
    }
    if (mySpice.quantity == 0) {
      const idx = this.inventory.indexOf(mySpice)
      this.inventory.splice(idx)
    }
  }
  buy(spice : Spice, quantity: number ) {
    console.log(`Buying ${quantity} ${spice.name}...`)

    const maxQuantity = Math.min(spice.quantity, quantity)
    const maxCost = Math.min(maxQuantity * spice.price, this.money)
    const qty = Math.floor(maxCost / spice.price)
    spice.quantity -= qty
    this.money -= qty * spice.price

    let mySpice = this.inventory.find(el => el.name == spice.name)
    if (mySpice) {
      mySpice.quantity += qty
      mySpice.price = spice.price
    } else {
      mySpice = new Spice(spice.name, spice.price, qty)
      this.inventory.push(mySpice)
    }
    console.log(`Spent $${(qty * spice.price).toLocaleString()} buying ${qty} ${spice.name}!`)
  }
}

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

class City {
  spices = City.makeSpices()
  name: CityName
  constructor(name : CityName) {
    this.name = name
  }
  private static makeSpices() {
    return [
      new Spice('Pepper'),
      new Spice('Nutmeg'),
      new Spice('Cinnamon'),
    ]
  }
  describe() {
    console.log('\n#### ' + this.name + ' ####')
    this.spices.forEach(spice => spice.describe())
  }
  getSpice(name : SpiceType) {
    return this.spices.find(el => el.name == name)
  }
}

const g = new Game()
