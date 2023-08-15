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
  /*outline: 1px solid red;*/
  width: 100%;
  min-height: 10px;
  position: relative;
  z-index: 0;
}

.title {
  font-size: 1.2em;
  font-weight: bold;
  text-decoration: underline;
}

.wrapper {
  /*outline: 1px solid green;*/
  /*overflow: hidden;*/
  display: flex;
  flex-flow: column nowrap;
  gap: 10px;
}

.container {
  padding: 5px;
  width: fit-content;
  border-radius: 10px;
  display: flex;
  justify-items: center;
  align-items: center;
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
  position: absolute;
  right: 0;
  top: 0;

  border-radius: 4px;
  width: auto;
  padding: 7px;

  text-align: left;
  vertical-align: center;

  font-weight: normal;
  font-size: 1em;
  /*background-color: #2c3e50;*/
  cursor: pointer;
  user-select: none;
  white-space: nowrap;

  background: linear-gradient(-90deg, rgba(44, 62, 80, 1) 50%, rgba(17, 26, 34, 1) 120%);
  filter: drop-shadow(2px 2px 2px black);
  box-shadow: inset 1px 1px 1px #5a7b9b;

}

.close_button:hover {
  background: linear-gradient(-90deg, rgba(87, 116, 143, 1) 0%, rgba(17, 26, 34, 1) 100%);
  cursor: pointer;
}

</style>