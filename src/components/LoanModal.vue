
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMainStore } from "../stores/index"

const store = useMainStore()

const debtPayment = ref(0)

const maxDebtPayment = computed(() => {
  return Math.min(store.debt, store.cash)
})

const emit = defineEmits<{
  (e: 'closeForm'): void
}>()

</script>


<template>
  <section class="modal">
    <button class="cancel" @click.prevent="emit('closeForm')">X</button>
    <div>
      <h4 class="text-center">Pay Loan</h4>
      <form>
        <label for="qty">Payment: </label>
        <input name="qty" type="number" v-model="debtPayment" min="0" :max="maxDebtPayment" />
        <button :disabled="store.cash == 0 || debtPayment == 0" type="submit" @click.prevent="store.payDebt(debtPayment); emit('closeForm')">Pay Now</button>
      </form>
      <p>Debt Remaining: ${{ store.debt.toLocaleString() }}</p>
      <p>Max you can afford: <a href="/#" @click.prevent="(debtPayment=maxDebtPayment)">${{ maxDebtPayment.toLocaleString() }}</a></p>
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
