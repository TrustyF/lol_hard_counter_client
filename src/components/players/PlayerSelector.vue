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
  playerUsernames.value = sorted.map(x => {
    return {
      "username": x["username"],
      "profile_icon": x["profile_icon"]
    };
  });
});
</script>

<template>
  <div class="players_buttons">
    <div v-for="player in playerUsernames" :key="player">
      <div class="button_wrapper">

        <button class="player_button" @click="filter_player">
          <input type="image" class="button_image" :src="`/assets/profileicon/${player.profile_icon}.png`"
                 alt="icon" />
          {{ player.username }}
        </button>

      </div>
    </div>
  </div>
</template>

<style scoped>

.players_buttons {
  display: flex;
  flex-flow: row wrap;
  gap: 15px;
  /*outline: 1px solid green;*/
  width: 100%;
  /*justify-content: space-evenly;*/
  margin: 10px 0 30px 0;
}

.button_wrapper {
  /*outline: 1px solid red;*/

  /*display: flex;*/
  /*justify-content: center;*/
  /*align-content: center;*/

  /*flex-flow: row wrap;*/
}

.button_image {
  height: 50px;
  width: 50px;
  border-radius: 10px;
  inset: 0;
  margin: auto;
}

.player_button {
  background-color: #2c3e50;
  display: flex;
  flex-flow: row wrap;
  color: white;
  cursor: pointer;
  border: none;
  gap: 10px;
  padding: 0 15px 0 0;
  /*border-color: #517194;*/
  border-radius: 10px;
  transition: 0.1s;

  font-size: 0.8em;
  font-weight: bold;

  align-content: center;
  justify-content: center;
  line-height: 50px;
}

.player_button:hover {
  background-color: #587898;
}
</style>