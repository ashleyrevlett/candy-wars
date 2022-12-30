
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useFirestore } from 'vuefire'
import { getDocs } from 'firebase/firestore'
import { query, orderBy, limit, collection } from 'firebase/firestore'

import HighScores from './HighScores.vue';

import SETTINGS from '../settings'
import { useMainStore } from "../stores/index"
import { useCalendarStore } from "../stores/calendar"
import winSFX from '../assets/audio/gameWin.wav'

const store = useMainStore()
const calendar = useCalendarStore()

const endWorth = computed(() => store.bank + store.cash)

const emit = defineEmits<{
  (e: 'restart'): void,
}>()

const enterHighScore = ref(false)

// check to see if this is in high scores list
const db = useFirestore()
const coll = collection(db, 'scores')
const q = query(coll, orderBy('score', 'desc'), limit(5))
const gotHighScore = ref(false)
const winAudio = new Audio(winSFX)
winAudio.volume = 0.3
onMounted(() => {
  const querySnapshot = getDocs(q).then(results => {
    const scores = results.docs.map(x => x.data().score)
    if (scores.length > 0 && endWorth.value > scores[scores.length-1]) {
      gotHighScore.value = true
    }
    winAudio.play()
  })
})
</script>


<template>

  <HighScores
    v-if="enterHighScore"
    @restart="emit('restart')"
  />

  <section v-else class="modal">
    <div class="text-center">
      <h3>You Win!</h3>
      <p>Congratulations! You successfully paid off your loan within the time limit!</p>
      <p>${{SETTINGS.debt.toLocaleString()}} repaid in {{calendar.daysSinceStart}} days.</p>
      <p class="text-green">Net Worth: ${{endWorth.toLocaleString()}}</p>
      <div class="highScoreBox" v-if="gotHighScore">
        <h4 class="text-green">You got a high score!</h4>
        <button class="alt" @click.prevent="enterHighScore=true">Enter High Score</button>
      </div>
    </div>
    <div class="flex">
      <button @click.prevent="emit('restart')">Play Again</button>
    </div>
  </section>

  <div class="modal-overlay-bg"></div>

</template>


<style scoped>

section {
  height: auto;
  width: 420px;
  max-width: 90%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

div {
  padding: 0 10px 10px 10px;
  margin-bottom: 10px;
}

.highScoreBox {
  margin-top: 20px;
  margin-bottom: 0;
  padding-bottom: 0;
}

h3 {
  margin: 25px 0 10px 0;
}

p {
  margin: 0;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

button {
  margin: 5px 5px 0 5px;
}

button.alt {
  background-color: var(--bg-color);
  border-color: var(--success-color);
  color: var(--success-color);

  &:hover {
    background-color: var(--success-color);
    color: var(--bg-color);
  }
}

.modal-overlay-bg {
  background: var(--success-color);
}

</style>
