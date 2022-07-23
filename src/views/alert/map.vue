<template>
<!-- <div :class="`amp ${isWaring?'waring':'none'}`" :style="`visibility: ${showMap?'initial':'hidden'}`">
  <div class="bj-box" v-if="isWaring">
    <div class="f16"> <i class="el-icon-warning" style="color: red"></i> 警报</div>
    <div class="mt10 f14">{{$bus.warnInfo[0].dr_notice}}</div>
    <div class="mt10 f14">报警时间：{{$bus.warnInfo[0].time}}</div>
    <div class="center mt20">
      <el-button size="mini" v-if="$bus.warnInfo[0].dr_ys_token" type="primary" @click="showVideo($bus.warnInfo[0])">查看监控</el-button>
      <el-button size="mini" type="primary" @click="handle">关闭报警</el-button>
    </div>
  </div>
  <el-amap ref="map" class="amap-box" :events="events" vid="amap" :zoom="zoom" :resizeEnable="true" :center="position" :mapStyle="mapStyle">
    <el-amap-marker v-if="isWaring" vid="component-marker" :position="position" :icon="icon" :animation="'AMAP_ANIMATION_BOUNCE'"></el-amap-marker>
    <el-amap-marker v-if="!isWaring" :icon="icon" v-for="(item, index) in markers" :position="item.position" :events="item.loca" :animation="item.animate ? 'AMAP_ANIMATION_BOUNCE' : 'AMAP_ANIMATION_NONE'"></el-amap-marker>
    <el-amap-text :zIndex="99999" :visible="item.showmod" v-for="item in markers" :text="item.text" :offset="[0, 10]" :position="item.position"></el-amap-text>
  </el-amap>
  <Message @warn="warn" ref="msg" :type="'alert'" />
  <el-dialog :close-on-click-modal="false" title="视频监控" :visible.sync="showVideoDia" width="600px">
    <div v-if="nowVideo.dr_ys_token">
      <iframe :src="`https://open.ys7.com/ezopen/h5/iframe?url=ezopen://open.ys7.com/${nowVideo.dr_ys_device[0].dr_device_serial}/1.live&autoplay=1&accessToken=${nowVideo.dr_ys_token}`" width="100%" height="400" id="ysOpenDevice" allowfullscreen>
      </iframe>
    </div>
  </el-dialog>

</div> -->
<div class="bim-box center bim-bg">
  <!-- <img src="@/assets/img/bim.jpg" style="height: 100%;"> -->
  <!-- <iframe src="https://www.qutgroup.com/fcweb/demo/#/home/water" width="100%" height="100%" allowfullscreen></iframe> -->
</div>
</template>

