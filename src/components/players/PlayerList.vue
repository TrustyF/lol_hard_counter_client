<script setup>
// import { inject, onMounted, ref, watch } from "vue";
import PlayerBox from "@/components/players/PlayerBox.vue";

let props = defineProps(["stats", "tier_enabled","height"]);
</script>

<template>
  <div class="funny_wrapper">
    <div v-for="col in stats" :key="col['heading']">
      <div
        class="stat_column">
        <div class="column_heading">
          <div class="stats_image_wrapper" v-if="col['images']!==undefined">
            <img v-for="im in col['images']" :src="im" :key="im" alt="stat_image" class="stats_image">
          </div>
          <p class="heading_text">{{ col["heading"] }}</p>
          <p class="heading_scaling">{{ col["scaling"] }}</p>
        </div>
        <div class="stats_scroll_box" :style="`height:${height};`">
          <div class="stats_list">
            <PlayerBox v-for="(data,i) in col['value']"
                       :key="data[0]"
                       :text="data"
                       :index="i"
                       :value_format="col['value_format']"
                       :tier_enabled="tier_enabled"
            ></PlayerBox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

p {
  margin-bottom: 5px;
}


.funny_wrapper {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  /*display: grid;*/
  /*grid-template-columns: repeat(3,1fr);*/
  gap: 30px;
  margin-bottom: 40px;
  width: 100%;
  /*outline: 1px solid red;*/
}

.stat_column {
  position: relative;
  /*outline: 1px solid red;*/
}

.stat_column::-webkit-scrollbar {
  display: none;
}

.column_heading {
  position: relative;
  display: flex;
  flex-flow: row wrap;
  height: 25px;
  gap: 5px;
  margin-bottom: 5px;
  /*outline: 1px solid green;*/
  justify-content: center;
  /*height: fit-content;*/
}


.stats_scroll_box {
  position: relative;
  min-width: 250px;
  background-color: #111111;
  padding: 20px;
  border-radius: 10px;

  overflow-y: scroll;
  /*overflow-x: hidden;*/
  scrollbar-width: none;
  box-shadow: inset 0 0 5px #000000;

}

.stats_scroll_box::-webkit-scrollbar {
  display: none;
}

.stats_image {
  object-fit: scale-down;
  height: 20px;
  width: 20px;
  margin: auto 0 auto 0;
  filter: invert();
  /*border-radius: 5px;*/
  /*outline: 1px solid red;*/
}

.stats_image_wrapper {
  display: flex;
  gap: 5px;
  margin: 0 0 auto 0;
}

.heading_text {
  position: relative;
  margin: 0;
  transform: translate(0, 1px);
  /*outline: 1px solid red;*/
}

.heading_scaling {
  color: #626262;
  margin: auto 0 auto 0;
  text-align: center;
  font-size: 0.75em;
  /*outline: 1px solid red;*/
}

.stats_list {
  display: flex;
  flex-flow: column nowrap;
  /*grid-template-columns: repeat(auto-fill, auto);*/
  justify-content: start;
  gap: 10px;
}
</style>