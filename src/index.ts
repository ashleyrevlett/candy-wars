const prompt = require('prompt-sync')({sigint: true});


type SpiceType = 'Nutmeg' | 'Pepper'
type CityName = 'Los Angeles' | 'New York'

// class Game {
//   player : Player
//   constructor() {

//   }
//   startGame() {
//     var name = prompt('enter your name: ');
//     this.player = new Player
//   }
// }

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
    console.log(`\nPlayer ${this.name}, City: ${this.location.name}, Money: $${this.money.toLocaleString()}`)
    console.log("#Inventory:")
    this.inventory.forEach(spice => spice.describe())
    this.location.describe()
  }
  moveTo(newCity : City) {
    console.log(`Moving from ${this.location.name} to ${newCity.name}...`)
    this.location = newCity
  }
  sell(spiceName : SpiceType, quantity: number ) {
    console.log(`Selling ${quantity} ${spiceName}...`)
    const mySpice = this.inventory.find(el => el.name == spiceName)
    const theirSpice = this.location.getSpice(spiceName)
    if (mySpice && theirSpice) {
      const maxQuantity = Math.min(mySpice?.quantity, quantity)
      theirSpice.quantity += maxQuantity
      mySpice.quantity -= maxQuantity
      this.money += maxQuantity * theirSpice.price
      console.log(`Earned $${(maxQuantity * theirSpice.price).toLocaleString()} selling ${maxQuantity} ${spiceName}!`)
    }
  }
  buy(spiceName : SpiceType, quantity: number ) {
    console.log(`Buying ${quantity} ${spiceName}...`)
    const spice = this.location.getSpice(spiceName)
    if (!spice) return;

    const maxQuantity = Math.min(spice.quantity, quantity)
    const maxCost = Math.min(maxQuantity * spice.price, this.money)
    const qty = Math.floor(maxCost / spice.price)
    spice.quantity -= qty
    this.money -= qty * spice.price

    let mySpice = this.inventory.find(el => el.name == spiceName)
    if (mySpice) {
      mySpice.quantity += qty
      mySpice.price = spice.price
    } else {
      mySpice = new Spice(spiceName, spice.price, qty)
      this.inventory.push(mySpice)
    }
    console.log(`Spent $${(qty * spice.price).toLocaleString()} buying ${qty} ${spiceName}!`)
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
  private spices = City.makeSpices()
  name: CityName
  constructor(name : CityName) {
    this.name = name
  }
  private static makeSpices() {
    return [
      new Spice('Nutmeg'),
      new Spice('Pepper'),
    ]
  }
  describe() {
    console.log(this.name)
    this.spices.forEach(spice => spice.describe())
  }
  getSpice(name : SpiceType) {
    return this.spices.find(el => el.name == name)
  }
}


const cities = []
cities.push(new City('Los Angeles'))
cities.push(new City('New York'))

// cities.forEach(city => {
//   city.describe()
// });

const p = new Player("Jane", 100, cities[0])
p.describe()
const num = prompt('Enter a number: ');

p.moveTo(cities[1])
p.describe()
p.buy("Nutmeg", 2)
p.describe()
p.moveTo(cities[0])
p.sell("Nutmeg", 1)
p.buy("Pepper", 1)
p.describe()