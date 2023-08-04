<script setup>
import { ref, inject, toRefs, toRaw, watch } from "vue";

let props = defineProps(["f_chartName", "f_chartOptions"]);

let playerData = inject("playerData");
let selectedPlayers = inject("selectedPlayers");
let playerUsernames = inject("playerUsernames");

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
      easing: "easeout",
      speed: 700,
      animateGradually: {
        enabled: true,
        delay: 500
      }
    },
    events: {}
  },
  tooltip: {
    theme: "dark",
    enabled: false
  },
  legend: {
    labels: {
      colors: "#ababab",
      useSeriesColors: true
    }
  },
  title: {
    text: "Elo",
    align: "left",
    floating: false
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
    labels: {
      rotate: 0,
      // offsetY:10,
      // offsetX:10,
      hideOverlappingLabels: false,
      trim: true,
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
      horizontal: false,
      columnWidth: "80%",
      dataLabels: {
        position: "top"

      }
    }
  },
  grid: {
    borderColor: "#282828",
    xaxis: {
      lines: {
        show: false
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
    // offsetX: 25,
    // offsetY: -7,
    // textAnchor: "start",
    offsetY: 5,
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
  const tier = (val - lp - ((val - lp) % 400)) / 400;

  return [`${rank_mappings["tier_values"][tier].charAt(0).toUpperCase() + rank_mappings["tier_values"][tier].slice(1)}`, `${rank_mappings["division_values"][div]}`, `${lp} lp`];
};
baseChartOptions.value["yaxis"]["labels"]["formatter"] = (val) => {
  const lp = val % 100;
  // const div = ((val - lp) % 400) / 100;
  const tier = (val - lp - ((val - lp) % 400)) / 400;
  return `${rank_mappings["tier_values"][tier]}`;
};
baseChartOptions.value["xaxis"]["labels"]["formatter"] = (val) => {
  if (typeof val !== "string") {
    return null;
  }
  return val.split(" ").slice(-1);
};

function update_chart() {
  // Filter selected players
  if (selectedPlayers.value.length > 0) {
    chartData = playerData.value.filter(x => selectedPlayers.value.includes(x["username"]));
  } else {
    chartData = playerData.value;
  }
  // Sort
  chartData.sort((a, b) => b["ranked"][chartOptions.value["queue"]]["rank"] - a["ranked"][chartOptions.value["queue"]]["rank"]);

  // Set data
  baseChartOptions.value.series = [{
    "data":
      chartData.map(val => {
        const queue = chartOptions.value["queue"];
        const last_rank = val["ranked"][queue]["rank_history"][val["ranked"][queue]["nearest_rank_date"]];
        const curr_rank = val["ranked"][queue]["rank"];

        if (Number(curr_rank) === 0) {
          return null;
        }

        return {
          "y": curr_rank,
          "x": val["username"],
          "goals": last_rank !== curr_rank ? [{
            value: last_rank,
            strokeColor: last_rank < curr_rank ? "#40ff15" : "#ff1515",
            strokeSize: 10
          }] : []
        };
      }).filter(e => e != null)
  }];
  // console.log("basechart", baseChartOptions.value);
}

watch(selectedPlayers.value, () => {
  update_chart();
});

update_chart();

</script>

<template>
  <apexchart
    type="bar"
    height="50%"
    :options="baseChartOptions"
    :series="baseChartOptions.series"
  ></apexchart>
</template>

<style scoped>
</style>