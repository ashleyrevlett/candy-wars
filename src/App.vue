<script setup lang="ts">
import { ref, Ref, onMounted } from 'vue'
import { getAuth, signInAnonymously } from "firebase/auth"

import { GameState } from './types'
import Intro from './views/Intro.vue'
import Game from './views/Game.vue'
import Encounter from './views/Encounter.vue'
import DayEnd from './views/DayEnd.vue'
import GameOver from './views/GameOver.vue'
import ThemeSelector from './components/ThemeSelector.vue'
import HighScoreList from './components/HighScoreList.vue'
import DraggableModal from './components/DraggableModal.vue'
import PriceList from './components/PriceList.vue'

const showIntro = ref(true)
const continueGame = ref(false)
const activeEncounter = ref(false)
const showHighScores = ref(false)
const showPriceList = ref(false)
const dayEnd = ref(false)
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
  continueGame.value = false
  dayEnd.value = false
  activeEncounter.value = false
  endgameState.value = null
  localStorage.removeItem('mainStore')
  localStorage.removeItem('calendarStore')
  localStorage.removeItem('inventoryStore')
}
</script>

<template>
  <aside class="utilities">
    <button v-if="!showIntro" @click.prevent="newGame()">New Game</button>
    <button v-if="!showIntro" @click.prevent="showHighScores = true">High Scores</button>
    <button v-if="!showIntro" @click.prevent="showPriceList = true">Price List</button>
    <ThemeSelector />
  </aside>
  <main class="app">
    <DraggableModal v-if="showPriceList" @closeWindow="showPriceList=false">
      <PriceList />
    </DraggableModal>
    <HighScoreList v-if="showHighScores" @closeWindow="showHighScores = false" />
    <Intro v-if="(showIntro && !activeEncounter)" @start="showIntro=false" @load="continueGame=true; showIntro=false" />
    <Encounter v-if="activeEncounter" @resumeGame="activeEncounter=false; continueGame=true"  />
    <Game
      v-if="(!showIntro && !activeEncounter && !endgameState && !dayEnd)"
      :continueGame="continueGame"
      @startEncounter="(activeEncounter=true)"
      @restartGame="newGame()"
      @lose="endgameState = 'Lose'"
      @win="endgameState = 'Win'"
      @dayEnd="(dayEnd = true)"
       />
    <DayEnd v-if="dayEnd" @resumeGame="dayEnd=false; continueGame=true" />
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
    padding-left: 0;
  }
}
</style>
