<script setup>
import { RouterLink, RouterView } from "vue-router";
import NavBar from "@/components/navbar/NavBar.vue";
import PlayerSelector from "@/components/players/PlayerSelector.vue";

</script>

<template>
  <NavBar></NavBar>
  <body>
  <player-selector></player-selector>
  <RouterView />
  </body>
</template>

<style scoped>
body {
  margin: auto;
  width: 75vw;
  padding-top: 30px;
  /*outline: 1px solid palegreen;*/
}
</style>
