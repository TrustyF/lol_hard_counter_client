<script setup>
import { inject, computed, watch, ref, onMounted } from "vue";
import PlayerSelector from "../components/players/PlayerSelector.vue";
import HistoryBox from "@/components/matchHistory/HistoryBox.vue";
import QueueSelector from "@/components/queue/QueueSelector.vue";
import ChangeLog from "@/components/changelog/ChangeLog.vue";

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

  let out;

  if (player.value !== undefined) {
    // use specific player history
    out = player.value["match_history"];
  } else {
    // use all history
    out = playerData.value.map(val => val["match_history"]);
  }

  // prepare for export
  out = out.flat(1);
  //sort by date
  out.sort((a, b) => {
    a = a["match_info"]["creation"].slice(0,10).split("/").reverse().join("") + a["match_info"]["creation"].slice(11);
    b = b["match_info"]["creation"].slice(0,10).split("/").reverse().join("") + b["match_info"]["creation"].slice(11);
    return b.localeCompare(a);
  });

  // filter to selected queue type
  if (selectedQueue.value !== undefined) {
    out = out.filter(value => value["match_info"]["queue"] === selectedQueue.value);
  }

  out = out.slice(0, 50);

  return out;
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
    console.log("queue set to", val);
  } else {
    selectedQueue.value = undefined;
  }
}
</script>

<template>

  <ChangeLog
    title="Cope corner Changelog"
    image="pepedance.webp"
    :changes="[
        'Added queue filter',
        'Added performance score',
        'Added CS score',
        'Added performance tags',
              ]"
    :close="true"
  ></ChangeLog>

  <div v-if="playerData!==undefined">

    <PlayerSelector @selectedPlayer="set_selected_player"></PlayerSelector>
    <QueueSelector style="position:relative;" class="new_edge" @selectedQueue="set_selected_queue"></QueueSelector>

    <div class="feed_wrapper">
      <div class="feed">
        <HistoryBox
          v-for="(match,i) in matchHistory" :key="match['match_info']['id'] + match['match_info']['player_username']"
          :match="match"
          :next_match="i === matchHistory.length ? undefined : matchHistory[i+1]"
          :index="i"
        ></HistoryBox>
      </div>
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