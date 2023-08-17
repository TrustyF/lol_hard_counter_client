<script setup>
import { inject, onMounted, watch, computed } from "vue";

let props = defineProps(["match"]);
const curr_api = inject("curr_api");
let rank_mappings = inject("rank_mappings");

function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

function calc_rank_text(val) {
  if (val <= 0) return ["unranked", undefined, 0];

  const lp = val % 100;
  const tier = (val - lp - ((val - lp) % 400)) / 400;
  const div = ((val - lp) % 400) / 100;

  return [`${rank_mappings["tier_values"][tier]}`, `${rank_mappings["division_values"][div]}`, `${lp}`];
}

function convert_rank_to_image(val) {
  if (val <= 0) return "unranked";
  const lp = val % 100;
  const tier = (val - lp - ((val - lp) % 400)) / 400;
  return rank_mappings["tier_values"][tier];
}

let win = computed(() => props["match"]["match_info"]["match_win"]);
let kda = computed(() => {
  let info = props["match"]["player_stats"];
  return [info["kills"], info["deaths"], info["assists"]];
});
let team_ranks = computed(() => {
  let side = props["match"]["match_info"]["player_side"];
  let other_side = side === "red" ? "blue" : "red";
  let ranks = props["match"]["match_ranks"];
  let min_matches = 30;

  let my_side_ranks = ranks[side].map(value => {
    if (sum(value["winrate"]) > min_matches) return value["rank"];
    return 0;
  }).filter(value => value);

  let other_side_ranks = ranks[other_side].map(value => {
    if (sum(value["winrate"]) > min_matches) return value["rank"];
    return 0;
  }).filter(value => value);

  // console.log(my_side_ranks);

  let avg_my_side_rank = my_side_ranks.length > 0 ? Math.round(sum(my_side_ranks) / my_side_ranks.length) : 0;
  let avg_other_side_rank = other_side_ranks.length > 0 ? Math.round(sum(other_side_ranks) / other_side_ranks.length) : 0;

  return [sum(my_side_ranks), sum(my_side_ranks), avg_my_side_rank, avg_other_side_rank, calc_rank_text(avg_my_side_rank), calc_rank_text(avg_other_side_rank)];
  // console.log(out);
  // return out;
});
let avg_team_rank_diff = computed(() => team_ranks.value[2] - team_ranks.value[3]);

</script>

<template>
  <div :class="win ? 'match_container lose' : 'match_container win'">
    <img class="player_icon" :src="`${curr_api}/player/profile_icon?player=${match['match_info']['player_username']}`"
         alt="icon" />

    <p style="line-height: 50px;font-size: 1em;min-width: 80px;text-align: center;">
      {{ kda[0] + "/" + kda[1] + "/" + kda[2] }}</p>

    <div class="horizontal_divider"></div>

    <div class="rank_difference_wrapper">

      <div class="rank_your_team data_tooltip_activator">

        <div class="data_tooltip_wrapper">
          <div class="data_tooltip">
            Your team average rank
          </div>
        </div>

        <div class="rank_image_wrapper">
          <input type="image" class="rank_image" :src="`/assets/tiers/${convert_rank_to_image(team_ranks[2])}.png`"
                 alt="rank" />
          <div class="rank_text_over_image">
            <p>{{ team_ranks[4][1] }}</p>
          </div>
        </div>
      </div>

      <div class="rank_difference data_tooltip_activator">

        <div class="data_tooltip_wrapper">
          <div class="data_tooltip">
            Average lp difference
          </div>
        </div>

        <div
          :class="team_ranks[2] !== 0 && team_ranks[3] !== 0 ? avg_team_rank_diff < 100 ? avg_team_rank_diff > -100 ? 'diff_box' : 'diff_box red_shadow' : 'diff_box green_shadow': 'diff_box'">
          <img v-if="team_ranks[2] !== 0 && team_ranks[3] !== 0"
               :src="avg_team_rank_diff < 0 ? '/assets/ui/arrow_down_single.png' : '/assets/ui/arrow_up_single.png'"
               alt="arrow" class="arrow">
          <p style="font-size: 0.8em">{{ team_ranks[2] !== 0 && team_ranks[3] !== 0 ? Math.abs(avg_team_rank_diff) + " lp" : "~" }}</p>
        </div>
      </div>

      <div class="rank_enemy_team data_tooltip_activator">

        <div class="data_tooltip_wrapper">
          <div class="data_tooltip">
            Enemy team average rank
          </div>
        </div>

        <div class="rank_image_wrapper">
          <input type="image" class="rank_image" :src="`/assets/tiers/${convert_rank_to_image(team_ranks[3])}.png`"
                 alt="rank" />
          <div class="rank_text_over_image">
            <p>{{ team_ranks[5][1] }}</p>
          </div>
        </div>
      </div>

    </div>

    <div class="horizontal_divider"></div>

    <p style="line-height: 50px;font-size: 0.8em;min-width: 50px;text-align: center;">
      {{ new Date(match["match_info"]["duration"] * 1000).toISOString().substring(14, 19) }}</p>

    <div class="horizontal_divider"></div>

    <p style="line-height: 50px;font-size: 0.8em;min-width: 150px;text-align: center;">
      {{ match["match_info"]["queue"].split("_").slice(0,2).join(" ") }}</p>

    <div class="horizontal_divider"></div>

    <p style="line-height: 50px;font-size: 0.8em">{{ match["match_info"]["creation"] }}</p>

  </div>
