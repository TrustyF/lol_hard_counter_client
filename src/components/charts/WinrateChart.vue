<script setup>
import { ref, inject, toRefs, toRaw, watch } from "vue";

let props = defineProps(["f_chartName", "f_chartOptions"]);

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
      easing: "easeout",
      speed: 700,
      animateGradually: {
        enabled: true,
        delay: 500
      }
    },
    events: {}
  },
  title:{
    text:"Winrate",
    align: 'left',
    floating: false,
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
      position:'front',
      name: "",
      data: []
    }
  ],
  annotations: {
    position:'back',

    yaxis: [{
      y: 45,
      y2: 0,
      opacity: 0.1,
      borderColor: '#ff0000',
      fillColor: '#ff0000',
      strokeDashArray:0,
    }]
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '80%',
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
    offsetY: 10,
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
baseChartOptions.value["xaxis"]["labels"]["formatter"] = (val) => {
  if (typeof val !== "string") {
    return null;
  }
  return val.split(" ").slice(-1);
};
baseChartOptions.value["yaxis"]["labels"]["formatter"] = (val) => {
  return `${val}%`;
};
baseChartOptions.value["dataLabels"]["formatter"] = (val, ops) => {
  if (val <= 0) {
    return undefined;
  }
  // console.log('ops',ops);
  return [`${val}%`, `${ops.config.series[0].data[ops.dataPointIndex].y[0]} games`];
};


function update_chart() {
  // Filter selected players
  if (selectedPlayers.value.length > 0) {
    chartData = playerData.value.filter(x => selectedPlayers.value.includes(x["username"]));
  } else {
    chartData = playerData.value;
  }
  // Sort
  chartData.sort((a, b) => {
    let queue = chartOptions.value["queue"];
    let a_w = (a["ranked"][queue]["winrate"][0] / (a["ranked"][queue]["winrate"][0] + a["ranked"][queue]["winrate"][1])) * 100;
    let b_w = (b["ranked"][queue]["winrate"][0] / (b["ranked"][queue]["winrate"][0] + b["ranked"][queue]["winrate"][1])) * 100;
    return b_w - a_w;
  });

  // Set data
  baseChartOptions.value.series = [{
    "data":
      chartData.map(val => {
        const queue = chartOptions.value["queue"];
        let max_games = (val["ranked"][queue]["winrate"][0] + val["ranked"][queue]["winrate"][1]);
        let winrate = Math.round((val["ranked"][queue]["winrate"][0] / max_games) * 100);

        if (Number(winrate) === 0 || Number(max_games) < 10) {
          return null;
        }

        return {
          "y": [max_games, winrate],
          "x": val["username"]
        };
      }).filter(e => e != null)
  }];
  // console.log("basechart", baseChartOptions.value.series);
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
    width="100%"
    :options="baseChartOptions"
    :series="baseChartOptions.series"
  ></apexchart>
</template>

<style scoped>

</style>