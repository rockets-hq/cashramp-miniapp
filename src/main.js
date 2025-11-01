import { createApp } from "vue";
import { wagmiConfig } from "./wagmi";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { WagmiPlugin } from "@wagmi/vue";
import ToastPlugin from "vue-toast-notification";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import "vue-toast-notification/dist/theme-default.css";

import App from "./App.vue";
import "./assets/main.css";

import { faCopy } from "@fortawesome/free-solid-svg-icons";
library.add(faCopy);

const app = createApp(App);
app.use(VueQueryPlugin);
app.use(WagmiPlugin, { config: wagmiConfig });
app.use(ToastPlugin, { position: "top" });

app.component("icon", FontAwesomeIcon);

app.mount("#app");
