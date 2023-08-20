<script setup>
import { inject, computed, ref } from "vue";

let emit = defineEmits(["selectedQueue"]);
let props = defineProps(["update_button"]);
let selected = ref("");
const curr_api = inject("curr_api");

let server_busy = ref(false);

function emit_selected_queue(name) {
  emit("selectedQueue", name);

  if (selected.value !== name) {
    selected.value = name;
  } else {
    selected.value = "";
  }
}

function update_server() {
  const url = new URL(`${curr_api}/player/add_rank_to_history`);
  // const url = new URL(`${curr_api}/player/update`);

  let button = document.getElementsByClassName("refresh_button")[0];
  button.classList.add("loading");

  if (server_busy.value) return;

  server_busy.value = true;

  fetch(url)
    // Handle http error
    .then(response => {
      if (!response.ok) {
        server_busy.value = false;
        button.classList.remove("loading");
        button.classList.add("error");
        setTimeout(() => button.classList.remove("error"), 3000);
        // throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })

    // Process the returned JSON data
    .then(data => {
      console.log(data);
      button.classList.remove("loading");
      server_busy.value = false;
    })

    // Handle any errors that occurred during the fetch
    .catch(error => {
      console.error("Error:", error);
    });

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

    <div v-if="update_button!==false" style="  margin-left: auto; display: flex;flex-flow: row nowrap">
      <span v-if="server_busy" class="loader"></span>
      <div class="refresh_button" @click="update_server()">
        Update
      </div>
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

.refresh_button {
  /*outline: 1px solid green;*/
  position: relative;
  text-shadow: 1px 1px 1px black, 2px 2px 3px black, 1px 1px 5px black, -1px -1px 5px black;

  background: linear-gradient(-90deg, #449a2b 40%, #103604 120%);
  box-shadow: inset 1px 1px 1px #66d549;
  filter: drop-shadow(2px 2px 2px black);

  display: flex;
  flex-flow: row nowrap;
  color: white;

  gap: 15px;

  padding: 5px 10px 5px 10px;

  border-radius: 5px;
  /*transition: 0.1s;*/

  font-size: 0.8em;
  transition: 0.5s ease-in-out;

}

.loading {
  user-select: none;
  cursor: auto;
  background: #103604;
  box-shadow: none;
  color: grey;
}
.error {
  user-select: none;
  cursor: auto;
  background: #360404;
  box-shadow: none;
  color: red;
}
.error::before{
  content: 'error, server busy';
}

.loader {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 10px 0 #fff, 10px 0 #fff;
  position: relative;
  animation: flash 1s ease-out infinite alternate;
  margin: 12px 20px 0 0;
}

@keyframes flash {
  0% {
    background-color: #FFF2;
    box-shadow: 10px 0 #FFF2, -10px 0 #FFF;
  }
  50% {
    background-color: #FFF;
    box-shadow: 10px 0 #FFF2, -10px 0 #FFF2;
  }
  100% {
    background-color: #FFF2;
    box-shadow: 10px 0 #FFF, -10px 0 #FFF2;
  }
}

</style>