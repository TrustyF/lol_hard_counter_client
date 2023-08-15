<script setup>
import { RouterLink } from "vue-router";

</script>

<template>
  <div class="base_nav">
    <div class="center_nav">
      <img class="nav_logo" src="/logos/TTT_square_logo_small.png" alt="ttt logo">

      <div class="links_bar">
        <RouterLink class="link" to="/">Wall of shame</RouterLink>
        <RouterLink class="link" to="/funnyStats">Funny stats™</RouterLink>
        <RouterLink class="link new" to="/matchHistory">Match history</RouterLink>
      </div>

    </div>
  </div>
</template>

<style scoped>
.base_nav {
  width: 100%;
  height: 50px;
  background-color: #16395d;
  /*overflow: hidden;*/
}

.center_nav {
  margin: auto;
  /*outline: 2px solid green;*/
  max-width: 1000px;
  width: 75vw;
  height: 100%;

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
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1em;

  color: white;
  /*filter: drop-shadow( 2px -2px 2px #2d4f70);*/
  padding: 0 30px 0 30px;
  text-decoration: none;

  min-width: 50px;

  transition: 0.1s;
}

.disabled {
  background-color: #2a2a2a;
  color: grey;
}

.router-link-active {
  background-color: rgb(3, 30, 58);
  /*box-shadow: inset -2px 2px 4px #04172a;*/
  /*text-decoration: underline;*/
}

.link:hover{
  background-color: rgb(32, 81, 131);
}

.nav_img {
  width: 100%;
  transform: translate(0, -320px);
}

.nav_logo {
  object-fit: contain;
  /*width: 70px;*/
  height: 100%;
}

@media only screen and (max-width: 760px) {
  .center_nav {
    margin: auto;
    /*outline: 2px solid red;*/
    width: 100%;
    /*height: 100%;*/

    display: flex;
    flex-flow: column nowrap;
  }
  .links_bar {
    display: flex;
    flex-flow: column nowrap;

  }
}

</style>