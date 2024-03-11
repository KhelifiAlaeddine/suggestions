<script setup>
  import { ref } from 'vue';
  import {messages, pushToMessages} from '../constants/contants.js';
  let message = ref("السلام عليكم ورحمة الله وبركاته");
  let loading = ref(false);

  async function fetchprayerTimes() {
    const date = new Date();
    let day = (date.toLocaleDateString()).replace(/\//g,"-");
    let url = `https://api.aladhan.com/v1/timingsByAddress/${day}?address=tunis,tunisia`;
    let prayerTimes;
    const res = await fetch(url)
    prayerTimes = await res.json();
    prayerTimes = prayerTimes.data.timings
    delete prayerTimes.Firstthird
    delete prayerTimes.Midnight
    delete prayerTimes.Lastthird
    delete prayerTimes.Imsak
    delete prayerTimes.Sunrise
    delete prayerTimes.Sunset
    return prayerTimes;

  }

  async function getCurrentPrayer() {

    const time = new Date();
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const currentTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;

    const prayerTimes = await fetchprayerTimes()

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

  async function randomMessage() {
    editMessages();
    loading.value = true;
    const randomIndex = Math.floor(Math.random() * messages.length);
    message.value = messages[randomIndex];
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
    
  </div>
</template>
