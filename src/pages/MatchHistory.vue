<script setup>
import { inject, computed, watch, ref, onMounted } from "vue";
import PlayerSelector from "../components/players/PlayerSelector.vue";
import HistoryBox from "@/components/matchHistory/HistoryBox.vue";

let playerData = inject("playerData");

let player = computed(() => playerData.value[0]);
let matchHistory = computed(() => playerData.value[0]["match_history"]);

let selectedPlayer = ref("");
</script>

<template>
  <div v-if="playerData!==undefined">

    <div class="feed">
      <div v-for="match in matchHistory" :key="match['match_info']['id']">
        <HistoryBox
          :match="match"
          :player="player"
        ></HistoryBox>
      </div>
    </div>

  </div>
</template>

<style scoped>
.feed {
  display: flex;
  flex-flow: column nowrap;
  gap: 10px;
}
</style>