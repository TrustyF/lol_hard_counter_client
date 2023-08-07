<script setup>
import { inject, onMounted, watch } from "vue";

defineProps(["player", "username", "text", "tier_enabled"]);

const curr_api = inject("curr_api");
let selectedPlayers = inject("selectedPlayers");


function filter_player(input) {
  let select_player = input;

  if (selectedPlayers.value.includes(select_player)) {

    selectedPlayers.value.splice(selectedPlayers.value.indexOf(select_player), 1);
  } else {
    selectedPlayers.value.push(select_player);
  }
}

</script>

<template>
  <button v-if="player!==undefined" :class="selectedPlayers.includes(player.username) ? 'player_button hoverable player_hover_background' : 'player_button hoverable'"
          @click="filter_player(player.username)"
          :id="player.username">
    <input v-if="tier_enabled===true" type="image" class="rank_image" :src="`/assets/tiers/${player.rank}.png`"
           alt="rank" />
    <input type="image" class="button_image" :src="`${curr_api}/player/profile_icon?player=${player.username}`"
           alt="icon" />
    <p class="button_text">{{ player.username }}</p>
  </button>

  <button v-if="text!==undefined" :class="selectedPlayers.includes(username) ? 'player_button player_highlight'  : selectedPlayers.length < 1 ? 'player_button' : 'player_button player_disable'" :id="text">
    <img class="button_image" :src="`${curr_api}/player/profile_icon?player=${username}`"
         alt="icon" />
    <p class="button_text">{{ text }}</p>
  </button>

</template>

<style scoped>

.button_image {
  position: absolute;
  height: 50px;
  width: 50px;
  border-radius: 9px;
  left: 0;
  margin: auto;
  background: #000;
}

.rank_image {
  position: absolute;
  left: 45px;
  bottom: -50%;
  height: 100px;
  width: 100px;
}

.button_text {
  position: relative;
  margin-left: 70px;
  text-align: left;
  font-size: 1em;
  font-weight: bold;
  text-shadow: 1px 1px 5px black, 1px 1px 10px black;
  white-space: nowrap;
  /*outline: 1px solid red;*/
}

.player_button {
  height: 50px;
  min-width: 150px;

  overflow: hidden;
  position: relative;
  background-color: #2c3e50;
  display: flex;
  flex-flow: row wrap;
  color: white;

  gap: 10px;
  padding: 0 15px 0 0;

  border-radius: 10px;
  border: none;
  transition: 0.1s;

  font-size: 0.8em;
  font-weight: bold;

  align-content: center;
  justify-content: left;
  line-height: 50px;

}

.player_highlight {
  background-color: #3b5900;
}

.player_disable {
  background-color: #192128;
  color: grey;
}

.player_hover_background {
  background-color: #57748f;
}

.player_button:hover.hoverable {
  background-color: #57748f;
  cursor: pointer;
}

</style>