<script setup>
import { inject, computed, watch, ref, onMounted } from "vue";
import PlayerBox from "@/components/players/PlayerBox.vue";
import ChangeLog from "@/components/changelog/ChangeLog.vue";

let playerData = inject("playerData");
// const curr_api = inject("curr_api");
// let selectedPlayers = inject("selectedPlayers");

let filtered_players = computed(() => playerData.value.filter(value => value["match_history"]["matches"].length > 10));

function calc_diff(player_arr) {
  // console.log('player arr',player_arr);

  //remove 0 values
  player_arr = player_arr.filter(value => value[1] !== 0);

  let new_sort_games = player_arr.slice().sort((a, b) => b[1] - a[1]);
  let old_sort_games = player_arr.slice().sort((a, b) => b[2] - a[2]);

  let new_sort_usernames = new_sort_games.map(entry => entry[0]);
  let old_sort_usernames = old_sort_games.map(entry => entry[0]);

  let out = player_arr.map(player => {
    let diff = old_sort_usernames.indexOf(player[0]) - new_sort_usernames.indexOf(player[0]);
    player.push(diff);
    return player;
  });

  out = out.sort((a, b) => b[1] - a[1]);

  return out;
}

function sum(f_data) {
  return f_data.reduce((a, b) => a + (b || 0), 0);
}

function calc_stats(player, category, stat, range, special_case = false) {

  let last_30 = player["match_history"]["matches"].slice(0, 30);
  let prev_30 = player["match_history"]["matches"].slice(20, 50);

  let stat_last_30;
  let stat_prev_30;

  if (special_case) {
    if (stat === "timeAlive") {
      stat_last_30 = sum(last_30.map(value => ((value["player_stats"][category]["timePlayed"] -
        value["player_stats"][category]["totalTimeSpentDead"]) / value["match_info"]["duration"]) * 100)) / last_30.length;
      stat_prev_30 = sum(prev_30.map(value => ((value["player_stats"][category]["timePlayed"] -
        value["player_stats"][category]["totalTimeSpentDead"]) / value["match_info"]["duration"]) * 100)) / last_30.length;
    }
    if (stat === "mostCS") {
      stat_last_30 = sum(last_30.map(value => ((value["player_stats"]["totalAllyJungleMinionsKilled"] + value["player_stats"]["totalEnemyJungleMinionsKilled"] + value["player_stats"][category]["totalMinionsKilled"])
        / value["match_info"]["duration"]) * 60)) / last_30.length;
      stat_prev_30 = sum(prev_30.map(value => ((value["player_stats"]["totalAllyJungleMinionsKilled"] + value["player_stats"]["totalEnemyJungleMinionsKilled"] + value["player_stats"][category]["totalMinionsKilled"])
        / value["match_info"]["duration"]) * 60)) / last_30.length;
    }
    if (stat === "teamDamagePercentage") {
      stat_last_30 = sum(last_30.map(value => value["player_stats"][category][stat] * 100)) / last_30.length;
      stat_prev_30 = sum(prev_30.map(value => value["player_stats"][category][stat] * 100)) / prev_30.length;
    }
    if (stat === "objectivesStolen") {
      stat_last_30 = sum(last_30.map(value => value["player_stats"][category][stat] - value["player_stats"]["challenges"]["epicMonsterStolenWithoutSmite"]));
      stat_prev_30 = sum(prev_30.map(value => value["player_stats"][category][stat] - value["player_stats"]["challenges"]["epicMonsterStolenWithoutSmite"]));
    }

    return [player.username, stat_last_30, stat_prev_30];
  }

  if (category === undefined) {

    if (range === "per_game") {
      stat_last_30 = sum(last_30.map(value => value["player_stats"][stat])) / last_30.length;
      stat_prev_30 = sum(prev_30.map(value => value["player_stats"][stat])) / prev_30.length;
    }

    if (range === "per_minute") {
      stat_last_30 = sum(last_30.map(value => (value["player_stats"][stat] / value["match_info"]["duration"]) * 60)) / last_30.length;
      stat_prev_30 = sum(prev_30.map(value => (value["player_stats"][stat] / value["match_info"]["duration"]) * 60)) / prev_30.length;
    }

    if (range === "percent_game") {
      stat_last_30 = sum(last_30.map(value => (value["player_stats"][stat] / value["match_info"]["duration"]) * 100)) / last_30.length;
      stat_prev_30 = sum(prev_30.map(value => (value["player_stats"][stat] / value["match_info"]["duration"]) * 100)) / prev_30.length;
    }

    if (range === "total") {
      stat_last_30 = sum(last_30.map(value => value["player_stats"][stat]));
      stat_prev_30 = sum(prev_30.map(value => value["player_stats"][stat]));
    }

    return [player.username, stat_last_30, stat_prev_30];

  }

  if (range === "per_game") {
    stat_last_30 = sum(last_30.map(value => value["player_stats"][category][stat])) / last_30.length;
    stat_prev_30 = sum(prev_30.map(value => value["player_stats"][category][stat])) / prev_30.length;
  }

  if (range === "per_minute") {
    stat_last_30 = sum(last_30.map(value => (value["player_stats"][category][stat] / value["match_info"]["duration"]) * 60)) / last_30.length;
    stat_prev_30 = sum(prev_30.map(value => (value["player_stats"][category][stat] / value["match_info"]["duration"]) * 60)) / prev_30.length;
  }

  if (range === "percent_game") {
    stat_last_30 = sum(last_30.map(value => (value["player_stats"][category][stat] / value["match_info"]["duration"]) * 100)) / last_30.length;
    stat_prev_30 = sum(prev_30.map(value => (value["player_stats"][category][stat] / value["match_info"]["duration"]) * 100)) / prev_30.length;
  }

  if (range === "total") {
    stat_last_30 = sum(last_30.map(value => value["player_stats"][category][stat]));
    stat_prev_30 = sum(prev_30.map(value => value["player_stats"][category][stat]));
  }

  // console.log("stats comp", stat, stat_last_30, stat_prev_30);

  return [player.username, stat_last_30, stat_prev_30];
}

