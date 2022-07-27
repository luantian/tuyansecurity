<template>
<div class="base-screen-wrap">
  <div class="big-screen-box">
    <div class="screen-header header">智慧消防大屏监控中心</div>
    <div class="content">
      <div class="left" :style="`transform: scale(${height}); transform-origin: 0px 0px;`">
        <div class="iot-access-box iot-access">
          <div class="module-title">物联接入1111</div>
          <div class="statistic-card-box top-content">
            <!---->
            <div class="card-content-wrap">
              <!-- <img src="./img/wl.png" class="card-icon rect-icon"> -->
              <div class="card-detail">
                <div class="detail-top">
                  <div class="detail-top-aside">
                    设备接入数
                    <span title="26" class="cur">
                      26
                    </span></div>
                  <div class="detail-compare up">
                    本月新接入
                    <span title="1" class="compare-value">
                      1
                    </span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="bottom-content-box">
            <div class="bottom-content">
              <div class="item">
                <p title="电气火灾监控系统" class="label">
                  电气火灾监控系统
                </p>
                <p title="2" class="value">
                  2
                </p>
              </div>
              <div class="item">
                <p title="独立式烟感系统" class="label">
                  独立式烟感系统
                </p>
                <p title="13" class="value">
                  13
                </p>
              </div>
              <div class="item">
                <p title="火灾报警系统" class="label">
                  火灾报警系统
                </p>
                <p title="2" class="value">
                  2
                </p>
              </div>
              <div class="item">
                <p title="可燃气体系统" class="label">
                  可燃气体系统
                </p>
                <p title="3" class="value">
                  3
                </p>
              </div>
              <div class="item">
                <p title="消防水系统" class="label">
                  消防水系统
                </p>
                <p title="3" class="value">
                  3
                </p>
              </div>
              <div class="item">
                <p title="视频监控系统" class="label">
                  视频监控系统
                </p>
                <p title="3" class="value">
                  3
                </p>
              </div>
              <div class="item">
                <p title="充电桩系统" class="label">
                  充电桩系统
                </p>
                <p title="0" class="value">
                  0
                </p>
              </div>
              <div class="item">
                <p title="其他系统" class="label">
                  其他系统
                </p>
                <p title="0" class="value">
                  0
                </p>
              </div>
            </div>
          </div>
          <div class="access-data-trend">
            <lineChart name="设备数" title="近30天物联接入趋势" graphNameId="deviceLineChart"></lineChart>
          </div>
        </div>
        <div class="ops-status-box ops-status">
          <div class="module-title">运维状态</div>
          <div class="device-status-list">
            <div class="device-status-item"><img src="./img/lx.png" class="icon-type">
              <div class="device-num-box">
                <div class="num-content"><span class="device-name">
                    离线设备
                  </span>
                  <div title="14" class="device-num">
                    14
                    <span class="unit">
                      个
                    </span></div>
                </div>
                <div class="progress-box">
                  <div class="progress-bar-warp">
                    <div class="progress-bar" style="width: 100%;">
                      <div class="active-bar" style="width: 53.85%;"></div>
                      <div class="ball" style="left: 53.85%;"></div>
                    </div>
                    <div class="value">53.85%</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="device-status-item"><img src="./img/gz.png" class="icon-type">
              <div class="device-num-box">
                <div class="num-content"><span class="device-name">
                    故障设备
                  </span>
                  <div title="0" class="device-num">
                    1
                    <span class="unit">
                      个
                    </span></div>
                </div>
                <div class="progress-box">
                  <div class="progress-bar-warp">
                    <div class="progress-bar" style="width: 100%;">
                      <div class="active-bar" style="width: 6%;"></div>
                      <div class="ball" style="left: 6%;"></div>
                    </div>
                    <div class="value">6.00%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="device-status-list">
            <div class="device-status-item"><img src="./img/ddl.png" class="icon-type">
              <div class="device-num-box">
                <div class="num-content"><span class="device-name">
                    低电量设备
                  </span>
                  <div title="14" class="device-num">
                    9
                    <span class="unit">
                      个
                    </span></div>
                </div>
                <div class="progress-box">
                  <div class="progress-bar-warp">
                    <div class="progress-bar" style="width: 100%;">
                      <div class="active-bar" style="width: 33.85%;"></div>
                      <div class="ball" style="left: 33.85%;"></div>
                    </div>
                    <div class="value">33.85%</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="device-status-item"><img src="./img/qf.png" class="icon-type">
              <div class="device-num-box">
                <div class="num-content"><span class="device-name">
                    待续费设备
                  </span>
                  <div title="0" class="device-num">
                    0
                    <span class="unit">
                      个
                    </span></div>
                </div>
                <div class="progress-box">
                  <div class="progress-bar-warp">
                    <div class="progress-bar" style="width: 100%;">
                      <div class="active-bar" style="width: 0%;"></div>
                      <div class="ball" style="left: 0%;"></div>
                    </div>
                    <div class="value">0.00%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="fault-distribution">
            <div class="fault-title">
              各系统故障设备数
            </div>
            <PieChart></PieChart>
            <!-- <div class="fault-pie-box">
              <div class="chart-box fault-pie">
                <div id="falut-pie" class="chart-content" _echarts_instance_="ec_1631092103761" style="-webkit-tap-highlight-color: transparent; user-select: none; position: relative;">
                  <div style="position: relative; width: 386px; height: 182px; padding: 0px; margin: 0px; border-width: 0px; cursor: default;"></div>
                  <div style="position: absolute; display: none; border-style: solid; white-space: nowrap; z-index: 9999999; transition: left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s; background-color: rgba(50, 50, 50, 0.7); border-width: 0px; border-color: rgb(51, 51, 51); border-radius: 4px; color: rgb(255, 255, 255); font: 14px / 21px sans-serif; padding: 5px; left: 104px; top: 45px; pointer-events: none;">电气火灾监控系统: 0</div>
                </div><img src="https://www.hikfirecloud.com/web/static/img/pie_inner.324e0449.png" class="circle-rate rotate-in"><img src="https://www.hikfirecloud.com/web/static/img/pie_inner.324e0449.png" class="circle-rate rotate-out">
              
              </div>
            </div> -->
          </div>
        </div>
        <div class="ai-analysis-box ai-analysis" v-if="0">
          <div class="module-title">AI分析</div>
          <div class="analysis-data-list">
            <div class="analysis-data-item">
              <div class="title">
                通道占用
              </div>
              <div class="sub-data-list">
                <div class="sub-data-item"><img src="https://www.hikfirecloud.com/web/static/img/camera_monitoring.1fda79cd.png">
                  <div class="sub-content">
                    <p title="通道占用覆盖数" class="name">
                      通道占用覆盖数
                    </p>
                    <p class="value"><span title="0" class="number">
                        0
                      </span>
                      路
                    </p>
                  </div>
                </div>
                <div class="sub-data-item"><img src="https://www.hikfirecloud.com/web/static/img/channel_occupancy.051c8012.png">
                  <div class="sub-content">
                    <p title="近30天检测通道占用数" class="name">
                      近30天检测通道占用数
                    </p>
                    <p class="value"><span title="0" class="number">
                        0
                      </span>
                      次
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="analysis-data-item">
              <div class="title">
                消控室离岗
              </div>
              <div class="sub-data-list">
                <div class="sub-data-item"><img src="https://www.hikfirecloud.com/web/static/img/camera_monitoring.1fda79cd.png">
                  <div class="sub-content">
                    <p title="消控室离岗覆盖数" class="name">
                      消控室离岗覆盖数
                    </p>
                    <p class="value"><span title="0" class="number">
                        0
                      </span>
                      路
                    </p>
                  </div>
                </div>
                <div class="sub-data-item"><img src="https://www.hikfirecloud.com/web/static/img/staff_leave.5478713c.png">
                  <div class="sub-content">
                    <p title="近30天检测离岗数" class="name">
                      近30天检测离岗数
                    </p>
                    <p class="value"><span title="0" class="number">
                        0
                      </span>
                      次
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <centerMap></centerMap>
      <div class="center" v-if="0">

        <div class="map-box">
          <el-amap id="mapContainer" class="amap-container" ref="map" :events="map.events" vid="amap" :zoom="map.zoom" :resizeEnable="true" :center="map.position" :mapStyle="map.mapStyle">

          </el-amap>
          <div id="mapContainer" style="height: 100%; position: relative; background: rgb(16, 16, 47);" class="amap-container">
            <!-- <div class="amap-maps">
              <div class="amap-drags">
                <div class="amap-layers" style="transform: translateZ(0px);"><canvas class="amap-layer" width="1682" height="1498" style="width: 841px; height: 749px;"></canvas>
                  <div class="amap-markers">
                    <div class="amap-marker" style="top: 289px; left: 319px; z-index: 100; transform: rotate(0deg); transform-origin: 44px 62px; display: block;">
                      <div class="amap-marker-content" style="opacity: 1;">
                        <div class="res-marker marker-company">
                          <img src="https://www.hikfirecloud.com/web/static/img/marker_base_company.7a8273d9.png">
                          <span class="company-title" title="智慧消防运营平台">
                            智慧消防运营平台
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="amap-marker" style="top: 303px; left: 366px; z-index: 100; transform: rotate(0deg); transform-origin: 55px 41.5px; display: block;">
                      <div class="amap-marker-content" style="opacity: 1;">
                        <div class="res-marker marker-unit level-1">
                          <div class="unit-title">
                            <span title="消防业务中心">消防业务中心</span>
                          </div>
                          <div class="unit-systems">
                            <i class="marker-icon sys-500002"></i><i class="marker-icon sys-500005"></i>
                          </div>
                          <div class="res-unit-icon"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="amap-overlays"></div>
              </div>
            </div>
            <div style="display: none;"></div>
            <div class="amap-controls"></div><a class="amap-logo"><img src="https://webapi.amap.com/theme/v1.3/logo@2x.png"></a>
            <div class="amap-copyright" style="display: none; visibility: hidden;">
              © 2021 AutoNavi <span class="amap-mcode"></span></div> -->
          </div>
          <div class="map-bottom"></div>
        </div>
      </div>
      <div class="right" :style="`transform: scale(${height}); transform-origin: 100% 0px;`">
        <div class="ops-result-box ops-result">
          <div class="module-title">运营成效</div>
          <!---->
          <div class="unit-access-box">
            <div class="statistic-card-box">
              <div class="card-title">
                单位接入
              </div>
              <div class="card-content-wrap">
                <!-- <img src="https://www.hikfirecloud.com/web/static/img/unit_access.d13ae845.png" class="card-icon rect-icon"> -->
                <div class="card-detail">
                  <div class="detail-top">
                    <div class="detail-top-aside">
                      单位接入数
                      <span title="16" class="cur">
                        16
                      </span></div>
                    <div class="detail-compare up">
                      本月新接入
                      <span title="0" class="compare-value">
                        0
                      </span></div>
                  </div>
                  <div class="detail-bottom-list">
                    <div class="detail-bottom-item"><span title="重点单位" class="label">
                        重点单位
                      </span><span title="7" class="value">
                        7
                      </span></div>
                    <div class="detail-bottom-item"><span title="一般单位" class="label">
                        一般单位
                      </span><span title="7" class="value">
                        7
                      </span></div>
                    <div class="detail-bottom-item"><span title="九小单位" class="label">
                        九小单位
                      </span><span title="1" class="value">
                        1
                      </span></div>
                    <div class="detail-bottom-item"><span title="高层建筑" class="label">
                        高层建筑
                      </span><span title="1" class="value">
                        1
                      </span></div>
                    <div class="detail-bottom-item"><span title="出租屋" class="label">
                        出租屋
                      </span><span title="0" class="value">
                        0
                      </span></div>
                    <div class="detail-bottom-item"><span title="其他" class="label">
                        其他
                      </span><span title="0" class="value">
                        0
                      </span></div>
                  </div>
                  <!---->
                </div>
              </div>
            </div>
          </div>
          <div class="alarm-data-box">
            <div class="statistic-card-box">
              <div class="card-title">
                报警数据
              </div>
              <div class="card-content-wrap"><img src="./img/bj.png" class="card-icon">
                <div class="card-detail">
                  <div class="detail-top">
                    <div class="detail-top-aside">
                      近30天报警总数
                      <span title="35" class="cur">
                        35
                      </span></div>
                    <div class="detail-compare up">
                      本月新增
                      <span title="2" class="compare-value">
                        2
                      </span></div>
                  </div>
                  <!---->
                  <div class="detail-bottom-progress"><span class="label">
                      近30天报警处理率
                    </span>
                    <div class="progress-bar-warp progress-val">
                      <div class="progress-bar" style="width: 100%;">
                        <div class="active-bar" style="width: 88.57%;"></div>
                        <div class="ball" style="left: 88.57%;"></div>
                      </div>
                      <div class="value">88.57%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="alarm-unit-trend">
            <lineChart name="报警数" title="近30天单位接入报警发生趋势图" graphNameId="alarmUnitTrend"></lineChart>
          </div>
          <div class="unit-satety-top10">
            <div class="unit-safety-box">
              <div class="safety-title">
                近30天单位报警TOP10
              </div>
              <div class="safety-data-box">
                <div class="safety-data-list">
                  <div class="safety-data-item"><span class="index top">
                      1
                    </span><span title="图研消防" class="label">
                      图研消防
                    </span><span title="32" class="value">
                      32
                    </span></div>
                  <div class="safety-data-item"><span class="index top">
                      2
                    </span><span title="大润发超市" class="label">
                      大润发超市
                    </span><span title="2" class="value">
                      2
                    </span></div>
                  <div class="safety-data-item"><span class="index top">
                      3
                    </span><span title="青岛理工大学" class="label">
                      青岛理工大学
                    </span><span title="1" class="value">
                      1
                    </span></div>
                </div>
                <div class="safety-data-list"></div>
              </div>
            </div>
          </div>
          <div class="auth-used-box">
            <div class="auth-used-statistics">
              <div class="auth-title">
                授权使用统计(已使用/总数)
              </div>
              <div class="auth-data-list">
                <div class="auth-data-item"><img src="./img/dh.png" class="auth-icon">
                  <div class="auth-content">
                    <div class="content-top"><span title="语音" class="label">
                        语音
                      </span><span title="8 / 5000 (个)" class="value">
                        8 / 5000 (个)
                      </span></div>
                    <div class="content-progress">
                      <div class="progress-bar-warp">
                        <div class="progress-bar gradient-bar" style="width: 100%;">
                          <div class="active-bar gradient" style="width: 0%;"></div>
                          <!---->
                        </div>
                        <!---->
                      </div>
                    </div>
                  </div>
                </div>
                <div class="auth-data-item"><img src="./img/dx.png" class="auth-icon">
                  <div class="auth-content">
                    <div class="content-top"><span title="短信" class="label">
                        短信
                      </span><span title="47 / 5000 (个)" class="value">
                        47 / 5000 (个)
                      </span></div>
                    <div class="content-progress">
                      <div class="progress-bar-warp">
                        <div class="progress-bar gradient-bar" style="width: 100%;">
                          <div class="active-bar gradient" style="width: 0%;"></div>
                          <!---->
                        </div>
                        <!---->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="work-efficiency">
            <div class="work-efficiency-box">
              <div class="work-title">
                工作效率
              </div>
              <div class="card-box-container">
                <div class="card-title">
                  近30天
                </div>
                <div class="card-box-item">
                  <div class="card-item-order"><span class="item-label">
                      工单总数
                    </span>
                    <span class="item-value">
                      87
                    </span></div>
                  <div class="card-item-order"><span class="item-label">
                      逾期工单数
                    </span>
                    <span class="item-value">
                      3
                    </span></div>
                  <div class="card-item-order"><span class="item-label">
                      已完成工单数
                    </span>
                    <span class="item-value">
                      85
                    </span></div>
                  <div class="card-item-order"><span class="item-label">
                      巡检异常数
                    </span>
                    <span class="item-value">
                      5
                    </span></div>
                    <div class="card-item-order"><span class="item-label">
                      维保完成数
                    </span>
                    <span class="item-value">
                      60
                    </span></div>
                  <div class="card-item-order"><span class="item-label">
                      工单完成率
                    </span>
                    <div class="progress-bar-warp progress">
                      <div class="progress-bar" style="width: 100%;">
                        <div class="active-bar" style="width: 87%;"></div>
                        <div class="ball" style="left: 87%;"></div>
                      </div>
                      <div class="value">87%</div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import centerMap from "./map";
import lineChart from "./lineChart.vue";
import PieChart from "./PieChart";
export default {
  components: {
    centerMap,
    lineChart,
    PieChart
  },
  data() {
    return {
      height: document.body.clientHeight / 1080
    }
  },
}
</script>

<style lang="scss" scoped>
@import "./index.css";

.base-screen-wrap {
  font-family: segoe UI, PingFang SC, Microsoft Yahei, arial, Helvetica, "sans-serif";
  line-height: 1.428;
  font-weight: 500;
}
</style>
