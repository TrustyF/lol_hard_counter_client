<script setup>
import { ref, inject, onMounted } from "vue";
import BarChart from "@/components/charts/BarChart.vue";
import RankHistChart from "@/components/charts/RankHistChart.vue";
// import ChampionSelector from "@/components/champion/ChampionSelector.vue";

const curr_api = inject("curr_api");

// Todo add visible daily change to bar graph

let player_data = ref(undefined);
let player_usernames = undefined;
let player_backup = undefined;

let selected_players = [];

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
        player_backup = data;
        player_usernames = data.map(x => x["username"]);
        retryLeft = 0;
      })

      // Handle any errors that occurred during the fetch
      .catch(error => {
        console.error("Error:", error);
      });
    retryLeft -= 1;
  }

}

function filter_player(input) {
  let select_player = input.target.innerText;
  input.target.style["background-color"] = "#587898";

  if (selected_players.includes(select_player)) {
    input.target.style["background-color"] = "#2c3e50";
    selected_players = selected_players.filter(item => item !== select_player);
  } else {
    selected_players.push(select_player);
    console.log(selected_players);
  }

  if (selected_players.length < 1) {
    player_data.value = player_backup;
  } else {
    player_data.value = player_backup.filter(x => selected_players.includes(x["username"]));
  }


}

onMounted(() => {
  get_players();
});
</script>

<template>
  <body>
  <div v-if="player_data!==undefined">

    <div class="players_buttons">
      <div v-for="player in player_usernames" :key="player">
        <button class="player_button" @click="filter_player">{{ player }}</button>
      </div>
<!--      <button class="player_button" @click="reset_players">X</button>-->
    </div>

    <h1 style="padding-left: 20px">Solo Queue</h1>
    <div class="divider"></div>
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
    <div class="divider"></div>
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
  width: 75vw;
  padding-top: 30px;
  /*outline: 1px solid palegreen;*/
}

.chart_wrapper {
  /*outline: 1px solid red;*/
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  min-height: 500px;

  margin: 15px 10px 50px 10px;
}

.divider {
  height: 1px;
  background-color: white;
}

.players_buttons {
  display: flex;
  flex-flow: row wrap;
  gap: 15px;
  /*outline: 1px solid red;*/
  width: 100%;
  /*justify-content: space-evenly;*/
  margin: 10px 0 30px 0;
}

.player_button {
  background-color: #2c3e50;
  color: white;
  cursor: pointer;
  border: none;
  /*border-color: #517194;*/
  padding: 15px;
  border-radius: 10px;
  transition: 0.1s;
}

.player_button:hover {
  background-color: #587898;
}
</style>
