import "./assets/base.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueLazyLoad from "vue3-lazyload";
import VueApexCharts from "vue3-apexcharts";

const local_api = "http://localhost:5000";
const server_api = "https://trustyfox.pythonanywhere.com";
// const devMode = import.meta.env.DEV;
const devMode = false;

const app = createApp(App);

app.provide("curr_api", devMode ? local_api : server_api);
app.provide("devMode", devMode);

app.use(router);
app.use(VueLazyLoad, {});
app.use(VueApexCharts);

app.mount("#app");
