<script setup>
import { inject, computed, ref } from "vue";

let emit = defineEmits(["selectedQueue"]);
let selected = ref("");

function emit_selected_queue(name) {
  emit("selectedQueue", name);

  if (selected.value !== name) {
    selected.value = name;
  } else {
    selected.value = "";
  }
}
</script>

<template>
  <div class="queue_selector">
    <div :class="selected==='ranked_solo_fives' ?'queue_button selected':'queue_button'"
         @click="emit_selected_queue('ranked_solo_fives')">
      Solo Queue
    </div>
    <div :class="selected==='ranked_flex_fives' ?'queue_button selected':'queue_button'"
         @click="emit_selected_queue('ranked_flex_fives')">
      Flex Queue
    </div>
    <div :class="selected==='normal_draft_fives' ?'queue_button selected':'queue_button'"
         @click="emit_selected_queue('normal_draft_fives')">
      Normal draft
    </div>
  </div>
</template>

<style scoped>
.queue_selector {
  /*outline: 1px solid red;*/
  user-select: none;
  cursor: pointer;
  display: flex;
  flex-flow: row wrap;
  gap: 10px;

  margin-bottom: 20px;
}

.queue_button {
  /*outline: 1px solid green;*/
  position: relative;
  text-shadow: 1px 1px 1px black, 2px 2px 3px black, 1px 1px 5px black, -1px -1px 5px black;

  background: linear-gradient(-90deg, rgba(44, 62, 80, 1) 40%, rgba(17, 26, 34, 1) 120%);
  box-shadow: inset 1px 1px 1px #5a7b9b;
  filter: drop-shadow(2px 2px 2px black);

  display: flex;
  flex-flow: row nowrap;
  color: white;

  gap: 15px;

  padding: 5px 10px 5px 10px;

  border-radius: 5px;
  /*transition: 0.1s;*/

  font-size: 0.8em;
}

.queue_button:hover {
  background: rgba(87, 116, 143, 1)
}

.selected {
  box-shadow: inset 1px 1px 1px #2a2a2a;
  background: rgba(87, 116, 143, 1);
  filter: none;
}
</style>