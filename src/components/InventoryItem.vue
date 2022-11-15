<script setup lang="ts">
import { PropType } from 'vue'
import { TransactionType } from '../types'

const props = defineProps({
  name: String,
  quantity: Number,
  price: Number,
  disabled: Boolean,
  transactionType: {
    type: String as PropType<TransactionType>,
    required: true
  },
})
</script>


<template>
  <tr>
    <td>
      {{name}}
    </td>
    <td v-if="quantity != undefined">
      {{quantity}}
    </td>
    <td>
      ${{price?.toLocaleString()}}
    </td>
    <td>
      <div class="actions">
        <button :disabled="disabled || price == undefined || price == 0" @click="$emit('order')">{{ transactionType }}</button>
      </div>
    </td>

  </tr>
</template>


<style scoped>
section {
  display: flex;
  align-items: baseline;
}

</style>
