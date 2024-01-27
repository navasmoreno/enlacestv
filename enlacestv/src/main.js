import { createApp } from 'vue'
import App from './App.vue'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUpRightFromSquare, faDesktop, faThumbsUp, faThumbsDown, faArrowTurnUp } from '@fortawesome/free-solid-svg-icons'
import { fab,faGooglePay } from '@fortawesome/free-brands-svg-icons'

/* add icons to the library */
library.add(faUpRightFromSquare, faDesktop, faThumbsUp, faThumbsDown, faArrowTurnUp, faGooglePay,fab);

import '../node_modules/bulma/css/bulma.min.css'
require('./style/main.scss');

//#region ROUTING
import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Links from './views/Links.vue'
import HowToUse from './views/HowToUse.vue'
import NotFound from './views/NotFound.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/howtouse', component: HowToUse },
    { path: '/links', component: Links }
];
const router = createRouter({
    history: createWebHistory(),
    routes, // short for `routes: routes`
})
//#endregion

createApp(App)
    .use(router)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')
