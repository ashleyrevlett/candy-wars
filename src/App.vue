<script setup lang="ts">
import { ref } from 'vue'

import Intro from './views/Intro.vue'
import Game from './views/Game.vue'

let showIntro = ref(true)

</script>

<template>
  <Intro v-if="showIntro" @start="showIntro = false" />
  <Game v-if="showIntro == false" />
</template>

<style scoped>
</style>
