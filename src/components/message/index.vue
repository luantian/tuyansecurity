<template>
<div>
  <audio src="./warning.mp3" ref="mp3" id="warningMp3" muted autoplay></audio>
</div>
</template>

<script>
var wsUrl = 'wss://xf.tyict.com.cn/dr-notice' //'wss://fac.hochance.net:61443/dr-notice' //'wss://fac.hochance.net/dr-notice'
export default {
  props:['type'],
  components: {},
  computed: {

  },
  data() {
    return {
      info: {}, //警报详情
      ws: null,
      heartCheck: null,
      showbjList: false,
      user: {}
    }
  },
  mounted() {
    
    this.$refs.mp3.muted = true
    this.$refs.mp3.volume = 0

    document.getElementById("app").onclick = f;

    function f() {
      me.$refs.mp3.volume = 1
      me.$refs.mp3.muted = false
      me.$refs.mp3.muted = true
      me.$refs.mp3.volume = 0
      document.getElementById("app").onclick = '';
    }
    if(!this.$bus.user.dr_is_push_socket){
      return
    }
    var lockReconnect = false; //避免重复连接
    var me = this;
    var ws;

    this.user = this.$bus.user || {}
    if (this.user.dr_user_id) {
      createWebSocket(); // 创建websocket

    }

    function createWebSocket() {
      try {
        me.ws = new WebSocket(wsUrl);
        websocketInit();
      } catch (e) {
        log('catch');
        websocketReconnect(wsUrl);
      }
    }

    function websocketInit() {
      // 建立 web socket 连接成功触发事件
      me.ws.onopen = function (evt) {
        onOpen(evt);
        me.ws.send(JSON.stringify({
          dr_ws_id: ''+me.user.dr_ws_id,
          dr_duty_id:''+me.user.dr_user_id
        }));
      };
      // 断开 web socket 连接成功触发事件
      me.ws.onclose = function (evt) {
        websocketReconnect(wsUrl);
        onClose(evt);
      };
      // 接收服务端数据时触发事件
      me.ws.onmessage = function (evt) {
        onMessage(evt);
      };
      // 通信发生错误时触发
      me.ws.onerror = function (evt) {
        websocketReconnect(wsUrl);
        onError(evt);
      };
    }

    function onOpen(evt) {
      log("建立链接");
      //心跳检测重置
      if (!me.heartCheck.isStart) {
        me.heartCheck.start();
      }
    }

    function onClose(evt) {

    }

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
          console.log(e);
        }

      }
      //拿到任何消息都说明当前连接是正常的
      me.heartCheck.start();
    }

    function websocketReconnect(url) {
      if (lockReconnect) { // 是否已经执行重连
        return;
      }
      lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      tt && clearTimeout(tt);
      var tt = setTimeout(function () {
        createWebSocket(url);
        lockReconnect = false;
      }, 5000);
    }

    //心跳检测
    me.heartCheck = {
      timeout: 40000,
      timeoutObj: null,
      serverTimeoutObj: null,
      isStart: false,
      start: function () {
        var self = this;
        this.isStart = true;
        this.timeoutObj && clearTimeout(this.timeoutObj);
        this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
        this.timeoutObj = setTimeout(function () {
          //发送测试信息，后端收到后，返回一个消息，
          me.ws.send(JSON.stringify({
            dr_ws_id: me.user.dr_ws_id,
            dr_duty_id:''+me.user.dr_user_id
          }));
          self.serverTimeoutObj = setTimeout(function () {
            me.ws.close();
          }, self.timeout);
        }, this.timeout)
      }
    };

    function onError(evt) {
      log('通信错误：' + evt.data);
    }

  },
  beforeDestroy() { //销毁时清除心跳和websoket
    clearTimeout(this.heartCheck.timeoutObj)
    clearTimeout(this.heartCheck.serverTimeoutObj)
    this.ws.close();
    window.location.reload()
  },
  created() {
    //log(this.$db.get('user').dr_user_id)
    //log(this.$route)
    // if (this.$route.name == 'alert') {
    //   this.type = 'alert'
    // } else {
    //   this.type = 'default'
    // }
  },
  methods: {
    getMessage(data) {
      console.log('收到',data)
      try {
        if (data) {
          //console.log(this.type,this.$route);
          this.startWarning()
          if (this.type == 'alert'||this.$route.name == 'alert') {
            this.$emit('warn', data)
          } else {
            this.$notify({
              title: '提示',
              message: `${data.dr_notice}`,
              type: 'warning',
              duration: 0,
              onClose:()=>{
                this.endWarning()
              }
            });
          }
          
        }
      } catch (error) {
        console.log(error);
      }

    },
    endWarning() {
      this.$refs.mp3.currentTime = 0;
      this.$refs.mp3.volume = 0; //声音大小
      this.$refs.mp3.muted = true
    },
    startWarning() { //开始警报
      this.$refs.mp3.play()
      this.$refs.mp3.currentTime = 0;
      this.$refs.mp3.volume = 1; //声音大小
      this.$refs.mp3.muted = false
      // let mp3 = document.getElementById('warningMp3')
      // mp3.currentTime = 0;
      // mp3.volume = 1; //声音大小
      // mp3.muted = false
      // mp3.play()
      //this.$refs.mp3.play()

    }
  },
}
</script>
