<script setup>
import { inject, onMounted,computed, watch } from "vue";
import PlayerBox from "@/components/players/PlayerBox.vue";

let playerData = inject("playerData");
let playerUsernames = computed(()=>playerData.value.map(value => [value.username,0,0]))

const rank_mappings = {
  "tier_values": ["iron", "bronze", "silver", "gold", "platinum", "emerald",
    "diamond", "master", "grandmaster", "challenger"],
  "division_values": ["IV", "III", "II", "I"]
};
let sorted;

function update_player() {
  if (playerData.value !== undefined) {
    sorted = playerData.value.sort((a, b) => b["ranked"]["RANKED_SOLO_5x5"]["rank"] - a["ranked"]["RANKED_SOLO_5x5"]["rank"]);
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
  }
}

watch(playerData, () => {
  update_player();
});

update_player();
</script>

<template>
  <img class="click_me" src="/extras/click_me3.png" alt="click me">
  <div class="players_buttons">
    <div class="button_wrapper" v-for="player in playerUsernames" :key="player">
      <PlayerBox :text="player"></PlayerBox>
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
  transform: translate(-90px, 0px);
  width: 150px;
  filter: invert(1);
}

</style>