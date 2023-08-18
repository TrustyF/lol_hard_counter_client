<script setup>
import { inject, computed, ref } from "vue";
// import PlayerBox from "@/components/players/PlayerBox.vue";

let emit = defineEmits(["selectedPlayer"]);
let playerData = inject("playerData");
const curr_api = inject("curr_api");
let playerUsernames = computed(() => playerData.value.map(value => value.username));
let selected = ref('');

function emit_selected_player(username) {
  emit("selectedPlayer", username);

  if (selected.value !== username){
    selected.value = username
  } else {
    selected.value = ''
  }
}

</script>

<template>
  <img class="click_me" src="/extras/click_me3.png" alt="click me">
  <div class="players_buttons">
    <div class="button_wrapper" v-for="username in playerUsernames" :key="username">

      <button
        :class="selected===username ? 'player_button hoverable selected' : 'player_button hoverable'"
        @click="emit_selected_player(username)"
        :id="username">

        <img class="button_image" :src="`${curr_api}/player/profile_icon?player=${username}`" alt="icon" />

        <div style="display: flex;gap: 10px">
          <p class="button_text username_text">{{ username }}</p>
        </div>

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

.player_button {
  /*outline: 1px solid green;*/

  height: 50px;
  min-width: 150px;

  overflow: hidden;
  position: relative;

  /*background: rgba(44,62,80,1);*/
  /*background-color: #2c3e50;*/

  background: linear-gradient(-90deg, rgba(44, 62, 80, 1) 40%, rgba(17, 26, 34, 1) 80%);
  box-shadow: inset 1px 1px 1px #5a7b9b;
  filter: drop-shadow(2px 2px 2px black);

  display: flex;
  flex-flow: row nowrap;
  color: white;

  gap: 15px;
  padding: 0 15px 0 0;

  border-radius: 11px;
  border: none;
  /*transition: 0.1s;*/

  font-size: 0.8em;
  font-weight: bold;

  /*line-height: 50px;*/
}

.player_button:hover {
  background: linear-gradient(-90deg, rgb(111, 151, 189) 20%, rgba(17, 26, 34, 1) 90%);
  cursor: pointer;
}
.selected {
  background: linear-gradient(-90deg, rgb(111, 151, 189) 20%, rgba(17, 26, 34, 1) 90%);
}

.button_image {
  position: relative;
  height: 50px;
  width: 50px;
  border-radius: 0 9px 9px 0;
  margin: auto 0 auto 0;
  /*filter: drop-shadow(2px 0 1px #08121a);*/
  background: #000;
}

.button_text {
  position: relative;
  line-height: 50px;
  font-size: 1.1em;
  font-weight: bold;
  text-shadow: 1px 1px 5px black, 2px 2px 3px black, 1px 1px 10px black, -1px -1px 10px black;
  white-space: nowrap;
  /*outline: 1px solid green;*/
}

.username_text {
  /*color: #6a7e93;*/
  /*transition: 0.1s;*/
  margin-right: 5px;
}

.click_me {
  position: absolute;
  transform: translate(-90px, 0px);
  width: 150px;
  filter: invert(1);
}

</style>