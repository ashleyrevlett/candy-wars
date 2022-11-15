
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
    maxDeposit: {
      type: Number,
      required: true
    },
    maxWithdrawal: {
      type: Number,
      required: true
    }
})

const deposit = ref(0)
const withdrawal = ref(0)
const doDeposit = ref(false)
const doWithdrawal = ref(false)

</script>

<template>
  <section class="modal">
    <button class="cancel" @click="$emit('closeForm')">X</button>
    <div class="buttons" v-if="!doWithdrawal && !doDeposit">
      <button @click.prevent="doDeposit = true; doWithdrawal = false">Deposit Cash</button>
      <button @click.prevent="doDeposit = false; doWithdrawal = true">Withdrawal Cash</button>
    </div>
    <div v-if="doDeposit">
      <h4 class="text-center">Deposit Cash</h4>
      <form>
        <label for="qty">Amount: </label>
        <input name="qty" type="number" v-model="deposit" min="0" :max="maxDeposit" />
        <button :disabled="maxDeposit == 0 || deposit == 0" type="submit" @click.prevent="$emit('deposit', deposit)">Deposit</button>
      </form>
      <p>Max you can deposit: <a href="/#" @click.prevent="deposit = maxDeposit">${{ maxDeposit.toLocaleString() }}</a></p>
      <a @click.prevent="doDeposit = false" href="/#">‹ Back</a>
    </div>
    <div v-if="doWithdrawal">
      <h4 class="text-center">Withdrawal Cash</h4>
      <form>
        <label for="qty">Amount: </label>
        <input name="qty" type="number" v-model="withdrawal" min="0" :max="maxWithdrawal" />
        <button :disabled="maxWithdrawal == 0 || withdrawal == 0" type="submit" @click.prevent="$emit('withdrawal', withdrawal)">Withdrawal</button>
      </form>
      <p>Max you can withdrawal: <a href="/#" @click.prevent="withdrawal = maxWithdrawal">${{ maxWithdrawal.toLocaleString() }}</a></p>
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
  margin-left: -160px;
  margin-top: 100px;
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
