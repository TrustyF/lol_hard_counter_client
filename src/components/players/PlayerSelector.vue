<script setup>
import { inject, onMounted, watch } from "vue";

let playerData = inject("playerData");
let selectedPlayers = inject("selectedPlayers");
let playerUsernames = inject("playerUsernames");
const curr_api = inject("curr_api");

const rank_mappings = {
  "tier_values": ["iron", "bronze", "silver", "gold", "platinum", "emerald",
    "diamond", "master", "grandmaster", "challenger"],
  "division_values": ["IV", "III", "II", "I"]
};

function filter_player(input) {
  let select_player = input;
  document.getElementById(input).classList.add("player_hover_background");

  if (selectedPlayers.value.includes(select_player)) {
    document.getElementById(input).classList.remove("player_hover_background");


    selectedPlayers.value.splice(selectedPlayers.value.indexOf(select_player), 1);
  } else {
    selectedPlayers.value.push(select_player);
  }

  // console.log("players", selectedPlayers.value);
}

watch(playerData, () => {
  const sorted = playerData.value.sort((a, b) => b["ranked"]["RANKED_SOLO_5x5"]["rank"] - a["ranked"]["RANKED_SOLO_5x5"]["rank"]);
  playerUsernames.value = sorted.map(x => {
    let val = x["ranked"]["RANKED_SOLO_5x5"]["rank"];
    let lp = val % 100;
    // const div = ((val - lp) % 400) / 100;
    let tier = (val - lp - ((val - lp) % 400)) / 400;
    return {
      "username": x["username"],
      "profile_icon": x["profile_icon"],
      "rank": tier === 0 ? "unranked" : rank_mappings["tier_values"][tier]
    };
  });
});
</script>

<template>
  <div class="players_buttons">
    <div class="button_wrapper" v-for="player in playerUsernames" :key="player.username">

      <button class="player_button" @click="filter_player(player.username)" :id="player.username">
        <input type="image" class="rank_image" :src="`/assets/tiers/${player.rank}.png`"
               alt="rank" />
        <input type="image" class="button_image" :src="`${curr_api}/player/profile_icon?player=${player.username}`"
               alt="icon" />
        <p class="button_text">{{ player.username }}</p>
      </button>

    </div>
  </div>
</template>

<style scoped>

.players_buttons {
  display: flex;
  flex-flow: row wrap;
  gap: 15px;
  width: 100%;
  margin: 10px 0 30px 0;
}

.button_image {
  position: absolute;
  height: 50px;
  width: 50px;
  border-radius: 10px;
  left: 0;
  margin: auto;
}

.rank_image {
  position: absolute;
  margin: auto;
  height: 100px;
  width: 100px;
  inset: 0;
}

.button_text {
  position: relative;
  margin-left: 70px;
  text-align: left;
  font-size: 1em;
  font-weight: bold;
  text-shadow: 1px 1px 5px black, 1px 1px 10px black, 1px 1px 15px black;
}

.player_button {
  height: 50px;
  width: 200px;
  overflow: hidden;
  position: relative;
  background-color: #2c3e50;
  display: flex;
  flex-flow: row wrap;
  color: white;
  cursor: pointer;
  gap: 10px;
  padding: 0 15px 0 0;

  border-radius: 10px;
  border: none;
  transition: 0.1s;

  font-size: 0.8em;
  font-weight: bold;

  align-content: center;
  justify-content: center;
  line-height: 50px;

}

.player_hover_background {
  background-color: #57748f;
}

.player_button:hover {
  background-color: #57748f;
}
</style>