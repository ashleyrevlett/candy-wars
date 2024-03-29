
<script setup lang="ts">
import { ref, Ref, watch } from 'vue'
import { useMainStore } from "../stores/index"
import moneySFX from '../assets/audio/cashRegister.mp3'

const store = useMainStore()

type TransactionState = 'Deposit' | 'Withdrawal' | 'Choose'
const state : Ref<TransactionState> = ref('Choose')
const deposit = ref(store.cash)
const withdrawal = ref(store.bank)

const emit = defineEmits<{
  (e: 'closeForm'): void
}>()

const error = ref('')
watch(deposit, async (newVal, oldVal) => {
  if (state.value != 'Deposit') return
  if (newVal > store.cash || newVal <= 0) {
    error.value = 'Invalid amount'
  } else if (error.value != '') {
    error.value = ''
  }
})
watch(withdrawal, async (newVal, oldVal) => {
  if (state.value != 'Withdrawal') return
  if (newVal > store.bank || newVal <= 0) {
    error.value = 'Invalid amount'
  } else if (error.value != '') {
    error.value = ''
  }
})

const isPaying = ref(false)
const moneyAudio = new Audio(moneySFX);
moneyAudio.volume = 0.5
function doPayment(transaction : TransactionState) {
  if (isPaying.value) return
  isPaying.value = true
  moneyAudio.play()
  setTimeout(() => {
    if (transaction == 'Deposit') {
      store.deposit(deposit.value)
    } else {
      store.withdrawal(withdrawal.value)
    }
    isPaying.value = false
    emit('closeForm')
  }, 800)
}
</script>

<template>
  <section class="modal">
    <button class="cancel" @click.prevent="emit('closeForm')">X</button>
    <div class="buttons" v-if="state == 'Choose'">
      <button @click.prevent="state = 'Deposit'" :disabled="(store.cash <= 0)">Stash Cash</button>
      <button @click.prevent="state = 'Withdrawal'" :disabled="(store.bank <= 0)">Take Cash</button>
      <button @click.prevent="emit('closeForm')">Leave Locker</button>
    </div>
    <div v-if="state == 'Deposit'">
      <h4>Stash Cash</h4>
      <form>
        <label for="qty">$ </label>
        <input name="qty" type="number" v-model="deposit" min="0" :max="store.cash" />
        <button :disabled="(error != '' || isPaying)" type="submit" @click.prevent="doPayment('Deposit')">Put in Locker</button>
      </form>
      <p class="text-red error">{{error}}</p>
      <small>Max you can stash: ${{ store.cash.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</small>
    </div>
    <div v-if="state == 'Withdrawal'">
      <h4>Withdrawal Cash</h4>
      <form>
        <label for="qty">$ </label>
        <input name="qty" type="number" v-model="withdrawal" min="0" :max="store.bank" />
        <button :disabled="(error != '' || isPaying)" type="submit" @click.prevent="doPayment('Withdrawal')">Take from Locker</button>
      </form>
      <p class="text-red error">{{error}}</p>
      <small>Max you can take: ${{ store.bank.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</small>
    </div>
    <p v-if="state != 'Choose'"><a @click.prevent="state = 'Choose'" href="/#">‹ Back</a></p>
  </section>
  <div class="modal-overlay-bg"></div>
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
