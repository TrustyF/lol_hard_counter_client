<script setup>
import { ref, inject, onMounted } from "vue";

let graph_width = "100%";
let props = defineProps(["baseChartOptions","chartName"]);

let currChartOptions = ref(JSON.parse(JSON.stringify(props['baseChartOptions'])));
currChartOptions.value["chart"]["id"] = chartName;
</script>

<template>
  <apexchart
    type="bar"
    :height=graph_width
    :options="soloChartOptions"
    :series="soloChartOptions.series"
  ></apexchart>
</template>

<style scoped>

</style>