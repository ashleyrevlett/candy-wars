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
      this.tradeQuantity = 0
    },
    buy() {
      this.$emit('buy', this.tradeQuantity)
      console.log(`Buying ${this.tradeQuantity} ${this.name}!`)
      this.tradeQuantity = 0
    },
  }
})
</script>


<template>
  <section>
    <p>{{name}}: ${{price?.toLocaleString()}} x{{quantity}}</p>
    <div class="actions" v-if="canBuy">
      <input type="number" v-model="tradeQuantity" min="0" :max="quantity" />
      <button @click="buy()" :disabled="tradeQuantity <= 0">Buy</button>
    </div>
    <div class="actions" v-if="canSell">
      <input type="number" v-model="tradeQuantity" min="0" :max="quantity" />
      <button @click="sell()" :disabled="tradeQuantity <= 0">Sell</button>
    </div>
  </section>
</template>


<style scoped>
section {
  display: flex;
}

p {
  margin-right: 10px;
}
.actions {
  margin-left: auto;
}

input[type="number"] {
  width: 50px;
}
</style>
