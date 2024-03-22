<script setup>
  import { ref, watch } from 'vue';
  let ayah = ref('');
  const props = defineProps(['loading', 'coran']);

  async function getRandomAyah() {
    let url = `https://api.quran.com/api/v4`;
    let randomAyah = {};
    const res = await fetch(`${url}/verses/random`)
    const response = await res.json();
    randomAyah.key = response.verse.verse_key

    const ayahText = await fetch(`${url}/quran/verses/imlaei?verse_key=${randomAyah.key}`)
    const ayahTextResponse = await ayahText.json();
    randomAyah.text = ayahTextResponse.verses[0].text_imlaei
    
    ayah.value = randomAyah.text
  }
  
  // Watch for changes in props.loading or props.coran
  watch([() => props.loading, () => props.coran], () => {
    if (!props.loading && props.coran) {
      ayah.value = ''
      getRandomAyah();
    }
  }, { immediate: true }); // Call immediately when component is mounted


  
</script>
<template>
  <p class="message" v-if="(!loading && coran)">{{ ayah }}</p>
</template>