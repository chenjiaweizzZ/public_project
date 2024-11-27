import Vue from "vue";
import Vuex from "vuex"
import chat from "./modules/chat.js"
import tabs from "./modules/tabs.js"
 
Vue.use(Vuex);
 
 
export default new Vuex.Store({
    modules:{
        chat,
        tabs
    }
})