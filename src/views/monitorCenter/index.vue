<!--
 * @Author: your name
 * @Date: 2022-07-26 21:40:37
 * @LastEditTime: 2022-08-07 10:21:30
 * @LastEditors: your name
 * @Description: 
-->
<template>
  <div class="base-screen-wrap">
    <div class="screen-header header">
      <!-- 智慧消防大屏监控中心 -->
    </div>
    <!-- 接入情况 start -->
    <div class="screen_join">
      <div class="screen_join_left screen_join_item">
        <img src="./img/bg142.png"
             alt="" />
        <div class="join_item_des">
          <div class="join_item_title">单位接入数</div>
          <div class="join_item_num">169</div>
        </div>
      </div>
      <div class="screen_join_right screen_join_item">
        <img src="./img/bg143.png"
             alt="" />
        <div class="join_item_des">
          <div class="join_item_title">本月新增</div>
          <div class="join_item_num">5</div>
        </div>
      </div>
    </div>
    <!-- 接入情况 end -->
    <div class="screen_main">
      <!-- 大屏左侧 start -->
      <div class="screen_left">
        <div class="screen_left_top screen_left_item">
          <div class="screen_little_title">
            物联接入
          </div>
          <div class="wl_module">
            <div class="wl_module_item">
              <div class="wl_module_item_title">
                电气火灾监控系统
              </div>
              <div class="wl_module_item_num">
                1268
              </div>
            </div>
            <div class="wl_module_item">
              <div class="wl_module_item_title">
                独立式烟感系统
              </div>
              <div class="wl_module_item_num">
                3456
              </div>
            </div>
            <div class="wl_module_item">
              <div class="wl_module_item_title">
                独立式烟感系统
              </div>
              <div class="wl_module_item_num">
                782
              </div>
            </div>
            <div class="wl_module_item">
              <div class="wl_module_item_title">
                可燃气体系统
              </div>
              <div class="wl_module_item_num">
                611
              </div>
            </div>
          </div>
          <line-chart class="line_area"
                      graphNameId="wl"
                      title="近30天物联接入趋势"></line-chart>
        </div>
        <div class="screen_left_bottom screen_left_item">
          <div class="screen_little_title">
            运维状态
          </div>
          <div class="yw_module">
            <div class="yw_module_item item1">
              <div class="left">
                <div class="yw_module_item_num">
                  23
                </div>
                <div class="yw_module_item_title">
                  离线设备
                </div>
              </div>
              <div class="right"></div>
            </div>
            <div class="yw_module_item item2">
              <div class="left">
                <div class="yw_module_item_num">
                  115
                </div>
                <div class="yw_module_item_title">
                  故障设备
                </div>
              </div>
              <div class="right"></div>
            </div>
            <div class="yw_module_item item3">
              <div class="left">
                <div class="yw_module_item_num">
                  217
                </div>
                <div class="yw_module_item_title">
                  低电量设备
                </div>
                <div class="right"></div>
              </div>
            </div>
            <div class="yw_module_item item4">
              <div class="left">
                <div class="yw_module_item_num">
                  671
                </div>
                <div class="yw_module_item_title">
                  待续费设备
                </div>
                <div class="right"></div>
              </div>
            </div>
          </div>
          <div class="yw_title">
            各系统故障设备
          </div>
          <div class="yw_pie"
               id="yw_pie"></div>
        </div>
      </div>
      <!-- 大屏左侧 end -->

      <!-- 地图 start -->
      <div class="screen_map">
        <el-amap class="amap-box"
                 v-show="show"
                 :resizeEnable="true"
                 :center="[123.472188,41.706918]"
                 :position="[123.472188,41.706918]"
                 :vid="'amap-vue'"
                 zoom="18"
                 :mapStyle="'amap://styles/darkblue'">
          <el-amap-marker vid="component-marker"
                          :position="[123.472188,41.7069185]"
                          :icon="icon"
                          :animation="'AMAP_ANIMATION_BOUNCE'"></el-amap-marker>
          <el-amap-marker vid="component-marker"
                          :position="[123.472188,41.708]"
                          :icon="icon"
                          :animation="'AMAP_ANIMATION_BOUNCE'"></el-amap-marker>
          <el-amap-marker vid="component-marker"
                          :position="[123.462188,41.71]"
                          :icon="icon"
                          :animation="'AMAP_ANIMATION_BOUNCE'"></el-amap-marker>
          <el-amap-marker vid="component-marker"
                          :position="[123.483,41.71]"
                          :icon="icon"
                          :animation="'AMAP_ANIMATION_BOUNCE'"></el-amap-marker>
        </el-amap>
      </div>
      <!-- 地图 end -->

      <!-- 大屏右侧 start -->
      <div class="screen_right">
        <div class="screen_right_top screen_right_item">
          <div class="screen_little_title">
            报警统计
          </div>
          <div class="bj_module">
            <div class="bj_module_item odd">
              <div class="left">
                <div class="bj_module_item_id id1">01</div>
                <div class="bj_module_item_name">万象城</div>
                <div class="bj_module_item_category">（一般单位）</div>
              </div>
              <div class="right">
                <div class="bj_module_item_icon">
                  <img src="./img/alarm.png"
                       alt="">
                </div>
                <div class="bj_module_item_num">78</div>
              </div>
            </div>
            <div class="bj_module_item even">
              <div class="left">
                <div class="bj_module_item_id id2">02</div>
                <div class="bj_module_item_name">万达广场</div>
                <div class="bj_module_item_category">（重点单位）</div>
              </div>
              <div class="right">
                <div class="bj_module_item_icon">
                  <img src="./img/alarm.png"
                       alt="">
                </div>
                <div class="bj_module_item_num">65</div>
              </div>
            </div>
            <div class="bj_module_item odd">
              <div class="left">
                <div class="bj_module_item_id id3">03</div>
                <div class="bj_module_item_name">家乐福</div>
                <div class="bj_module_item_category">（高层建筑）</div>
              </div>
              <div class="right">
                <div class="bj_module_item_icon">
                  <img src="./img/alarm.png"
                       alt="">
                </div>
                <div class="bj_module_item_num">34</div>
              </div>
            </div>
            <div class="bj_module_item even">
              <div class="left">
                <div class="bj_module_item_id id4">04</div>
                <div class="bj_module_item_name">人民医院</div>
                <div class="bj_module_item_category">（一般单位）</div>
              </div>
              <div class="right">
                <div class="bj_module_item_icon">
                  <img src="./img/alarm.png"
                       alt="">
                </div>
                <div class="bj_module_item_num">28</div>
              </div>
            </div>
            <div class="bj_module_item odd">
              <div class="left">
                <div class="bj_module_item_id id5">05</div>
                <div class="bj_module_item_name">华润万象</div>
                <div class="bj_module_item_category"> （一般单位）</div>
              </div>
              <div class="right">
                <div class="bj_module_item_icon">
                  <img src="./img/alarm.png"
                       alt="">
                </div>
                <div class="bj_module_item_num">21</div>
              </div>
            </div>
            <div class="bj_module_item even">
              <div class="left">
                <div class="bj_module_item_id id6">06</div>
                <div class="bj_module_item_name">恒隆广场</div>
                <div class="bj_module_item_category">（高层建筑）</div>
              </div>
              <div class="right">
                <div class="bj_module_item_icon">
                  <img src="./img/alarm.png"
                       alt="">
                </div>
                <div class="bj_module_item_num">17</div>
              </div>
            </div>
          </div>

          <line-chart class="line_area"
                      graphNameId="wl"
                      title="近30天报警趋势"></line-chart>
        </div>
        <div class="screen_right_bottom screen_right_item">
          <div class="screen_little_title">
            巡查统计
          </div>
          <div class="screen_right_bottom_item">
            <!-- 柱状图 -->
            <div class="zjt">

            </div>
            <div class="tongji">
              <div class="tongji_title">授权使用统计</div>
              <div class="tongji_content">
                <div class="tongji_content_item item1"></div>
                <div class="tongji_content_item item2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 大屏右侧 end -->
    </div>
  </div>

