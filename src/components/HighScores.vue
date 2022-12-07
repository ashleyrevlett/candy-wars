<script setup lang="ts">
import { ref } from 'vue'
import { useFirestore } from 'vuefire'
import { useCollection } from 'vuefire'
import { query, orderBy, limit, addDoc, collection } from 'firebase/firestore'
import { useMainStore } from "../stores/index"

const db = useFirestore()
const coll = collection(db, 'scores')
const q = query(coll, orderBy('score', 'desc'), limit(5))
const {
  data: scores,
  pending,
  error,
  promise
} = useCollection(q)

const store = useMainStore()
const playerName = ref('')
const hasSubmitted = ref(false)

async function submitScore() {
  hasSubmitted.value = true
  const docRef = await addDoc(collection(db, "scores"), {
    name: playerName.value,
    score: store.cash + store.bank
  });
}

const emit = defineEmits<{
  (e: 'restart'): void,
}>()


</script>

<template>
<section class="modal">
  <h3>High Scores</h3>
  <ul v-if="!pending">
    <li v-for="(s, index) in scores" :key="`${s.name}-${s.score}`">
      <span>{{ (index+1) }}. {{ s.name }} <span class="text-green">${{ parseInt(s.score).toLocaleString() }}</span></span>
    </li>
  </ul>
  <div v-else class="loading-box">
    <p>Loading...</p>
  </div>

  <form v-if="!hasSubmitted">
    <label for="name">Submit your High Score</label>
    <input id="name" type="text" maxlength="100" placeholder="Enter your name..." v-model="playerName" />
    <button @click.prevent="submitScore" :disabled="playerName == ''">Submit</button>
  </form>
  <div v-else>
    <button @click.prevent="emit('restart')">New Game</button>
  </div>


</section>
<div class="modal-overlay-bg"></div>
</template>

<style scoped>
section {
  width: 300px;
  min-height: 320px;
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

form {
  margin: 20px;
  display: flex;
  flex-flow: column;
  align-items: center;
}

label {
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 5px;
}

input[type="text"] {
  width: 100%;
  margin-bottom: 10px;
}

div {
  display: flex;
  justify-content: center;
  padding: 0 10px 10px;
}

.loading-box {
  min-height: 130px;
  align-items: center;
  color: gray;
}

</style>