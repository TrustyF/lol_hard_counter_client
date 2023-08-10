<script setup>
import { inject, onMounted, watch } from "vue";

let props = defineProps(["changes","close","image","title"]);

function hide() {
  let box = document.getElementsByClassName("box")[0];
  box.classList.add("hidden");
}
</script>

<template>
  <div class="box">
    <p v-if="close" class="close_button" @click="hide">x</p>
    <h1 class="title">{{ title }} </h1>
    <div class="wrapper">
      <div v-for="elem in changes" :key="elem" class="container">
        <img class="cute_img" :src="`/assets/gifs/${image}`">
        <p class="change_text">{{ elem }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box {
  margin: 0 0 20px 0;
  /*outline: 1px solid red;*/
  width: fit-content;
  height: fit-content;
  position: relative;
  transition: 100ms;
}
.hidden {
  visibility: hidden;
  opacity: 0;
  height: 0;
}

.title {
  font-size: 1.2em;
  margin-bottom: 10px;
  font-weight: bold;
  text-decoration: underline;
}

.wrapper {
  display: flex;
  flex-flow: column wrap;
  gap: 10px;
  position: relative;
}

.divider {
  height: 1px;
  background-color: white;
  margin-bottom: 20px;
}

.container {
  padding: 5px;
  background-color: #2c3e50;
  width: fit-content;
  border-radius: 10px;
  display: flex;
  justify-items: center;
  align-items: center;
  gap: 5px;
}

.cute_img {
  height: 35px;
  margin-left: 5px;
  /*outline: 1px solid red;*/
}

.change_text {
  font-size: 0.9em;
  padding: 5px;
  /*outline: 1px solid red;*/
}

.close_button {
  position: absolute;
  right: 0;
  top: 0;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  text-align: center;
  vertical-align: center;
  line-height: 20px;
  font-family: Farmhouse, sans-serif;
  font-weight: lighter;
  font-size: 1em;
  /*background-color: #2c3e50;*/
  cursor: pointer;
  user-select: none;
  /*outline: 1px solid red;*/
}


</style>