
<script setup lang="ts">
import { computed } from 'vue'
import SETTINGS from '../settings'
import { useMainStore } from "../stores/index"
import { useCalendarStore } from "../stores/calendar"
import HealthBar from './HealthBar.vue';

const store = useMainStore()
const calendar = useCalendarStore()
const day = computed(() => new Date(calendar.currentDay))

const emit = defineEmits<{
  (e: 'openWeaponsDialog'): void
}>()

</script>

<template>
  <section>
    <div>
      <p style="text-transform: uppercase;">
        <strong>{{ day.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}} {{ day.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</strong> –
        Day {{ calendar.daysSinceStart }} of {{ SETTINGS.maxDays }}
      </p>

    </div>
    <div class="stats">
      <p class="text-green">Cash: ${{store.cash.toLocaleString(undefined, {minimumFractionDigits: 2})}}</p>
      <p class="text-green">Bank: ${{store.bank.toLocaleString(undefined, {minimumFractionDigits: 2})}}</p>
      <p class="text-red">Debt: ${{store.debt.toLocaleString(undefined, {minimumFractionDigits: 2})}}</p>
      <p>Weapon: {{store.activeWeapon}} <button class="secondary" v-if="store.weapons.length > 1" @click.prevent="emit('openWeaponsDialog')">Change</button></p>
      <HealthBar title="Health" :total="SETTINGS.startingHealth" :remaining="store.health" />
    </div>
  </section>
</template>


<style scoped>
p {
  margin:0
}

@media screen and (min-width: 768px) {
  .stats {
    display: flex;
    justify-content: space-between;
  }
}
</style>
