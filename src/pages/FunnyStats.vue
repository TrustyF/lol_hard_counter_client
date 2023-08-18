<script setup>
import { inject, computed, watch, ref, onMounted } from "vue";
import ChangeLog from "@/components/changelog/ChangeLog.vue";
import PlayerList from "@/components/players/PlayerList.vue";
import QueueSelector from "@/components/queue/QueueSelector.vue";

let playerData = inject("playerData");
// const curr_api = inject("curr_api");
// let selectedPlayers = inject("selectedPlayers");
let selectedQueue = ref("none");


let filtered_players = computed(() => playerData.value);

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

// todo fix queue switch
function calc_stats(player, stat, range, special_case = false) {

  let filtered_queue = player["match_history"];

  if (selectedQueue.value !== "none") {
    filtered_queue = player["match_history"].filter(value => value["match_info"]["queue"] === selectedQueue.value);
  }

  if (filtered_queue.length < 10) return [player.username, 0, 0];

  let last_30 = filtered_queue.slice(0, 30);
  let prev_30 = filtered_queue.slice(10, 40);

  let stat_last_30;
  let stat_prev_30;

  if (special_case) {
    if (stat === "timeAlive") {
      stat_last_30 = sum(last_30.map(value => ((value["match_info"]["duration"] -
        value["player_stats"]["totalTimeSpentDead"]) / value["match_info"]["duration"]) * 100)) / last_30.length;
      stat_prev_30 = sum(prev_30.map(value => ((value["match_info"]["duration"] -
        value["player_stats"]["totalTimeSpentDead"]) / value["match_info"]["duration"]) * 100)) / last_30.length;
    }
    if (stat === "mostCS") {
      stat_last_30 = sum(last_30.map(value => ((value["player_stats"]["totalAllyJungleMinionsKilled"] + value["player_stats"]["totalEnemyJungleMinionsKilled"] + value["player_stats"]["totalMinionsKilled"])
        / value["match_info"]["duration"]) * 60)) / last_30.length;
      stat_prev_30 = sum(prev_30.map(value => ((value["player_stats"]["totalAllyJungleMinionsKilled"] + value["player_stats"]["totalEnemyJungleMinionsKilled"] + value["player_stats"]["totalMinionsKilled"])
        / value["match_info"]["duration"]) * 60)) / last_30.length;
    }
    if (stat === "teamDamagePercentage") {
      stat_last_30 = sum(last_30.map(value => value["player_stats"][stat] * 100)) / last_30.length;
      stat_prev_30 = sum(prev_30.map(value => value["player_stats"][stat] * 100)) / prev_30.length;
    }
    if (stat === "objectivesStolen") {
      stat_last_30 = sum(last_30.map(value => value["player_stats"][stat] - value["player_stats"]["epicMonsterStolenWithoutSmite"]));
      stat_prev_30 = sum(prev_30.map(value => value["player_stats"][stat] - value["player_stats"]["epicMonsterStolenWithoutSmite"]));
    }

    return [player.username, stat_last_30, stat_prev_30];
  }

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

  // console.log("stats comp", stat, stat_last_30, stat_prev_30);

  return [player.username, stat_last_30, stat_prev_30];
}

let mostGames = computed(() => {
  return playerData.value.map(player => {
    let norm = player["match_history"].filter(value => value["match_info"]["queue"] === "ranked_solo_fives");
    let solo = player["match_history"].filter(value => value["match_info"]["queue"] === "ranked_flex_fives");
    let flex = player["match_history"].filter(value => value["match_info"]["queue"] === "normal_draft_fives");
    return [player.username, norm.length, solo.length, flex.length, player["match_history"].length];
  });
});

//General
let mostKills = computed(() => {
  let out = filtered_players.value.map(player => {
    return calc_stats(player, "kills", "per_game");
  });
  out = calc_diff(out);
  return out;
});
let mostDeaths = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "deaths", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostAssists = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "assists", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostGold = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "goldPerMinute", "per_game"));
  out = calc_diff(out);
  return out;
});
// let mostWinrate = computed(() => {
//   let out = filtered_players.value.map(player => calc_stats(player, "goldPerMinute", "per_game"));
//   out = calc_diff(out);
//   return out;
// });
let mostFirstBlood = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "firstBloodKill", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostCS = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "mostCS", "per_minute", true));
  out = calc_diff(out);
  return out;
});
let mostSkillsDodged = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "dodgeSkillShotsSmallWindow", "per_game"));
  out = calc_diff(out);
  return out;
});

