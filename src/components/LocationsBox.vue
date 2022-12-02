<script setup lang="ts">
import { travelTimeTo } from '../models/location.model'
import { useMainStore } from "../stores/index"

const store = useMainStore()

const emit = defineEmits<{
  (e: 'advanceTime', days: number): void
}>()

function travelTo(index: number, days: number) {
  store.travelTo(index)
  emit('advanceTime', days)
}
</script>


<template>
  <section>
    <h4 class="text-center bold">Travel to...</h4>
    <div class="button-grid">
      <button v-for="(location, index) in store.locations" :key="location.name" :disabled="store.currentLocation.name == location.name" @click="travelTo(index, travelTimeTo(store.currentLocation.position, location.position))" >
        {{ location.name }} <span v-if="location.position != store.currentLocation.position">({{ travelTimeTo(store.currentLocation.position, location.position) }} days journey)</span>
      </button>
    </div>
    <br />

  </section>
</template>


<style scoped>

section {
  border: 1px solid white;
  margin-bottom: 10px;
  padding: 10px;
}

h4 {
  margin:0 0 10px 0
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
}

button span {
  font-size: 10px;
  display: block;
}
</style>
