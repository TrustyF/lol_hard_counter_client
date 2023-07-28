<script setup>
import { ref, inject, onMounted } from "vue";
import BarChart from "@/components/charts/BarChart.vue";
import RankHistChart from "@/components/charts/RankHistChart.vue";
// import ChampionSelector from "@/components/champion/ChampionSelector.vue";

const curr_api = inject("curr_api");

// Todo add visible daily change to bar graph, Fix daily graph dates issue (start date doesnt match)

let player_data = ref(undefined);

async function get_players() {
  const url = new URL(`${curr_api}/player/get_all`);
  // url.searchParams.set('none','none')
  let retryLeft = 3;

  while (retryLeft > 0) {
    await fetch(url)

      // Handle http error
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })

      // Process the returned JSON data
      .then(data => {
        // if (devMode) console.log(data);
        player_data.value = data;
        retryLeft = 0;
      })

      // Handle any errors that occurred during the fetch
      .catch(error => {
        console.error("Error:", error);
      });
    retryLeft -= 1;
  }

}


onMounted(() => {
  get_players();
});
</script>

<template>
  <body>
  <div v-if="player_data!==undefined">

    <h1 style="padding-left: 20px">Solo Queue</h1>
    <div class="chart_wrapper">
      <div>
        <BarChart f_chartName="ranked_solo_chart"
                  :f_chartData="player_data"
                  :f_chartOptions="{
        'queue':'RANKED_SOLO_5x5',
        'color':'#0056ab'
        }">
        </BarChart>
      </div>
      <div>
        <RankHistChart f_chartName="ranked_solo_hist_chart"
                       :f_chartData="player_data"
                       :f_chartOptions="{
        'queue':'RANKED_SOLO_5x5',
        }">
        </RankHistChart>
      </div>
    </div>

    <h1 style="padding-left: 20px">Flex Queue</h1>
    <div class="chart_wrapper">
      <div>
        <BarChart f_chartName="ranked_flex_chart"
                  :f_chartData="player_data"
                  :f_chartOptions="{
                    'queue':'RANKED_FLEX_SR',
                    'color':'#0dab00'
                  }">
        </BarChart>
      </div>
      <div>
        <RankHistChart f_chartName="ranked_flex_hist_chart"
                       :f_chartData="player_data"
                       :f_chartOptions="{
        'queue':'RANKED_FLEX_SR',
        }">
        </RankHistChart>
      </div>
    </div>

  </div>
  </body>

</template>
<style scoped>
body {
  margin: auto;
  width: 95vw;
  padding-top: 30px;
  /*outline: 1px solid palegreen;*/
}

.chart_wrapper {
  /*outline: 1px solid red;*/
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  min-height: 500px;

  margin: 15px 10px 15px 10px;
}
</style>
