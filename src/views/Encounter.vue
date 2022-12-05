<script setup lang="ts">
import { ref, Ref, computed } from 'vue'
import { useUtils } from '../composables/useUtils'
import { useMainStore } from "../stores/."
import SETTINGS from '../settings'
import HealthBar from '../components/HealthBar.vue'

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

function tick() {
  if (store.health > 0 && enemyHealth.value > 0) {
    const rng = Math.random()
    if (rng < enemyStrength.value * .1)  {
      store.takeDamage(enemyStrength.value)
      msg.value = "You're hit!"
    } else {
      enemyHealth.value -= playerStrength.value
      msg.value = "You land a punch!"
    }
  } else {
    if (enemyHealth.value <= 0) {
      msg.value = "You knocked him out!"
      store.logMessage(`<span class="text-green">You fought off the robber! You didn't lose any cash... this time.</span>`)
    } else {
      msg.value = "You got knocked out! They stole some of your cash!"
      const randomCashAmount = randomNumberInRange(store.cash * .4, store.cash * .8)
      if (randomCashAmount > 0) {
        store.spendCash(randomCashAmount)
        store.logMessage(`<span class="text-red">You were robbed! You lost $${randomCashAmount.toLocaleString()}! Shoulda put it in the bank.</span>`)
      }
    }
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = undefined
    }
  }
}

function fight() {
  state.value = 'Fight'
  if (!intervalId) {
    intervalId = setInterval(tick, 1000);
  }
}

function run() {
  state.value = 'Run'
  const rng = Math.random()
  if (rng > .5) {
    msg.value = "You're pretty fast! You escape unharmed."
    store.logMessage(`<span class="text-green">You outran the robber! You didn't lose any cash... this time.</span>`)
  } else {
    const randomCashAmount = randomNumberInRange(store.cash * .4, store.cash * .8)
    msg.value = `Not fast enough! They catch you and steal $${randomCashAmount.toLocaleString()}.`
    store.logMessage(`<span class="text-red">You were robbed! You lost $${randomCashAmount.toLocaleString()}! Shoulda put it in the bank.</span>`)
  }
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
    <button v-if="(enemyHealth <= 0 || store.health <= 0)" @click.prevent="endEncounter">OK</button>
  </section>

  <section v-if="state=='Run'">
    <h4>RUN!</h4>
    <p>{{ msg }}</p>
    <button @click.prevent="endEncounter">OK</button>
  </section>

</template>


<style scoped>

section {
  text-align: center;
  width: 100%;
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

</style>