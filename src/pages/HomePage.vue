<script setup>
import { ref, inject, toRaw, onMounted } from "vue";
// import ChampionSelector from "@/components/champion/ChampionSelector.vue";

const curr_api = inject("curr_api");

const rank_mappings = {
  "tier_values": ["iron", "bronze", "silver", "gold", "platinum", "emerald",
    "diamond", "master", "grandmaster", "challenger"],
  "division_values": ["IV", "III", "II", "I"]
};

// Todo add visible daily change to bar graph, Fix daily graph dates issue (start date doesnt match)

let player_data = ref(undefined);
let graph_width = "100%";

let baseChartOptions = {
  chart: {
    id: "ranked_solo_chart",
    animations: {
      enabled: false
    },
    events: {}
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
    labels: {
      colors: "#ababab",
      useSeriesColors: true
    }
  },
  fill: {
    opacity: 1
  },
  yaxis: {
    labels: {
      rotate: 0,
      style: {
        colors: "#ababab",
        fontWeight: 1000

      }
    }
  },
  xaxis: {
    categories: [],
    labels: {
      style: {
        colors: "#ababab"
      }
    }
  },
  series: [
    {
      name: "",
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
    borderColor: "#282828",
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
    offsetX: 30,
    textAnchor: "start",
    style: {
      fontSize: "12px",
      backgroundColor: "black"
    }
  },
  noData: {
    text: "Loading..."
  }
};

let soloChartOptions = ref(JSON.parse(JSON.stringify(baseChartOptions)));
soloChartOptions.value["dataLabels"]["formatter"] = (val) => {
  if (val <= 0) {
    return undefined;
  }
  const num = String(val);
  const tier = Number(num.slice(-4, -3));
  const div = Number(num.slice(-3, -2));
  return [`${rank_mappings["tier_values"][tier].charAt(0).toUpperCase() + rank_mappings["tier_values"][tier].slice(1)} ${rank_mappings["division_values"][div]}`];
};
soloChartOptions.value["xaxis"]["labels"]["formatter"] = (val) => {
  const num = String(val);
  const tier = Number(num.slice(-4, -3));
  return `${rank_mappings["tier_values"][tier]}`;
};

let flexChartOptions = ref(JSON.parse(JSON.stringify(baseChartOptions)));
flexChartOptions.value["chart"]["id"] = "ranked_flex_chart";
flexChartOptions.value["colors"] = ["#0dab00"];
flexChartOptions.value["dataLabels"]["formatter"] = (val) => {
  if (val <= 0) {
    return undefined;
  }
  const num = String(val);
  const tier = Number(num.slice(-4, -3));
  const div = Number(num.slice(-3, -2));
  return [`${rank_mappings["tier_values"][tier].charAt(0).toUpperCase() + rank_mappings["tier_values"][tier].slice(1)} ${rank_mappings["division_values"][div]}`];
};
flexChartOptions.value["xaxis"]["labels"]["formatter"] = (val) => {
  const num = String(val);
  const tier = Number(num.slice(-4, -3));
  return `${rank_mappings["tier_values"][tier]}`;
};

let soloHistChartOptions = ref(JSON.parse(JSON.stringify(baseChartOptions)));
soloHistChartOptions.value["chart"]["id"] = "ranked_solo_hist_chart";
soloHistChartOptions.value["colors"] = [
  "#6de34d", "#ea67d2", "#bbe948", "#a383f2", "#e3d33e", "#f46a54", "#5ade8c",
  "#e09531", "#66ba47", "#aabd46"
];
// soloHistChartOptions.value["dataLabels"]["enabled"] = false;
soloHistChartOptions.value["dataLabels"]["formatter"] = (val) => {
  if (val <= 0) {
    return undefined;
  }
  const num = String(val);
  // const tier = Number(num.slice(-4, -3));
  const div = Number(num.slice(-3, -2));
  const lp = Number(num.slice(-2));
  return [`Tier ${rank_mappings["division_values"][div]} ${lp} lp`];
};
soloHistChartOptions.value["dataLabels"]["textAnchor"] = "middle";
soloHistChartOptions.value["dataLabels"]["offsetY"] = -10;
soloHistChartOptions.value["dataLabels"]["offsetX"] = 0;
soloHistChartOptions.value["yaxis"]["labels"]["formatter"] = (val) => {

  if (val <= 0) {
    return undefined;
  }

  const num = String(val);
  const tier = Number(num.slice(-4, -3));
  return `${rank_mappings["tier_values"][tier]}`;
};
soloHistChartOptions.value["xaxis"]["type"] = "datetime";
soloHistChartOptions.value["markers"] = { "size": 2 };
soloHistChartOptions.value["stroke"] = { "width": 2 };
soloHistChartOptions.value["grid"]["yaxis"]["lines"]["show"] = true;
soloHistChartOptions.value["grid"]["xaxis"]["lines"]["show"] = false;
soloHistChartOptions.value["grid"]["padding"] = { right: 50, left: 50 };


let flexHistChartOptions = ref(JSON.parse(JSON.stringify(baseChartOptions)));
flexHistChartOptions.value["chart"]["id"] = "ranked_flex_hist_chart";
flexHistChartOptions.value["colors"] = [
  "#6de34d", "#ea67d2", "#bbe948", "#a383f2", "#e3d33e", "#f46a54", "#5ade8c",
  "#e09531", "#66ba47", "#aabd46"
];
// flexHistChartOptions.value["dataLabels"]["enabled"] = false;
flexHistChartOptions.value["dataLabels"]["formatter"] = (val) => {
  if (val <= 0) {
    return undefined;
  }
  const num = String(val);
  // const tier = Number(num.slice(-4, -3));
  const div = Number(num.slice(-3, -2));
  const lp = Number(num.slice(-2));
  return [`Tier ${rank_mappings["division_values"][div]} ${lp} lp`];
};
flexHistChartOptions.value["dataLabels"]["textAnchor"] = "middle";
flexHistChartOptions.value["dataLabels"]["offsetY"] = -10;
flexHistChartOptions.value["dataLabels"]["offsetX"] = 0;
flexHistChartOptions.value["yaxis"]["labels"]["formatter"] = (val) => {

  if (val <= 0) {
    return undefined;
  }

  const num = String(val);
  const tier = Number(num.slice(-4, -3));
  return `${rank_mappings["tier_values"][tier]}`;
};
flexHistChartOptions.value["xaxis"]["type"] = "datetime";
flexHistChartOptions.value["markers"] = { "size": 2 };
flexHistChartOptions.value["stroke"] = { "width": 2 };
flexHistChartOptions.value["grid"]["yaxis"]["lines"]["show"] = true;
flexHistChartOptions.value["grid"]["xaxis"]["lines"]["show"] = false;
flexHistChartOptions.value["grid"]["padding"] = { right: 50, left: 50 };

soloChartOptions.value["chart"]["events"] = {
  "dataPointMouseEnter": (f_event, f_context, f_config) => {
    console.log("test");
  }
};

// console.log(flexChartOptions.value);

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
        updateChart(data);
        retryLeft = 0;
      })

      // Handle any errors that occurred during the fetch
      .catch(error => {
        console.error("Error:", error);
      });
    retryLeft -= 1;
  }

}

