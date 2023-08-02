<script setup>
import { toRefs, ref, watch, inject, toRaw } from "vue";

let props = defineProps(["f_chartName", "f_chartData", "f_chartOptions"]);

let playerData = inject("playerData");
let selectedPlayers = inject("selectedPlayers");

let chartName = toRefs(props)["f_chartName"];
let chartData = toRaw(playerData.value);
let chartOptions = toRefs(props)["f_chartOptions"];


let graph_width = "100%";
const rank_mappings = {
  "tier_values": ["iron", "bronze", "silver", "gold", "platinum", "emerald",
    "diamond", "master", "grandmaster", "challenger"],
  "division_values": ["IV", "III", "II", "I"]
};

// Set options
let baseChartOptions = ref({
  chart: {
    id: "",
    animations: {
      enabled: true,
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 50
      }
    },
    events: {}
  },
  title: {
    text: "History",
    align: "left",
    floating: false
  },
  tooltip: {
    theme: "dark",
    enabled: false
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
    offsetX: 25,
    offsetY: -7,
    textAnchor: "start",
    style: {
      fontSize: "12px",
      backgroundColor: "black"
    }
  },
  noData: {
    text: "No data"
  }
});

baseChartOptions.value["chart"]["id"] = chartName.value;
baseChartOptions.value["colors"] = chartOptions.value["color"];
baseChartOptions.value["dataLabels"]["formatter"] = (val) => {
  if (val <= 0) {
    return undefined;
  }
  const lp = val % 100;
  const div = ((val - lp) % 400) / 100;
  // const tier = (val - lp - ((val - lp) % 400)) / 400;

  return [`Tier ${rank_mappings["division_values"][div]} ${lp} lp`];
};
baseChartOptions.value["dataLabels"]["textAnchor"] = "middle";
baseChartOptions.value["dataLabels"]["offsetY"] = -10;
baseChartOptions.value["dataLabels"]["offsetX"] = 0;
baseChartOptions.value["yaxis"]["labels"]["formatter"] = (val) => {
  if (val <= 0) {
    return undefined;
  }
  const lp = val % 100;
  // const div = ((val - lp) % 400) / 100;
  const tier = (val - lp - ((val - lp) % 400)) / 400;

  return `${rank_mappings["tier_values"][tier]}`;
};
baseChartOptions.value["xaxis"]["type"] = "datetime";
baseChartOptions.value["markers"] = { "size": 2 };
baseChartOptions.value["stroke"] = { "width": 2 };
baseChartOptions.value["grid"]["yaxis"]["lines"]["show"] = true;
baseChartOptions.value["grid"]["xaxis"]["lines"]["show"] = false;
baseChartOptions.value["grid"]["padding"] = { right: 50, left: 50 };

function update_chart() {
  // Filter selected players
  if (selectedPlayers.value.length > 0) {
    chartData = playerData.value.filter(x => selectedPlayers.value.includes(x["username"]));
  } else {
    chartData = playerData.value;
  }
  // Set data
  baseChartOptions.value.series = (chartData.map(val => {
    if (Object.keys(val["rank_history"][chartOptions.value["queue"]]).length < 1) {
      return;
    }
    let out = { "data": [], "name": "" };
    for (let date in val["rank_history"][chartOptions.value["queue"]]) {
      let [d, M, y] = date.split(/[/ ]/);
      out["data"].push([new Date(y, parseInt(M) - 1, d), val["rank_history"][chartOptions.value["queue"]][date]]);
      out["name"] = val["username"];
    }
    out["data"].sort((a, b) => {
      return b[0] - a[0];
    });
    return out;

  })).filter(e => e != null);
  console.log("hist chart", baseChartOptions.value);

}

watch(selectedPlayers.value, () => {
  update_chart();
});

update_chart();

</script>

<template>
  <apexchart
    type="line"
    height="100%"
    :options="baseChartOptions"
    :series="baseChartOptions.series"
  ></apexchart>
</template>

<style scoped>

</style>