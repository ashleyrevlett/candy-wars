
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMainStore } from "../stores/index"
import moneySFX from '../assets/audio/moneyCounter.mp3'

const store = useMainStore()

const emit = defineEmits<{
  (e: 'closeForm'): void
}>()

const maxDebtPayment = computed(() => {
  return Math.min(store.debt, store.cash)
})
const debtPayment = ref(maxDebtPayment.value)
const error = ref('')
watch(debtPayment, async (newVal, oldVal) => {
  if (newVal > maxDebtPayment.value || newVal <= 0) {
    error.value = 'Invalid payment'
  } else if (error.value != '') {
    error.value = ''
  }
})

const isPaying = ref(false)
const moneyAudio = new Audio(moneySFX);
moneyAudio.volume = 0.5
function doPayment() {
  if (isPaying.value) return
  isPaying.value = true
  moneyAudio.play()
  setTimeout(() => {
    store.payDebt(debtPayment.value)
    isPaying.value = false
    emit('closeForm')
  }, 800)
}
</script>


<template>
  <section class="modal">
    <button class="cancel" :disabled="isPaying" @click.prevent="emit('closeForm')">X</button>
    <div>
      <h4 class="text-center">Pay Loan</h4>
      <form>
        <label for="qty">Payment: </label>
        <input name="qty" type="number" v-model="debtPayment" min="0" :max="maxDebtPayment" />
        <button :disabled="isPaying || store.cash == 0 || debtPayment == 0 || error != ''" type="submit" @click.prevent="doPayment">Pay Now</button>
      </form>
      <p class="text-red error">{{error}}</p>
    </div>
    <p class="mt-auto">Debt Remaining: ${{ store.debt.toLocaleString() }}</p>
    <small>Max you can afford: ${{ maxDebtPayment.toLocaleString() }}</small>
  </section>
  <div class="modal-overlay-bg"></div>
</template>


<style scoped>

section {
  height: 200px;
  width: 320px;
  display: flex;
  flex-direction: column;
  text-align: center;
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

.error {
  margin: 0
}


</style>