// async function get_date_range() {
//   const url = new URL(`${curr_api}/player/get_date_range`);
//   // url.searchParams.set("none", "none");
//   let retryLeft = 3;
//
//   while (retryLeft > 0) {
//     await fetch(url)
//
//       // Handle http error
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//       })
//
//       // Process the returned JSON data
//       .then(data => {
//         console.log("fetch date", data);
//         date_range.value = data;
//         updateDateCategory(data);
//
//         retryLeft = 0;
//       })
//
//       // Handle any errors that occurred during the fetch
//       .catch(error => {
//         console.error("Error:", error);
//       });
//
//     retryLeft -= 1;
//   }
// }

function updateChart(f_data) {
  let sortedSolo = f_data.slice();
  let histSolo = f_data.slice();
  let sortedFlex = f_data.slice();
  let histFlex = f_data.slice();

  // sorted solo
  sortedSolo.sort((a, b) => b["rank"]["RANKED_SOLO_5x5"]["rank"] - a["rank"]["RANKED_SOLO_5x5"]["rank"]);
  soloChartOptions.value.series[0].data = (sortedSolo.map(val => val["rank"]["RANKED_SOLO_5x5"]["rank"])).filter(e => e != null);
  soloChartOptions.value.xaxis.categories = (sortedSolo.map(val => val["username"])).filter(e => e != null);

  // sorted flex
  sortedFlex.sort((a, b) => b["rank"]["RANKED_FLEX_SR"]["rank"] - a["rank"]["RANKED_FLEX_SR"]["rank"]);
  flexChartOptions.value.series[0].data = (sortedFlex.map(val => val["rank"]["RANKED_FLEX_SR"]["rank"])).filter(e => e != null);
  flexChartOptions.value.xaxis.categories = (sortedFlex.map(val => val["username"])).filter(e => e != null);

  soloHistChartOptions.value.series = (histSolo.map(val => {
    if (Object.keys(val["rank_history"]["RANKED_SOLO_5x5"]).length < 1) {
      return;
    }
    let out = { "data": [], "name": "" };
    for (let date in val["rank_history"]["RANKED_SOLO_5x5"]) {
      let [d, M, y] = date.split(/[/ ]/);
      out["data"].push([new Date(y, parseInt(M) - 1, d), val["rank_history"]["RANKED_SOLO_5x5"][date]]);
      out["name"] = val["username"];
    }
    out["data"].sort((a, b) => {
      return b[0] - a[0];
    });
    return out;

  })).filter(e => e != null);
  console.log("solo hist", soloHistChartOptions.value.series);

  flexHistChartOptions.value.series = histFlex.map(val => {
    if (Object.keys(val["rank_history"]["RANKED_FLEX_SR"]).length < 1) {
      return;
    }
    let out = { "data": [], "name": "" };
    for (let date in val["rank_history"]["RANKED_FLEX_SR"]) {
      let [d, M, y] = date.split(/[/ ]/);
      out["data"].push([new Date(y, parseInt(M) - 1, d), val["rank_history"]["RANKED_FLEX_SR"][date]]);
      out["name"] = val["username"];
    }
    out["data"].sort((a, b) => {
      return b[0] - a[0];
    });
    return out;
  }).filter(e => e != null);
  console.log("flex hist", flexHistChartOptions.value.series);

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
        <apexchart
          type="bar"
          :height=graph_width
          :options="soloChartOptions"
          :series="soloChartOptions.series"
        ></apexchart>
      </div>
      <div>
        <apexchart
          type="line"
          :height=graph_width
          :options="soloHistChartOptions"
          :series="soloHistChartOptions.series"
        ></apexchart>
      </div>
    </div>

    <h1 style="padding-left: 20px">Flex Queue</h1>
    <div class="chart_wrapper">
      <div>
        <apexchart
          type="bar"
          :height=graph_width
          :options="flexChartOptions"
          :series="flexChartOptions.series"
        ></apexchart>
      </div>
      <div>
        <apexchart
          type="line"
          :height=graph_width
          :options="flexHistChartOptions"
          :series="flexHistChartOptions.series"
        ></apexchart>
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
