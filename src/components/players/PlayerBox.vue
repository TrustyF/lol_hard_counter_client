<script setup>
import { inject, onMounted, watch, computed } from "vue";

let props = defineProps(["player", "text", "index", "tier_enabled", "value_format"]);

const curr_api = inject("curr_api");
let selectedPlayers = inject("selectedPlayers");

let username = computed(() => props["text"][0]);
let value = computed(() => {
  let val = props["text"][1];

  if (props["value_format"] === "float") {
    return parseFloat(val).toFixed(1);
  }
  if (props["value_format"] === "float2") {
    return parseFloat(val).toFixed(2);
  }
  if (props["value_format"] === "float3") {
    return parseFloat(val).toFixed(3);
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

    <div v-if="difference !== 0" :class=" difference < 0 ? 'difference_box red_shadow' : 'difference_box green_shadow'">
      <img v-if="difference !== 0"
           :src="difference < 0 ? '/assets/ui/arrow_down_single.png' : '/assets/ui/arrow_up_single.png'" alt="arrow"
           :class="difference > 0 ? 'arrow_green' : 'arrow_red'">
      <p :class="difference > 0 ? 'difference_text green' : 'difference_text red'" v-if="difference!==undefined">
        {{ difference !== 0 ? Math.abs(difference) : "" }}</p>
      <p v-if="difference === 0" class="difference_none"></p>
    </div>

    <img class="button_image" :src="`${curr_api}/player/profile_icon?player=${username}`"
         alt="icon" />

    <div style="display: flex;gap: 10px">
      <p class="button_text">{{ value }}</p>
      <p class="button_text">-</p>
      <p class="button_text username_text">{{ username }}</p>
    </div>


  </button>


</template>

<style scoped>
.player_button {
  /*outline: 1px solid green;*/

  height: 50px;
  min-width: 150px;

  overflow: hidden;
  position: relative;

  /*background: rgba(44,62,80,1);*/
  /*background-color: #2c3e50;*/

  background: linear-gradient(-90deg, rgba(44,62,80,1) 40%, rgba(17,26,34,1) 80%);
  filter: drop-shadow(3px 3px 3px black);
  box-shadow: inset 1px 1px 1px #5a7b9b;


  display: flex;
  flex-flow: row nowrap;
  color: white;

  gap: 15px;
  padding: 0 15px 0 0;

  border-radius: 11px;
  border: none;
  transition: 0.1s;

  font-size: 0.8em;
  font-weight: bold;

  /*line-height: 50px;*/
}
.player_button:hover {
  /*background-color: #57748f;*/
  background: linear-gradient(-90deg, rgba(87,116,143,1) 20%, rgba(17,26,34,1) 90%);
  cursor: pointer;
}
.player_hover_background {
  background: linear-gradient(-90deg, rgba(87,116,143,1) 20%, rgba(17,26,34,1) 90%);
}

.button_image {
  position: relative;
  height: 50px;
  width: 50px;
  border-radius:  0 9px 9px 0;
  margin: auto 0 auto 0;
  /*filter: drop-shadow(2px 0 1px #08121a);*/
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

.username_text {
  /*color: #6a7e93;*/
  /*transition: 0.1s;*/
  margin-right: 5px;
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
  right: 3px;
  top: -2px;
  z-index: 2;
  display: flex;
  flex-flow: row nowrap;
  gap: 2px;
  align-items: end;
  justify-content: end;
  padding: 2px;
  height: 50px;
  width: 50px;
  /*outline: 1px solid purple;*/
}

.difference_text {
  /*outline: 1px solid purple;*/
  margin: 0;
  font-size: 1.1em;
  font-weight: bold;
  color: white;
}

.arrow_green {
  width: 7px;
  height: 7px;
  margin: 0;
  transform: translate(0, -4px);
  z-index: 20;
  /*top: -5px;*/
  /*left: 10px;*/
  filter: drop-shadow(0px 0px 1px black) drop-shadow(-1px 1px 2px black) drop-shadow(-1px 2px 3px black);
}

.arrow_red {
  width: 7px;
  height: 7px;
  margin: 0;
  transform: translate(0, -4px);
  z-index: 20;
  /*bottom: -7px;*/
  /*left: 10px;*/
  filter: drop-shadow(0px 0px 1px black) drop-shadow(-1px 1px 2px black) drop-shadow(-1px 2px 3px black);
}

.green_shadow {
  /*color: #00bd00;*/
  filter: drop-shadow(1px 0px 1px black) drop-shadow(3px 0px 5px #00ff00) drop-shadow(3px 3px 6px #00ff00);
}

.red_shadow {
  /*color: #ff0000;*/
  filter: drop-shadow(1px 0px 1px black) drop-shadow(3px 0px 5px #ff0000) drop-shadow(3px 3px 6px #ff0000);

}

.green {
  color: #bfffbf;
  filter: drop-shadow(0px 0px 1px black) drop-shadow(-1px 1px 2px black) drop-shadow(-1px 2px 3px black);
}

.red {
  color: #ffbfbf;
  filter: drop-shadow(0px 0px 1px black) drop-shadow(-1px 1px 2px black) drop-shadow(-1px 2px 3px black);
}

.player_highlight {
  /*background: #3b5900;*/
  background: linear-gradient(-90deg, rgba(59,89,0,1) 20%, rgba(17,26,34,1) 90%);
}

.player_disable {
  /*background: #192128;*/
  background: linear-gradient(-90deg, rgba(25,33,40,1) 20%, rgba(17,26,34,1) 90%);
  color: grey;
}

</style>