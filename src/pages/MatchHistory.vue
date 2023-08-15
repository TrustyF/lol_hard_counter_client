<script setup>
import { inject, computed, watch, ref, onMounted } from "vue";
import PlayerSelector from "../components/players/PlayerSelector.vue";
import HistoryBox from "@/components/matchHistory/HistoryBox.vue";

let playerData = inject("playerData");
let matchHistory = computed(() => playerData.value[0]["match_history"]["matches"]);

let selectedPlayer = ref("");
</script>

<template>
  <div v-if="playerData!==undefined">

    <div v-for="match in matchHistory" :key="match['match_info']['id']">
      <HistoryBox :match="match"></HistoryBox>
    </div>

  </div>
</template>

<style scoped>

</style>