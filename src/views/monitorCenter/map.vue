<!--
 * @Author: your name
 * @Date: 2022-08-12 14:10:14
 * @LastEditTime: 2022-08-17 09:34:24
 * @LastEditors: your name
 * @Description: 
-->
<template>
<div class="center">
  <div class="map-box" :style="`visibility: ${showMap?'initial':'hidden'}`">
    <el-amap id="mapContainer" ref="map" :rotateEnable="map.rotateEnable" :pitchEnable="map.pitchEnable" :zooms="map.zooms" :expandZoomRange="map.expandZoomRange" :viewMode="map.viewMode" :pitch="map.pitch" :rotation="map.rotation" :events="map.events" vid="amap" :zoom="map.zoom" :resizeEnable="map.resizeEnable" :center="map.center" :mapStyle="map.mapStyle">
      <el-amap-marker class="res-marker marker-company" vid="component-marker" :position="position">
        <div class="res-marker marker-company">
          <img :src="icon">
          <span class="company-title" title="智慧消防运营平台">
            智慧消防运营平台
          </span>
        </div>
      </el-amap-marker>

      <el-amap-marker class="res-marker marker-company" vid="component-marker1" :position="position1">
        <div class="res-marker marker-unit level-1">
          <div class="unit-title">
            <span title="消防业务中心">消防业务中心</span>
          </div>
          <div class="unit-systems">
            <i class="marker-icon sys-500002"></i><i class="marker-icon sys-500005"></i>
          </div>
          <div class="res-unit-icon"></div>
        </div>
      </el-amap-marker>
    </el-amap>
    <!-- <div class="map-bottom"></div> -->
  </div>

</div>
</template>

<script>
import icon from '@/assets/center/marker_base_company.7a8273d9.png';

export default {
  data() {
    return {
      showMap: false,
      position: [126.614853, 45.728073],
      // position: [45.728073, 126.614853],
      // position: [120.381562, 36.155431],
      // position1:[120.355298,36.0999],
      position1: [126.639079, 45.727954],
      icon: icon,
      map: {
        events: {
          complete: () => {
            this.showMap = true
          }
        },
        mapStyle: "amap://styles/darkblue",
        resizeEnable: true,
        rotateEnable: false,
        pitchEnable: false,
        zoom: 18,
        pitch: 60,
        rotation: 0,
        viewMode: "3D",
        expandZoomRange: true,
        zooms: [6, 19],
        // center: [120.355298,36.0999]
        center: [126.614853, 45.728073],
      }
    }
  },
}
</script>

<style lang="scss">
.el-vue-amap-container,
.el-vue-amap-container .el-vue-amap {
  height: 120%!important;
  bottom: 0;
  top: -20%;
}
</style>