</template>

<style scoped>
.match_container {

  display: flex;
  flex-flow: row wrap;
  position: relative;

  gap: 5px;

  height: fit-content;
  padding: 0 10px 0 0;

  border-radius: 11px;
  font-size: 1.2em;

  box-shadow: inset 1px 1px 1px #5a7b9b;
  filter: drop-shadow(2px 2px 2px black);
  text-shadow: 1px 1px 5px black, 2px 1px 1px black;
  /*outline: 1px solid red;*/
}

.horizontal_divider {
  width: 1px;
  height: 20px;
  margin: auto 5px auto 5px;
  background-color: #5a7b9b;
  /*box-shadow: 1px 1px 1px #5a7b9b;*/
}

.player_icon {
  position: relative;
  height: 50px;
  width: 50px;
  border-radius: 9px;
  margin: auto 0 auto 0;
  /*filter: drop-shadow(2px 0 1px #08121a);*/
  background: #000;
  /*outline: 1px solid red;*/
}

.rank_difference_wrapper {
  display: flex;
  flex-flow: row wrap;
  min-width: 160px;
  text-align: center;
  justify-content: space-between;
  /*outline: 1px solid green;*/
}

.rank_difference {
  text-align: center;

  position: relative;
  /*outline: 1px solid purple;*/
  line-height: 50px;
  /*padding: 0 5px 0 0;*/
}

.rank_difference:hover .info_wrapper {
  opacity: 100%;
  visibility: visible;
}

.diff_box {
  display: flex;
  flex-flow: row nowrap;
  gap: 3px;
}

.rank_image {
  height: 50px;
  width: 50px;
  /*outline: 1px solid yellow;*/
}

.rank_image_wrapper {
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  /*outline: 1px solid red;*/
}

.rank_text_over_image {
  position: absolute;
  text-align: center;
  inset: 0;
  font-size: 0.7em;
  /*height: 5px;*/
  /*outline: 1px solid red;*/
}

.rank_your_team {
  position: relative;
  transform: translate(0,3px);
  /*outline: 1px solid purple;*/
}

.rank_your_team:hover .info_wrapper {
  opacity: 100%;
  visibility: visible;
}

.rank_enemy_team {
  position: relative;
  transform: translate(0,3px);
  /*outline: 1px solid purple;*/
}

.rank_enemy_team:hover .info_wrapper {
  opacity: 100%;
  visibility: visible;
}


.arrow {
  margin: auto 0 auto 0;
  width: 10px;
  height: 10px;
  /*transform: translate(0, -4px);*/
  z-index: 20;
  /*filter: drop-shadow(0px 0px 1px black) drop-shadow(-1px 1px 2px black) drop-shadow(-1px 2px 3px black);*/
}

.win {
  background: linear-gradient(-90deg, rgb(9, 82, 24) 40%, rgba(17, 26, 34, 1) 80%);
  /*background: linear-gradient(-90deg, rgb(50, 200, 50) 40%, rgba(17, 26, 34, 1) 80%);*/
}

.lose {
  background: linear-gradient(-90deg, rgb(122, 13, 29) 40%, rgba(17, 26, 34, 1) 80%);
  /*background: linear-gradient(-90deg, rgb(200, 50, 50) 40%, rgba(17, 26, 34, 1) 80%);*/
}

.green_shadow {
  filter: drop-shadow(1px 0px 1px black) drop-shadow(0px 0px 2px #00ff00);
}

.red_shadow {
  filter: drop-shadow(1px 0px 1px black) drop-shadow(0px 0px 2px #ff0000);

}
</style>