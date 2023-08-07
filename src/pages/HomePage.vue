<script setup>
import { ref, inject, onMounted } from "vue";
import RankChart from "@/components/charts/RankChart.vue";
import RankHistChart from "@/components/charts/RankHistChart.vue";
import WinrateChart from "@/components/charts/WinrateChart.vue";
// import ChampionSelector from "@/components/champion/ChampionSelector.vue";


let playerData = inject("playerData");


</script>

<template>
  <div v-if="playerData!==undefined">

    <h1 class="title">Solo Queue</h1>
    <div class="divider"></div>
    <div class="chart_wrapper">
      <div class="bars_wrapper">
        <RankChart f_chartName="ranked_solo_chart"
                   :f_chartOptions="{
        'queue':'RANKED_SOLO_5x5',
        'color':'#0056ab'
        }">
        </RankChart>
        <WinrateChart f_chart-name="winrate_solo_chart"
                      :f_chart-options="{
        'queue':'RANKED_SOLO_5x5',
        'color':'#06ab00'
        }">
        </WinrateChart>
      </div>
      <div class="lines_wrapper">
        <RankHistChart f_chartName="ranked_solo_hist_chart"
                       :f_chartOptions="{
                'queue':'RANKED_SOLO_5x5',
                }">
        </RankHistChart>
      </div>
    </div>

    <h1 class="title">Flex Queue</h1>
    <div class="divider"></div>
    <div class="chart_wrapper">
      <div class="bars_wrapper">
        <RankChart f_chartName="ranked_flex_chart"
                   :f_chartOptions="{
                'queue':'RANKED_FLEX_SR',
                'color':'#7b00ab'
                }">
        </RankChart>
        <WinrateChart f_chart-name="winrate_flex_chart"
                      :f_chart-options="{
          'queue':'RANKED_FLEX_SR',
          'color':'#ab0028'
          }">
        </WinrateChart>
      </div>
      <div class="lines_wrapper">
        <RankHistChart f_chartName="ranked_flex_hist_chart"
                       :f_chartOptions="{
                    'queue':'RANKED_FLEX_SR',
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
  outline: 1px solid red;

  /*min-height: 700px;*/
  width: 100%;
  display: flex;
  flex-flow: row wrap;
}

.bars_wrapper {
  /*outline: 2px solid green;*/
  width: 50%;
  min-width: 300px;

  height: 100%;
  min-height: 500px;

  display: block;
  /*overflow: hidden;*/
}

.lines_wrapper {
  /*outline: 2px solid purple;*/
  width: 50%;
  min-width: 300px;

  height: 100%;
  min-height: 500px;

  display: block;
  /*overflow: hidden;*/
}

.divider {
  height: 1px;
  background-color: white;
  margin-bottom: 20px;
}


</style>
