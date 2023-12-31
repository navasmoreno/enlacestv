import { createApp } from 'vue'
import App from './App.vue'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUpRightFromSquare,faDesktop,faThumbsUp,faThumbsDown } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faUpRightFromSquare);
library.add(faDesktop);
library.add(faThumbsUp);
library.add(faThumbsDown);

import '../node_modules/bulma/css/bulma.min.css'
require('./style/main.scss');

createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')
