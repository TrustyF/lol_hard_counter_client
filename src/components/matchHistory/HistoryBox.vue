<script setup>
import { inject, onMounted, watch, computed } from "vue";

let props = defineProps(["match", "player"]);
const curr_api = inject("curr_api");
let rank_mappings = inject("rank_mappings");

function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

function calc_rank_text(val) {
  if (val <= 0) return "unranked";

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
  let min_matches = 15;

  let my_side_ranks = ranks[side].map(value => {
    if (sum(value["winrate"]) > min_matches) return value["rank"];
  }).filter(value => value);

  let other_side_ranks = ranks[other_side].map(value => {
    if (sum(value["winrate"]) > min_matches) return value["rank"];
  }).filter(value => value);

  let avg_my_side_rank = Math.round(sum(my_side_ranks) / my_side_ranks.length);
  let avg_other_side_rank = Math.round(sum(other_side_ranks) / other_side_ranks.length);

  return [sum(my_side_ranks), sum(my_side_ranks), avg_my_side_rank, avg_other_side_rank, calc_rank_text(avg_my_side_rank), calc_rank_text(avg_other_side_rank)];
});
let avg_team_rank_diff = computed(() => team_ranks.value[2] - team_ranks.value[3]);

</script>

<template>
  <div :class="win ? 'match_container lose' : 'match_container win'">
    <img class="player_icon" :src="`${curr_api}/player/profile_icon?player=${player.username}`"
         alt="icon" />
    <p class="kda_text">{{ kda[0] + "/" + kda[1] + "/" + kda[2] }}</p>

    <div class="rank_difference_wrapper">

      <div class="rank_your_team">

        <div class="info_wrapper">
          <div class="tooltip">Your team average rank</div>
        </div>

        <div class="rank_image_wrapper">
          <input type="image" class="rank_image" :src="`/assets/tiers/${convert_rank_to_image(team_ranks[2])}.png`"
                 alt="rank" />
          <div class="rank_text_over_image">
            <p>{{ team_ranks[4][1] }}</p>
          </div>
        </div>
      </div>

      <div class="rank_difference">

        <div class="info_wrapper">
          <div class="tooltip">Lp difference</div>
        </div>

        <div v-if="avg_team_rank_diff !== 0"
             :class=" avg_team_rank_diff < 0 ? 'diff_box red_shadow' : 'diff_box green_shadow'">
          <img :src="avg_team_rank_diff < 0 ? '/assets/ui/arrow_down_single.png' : '/assets/ui/arrow_up_single.png'"
               alt="arrow" class="arrow">
          <p>{{ Math.abs(avg_team_rank_diff) + " lp" }}</p>
        </div>
      </div>

      <div class="rank_enemy_team">

        <div class="info_wrapper">
          <div class="tooltip">Enemy team average rank</div>
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

    <p>{{ new Date(match["match_info"]["duration"] * 1000).toISOString().substring(14, 19) }}</p>
    <!--    <p>{{ match["match_info"]["queue"] }}</p>-->

  </div>
</template>

<style scoped>
.match_container {

  display: flex;
  flex-flow: row wrap;

  gap: 5px;

  height: auto;
  /*overflow: hidden;*/

  border-radius: 11px;
  font-size: 1.2em;

  box-shadow: inset 1px 1px 1px #5a7b9b;
  filter: drop-shadow(2px 2px 2px black);
  /*outline: 1px solid red;*/
}

.kda_text {
  line-height: 50px;
  min-width: 70px;
  text-align: center;
  inset: 0;
  outline: 1px solid red;
}

.info_wrapper {
  line-height: normal;
  position: absolute;
  left: -50%;
  bottom: 120%;

  opacity: 0;
  visibility: hidden;
  /*outline: 1px solid red;*/
  /*margin: 0;*/
  transition: 50ms;
}

.tooltip {
  background-color: #2a2a2a;
  padding: 5px;
  min-width: 100px;
  border-radius: 10px;
  font-size: 0.6em;
  text-align: center;
  box-shadow: inset 1px 1px 1px #5a7b9b;
  filter: drop-shadow(1px 1px 1px black);
}

.tooltip::after {
  content: "";
  position: absolute;
  top: 95%;
  left: 50%;
  margin-left: -10px;
  border-width: 10px;
  border-style: solid;
  border-color: #2a2a2a transparent transparent transparent;
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
  min-width: 180px;
  text-align: center;
  justify-content: space-between;
  outline: 1px solid green;
}

.rank_difference {
  position: relative;
  outline: 1px solid purple;
  line-height: 50px;
  padding: 0 5px 0 0;
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
  /*outline: 1px solid red;*/
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
  outline: 1px solid purple;
}

.rank_your_team:hover .info_wrapper {
  opacity: 100%;
  visibility: visible;
}
.rank_enemy_team {
  position: relative;
  outline: 1px solid purple;
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
  background: linear-gradient(-90deg, rgb(13, 122, 35) 40%, rgba(17, 26, 34, 1) 80%);
}

.lose {
  background: linear-gradient(-90deg, rgb(122, 13, 29) 40%, rgba(17, 26, 34, 1) 80%);
}

.green_shadow {
  filter: drop-shadow(1px 0px 1px black) drop-shadow(1px 0px 3px #00ff00);
}

.red_shadow {
  filter: drop-shadow(1px 0px 1px black) drop-shadow(1px 0px 3px #ff0000);

}
</style>