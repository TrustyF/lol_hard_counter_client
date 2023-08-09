<script setup>
import { inject, computed, watch, onMounted } from "vue";
import PlayerBox from "@/components/players/PlayerBox.vue";

let playerData = inject("playerData");
const curr_api = inject("curr_api");
let selectedPlayers = inject("selectedPlayers");
const divider = "-";

let filtered_players = computed(() => {
  return playerData.value.filter(val => val["funny_stats"]["total_matches"] > 10);
});

function prep(f_data) {
  f_data = f_data.filter(value => value[1] > 0);
  f_data.sort((a, b) => b[1] - a[1]);
  // f_data.splice(5);
  return f_data;
}

function calc_diff(f_raw, f_diff) {
  return f_raw.map(val => {
    let username = val[0];
    let new_usernames = f_raw.map(entry => entry[0]);
    let old_usernames = f_diff.map(entry => entry[0]);
    val.push(old_usernames.indexOf(username) - new_usernames.indexOf(username));
    return val;
  });
}

let mostKills = computed(() => {
  let stat = "kills";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["kda"][0] / val["funny_stats"]["total_matches"]).toFixed(2)]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["kda"][0] / val["funny_stats"]["difference"]["data"]["total_matches"]).toFixed(2)]));
  return calc_diff(raw, diff);
});
let mostDeaths = computed(() => {
  let stat = "kills";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["kda"][1] / val["funny_stats"]["total_matches"]).toFixed(2)]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["kda"][1] / val["funny_stats"]["difference"]["data"]["total_matches"]).toFixed(2)]));
  return calc_diff(raw, diff);
});
let mostAssists = computed(() => {
  let stat = "kills";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["kda"][2] / val["funny_stats"]["total_matches"]).toFixed(2)]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["kda"][2] / val["funny_stats"]["difference"]["data"]["total_matches"]).toFixed(2)]));
  return calc_diff(raw, diff);
});
let mostGold = computed(() => {
  let stat = "gold";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat] / val["funny_stats"]["time"]["total_time_played"] * 60).toFixed(2)]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat] / val["funny_stats"]["difference"]["data"]["time"]["total_time_played"] * 60).toFixed(2)]));
  return calc_diff(raw, diff);
});

let mostTimeAlive = computed(() => {
  let stat = "time";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["time_spent_alive"] / val["funny_stats"]["time"]["total_time_played"] * 100).toFixed(2)]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["time_spent_alive"] / val["funny_stats"]["difference"]["data"]["time"]["total_time_played"] * 100).toFixed(2)]));
  return calc_diff(raw, diff);
});
let mostTimeDead = computed(() => {
  let stat = "time";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["time_spent_dead"] / val["funny_stats"]["time"]["total_time_played"] * 100).toFixed(2)]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["time_spent_dead"] / val["funny_stats"]["difference"]["data"]["time"]["total_time_played"] * 100).toFixed(2)]));
  return calc_diff(raw, diff);
});
let mostTimeCCSelf = computed(() => {
  let stat = "time";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["time_cc_self"] / val["funny_stats"]["time"]["total_time_played"] * 100).toFixed(2)]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["time_cc_self"] / val["funny_stats"]["difference"]["data"]["time"]["total_time_played"] * 100).toFixed(2)]));
  return calc_diff(raw, diff);
});
let mostTimeCCOther = computed(() => {
  let stat = "time";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["time_cc_other"] / val["funny_stats"]["time"]["total_time_played"] * 100).toFixed(2)]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["time_cc_other"] / val["funny_stats"]["difference"]["data"]["time"]["total_time_played"] * 100).toFixed(2)]));
  return calc_diff(raw, diff);
});

let mostTowers = computed(() => {
  let stat = "objectives";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["tower_kills"] / val["funny_stats"]["total_matches"]).toFixed(2)]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["tower_kills"] / val["funny_stats"]["difference"]["data"]["total_matches"]).toFixed(2)]));
  return calc_diff(raw, diff);
});
let mostTowersFirst = computed(() => {
  let stat = "objectives";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["first_tower_kill"] / val["funny_stats"]["total_matches"]).toFixed(2)]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["first_tower_kill"] / val["funny_stats"]["difference"]["data"]["total_matches"]).toFixed(2)]));
  return calc_diff(raw, diff);
});
let mostObjectivesStolen = computed(() => {
  let stat = "objectives";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["objectives_stolen"])]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["objectives_stolen"])]));
  return calc_diff(raw, diff);
});

