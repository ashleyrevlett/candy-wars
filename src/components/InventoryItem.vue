<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { TransactionType } from '../types'

export default defineComponent({
  props: {
    name: String,
    quantity: Number,
    price: Number,
    disabled: Boolean,
    transactionType: {
      type: String as PropType<TransactionType>,
        required: true
    },
  },
  setup(props) {
    props.name,
    props.quantity,
    props.price,
    props.transactionType,
    props.disabled
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
