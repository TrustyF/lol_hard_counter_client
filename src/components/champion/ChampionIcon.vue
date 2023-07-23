<script setup>

const props = defineProps(["champData"]);
// const emit = defineEmits(["ChampEmit"]);

function emit_champion() {
  console.log(props['champData']);
}
</script>

<template>
  <div class="icon_wrapper" @click="emit_champion">
    <img class="icon_img" v-lazy="`src/assets/champions/${champData['name']}.png`" alt="champion portrait">
  </div>
</template>

<style scoped>
.icon_img {
  width: 70px;
  height: 70px;
  display: block;

}

.icon_wrapper {
  margin: 5px;
  /*outline: 1px solid green;*/
  /*border-inline: green 1px solid;*/
}
</style>