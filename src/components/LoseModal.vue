
<script lang="ts">
import { defineComponent } from 'vue'
import SETTINGS from '../settings'

export default defineComponent({
  props: {
    totalDays: {
      type: Number,
      required: true
    },
    debtRemaining: {
      type: Number,
      required: true
    },
    endWorth: {
      type: Number,
      required: true
    },
  },
  setup(props) {
    props.totalDays,
    props.endWorth
  },
  computed: {
    startingDebt() {
      return SETTINGS.debt
    },
    debtPaid() {
      return Math.max(0, SETTINGS.debt - this.debtRemaining)
    }
  }
})
</script>


<template>
  <div>
    <section class="modal">
      <div class="text-center">
        <h3>You Lost!</h3>
        <p>You didn't repay your loan within the time limit!</p>
        <p>${{debtPaid.toLocaleString()}} of ${{startingDebt.toLocaleString()}} loan repaid in {{totalDays - 1}} days.</p>
        <p class="text-green">Net Worth: ${{endWorth.toLocaleString()}}</p>
      </div>
      <div class="flex">
        <button @click.prevent="$emit('restart')">New Game</button>
      </div>
    </section>
    <div class="modal-overlay-bg"></div>
  </div>
</template>


<style scoped>

section {
  height: 250px;
  width: 400px;
  display: flex;
  flex-direction: column;
  margin-left: -200px;
  margin-top: 100px;
  z-index: 1;
}

div {
  padding: 0 10px 10px 10px;
  margin-bottom: 10px;
}

h3 {
  margin: 25px 0 10px 0;
}

p {
  margin: 0;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

button {
  margin: 5px 5px 0 5px;
}

</style>
