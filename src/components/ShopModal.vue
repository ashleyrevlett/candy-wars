
<script setup lang="ts">
import { computed } from 'vue'
import { useMainStore } from "../stores/index"
import SETTINGS from '../settings'
import { WeaponType } from '../types';

const store = useMainStore()

const emit = defineEmits<{
  (e: 'closeForm'): void
}>()

const weaponsForPurchse = computed(() => {
  return SETTINGS.weapons.filter((x) => x.weaponType != 'Fists')
})

function purchase(w: WeaponType) {
  const weapon = SETTINGS.weapons.find((x) => x.weaponType == w)
  if (!weapon) return
  store.changeWeapon(w)
  store.spendCash(weapon.price)
  emit('closeForm')
}

</script>


<template>
  <section class="modal">
    <button class="cancel" @click.prevent="emit('closeForm')">X</button>
    <div class="weapons">
      <h4 class="text-center">Shop</h4>
      <p>What would you like to buy?</p>
      <button v-for="w in weaponsForPurchse" :disabled="(store.cash < w.price || store.weapon == w.weaponType)" @click="purchase(w.weaponType)">
        {{ w.weaponType }} – ${{w.price.toLocaleString()}}
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

div {
  padding: 0 10px 10px 10px;
  margin-bottom: 10px;
}

.weapons button {
  margin-bottom: 10px;
  width: 100%;
}


</style>