let mostGames = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "kills", "per_game"));
  return out;
});

//General
let mostKills = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "kills", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostDeaths = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "deaths", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostAssists = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "assists", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostGold = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "challenges", "goldPerMinute", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostFirstBlood = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "firstBloodKill", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostCS = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "mostCS", "per_minute", true));
  out = calc_diff(out);
  return out;
});
let mostSkillsDodged = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "challenges", "dodgeSkillShotsSmallWindow", "per_game"));
  out = calc_diff(out);
  return out;
});

//Lane diff
let mostCSOpponentDiff = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "challenges", "maxCsAdvantageOnLaneOpponent", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostLevelsOpponentDiff = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "challenges", "maxLevelLeadLaneOpponent", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostVisionOpponentDiff = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "challenges", "visionScoreAdvantageLaneOpponent", "per_game"));
  out = calc_diff(out);
  return out;
});

//Damage
let mostDamageTaken = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "totalDamageTaken", "per_minute"));
  out = calc_diff(out);
  return out;
});
let mostDamageDealt = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "totalDamageDealt", "per_minute"));
  out = calc_diff(out);
  return out;
});
let mostDamageDealtChampions = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "totalDamageDealtToChampions", "per_minute"));
  out = calc_diff(out);
  return out;
});
let mostTeamDamagePercentage = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "challenges", "teamDamagePercentage", "per_game", true));
  out = calc_diff(out);
  return out;
});
let mostDamageMitigated = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "damageSelfMitigated", "per_minute"));
  out = calc_diff(out);
  return out;
});
let mostHealing = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "totalHeal", "per_minute"));
  out = calc_diff(out);
  return out;
});
let mostHealingOthers = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "totalHealsOnTeammates", "per_minute"));
  out = calc_diff(out);
  return out;
});
let mostShieldingOthers = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "totalDamageShieldedOnTeammates", "per_minute"));
  out = calc_diff(out);
  return out;
});

