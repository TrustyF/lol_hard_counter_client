<script setup>
import { inject, computed, watch } from "vue";
import PlayerBox from "@/components/players/PlayerBox.vue";
import Signlode from "/assets/fonts/Signlode.ttf";
import Rainstorm from "/assets/fonts/July Rainstorm.ttf";

let playerData = inject("playerData");
// const curr_api = inject("curr_api");
let selectedPlayers = inject("selectedPlayers");

// watch(selectedPlayers.value, () => {
//   update_chart();
// });

let filtered_players = computed(() => {
  return playerData.value.filter(val => val["funny_stats"]["total_matches"] > 10);
});

function prep(f_data) {
  f_data = f_data.filter(value => value[1] >= 0.01);
  f_data.sort((a, b) => b[1] - a[1]);
  // f_data.splice(5);
  return f_data;
}

let mostKills = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["kills"]["kda"][0] / val["funny_stats"]["total_matches"]).toFixed(2)]);
  return prep(out);
});
let mostDeaths = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["kills"]["kda"][1] / val["funny_stats"]["total_matches"]).toFixed(2)]);
  return prep(out);
});
let mostAssists = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["kills"]["kda"][2] / val["funny_stats"]["total_matches"]).toFixed(2)]);
  return prep(out);
});
let mostGold = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["gold"] / val["funny_stats"]["total_matches"]).toFixed(2)]);
  return prep(out);
});

let mostTowers = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["objectives"]["tower_kills"] / val["funny_stats"]["total_matches"]).toFixed(2)]);
  return prep(out);
});
let mostTowersFirst = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["objectives"]["first_tower_kill"] / val["funny_stats"]["total_matches"]).toFixed(2)]);
  return prep(out);
});

let mostTimeAlive = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["time"]["time_spent_alive"] / val["funny_stats"]["total_matches"]).toFixed(2)]);
  return prep(out);
});
let mostTimeDead = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["time"]["time_spent_dead"] / val["funny_stats"]["total_matches"]).toFixed(2)]);
  return prep(out);
});
let mostTimeCCSelf = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["time"]["time_cc_self"] / val["funny_stats"]["total_matches"]).toFixed(2)]);
  return prep(out);
});
let mostTimeCCOther = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["time"]["time_cc_other"] / val["funny_stats"]["total_matches"]).toFixed(2)]);
  return prep(out);
});

let mostObjectivesStolen = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["objectives"]["objectives_stolen"])]);
  return prep(out);
});
let mostDragons = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["monsters"]["dragon_kills"] / val["funny_stats"]["total_matches"]).toFixed(2)]);
  return prep(out);
});
let mostBarons = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["monsters"]["baron_kills"] / val["funny_stats"]["total_matches"]).toFixed(2)]);
  return prep(out);
});

let mostPinks = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["vision"]["pinks"] / val["funny_stats"]["total_matches"]).toFixed(2)]);
  return prep(out);
});
let mostWards = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["vision"]["wards"] / val["funny_stats"]["total_matches"]).toFixed(2)]);
  return prep(out);
});
let mostVisionScore = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["vision"]["vision_score"] / val["funny_stats"]["total_matches"]).toFixed(2)]);
  return prep(out);
});

let mostDoubleKills = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["kills"]["double_kills"] / val["funny_stats"]["total_matches"]).toFixed(2)]);
  return prep(out);
});
let mostTripleKills = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["kills"]["triple_kills"] / val["funny_stats"]["total_matches"]).toFixed(2)]);
  return prep(out);
});
let mostQuadraKills = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["kills"]["quadra_kills"] / val["funny_stats"]["total_matches"]).toFixed(2)]);
  return prep(out);
});
let mostPentaKills = computed(() => {
  let out = filtered_players.value.map(val => [val.username, (val["funny_stats"]["kills"]["penta_kills"] / val["funny_stats"]["total_matches"]).toFixed(2)]);
  return prep(out);
});
</script>

