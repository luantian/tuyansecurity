import {
    constantRoutes
} from '@/router'
import Layout from '@/layout' // 动态加载路由需要

import {
    getToken
} from '@/utils/auth'

/**
 * 递归转换通过API获取的用户权限菜单
 * @param asyncRouterMap 通过API获取的用户权限菜单
 */

function dynamicLoadComponent(asyncRouterMap) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (route.component) {
            if (route.component === 'Layout') { // Layout组件特殊处理
                route.component = Layout
            } else {
                // 加上try...catch可以解决路由指向的资源文件不存在时界面无法加载的情况
                try {
                    const component = route.component
                    route.component = resolve => require(['@/view' + component], resolve)
                } catch (e) {
                    console.log('component load exception: ' + route.component)
                    route.component = null
                }
            }
        }
        if (route.children && route.children.length) {
            route.children = dynamicLoadComponent(route.children)
        }
        return true
    })
    return accessedRouters
}

const state = {
    routes: [],
    addRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    }
}

const actions = {
    // generateRoutes({
    //   commit
    // }) {
    //   return new Promise(resolve => {
    //     const token = getToken()
    //     asyncRoutes({
    //       token
    //     }).then(response => {
    //       const accessedRoutes = dynamicLoadComponent(response.Data || [])
    //       commit('SET_ROUTES', accessedRoutes)
    //       resolve(accessedRoutes)
    //     })
    //   })
    // }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}