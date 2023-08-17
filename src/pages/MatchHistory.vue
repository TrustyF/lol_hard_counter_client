<script setup>
import { inject, computed, watch, ref, onMounted } from "vue";
import PlayerSelector from "../components/players/PlayerSelector.vue";
import HistoryBox from "@/components/matchHistory/HistoryBox.vue";
import QueueSelector from "@/components/queue/QueueSelector.vue";

let playerData = inject("playerData");
let selectedPlayer = ref(undefined);
let selectedQueue = ref(undefined);

// let matchHistory = computed(() => player.value["match_history"].filter(value => value["match_info"]["queue"] === "ranked_solo_fives"));
let player = computed(() => {
  if (selectedPlayer.value !== undefined) {
    let index = playerData.value.map(value => value["username"]).indexOf(selectedPlayer.value);
    return playerData.value[index];
  }
  return undefined;
});
let matchHistory = computed(() => {
  if (player.value !== undefined) {
    return player.value["match_history"];
  } else {
    let out = playerData.value.map(player => {

      if (selectedQueue.value!==undefined){
        return player["match_history"].filter(value => value["match_info"]["queue"] === selectedQueue.value);
      }
      return player["match_history"];
    });
    out = out.flat(1).slice(0, 30);
    out.sort((a, b) => {
      a = a["match_info"]["creation"].split("/").reverse().join("");
      b = b["match_info"]["creation"].split("/").reverse().join("");

      return b.localeCompare(a);
    });
    return out;
  }
});

function set_selected_player(val) {
  if (selectedPlayer.value !== val) {
    selectedPlayer.value = val;
  } else {
    selectedPlayer.value = undefined;
  }
}
function set_selected_queue(val) {
  if (selectedQueue.value !== val) {
    selectedQueue.value = val;
  } else {
    selectedQueue.value = undefined;
  }
}
</script>

<template>
  <div v-if="playerData!==undefined">

    <PlayerSelector @selectedPlayer="set_selected_player"></PlayerSelector>
    <QueueSelector @selectedQueue="set_selected_queue"></QueueSelector>

    <!--    todo add global feed-->
    <div class="feed_wrapper">
      <div class="feed">
        <HistoryBox
          v-for="(match,i) in matchHistory" :key="match['match_info']['id'] + match['match_info']['player_username']"
          :match="match"
          :next_match="i === matchHistory.length ? undefined : matchHistory[i+1]"
          :index="i"
        ></HistoryBox>
      </div>
      <!--      <p v-if="player===undefined" style="text-align: center;color: #494949">Please select a player</p>-->
    </div>

  </div>
</template>

<style scoped>
.feed_wrapper {
  /*width: fit-content;*/
  padding: 20px 25px 20px 25px;
  margin: 0 0 50px 0;
  border-radius: 10px;
  background-color: #111111;
  box-shadow: inset 0 0 5px #000000;
  /*overflow-y: scroll;*/
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