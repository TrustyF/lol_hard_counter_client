<script setup>
import { inject, computed, watch, ref, onMounted } from "vue";
import PlayerBox from "@/components/players/PlayerBox.vue";
import ChangeLog from "@/components/changelog/ChangeLog.vue";

let playerData = inject("playerData");
// const curr_api = inject("curr_api");
// let selectedPlayers = inject("selectedPlayers");

let filtered_players = computed(() => {
  let max_matches = 30;
  let out = JSON.parse(JSON.stringify(playerData.value));

  out.forEach(player => {
    if (player["match_history"]["total_matches"] > max_matches) {
      player["funny_stats"].splice(max_matches);
      player["match_history"]["total_matches"] = max_matches;
    }
  });

  console.log(out);
  return out;
});

function prep(f_data) {
  f_data = f_data.filter(value => value[1] > 0);
  f_data.sort((a, b) => b[1] - a[1]);
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

function sum(f_data) {
  return f_data.reduce((a, b) => a + b, 0);
}

function over_tot_games(f_data, f_player) {

  return f_data / f_player["match_history"]["total_matches"];
}

function over_min(val, time) {
  return ((val / time["match"]["match_time"]) * 60);
}

function over_percent(val, time) {
  return ((val / time["match"]["match_time"]) * 100);
}

let mostKills = computed(() => {
  let stat = ["kills", "kda", 0];
  let raw = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].map(val => val[stat[0]][stat[1]][stat[2]])), player)]));
  let diff = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => val[stat[0]][stat[1]][stat[2]])), player)]));
  return calc_diff(raw, diff);
});
let mostDeaths = computed(() => {
  let stat = ["kills", "kda", 1];
  let raw = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].map(val => val[stat[0]][stat[1]][stat[2]])), player)]));
  let diff = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => val[stat[0]][stat[1]][stat[2]])), player)]));
  return calc_diff(raw, diff);
});
let mostAssists = computed(() => {
  let stat = ["kills", "kda", 2];
  let raw = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].map(val => val[stat[0]][stat[1]][stat[2]])), player)]));
  let diff = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => val[stat[0]][stat[1]][stat[2]])), player)]));
  return calc_diff(raw, diff);
});
let mostGold = computed(() => {
  let stat = ["gold"];
  let raw = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].map(val => over_min(val[stat[0]], val))), player)]));
  let diff = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => over_min(val[stat[0]], val))), player)]));
  return calc_diff(raw, diff);
});

let mostTimeAlive = computed(() => {
  let stat = ["time", "time_spent_alive"];
  let raw = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].map(val => over_percent(val[stat[0]][stat[1]], val))), player)]));
  let diff = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => over_percent(val[stat[0]][stat[1]], val))), player)]));
  return calc_diff(raw, diff);
});
let mostTimeDead = computed(() => {
  let stat = ["time", "time_spent_dead"];
  let raw = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].map(val => over_percent(val[stat[0]][stat[1]], val))), player)]));
  let diff = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => over_percent(val[stat[0]][stat[1]], val))), player)]));
  return calc_diff(raw, diff);
});
let mostTimeCCSelf = computed(() => {
  let stat = ["time", "time_cc_self"];
  let raw = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].map(val => over_percent(val[stat[0]][stat[1]], val))), player)]));
  let diff = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => over_percent(val[stat[0]][stat[1]], val))), player)]));
  return calc_diff(raw, diff);
});
let mostTimeCCOther = computed(() => {
  let stat = ["time", "time_cc_other"];
  let raw = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].map(val => over_percent(val[stat[0]][stat[1]], val))), player)]));
  let diff = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => over_percent(val[stat[0]][stat[1]], val))), player)]));
  return calc_diff(raw, diff);
});

let mostTowers = computed(() => {
  let stat = ["objectives", "tower_kills"];
  let raw = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].map(val => val[stat[0]][stat[1]])), player)]));
  let diff = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => val[stat[0]][stat[1]])), player)]));
  return calc_diff(raw, diff);
});
let mostTowersFirst = computed(() => {
  let stat = ["objectives", "first_tower_kill"];
  let raw = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].map(val => val[stat[0]][stat[1]])), player)]));
  let diff = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => val[stat[0]][stat[1]])), player)]));
  return calc_diff(raw, diff);
});
let mostObjectivesStolen = computed(() => {
  let stat = ["objectives", "objectives_stolen"];
  let raw = prep(filtered_players.value.map(player => [player.username, sum(player["funny_stats"].map(val => val[stat[0]][stat[1]]))]));
  let diff = prep(filtered_players.value.map(player => [player.username, sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => val[stat[0]][stat[1]]))]));
  return calc_diff(raw, diff);
});

