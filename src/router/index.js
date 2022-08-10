import Vue from "vue";
import Router from "vue-router";
import db from "../utils/localstorage.js";
import Qs from "qs";
import getPageTitle from "@/utils/get-page-title";

Vue.use(Router);

/* Layout */
//import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index"),
    hidden: true,
    meta: { noNav: true },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/404"),
    hidden: true,
  },
  {
    path: "/home",
    name: "home1",
    component: () => import("@/views/home/index"),
    // meta: { noNav: true, hidden: true }
  },
  {
    path: "/",
    name: "home",
    component: () => import("@/views/business/groupBusiness/index"),
    // children: [{
    //   path: 'dashboard',
    //   name: 'Dashboard',
    //   component: () => import('@/views/dashboard/index'),
    //   meta: { title: '首页', icon: 'dashboard' }
    // }]
  },
  {
    path: "/groupBusiness",
    name: "GroupBusiness",
    component: () => import("@/views/business/groupBusiness/index"),
    meta: { title: "集团业务", icon: "table" },
  },
  {
    path: "/groupBusinessDetail",
    name: "GroupBusinessDetail",
    component: () => import("@/views/business/groupBusiness/detail"),
    meta: { title: "设备详情", icon: "table" },
    hidden: true,
  },
  {
    path: "/personalBusiness",
    name: "PersonalBusiness",
    component: () => import("@/views/business/personalBusiness/index"),
    meta: { title: "个人业务", icon: "table" },
  },
  {
    path: "/equipment/equipmentManagement",
    name: "EquipmentManagement",
    component: () =>
      import("@/views/equipment/equipmentManagement/modules/group"),
    meta: { title: "设备管理", icon: "table" },
  },
  {
    path: "/equipment/noticeList",
    name: "NoticeList",
    component: () => import("@/views/equipment/noticeList/index"),
    meta: { title: "报警日志", icon: "table" },
  },
  {
    path: "/equipment/fire",
    name: "equipmentfire",
    component: () => import("@/views/equipment/fire/index"),
    meta: { title: "消防设施配置", icon: "table" },
  },
  {
    path: "/polling",
    name: "polling",
    component: () => import("@/views/polling/index"),
    meta: { title: "巡查配置", icon: "table" },
  },
  {
    path: "/polling/logs",
    name: "polling/logs",
    component: () => import("@/views/polling/logs/index"),
    meta: { title: "巡查日志", icon: "table" },
  },
  {
    path: "/point",
    name: "point",
    component: () => import("@/views/equipment/point/index"),
    meta: { title: "点位图配置", icon: "table" },
  },
  {
    path: "/work",
    name: "work",
    component: () => import("@/views/work/index"),
    meta: { title: "巡检工单", icon: "table" },
  },
  {
    path: "/check",
    name: "check",
    component: () => import("@/views/home/check"),
    // meta: { title: '日常检查', noNav: true, hidden: true }
    meta: { title: "日常检查" },
  },
  {
    path: "/area/areaManagement",
    name: "AreaManagement",
    component: () => import("@/views/area/areaManagement/index"),
    meta: { title: "区域管理", icon: "table" },
  },
  {
    path: "/area/areaOperation",
    name: "AreaOperation",
    component: () => import("@/views/area/areaOperation/index"),
    meta: { title: "区域运营管理员", icon: "table" },
  },
  {
    path: "/roles/rolesManagement",
    name: "RolesManagement",
    component: () => import("@/views/roles/rolesManagement/index"),
    meta: { title: "角色管理", icon: "table" },
  },
  {
    path: "/roles/menuManagement",
    name: "MenuManagement",
    component: () => import("@/views/roles/menuManagement/index"),
    meta: { title: "菜单管理", icon: "table" },
  },
  // {
  //     path: '/alert',
  //     component: () =>
  //         import ('@/views/alert/index'),
  //     name: 'alert',
  //     // hidden: true,
  //     meta: { noNav: true, hidden: false }
  // },
  {
    path: "/monitorCenter",
    component: () => import("@/views/monitorCenter/index"),
    name: "monitorCenter",
    // hidden: true,
    meta: { noNav: true, hidden: false },
  },
  {
    path: "/electricity",
    component: () => import("@/views/wulian/electricity/index"),
    name: "electricity",
    // hidden: true,
    // meta: { noNav: true, hidden: false }
  },
  {
    path: "/water",
    component: () => import("@/views/wulian/water/index"),
    name: "water",
    // hidden: true,
    // meta: { noNav: true, hidden: false }
  },
  {
    path: "/video",
    component: () => import("@/views/alert/video"),
    name: "video",
    // hidden: true,
    // meta: { noNav: true, hidden: false }
  },
  {
    path: "/hazardousGoods",
    component: () => import("@/views/hazardousGoods/index"),
    name: "hazardousGoods",
    // hidden: true,
    // meta: { noNav: true, hidden: false }
  },
  {
    path: "/alarm",
    component: () => import("@/views/alarm/index"),
    name: "alarm",
    // hidden: true,
    // meta: { noNav: true, hidden: false }
  },

  {
    path: "/wx-bind",
    name: "wx-bind",
    component: () => import("@/views/wx-bind/index"),
    meta: { title: "绑定微信", noNav: true, hidden: true },
  },
  // 404 page must be placed at the end !!!
  //{ path: '*', redirect: '/404', hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

router.beforeEach((to, form, next) => {
  //document.title = getPageTitle(to.meta.title)
  let user = Vue.prototype.$bus.user;
  let token = user.token || null;
  if (!token && to.path != "/login" && to.path != "/wx-bind") {
    next("/login");
  } else {
    next();
  }
});

export default router;
