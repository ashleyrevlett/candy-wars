
<script setup lang="ts">
import { ref, PropType } from 'vue'
import { Spice } from '../models/Spice';
import { NumberRange, GameState, SpiceType } from '../types'

const props = defineProps({
  transactionType: {
    type: String as PropType<GameState>,
    required: true
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
})

let tradeQuantity = ref(props.allowedRange.min)

const emit = defineEmits<{
  (e: 'buy', spice: SpiceType, quantity: number): void,
  (e: 'sell', spice: SpiceType, quantity: number): void,
  (e: 'closeForm'): void,
}>()

function transact() {
  tradeQuantity.value = Math.min(props.allowedRange.max, tradeQuantity.value)
  if (props.transactionType == 'Buy')
    emit('buy', props.spice.spiceType, tradeQuantity.value)
  else
    emit('sell', props.spice.spiceType, tradeQuantity.value)
  tradeQuantity.value = props.allowedRange.min
}
</script>


<template>
  <section class="modal">
    <button class="cancel" @click="emit('closeForm')">X</button>
    <div>
      {{ spice.spiceType }}: ${{ price.toLocaleString() }}
      <form>
        <label for="qty">Qty: </label>
        <input name="qty" type="number" v-model="tradeQuantity" :min="allowedRange.min" :max="allowedRange.max" />
        <button :disabled="allowedRange.max == 0" type="submit" @click.prevent="transact">{{ transactionType }}</button>
      </form>
      <p>Max you can {{ transactionType?.toLowerCase() }}: <a href="/#" @click.prevent="tradeQuantity = allowedRange.max">{{ allowedRange.max }}</a></p>
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
