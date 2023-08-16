<script setup>
import { inject, onMounted, watch, computed } from "vue";

let props = defineProps(["match", "player"]);
const curr_api = inject("curr_api");
let rank_mappings = inject("rank_mappings");

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

  let my_side_rank = ranks[side].map(value => value["rank"]).reduce((a, b) => a + b, 0);
  let other_side_rank = ranks[other_side].map(value => value["rank"]).reduce((a, b) => a + b, 0);

  let avg_my_side_rank = Math.round(my_side_rank / 5);
  let avg_other_side_rank = Math.round(other_side_rank / 5);


  return [my_side_rank, other_side_rank, avg_my_side_rank, avg_other_side_rank, calc_rank_text(avg_my_side_rank), calc_rank_text(avg_other_side_rank)];
});
let avg_team_rank_diff = computed(() => team_ranks.value[2] - team_ranks.value[3]);

</script>

<template>
  <div :class="win ? 'match_container lose' : 'match_container win'">
    <img class="player_icon" :src="`${curr_api}/player/profile_icon?player=${player.username}`"
         alt="icon" />
    <p style="line-height: 50px;">{{ kda[0] + "/" + kda[1] + "/" + kda[2] }}</p>

    <div class="rank_your_team">
      <div class="rank_image_wrapper">
        <input type="image" class="rank_image" :src="`/assets/tiers/${convert_rank_to_image(team_ranks[2])}.png`"
               alt="rank" />
        <div class="rank_text_over_image">
          <p>{{ team_ranks[4][1] }}</p>
        </div>
      </div>
    </div>

    <div class="rank_difference">
      <p v-if="avg_team_rank_diff > 0">{{ "+" + avg_team_rank_diff + " lp" }}</p>
      <p v-if="avg_team_rank_diff < 0">{{ avg_team_rank_diff + " lp" }}</p>
    </div>

    <div class="rank_enemy_team">
      <div class="rank_image_wrapper">
        <input type="image" class="rank_image" :src="`/assets/tiers/${convert_rank_to_image(team_ranks[3])}.png`"
               alt="rank" />
        <div class="rank_text_over_image">
          <p>{{ team_ranks[5][1] }}</p>
        </div>
      </div>
    </div>

    <p>{{match['match_info']['queue']}}</p>

  </div>
</template>

<style scoped>
.match_container {
  display: flex;
  flex-flow: row nowrap;

  gap: 5px;

  height: 50px;
  /*overflow: hidden;*/

  border-radius: 11px;
  font-size: 1.2em;

  box-shadow: inset 1px 1px 1px #5a7b9b;
  filter: drop-shadow(2px 2px 2px black);
  /*outline: 1px solid red;*/
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

.rank_difference {
  display: flex;
  flex-flow: column nowrap;
  /*outline: 1px solid red;*/
  line-height: 50px;
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
  outline: 1px solid red;
}

.win {
  background: linear-gradient(-90deg, rgb(44, 80, 58) 40%, rgba(17, 26, 34, 1) 80%);
}

.lose {
  background: linear-gradient(-90deg, rgb(80, 44, 70) 40%, rgba(17, 26, 34, 1) 80%);
}
</style>