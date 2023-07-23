<script setup>
import { inject, ref, onMounted } from "vue";
import ChampionIcon from "@/components/champion/ChampionIcon.vue";

const curr_api = inject("curr_api");
let champs_info = ref(undefined);

function fetch_champ_info() {
  const url = new URL(`${curr_api}/champion/get_all`);
  // url.searchParams.set("none", "none");

  fetch(url)
    // Handle http error
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })

    // Process the returned JSON data
    .then(data => {
      champs_info.value = data;
      console.log(data);
    })

    // Handle any errors that occurred during the fetch
    .catch(error => {
      console.error("Error:", error);
    });
}

onMounted(() => {
  fetch_champ_info();
});
</script>

<template>
  <div class="page_wrapper" v-if="champs_info!==undefined">
    <ChampionIcon v-for="champ in champs_info" :key="champ['name']" :champ-data="champ"></ChampionIcon>
  </div>
</template>

<script>
export default {
  name: "ChampionSelector"
};
</script>
<style scoped>
.page_wrapper {
  width: 95vw;
  margin: auto;
  outline: 1px solid red;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
}
</style>