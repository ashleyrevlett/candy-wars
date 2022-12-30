<script setup lang="ts">
import { ref, Ref, onMounted } from 'vue'
import { getAuth, signInAnonymously } from "firebase/auth"

import { GameState } from './types'
import Intro from './views/Intro.vue'
import Game from './views/Game.vue'
import Encounter from './views/Encounter.vue'
import GameOver from './views/GameOver.vue'
import ThemeSelector from './components/ThemeSelector.vue'

const showIntro = ref(true)
const loadGame = ref(false)
const activeEncounter = ref(false)
const endgameState: Ref<GameState | null> = ref(null)

onMounted(() => {
  // sign in anonymously to firebase so we can access high scores
  const auth = getAuth();
  signInAnonymously(auth)
    .then(() => {
      console.log("login success")
    })
    .catch((error) => {
      console.log("login error:", error);
    });
})

</script>

<template>
  <ThemeSelector />
  <main class="app">
    <Intro v-if="(showIntro && !activeEncounter)" @start="showIntro=false" @load="loadGame=true; showIntro=false" />
    <Encounter v-if="activeEncounter" @resumeGame="activeEncounter=false; loadGame=true"  />
    <Game
      v-if="(!showIntro && !activeEncounter && !endgameState)"
      :loadGame="loadGame"
      @startEncounter="(activeEncounter=true)"
      @restartGame="() => {loadGame = false; showIntro = true}"
      @lose="endgameState = 'Lose'"
      @win="endgameState = 'Win'"
       />
    <GameOver v-if="endgameState" :gameState="endgameState" @restartGame="() => {loadGame = false; showIntro = true; endgameState = null}" />
  </main>
</template>

<style scoped>
</style>
