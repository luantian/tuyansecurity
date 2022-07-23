<template>
<div id="gss" class="flex">
  <bheader></bheader>
  <div class="main flex flex1">
    <div class="left animated fadeInLeft">
      <div class="l-b">
        <div class="component-container">
          <div class="component-title" @click="sendW">报警统计</div>
          <div class="bottom-line"></div>
          <l1 :info="info"></l1>
        </div>
      </div>
      <div class="l-b">
        <div class="component-container">
          <div class="component-title">设备状态</div>
          <div class="bottom-line"></div>
          <l2 ref="l2" :info="info"></l2>
        </div>
      </div>
      <div class="l-b">
        <div class="component-container">
          <div class="component-title">设备统计</div>
          <div class="bottom-line"></div>
          <l3 :info="info"></l3>
        </div>
      </div>
    </div>
    <div class="center" style="flex-direction: column;justify-content: space-between">
      <div class="component-container pd0" style="height:66%">
        <Bim :unit_key="unit_key" v-if="$bus.user.dr_is_admin!=='commonly'" @warn="newWarn" @showDetail="showDetail"></Bim>
        <cmap v-else ref="map" @warn="newWarn" @showDetail="showDetail"></cmap>
      </div>
      <div class="component-container animated fadeInUp" style="height:32%">
        <div class="component-title">异常报警列表（{{alarm_num || 0}}）</div>
        <div class="bottom-line"></div>
        <c1 ref="c1" :info="info" @showDetail="showDetail"></c1>
      </div>

    </div>
    <div class="right animated fadeInRight">
      <div class="l-b">
        <div class="component-container">
          <div class="component-title">项目概况</div>
          <div class="bottom-line"></div>
          <r1 :info="info"></r1>
        </div>
      </div>
      <div class="l-b">
        <div class="component-container">
          <div class="component-title">报警趋势</div>
          <div class="bottom-line"></div>
          <r2 :info="info"></r2>
        </div>
      </div>
      <div class="l-b">
        <div class="component-container">
          <div class="component-title">报警类型统计</div>
          <div class="bottom-line"></div>
          <r3 :info="info"></r3>
        </div>
      </div>
    </div>
  </div>
  <el-dialog :close-on-click-modal="false" title="视频监控" :visible.sync="showVideo" v-if="showVideo" width="80vw">
    <Videos />
  </el-dialog>
  <el-dialog :close-on-click-modal="false" title="报警详情" :visible.sync="showDia" v-if="showDia" :width="(nowUnit.dr_camera_url||nowUnit.dr_notice_point)?'1000px':'500px'" top="9vh" @close="$refs.detail.video.dispose()">
    <aDetail :nowUnit="nowUnit" @finish="handled" ref="detail"></aDetail>
  </el-dialog>
</div>
</template>

<script>
import Bim from './list/bim'
import bheader from './header.vue';
import l1 from './list/l1.vue'
import l2 from './list/l2.vue'
import l3 from './list/l3.vue'
import r1 from './list/r1.vue'
import r2 from './list/r2.vue'
import r3 from './list/r3.vue'
import c1 from './list/c1.vue'
import Videos from "./video.vue";
import cmap from '../home/map'
import aDetail from '../home/detail'

import $ from "jquery";
export default {
  components: {
    l1,
    l2,
    l3,
    r1,
    r2,
    r3,
    c1,
    Videos,
    bheader,
    Bim,
    cmap,
    aDetail
  },
  data() {
    return {
      time: '',
      info: {},
      showVideo: false,
      unit_key:this.$route.query.unit_key,
      showDia:false,
      nowUnit: {},
      alarm_num:0
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    newWarn(data) {
      this.getData()
    },
    handled() {
      this.showDia = false;
      this.$refs.map&&this.$refs.map.handle()
      this.getData()
    },
    showDetail(it) {
      this.nowUnit = {
        ...it
      }
      this.showDia = true
    },
    sendW() {
      this.$post('/v1/dr/dr-site-well-back', {
        "msg": {
          "at": 1623512348873,
          "imei": "868125051962542",
          "type": 1,
          "ds_id": "3200_0_5503",
          "value": 1,
          "dev_id": 680132959
        },
        "msg_signature": "0oF61Qt1D/R9euAxOEychA\u003d\u003d",
        "nonce": "uZdo\u0026yn9"
      })
    },
    getData() {
      this.$get('/v1/dr/in-map-count',{dr_unit_id:this.$route.query.unit_id}).then(res => {
        this.info = res.data
      })
      this.$post('/v1/dr/notice-list-count',{dr_notice_status:1}).then(res=>{
        this.alarm_num = res.data.count||0
      })
      this.$refs.c1&&this.$refs.c1.getList()
    },
    // warn(data) {
    //   this.$refs.c1.getWarn(data)
    //   this.getData()
    // },
    
    
  },
}
</script>>

<style lang="scss" scoped>
$bgColor:#11283b;
$textColor:#62eef8;
$def-textColor: #ccc;
$FontColor: #fff;
@import "../home/index.css";

.h-warp {
  position: relative;
  z-index: 2;
}

.head {
  height: 60px;
}

.left,
.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 10px;
  margin-right: 10px;
}

.l-b {
  width: 100%;
  height: 32%;
}

.pd0 {
  padding: 0 !important;
}

.center {
  flex: 2.5;
}

.component-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 12px;
  //background-color: #051c3a; //$bgColor;
  background-color: #1d273e;
  border: .085rem solid #426d89;
  box-shadow: 0 0 0.25rem rgba(19, 67, 139, 0.7);
  position: relative;

}

.component-container:after,
.component-container:before {
  display: block;
  width: 12px;
  height: 12px;
  content: " ";
  position: absolute;

}

.component-container:before {
  background: url(./img/component-rt.png) no-repeat center 100%;
  right: -2px;
  top: -1px;
}

.component-container:after {
  background: url(./img/component-lb.png) no-repeat center 100%;
  left: -2px;
  bottom: -1px;
}

.component-container .bottom-line {
  margin-top: 8px;
  margin-bottom: 5px;
  height: 1px;
  width: 100px;
  background: linear-gradient(to left, rgb(80, 80, 255, 0.2), #ccc);
}

// .h-title {
//   img {
//     height: 30px;
//     margin-right: 10px;
//   }

//   margin: 0 auto;
//   font-size: 22px;
//   line-height: 50px;
//   background: url(./img/nav3.png) center no-repeat;
//   background-size: contain;
// }
</style>
<style lang="scss">



</style>
