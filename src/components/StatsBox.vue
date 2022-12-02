
<script setup lang="ts">
import { computed } from 'vue'
import SETTINGS from '../settings'
import { useMainStore } from "../stores/index"
import { useCalendarStore } from "../stores/calendar"

const store = useMainStore()
const calendar = useCalendarStore()
const day = computed(() => new Date(calendar.currentDay))

</script>

<template>
  <section>
    <div>
      <p>
        <strong>{{ day.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}}</strong><br />
        Day {{ calendar.daysSinceStart }} of {{ SETTINGS.maxDays }}
      </p>

    </div>
    <div>
      <p class="text-green">Cash: ${{store.cash.toLocaleString()}}</p>
      <p class="text-green">Bank: ${{store.bank.toLocaleString()}}</p>
      <p class="text-red">Debt: ${{store.debt.toLocaleString()}}</p>
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
