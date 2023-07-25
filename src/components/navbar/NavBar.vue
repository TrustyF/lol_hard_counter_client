<script setup>
import { RouterLink } from "vue-router";

</script>

<template>
  <div class="base_nav">
    <div class="links_bar">
      <h1 class="title">TTT Wall of shame</h1>
      <!--      <RouterLink class="link" to="/">Funny stats</RouterLink>-->
    </div>
    <!--      <img class="nav_img" src="/TTT_backdrop_dark.png" alt="nav backdrop">-->
    <img class="nav_logo" src="/TTT_square_logo.png" alt="ttt logo">
  </div>
</template>

<style scoped>
.base_nav {
  width: 100%;
  height: 70px;
  background-color: #2c3e50;
  /*overflow: hidden;*/
}

.links_bar {
  position: absolute;
  margin-left: 90px;
  height: 70px;
  /*outline: 1px solid red;*/
  display: flex;
}

.title {
  font-weight: 1000;
  font-size: 3em;
}

.link {
  margin: auto;
  text-align: center;
  /*outline: 1px solid red;*/
  color: white;
  text-decoration: none;
  height: 100%;
  padding: 0 20px 0 20px;
  font-size: 1.5em;

  transition: 0.1s;
}

.link:hover {
  /*color: inherit;*/
  background-color: rgba(255, 255, 255, 0.2);
}

.nav_img {
  width: 100%;
  transform: translate(0, -320px);
}

.nav_logo {
  position: absolute;
  left: 0;
  top: 0;
  width: 70px;
}
</style>