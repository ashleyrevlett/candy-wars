<script setup lang="ts">
import { ref, PropType, computed, watch } from 'vue'
import { TradeGood } from '../models/tradegood.model'
import { GameState } from '../types'
import { useInventoryStore } from "../stores/inventory"

const props = defineProps({
  transactionType: {
    type: String as PropType<GameState>,
    required: true
  },
  spice: {
    type: Object as PropType<TradeGood>,
    required: true
  }
})

const inventory = useInventoryStore()

const maxQuantity = computed(() => {
  if (props.transactionType == 'Buy') {
    return Math.min(inventory.inventorySpace, inventory.maxBuyQuantity(props.spice.id))
  } else {
    return inventory.maxSellQuantity(props.spice.id)
  }
})

const emit = defineEmits<{
  (e: 'closeForm'): void,
  (e: 'buyDone'): void,
  (e: 'sellDone'): void,
}>()

let tradeQuantity = ref(maxQuantity.value)
function transact() {
  tradeQuantity.value = Math.min(maxQuantity.value, tradeQuantity.value)
  if (tradeQuantity.value == 0) return
  if (props.transactionType == 'Buy'){
    inventory.buy(props.spice.id, tradeQuantity.value)
    emit('buyDone')
  } else {
    inventory.sell(props.spice.id, tradeQuantity.value)
    emit('sellDone')
  }
  tradeQuantity.value = 0
}

const error = ref('')
watch(tradeQuantity, async (newVal, oldVal) => {
  if (newVal > maxQuantity.value || newVal <= 0) {
    error.value = 'Invalid quantity'
  } else if (error.value != '') {
    error.value = ''
  }
})

</script>


<template>
  <section class="modal">
    <button class="cancel" @click="emit('closeForm')">X</button>
    <div>
      <h4>{{ spice.spiceType }}: ${{ inventory.transactionPrice(transactionType, spice).toLocaleString() }}</h4>
      <form>
        <label for="qty">Qty: </label>
        <input name="qty" type="number" v-model="tradeQuantity" min="0" :max="maxQuantity" />
        <button :disabled="maxQuantity == 0 || error != ''" type="submit" @click.prevent="transact">{{ transactionType }}</button>
      </form>
      <p class="text-red error"> {{error}}</p>
    </div>
    <small>Max you can {{ transactionType?.toLowerCase() }}: {{ maxQuantity }}</small>
  </section>
</template>


<style scoped>

section {
  height: 200px;
  width: 320px;
  display: flex;
  flex-direction: column;
  text-align: center;
}

form {
  margin: 10px auto
}

.error {
  margin: 0
}

small {
  margin-top: auto;
}

button.cancel {
  margin-left: auto;
}

div {
  padding: 1rem;
}

</style>
