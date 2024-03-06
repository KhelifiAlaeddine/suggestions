<script setup>
  import { ref } from 'vue';
  import messages from '../constants/contants.js';
  //const messages = ["Message 1", "Message 2", "Message 3"];
  let message = ref("toto");
  function randomMessage() {
    const randomIndex = Math.floor(Math.random() * this.messages.length);
    message.value = messages[randomIndex];
  }
</script>

<template>
  <div class="card">
    <button type="button" @click="randomMessage()">TEST</button>
    <p>{{ message }}</p>
  </div>
</template>
