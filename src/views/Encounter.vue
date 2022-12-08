<script setup lang="ts">
import { ref, Ref, computed } from 'vue'
import { useUtils } from '../composables/useUtils'
import { useMainStore } from "../stores/."
import SETTINGS from '../settings'
import HealthBar from '../components/HealthBar.vue'
import playerHitSFX from '../assets/audio/punchArgh.mp3'
import enemyHitSFX from '../assets/audio/punch.mp3'
import endRoundSFX from '../assets/audio/boxingBell.wav'
import runSFX from '../assets/audio/running.mp3'
import whooSFX from '../assets/audio/whoo.wav'
import uhohSFX from '../assets/audio/ow.mp3'

const store = useMainStore()
const { randomNumberInRange } = useUtils()

type EncounterState = 'Wait' | 'Fight' | 'Run'

const state : Ref<EncounterState> = ref('Wait')
const enemyStartingHealth = 12
const enemyHealth = ref(enemyStartingHealth)
const enemyStrength = ref(2)
const msg = ref(`Your weapon is: ${store.weapon}`)

const playerStrength = computed(() => {
  return SETTINGS.weapons[store.weapon]
})

let intervalId : number | undefined

function endEncounter() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = undefined
  }
  emit('resumeGame')
}

const fightOver = ref(false)
const playerAudio = new Audio(playerHitSFX)
const enemyAudio = new Audio(enemyHitSFX)
const endRoundAudio = new Audio(endRoundSFX)
playerAudio.volume = .8
enemyAudio.volume = .5
endRoundAudio.volume = .6
function tick() {
  if (store.health > 0 && enemyHealth.value > 0) {
    const rng = Math.random()
    if (rng < enemyStrength.value * .2)  {
      store.takeDamage(enemyStrength.value)
      playerAudio.play()
      msg.value = "You're hit!"
    } else {
      enemyHealth.value -= playerStrength.value
      enemyAudio.play()
      msg.value = "You land a punch!"
    }
  } else {
    if (enemyHealth.value <= 0) {
      msg.value = "You knocked him out! You escape with all your cash."
    } else {
      const randomCashAmount = randomNumberInRange(store.cash * .4, store.cash * .8)
      msg.value = `You got knocked out! They stole $${randomCashAmount.toLocaleString()}!`
      if (randomCashAmount > 0) {
        store.spendCash(randomCashAmount)
      }
    }
    endRoundAudio.play()
    fightOver.value = true
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = undefined
    }
  }
}

function fight() {
  state.value = 'Fight'
  if (!intervalId) {
    intervalId = window.setInterval(tick, 1000);
  }
}


const framesElapsed = ref(0)
const animFrames = [
  `
            _( }
   -=  _  <<  \\
      \`.\\__/\`/\\\\
 -=     '--'\\\\  \`
      -=    //
            \\)
  `,
  `
                    _( }
           -  -   <<  \\
                   /\`/\\
             -=   ( \\\\  \`
         -=      _//  \\\\
                \_'   \`-)
  `,
                      `
                                _( }
                       -=  _  <<  \\
                          \`.\\__/\`/\\\\
                     -=     '--'\\\\  \`
                          -=    //
                                \\)
  `,
]
const activeFrameIndex = computed(() => Math.min(animFrames.length, framesElapsed.value))
const isRunning = ref(false)
const intID = ref(0)
function run() {
  state.value = 'Run'
  isRunning.value = true
  const rng = Math.random()
  const runAudio = new Audio(runSFX)
  const successAudio = new Audio(whooSFX)
  const failAudio = new Audio(uhohSFX)
  runAudio.volume = 0.5
  failAudio.volume = 0.5
  runAudio.play()
  intID.value = window.setInterval(() => {
    framesElapsed.value += 1
  }, 700)
  window.setTimeout(() => {
    isRunning.value = false
    clearInterval(intID.value)
    intID.value = 0
    if (rng > .7) {
      msg.value = "You're fast! And lucky. You escape unharmed."
      successAudio.play()
    } else {
      failAudio.play()
      const randomCashAmount = randomNumberInRange(store.cash * .4, store.cash * .8)
      msg.value = `Not fast enough! They catch you and steal $${randomCashAmount.toLocaleString()}.`
      store.spendCash(randomCashAmount)
    }
  }, 2100)
}


const emit = defineEmits<{
  (e: 'resumeGame'): void
}>()

</script>


<template>
  <section v-if="state=='Wait'">
    <h4>Some punk is trying to rob you!</h4>
    <p>What will you do?</p>
    <div class="flex">
      <button @click.prevent="fight">Fight</button>
      <button @click.prevent="run">Run</button>
    </div>
  </section>

  <section v-if="state=='Fight'">
    <h4>FIGHT!</h4>
    <p>{{ msg }}</p>
    <HealthBar title="Your Health" :total="SETTINGS.startingHealth" :remaining="store.health" />
    <HealthBar title="Enemy Health" :total="enemyStartingHealth" :remaining="enemyHealth" />
    <div class="button-wrap">
      <button v-if="fightOver" @click.prevent="endEncounter">OK</button>
    </div>
  </section>

  <section v-if="state=='Run'">
    <h4>RUN!</h4>
    <div class="runContainer" v-if="isRunning">
      <pre>
        {{ animFrames[activeFrameIndex] }}
      </pre>
    </div>
    <div class="runContainer" v-else>
      <p>{{ msg }}</p>
      <button @click.prevent="endEncounter">OK</button>
    </div>
  </section>

</template>


<style scoped>

section {
  text-align: center;
  width: 90%;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
}

.flex {
  display: flex;
  margin: 10px auto;
}

button { margin: 5px }

pre {
  width: 300px;
  text-align: left;
}

.button-wrap {
  height: 28px;
  margin-top: 10px;
}

.runContainer {
  height: 180px;
}

</style>
