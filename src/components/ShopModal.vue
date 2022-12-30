
<script setup lang="ts">
import { computed } from 'vue'
import { useMainStore } from "../stores/index"
import { useInventoryStore } from "../stores/inventory"
import SETTINGS from '../settings'
import { GearType } from '../types';

const store = useMainStore()
const inventory = useInventoryStore()

const emit = defineEmits<{
  (e: 'closeForm'): void
}>()

const weaponsForPurchse = computed(() => {
  return SETTINGS.weapons.filter((x) => x.weaponType != 'Fists')
})

const gearForPurchase = computed(() => {
  return SETTINGS.gear.filter((x) => x.gearType != 'Pockets')
})

function spaceAvailableAfterSell(g: GearType) {
  // return space available after selling this item
  const remainingGear = store.gear.filter((x) => x != g)
  const nextGear = remainingGear[remainingGear.length - 1]
  const space = SETTINGS.gear.find((x) => x.gearType == nextGear)?.space
  return space ? space : 0
}

</script>


<template>
  <section class="modal">
    <button class="cancel" @click.prevent="emit('closeForm')">X</button>
    <div class="weapons">
      <h4 class="text-center">Shop</h4>
      <p><em>Cash: ${{ store.cash.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</em></p>

      <table>
        <tr>
          <th colspan="3" class="text-center">Weapons</th>
        </tr>
        <tr v-for="w in weaponsForPurchse">
          <td>{{ w.weaponType }}</td>
          <td>${{w.price.toLocaleString()}}</td>
          <td class="btns">
            <button v-if="!store.weapons.includes(w.weaponType)"
              :disabled="store.cash < w.price"
              @click="store.purchaseWeapon(w.weaponType)"
              class="btn-buy"
            >
              Buy
            </button>
            <button v-else @click="store.sellWeapon(w.weaponType)" class="btn-sell">Sell</button>
          </td>
        </tr>
        <tr>
          <th colspan="3" class="text-center">Gear</th>
        </tr>
        <tr v-for="g in gearForPurchase">
          <td>{{ g.gearType }}</td>
          <td>${{g.price.toLocaleString()}}</td>
          <td class="btns">
            <button v-if="!store.gear.includes(g.gearType)"
              :disabled="store.cash < g.price"
              @click="store.purchaseGear(g.gearType)"
              class="btn-buy"
            >
              Buy
            </button>
            <button v-else
              :disabled="spaceAvailableAfterSell(g.gearType) < inventory.spaceUsed"
              @click="store.sellGear(g.gearType)" class="btn-sell"
            >
              Sell
            </button>
            <span v-if="store.gear.includes(g.gearType) && spaceAvailableAfterSell(g.gearType) < inventory.spaceUsed" class="tooltip">
              Too much candy in inventory
            </span>
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
  display: block;
  padding-right: 0;
  padding-left: 10px;
  position: relative;

  button {
    width: 100%;

    &:disabled {
      cursor: not-allowed;
    }
  }
}

.btn-buy {
  background-color: var(--bg-color);
  border-color: var(--success-color);
  color: var(--text-color);
}

.btn-sell {
  background-color: var(--bg-color);
  border-color: var(--warning-color);
  color: var(--text-color);

  &:hover {
    background: var(--warning-color);
  }
}

.tooltip {
  position: absolute;
  background-color: var(--warning-color);
  color: white;
  width: 100px;
  font-size: 10px;
  padding: 5px;
  left: -5px;
  top: 0;
  opacity: 1;
  z-index: 3;
  text-align: center;
  display: none;
  cursor: not-allowed;
}

.btns:hover .tooltip {
  display: block;
}

th {
  padding-top: 15px;
  padding-bottom: 5px;
}

</style>