let mostDragons = computed(() => {
  let stat = ["monsters", "dragon_kills"];
  let raw = prep(filtered_players.value.map(player => [player.username, sum(player["funny_stats"].map(val => val[stat[0]][stat[1]]))]));
  let diff = prep(filtered_players.value.map(player => [player.username, sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => val[stat[0]][stat[1]]))]));
  return calc_diff(raw, diff);
});
let mostBarons = computed(() => {
  let stat = ["monsters", "baron_kills"];
  let raw = prep(filtered_players.value.map(player => [player.username, sum(player["funny_stats"].map(val => val[stat[0]][stat[1]]))]));
  let diff = prep(filtered_players.value.map(player => [player.username, sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => val[stat[0]][stat[1]]))]));
  return calc_diff(raw, diff);
});
let mostCS = computed(() => {
  let stat = ["monsters", "creep_kills"];
  let raw = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].map(val => over_min(val[stat[0]][stat[1]], val))), player)]));
  let diff = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => over_min(val[stat[0]][stat[1]], val))), player)]));
  return calc_diff(raw, diff);
});

let mostPinks = computed(() => {
  let stat = ["vision", "pinks"];
  let raw = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].map(val => val[stat[0]][stat[1]])), player)]));
  let diff = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => val[stat[0]][stat[1]])), player)]));
  return calc_diff(raw, diff);
});
let mostWards = computed(() => {
  let stat = ["vision", "wards"];
  let raw = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].map(val => val[stat[0]][stat[1]])), player)]));
  let diff = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => val[stat[0]][stat[1]])), player)]));
  return calc_diff(raw, diff);
});
let mostVisionScore = computed(() => {
  let stat = ["vision", "vision_score"];
  let raw = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].map(val => val[stat[0]][stat[1]])), player)]));
  let diff = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => val[stat[0]][stat[1]])), player)]));
  return calc_diff(raw, diff);
});

let mostDoubleKills = computed(() => {
  let stat = ["kills", "double_kills"];
  let raw = prep(filtered_players.value.map(player => [player.username, sum(player["funny_stats"].map(val => val[stat[0]][stat[1]]))]));
  let diff = prep(filtered_players.value.map(player => [player.username, sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => val[stat[0]][stat[1]]))]));
  return calc_diff(raw, diff);
});
let mostTripleKills = computed(() => {
  let stat = ["kills", "triple_kills"];
  let raw = prep(filtered_players.value.map(player => [player.username, sum(player["funny_stats"].map(val => val[stat[0]][stat[1]]))]));
  let diff = prep(filtered_players.value.map(player => [player.username, sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => val[stat[0]][stat[1]]))]));
  return calc_diff(raw, diff);
});
let mostQuadraKills = computed(() => {
  let stat = ["kills", "quadra_kills"];
  let raw = prep(filtered_players.value.map(player => [player.username, sum(player["funny_stats"].map(val => val[stat[0]][stat[1]]))]));
  let diff = prep(filtered_players.value.map(player => [player.username, sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => val[stat[0]][stat[1]]))]));
  return calc_diff(raw, diff);
});
let mostPentaKills = computed(() => {
  let stat = ["kills", "penta_kills"];
  let raw = prep(filtered_players.value.map(player => [player.username, sum(player["funny_stats"].map(val => val[stat[0]][stat[1]]))]));
  let diff = prep(filtered_players.value.map(player => [player.username, sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => val[stat[0]][stat[1]]))]));
  return calc_diff(raw, diff);
});

let mostMissingPing = computed(() => {
  let stat = ["pings", "missing"];
  let raw = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].map(val => val[stat[0]][stat[1]])), player)]));
  let diff = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => val[stat[0]][stat[1]])), player)]));
  return calc_diff(raw, diff);
});
let mostBaitPing = computed(() => {
  let stat = ["pings", "bait"];
  let raw = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].map(val => val[stat[0]][stat[1]])), player)]));
  let diff = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => val[stat[0]][stat[1]])), player)]));
  return calc_diff(raw, diff);
});

let mostSkillsDodged = computed(() => {
  let stat = ["other", "skill_shots_dodged"];
  let raw = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].map(val => val[stat[0]][stat[1]])), player)]));
  let diff = prep(filtered_players.value.map(player => [player.username, over_tot_games(sum(player["funny_stats"].filter(val => !player["funny_stats_diff"]["data"].includes(val["match"]["match_id"])).map(val => val[stat[0]][stat[1]])), player)]));
  return calc_diff(raw, diff);
});

