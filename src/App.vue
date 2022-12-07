<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAuth, signInAnonymously } from "firebase/auth"

import Intro from './views/Intro.vue'
import Game from './views/Game.vue'
import Encounter from './views/Encounter.vue'
import ThemeSelector from './components/ThemeSelector.vue'

const showIntro = ref(true)
const loadGame = ref(false)
const activeEncounter = ref(false)

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
    <Game v-if="(!showIntro && !activeEncounter)" :loadGame="loadGame" @startEncounter="(activeEncounter=true)" @endGame="() => {loadGame = false; showIntro = true}" />
  </main>
</template>

<style scoped>
</style>
