<script setup lang="ts">
import { PropType } from 'vue'
import { Location } from '../models/Location'

const props = defineProps({
  locations: {
    type: Array as PropType<Array<Location>>,
    required: true
  },
  currentLocation: {
    type: Location,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'travelTo', index: number): void
}>()

</script>


<template>
  <section>
    <h4 class="text-center bold">Travel to...</h4>
    <div class="button-grid">
      <button v-for="(location, index) in locations" :key="location.name" :disabled="currentLocation.name == location.name" @click="emit('travelTo', index)" >{{ location.name }}</button>
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
</style>