let stats_mapping = {};

function map_stats() {
  if (playerData.value !== undefined) {
    stats_mapping = {
      "General": [
        {
          "heading": "Kills",
          "scaling": "/ game",
          "value": mostKills.value,
          "value_format": "float",
          "image": "/assets/stat_icons/Keyword_Quick_Attack.svg"
        },
        {
          "heading": "Deaths",
          "scaling": "/ game",
          "value": mostDeaths.value,
          "value_format": "float",
          "image": "/assets/stat_icons/skull.svg"
        },
        {
          "heading": "Assists",
          "scaling": "/ game",
          "value": mostAssists.value,
          "value_format": "float",
          "image": "/assets/stat_icons/assist.svg"
        },
        {
          "heading": "Gold",
          "scaling": "/ min",
          "value": mostGold.value,
          "value_format": "float",
          "image": "/assets/stat_icons/coin.svg"
        },
        {
          "heading": "CS",
          "scaling": "/ min",
          "value": mostCS.value,
          "value_format": "float",
          "image": "/assets/stat_icons/Minion.webp"
        },
        {
          "heading": "Skillshots dodged",
          "scaling": "/ game",
          "value": mostSkillsDodged.value,
          "value_format": "float",
          "image": "/assets/stat_icons/dodge.svg"
        }
      ],
      "Time row": [
        {
          "heading": "Time alive",
          "scaling": "% game time",
          "value": mostTimeAlive.value,
          "value_format": "percentage",
          "image": "/assets/stat_icons/dove.svg"
        },
        {
          "heading": "Time grey screen",
          "scaling": "% game time",
          "value": mostTimeDead.value,
          "value_format": "percentage",
          "image": "/assets/stat_icons/coffin.svg"
        },
        {
          "heading": "CC Applied",
          "scaling": "% game time",
          "value": mostTimeCCOther.value,
          "value_format": "percentage",
          "image": "/assets/stat_icons/Keyword_Deep.svg"
        },
        {
          "heading": "CC Taken",
          "scaling": "% game time",
          "value": mostTimeCCSelf.value,
          "value_format": "percentage",
          "image": "/assets/stat_icons/Keyword_Stun.svg"

        }
      ],
      "Multi-kills": [
        { "heading": "Double kills Ⅱ", "value": mostDoubleKills.value, "value_format": "int", "image": undefined },
        { "heading": "Triple kills Ⅲ", "value": mostTripleKills.value, "value_format": "int", "image": undefined },
        { "heading": "Quadra kills Ⅳ", "value": mostQuadraKills.value, "value_format": "int", "image": undefined },
        { "heading": "Penta kills Ⅴ", "value": mostPentaKills.value, "value_format": "int", "image": undefined }
      ],
      "Vision": [
        {
          "heading": "Vision score",
          "scaling": "/ game",
          "value": mostVisionScore.value,
          "value_format": "float",
          "image": "/assets/stat_icons/vision.svg"
        },
        {
          "heading": "Wards placed",
          "scaling": "/ game",
          "value": mostWards.value,
          "value_format": "float",
          "image": "/assets/stat_icons/ward.svg"
        },
        {
          "heading": "Pinks placed",
          "scaling": "/ game",
          "value": mostPinks.value,
          "value_format": "float",
          "image": "/assets/stat_icons/Need_Vision_ping.svg"
        }
      ],
      "Toxicity": [
        {
          "heading": "",
          "scaling": "/ game",
          "value": mostMissingPing.value,
          "value_format": "float",
          "image": "/assets/stat_icons/missing_ping.svg"
        },
        {
          "heading": "",
          "scaling": "/ game",
          "value": mostBaitPing.value,
          "value_format": "float",
          "image": "/assets/stat_icons/bait_ping.svg"
        }
      ],
      "Objectives": [
        {
          "heading": "Objectives stolen",
          "value": mostObjectivesStolen.value,
          "value_format": "int",
          "image": "/assets/stat_icons/smite.svg"
        },
        {
          "heading": "Dragons killed",
          "value": mostDragons.value,
          "value_format": "int",
          "image": "/assets/stat_icons/drake.svg"
        },
        {
          "heading": "Barons killed",
          "value": mostBarons.value,
          "value_format": "int",
          "image": "/assets/stat_icons/Nashor.svg"
        }
      ],
      "Where tower ?": [
        {
          "heading": "Towers taken",
          "scaling": "/ game",
          "value": mostTowers.value,
          "value_format": "float",
          "image": "/assets/stat_icons/Keyword_Tough.svg"
        },
        {
          "heading": "First blood towers",
          "scaling": "/ game",
          "value": mostTowersFirst.value,
          "value_format": "float",
          "image": "/assets/stat_icons/tower_first_blood.svg"
        }
      ]
    };
  }
}

