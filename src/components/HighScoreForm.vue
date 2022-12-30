<script setup lang="ts">
import { ref } from 'vue'
import { useFirestore } from 'vuefire'
import { addDoc, collection } from 'firebase/firestore'
import { useMainStore } from "../stores/index"

const db = useFirestore()

const store = useMainStore()
const playerName = ref('')
const hasSubmitted = ref(false)
let errorMsg = ref('')

async function submitScore() {
  hasSubmitted.value = true
  const score = store.cash + store.bank
  const name = playerName.value.substring(0, 100)  // limit to 100 chars
  try {
    const docRef = await addDoc(collection(db, "scores"), {
      name: name,
      score: score
    })
  } catch (e) {
    errorMsg.value = "Sorry, but there was an error recording your high score"
    console.error("Error adding document: ", e)
  }
}

</script>

<template>

<aside>
  <form v-if="!hasSubmitted">
    <label for="name">Submit your High Score</label>
    <input id="name" type="text" maxlength="100" placeholder="Enter your name..." v-model="playerName" />
    <button @click.prevent="submitScore" :disabled="playerName == ''">Submit</button>
  </form>
  <div v-else>
    <p v-if="errorMsg">{{ errorMsg }}</p>
  </div>
</aside>

</template>

<style scoped>
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
</style>