<template>
  <div class="flex line-wrap">
    <div v-for="item in dr_device_id" :key="item" class="line-item">
      <div :id="`line_${item}`" class="line_Charts"></div>
      <div class="center">{{ item }}设备号</div>
    </div>
  </div>
</template>

<script>
var wsUrl = 'wss://xf.tyict.com.cn/dr-notice'
var color = ['#aaa', '#5E8FFF'],
  ecolor = [
    [
      {
        offset: 0,
        color: 'rgba(41,255,206, 0.32)',
      },
      {
        offset: 1,
        color: 'rgba(83,255,233,0.00)',
      },
    ],
    [
      {
        offset: 0,
        color: 'rgba(44,141,254,0.32)',
      },
      {
        offset: 1,
        color: 'rgba(43,107,255,0.00)',
      },
    ],
  ]
import moment from 'moment'
export default {
  data() {
    return {
      list: {},
      chart: {},
      dr_device_id: [],
      ws: null,
      heartCheck:{}
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$get('/v1/dr/get-industrial-device').then((res) => {
        this.dr_device_id = Object.keys(res.data)
        this.list = res.data
        this.$nextTick(() => {
          this.dr_device_id.map((it) => {
            this.lineChart(
              {
                x: this.list[it].map((o) => {
                  return moment(o.dr_time * 1000).format('MM-DD HH:mm:ss')
                }),
                y: this.list[it].map((o) => {
                  return o.dr_concentration
                }),
              },
              it
            )
          })
          this.connect()
        })
      })
    },
    lineChart(data, id) {
      let serve = {
        name: id,
        type: 'line',
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'red',
              },
              {
                offset: 1,
                color: 'blue',
              },
            ],
          },
        },
        areaStyle: {
          color: new this.$echarts['graphic'].LinearGradient(
            0,
            0,
            0,
            1,
            ecolor[1]
          ),
        },
        itemStyle: {
          normal: {
            color: color[0],
            lineStyle: {
              color: color[0],
            },
          },
        },
        data: data.y,
        smooth: !0,
      }
      // let servers = []
      // data.y.map(it=>{
      //   let obj = {...serve}
      //   obj.name = it.name;
      //   obj.data = it.data
      //   servers.push(obj)
      // })
      let option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderWidth: '0',
          axisPointer: {
            type: 'shadow',
          },
          textStyle: {
            fontSize: 14,
            color: 'rgba(255,255,255,0.80)',
          },
        },
        legend: {
          show: false,
          icon: 'rect',
          orient: 'horizontal',
          right: 0,
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            color: 'rgba(255,255,255,0.70)',
          },
        },
        grid: {
          x: 20,
          x2: 20,
          y: 20,
          y2: 10,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: data.x,
          axisLabel: {
            show: !0,
            //interval: 13,
            fontSize: 12,
            color: 'rgba(255,255,255,0.40)',
          },
        },
        yAxis: [
          {
            type: 'value',
            minInterval: 1,
            min: 0,
            axisTick: {
              lineStyle: {
                width: 0,
              },
            },
            axisLine: {
              lineStyle: {
                width: 0,
              },
            },
            splitLine: {
              lineStyle: {
                width: 0,
              },
            },
            axisLabel: {
              formatter: '{value}',
              color: 'rgba(255,255,255,0.40)',
              interval: 2,
            },
          },
        ],
        dataZoom: [
          {
            type: 'inside',
            start: 96,
            end: 100,
          },
          {
            start: 0,
            end: 10,
          },
        ],
        series: serve,
        color: color,
      }
      this.chart[id] = this.$echarts.init(document.getElementById('line_' + id))
      this.chart[id].setOption(option, !0)
    },
    getMessage(data){
      console.log(data);
      this.list[data.drDeviceId].push({
        dr_concentration:data.drConcentration||0,
        dr_time:data.drUuid
      })
      this.chart[data.drDeviceId].setOption({
        xAxis: {
          data: this.list[data.drDeviceId].map(it=>{return  moment(it.dr_time * 1000).format('MM-DD HH:mm:ss')})
        },
        series :{
          data: this.list[data.drDeviceId].map((o) => {return o.dr_concentration})
        }
      })
    },
    connect() {
      var lockReconnect = false //避免重复连接
      var me = this
      var ws
      createWebSocket()
      function createWebSocket() {
        try {
          me.ws = new WebSocket(wsUrl)
          websocketInit()
        } catch (e) {
          log('catch')
          websocketReconnect(wsUrl)
        }
      }

      function websocketInit() {
        // 建立 web socket 连接成功触发事件
        me.ws.onopen = function (evt) {
          onOpen(evt)
          me.ws.send(
            JSON.stringify({
              "dr_device_id": me.dr_device_id
            })
          )
        }
        // 断开 web socket 连接成功触发事件
        me.ws.onclose = function (evt) {
          // websocketReconnect(wsUrl)
          onClose(evt)
        }
        // 接收服务端数据时触发事件
        me.ws.onmessage = function (evt) {
          onMessage(evt)
        }
        // 通信发生错误时触发
        me.ws.onerror = function (evt) {
          websocketReconnect(wsUrl)
          onError(evt)
        }
      }

      function onOpen(evt) {
        log('建立链接')
        //心跳检测重置
        if (!me.heartCheck.isStart) {
          me.heartCheck.start()
        }
      }

      function onClose(evt) {}

      function onMessage(evt) {
        if (evt.data === 'received') {
          //me.startWarning()
        } else {
          try {
            //！！这里接受消息 写东西
            //console.log(evt.data)
            //var data = eval('(' + evt.data + ')')
            var data = JSON.parse(evt.data)
            //console.log(data);
            me.getMessage(data)
          } catch (e) {
            console.log(e)
          }
        }
        //拿到任何消息都说明当前连接是正常的
        me.heartCheck.start()
      }

      function websocketReconnect(url) {
        if (lockReconnect) {
          // 是否已经执行重连
          return
        }
        lockReconnect = true
        //没连接上会一直重连，设置延迟避免请求过多
        tt && clearTimeout(tt)
        var tt = setTimeout(function () {
          createWebSocket(url)
          lockReconnect = false
        }, 5000)
      }

      //心跳检测
      me.heartCheck = {
        timeout: 40000,
        timeoutObj: null,
        serverTimeoutObj: null,
        isStart: false,
        start: function () {
          var self = this
          this.isStart = true
          this.timeoutObj && clearTimeout(this.timeoutObj)
          this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
          this.timeoutObj = setTimeout(function () {
            //发送测试信息，后端收到后，返回一个消息，
            me.ws.send(
              JSON.stringify({
                "dr_device_id": me.dr_device_id
              })
            )
            self.serverTimeoutObj = setTimeout(function () {
              me.ws.close()
            }, self.timeout)
          }, this.timeout)
        },
      }

      function onError(evt) {
        log('通信错误：' + evt.data)
      }
    },
  },
  beforeDestroy() {
    //销毁时清除心跳和websoket
    clearTimeout(this.heartCheck.timeoutObj)
    clearTimeout(this.heartCheck.serverTimeoutObj)
    this.ws.close()
  },
}
</script>

<style lang="scss" scoped>
.line_Charts {
  height: 400px;
  width: 100%;
}
.line-wrap {
  flex-wrap: wrap;
}
.line-item {
  width: 50%;
}
</style>