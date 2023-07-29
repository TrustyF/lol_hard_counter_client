<script setup>
import { RouterLink, RouterView } from "vue-router";
import NavBar from "@/components/navbar/NavBar.vue";
import PlayerSelector from "@/components/players/PlayerSelector.vue";
import { inject, onMounted } from "vue";

const curr_api = inject("curr_api");
const devMode = inject("devMode");
let playerUsernames = inject("playerUsernames");
let playerData = inject("playerData");

async function get_players() {
  const url = new URL(`${curr_api}/player/get_all`);
  // url.searchParams.set('none','none')
  let retryLeft = 3;

  while (retryLeft > 0) {
    await fetch(url)

      // Handle http error
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })

      // Process the returned JSON data
      .then(data => {
        if (devMode) console.log(data);
        playerData.value = data;
        playerUsernames.value = data.map(x => x["username"]);
        retryLeft = 0;
      })

      // Handle any errors that occurred during the fetch
      .catch(error => {
        console.error("Error:", error);
      });
    retryLeft -= 1;
  }

}

onMounted(() => {
  get_players();
});
</script>

<template>
  <NavBar></NavBar>
  <body>
  <player-selector></player-selector>
  <RouterView />
  </body>
</template>

<style scoped>
body {
  margin: auto;
  width: 75vw;
  padding-top: 20px;
  /*outline: 1px solid palegreen;*/
}
</style>