<script>
import icon from './img/dian.png';
import Message from '@/components/message/index'
import {
  formatDateTime
} from '@/utils/index'
export default {
  components: {
    Message
  },

  data() {
    return {
      position: [126.53505,45.802981],
      mapStyle: 'amap://styles/darkblue',
      zoom: 10,
      showMap:false,
      icon: icon,
      componentMarker: {
        position: [121.5273285, 31.21315058]
      },
      isWaring: false,
      devList: [],
      markers: [],
      events: {
        moveend: (val) => {
          this.getDev()
        },
        complete: () => {
          this.getDev()
          this.showMap = true
        }
        // zoomchange:(val)=>{
        //   console.log(val);
        // }
      },
      showVideoDia: false,
      nowVideo: {}
      //warnInfo:[]
    }
  },
  watch: {
    // bjList(val) {
    //     this.position = [val[0].lon, val[0].lat];
    // },
    isWaring(val) {
      this.zoom = val ? 18 : 13;
    },
  },
  mounted() {

  },
  methods: {
    showVideo(data) {
      this.nowVideo = data
      this.showVideoDia = true
    },
    getDev() {
      let center = this.$refs.map ? this.$refs.map.$$getCenter() : this.position
      let zoom = this.$refs.map ? this.$refs.map.$$getInstance().getZoom() : this.zoom
      let test = {
        "dr_lat":"36.155331",
  "dr_lng":"120.381552",
  "dr_zoom":10

      }
      this.$post('/v1/dr/map-zoom-list', test
      // {
      //   dr_zoom: zoom,
      //   dr_lat: center[1] + '',
      //   dr_lng: center[0] + ''
      // }
      ).then(res => {
        this.devList = res.data
        var arr = [];
        res.data.map((item, index) => {
          var obj = {};
          // item.lon = '120.36173';
          // item.lat = '36.082949'
          obj.position = [Number(item.dr_lng), Number(item.dr_lat)];
          obj.showmod = false
          if(zoom<=10){
            obj.text = `<div>设备数量: <span>${item.dr_device_count}</span>  </div>`
          }else if(zoom>10){
            obj.text = `<div>设备ID: <span>${item.dr_id}</span></div>
                        <div>设备型号: <span>${item.dr_model}</span></div>`

          }
          
          obj.dr_unit_name = item.dr_unit_name;
          obj.loca = {
            click: (e) => {
              //this.markers[index].showmod = true;
            },
            mouseover: () => {
              this.markers[index].showmod = true;
            },
            mouseout: () => {
              this.markers[index].showmod = false;
            },
          }
          arr.push(obj);
        });
        this.markers = arr.map(it => {
          return {
            ...it,
            animate: false
          }
        });
        console.log(this.markers);
      }).catch(err => {

      })
    },
    // getDev(){
    //   //console.log(this.$refs.map.$getCenter());
    //   let center = this.$refs.map.$getCenter()
    //   let zoom = this.$refs.map.$getInstance().getZoom()
    //   this.$post('/v1/dr/map-zoom-list',{dr_zoom:zoom,dr_lat:center[1]+'',dr_lng:center[0]+''}).then(res=>{

    //   })
    // },
    warn(data) {
      //console.log(data);
      this.position = [+data.dr_notice_unit_detail.dr_lng, +data.dr_notice_unit_detail.dr_lat]
      this.isWaring = true;
      this.$bus.warnInfo.unshift({
        ...data,
        time: formatDateTime(Date.now())
      })
      this.$emit('warn', data)
    },
    handle() {
      this.$refs.msg.endWarning()
      this.isWaring = false;
    }
  }
}
</script>

<style lang="scss">
  .bim-bg{
    background: url(~@/assets/img/bim.jpg) no-repeat ;
    background-size: 100% 100%;
  }
.amp,
.amap-box {
  width: 100%;
  height: 100%;
}

.amap-overlay-text-container {
  color: #333;
  padding: 5px;
  line-height: 1.5;
  font-size: 12px;
}

.amp {
  position: relative;
}

.bj-box {
  background-color: rgba(0, 0, 0, .4);
  position: absolute;
  width: 250px;
  left: 20px;
  top: 20px;
  padding: 20px;
  z-index: 888;
  box-shadow: 0 0 20px rgba(255, 255, 255, .7) inset;
  border-radius: 8px;
  animation: waring .7s infinite;
  animation-direction: alternate;
}

@keyframes waring {
  from {
    box-shadow: 0 0 10px rgba(255, 255, 255, .4) inset;
  }

  to {
    box-shadow: 0 0 20px rgba(255, 255, 255, .7) inset;
  }
}

.amap-logo,
.amap-copyright {
  display: none !important;
}

.waring .amap-icon {
  img {
    width: 40px;
    // animation: mymove .7s infinite;
    // animation-direction: alternate;
  }

}

.none .amap-icon {
  img {
    width: 25px;
    // animation: mybig .7s infinite;
    // animation-direction: alternate;
  }

}

@keyframes mymove {
  from {
    transform: translateY(-20px)
  }

  to {
    transform: translateY(0px)
  }
}

@keyframes mybig {
  from {
    transform: scale(.8)
  }

  to {
    transform: scale(1.1)
  }
}

.amap-logo,
.amap-copyright {
  display: none !important;
}
.bim-box{
  height: 100%;
}
</style>
