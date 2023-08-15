<script setup>
import { inject, onMounted, watch, computed } from "vue";

let props = defineProps(["match"]);

let id = computed(() => props["match"]["match_info"]["id"]);

</script>

<template>
  <div class="match_container">
    <p>{{ id }}</p>
  </div>
</template>

<style scoped>
.match_container {
  height: 50px;

  border-radius: 11px;

  font-size: 0.8em;

  background: linear-gradient(-90deg, rgba(44, 62, 80, 1) 40%, rgba(17, 26, 34, 1) 80%);
  box-shadow: inset 1px 1px 1px #5a7b9b;
  filter: drop-shadow(2px 2px 2px black);
}
</style>