//Time
let mostTimeAlive = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "timeAlive", "percent_game", true));
  out = calc_diff(out);
  return out;
});
let mostTimeDead = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "totalTimeSpentDead", "percent_game"));
  out = calc_diff(out);
  return out;
});
let mostTimeCCDealt = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "totalTimeCCDealt", "percent_game"));
  out = calc_diff(out);
  return out;
});
let mostTimeCCTaken = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "timeCCingOthers", "percent_game"));
  out = calc_diff(out);
  return out;
});

//Towers
let mostTowers = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "turretTakedowns", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostTowerDamage = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "damageDealtToTurrets", "per_minute"));
  out = calc_diff(out);
  return out;
});
let mostTowersFirst = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "challenges", "takedownOnFirstTurret", "per_game"));
  out = calc_diff(out);
  return out;
});

//Objectives
let mostObjectivesStolen = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "objectivesStolen", "total", true));
  out = calc_diff(out);
  return out;
});
let mostObjectivesStolenNoSmite = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "challenges", "epicMonsterStolenWithoutSmite", "total"));
  out = calc_diff(out);
  return out;
});
let mostHerald = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "challenges", "teamRiftHeraldKills", "total"));
  out = calc_diff(out);
  return out;
});
let mostDragons = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "challenges", "dragonTakedowns", "total"));
  out = calc_diff(out);
  return out;
});
let mostBarons = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "challenges", "teamBaronKills", "total"));
  out = calc_diff(out);
  return out;
});
let mostElders = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "challenges", "teamElderDragonKills", "total"));
  out = calc_diff(out);
  return out;
});

//Vision
let mostPinks = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "detectorWardsPlaced", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostWards = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "wardsPlaced", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostVisionScore = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "visionScore", "per_game"));
  out = calc_diff(out);
  return out;
});

//Kills
let mostDoubleKills = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "doubleKills", "total"));
  out = calc_diff(out);
  return out;
});
let mostTripleKills = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "tripleKills", "total"));
  out = calc_diff(out);
  return out;
});
let mostQuadraKills = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "quadraKills", "total"));
  out = calc_diff(out);
  return out;
});
let mostPentaKills = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "stats", "pentaKills", "total"));
  out = calc_diff(out);
  return out;
});

