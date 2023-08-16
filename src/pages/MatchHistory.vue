<script setup>
import { inject, computed, watch, ref, onMounted } from "vue";
import PlayerSelector from "../components/players/PlayerSelector.vue";
import HistoryBox from "@/components/matchHistory/HistoryBox.vue";

let playerData = inject("playerData");
let selectedPlayer = ref(undefined);


let player = computed(() => {
  if (selectedPlayer.value !== undefined) {
    let index = playerData.value.map(value => value["username"]).indexOf(selectedPlayer.value);
    return playerData.value[index];
  }
  return undefined;
});
// let matchHistory = computed(() => player.value["match_history"].filter(value => value["match_info"]["queue"] === "ranked_solo_fives"));
let matchHistory = computed(() => {
  if (player.value !== undefined) {
    return player.value["match_history"];
  } else {
    let out = playerData.value.map(player => player["match_history"]).flat(1).slice(0,30);
    console.log("out", out);
    return out;
  }
});

function set_selected_player(val) {
  selectedPlayer.value = val;
}

</script>

<template>
  <div v-if="playerData!==undefined">

    <PlayerSelector @selectedPlayer="set_selected_player"></PlayerSelector>

<!--    todo add global feed-->
    <div class="feed_wrapper">
      <div class="feed">
        <HistoryBox
          v-for="match in matchHistory" :key="match['match_info']['id']"
          :match="match"
        ></HistoryBox>
      </div>
<!--      <p v-if="player===undefined" style="text-align: center;color: #494949">Please select a player</p>-->
    </div>

  </div>
</template>

<style scoped>
.feed_wrapper {
  /*width: fit-content;*/
  height: 100vh;
  padding: 10px;
  margin: 0 0 50px 0;
  border-radius: 10px;
  background-color: #111111;
  box-shadow: inset 0 0 5px #000000;
  overflow-y: scroll;
  scrollbar-width: none;
}

.feed {
  display: flex;
  flex-flow: column wrap;
  gap: 10px;
  /*overflow: visible;*/
  /*outline: 1px solid red;*/
}
</style>