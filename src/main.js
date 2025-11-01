import { createApp } from "vue";
import { wagmiConfig } from "./wagmi";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { WagmiPlugin } from "@wagmi/vue";
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-default.css";

import App from "./App.vue";
import "./assets/main.css";

const app = createApp(App);
app.use(VueQueryPlugin);
app.use(WagmiPlugin, { config: wagmiConfig });
app.use(ToastPlugin, { position: "top" });

app.mount("#app");
