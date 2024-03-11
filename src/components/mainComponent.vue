<script setup>
  import { ref } from 'vue';
  import {messages, pushToMessages} from '../constants/contants.js';
  let message = ref("السلام عليكم ورحمة الله وبركاته");
  let loading = ref(false);
  let coran = ref(false);
  let ayah = ref('');

  async function fetchPrayerTimes() {
    const date = new Date();
    const day = date.toLocaleDateString().replace(/\//g, "-");
    const url = `https://api.aladhan.com/v1/timingsByAddress/${day}?address=tunis,tunisia`;

    try {
        const res = await fetch(url);
        const { data: { timings } } = await res.json();

        // Remove unwanted keys from timings object
        const unwantedKeys = ['Firstthird', 'Midnight', 'Lastthird', 'Imsak', 'Sunrise', 'Sunset'];
        for (const key of unwantedKeys) {
            delete timings[key];
        }

        return timings;
    } catch (error) {
        console.error("Error fetching prayer times:", error);
        return null;
    }
}


  async function getCurrentPrayer() {

    const time = new Date();
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const currentTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;

    const prayerTimes = await fetchPrayerTimes()

    if (currentTime < prayerTimes.Fajr) {
        return "Pre-Fajr";
    } else if (currentTime < prayerTimes.Dhuhr) {
        return "Fajr";
    } else if (currentTime < prayerTimes.Asr) {
        return "Dhuhr";
    } else if (currentTime < prayerTimes.Maghrib) {
        return "Asr";
    } else if (currentTime < prayerTimes.Maghrib) {
        return "Maghrib";
    } else {
        return "Isha";
    }
  }

  async function editMessages(){
    const currentPrayer = await getCurrentPrayer();
    if (currentPrayer == "Fajr") {  
      pushToMessages("صليت الصبح؟")
    } else if(currentPrayer == "Dhuhr") {
      pushToMessages("صليت الظهر؟")
    } else if(currentPrayer == "Asr") {
      pushToMessages("صليت العصر؟")
    } else if(currentPrayer == "Maghrib") {
      pushToMessages("صليت المغرب؟")
    } else if(currentPrayer == "Isha") {
      pushToMessages("صليت العشاء؟")
    }
  }
  editMessages();
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

  async function randomMessage() {
    
    coran.value = false
    loading.value = true;
    const randomIndex = Math.floor(Math.random() * messages.length);
    message.value = messages[randomIndex];
    if (message.value == 'زعمة تقرى شوية قرآن؟') {
      coran.value = true;
      getRandomAyah()
    }
    setTimeout(()=>{loading.value = false}, 2000);
  }


</script>

<template>
  <div class="card">
    <button type="button" @click="randomMessage()">بسم الله الرحمن الرحيم</button>
    <p class="message" v-if="!loading">{{ message }}</p>
    <div class="loader-wrapper">
      <div class ="loader" v-if="loading"></div>
    </div>
    <p class="message" v-if="(!loading && coran)">{{ ayah }}</p>
  </div>
</template>
