import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/style/theme/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import {get, post, down } from './utils/request.js'
import db from './utils/localstorage.js'
import "./utils";
import '@/icons' // icon
//import '@/permission' // permission control
import './assets/css/main.scss'
import vSelect from './components/v-select';
import "./assets/css/animate.min.css";
import VueAMap from 'vue-amap'; // 高德
import Video from 'video.js';
import 'video.js/dist/video-js.css';
import "./styles/dark.scss"; // 主题色
import "./styles/element_tree.scss" // 为覆盖element-tree样式
VueAMap.initAMapApiLoader({ //高德地图
    key: '620026d422fce709e901b1614fbda344',
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.DistrictSearch', 'AMap.MapType', ],
    v: '1.4.4'
});
import 'echarts-liquidfill';
Vue.use(VueAMap);

//import echarts from 'echarts'
const echarts = require("echarts")
Vue.prototype.$echarts = echarts
Vue.prototype.$video = Video //引入Video播放器
Vue.component('vSelect', vSelect)
Vue.use(ElementUI)
    /**
     * If you don't want to use mock-server
     * you want to use MockJs for mock api
     * you can execute: mockXHR()
     *
     * Currently MockJs will be used in the production environment,
     * please remove it before going online ! ! !
     */
window.log = console.log
Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$down = down;

Vue.prototype.$db = db;
Vue.prototype.$bus = Vue.observable({ user: db.get('user') || {}, baseUrl: process.env.VUE_APP_BASE_API, warnInfo: [] })

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})