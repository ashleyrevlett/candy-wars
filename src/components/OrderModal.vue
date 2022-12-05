<script setup lang="ts">
import { ref, PropType, computed } from 'vue'
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

let tradeQuantity = ref(0)
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
</script>


<template>
  <section class="modal">
    <button class="cancel" @click="emit('closeForm')">X</button>
    <div>
      {{ spice.spiceType }}: ${{ inventory.transactionPrice(transactionType, spice).toLocaleString() }}
      <form>
        <label for="qty">Qty: </label>
        <input name="qty" type="number" v-model="tradeQuantity" min="0" :max="maxQuantity" />
        <button :disabled="maxQuantity == 0" type="submit" @click.prevent="transact">{{ transactionType }}</button>
      </form>
      <p>Max you can {{ transactionType?.toLowerCase() }}: <a href="/#" @click.prevent="(tradeQuantity = maxQuantity)">{{ maxQuantity }}</a></p>
    </div>
  </section>
</template>


<style scoped>

section {
  height: 200px;
  width: 320px;
  display: flex;
  flex-direction: column;
}

button.cancel {
  margin-left: auto;
}

div {
  padding: 1rem;
}

</style>