let mostDragons = computed(() => {
  let stat = "monsters";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["dragon_kills"])]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["dragon_kills"])]));
  return calc_diff(raw, diff);
});
let mostBarons = computed(() => {
  let stat = "monsters";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["baron_kills"])]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["baron_kills"])]));
  return calc_diff(raw, diff);
});
let mostCS = computed(() => {
  let stat = "monsters";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["creep_kills"] / val["funny_stats"]["time"]["total_time_played"] * 60).toFixed(2)]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["creep_kills"] / val["funny_stats"]["difference"]["data"]["time"]["total_time_played"] * 60).toFixed(2)]));
  return calc_diff(raw, diff);
});

let mostPinks = computed(() => {
  let stat = "vision";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["pinks"] / val["funny_stats"]["total_matches"]).toFixed(2)]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["pinks"] / val["funny_stats"]["difference"]["data"]["total_matches"]).toFixed(2)]));
  return calc_diff(raw, diff);
});
let mostWards = computed(() => {
  let stat = "vision";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["wards"] / val["funny_stats"]["total_matches"]).toFixed(2)]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["wards"] / val["funny_stats"]["difference"]["data"]["total_matches"]).toFixed(2)]));
  return calc_diff(raw, diff);
});
let mostVisionScore = computed(() => {
  let stat = "vision";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["vision_score"] / val["funny_stats"]["total_matches"]).toFixed(2)]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["vision_score"] / val["funny_stats"]["difference"]["data"]["total_matches"]).toFixed(2)]));
  return calc_diff(raw, diff);
});

let mostDoubleKills = computed(() => {
  let stat = "kills";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["double_kills"])]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["double_kills"])]));
  return calc_diff(raw, diff);
});
let mostTripleKills = computed(() => {
  let stat = "kills";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["triple_kills"])]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["triple_kills"])]));
  return calc_diff(raw, diff);
});
let mostQuadraKills = computed(() => {
  let stat = "kills";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["quadra_kills"])]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["quadra_kills"])]));
  return calc_diff(raw, diff);
});
let mostPentaKills = computed(() => {
  let stat = "kills";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["penta_kills"])]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["penta_kills"])]));
  return calc_diff(raw, diff);
});

let mostMissingPing = computed(() => {
  let stat = "pings";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["missing"] / val["funny_stats"]["total_matches"]).toFixed(2)]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["missing"] / val["funny_stats"]["difference"]["data"]["total_matches"]).toFixed(2)]));
  return calc_diff(raw, diff);
});
let mostBaitPing = computed(() => {
  let stat = "pings";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["bait"] / val["funny_stats"]["total_matches"]).toFixed(2)]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["bait"] / val["funny_stats"]["difference"]["data"]["total_matches"]).toFixed(2)]));
  return calc_diff(raw, diff);
});

let mostSkillsDodged = computed(() => {
  let stat = "other";
  let raw = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"][stat]["skill_shots_dodged"] / val["funny_stats"]["total_matches"]).toFixed(2)]));
  let diff = prep(filtered_players.value.map(val => [val.username, (val["funny_stats"]["difference"]["data"][stat]["skill_shots_dodged"] / val["funny_stats"]["difference"]["data"]["total_matches"]).toFixed(2)]));
  return calc_diff(raw, diff);
});

let stats_mapping = {};

