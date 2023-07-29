<script setup>
import { ref, inject, onMounted, toRefs,toRaw, watch } from "vue";

let props = defineProps(["f_chartName", "f_chartData", "f_chartOptions"]);

let chartName = toRefs(props)["f_chartName"];
let chartData = toRaw(props)["f_chartData"];
let chartOptions = toRefs(props)["f_chartOptions"];

let selectedPlayers = inject("selectedPlayers");

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
    categories: [],
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
    offsetY: -40,
    style: {
      fontSize: "12px",
      backgroundColor: "black"
    }
  },
  noData: {
    text: "Loading..."
  }
});

baseChartOptions.value["chart"]["id"] = chartName.value;
baseChartOptions.value["colors"] = chartOptions.value["color"];
baseChartOptions.value["dataLabels"]["formatter"] = (val) => {
  if (val <= 0) {
    return undefined;
  }
  const num = String(val);
  const tier = Number(num.slice(-4, -3));
  const div = Number(num.slice(-3, -2));
  const lp = Number(num.slice(-2));
  return [`${rank_mappings["tier_values"][tier].charAt(0).toUpperCase() + rank_mappings["tier_values"][tier].slice(1)} ${rank_mappings["division_values"][div]}`, `${lp} lp`];
};
baseChartOptions.value["yaxis"]["labels"]["formatter"] = (val) => {
  const num = String(val);
  const tier = Number(num.slice(-4, -3));
  return `${rank_mappings["tier_values"][tier]}`;
};
baseChartOptions.value["xaxis"]["labels"]["formatter"] = (val) => {
  return val.split(" ").slice(-1);
};

function update_chart() {
  // Filter selected players
  if (selectedPlayers.value.length > 0) {
    chartData = props['f_chartData'].filter(x => selectedPlayers.value.includes(x["username"]));
  } else {
    chartData = props['f_chartData']
  }
  // Sort
  chartData.sort((a, b) => b["rank"][chartOptions.value["queue"]]["rank"] - a["rank"][chartOptions.value["queue"]]["rank"]);

  // Set data
  baseChartOptions.value.series = [{
    "data":
      chartData.map(val => {
        return { "y": val["rank"][chartOptions.value["queue"]]["rank"], "x": val["username"] };
      }).filter(e => e != null)
  }];
}

watch(selectedPlayers.value, () => {
  update_chart();
});

update_chart();

</script>

<template>
  <div></div>
  <apexchart
    type="bar"
    :height=graph_width
    :options="baseChartOptions"
    :series="baseChartOptions.series"
  ></apexchart>
</template>

<style scoped>

</style>