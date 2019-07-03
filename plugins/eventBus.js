import Vue from 'vue'
export const eventBus = new Vue()
Vue.prototype.$eventBus = eventBus
