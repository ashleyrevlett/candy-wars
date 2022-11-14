
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Spice } from '../models/Spice';
import { NumberRange, TransactionType } from '../types'

export default defineComponent({
  props: {
    transactionType: {
      type: String as PropType<TransactionType>,
      required: false
    },
    spice: {
      type: Object as PropType<Spice>,
      required: true
    },
    allowedRange: {
      type: Object as PropType<NumberRange>,
      required: true
    },
  },
  setup(props) {
    props.transactionType,
    props.spice,
    props.allowedRange
  },
  data() {
    return {
      tradeQuantity : this.allowedRange.min,
    }
  },
  methods: {
    transact() {
      if (!this.transactionType) return
      this.tradeQuantity = Math.min(this.allowedRange.max, this.tradeQuantity)

      this.$emit(this.transactionType.toLowerCase(), this.spice.spiceType, this.tradeQuantity)
      console.log(`${this.transactionType.toLowerCase()} ${this.tradeQuantity} ${this.spice.spiceType}!`)
      this.tradeQuantity = this.allowedRange.min
    },
  }
})
</script>


<template>
  <section>
    <button class="cancel" @click="$emit('closeForm')">X</button>
    <div>
      {{ spice.spiceType }}: ${{ spice.price.toLocaleString() }}
      <form>
        <label for="qty">Qty: </label>
        <input name="qty" type="number" v-model="tradeQuantity" :min="allowedRange.min" :max="allowedRange.max" />
        <button type="submit" @click="(e) => { e.preventDefault(); transact() }">{{ transactionType }}</button>
      </form>
      <p>Max you can {{ transactionType?.toLowerCase() }}: <a href="/#" @click="(e) => { e.preventDefault(); tradeQuantity = allowedRange.max }">{{ allowedRange.max }}</a></p>
    </div>
  </section>
</template>


<style scoped>

section {
  border: 1px solid white;
  height: 200px;
  width: 320px;
  background-color: black;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 50%;
  margin-left: -160px;
  margin-top: 100px;
  z-index: 1;
  box-shadow: 5px 5px rgba(66, 66, 66,.8);
}

button.cancel {
  margin-left: auto;
}

div {
  padding: 1rem;
}

</style>
