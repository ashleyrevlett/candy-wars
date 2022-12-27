
<script setup lang="ts">
import { computed } from 'vue'
import { useMainStore } from "../stores/index"
import SETTINGS from '../settings'
import { WeaponType } from '../types';

const store = useMainStore()

const emit = defineEmits<{
  (e: 'closeForm'): void
}>()

const weaponsForUse = computed(() => {
  return SETTINGS.weapons.filter((x) => store.weapons.includes(x.weaponType))
})

</script>


<template>
  <section class="modal">
    <button class="cancel" @click.prevent="emit('closeForm')">X</button>
    <div class="weapons">
      <h4 class="text-center">Choose your weapon</h4>
      <button v-for="w in weaponsForUse" @click="store.changeWeapon(w.weaponType)" :disabled="store.activeWeapon == w.weaponType">
        {{ w.weaponType }} <em v-if="store.activeWeapon == w.weaponType">(Current Weapon)</em>
      </button>
    </div>
  </section>
  <div class="modal-overlay-bg"></div>
</template>

<style scoped>

section {
  min-height: 200px;
  width: 320px;
  display: flex;
  flex-direction: column;
  text-align: center;
}

button.cancel {
  margin-left: auto;
}

h4 {
  margin-bottom: 12px;
}

div {
  padding: 0 10px 10px 10px;
  margin-bottom: 10px;
}

.weapons button {
  width: 100%;
  margin-bottom: 5px;
}

</style>