<template>
  <div v-if="playerData!==undefined">



    <h1 class="title">General</h1>
    <div class="divider"></div>

    <div
      style=";font-family: 'Farmhouse',sans-serif;width:4vw;height:4vw;position: relative;margin-bottom: 20px;
      transform: rotate(-6deg);background-color: rgb(255,213,0);padding: 10px;border-radius: 50%;display: flex;
      align-items: center;justify-content: center;box-shadow: 0 0 40px #887400">
      <p
        style="font-size:2vw;font-weight: bold;line-height: 25px;color: red;margin: auto;
        text-shadow: rgb(255, 255, 255) 2px 0px 0px, rgb(255, 255, 255) 1.75517px 0.958851px 0px, rgb(255, 255, 255) 1.0806px 1.68294px 0px, rgb(255, 255, 255) 0.141474px 1.99499px 0px, rgb(255, 255, 255) -0.832294px 1.81859px 0px, rgb(255, 255, 255) -1.60229px 1.19694px 0px, rgb(255, 255, 255) -1.97999px 0.28224px 0px, rgb(255, 255, 255) -1.87291px -0.701566px 0px, rgb(255, 255, 255) -1.30729px -1.51361px 0px, rgb(255, 255, 255) -0.421592px -1.95506px 0px, rgb(255, 255, 255) 0.567324px -1.91785px 0px, rgb(255, 255, 255) 1.41734px -1.41108px 0px, rgb(255, 255, 255) 1.92034px -0.558831px 0px;"
        >Now scrollable!</p>
    </div>

    <div class="funny_wrapper">

      <div class="stat_column">
        <p class="column_heading">Kills ⚔️︎</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostKills" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

      <div class="stat_column">
        <p class="column_heading">Deaths ☠️</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostDeaths" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

      <div class="stat_column">
        <p class="column_heading">Assists 🤝</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostAssists" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

      <div class="stat_column">
        <p class="column_heading">Gold 💵</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostGold" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

    </div>

    <h1 class="title new">Multi-kills</h1>
    <div class="divider"></div>
    <div class="funny_wrapper">

      <div class="stat_column">
        <p class="column_heading">Double kills 2️⃣️︎</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostDoubleKills" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

      <div class="stat_column">
        <p class="column_heading">Triple kills 3️⃣️︎</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostTripleKills" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

      <div class="stat_column">
        <p class="column_heading">Quadra kills 4️⃣</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostQuadraKills" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

      <div class="stat_column">
        <p class="column_heading">Penta kills 5️⃣</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostPentaKills" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

    </div>

    <h1 class="title">Time row</h1>
    <div class="divider"></div>
    <div class="funny_wrapper">

      <div class="stat_column">
        <p class="column_heading">Time alive 🕊️⏳</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostTimeAlive" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

      <div class="stat_column">
        <p class="column_heading">Time grey screen ⚰️️⏳</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostTimeDead" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

      <div class="stat_column">
        <p class="column_heading">CC time applied 🔒</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostTimeCCOther" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

      <div class="stat_column">
        <p class="column_heading">CC time Taken ☕️️</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostTimeCCSelf" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

    </div>

    <h1 class="title">Objectives</h1>
    <div class="divider"></div>
    <div class="funny_wrapper">

      <div class="stat_column">
        <p class="column_heading">Objectives stolen 👺</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostObjectivesStolen" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

      <div class="stat_column">
        <p class="column_heading">Dragons killed 🐉</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostDragons" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

      <div class="stat_column">
        <p class="column_heading">Barons killed 🐍</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostBarons" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

    </div>

    <h1 class="title">Vision</h1>
    <div class="divider"></div>
    <div class="funny_wrapper">

      <div class="stat_column">
        <p class="column_heading">Vision score 👁️</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostVisionScore" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

      <div class="stat_column">
        <p class="column_heading">Wards placed 🔭</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostWards" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

      <div class="stat_column">
        <p class="column_heading">Pinks placed 🔮</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostPinks" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

    </div>

    <h1 class="title">Yorick moment</h1>
    <div class="divider"></div>
    <div class="funny_wrapper">

      <div class="stat_column">
        <p class="column_heading">Towers taken ♜</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostTowers" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

      <div class="stat_column">
        <p class="column_heading">First blood towers 🩸♜</p>
        <div class="stats_scroll_box">
          <div class="stats_list">
            <PlayerBox v-for="data in mostTowersFirst" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                       :username="data[0]"></PlayerBox>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped>
p {
  margin-bottom: 5px;
}

.title {
  position: relative;
  padding-left: 20px;
  width: fit-content;
}

.stat_column {
}

.stat_column::-webkit-scrollbar {
  display: none;
}

.column_heading {
}

.divider {
  height: 1px;
  background-color: white;
  margin-bottom: 20px;
}

.funny_wrapper {
  display: flex;
  flex-flow: row wrap;
  gap: 40px;
  margin-bottom: 20px;
}

.stats_scroll_box {
  min-width: 250px;
  background-color: #111111;
  padding: 20px 20px 20px 20px;
  border-radius: 10px;

  height: 350px;
  overflow-y: scroll;
  /*overflow-x: hidden;*/
  scrollbar-width: none;

}

.stats_list {
  display: flex;
  flex-flow: column nowrap;
  /*grid-template-columns: repeat(auto-fill, auto);*/
  justify-content: start;
  gap: 10px;
}
</style>
