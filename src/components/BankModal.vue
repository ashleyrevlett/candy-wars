
<script setup lang="ts">
import { ref } from 'vue'
import { useMainStore } from "../stores/index"

const store = useMainStore()

const deposit = ref(0)
const withdrawal = ref(0)
const doDeposit = ref(false)
const doWithdrawal = ref(false)

const emit = defineEmits<{
  (e: 'closeForm'): void
}>()
</script>

<template>
  <section class="modal">
    <button class="cancel" @click.prevent="emit('closeForm')">X</button>
    <div class="buttons" v-if="!doWithdrawal && !doDeposit">
      <button @click.prevent="doDeposit = true; doWithdrawal = false">Deposit Cash</button>
      <button @click.prevent="doDeposit = false; doWithdrawal = true">Withdrawal Cash</button>
    </div>
    <div v-if="doDeposit">
      <h4 class="text-center">Deposit Cash</h4>
      <form>
        <label for="qty">Amount: </label>
        <input name="qty" type="number" v-model="deposit" min="0" :max="store.cash" />
        <button :disabled="store.cash == 0 || deposit == 0" type="submit" @click.prevent="store.deposit(deposit); emit('closeForm')">Deposit</button>
      </form>
      <p>Max you can deposit: <a href="/#" @click.prevent="deposit = store.cash">${{ store.cash.toLocaleString() }}</a></p>
      <a @click.prevent="doDeposit = false" href="/#">‹ Back</a>
    </div>
    <div v-if="doWithdrawal">
      <h4 class="text-center">Withdrawal Cash</h4>
      <form>
        <label for="qty">Amount: </label>
        <input name="qty" type="number" v-model="withdrawal" min="0" :max="store.bank" />
        <button :disabled="store.bank == 0 || withdrawal == 0" type="submit" @click.prevent="store.withdrawal(withdrawal); emit('closeForm')">Withdrawal</button>
      </form>
      <p>Max you can withdrawal: <a href="/#" @click.prevent="(withdrawal = store.bank)">${{ store.bank.toLocaleString() }}</a></p>
      <a @click.prevent="doWithdrawal = false" href="/#">‹ Back</a>
    </div>
  </section>
</template>


<style scoped>

section {
  height: 220px;
  width: 320px;
  display: flex;
  flex-direction: column;
}

button.cancel {
  margin-left: auto;
  margin-bottom: 10px;
}

div {
  padding: 0 10px 10px 10px;
}

h4 {
  margin: 0 0 10px 0;
}

p {
  margin-bottom: 10px;
}

.buttons button {
  width: 100%;
  margin-bottom: 10px;
}

</style>
