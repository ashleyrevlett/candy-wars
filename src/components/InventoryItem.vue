<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    name: String,
    quantity: Number,
    price: Number,
    canSell: Boolean,
    canBuy: Boolean
  },
  setup(props) {
    props.name,
    props.quantity,
    props.price,
    props.canSell,
    props.canBuy
  },
  data() {
    return {
      tradeQuantity : 0,
    }
  },
  methods: {
    sell() {
      this.$emit('sell', this.tradeQuantity)
      console.log(`Selling ${this.tradeQuantity} ${this.name}!`)
    },
    buy() {
      this.$emit('buy', this.tradeQuantity)
      console.log(`Buying ${this.tradeQuantity} ${this.name}!`)
    },
  }
})
</script>


<template>
  <p>
    {{name}}: ${{price?.toLocaleString()}} x{{quantity}}
    <div v-if="canBuy">
      <input type="number" v-model="tradeQuantity" min="0" :max="quantity" />
      <button @click="buy()" :disabled="tradeQuantity <= 0">Buy</button>
    </div>
    <div v-if="canSell">
      <input type="number" v-model="tradeQuantity" min="0" :max="quantity" />
      <button @click="sell()" :disabled="tradeQuantity <= 0">Sell</button>
    </div>
  </p>
</template>