//Lane diff
let mostCSOpponentDiff = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "maxCsAdvantageOnLaneOpponent", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostLevelsOpponentDiff = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "maxLevelLeadLaneOpponent", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostVisionOpponentDiff = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "visionScoreAdvantageLaneOpponent", "per_game"));
  out = calc_diff(out);
  return out;
});

//Damage
let mostDamageTaken = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "totalDamageTaken", "per_minute"));
  out = calc_diff(out);
  return out;
});
let mostDamageDealt = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "totalDamageDealt", "per_minute"));
  out = calc_diff(out);
  return out;
});
let mostDamageDealtChampions = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "totalDamageDealtToChampions", "per_minute"));
  out = calc_diff(out);
  return out;
});
let mostTeamDamagePercentage = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "teamDamagePercentage", "per_game", true));
  out = calc_diff(out);
  return out;
});
let mostDamageMitigated = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "damageSelfMitigated", "per_minute"));
  out = calc_diff(out);
  return out;
});
let mostHealing = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "totalHeal", "per_minute"));
  out = calc_diff(out);
  return out;
});
let mostHealingOthers = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "totalHealsOnTeammates", "per_minute"));
  out = calc_diff(out);
  return out;
});
let mostShieldingOthers = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "totalDamageShieldedOnTeammates", "per_minute"));
  out = calc_diff(out);
  return out;
});

//Time
let mostTimeAlive = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "timeAlive", "percent_game", true));
  out = calc_diff(out);
  return out;
});
let mostTimeDead = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "totalTimeSpentDead", "percent_game"));
  out = calc_diff(out);
  return out;
});
let mostTimeCCDealt = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "totalTimeCCDealt", "percent_game"));
  out = calc_diff(out);
  return out;
});
let mostTimeCCTaken = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "timeCCingOthers", "percent_game"));
  out = calc_diff(out);
  return out;
});

//Towers
let mostTowers = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "turretTakedowns", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostTowerDamage = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "damageDealtToTurrets", "per_minute"));
  out = calc_diff(out);
  return out;
});
let mostTowersFirst = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "takedownOnFirstTurret", "per_game"));
  out = calc_diff(out);
  return out;
});

//Objectives
let mostObjectivesStolen = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "objectivesStolen", "total", true));
  out = calc_diff(out);
  return out;
});
let mostObjectivesStolenNoSmite = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "epicMonsterStolenWithoutSmite", "total"));
  out = calc_diff(out);
  return out;
});
let mostHerald = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "teamRiftHeraldKills", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostDragons = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "dragonTakedowns", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostBarons = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "teamBaronKills", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostElders = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "teamElderDragonKills", "per_game"));
  out = calc_diff(out);
  return out;
});

//Vision
let mostPinks = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "detectorWardsPlaced", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostWards = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "wardsPlaced", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostVisionScore = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "visionScore", "per_game"));
  out = calc_diff(out);
  return out;
});

//Kills
let mostDoubleKills = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "doubleKills", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostTripleKills = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "tripleKills", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostQuadraKills = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "quadraKills", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostPentaKills = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "pentaKills", "per_game"));
  out = calc_diff(out);
  return out;
});

// Toxic
let mostMissingPing = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "enemyMissingPings", "per_game"));
  out = calc_diff(out);
  return out;
});
let mostBaitPing = computed(() => {
  let out = filtered_players.value.map(player => calc_stats(player, "baitPings", "per_game"));
  out = calc_diff(out);
  return out;
});


let stats_mapping = ref({});