function map_stats(){
  if (playerData.value !== undefined) {
    stats_mapping = {
      "General": [
        ["Kills / game ⚔️︎", mostKills.value],
        ["Deaths / game ☠️", mostDeaths.value],
        ["Assists / game 🤝", mostAssists.value],
        ["Gold / min 💵", mostGold.value],
        ["CS / min 🧙", mostCS.value],
        ["Skillshots dodged / game 🦶", mostSkillsDodged.value]
      ],
      "Multi-kills": [
        ["Double kills 2️⃣️", mostDoubleKills.value],
        ["Triple kills 3️⃣️", mostTripleKills.value],
        ["Quadra kills 4️⃣️", mostQuadraKills.value],
        ["Penta kills 5️⃣️", mostPentaKills.value]
      ],
      "Time row": [
        ["% Game time alive 🕊️", mostTimeAlive.value],
        ["% Game time grey screen ⚰️️️", mostTimeDead.value],
        ["% Game time CC applied 🔒️", mostTimeCCSelf.value],
        ["% Game time CC Taken ☕️️", mostTimeCCOther.value]
      ],
      "Objectives": [
        ["Objectives stolen 👺", mostObjectivesStolen.value],
        ["Dragons killed 🐉", mostDragons.value],
        ["Barons killed 🐍", mostBarons.value]
      ],
      "Vision": [
        ["Vision score / game 👁️", mostVisionScore.value],
        ["Wards placed / game 🔭", mostWards.value],
        ["Pinks placed / game 🔮", mostPinks.value]
      ],
      "Toxicity": [
        ["❓ ping / game ️", mostMissingPing.value],
        ["⚓(bait) ping / game ️", mostBaitPing.value]
      ],
      "Where tower ?": [
        ["Towers taken / game ♜", mostTowers.value],
        ["First blood towers / game 🩸♜", mostTowersFirst.value]
      ]
    };
  }
}

watch(playerData, () => {
  map_stats()
});

map_stats()

</script>

<template>
  <div v-if="playerData!==undefined">

        <div
          style=";font-family: 'Farmhouse',sans-serif;width:70px;height:70px;position: absolute;
              transform: rotate(-6deg) translate(-120px);background-color: rgb(255,213,0);padding: 10px;border-radius: 50%;display: flex;flex-flow: row wrap;
              align-items: center;justify-content: center;box-shadow: 0 0 40px #887400">
          <p
            style="font-size:2em;font-weight: bold;line-height: 30px;color: red;margin: 0;
                text-shadow: rgb(255, 255, 255) 2px 0px 0px, rgb(255, 255, 255) 1.75517px 0.958851px 0px, rgb(255, 255, 255) 1.0806px 1.68294px 0px, rgb(255, 255, 255) 0.141474px 1.99499px 0px, rgb(255, 255, 255) -0.832294px 1.81859px 0px, rgb(255, 255, 255) -1.60229px 1.19694px 0px, rgb(255, 255, 255) -1.97999px 0.28224px 0px, rgb(255, 255, 255) -1.87291px -0.701566px 0px, rgb(255, 255, 255) -1.30729px -1.51361px 0px, rgb(255, 255, 255) -0.421592px -1.95506px 0px, rgb(255, 255, 255) 0.567324px -1.91785px 0px, rgb(255, 255, 255) 1.41734px -1.41108px 0px, rgb(255, 255, 255) 1.92034px -0.558831px 0px;"
          >Tracks changes!</p>
        </div>
        <p style="font-size: 0.8em;position: absolute;transform:translate(-150px,100px);">Refreshes once a day</p>
        <p style="font-size: 0.8em;position: absolute;transform:translate(-150px,120px);">(example values used)</p>

    <div v-for="heading in Object.keys(stats_mapping)" :key="heading">
      <h1 class="title">{{ heading }}</h1>
      <div class="divider"></div>
      <div class="funny_wrapper">
        <div v-for="col in stats_mapping[heading]" :key="col[0]">
          <div class="stat_column">
            <p class="column_heading">{{ col[0] }}</p>
            <div class="stats_scroll_box">
              <div class="stats_list">
                <PlayerBox v-for="data in col[1]"
                           :key="data[0]"
                           :text="`${data[1]} ${divider} ${data[0]}`"
                           :difference="data[2]"
                           :username="data[0]"></PlayerBox>
              </div>
            </div>
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
  text-align: center;
  position: relative;
}

.divider {
  height: 1px;
  background-color: white;
  margin-bottom: 20px;
}

.funny_wrapper {
  display: flex;
  flex-flow: row wrap;
  /*justify-content: space-between;*/
  gap: 20px;
  margin-bottom: 40px;
  width: 100%;
  /*outline: 1px solid red;*/
}

.stats_scroll_box {
  position: relative;
  min-width: 250px;
  background-color: #111111;
  padding: 20px;
  border-radius: 10px;

  height: 360px;
  overflow-y: scroll;
  /*overflow-x: hidden;*/
  scrollbar-width: none;

}

.stats_scroll_box::-webkit-scrollbar {
  display: none;
}

.stats_list {
  display: flex;
  flex-flow: column nowrap;
  /*grid-template-columns: repeat(auto-fill, auto);*/
  justify-content: start;
  gap: 10px;
}
</style>
