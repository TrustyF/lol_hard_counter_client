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
let date_range = ref(undefined);
let graph_width = 900;
let soloChartOptions = ref({
  chart: {
    id: "ranked_solo_chart",
    animations: {
      enabled: true
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
  yaxis: {
    labels: {
      rotate: 0,
      // formatter: (val) => {
      //   let text_arr = val.split(" ");
      //   if (text_arr.length < 2) {
      //     text_arr = text_arr[0].split(/(.{10})/).filter(O => O);
      //   }
      //   return text_arr;
      // },
      style: {
        colors: "#ababab",
        // fontSize: '10px',
        fontWeight: 1000

      }
    }
  },
  xaxis: {
    type: "category",
    categories: [],
    labels: {
      formatter: (val) => {
        const num = String(val);
        const tier = Number(num.slice(-4, -3));
        return `${rank_mappings["tier_values"][tier]}`;
      },
      style: {
        colors: "#ababab"
      }
    }
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
        show: false
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

      const num = String(val);
      const lp = Number(num.slice(-2));
      return [`${lp} LP`];
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
      id: "ranked_flex_chart"
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

let soloHistChartOptions = ref({
  ...soloChartOptions.value
  , ...{
    chart: {
      id: "ranked_solo_hist_chart"
    },
    colors: ["#6de34d",
      "#ea67d2",
      "#bbe948",
      "#a383f2",
      "#e3d33e",
      "#f46a54",
      "#5ade8c",
      "#e09531",
      "#66ba47",
      "#aabd46"],
    series: [
      {
        name: "",
        data: []
      }
    ],
    xaxis: {
      type: "category",
      categories: [],
      labels: {
        style: {
          colors: "#ababab"
        }
      }
    },
    yaxis: {
      labels: {
        rotate: 0,
        formatter: (val) => {

          if (val <= 0) {
            return undefined;
          }

          const num = String(val);
          const tier = Number(num.slice(-4, -3));
          return `${rank_mappings["tier_values"][tier]}`;
        },
        style: {
          colors: "#ababab",
          // fontSize: '10px',
          fontWeight: 1000

        }
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      labels: {
        colors: "#ababab"
      },
      onItemHover: {
        highlightDataSeries: true
      },
      onItemClick: {
        toggleDataSeries: true
      }
    }
  }
});

let flexHistChartOptions = ref({
  ...soloHistChartOptions.value
  , ...{
    chart: {
      id: "ranked_flex_chart"
    },
    series: [
      {
        name: "",
        data: []
      }
    ]
  }
});

// console.log(flexChartOptions.value);

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

function get_date_range() {
  const url = new URL(`${curr_api}/player/get_date_range`);
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
      // console.log("fetch date", data);
      date_range.value = data;
      updateDateCategory(data);
    })

    // Handle any errors that occurred during the fetch
    .catch(error => {
      console.error("Error:", error);
    });

}

function updateChart(f_data) {
  let sortedSolo = f_data.slice();
  let histSolo = f_data.slice();
  let sortedFlex = f_data.slice();
  let histFlex = f_data.slice();


  sortedSolo.sort((a, b) => b["rank"]["RANKED_SOLO_5x5"]["rank"] - a["rank"]["RANKED_SOLO_5x5"]["rank"]);
  soloChartOptions.value.series[0].data = sortedSolo.map(x => x["rank"]["RANKED_SOLO_5x5"]["rank"]);
  soloChartOptions.value.xaxis.categories = sortedSolo.map(x => x["username"]);

  sortedFlex.sort((a, b) => b["rank"]["RANKED_FLEX_SR"]["rank"] - a["rank"]["RANKED_FLEX_SR"]["rank"]);
  flexChartOptions.value.series[0].data = sortedFlex.map(x => x["rank"]["RANKED_FLEX_SR"]["rank"]);
  flexChartOptions.value.xaxis.categories = sortedFlex.map(x => x["username"]);


  let formatted_solo_hist = (histSolo.map(val => {
    if (Object.keys(val["rank_history"]["RANKED_SOLO_5x5"]).length < 1) {
      return;
    }

    let out = { "data": [], "name": "" };
    for (let date in val["rank_history"]["RANKED_SOLO_5x5"]) {
      out["data"].push({
        "x": date,
        "y": val["rank_history"]["RANKED_SOLO_5x5"][date]
      });
      out["name"] = val["username"];
    }
    return out;
  }));
  formatted_solo_hist = formatted_solo_hist.filter(e => e != null);
  soloHistChartOptions.value.series = formatted_solo_hist;

  let formatted_flex_hist = (histFlex.map(val => {
    if (Object.keys(val["rank_history"]["RANKED_FLEX_SR"]).length < 1) {
      return;
    }

    let out = { "data": [], "name": "" };
    for (let date in val["rank_history"]["RANKED_FLEX_SR"]) {
      out["data"].push({
        "x": date,
        "y": val["rank_history"]["RANKED_FLEX_SR"][date]
      });
      out["name"] = val["username"];
    }
    return out;
  }));
  formatted_flex_hist = formatted_flex_hist.filter(e => e != null);
  flexHistChartOptions.value.series = formatted_flex_hist;

}


function updateDateCategory(f_data) {
  soloHistChartOptions.value.xaxis.categories = f_data;
  flexHistChartOptions.value.xaxis.categories = f_data;
}

onMounted(() => {
  get_players();
  get_date_range();
  // console.log(curr_api);
});
</script>

<template>
  <body>
  <div class="chart_wrapper" v-if="player_data!==undefined && date_range!==undefined">
    <div>
      <apexchart
        type="bar"
        :width=graph_width
        :options="soloChartOptions"
        :series="soloChartOptions.series"
      ></apexchart>
    </div>
    <div>
      <apexchart
        type="line"
        :width=graph_width
        :options="soloHistChartOptions"
        :series="soloHistChartOptions.series"
      ></apexchart>
    </div>

    <div>
      <apexchart
        type="bar"
        :width=graph_width
        :options="flexChartOptions"
        :series="flexChartOptions.series"
      ></apexchart>
    </div>
    <div>
      <apexchart
        type="line"
        :width=graph_width
        :options="flexHistChartOptions"
        :series="flexHistChartOptions.series"
      ></apexchart>
    </div>
  </div>
  </body>

</template>
<style scoped>
body {
  margin: auto;
  width: 95vw;
  /*outline: 1px solid palegreen;*/
}

.chart_wrapper {
  /*outline: 1px solid red;*/
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;

  margin: 15px 10px 15px 10px;
}
</style>
