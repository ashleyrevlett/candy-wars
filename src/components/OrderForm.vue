
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
    price: {
      type: Number,
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
  <section class="modal">
    <button class="cancel" @click="$emit('closeForm')">X</button>
    <div>
      {{ spice.spiceType }}: ${{ price.toLocaleString() }}
      <form>
        <label for="qty">Qty: </label>
        <input name="qty" type="number" v-model="tradeQuantity" :min="allowedRange.min" :max="allowedRange.max" />
        <button :disabled="allowedRange.max == 0" type="submit" @click="(e) => { e.preventDefault(); transact() }">{{ transactionType }}</button>
      </form>
      <p>Max you can {{ transactionType?.toLowerCase() }}: <a href="/#" @click="(e) => { e.preventDefault(); tradeQuantity = allowedRange.max }">{{ allowedRange.max }}</a></p>
    </div>
  </section>
</template>


<style scoped>

section {
  height: 200px;
  width: 320px;
  display: flex;
  flex-direction: column;
  margin-left: -160px;
  margin-top: 100px;
}

button.cancel {
  margin-left: auto;
}

div {
  padding: 1rem;
}

</style>
