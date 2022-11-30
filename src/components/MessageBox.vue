
<script setup lang="ts">
import { ref, onUpdated } from 'vue'
import { useMainStore } from "../stores/index"

const store = useMainStore()

const messageBox = ref()

onUpdated(() => {
  const lastP = (messageBox.value as any).lastElementChild
  lastP?.scrollIntoView({behavior: "smooth", block: "end"})
})

</script>


<template>
  <div ref="messageBox" class="messageBox">
    <p v-for="msg in store.messages" v-html="msg"></p>
  </div>
</template>


<style scoped>
.messageBox {
  border: 1px solid white;
  height: 50px;
  margin-bottom: 10px;
  padding: 10px;
  overflow-y:scroll;
  padding-bottom: 5px;
}

.messageBox p {
  margin: 0;
  font-size: 14px;
  line-height: 1.3;
}
</style>
