<script setup>
import { inject, onMounted, watch } from "vue";
import PlayerBox from "@/components/players/PlayerBox.vue";

let playerData = inject("playerData");
let playerUsernames = inject("playerUsernames");

const rank_mappings = {
  "tier_values": ["iron", "bronze", "silver", "gold", "platinum", "emerald",
    "diamond", "master", "grandmaster", "challenger"],
  "division_values": ["IV", "III", "II", "I"]
};

watch(playerData, () => {
  const sorted = playerData.value.sort((a, b) => b["ranked"]["RANKED_SOLO_5x5"]["rank"] - a["ranked"]["RANKED_SOLO_5x5"]["rank"]);
  playerUsernames.value = sorted.map(x => {
    let val = x["ranked"]["RANKED_SOLO_5x5"]["rank"];
    let lp = val % 100;
    // const div = ((val - lp) % 400) / 100;
    let tier = (val - lp - ((val - lp) % 400)) / 400;
    return {
      "username": x["username"],
      "profile_icon": x["profile_icon"],
      "rank": tier === 0 ? "unranked" : rank_mappings["tier_values"][tier]
    };
  });
});
</script>

<template>
  <img class="click_me" src="/extras/click_me3.png" alt="click me">
  <div class="players_buttons">
    <div class="button_wrapper" v-for="player in playerUsernames" :key="player.username">
      <PlayerBox :player="player" :tier_enabled="true"></PlayerBox>
    </div>
  </div>
</template>

<style scoped>

.players_buttons {
  display: flex;
  flex-flow: row wrap;
  gap: 15px;
  width: 100%;
  margin: 10px 0 30px 0;
}

.click_me {
  position: absolute;
  transform: translate(-90px,0px);
  width: 150px;
  filter: invert(1);
}

</style>