<script setup lang="ts">
import { PropType } from 'vue'
import { TransactionType } from '../types'
import { TradeGood } from '../models/tradegood.model';

const props = defineProps({
  good:  {
    type: Object as PropType<TradeGood>,
    required: true
  },
  transactionType: {
    type: String as PropType<TransactionType>,
    required: true
  },
  disabled: Boolean,
})
</script>


<template>
  <tr>
    <td>
      {{good.spiceType}}
    </td>
    <td v-if="!good.location">
      {{good.quantity}}
    </td>
    <td>
      ${{good.price?.toLocaleString()}}
    </td>
    <td>
      <div class="actions">
        <button :disabled="disabled || good.price == undefined || good.price == 0" @click="$emit('order')">{{ transactionType }}</button>
      </div>
    </td>

  </tr>
</template>


<style scoped>
section {
  display: flex;
  align-items: baseline;
}

.actions {
  text-align: right;
}

</style>
