<script setup>
import { RouterLink } from "vue-router";

</script>

<template>
  <div class="base_nav">
    <div class="center_nav">
      <img class="nav_logo" src="/logos/TTT_square_logo_small.png" alt="ttt logo">

      <div class="links_bar">
        <RouterLink class="link" to="/">Wall of shame</RouterLink>
        <RouterLink class="link" to="/funnyStats">Funny stats</RouterLink>
      </div>

    </div>
  </div>
</template>

<style scoped>
.base_nav {
  width: 100%;
  height: 70px;
  background-color: #16395d;
  /*overflow: hidden;*/
}

.center_nav {
  margin: auto;
  /*outline: 2px solid green;*/
  width: 75vw;
  /*height: 100%;*/

  display: flex;
  flex-flow: row nowrap;
}

.links_bar {
  /*margin-left: 50px;*/
  /*height: 100%;*/
  /*outline: 1px solid red;*/
  display: flex;
}

.link {
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 1.2em;

  /*outline: 1px solid purple;*/
  color: white;
  /*line-height: 300%;*/
  /*height: 100%;*/
  padding: 0 30px 0 30px;
  text-decoration: none;

  transition: 0.1s;
}

.router-link-active, .link:hover {
  background-color: rgb(5, 38, 72);
  /*text-decoration: underline;*/
}

.nav_img {
  width: 100%;
  transform: translate(0, -320px);
}

.nav_logo {
  width: 70px;
  height: 100%;
}
</style>