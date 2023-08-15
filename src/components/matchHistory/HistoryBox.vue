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

let win = computed(() => props["match"]["match_info"]["match_win"]);
let kda = computed(() => {
  let info = props["match"]["player_stats"];
  return [info["kills"], info["deaths"], info["assists"]];
});
let rank_diff = computed(() => {
  let side = props["match"]["match_info"]["player_side"];
  let other_side = side === "red" ? "blue" : "red";
  let ranks = props["match"]["match_ranks"];

  let my_side_rank = ranks[side].map(value => value["rank"]).reduce((a, b) => a + b, 0);
  let other_side_rank = ranks[other_side].map(value => value["rank"]).reduce((a, b) => a + b, 0);

  let avg_my_side_rank = Math.round(my_side_rank / 5);
  let avg_other_side_rank = Math.round(other_side_rank / 5);


  return [my_side_rank, other_side_rank, avg_my_side_rank, avg_other_side_rank, calc_rank_text(avg_my_side_rank), calc_rank_text(avg_other_side_rank)];
});

</script>

<template>
  <div :class="win ? 'match_container lose' : 'match_container win'">
    <img class="player_icon" :src="`${curr_api}/player/profile_icon?player=${player.username}`"
         alt="icon" />
    <p>{{ kda[0] + "/" + kda[1] + "/" + kda[2] }}</p>
    <p>{{ rank_diff[4] + " - " + rank_diff[5] }}</p>

  </div>
</template>

<style scoped>
.match_container {
  display: flex;
  flex-flow: row nowrap;

  gap: 5px;

  height: 50px;
  overflow: hidden;

  border-radius: 11px;
  font-size: 0.8em;

  box-shadow: inset 1px 1px 1px #5a7b9b;
  filter: drop-shadow(2px 2px 2px black);
}

.player_icon {
  position: relative;
  height: 50px;
  width: 50px;
  border-radius: 9px;
  margin: auto 0 auto 0;
  /*filter: drop-shadow(2px 0 1px #08121a);*/
  background: #000;
}

.win {
  background: linear-gradient(-90deg, rgb(44, 80, 58) 40%, rgba(17, 26, 34, 1) 80%);
}

.lose {
  background: linear-gradient(-90deg, rgb(80, 44, 70) 40%, rgba(17, 26, 34, 1) 80%);
}
</style>