watch(playerData, () => {
  map_stats();
});

map_stats();

</script>

<template>

  <div v-if="playerData!==undefined">

    <!--    <div-->
    <!--      style=";font-family: 'Farmhouse',sans-serif;width:70px;height:70px;position: absolute;-->
    <!--              transform: rotate(-6deg) translate(-120px);background-color: rgb(255,213,0);padding: 10px;border-radius: 50%;display: flex;flex-flow: row wrap;-->
    <!--              align-items: center;justify-content: center;box-shadow: 0 0 40px #887400">-->
    <!--      <p-->
    <!--        style="font-size:2em;font-weight: bold;line-height: 30px;color: red;margin: 0;-->
    <!--                text-shadow: rgb(255, 255, 255) 2px 0px 0px, rgb(255, 255, 255) 1.75517px 0.958851px 0px, rgb(255, 255, 255) 1.0806px 1.68294px 0px, rgb(255, 255, 255) 0.141474px 1.99499px 0px, rgb(255, 255, 255) -0.832294px 1.81859px 0px, rgb(255, 255, 255) -1.60229px 1.19694px 0px, rgb(255, 255, 255) -1.97999px 0.28224px 0px, rgb(255, 255, 255) -1.87291px -0.701566px 0px, rgb(255, 255, 255) -1.30729px -1.51361px 0px, rgb(255, 255, 255) -0.421592px -1.95506px 0px, rgb(255, 255, 255) 0.567324px -1.91785px 0px, rgb(255, 255, 255) 1.41734px -1.41108px 0px, rgb(255, 255, 255) 1.92034px -0.558831px 0px;"-->
    <!--      >Tracks changes!</p>-->
    <!--    </div>-->
    <!--    <p style="font-size: 0.8em;position: absolute;transform:translate(-150px,100px);">Refreshes once a day</p>-->
    <!--    <p style="font-size: 0.8em;position: absolute;transform:translate(-150px,120px);">(example values used)</p>-->
    <ChangeLog
      title="changes"
      image="pepedance.webp"
      :changes="['Funny stats™ is now calculated on the last 30 games','Rank changes will be updated hourly and notified with a badge','removed player selector, your can now select from the list directly']"
      :close="true"
    ></ChangeLog>

    <img class="click_me" src="/extras/click_me3.png" alt="click me">

    <div v-for="heading in Object.keys(stats_mapping)" :key="heading">
      <h1 class="title">{{ heading }}</h1>
      <div class="divider"></div>
      <div class="funny_wrapper">
        <div v-for="col in stats_mapping[heading]" :key="col['heading']">
          <div
            :class="col['value'].map(val => Math.abs(val[2])).reduce((a, b) => a + b, 0) > 0 ? 'stat_column new_text' : 'stat_column'">
            <div class="column_heading">
              <p class="heading_text">{{ col["heading"] }}</p>
              <img v-if="col['image']!==undefined" :src="col['image']" alt="stat_image" class="stats_image">
              <p class="heading_scaling">{{ col["scaling"] }}</p>
            </div>
            <div class="stats_scroll_box">
              <div class="stats_list">
                <PlayerBox v-for="data in col['value']"
                           :key="data[0]"
                           :text="data"
                           :value_format="col['value_format']">
                </PlayerBox>
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

.click_me {
  position: absolute;
  transform: translate(-90px, 110px);
  width: 150px;
  filter: invert(1);
}

.title {
  position: relative;
  padding-left: 20px;
  width: fit-content;
}

.stat_column {
  position: relative;
}

.stat_column::-webkit-scrollbar {
  display: none;
}

.column_heading {
  position: relative;
  display: flex;
  flex-flow: row wrap;
  gap: 5px;
  margin-bottom: 5px;
  /*outline: 1px solid green;*/
  justify-content: center;
  height: fit-content;
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

.stats_image {
  object-fit: scale-down;
  height: 20px;
  /*width: 25px;*/
  margin: auto 0 auto 0;
  /*border-radius: 5px;*/
  /*outline: 1px solid red;*/
}

.heading_text {
  margin: 0;
  /*outline: 1px solid red;*/
}

.heading_scaling {
  color: #626262;
  margin: auto 0 auto 0;
  text-align: center;
  font-size: 0.75em;
  /*outline: 1px solid red;*/
}

.stats_list {
  display: flex;
  flex-flow: column nowrap;
  /*grid-template-columns: repeat(auto-fill, auto);*/
  justify-content: start;
  gap: 10px;
}
</style>