</template>

<script>
import centerMap from "./map";
import lineChart from "./lineChart.vue";
import PieChart from "./PieChart";
import icon from './img/lvdian.png'
export default {
  components: {
    centerMap,
    lineChart,
    PieChart
  },
  data () {
    return {
      height: document.body.clientHeight / 1080,
      icon: icon,
      show: true
    }
  },
  methods: {
    setywPie () {
      var data = [
        '电气火灾监控系统',
        '独立式烟感系统',
        '视频监控系统',
        '火灾报警系统',
        '消防水系统',
        '可燃气体系统',
        '其他系统'
      ]
      var dat = [{
        "value": 10
      }]
      let option = {
        title: {
          subtext: '5780',
          text: '   总数',
          left: '50%',
          top: '30%',
          textStyle: {
            fontSize: 16,
            fontWeight: 'normal',
            color: '#FFFFFF',
            fontFamily: 'Alibaba PuHuiTi'
          },
          subtextStyle: {
            fontSize: 28,
            fontWeight: 'normal',
            align: "center",
            color: '#FFFFFF',
            fontFamily: 'Roboto Condensed'
          },
        },
        legend: {
          show: true,
          orient: 'vertical',
          left: 'left',
          top: 'middle',
          icon: 'circle',
          itemWidth: 20,
          itemHeight: 12,
          itemGap: 9,
          data: data,
          textStyle: {
            color: "#fff",
            fontSize: "12px",
            fontFamily: 'PingFang SC'
          },
        },
        series: [{
          type: 'pie',
          radius: [50, 80],
          // color: ['#004568'],
          center: ['60%', '50%'],
          itemStyle: {
            color: '#004568',
            opacity: 0.6,
            borderColor: '#000001'
          },
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false
            }
          },
          data: dat
        },
        {
          type: 'pie',
          radius: [60, 70],
          center: ['60%', '50%'],
          color: ['#364EC4', '#1162CD', '#0D6DC6 ', '#149CCF ', '#02BABC', '#07C35E', '#C66C1C'],
          itemStyle: {
            normal: {
              borderWidth: 3,
              borderColor: '#000001',
              // shadowBlur: 880,
              // shadowColor: 'red',
            },
          },
          data: [{
            value: 27,
            name: '电气火灾监控系统'
          },
          {
            value: 30,
            name: '独立式烟感系统'
          },
          {
            value: 24,
            name: '视频监控系统'
          },
          {
            value: 27,
            name: '火灾报警系统'
          },
          {
            value: 27,
            name: '消防水系统'
          },
          {
            value: 27,
            name: '可燃气体系统'
          },
          {
            value: 27,
            name: '其他系统'
          },

          ],
          label: {
            normal: {
              show: false,
            }
          }
        }
        ]
      };
      let piechart = this.$echarts.init(document.getElementById('yw_pie'))
      piechart.setOption(option)
    }
  },
  mounted () {
    console.log(icon);
    // setTimeout(() => {
    //   this.show = true
    // }, 2000)
    this.setywPie()
  }
}
</script>

<style lang="scss" >
@import './index.scss';

.base-screen-wrap {
  font-family: segoe UI, PingFang SC, Microsoft Yahei, arial, Helvetica,
    'sans-serif';
  line-height: 1.428;
  font-weight: 500;
}
</style>
