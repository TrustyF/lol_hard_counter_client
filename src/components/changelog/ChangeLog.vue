<script setup>
import { inject, onMounted, ref, watch } from "vue";

let props = defineProps(["changes", "close", "image", "title"]);

let isClosed = ref(true);

function hide() {
  if (props["close"]) {
    isClosed.value = !isClosed.value;
  }
}
</script>

<template>
  <div class="box">
    <p v-if="close" class="close_button new_text_edge" @click="hide"> {{ title }} </p>
    <div class="wrapper" v-if="!isClosed">
      <div v-for="elem in changes" :key="elem" class="container">
        <img class="cute_img" :src="`/assets/gifs/${image}`">
        <p class="change_text">{{ elem }}</p>
      </div>
    </div>

  </div>
</template>

<style scoped>
.box {
  user-select: none;
  /*outline: 1px solid red;*/
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-end;

  height: 40px;

  width: 100%;

  position: relative;
  right: 0;
  z-index: 10;
  padding: 0 0 10px 10px;
  opacity: 100;
  visibility: visible;
}

.title {
  font-size: 1em;
  font-weight: bold;
  text-decoration: underline;
}

.wrapper {
  /*outline: 1px solid green;*/
  /*overflow: hidden;*/
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-end;
  gap: 10px;
}

.container {
  display: flex;
  flex-flow: row nowrap;

  padding: 5px;
  width: fit-content;
  border-radius: 10px;
  text-align: left;
  gap: 5px;
  background: linear-gradient(-90deg, rgb(25, 58, 42) 50%, rgba(17, 26, 34, 1) 120%);
  filter: drop-shadow(2px 2px 2px black);
  box-shadow: inset 1px 1px 1px #5a7b9b;
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
  /*position: absolute;*/
  /*right: 0;*/
  /*top: -50px;*/
  width: fit-content;

  border-radius: 4px;
  padding: 7px;

  text-align: center;
  vertical-align: center;

  font-weight: normal;
  font-size: 0.7em;
  /*background-color: #2c3e50;*/
  cursor: pointer;
  user-select: none;
  white-space: nowrap;

  margin-bottom: 10px;

  background: linear-gradient(-90deg, rgba(44, 62, 80, 1) 50%, rgba(17, 26, 34, 1) 120%);
  filter: drop-shadow(2px 2px 2px black);
  box-shadow: inset 1px 1px 1px #5a7b9b;

}

.close_button:hover {
  background: linear-gradient(-90deg, rgba(87, 116, 143, 1) 0%, rgba(17, 26, 34, 1) 100%);
  cursor: pointer;
}

</style>