<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Location } from '../models/Location'

export default defineComponent({
  props: {
    locations: {
      // provide more specific type to `Object`
      type: Array as PropType<Array<Location>>,
      required: true
    },
    currentLocation: {
      // provide more specific type to `Object`
      type: Location,
      required: true
    }
  },
  setup(props) {
    props.locations,
    props.currentLocation
  }
})
</script>


<template>
  <section>
    <div>
      <p>Current Location: {{ currentLocation.name }}</p>
    </div>

    <p class="text-center bold">Travel to...</p>
    <div class="button-grid">
      <button v-for="(location, index) in locations" :key="location.name" :disabled="currentLocation.name == location.name" @click="$emit('travelTo', index)" >{{ location.name }}</button>
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

p {
  margin:0
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
}
</style>
