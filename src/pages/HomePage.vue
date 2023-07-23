<script setup>
import { ref, inject, onMounted } from "vue";
// import ChampionSelector from "@/components/champion/ChampionSelector.vue";

const curr_api = inject("curr_api");

const rank_mappings = {
  "tier_values": ["iron", "bronze", "silver", "gold", "platinum", "emerald",
    "diamond", "master", "grandmaster", "challenger"],
  "division_values": ["IV", "III", "II", "I"]
};

let player_data = ref(undefined);
let soloChartOptions = ref({
  chart: {
    id: "ranked_solo_chart",
    animations: {
      enabled: false
    }
  },
  tooltip: {
    theme: "dark",
    enabled: true,
    y: {
      formatter: (val) => {

        if (val <= 0) {
          return undefined;
        }

        const num = String(val);
        const lp = Number(num.slice(-2));
        const division = Number(num.slice(-3, -2));
        const tier = Number(num.slice(-4, -3));
        return [`${rank_mappings["tier_values"][tier]} ${rank_mappings["division_values"][division]} ${lp} LP`];
      }
    }
  },
  colors: ["#0052b2"],
  legend: {
    opacity: 1
  },
  fill: {
    opacity: 1
  },
  yaxis: {},
  xaxis: {
    type: "category",
    categories: []
  },
  series: [
    {
      name: "SoloQ",
      data: []
    }
  ],
  plotOptions: {
    bar: {
      horizontal: true,
      dataLabels: {
        position: "top"
      }
    }
  },
  grid: {
    borderColor: "#2a2a2d",
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  dataLabels: {
    enabled: true,
    offsetX: 40,
    // offsetY: -8,
    formatter: (val) => {

      if (val <= 0) {
        return undefined;
      }
      return val;
    },
    style: {
      fontSize: "12px",
      backgroundColor: "black"
    }
  },
  noData: {
    text: "Loading..."
  }

});

let flexChartOptions = ref({
  ...soloChartOptions.value
  , ...{
    chart: {
      id: "ranked_flex_chart",
      animations: {
        enabled: false
      }
    },
    colors: ["#0dab00"],
    series: [
      {
        name: "FlexQ",
        data: []
      }
    ]
  }
});

console.log(flexChartOptions.value);

function get_players() {
  const url = new URL(`${curr_api}/player/get_all`);
  // url.searchParams.set("none", "none");

  fetch(url)

    // Handle http error
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })

    // Process the returned JSON data
    .then(data => {
      console.log("fetch data", data);
      player_data.value = data;
      updateChart(data);
    })

    // Handle any errors that occurred during the fetch
    .catch(error => {
      console.error("Error:", error);
    });

}

function updateChart(f_data) {
  let sortedSolo = f_data.slice();
  let sortedFlex = f_data.slice();

  sortedSolo.sort((a, b) => b["rank"]["RANKED_SOLO_5x5"]["rank"] - a["rank"]["RANKED_SOLO_5x5"]["rank"]);
  sortedFlex.sort((a, b) => b["rank"]["RANKED_FLEX_SR"]["rank"] - a["rank"]["RANKED_FLEX_SR"]["rank"]);

  console.log("sorted", sortedSolo);
  soloChartOptions.value.series[0].data = sortedSolo.map(x => x["rank"]["RANKED_SOLO_5x5"]["rank"]);
  flexChartOptions.value.series[0].data = sortedFlex.map(x => x["rank"]["RANKED_FLEX_SR"]["rank"]);

  soloChartOptions.value.xaxis.categories = sortedSolo.map(x => x["username"]);
  flexChartOptions.value.xaxis.categories = sortedFlex.map(x => x["username"]);
}

onMounted(() => {
  get_players();
  console.log(curr_api);
});
</script>

<template>
  <body>
  <div class="chart_wrapper">
    <div v-if="player_data!==undefined">
      <apexchart
        type="bar"
        :width=800
        :options="soloChartOptions"
        :series="soloChartOptions.series"
      ></apexchart>
    </div>
    <div v-if="player_data!==undefined">
      <apexchart
        type="bar"
        :width=800
        :options="flexChartOptions"
        :series="flexChartOptions.series"
      ></apexchart>
    </div>
  </div>
  </body>

</template>
<style scoped>
body {
  margin: auto;
  width: 90%;
  /*outline: 1px solid palegreen;*/
}

.chart_wrapper {
  /*outline: 1px solid red;*/
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;

  margin: 50px;
}

.apexcharts-tooltip {
  background: red;
  color: green;
}


</style>
