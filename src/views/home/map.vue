<template>
  <div id="mapContainer"
       :class="`amp ${isWaring?'waring':'none'} home-map amap-container`"
       :style="`visibility: ${showMap?'initial':'hidden'}`">

    <el-amap ref="map"
             class="amap-box"
             :events="events"
             vid="amap"
             :zoom="zoom"
             :resizeEnable="true"
             :center="position"
             :mapStyle="mapStyle">
      <el-amap-marker v-if="isWaring"
                      :events="warnEvent"
                      vid="component-marker"
                      :position="position"
                      :icon="icon"
                      :animation="'AMAP_ANIMATION_BOUNCE'"></el-amap-marker>
      <el-amap-marker v-if="!isWaring"
                      v-for="item in markers"
                      :key="item.unit_id"
                      class="res-marker marker-company"
                      vid="component-marker"
                      :events="item.loca"
                      :position="item.position">
        <div class="marker-wrap center normal">
          <i class="icon-marker el-icon-school"
             v-if="!item.dr_unit_count"></i>
          <span v-if="item.dr_unit_count">{{item.dr_unit_count}}</span>
        </div>
      </el-amap-marker>
      <el-amap-marker :zIndex="99999"
                      :visible="item.showmod"
                      v-for="item in markers"
                      :key="item.unit_name"
                      :offset="[20, 320]"
                      :position="item.position">
        <div class="amap-info">
          <div style="position: absolute; bottom: 0px; left: 0px;">
            <div class="bottom-center amap-info-contentContainer">
              <div class="resource-info-wrap">
                <div class="unit-info-warp"
                     id="unitMapWindow">
                  <div class="info-title"
                       :title="item.dr_unit_name">{{item.dr_unit_name}}</div>
                  <div class="info-content-wrap">
                    <div class="info-row">
                      <div class="name">今日报警</div>
                      <div class="content">{{nowUnitInfo.dr_today_notice_count}}个</div>
                    </div>
                    <div class="info-row">
                      <div class="name">未处理报警</div>
                      <div class="content">{{nowUnitInfo.dr_notice_count}}个</div>
                    </div>
                    <div class="info-row">
                      <div class="name">设备总数</div>
                      <div class="content">{{nowUnitInfo.dr_device_count}}个</div>
                    </div>
                    <div class="info-row">
                      <div class="name">离线设备</div>
                      <div class="content">{{nowUnitInfo.dr_device_online_count}}个</div>
                    </div>
                    <div class="info-row">
                      <div class="name">故障设备</div>
                      <div class="content">{{nowUnitInfo.dr_device_gz_count}}个</div>
                    </div>
                    <div class="info-row mt10">
                      <div class="name">消防负责人</div>
                      <div class="content">{{nowUnitInfo.dr_duty_name}}</div>
                    </div>
                    <div class="info-row">
                      <div class="name">联系电话</div>
                      <div class="content">{{nowUnitInfo.dr_duty_phone}}</div>
                    </div>
                    <div class="info-row">
                      <div class="name">详细地址</div>
                      <div class="content"
                           :title="nowUnitInfo.dr_province_name+nowUnitInfo.dr_city_name+nowUnitInfo.dr_area_name+nowUnitInfo.dr_address">{{nowUnitInfo.dr_province_name+nowUnitInfo.dr_city_name+nowUnitInfo.dr_area_name+nowUnitInfo.dr_address}}</div>
                    </div>
                  </div>
                  <!-- <div class="actions center">
                    <div class="action"
                         @click="unit_detail(nowUnitInfo.dr_unit_id,nowUnitInfo.dr_unit_key)"
                         v-if="$bus.user.dr_is_admin!=='commonly'">单位详情</div>
                    <div class="action"
                         @click="alarm_history(nowUnitInfo.dr_unit_id)">历史报警</div>
                  </div> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-amap-marker>

    </el-amap>
    <Message @warn="warn"
             ref="msg"
             :type="'alert'" />
  </div>
</template>

<script>
import Message from '@/components/message/index'
import icon from './img/dian.png';

