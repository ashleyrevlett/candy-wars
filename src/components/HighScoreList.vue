<script setup lang="ts">
import { useFirestore, useCollection } from 'vuefire'
import { query, orderBy, limit, collection } from 'firebase/firestore'

const db = useFirestore()
const coll = collection(db, 'scores')
const q = query(coll, orderBy('score', 'desc'), limit(5))
const {
  data: scores,
  pending,
  error,
  promise
} = useCollection(q)

const emit = defineEmits<{
  (e: 'closeWindow'): void
}>()

</script>

<template>
<section class="modal">
  <button class="cancel" @click.prevent="emit('closeWindow')">X</button>
  <h3>High Scores</h3>
  <ul v-if="!pending">
    <li v-for="(s, index) in scores" :key="`${s.name}-${s.score}`">
      <span>{{ (index+1) }}. {{ s.name }} <span class="text-green">${{ parseInt(s.score).toLocaleString() }}</span></span>
    </li>
  </ul>
  <div v-else class="loading-box">
    <p>Loading...</p>
  </div>
  <slot></slot>
</section>
</template>

<style scoped>
section {
  width: 300px;
  min-height: 320px;
  display: flex;
  justify-content: flex-start !important;
  flex-flow: column;
}

h3 {
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 0;
}

ul {
  list-style-type: none;
  padding: 0 25px;
  margin: 10px 0 30px 0;
}

li {
  padding: 0;
  margin: 3px 0;
}

.cancel {margin-left: auto;}

.loading-box {
  min-height: 130px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px 10px;
  color: gray;
}

</style>