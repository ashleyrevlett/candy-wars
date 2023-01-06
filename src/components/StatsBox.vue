
<script setup lang="ts">
import { computed } from 'vue'
import SETTINGS from '../settings'
import { useMainStore } from "../stores/index"
import { useCalendarStore } from "../stores/calendar"
import HealthBar from './HealthBar.vue';

const store = useMainStore()
const calendar = useCalendarStore()
const day = computed(() => new Date(calendar.currentDay))

</script>

<template>
<div class="wrap">
   <div class="date">
      <p style="text-transform: uppercase;">
        <strong>{{ day.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}} {{ day.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</strong> –
        Day {{ calendar.daysSinceStart }} of {{ SETTINGS.maxDays }}
      </p>
    </div>
  <section>
    <div class="stats">
      <p class="text-green">Cash: <span>${{store.cash.toLocaleString(undefined, {minimumFractionDigits: 2})}}</span></p>
      <p class="text-green">Stash: <span>${{store.bank.toLocaleString(undefined, {minimumFractionDigits: 2})}}</span></p>
      <p class="text-red">Debt: <span>${{store.debt.toLocaleString(undefined, {minimumFractionDigits: 2})}}</span></p>
      <p>Weapon: <span>{{store.activeWeapon}}</span></p>
      <HealthBar title="Health" :total="SETTINGS.startingHealth" :remaining="store.health" />
    </div>
  </section>
</div>
</template>


<style scoped>

.wrap {
  width: 100%;
  margin: 0 5px;
}

.date {
  margin-bottom: .5rem;
}

p {
  margin:0
}

@media screen and (min-width: 768px) {
  .stats {
    display: flex;
    justify-content: space-between;

    span {
      display: block;
    }
  }
}

@media screen and (min-width: 768px) {
  :deep(.healthBar .label) {
    display: block;
  }
}
</style>
