<script setup lang="ts">
import { ref } from 'vue'

import Intro from './views/Intro.vue'
import Game from './views/Game.vue'
import ThemeSelector from './components/ThemeSelector.vue'

const showIntro = ref(true)
const loadGame = ref(false)

</script>

<template>
  <ThemeSelector />
  <main class="app">
    <Intro v-if="showIntro" @start="showIntro=false" @load="loadGame=true; showIntro=false" />
    <Game v-if="showIntro == false" :loadGame="loadGame" />
  </main>
</template>

<style scoped>
</style>
