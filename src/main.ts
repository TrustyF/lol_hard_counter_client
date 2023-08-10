import "./assets/base.css";
import { createApp, ref } from "vue";
import App from "./App.vue";
import router from "./router";
import VueLazyLoad from "vue3-lazyload";
import VueApexCharts from "vue3-apexcharts";

const local_api = "http://localhost:5000";
const server_api = "https://ttt-trustyfox.pythonanywhere.com";
// const devMode = import.meta.env.DEV;
const devMode = false;

const selected_players = ref([]);
const player_usernames = ref(undefined);
const player_data = ref(undefined);

const app = createApp(App);

app.provide("curr_api", devMode ? local_api : server_api);
app.provide("devMode", devMode);
app.provide("selectedPlayers", selected_players);
app.provide("playerUsernames", player_usernames);
app.provide("playerData", player_data);

app.use(router);
app.use(VueLazyLoad, {});
app.use(VueApexCharts);

app.mount("#app");
