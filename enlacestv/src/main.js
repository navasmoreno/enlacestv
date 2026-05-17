import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import { faUpRightFromSquare, faDesktop, faThumbsUp, faThumbsDown, faArrowTurnUp, faSpinner, faRotateRight, faPlus, faTrash, faPencil, faPlay, faPause, faStop } from "@fortawesome/free-solid-svg-icons";
import { far, faCopyright } from "@fortawesome/free-regular-svg-icons";
import { fab, faGooglePay } from "@fortawesome/free-brands-svg-icons";

/* add icons to the library */
library.add(faUpRightFromSquare, faDesktop, faThumbsUp, faThumbsDown, faArrowTurnUp, faGooglePay, faCopyright, fab, far, faSpinner, faRotateRight, faPlus, faTrash, faPencil, faPlay, faPause, faStop);

import "../node_modules/bulma/css/bulma.min.css";
require("./style/main.scss");

//#region ROUTING
import { createRouter, createWebHistory } from "vue-router";
import Myheader from "./components/myheader.vue";
import Myfooter from "./components/myfooter.vue";

import Home from "./views/Home.vue";
import About from "./views/About.vue";
import Links from "./views/Links.vue";
import HowToUse from "./views/HowToUse.vue";
import NotFound from "./views/NotFound.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/howtouse", component: HowToUse },
  { path: "/links", component: Links },
  { path: "/:catchAll(.*)", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

//#endregion

const app = createApp(App);

// Initialize Pinia for state management
app.use(createPinia());

// Use router
app.use(router);

// Register components
app.component("font-awesome-icon", FontAwesomeIcon);
app.component("Myheader", Myheader);
app.component("Myfooter", Myfooter);

// Mount app
app.mount("#app");
