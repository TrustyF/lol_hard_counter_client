<script setup>
import { inject, onMounted, watch, computed } from "vue";

let props = defineProps(["player", "text", "index", "tier_enabled", "value_format"]);

const curr_api = inject("curr_api");
let selectedPlayers = inject("selectedPlayers");

let username = computed(() => props["text"][0]);
let value = computed(() => {
  let val = props["text"][1];

  if (props["value_format"] === "float") {
    return parseFloat(val).toFixed(2);
  }
  if (props["value_format"] === "percentage") {
    return parseFloat(val).toFixed(1) + "%";
  } else {
    return parseInt(val);
  }

});
let difference = computed(() => props["text"][3]);

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
  <button v-if="player!==undefined"
          :class="selectedPlayers.includes(player.username) ? 'player_button hoverable player_hover_background' : 'player_button hoverable'"
          @click="filter_player(player.username)"
          :id="player.username">
    <input v-if="tier_enabled===true" type="image" class="rank_image" :src="`/assets/tiers/${player.rank}.png`"
           alt="rank" />
    <input type="image" class="button_image" :src="`${curr_api}/player/profile_icon?player=${player.username}`"
           alt="icon" />
    <p class="button_text">{{ player.username }}</p>
  </button>


  <button v-if="text!==undefined"
          :class="selectedPlayers.includes(username) ? 'player_button hoverable player_highlight'  : selectedPlayers.length < 1 ? 'player_button hoverable' : 'player_button player_disable'"
          @click="filter_player(username)"
          :id="text">

    <div v-if="difference !== 0" class="difference_box">
      <img v-if="difference !== 0"
           :src="difference < 0 ? '/assets/ui/arrow_down_single.png' : '/assets/ui/arrow_up_single.png'" alt="arrow"
           :class="difference > 0 ? 'arrow_green' : 'arrow_red'">
      <p :class="difference > 0 ? 'difference_text green' : 'difference_text red'" v-if="difference!==undefined">
        {{ difference !== 0 ? Math.abs(difference) : "" }}</p>
      <p v-if="difference === 0" class="difference_none"></p>
    </div>

    <img class="button_image" :src="`${curr_api}/player/profile_icon?player=${username}`"
         alt="icon" />

    <p class="button_text">{{ value + " - " + username }}</p>

  </button>


</template>

<style scoped>
.player_button {
  /*outline: 1px solid green;*/

  height: 50px;
  min-width: 150px;

  overflow: hidden;
  position: relative;
  /*background-color: #2c3e50;*/
  background-color: #222f3d;

  display: flex;
  flex-flow: row nowrap;
  color: white;

  gap: 10px;
  padding: 0 15px 0 0;

  border-radius: 10px;
  border: none;
  transition: 0.1s;

  font-size: 0.8em;
  font-weight: bold;

  /*line-height: 50px;*/
}

.button_image {
  position: relative;
  height: 50px;
  width: 50px;
  border-radius: 9px;
  margin: auto 0 auto 0;
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
  line-height: 50px;
  font-size: 1em;
  font-weight: bold;
  text-shadow: 1px 1px 5px black, 1px 1px 10px black;
  white-space: nowrap;
  /*outline: 1px solid green;*/
}

.rank_text {
  font-size: 0.9em;
  font-weight: bold;
  margin-left: 5px;
  color: #6a849f;
  filter: drop-shadow(1px 1px 1px black);
  line-height: 50px;
  /*outline: 1px solid red;*/
}

.difference_box {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  display: flex;
  flex-flow: row nowrap;
  gap: 2px;
  align-items: end;
  justify-content: start;
  padding: 2px;
  height: 50px;
  width: 50px;
  /*background-color: rgba(0,0,0,0.8);*/
  /*outline: 1px solid purple;*/
}

.difference_text {
  /*outline: 1px solid purple;*/
  margin: 0;
  font-size: 0.9em;
  font-weight: bold;
  color: white;
}

.arrow_green {
  width: 5px;
  height: 5px;
  margin: 0;
  transform: translate(0, -5px);
  z-index: 20;
  /*top: -5px;*/
  /*left: 10px;*/
  filter: drop-shadow(1px 0px 1px black) drop-shadow(0px 0px 3px black);
}

.arrow_red {
  width: 5px;
  height: 5px;
  margin: 0;
  transform: translate(0, -5px);
  z-index: 20;
  /*bottom: -7px;*/
  /*left: 10px;*/
  filter: drop-shadow(1px 0px 1px black) drop-shadow(0px 0px 3px black);
}

.green {
  color: #00bd00;
  filter: drop-shadow(1px 0px 1px black) drop-shadow(0px 0px 3px black) drop-shadow(0px 0px 7px black) drop-shadow(0px 3px 3px black) drop-shadow(-5px 3px 4px black) drop-shadow(-5px 5px 6px #00bd00);
}

.red {
  color: #ff0000;
  filter: drop-shadow(1px 0px 1px black) drop-shadow(0px 0px 3px black) drop-shadow(0px 0px 7px black) drop-shadow(0px 3px 3px black) drop-shadow(-5px 3px 4px black) drop-shadow(-5px 5px 6px #ff0000);
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