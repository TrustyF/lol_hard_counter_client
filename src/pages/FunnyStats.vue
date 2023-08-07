<script setup>
import { inject, computed, watch } from "vue";
import PlayerBox from "@/components/players/PlayerBox.vue";

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
  f_data.splice(5);
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

    <div
      style="background-color: #18222c;padding: 20px;border-radius: 5px;width: 10vw;margin-bottom: 10px;position: fixed;right: 10px;bottom: 0">
      <h1 style="font-size: 1em;font-weight: bold;text-decoration: underline">Info</h1>
      <p style="font-size: 0.8em">All stats are averages calculated over the total amount of recorded games</p>
    </div>

    <h1 class="title">General</h1>
    <div class="divider"></div>
    <div class="funny_wrapper">

      <div>
        <p>Kills ⚔️︎</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostKills" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
        </div>
      </div>

      <div>
        <p>Deaths ☠️</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostDeaths" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
        </div>
      </div>

      <div>
        <p>Assists 🤝</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostAssists" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
        </div>
      </div>

      <div>
        <p>Gold 💵</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostGold" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
        </div>
      </div>

    </div>

    <h1 class="title">Multi-kills</h1>
    <div class="divider"></div>
    <div class="funny_wrapper">

      <div>
        <p>Double kills 2️⃣️︎</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostDoubleKills" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
        </div>
      </div>

      <div>
        <p>Triple kills 3️⃣️︎</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostTripleKills" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
        </div>
      </div>

      <div>
        <p>Quadra kills 4️⃣</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostQuadraKills" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
        </div>
      </div>

      <div>
        <p>Penta kills 5️⃣</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostPentaKills" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
        </div>
      </div>

    </div>

    <h1 class="title">Time row</h1>
    <div class="divider"></div>
    <div class="funny_wrapper">

      <div>
        <p>Time alive 🕊️⏳</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostTimeAlive" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
        </div>
      </div>

      <div>
        <p>Time grey screen ⚰️️⏳</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostTimeDead" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
        </div>
      </div>

      <div>
        <p>CC time applied 🔒</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostTimeCCOther" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
        </div>
      </div>

      <div>
        <p>CC time Taken ☕️️</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostTimeCCSelf" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
        </div>
      </div>

    </div>

    <h1 class="title">Objectives</h1>
    <div class="divider"></div>
    <div class="funny_wrapper">

      <div>
        <p>Objectives stolen 👺</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostObjectivesStolen" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
        </div>
      </div>

      <div>
        <p>Dragons killed 🐉</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostDragons" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
        </div>
      </div>

      <div>
        <p>Barons killed 🐍</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostBarons" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
        </div>
      </div>

    </div>

    <h1 class="title">Vision</h1>
    <div class="divider"></div>
    <div class="funny_wrapper">

      <div>
        <p>Vision score 👁️</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostVisionScore" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
        </div>
      </div>

      <div>
        <p>Wards placed 🔭</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostWards" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
        </div>
      </div>

      <div>
        <p>Pinks placed 🔮</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostPinks" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
        </div>
      </div>

    </div>

    <h1 class="title">Yorick moment</h1>
    <div class="divider"></div>
    <div class="funny_wrapper">

      <div>
        <p>Towers taken ♜</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostTowers" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
        </div>
      </div>

      <div>
        <p>First blood towers 🩸♜</p>
        <div class="stats_list">
          <PlayerBox v-for="data in mostTowersFirst" :key="data[0]" :text="`${data[1]} - ${data[0]}`"
                     :username="data[0]"></PlayerBox>
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
  padding-left: 20px;
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

.stats_list {
  display: flex;
  flex-flow: column wrap;
  gap: 10px;
}
</style>
