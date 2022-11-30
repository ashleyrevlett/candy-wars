
<script setup lang="ts">
import { ref, PropType, computed } from 'vue'
import { TradeGood } from '../models/tradegood.model'
import { GameState } from '../types'
import { useMainStore } from "../stores/index"

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

const mainStore = useMainStore()

const maxQuantity = computed(() => {
  if (props.transactionType == 'Buy') {
    return Math.min(mainStore.inventorySpace, mainStore.maxBuyQuantity(props.spice.id))
  } else {
    return mainStore.maxSellQuantity(props.spice.id)
  }
})

const price = computed(() => mainStore.getTransactionPrice(props.transactionType, props.spice))

let tradeQuantity = ref(0)

const emit = defineEmits<{
  (e: 'buy', spice: TradeGood, quantity: number): void,
  (e: 'sell', spice: TradeGood, quantity: number): void,
  (e: 'closeForm'): void,
}>()

function transact() {
  tradeQuantity.value = Math.min(maxQuantity.value, tradeQuantity.value)
  if (props.transactionType == 'Buy')
    emit('buy', props.spice, tradeQuantity.value)
  else
    emit('sell', props.spice, tradeQuantity.value)
  tradeQuantity.value = 0
}
</script>


<template>
  <section class="modal">
    <button class="cancel" @click="emit('closeForm')">X</button>
    <div>
      {{ spice.spiceType }}: ${{ price.toLocaleString() }}
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
