
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

</script>


<template>
  <section class="modal">
    <button class="cancel" @click.prevent="emit('closeForm')">X</button>
    <div class="weapons">
      <h4 class="text-center">Shop</h4>
      <p>What would you like to buy?</p>
      <table>
        <tr v-for="w in weaponsForPurchse">
          <td>{{ w.weaponType }}</td>
          <td>${{w.price.toLocaleString()}}</td>
          <td class="btns">
            <button :disabled="(store.cash < w.price || store.activeWeapon == w.weaponType)" @click="store.purchaseWeapon(w.weaponType); emit('closeForm')">Buy</button>
            <button :disabled="!store.weapons.includes(w.weaponType)" @click="store.sellWeapon(w.weaponType); emit('closeForm')">Sell</button>
          </td>
        </tr>
      </table>

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

.btns {
  display: grid;
  grid-template-columns: 50% 50%;
  gap: 1px;
}


</style>
