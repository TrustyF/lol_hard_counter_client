<script setup>
import ChangeLog from "@/components/changelog/ChangeLog.vue";

let all_changes = [
  "Funny stats™ is now calculated on the last 30 games",
  "Rank changes will be updated hourly and notified with a badge",
  "Funny stats™ are now properly calculated and more accurate",
  "Reworked backend to more easily calculate specific amounts of games"
];
let all_suggestions = [
  "Add podium for top 3 ranked players",
  "Split funny stats between solo flex aram and normal"
];
let all_wip = [
  "Add lp gain slope",
  "Add cope corner",
  "Add switch to toggle between last 30 games and all games",
];
</script>

<template>
  <ChangeLog
    title="Changelog"
    :changes="all_changes"
    :close="false"
    image="pepedance.webp"
  ></ChangeLog>
  <ChangeLog
    title="Suggestions"
    :changes="all_suggestions"
    :close="false"
    image="peeponote.webp"
  ></ChangeLog>
  <ChangeLog
    title="Work in progress"
    :changes="all_wip"
    :close="false"
    image="peepochatting.webp"
  ></ChangeLog>
</template>

<style scoped>

</style>