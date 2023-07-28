<script setup>
import { toRefs } from "vue";

let props = defineProps(["f_chartName", "f_chartData", "f_chartOptions"]);

let chartName = toRefs(props)["f_chartName"];
let chartData = toRefs(props)["f_chartData"];
let chartOptions = toRefs(props)["f_chartOptions"];

let graph_width = "100%";
const rank_mappings = {
  "tier_values": ["iron", "bronze", "silver", "gold", "platinum", "emerald",
    "diamond", "master", "grandmaster", "challenger"],
  "division_values": ["IV", "III", "II", "I"]
};

// Set options
let baseChartOptions = {
  chart: {
    id: "",
    animations: {
      enabled: true,
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 50
      },
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
    offsetX: 25,
    offsetY: -7,
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

baseChartOptions["chart"]["id"] = chartName.value;
baseChartOptions["colors"] = chartOptions.value["color"];
baseChartOptions["dataLabels"]["formatter"] = (val) => {
  if (val <= 0) {
    return undefined;
  }
  const num = String(val);
  // const tier = Number(num.slice(-4, -3));
  const div = Number(num.slice(-3, -2));
  const lp = Number(num.slice(-2));
  return [`Tier ${rank_mappings["division_values"][div]} ${lp} lp`];
};
baseChartOptions["dataLabels"]["textAnchor"] = "middle";
baseChartOptions["dataLabels"]["offsetY"] = -10;
baseChartOptions["dataLabels"]["offsetX"] = 0;
baseChartOptions["yaxis"]["labels"]["formatter"] = (val) => {
  if (val <= 0) {
    return undefined;
  }
  const num = String(val);
  const tier = Number(num.slice(-4, -3));
  return `${rank_mappings["tier_values"][tier]}`;
};
baseChartOptions["xaxis"]["type"] = "datetime";
baseChartOptions["markers"] = { "size": 2 };
baseChartOptions["stroke"] = { "width": 2 };
baseChartOptions["grid"]["yaxis"]["lines"]["show"] = true;
baseChartOptions["grid"]["xaxis"]["lines"]["show"] = false;
baseChartOptions["grid"]["padding"] = { right: 50, left: 50 };

// Set data
baseChartOptions.series = (chartData.value.map(val => {
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


</script>

<template>
  <div></div>
  <apexchart
    type="line"
    :height=graph_width
    :options="baseChartOptions"
    :series="baseChartOptions.series"
  ></apexchart>
</template>

<style scoped>

</style>