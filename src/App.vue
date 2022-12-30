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

function newGame() {
  showIntro.value = true
  loadGame.value = false
  activeEncounter.value = false
  endgameState.value = null
}

</script>

<template>
  <aside class="utilities">
    <button v-if="!showIntro" @click.prevent="newGame()">New Game</button>
    <ThemeSelector />
  </aside>
  <main class="app">
    <Intro v-if="(showIntro && !activeEncounter)" @start="showIntro=false" @load="loadGame=true; showIntro=false" />
    <Encounter v-if="activeEncounter" @resumeGame="activeEncounter=false; loadGame=true"  />
    <Game
      v-if="(!showIntro && !activeEncounter && !endgameState)"
      :loadGame="loadGame"
      @startEncounter="(activeEncounter=true)"
      @restartGame="newGame()"
      @lose="endgameState = 'Lose'"
      @win="endgameState = 'Win'"
       />
    <GameOver v-if="endgameState" :gameState="endgameState" @restartGame="newGame()" />
  </main>
</template>

<style scoped>
.utilities {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 2px;
  z-index: 15;

  button {
    background-color: transparent;
    border: 0;
    color: var(--text-color);
    font-size: 12px;
    text-decoration: underline;
  }
}
</style>
