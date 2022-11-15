
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    day: Date,
    cash: Number,
    debt: Number,
    bank: Number
  },
  setup(props) {
    props.day,
    props.cash
    props.debt
    props.bank
  }
})
</script>


<template>
  <section>
    <div>
      <p>{{ day?.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}}</p>
    </div>
    <div>
      <p class="text-green">Cash: ${{cash?.toLocaleString()}}</p>
      <p class="text-green">Bank: ${{bank?.toLocaleString()}}</p>
      <p class="text-red">Debt: ${{debt?.toLocaleString()}}</p>
    </div>
  </section>
</template>


<style scoped>

section {
  border: 1px solid white;
  margin-bottom: 10px;
  padding: 10px;
}

p {
  margin:0
}
.actions {
  margin-left: auto;
}

input[type="number"] {
  width: 50px;
}
</style>
