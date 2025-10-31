import { createApp } from "vue";
import { wagmiConfig } from "./wagmi";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { WagmiPlugin } from "@wagmi/vue";

import App from "./App.vue";
import "./assets/main.css";

const app = createApp(App);
app.use(VueQueryPlugin);
app.use(WagmiPlugin, { config: wagmiConfig });

app.mount("#app");
