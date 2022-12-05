
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMainStore } from "../stores/index"

const store = useMainStore()

const deposit = ref(store.cash)
const withdrawal = ref(store.bank)
const doDeposit = ref(false)
const doWithdrawal = ref(false)

const emit = defineEmits<{
  (e: 'closeForm'): void
}>()

const error = ref('')
watch(deposit, async (newVal, oldVal) => {
  if (!doDeposit.value) return
  if (newVal > store.cash || newVal <= 0) {
    error.value = 'Invalid amount'
  } else if (error.value != '') {
    error.value = ''
  }
})
watch(withdrawal, async (newVal, oldVal) => {
  if (!doWithdrawal.value) return
  if (newVal > store.bank || newVal <= 0) {
    error.value = 'Invalid amount'
  } else if (error.value != '') {
    error.value = ''
  }
})
</script>

<template>
  <section class="modal">
    <button class="cancel" @click.prevent="emit('closeForm')">X</button>
    <div class="buttons" v-if="!doWithdrawal && !doDeposit">
      <button @click.prevent="doDeposit = true; doWithdrawal = false" :disabled="(store.cash <= 0)">Deposit Cash</button>
      <button @click.prevent="doDeposit = false; doWithdrawal = true" :disabled="(store.bank <= 0)">Withdrawal Cash</button>
    </div>
    <div v-if="doDeposit">
      <h4>Deposit Cash</h4>
      <form>
        <label for="qty">$ </label>
        <input name="qty" type="number" v-model="deposit" min="0" :max="store.cash" />
        <button :disabled="error != ''" type="submit" @click.prevent="store.deposit(deposit); emit('closeForm')">Deposit</button>
      </form>
      <p class="text-red error">{{error}}</p>
      <small>Max you can deposit: ${{ store.cash.toLocaleString() }}</small>
    </div>
    <div v-if="doWithdrawal">
      <h4>Withdrawal Cash</h4>
      <form>
        <label for="qty">$ </label>
        <input name="qty" type="number" v-model="withdrawal" min="0" :max="store.bank" />
        <button :disabled="error != ''" type="submit" @click.prevent="store.withdrawal(withdrawal); emit('closeForm')">Withdrawal</button>
      </form>
      <p class="text-red error">{{error}}</p>
      <small>Max you can withdrawal: ${{ store.bank.toLocaleString() }}</small>
    </div>
    <p v-if="(doDeposit || doWithdrawal)"><a @click.prevent="doWithdrawal = false; doDeposit = false" href="/#">‹ Back</a></p>
  </section>
</template>


<style scoped>

section {
  height: 220px;
  width: 320px;
  display: flex;
  flex-direction: column;
  text-align: center;
}

button.cancel {
  margin-left: auto;
  margin-bottom: 10px;
}

div {
  padding: 0 10px;
}

h4 {
  margin: 0 0 10px 0;
}

p {
  margin-bottom: 10px;
}

p.error {
  margin: 5px 0 0;
}

small {
  display: inline-block;
  margin-top: 10px;
}

.buttons button {
  width: 100%;
  margin-bottom: 10px;
}

</style>
