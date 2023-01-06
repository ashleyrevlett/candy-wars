<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SETTINGS from '../settings'
import { useMainStore } from "../stores/index"
import { useCalendarStore } from "../stores/calendar"
import bellSFX from '../assets/audio/schoolBell.mp3'
import ShopModal from '../components/ShopModal.vue'

const store = useMainStore()
const calendar = useCalendarStore()

const daysRemaining = computed(() => SETTINGS.maxDays - calendar.daysSinceStart)

const emit = defineEmits<{
  (e: 'resumeGame'): void,
}>()

onMounted(() => {
  const bellAudio = new Audio(bellSFX)
  bellAudio.volume = .6
  bellAudio.play()
})

const isShopping = ref(false)

const currentScene = ref(0)

function newDay() {
  store.receiveCash(5)
  currentScene.value++
}

</script>

<template>

  <ShopModal
    v-if="isShopping"
    @closeForm="isShopping=false"
  />

  <section v-if="currentScene == 0">
    <div>
      <h3>School's out!</h3>
      <span v-if="store.debt > 0">
        <p>The bully catches you in the hallway.</p>
        <p v-if="daysRemaining > 0">He says, "Hey nerd, you got {{ daysRemaining }} days left to pay up. You still owe me <span class="text-red">${{ store.debt.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</span>."</p>
        <p v-else>He says, "Tomorrow's your last chance! Pay me <span class="text-red">${{ store.debt.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</span> before the day ends or you're done!"</p>
      </span>
      <span v-else>
        <p v-if="daysRemaining > 0">You have {{ daysRemaining }} day{{ daysRemaining > 1 ? 's' : '' }} until school's out for the summer.</p>
        <p v-else>One last day before school's out for the summer!</p>
      </span>
      <p>You currently have <span class="text-green">${{ store.cash.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</span> on hand, and <span class="text-green">${{ store.bank.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</span> stashed in your locker.</p>
      <button v-if="store.cash > 0" @click="isShopping=true">Shop</button>
      <button @click="newDay()">Go Home</button>
    </div>
  </section>

  <section v-if="currentScene == 1">
    <div>
      <h3>A new day dawns...</h3>
      <p>Your mom gives you <span class="text-green">${{ SETTINGS.lunchCost.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</span> for lunch.</p>
      <p>"Or candy!" you think to yourself.</p>
      <button @click="emit('resumeGame')">Go to School</button>
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

div {
  width: 100%;
}

p {
  margin: 0 auto 1rem;
  max-width: 80%;
}

button {
  margin: 20px 5px;
}

</style>
