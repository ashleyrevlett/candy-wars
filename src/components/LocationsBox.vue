<script setup lang="ts">
import { ref, computed } from 'vue'
import { travelTimeTo } from '../models/location.model'
import { useMainStore } from "../stores/index"
import travelSFX from '../assets/audio/car2.mp3'

const store = useMainStore()

const emit = defineEmits<{
  (e: 'advanceTime', days: number): void
}>()

const framesElapsed = ref(0)
const intID = ref(0)
const isTraveling = ref(false)
const travelAudio = new Audio(travelSFX)
function travelTo(index: number, days: number) {
  isTraveling.value = true
  travelAudio.play()
  intID.value = setInterval(() => {
    framesElapsed.value += 1
  }, 300)
  setTimeout(() => {
    isTraveling.value = false
    store.travelTo(index)
    clearInterval(intID.value)
    intID.value = 0
    framesElapsed.value = 0
    emit('advanceTime', days)
  }, 1500)
}

const activeFrameIndex = computed(() => Math.max(animFrames.length, framesElapsed.value))

const animFrames = [
`
  ______
 /|_||_|\\.__
(   _    _ _\\
 -(_)--(_)-
`,
`
          ______
         /|_||_|\\.__
        (   _    _ _\\
 o  .oOo=-(_)--(_)-
`,
`
                    ______
                   /|_||_|\\.__
                  (   _    _ _\\
 .    .  o. O ooOo=-(_)--(_)-
`,
`
                                   ______
                                  /|_||_|\\.__
                                 (   _    _ _\\
              . .    .o.  OO  ooOo=-(_)--(_)-
`,
`



                             .      . O   O ..
`
]

</script>


<template>
  <section>
    <h4 class="text-center bold">Travel to...</h4>
    <div class="button-grid" v-if="!isTraveling">
      <button v-for="(location, index) in store.locations" :key="location.name" :disabled="store.currentLocation.name == location.name" @click="travelTo(index, travelTimeTo(store.currentLocation.position, location.position))" >
        {{ location.name }} <span v-if="location.position != store.currentLocation.position">{{ travelTimeTo(store.currentLocation.position, location.position) }} {{ travelTimeTo(store.currentLocation.position, location.position) > 1 ? 'days' : 'day' }}</span>
      </button>
    </div>
    <div class="animation" v-else>
      <pre>
        {{ animFrames[framesElapsed] }}
      </pre>
    </div>
  </section>
</template>


<style scoped>
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

</style>
