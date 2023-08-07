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

    <div
      style=";font-family: 'Farmhouse',sans-serif;width:70px;height:70px;position: absolute;margin-bottom: 20px;
      transform: rotate(-6deg)translate(-110px);background-color: rgb(255,213,0);padding: 10px;border-radius: 50%;display: flex;
      align-items: center;justify-content: center;box-shadow: 0 0 40px #887400">
      <p
        style="font-size:2em;font-weight: bold;line-height: 25px;color: red;margin: auto;
        text-shadow: rgb(255, 255, 255) 2px 0px 0px, rgb(255, 255, 255) 1.75517px 0.958851px 0px, rgb(255, 255, 255) 1.0806px 1.68294px 0px, rgb(255, 255, 255) 0.141474px 1.99499px 0px, rgb(255, 255, 255) -0.832294px 1.81859px 0px, rgb(255, 255, 255) -1.60229px 1.19694px 0px, rgb(255, 255, 255) -1.97999px 0.28224px 0px, rgb(255, 255, 255) -1.87291px -0.701566px 0px, rgb(255, 255, 255) -1.30729px -1.51361px 0px, rgb(255, 255, 255) -0.421592px -1.95506px 0px, rgb(255, 255, 255) 0.567324px -1.91785px 0px, rgb(255, 255, 255) 1.41734px -1.41108px 0px, rgb(255, 255, 255) 1.92034px -0.558831px 0px;"
      >Now reactive!</p>
    </div>

<!--    todo fix tooltips overflow page-->

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
      <div class="lines_wrapper" style="position: relative">
        <RankHistChart f_chartName="ranked_solo_hist_chart"
                       :f_chartOptions="{
                'queue':'RANKED_SOLO_5x5',
                }">
        </RankHistChart>

        <div
          style=";font-family: 'Manita',sans-serif;position: absolute;right: -150px;bottom: -10px;
      transform: rotate(6deg)">
          <p
            style="font-size:1.5em;font-weight: normal;line-height: 25px;color: white;margin: auto;"
          >Hide players here</p>
          <img src="/extras/Arrow_white.png" alt="arrow" style="width: 30px;transform: scaleX(-1)">
        </div>
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
  /*outline: 1px solid red;*/

  /*min-height: fit-content;*/
  /*height: 700px;*/
  width: 100%;
  display: flex;
  flex-flow: row wrap;
}

.bars_wrapper {
  /*outline: 2px solid green;*/
  width: 50%;
  min-width: 300px;

  height: 100%;
  min-height: 700px;

  display: block;
  /*overflow: hidden;*/
}

.lines_wrapper {
  /*outline: 2px solid purple;*/
  width: 50%;
  min-width: 300px;

  height: 100%;
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
