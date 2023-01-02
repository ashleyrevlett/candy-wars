<script setup lang="ts">
import { ref } from 'vue'
import { useMainStore } from "../stores/index"
import travelSFX from '../assets/audio/hallway.wav'

const store = useMainStore()

const emit = defineEmits<{
  (e: 'advanceTime', days: number): void,
  (e: 'closeForm'): void
}>()

const travelAudio = new Audio(travelSFX)
travelAudio.volume = 0.5
const isTraveling = ref(false)

function travel(name: string) {
  if (isTraveling.value) return

  travelAudio.play()
  isTraveling.value = true
  const idx = store.getLocationIndex(name)
  if (idx == undefined) return

  setTimeout(() => {
    store.travelTo(idx)
    emit('advanceTime', 1)
    isTraveling.value = false
  }, 1500)
}

function isActive(loc: string) {
  if (loc == store.currentLocation.name) {
    return true
  }
  return false
}
</script>


<template>
  <section class="modal">
    <button :disabled="isTraveling" class="cancel" @click.prevent="emit('closeForm')">X</button>
    <h4 v-if="!isTraveling" class="text-center bold">Travel to...</h4>
    <h4 v-else>... Traveling ...</h4>
    <div class="map">
<pre>
                          =--------------------------=
                          |                          |
         +----------------+                          |
  +------+                |                          |
  | ART  |     MUSIC      |            <span :class="{ active: isActive('Gym') }" @click="travel('Gym')">GYM</span>           |-------------------+
  | ROOM |     ROOM       |                          |    MAIN           |
  |      |                |                          |    OFFICE         |
  |------|----------------|-----------+=   =+--------|-------------------|
  =                           <span :class="{ active: isActive('Hallway') }" @click="travel('Hallway')">HALL</span>                                       =
  =                                                                      =
  |---------+   +---------+-----------+     +--------+----------+--------|
  |  MR.    |   | MS.     |           |     |        |  MS.     | MS.    |
  |  GREEN  |   | BLUE    |           |     |  <span :class="{ active: isActive('Bathroom') }" @click="travel('Bathroom')">REST</span>  |  MABRY   | HILL   |
  |---------+= =+---------|  <span :class="{ active: isActive('Library') }" @click="travel('Library')">LIBRARY</span>  |     |  <span :class="{ active: isActive('Bathroom') }" @click="travel('Bathroom')">ROOM</span>  |----------+--------+
  |                       |           |     |        |
  -|                      |           |     |        |
   =     <span :class="{ active: isActive('Playground') }" @click="travel('Playground')">PLAYGROUND</span>       +-----------+=   =+--------+
   |-                     |                          |
     --|-                 |         <span :class="{ active: isActive('Cafeteria') }" @click="travel('Cafeteria')">CAFETERIA</span>        |
         -----------------|                          |
                          |                          |
                          =--------------------------=
</pre>
</div>
  </section>
  <div class="modal-overlay-bg"></div>
</template>


<style scoped>

section {
  min-height: 200px;
  width: 550px;
  display: flex;
  flex-direction: column;
  text-align: center;
}

button.cancel {
  margin-left: auto;
}

h4 {
  margin:0 0 10px 0
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
}

.button-grid,
.animation {
  height: 146px;
  overflow: hidden;
}

button span {
  font-size: 10px;
  display: block;
}

.map {
  font-family: monospace;
  white-space: pre;
  display: block;
  text-align: left;

  span {
    cursor: pointer;
    color: var(--success-color);

    &:hover {
      text-decoration: underline;
    }

    &.active {
      color: var(--warning-color);
      cursor: text;
      text-decoration: none !important;
    }
  }
}

</style>