// Toxic
let mostMissingPing = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, undefined, "enemyMissingPings", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostBaitPing = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, undefined, "baitPings", "per_game"));
  out = calc_diff(out);
  return out;
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
          "images": ["/assets/stat_icons/Keyword_Quick_Attack.svg"]
        },
        {
          "heading": "Deaths",
          "scaling": "/ game",
          "value": mostDeaths.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/skull.svg"]
        },
        {
          "heading": "Assists",
          "scaling": "/ game",
          "value": mostAssists.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/assist.svg"]
        },
        {
          "heading": "First blood",
          "scaling": "/ game",
          "value": mostFirstBlood.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/firstblood.svg"]
        },
        {
          "heading": "Gold",
          "scaling": "/ min",
          "value": mostGold.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/coin.svg"]
        },
        {
          "heading": "CS",
          "scaling": "/ min",
          "value": mostCS.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/minion.svg"]
        },
        {
          "heading": "Skillshots dodged",
          "scaling": "/ game",
          "value": mostSkillsDodged.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/dodge.svg"]
        }
      ],
      "Damage": [
        {
          "heading": "Damage dealt",
          "scaling": "/ minute",
          "value": mostDamageDealt.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/Critical_strike.svg"]
        },
        {
          "heading": "Damage dealt to champions",
          "scaling": "/ minute",
          "value": mostDamageDealtChampions.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/Critical_strike.svg", "/assets/stat_icons/Champion.svg"]
        },
        {
          "heading": "Team damage share",
          "scaling": "/ game",
          "value": mostTeamDamagePercentage.value,
          "value_format": "percentage",
          "images": ["/assets/stat_icons/Critical_strike.svg", "/assets/stat_icons/Keyword_Landmark.svg"]
        },
        {
          "heading": "Damage taken",
          "scaling": "/ minute",
          "value": mostDamageTaken.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/Keyword_Block.svg"]
        },

        {
          "heading": "Damage mitigated",
          "scaling": "/ minute",
          "value": mostDamageMitigated.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/Keyword_Barrier.svg"]
        },
        {
          "heading": "Healing self",
          "scaling": "/ minute",
          "value": mostHealing.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/Healing.svg"]
        },
        {
          "heading": "Healing others",
          "scaling": "/ minute",
          "value": mostHealingOthers.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/Keyword_Fated.svg"]
        },
        {
          "heading": "Shielding others",
          "scaling": "/ minute",
          "value": mostShieldingOthers.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/Keyword_SpellShield.svg"]
        }
      ],
      "Lane diff": [
        {
          "heading": "More CS than opponent",
          "scaling": "/ game",
          "value": mostCSOpponentDiff.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/Minion_icon.png", "/assets/stat_icons/Keyword_Strongest.svg"]
        },
        {
          "heading": "More levels than opponent",
          "scaling": "/ game",
          "value": mostLevelsOpponentDiff.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/Keyword_Level_Up.svg", "/assets/stat_icons/Keyword_Strongest.svg"]
        },
        {
          "heading": "More vision than opponent",
          "scaling": "/ game",
          "value": mostVisionOpponentDiff.value,
          "value_format": "float2",
          "images": ["/assets/stat_icons/Need_Vision_ping.svg", "/assets/stat_icons/Keyword_Strongest.svg"]
        }
      ],
      "Time row": [
        {
          "heading": "Time alive",
          "scaling": "% game time",
          "value": mostTimeAlive.value,
          "value_format": "percentage",
          "images": ["/assets/stat_icons/dove.svg"]
        },
        {
          "heading": "Time grey screen",
          "scaling": "% game time",
          "value": mostTimeDead.value,
          "value_format": "percentage",
          "images": ["/assets/stat_icons/coffin.svg"]
        },
        {
          "heading": "CC Applied",
          "scaling": "% game time",
          "value": mostTimeCCDealt.value,
          "value_format": "percentage",
          "images": ["/assets/stat_icons/Keyword_Deep.svg"]
        },
        {
          "heading": "CC Taken",
          "scaling": "% game time",
          "value": mostTimeCCTaken.value,
          "value_format": "percentage",
          "images": ["/assets/stat_icons/Keyword_Stun.svg"]

        }
      ],
      "Multi-kills": [
        { "heading": "Double kills Ⅱ", "value": mostDoubleKills.value, "value_format": "int", "images": undefined },
        { "heading": "Triple kills Ⅲ", "value": mostTripleKills.value, "value_format": "int", "images": undefined },
        { "heading": "Quadra kills Ⅳ", "value": mostQuadraKills.value, "value_format": "int", "images": undefined },
        { "heading": "Penta kills Ⅴ", "value": mostPentaKills.value, "value_format": "int", "images": undefined }
      ],
      "Vision": [
        {
          "heading": "Vision score",
          "scaling": "/ game",
          "value": mostVisionScore.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/Enemy_Vision_ping.svg"]
        },
        {
          "heading": "Wards placed",
          "scaling": "/ game",
          "value": mostWards.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/ward.svg"]
        },
        {
          "heading": "Pinks placed",
          "scaling": "/ game",
          "value": mostPinks.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/Need_Vision_ping.svg"]
        }
      ],
      "Toxicity": [
        {
          "heading": "wtf ping",
          "scaling": "/ game",
          "value": mostMissingPing.value,
          "value_format": "float2",
          "images": ["/assets/stat_icons/missing_ping.svg"]
        },
        {
          "heading": "kys ping",
          "scaling": "/ game",
          "value": mostBaitPing.value,
          "value_format": "float2",
          "images": ["/assets/stat_icons/bait_ping.svg"]
        }
      ],
      "Objectives": [
        {
          "heading": "Objectives stolen",
          "value": mostObjectivesStolen.value,
          "value_format": "int",
          "images": ["/assets/stat_icons/smite.svg"]
        },
        {
          "heading": "Objectives stolen no smite",
          "value": mostObjectivesStolenNoSmite.value,
          "value_format": "int",
          "images": ["/assets/stat_icons/no_smite.svg"]
        },
        {
          "heading": "Heralds killed",
          "value": mostHerald.value,
          "value_format": "int",
          "images": ["/assets/stat_icons/Eye_of_the_Herald.svg"]
        },
        {
          "heading": "Dragons killed",
          "value": mostDragons.value,
          "value_format": "int",
          "images": ["/assets/stat_icons/Infernal_Soul.svg"]
        },
        {
          "heading": "Elders killed",
          "value": mostElders.value,
          "value_format": "int",
          "images": ["/assets/stat_icons/Elder.svg"]
        },
        {
          "heading": "Barons killed",
          "value": mostBarons.value,
          "value_format": "int",
          "images": ["/assets/stat_icons/Nashor.svg"]
        }
      ],
      "Where tower ?": [
        {
          "heading": "Towers taken",
          "scaling": "/ game",
          "value": mostTowers.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/Keyword_Tough.svg"]
        },
        {
          "heading": "First blood towers",
          "scaling": "/ game",
          "value": mostTowersFirst.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/firstblood.svg", "/assets/stat_icons/Keyword_Tough.svg"]
        },
        {
          "heading": "Damage dealt to towers",
          "scaling": "/ minute",
          "value": mostTowerDamage.value,
          "value_format": "float",
          "images": ["/assets/stat_icons/Critical_strike.svg", "/assets/stat_icons/Keyword_Tough.svg"]
        }
      ]
    };
  }
}

