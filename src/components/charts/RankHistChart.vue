<script setup>
import { toRefs, ref, watch, inject, toRaw } from "vue";

let props = defineProps(["f_chartName", "f_chartData", "f_chartOptions"]);

let playerData = inject("playerData");
let selectedPlayers = inject("selectedPlayers");

let chartName = toRefs(props)["f_chartName"];
let chartData = toRaw(playerData.value);
let chartOptions = toRefs(props)["f_chartOptions"];


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
      enabled: false,
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
    enabled: true,
    // followCursor: false,
    intersect: true,
    shared: false,
    x: {
      formatter: undefined
    },
    y: {
      formatter: undefined
    }
  },
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
    tickAmount: 6,
    // min: 700,
    // max: 2800,
    labels: {
      rotate: 0,
      style: {
        colors: "#ababab",
        fontWeight: 1000

      }
    }
  },
  xaxis: {
    type: "datetime",
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
    row:{
      // colors: ['#4e413fe8','#7c584fb7','#637088a0','#856240bb','#29667ccf','#2e7a54d0','#4e6e9edc','#8d589adc','#8c4b46ce','#687d88bb'],
      // colors: ['rgba(97,152,234,1)','rgba(76,218,146,1)','rgba(70,183,224,1)','rgba(241,173,106,1)','rgba(164,186,227,1)','rgba(229,162,145,1)','rgba(227,120,111,1)','rgba(176,211,229,1)','rgba(222,183,177,1)',],
      // opacity:0.2,
    },
    xaxis: {
      lines: {
        show: false
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    },
    // padding: { right: 70, left: 10 }
  },
  plotOptions: {

    line: {
      distributes: false
    }
  },
  dataLabels: {
    // display: "auto",
    enabled: false,
    offsetX: 0,
    offsetY: -10,
    textAnchor: "middle",
    style: {
      fontSize: "12px",
      backgroundColor: "black"
    },
    background: {
      padding: 15,
      borderRadius: 3,
      borderWidth: 0,
      opacity: 1
    },
    dropShadow: {
      enabled: true,
      top: 0,
      left: 0,
      blur: 1.5,
      color: "#000",
      opacity: 1
    }
  },
  markers: { "size": 0.5 },
  stroke: { "width": 2 },
  noData: {
    text: "No data"
  }
});

baseChartOptions.value["chart"]["id"] = chartName.value;
baseChartOptions.value["colors"] = chartOptions.value["color"];
baseChartOptions.value["dataLabels"]["formatter"] = (val, opts) => {

  const lp = val % 100;
  const div = ((val - lp) % 400) / 100;
  const tier = (val - lp - ((val - lp) % 400)) / 400;

  // console.log(opts);

  if (val <= 0) {
    return undefined;
  }

  if (opts["dataPointIndex"] === 0) {
    return [opts.w["globals"]["initialSeries"][opts["seriesIndex"]]["name"]];
    // return [`${rank_mappings["tier_values"][tier]} ${rank_mappings["division_values"][div]} ${lp} lp`];
  }
};
baseChartOptions.value["tooltip"]["y"]["formatter"] = (val) => {
  const lp = val % 100;
  const div = ((val - lp) % 400) / 100;
  const tier = (val - lp - ((val - lp) % 400)) / 400;

  return [`${rank_mappings["tier_values"][tier]} ${rank_mappings["division_values"][div]} ${lp} lp`];
};
baseChartOptions.value["yaxis"]["labels"]["formatter"] = (val) => {
  if (val <= 0) {
    return undefined;
  }
  const lp = val % 100;
  // const div = ((val - lp) % 400) / 100;
  const tier = (val - lp - ((val - lp) % 400)) / 400;

  return `${rank_mappings["tier_values"][tier]}`;
};

function update_chart() {
  // Filter selected players
  if (selectedPlayers.value.length > 0) {
    chartData = playerData.value.filter(x => selectedPlayers.value.includes(x["username"]));
  } else {
    chartData = playerData.value;
  }
  // Set data
  baseChartOptions.value.series = (chartData.map(val => {
    if (Object.keys(val["ranked"][chartOptions.value["queue"]]["rank_history"]).length < 1) {
      return;
    }
    let out = { "data": [], "name": "" };
    for (let date in val["ranked"][chartOptions.value["queue"]]["rank_history"]) {
      let [d, M, y] = date.split(/[/ ]/);
      out["data"].push([new Date(y, parseInt(M) - 1, d), val["ranked"][chartOptions.value["queue"]]["rank_history"][date]]);
      out["name"] = val["username"];
    }
    out["data"].sort((a, b) => {
      return b[0] - a[0];
    });
    return out;

  })).filter(e => e != null);
  // console.log("hist chart", baseChartOptions.value);

}

watch(selectedPlayers.value, () => {
  update_chart();
});

update_chart();

</script>

<template>
  <apexchart
    class="test"
    type="line"
    height="100%"
    width="100%"
    :options="baseChartOptions"
    :series="baseChartOptions.series"
  ></apexchart>
</template>

<style scoped>
.test {
  /*outline: 1px solid yellow;*/
}
</style>