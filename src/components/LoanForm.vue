
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    debt: {
      type: Number,
      required: true
    },
    maxPayment: {
      type: Number,
      required: true
    },
  },
  setup(props) {
    props.debt,
    props.maxPayment
  },
  data() {
    return {
      debtPayment : 0,
    }
  },
  methods: {
    payNow() {
      console.log("paying!")
      this.$emit('payLoan', this.debtPayment)
    }
  }
})
</script>


<template>
  <section class="modal">
    <button class="cancel" @click="$emit('closeForm')">X</button>
    <div>
      <h4>Pay Loan</h4>
      Debt: ${{ debt?.toLocaleString() }}
      <form>
        <label for="qty">Payment: </label>
        <input name="qty" type="number" v-model="debtPayment" min="0" :max="maxPayment" />
        <button :disabled="maxPayment == 0 || debtPayment == 0" type="submit" @click="(e) => { e.preventDefault(); payNow() }">Pay Now</button>
      </form>
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
}

h4 {
  margin: 0;
}

p {
  margin-bottom: 10px;
}

</style>
