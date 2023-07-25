<script setup>
import { ref, inject, onMounted, toRaw } from "vue";
// import ChampionSelector from "@/components/champion/ChampionSelector.vue";

const curr_api = inject("curr_api");

const rank_mappings = {
  "tier_values": ["iron", "bronze", "silver", "gold", "platinum", "emerald",
    "diamond", "master", "grandmaster", "challenger"],
  "division_values": ["IV", "III", "II", "I"]
};

// Todo add visible daily change to bar graph, Fix daily graph dates issue (start date doesnt match)

let player_data = ref(undefined);
let date_range = ref(undefined);
let graph_width = "100%";

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
  chart: {
    id: "ranked_flex_chart",
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
  colors: ["#0dab00"],
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

let soloHistChartOptions = ref({
  chart: {
    id: "ranked_solo_hist_chart",
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
  fill: {
    opacity: 1
  },
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
  noData: {
    text: "Loading..."
  }

});

let flexHistChartOptions = ref({
  chart: {
    id: "ranked_flex_chart",
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
  fill: {
    opacity: 1
  },
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
  noData: {
    text: "Loading..."
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
      console.log("fetch date", data);
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
      out["data"].push({
        "x": date,
        "y": val["rank_history"]["RANKED_SOLO_5x5"][date]
      });
      out["name"] = val["username"];
    }
    return out;
  })).filter(e => e != null);

  flexHistChartOptions.value.series = histFlex.map(val => {
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
  }).filter(e => e != null);
}


function updateDateCategory(f_data) {
  soloHistChartOptions.value.xaxis.categories = f_data;
  flexHistChartOptions.value.xaxis.categories = f_data;
  console.log("flex", flexHistChartOptions.value);

}

onMounted(() => {
  get_players();
  get_date_range();
  // console.log(curr_api);
});
</script>

<template>
  <body>
  <div v-if="player_data!==undefined && date_range!==undefined">

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

  /*grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));*/
  /*justify-content: space-evenly;*/

  margin: 15px 10px 15px 10px;
}
</style>
