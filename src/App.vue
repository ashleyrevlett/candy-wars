<script setup lang="ts">
import { ref } from 'vue'

import Intro from './views/Intro.vue'
import Game from './views/Game.vue'

let showIntro = ref(true)
let loadGame = ref(false)

</script>

<template>
  <Intro v-if="showIntro" @start="showIntro=false" @load="loadGame=true; showIntro=false" />
  <Game v-if="showIntro == false" :loadGame="loadGame" />
</template>

<style scoped>
</style>