function map_stats() {
  if (playerData.value !== undefined) {
    stats_mapping.value = {
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
        {
          "heading": "Double kills Ⅱ",
          "scaling": "/ game",
          "value": mostDoubleKills.value,
          "value_format": "float2",
          "images": undefined
        },
        {
          "heading": "Triple kills Ⅲ",
          "scaling": "/ game",
          "value": mostTripleKills.value,
          "value_format": "float2",
          "images": undefined
        },
        {
          "heading": "Quadra kills Ⅳ",
          "scaling": "/ game",
          "value": mostQuadraKills.value,
          "value_format": "float2",
          "images": undefined
        },
        {
          "heading": "Penta kills Ⅴ",
          "scaling": "/ game",
          "value": mostPentaKills.value,
          "value_format": "float2",
          "images": undefined
        }
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
          "scaling": "/ game",
          "value_format": "float2",
          "images": ["/assets/stat_icons/Eye_of_the_Herald.svg"]
        },
        {
          "heading": "Dragons killed",
          "value": mostDragons.value,
          "scaling": "/ game",
          "value_format": "float2",
          "images": ["/assets/stat_icons/Infernal_Soul.svg"]
        },
        {
          "heading": "Elders killed",
          "value": mostElders.value,
          "scaling": "/ game",
          "value_format": "float2",
          "images": ["/assets/stat_icons/Elder.svg"]
        },
        {
          "heading": "Barons killed",
          "value": mostBarons.value,
          "scaling": "/ game",
          "value_format": "float2",
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

function convertRange(value, r1, r2) {
  return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}

function set_selected_queue(val) {
  if (selectedQueue.value !== val) {
    selectedQueue.value = val;
    console.log("queue funny stats set to", val);
  } else {
    selectedQueue.value = "none";
  }
}

watch(playerData, () => {
  map_stats();
});
watch(selectedQueue, () => {
  map_stats();
});

map_stats();
//todo add clear information popup
</script>

<template>

  <ChangeLog
    title="Funny stats™ Changelog"
    image="pepedance.webp"
    :changes="[
        'Added queue filter'
              ]"
    :close="true"
  ></ChangeLog>

  <div v-if="playerData!==undefined" class="main_feed">


    <h1 class="title">Matches breakdown</h1>
    <div class="divider"></div>
    <div
      style="background-color: #111111;box-shadow: inset 0 0 5px #000000;padding: 20px;margin:10px 0 20px 0;border-radius: 9px">

      <div style="display:flex;flex-flow: row wrap;gap: 10px">
        <div style="display: flex;flex-flow: row wrap">
          <div
            style="background-color: #008efa;width: 10px;height: 10px;margin:2px 3px auto 0;border-radius: 50%"></div>
          <p style="font-size: 0.7em">SoloQ</p>
        </div>
        <div style="display: flex;flex-flow: row wrap">
          <div
            style="background-color: #fdc201;width: 10px;height: 10px;margin:2px 3px auto 0;border-radius: 50%"></div>
          <p style="font-size: 0.7em">FlexQ</p>
        </div>
        <div style="display: flex;flex-flow: row wrap">
          <div
            style="background-color: #fd2546;width: 10px;height: 10px;margin:2px 3px auto 0;border-radius: 50%"></div>
          <p style="font-size: 0.7em">Normal</p>
        </div>
      </div>

      <div style="display: flex;flex-flow: row wrap;gap: 10px;">

        <div v-for="player in mostGames" :key="player[0]"
             style="  background: linear-gradient(-90deg, rgba(44,62,80,1) 40%, rgba(17,26,34,1) 80%);
               filter: drop-shadow(2px 2px 2px black);  box-shadow: inset 1px 1px 1px #5a7b9b;
               padding: 10px;  border-radius: 5px;">
          <h1 style="font-size: 1em">{{ player[0] }}</h1>

          <div
            style="display: flex;flex-flow: row wrap;align-items: start;width: 200px;filter: drop-shadow(2px 2px 1px black);">
            <div
              :style="`width: ${Math.floor(convertRange(player[1],[0,player[4]],[0,200]))}px;height: 5px;background-color: #008efa`"></div>
            <div
              :style="`width: ${Math.floor(convertRange(player[2],[0,player[4]],[0,200]))}px;height: 5px;background-color: #fdc201`"></div>
            <div
              :style="`width: ${Math.floor(convertRange(player[3],[0,player[4]],[0,200]))}px;height: 5px;background-color: #fd2546`"></div>
          </div>

        </div>
      </div>

    </div>

    <QueueSelector style="position:relative;" class="new_edge" @selectedQueue="set_selected_queue"></QueueSelector>

    <img class="click_me" src="/extras/click_me3.png" alt="click me">

    <div v-for="heading in Object.keys(stats_mapping)" :key="heading">
      <h1 class="title">{{ heading }}</h1>
      <div class="divider"></div>

      <PlayerList
        :stats="stats_mapping[heading]"
        :tier_enabled="false"
        height="400px"
      ></PlayerList>

    </div>

  </div>


</template>

<style scoped>

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

.divider {
  height: 1px;
  background-color: white;
  margin-bottom: 20px;
}
</style>
