
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    day: Date,
    playerName: String,
    location: String,
    cash: Number
  },
  setup(props) {
    props.day,
    props.playerName,
    props.location,
    props.cash
  }
})
</script>


<template>
  <section>
    <div>
      <p>{{ location }}</p>
      <p>{{ day?.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}}</p>
    </div>
    <p>{{playerName}}: ${{cash?.toLocaleString()}}</p>
  </section>
</template>


<style scoped>
section {
  display: flex;
  width: 100%;
}

p {
  margin-right: 10px;
}
.actions {
  margin-left: auto;
}

input[type="number"] {
  width: 50px;
}
</style>
