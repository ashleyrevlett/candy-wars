<script setup lang="ts">
import { ref } from 'vue'

import Intro from './views/Intro.vue'
import Game from './views/Game.vue'
import Encounter from './views/Encounter.vue'
import ThemeSelector from './components/ThemeSelector.vue'

const showIntro = ref(true)
const loadGame = ref(false)
const activeEncounter = ref(false)

</script>

<template>
  <ThemeSelector />
  <main class="app">
    <Intro v-if="(showIntro && !activeEncounter)" @start="showIntro=false" @load="loadGame=true; showIntro=false" />
    <Encounter v-if="activeEncounter" @resumeGame="activeEncounter=false; loadGame=true"  />
    <Game v-if="(!showIntro && !activeEncounter)" :loadGame="loadGame" @startEncounter="(activeEncounter=true)" />
  </main>
</template>

<style scoped>
</style>
