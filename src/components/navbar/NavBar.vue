<script setup>
</script>

<template>
<div class="base_nav">
  <img class="nav_img" src="/TTT_backdrop_dark.png" alt="nav backdrop">
  <img class="nav_logo" src="/TTT_square_logo.png" alt="ttt logo">
</div>
</template>

<style scoped>
.base_nav {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100px;
  background-color: #2c3e50;
  overflow: hidden;
}
.nav_img {
  width: 100%;
  transform: translate(0,-320px);
}
.nav_logo{
  position: absolute;
  left: 0;
  width: 100px;
}
</style>