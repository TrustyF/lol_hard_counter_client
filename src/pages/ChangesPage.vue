<script setup>
import ChangeLog from "@/components/changelog/ChangeLog.vue";

let all_changes = [
  "Funny stats™ ranks are now comparing the last 30 game against the 30 games before that",
  "Added DAMAGE category",
  "Added LANE DIFF category",
  "Added more objectives to OBJECTIVES",
  "Fixed cc stats",
];
let all_suggestions = [
  "Add podium for top 3 ranked players",
  "Split funny stats between solo flex aram and normal"
];
let all_wip = [
  "Splitting funny stats between solo flex aram and normal",
  "Add lp gain slope",
  "Add cope corner",
  "Add switch to toggle between last 30 games and all games"
];
</script>

<template>
  <div class="wrapper">
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
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-flow: row wrap;
  gap: 10px;
}
</style>