import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";
import { createPinia } from "pinia";
import { Icon } from "@iconify/vue";
import JsonExcel from "vue-json-excel3";
import {
  Chart as ChartJS,
  Colors,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  LinearScale,
  CategoryScale,
} from "chart.js";
ChartJS.register(
  Colors,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  LinearScale
);

ChartJS.defaults.responsive = true;
(ChartJS.defaults.maintainAspectRatio = false),
  (ChartJS.defaults.plugins.colors.forceOverride = true);
ChartJS.defaults.color = '#a4a5a4';
ChartJS.defaults.borderColor = '#9992';
ChartJS.defaults.plugins.title = {
  ...ChartJS.defaults.plugins.title,
  display: true,
  padding: {
    top: 16,
    bottom: 16,
  },
  color: "#a4a5a4",
  position: "bottom",
  font: {
    size: 20,
  },
};

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.component("icon", Icon);
app.component("downloadExcel", JsonExcel);
app.mount("#app");
