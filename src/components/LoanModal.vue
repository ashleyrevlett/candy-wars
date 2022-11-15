
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  debt: {
      type: Number,
      required: true
    },
    maxPayment: {
      type: Number,
      required: true
    }
})

const debtPayment = ref(0)

const emit = defineEmits<{
  (e: 'closeForm'): void
  (e: 'payLoan', debtPayment: number): void
}>()

function payNow() {
    emit('payLoan', debtPayment.value)
}
</script>


<template>
  <section class="modal">
    <button class="cancel" @click="$emit('closeForm')">X</button>
    <div>
      <h4 class="text-center">Pay Loan</h4>
      <form>
        <label for="qty">Payment: </label>
        <input name="qty" type="number" v-model="debtPayment" min="0" :max="maxPayment" />
        <button :disabled="maxPayment == 0 || debtPayment == 0" type="submit" @click="(e) => { e.preventDefault(); payNow() }">Pay Now</button>
      </form>
      <p>Debt Remaining: ${{ debt?.toLocaleString() }}</p>
      <p>Max you can afford: <a href="/#" @click="(e) => { e.preventDefault(); debtPayment = maxPayment; }">${{ maxPayment.toLocaleString() }}</a></p>
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
  padding: 0 10px 10px 10px;
  margin-bottom: 10px;
}

h4 {
  margin: 0 0 10px 0;
}

form {
  margin-bottom: 10px;
}

p {
  margin: 0;
}

</style>
