import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { db } from '@/utils/localstorage'
import Vue from 'vue'
import qs from 'qs'

// create an axios instance
const service = axios.create({
    baseURL: '/', //process.env.VUE_APP_BASE_API,
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        let token = Vue.prototype.$bus.user.token || null
            // do something before request is sent
        if (token && (config.url != 'https://restapi.amap.com/v3/weather/weatherInfo')) {
            config.headers['token'] = token
        }
        config.headers['Content-Type'] = 'application/json;charset=UTF-8'
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

//response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        const res = response.data
            // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 200) {
            if (res.info == 'OK') {
                return res
            }
            if (res.msg) {
                Message({
                    message: res.msg,
                    type: 'error',
                    duration: 2 * 1000
                })
            }
            if (res.code == 501) {
                setTimeout(() => {
                    window.location.replace('/#/login')
                }, 2000)
            }
            return Promise.reject(res.msg || 'Error')
        } else {
            return res
        }

    },
    error => {
        //console.log('err' + error) // for debug
        /*Message({
          message: error.message,
          type: 'error',
          duration: 5 * 1000
        })*/
        return Promise.reject(error)
    }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        service.get(url, {
                params: params
            })
            .then(res => {

                res && resolve(res)
            })
            .catch(err => {
                err && reject(err)
            })
    })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params = {}, type) {
    return new Promise((resolve, reject) => {
        if (type == 1) { //query
            var http = service.post(url + '?' + qs.stringify({
                ...params
            }))
        } else { //json
            var http = service.post(url, params)
        }

        http.then(res => {
                res && resolve(res)
            })
            .catch(err => {
                err && reject(err)
            })
    })
}

export function down(url, name = '文件') {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: url,
            headers: {
                'token': Vue.prototype.$bus.user.token || null
            },
            responseType: 'blob'
        }).then((res) => {
            if (res.data.type == 'application/vnd.ms-excel') {
                if (!res) {
                    return
                }
                let url = window.URL.createObjectURL(res.data);
                let link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', name + '.xls');
                document.body.appendChild(link);
                link.click();
                this.$Notice.success({
                    title: '提示',
                    desc: '导出成功'
                });
            } else {
                this.$Notice.error({
                    title: '提示',
                    desc: '导出失败'
                })
            }
        })



        // service.get(url, {
        //     params: params
        //   })
        //   .then(res => {

        //     res && resolve(res)
        //   })
        //   .catch(err => {
        //     err && reject(err)
        //   })
    })
}