watch(playerData, () => {
  map_stats();
});

//todo add clear information popup

map_stats();

</script>

<template>

  <div v-if="playerData!==undefined">

    <ChangeLog
      title="changes"
      image="pepedance.webp"
      :changes="[
        'Funny stats™ ranks are now comparing the last 30 game against the 30 games before that for better accuracy',
          'Added DAMAGE category',
          'Added LANE DIFF category',
          'Added more objectives to OBJECTIVES',
          'Fixed cc stats'
          ]"
      :close="true"
    ></ChangeLog>

    <img class="click_me" src="/extras/click_me3.png" alt="click me">

    <div v-for="heading in Object.keys(stats_mapping)" :key="heading">
      <h1 class="title">{{ heading }}</h1>
      <div class="divider"></div>
      <div class="funny_wrapper">
        <div v-for="col in stats_mapping[heading]" :key="col['heading']">
          <div
            class="stat_column">
            <div class="column_heading">
              <div class="stats_image_wrapper" v-if="col['images']!==undefined">
                <img v-for="im in col['images']" :src="im" :key="im" alt="stat_image" class="stats_image">
              </div>
              <p class="heading_text">{{ col["heading"] }}</p>
              <p class="heading_scaling">{{ col["scaling"] }}</p>
            </div>
            <div class="stats_scroll_box">
              <div class="stats_list">
                <PlayerBox v-for="(data,i) in col['value']"
                           :key="data[0]"
                           :text="data"
                           :index="i"
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
  height: 25px;
  gap: 5px;
  margin-bottom: 5px;
  /*outline: 1px solid green;*/
  justify-content: center;
  /*height: fit-content;*/
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
  gap: 30px;
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

  height: 400px;
  overflow-y: scroll;
  /*overflow-x: hidden;*/
  scrollbar-width: none;
  box-shadow: inset 0px 0px 5px #000000;

}

.stats_scroll_box::-webkit-scrollbar {
  display: none;
}

.stats_image {
  object-fit: scale-down;
  height: 20px;
  width: 20px;
  margin: auto 0 auto 0;
  filter: invert();
  /*border-radius: 5px;*/
  /*outline: 1px solid red;*/
}

.stats_image_wrapper {
  display: flex;
  gap: 5px;
  margin: 0 0 auto 0;
}

.heading_text {
  position: relative;
  margin: 0;
  transform: translate(0, 1px);
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
