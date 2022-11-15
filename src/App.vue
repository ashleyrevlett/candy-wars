<script lang="ts">
import { defineComponent } from 'vue'

import Intro from './views/Intro.vue'
import Game from './views/Game.vue'

export default defineComponent({
  components: {
    Intro,
    Game
  },
  data() {
    return {
      showIntro: true,
    }
  }
})
</script>

<template>
  <Intro v-if="showIntro" @start="showIntro = false" />
  <Game v-if="showIntro == false" />
</template>

<style scoped>
</style>
