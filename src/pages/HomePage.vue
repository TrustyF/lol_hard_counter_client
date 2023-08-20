<script setup>
import { computed, inject } from "vue";
import RankHistChart from "@/components/charts/RankHistChart.vue";
import PlayerList from "@/components/players/PlayerList.vue";
import ChangeLog from "@/components/changelog/ChangeLog.vue";

let playerData = inject("playerData");
// let colors = ['#008ffb','#00e396','#feb019','#775dd0','#ff4560','#1dd73c','#ff206e','#5adbff','#eea243','#9046cf']
let colors = ["#008ffb", "#2aedff", "#00e396", "#67C933", "#FFC400", "#FF5319", "#9C40FF", "#FF2546", "#df389c"];

let mostSoloRank = computed(() => {
  let raw = playerData.value.map(value => [
    value["username"],
    value["ranked"]["RANKED_SOLO_5x5"]["rank"],
    value["ranked"]["RANKED_SOLO_5x5"]["nearest_rank"][1],
    value["ranked"]["RANKED_SOLO_5x5"]["rank"] - value["ranked"]["RANKED_SOLO_5x5"]["nearest_rank"][1]
  ]);
  let sorted_rank = raw.sort((a, b) => b[1] - a[1]);

  let out_mapped = [{
    "heading": "Rank",
    "value": sorted_rank,
    "value_format": "rank"
    // "images": ["/assets/stat_icons/Keyword_Quick_Attack.svg"]
  }];
  console.log("out_mapped", out_mapped);
  return out_mapped;
});
let mostSoloWinRate = computed(() => {
  let raw = playerData.value.map(value => [
    value["username"],
    (value["ranked"]["RANKED_SOLO_5x5"]["winrate"][0] / (value["ranked"]["RANKED_SOLO_5x5"]["winrate"][0] + value["ranked"]["RANKED_SOLO_5x5"]["winrate"][1])) * 100,
    0,
    0
  ]);
  let sorted_wr = raw.sort((a, b) => b[1] - a[1]);

  let out_mapped = [{
    "heading": "Winrate",
    "value": sorted_wr.filter(value => value[1]),
    "value_format": "percentage"
    // "images": ["/assets/stat_icons/Keyword_Quick_Attack.svg"]
  }];
  console.log("out_mapped", out_mapped);
  return out_mapped;
});
let mostFlexRank = computed(() => {
  let raw = playerData.value.map(value => [
    value["username"],
    value["ranked"]["RANKED_FLEX_SR"]["rank"],
    value["ranked"]["RANKED_FLEX_SR"]["nearest_rank"][1],
    value["ranked"]["RANKED_FLEX_SR"]["rank"] - value["ranked"]["RANKED_FLEX_SR"]["nearest_rank"][1]
  ]);
  let sorted_rank = raw.sort((a, b) => b[1] - a[1]);

  let out_mapped = [{
    "heading": "Rank",
    "value": sorted_rank,
    "value_format": "rank"
    // "images": ["/assets/stat_icons/Keyword_Quick_Attack.svg"]
  }];
  console.log("out_mapped", out_mapped);
  return out_mapped;
});

</script>

<template>
<!--  <ChangeLog-->
<!--    title="WOS Changelog"-->
<!--    image="pepedance.webp"-->
<!--    :changes="[-->
<!--      'Removed player selector, select your account from the list',-->
<!--      'Winrate moved to funny stats',-->
<!--      'Removed rank graph'-->
<!--            ]"-->
<!--    :close="true"-->
<!--  ></ChangeLog>-->

  <div v-if="playerData!==undefined">

    <!--    todo lp gain slope-->


    <h1 class="title">Solo Queue</h1>
    <div class="divider"></div>
    <div class="chart_wrapper">
      <div class="bars_wrapper">
        <PlayerList class="player_list"
                    :stats="mostSoloRank"
                    :tier_enabled="true"
                    height="auto"
        ></PlayerList>
        <RankHistChart f_chartName="ranked_solo_hist_chart" style="flex: 1;min-width: 400px"
                       :f_chartOptions="{
                        'queue':'RANKED_SOLO_5x5',
                        'color': colors
                }">
        </RankHistChart>

      </div>
    </div>

    <h1 class="title">Flex Queue</h1>
    <div class="divider"></div>
    <div class="chart_wrapper">
      <div class="bars_wrapper">
        <PlayerList class="player_list"
                    :stats="mostFlexRank"
                    :tier_enabled="true"
                    height="auto"
        ></PlayerList>
        <RankHistChart f_chartName="ranked_solo_hist_chart" style="flex: 1;min-width: 400px"
                       :f_chartOptions="{
                        'queue':'RANKED_FLEX_SR',
                        'color': colors
                }">
        </RankHistChart>

      </div>
    </div>

  </div>

</template>

<style scoped>

.title {
  padding-left: 20px;
}

.chart_wrapper {
  /*outline: 1px solid red;*/

  /*min-height: fit-content;*/
  /*height: auto;*/
  width: 100%;
  display: flex;
  flex-flow: row wrap;
}

.bars_wrapper {
  /*outline: 2px solid green;*/

  display: flex;
  flex-flow: row wrap;
  gap: 10px;

  height: 100%;
  width: 100%;

  margin-bottom: 30px;
}

.player_list {
  /*outline: 1px solid red;*/
  width: fit-content;
  margin: 0;
}

.lines_wrapper {
  /*outline: 2px solid purple;*/
  width: 100%;
  min-width: 300px;

  height: 50%;
  min-height: 700px;

  display: block;
  /*overflow: hidden;*/
}

.divider {
  height: 1px;
  background-color: white;
  margin-bottom: 20px;
}


</style>
