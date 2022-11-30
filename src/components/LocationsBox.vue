<script setup lang="ts">
import { computed } from 'vue'
import { travelTimeTo } from '../models/location.model'
import { useMainStore } from "../stores/index"

const mainStore = useMainStore()
const locations = computed(() => mainStore.locations)
const currentLocation = computed(() => mainStore.currentLocation)

const emit = defineEmits<{
  (e: 'advanceTime', days: number): void
}>()

function travelTo(index: number, days: number) {
  mainStore.travelTo(index)
  emit('advanceTime', days)
}
</script>


<template>
  <section>
    <h4 class="text-center bold">Travel to...</h4>
    <div class="button-grid">
      <button v-for="(location, index) in locations" :key="location.name" :disabled="currentLocation.name == location.name" @click="travelTo(index, travelTimeTo(currentLocation.position, location.position))" >
        {{ location.name }} <span v-if="location.position != currentLocation.position">({{ travelTimeTo(currentLocation.position, location.position) }} days journey)</span>
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