import {
  formatDateTime
} from '@/utils/index'
export default {
  components: {
    Message
  },

  data () {
    return {
      position: [126.53505, 45.802981],
      mapStyle: 'amap://styles/darkblue',
      zoom: 13,
      showMap: false,
      icon: icon,
      componentMarker: {
        position: [121.5273285, 31.21315058]
      },
      isWaring: false,
      devList: [],
      markers: [
        // {
        //   position: [120.391562, 36.155431],
        //   unit_name: '消防业务中心',
        //   unit_id: 1,
        //   showmod: false
        // },
        // {
        //   position: [120.380952, 36.159331],
        //   unit_name: '图研消防',
        //   unit_id: 2,
        //   showmod: false
        // },
      ],
      nowUnitInfo: {},
      events: {
        moveend: (val) => {
          this.getDev()
        },
        complete: () => {
          this.showMap = true
          this.getDev()
        },
        click: (e) => {
          for (let key in this.markers) {
            this.markers[key].showmod = false
          }
          return false
        },
        zoomchange: (val) => {
          this.getDev()
        }
      },
      warnEvent: {
        click: () => {
          this.showDetail()
        }
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
    isWaring (val) {
      this.zoom = val ? 18 : 13;
    },
  },
  mounted () {
    // this.markers.map((it, index) => {
    //   it.loca = {
    //     click: () => {
    //       for (let key in this.markers) {
    //         this.markers[key].showmod = false
    //       }
    //       this.markers[index].showmod = true;
    //     },
    //   }
    // })


  },
  methods: {
    getUnitDetail (id) {
      this.$get(`/v1/dr/unit-detail/${id}/2`).then(res => {
        this.nowUnitInfo = res.data
      })
    },
    showDetail () {
      this.handle()
      this.$emit('showDetail', this.$bus.warnInfo[0])
    },
    unit_detail (unit_id, unit_key) {
      window.open(`/#/alert?unit_id=${unit_id}&unit_key=${unit_key}`)
    },
    alarm_history () {
      window.open('/#/equipment/noticeList')
    },
    warn (data) {
      for (let i = 0; i < this.$bus.warnInfo.length; i++) {
        const el = this.$bus.warnInfo[i];
        if (el.dr_notice_uuid == data.dr_notice_uuid) {
          return
        }
      }
      this.position = [+data.dr_notice_unit_detail.dr_lng, +data.dr_notice_unit_detail.dr_lat]
      this.isWaring = true;
      this.$bus.warnInfo.unshift({
        ...data,
        ...data.dr_notice_unit_detail
      })

      this.$emit('warn', data)
    },
    handle () {
      this.$refs.msg.endWarning()
      this.isWaring = false;
    },
    goUnit (data) {//指向某单位
      this.zoom = 16
      this.position = [+data.dr_lng, +data.dr_lat]

    },
    getDev () {
      let center = this.$refs.map ? this.$refs.map.$$getCenter() : this.position
      let zoom = this.$refs.map ? this.$refs.map.$$getInstance().getZoom() : this.zoom
      let test = {
        "dr_lat": "36.101503",
        "dr_lng": "120.36249",
        "dr_zoom": 10
      }
      this.$post('/v1/dr/map-zoom-list',
        {
          dr_zoom: zoom,
          dr_lat: center[1] + '',
          dr_lng: center[0] + ''
        }
      ).then(res => {
        this.devList = res.data
        var arr = [];
        res.data.map((item, index) => {
          var obj = {};
          // item.lon = '120.36173';
          // item.lat = '36.082949'
          obj.position = [Number(item.dr_lng), Number(item.dr_lat)];
          obj.showmod = false
          if (item.dr_unit_count) {
            obj.dr_unit_count = item.dr_unit_count
          }
          obj.dr_unit_name = item.dr_unit_name;
          obj.loca = {
            click: (e) => {
              for (let key in this.markers) {
                this.markers[key].showmod = false
              }
              this.markers[index].showmod = true;
              this.getUnitDetail(item.dr_unit_id)
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
      }).catch(err => {

      })
    },
  }
}
</script>

<style lang="scss">
.amp,
.amap-box {
  width: 100%;
  height: 100%;

  .icon-marker {
    font-size: 18px;
    color: #fff;
    margin: 0;
  }
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

.amap-logo,
.amap-copyright {
  display: none !important;
}

.waring .amap-icon {
  img {
    width: 40px;
  }
}
#unitMapWindow {
  padding: 0px 35px 35px 35px;
  background: #06151c;
  .info-title {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    font-weight: 700;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .info-row {
    display: flex;
    line-height: 25px;
    font-size: 14px;
    .name {
      width: 110px;
      padding-right: 40px;
      text-align: right;
    }
    .content {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 190px;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
    }
  }
}
</style>
