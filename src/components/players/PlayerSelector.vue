<script setup>
import { inject, onMounted, watch } from "vue";

let playerData = inject("playerData");
let selectedPlayers = inject("selectedPlayers");
let playerUsernames = inject("playerUsernames");

function filter_player(input) {
  let select_player = input.target.innerText;
  input.target.style["background-color"] = "#587898";

  if (selectedPlayers.value.includes(select_player)) {
    input.target.style["background-color"] = "#2c3e50";
    selectedPlayers.value.splice(selectedPlayers.value.indexOf(select_player), 1);
  } else {
    selectedPlayers.value.push(select_player);
  }

  console.log("players", playerUsernames);
}

watch(playerData, () => {
  const sorted = playerData.value.sort((a, b) => b["ranked"]["RANKED_SOLO_5x5"]["rank"] - a["ranked"]["RANKED_SOLO_5x5"]["rank"]);
  playerUsernames.value = sorted.map(x => x["username"]);
});
</script>

<template>
  <div class="players_buttons">
    <div v-for="player in playerUsernames" :key="player">
      <button class="player_button" @click="filter_player">{{ player }}</button>
    </div>
  </div>
</template>

<style scoped>
.players_buttons {
  display: flex;
  flex-flow: row wrap;
  gap: 15px;
  /*outline: 1px solid red;*/
  width: 100%;
  /*justify-content: space-evenly;*/
  margin: 10px 0 30px 0;
}

.player_button {
  background-color: #2c3e50;
  color: white;
  cursor: pointer;
  border: none;
  /*border-color: #517194;*/
  padding: 15px;
  border-radius: 10px;
  transition: 0.1s;
}

.player_button:hover {
  background-color: #587898;
}
</style>