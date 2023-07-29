<script setup>
import { ref, inject, onMounted } from "vue";
import RankChart from "@/components/charts/RankChart.vue";
import RankHistChart from "@/components/charts/RankHistChart.vue";
import WinrateChart from "@/components/charts/WinrateChart.vue";
// import ChampionSelector from "@/components/champion/ChampionSelector.vue";


// Todo add visible daily change to bar graph
let playerData = inject("playerData");


</script>

<template>
  <div v-if="playerData!==undefined">

    <h1 style="padding-left: 20px">Solo Queue</h1>
    <div class="divider"></div>
    <div class="chart_wrapper">
      <div>
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
      <div>
        <RankHistChart f_chartName="ranked_solo_hist_chart"
                       :f_chartOptions="{
                'queue':'RANKED_SOLO_5x5',
                }">
        </RankHistChart>
      </div>
    </div>


    <h1 style="padding-left: 20px">Flex Queue</h1>
    <div class="divider"></div>
    <div class="chart_wrapper">
      <div>
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
      <div>
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

.chart_wrapper {
  /*outline: 1px solid red;*/
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  height: 700px;
}

.divider {
  height: 1px;
  background-color: white;
  margin-bottom: 20px;
}


</style>
