<!--
 * @Author: your name
 * @Date: 2022-07-26 21:40:37
 * @LastEditTime: 2022-08-12 15:05:02
 * @LastEditors: your name
 * @Description: 
-->
<template>
  <div class="base-screen-wrap"
       v-loading="loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">

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
          <div class="join_item_num">{{info['unite-count'] || 0}}</div>
        </div>
      </div>
      <div class="screen_join_right screen_join_item">
        <img src="./img/bg143.png"
             alt="" />
        <div class="join_item_des">
          <div class="join_item_title">本月新增</div>
          <div class="join_item_num">{{info['unite-count-now'] || 0}}</div>
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
                68
              </div>
            </div>
            <div class="wl_module_item">
              <div class="wl_module_item_title">
                独立式烟感系统
              </div>
              <div class="wl_module_item_num">
                345
              </div>
            </div>
            <div class="wl_module_item">
              <div class="wl_module_item_title">
                独立式烟感系统
              </div>
              <div class="wl_module_item_num">
                78
              </div>
            </div>
            <div class="wl_module_item">
              <div class="wl_module_item_title">
                可燃气体系统
              </div>
              <div class="wl_module_item_num">
                61
              </div>
            </div>
          </div>
          <div style="color:#fff; font-size: 16px">近30天物联接入趋势</div>
          <!-- <line-chart class="line_area"
                      graphNameId="wl"
                      title="近30天物联接入趋势"></line-chart> -->
          <div id="wl_line" ></div>
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
        <centerMap></centerMap>
        <!-- <el-amap id="mapContainer" class="amap-container" ref="map" :events="map.events" vid="amap" :zoom="map.zoom" :resizeEnable="true" :center="map.position" :mapStyle="map.mapStyle">

          </el-amap> -->
        <!-- <el-amap class="amap-box"
                 v-show="show"
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
        </el-amap> -->
      </div>
      <!-- 地图 end -->

      <!-- 大屏右侧 start -->
      <div class="screen_right">
        <div class="screen_right_top screen_right_item">
          <div class="screen_little_title">
            报警统计
          </div>
          <vue-seamless-scroll :class-option="defaultOption">
            <ul class="bj_module">
              <li class="bj_module_item odd">
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
              </li>
              <li class="bj_module_item even">
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
              </li>
              <li class="bj_module_item odd">
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
              </li>
              <li class="bj_module_item even">
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
              </li>
              <li class="bj_module_item odd">
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
              </li>
              <li class="bj_module_item even">
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
              </li>
            </ul>
          </vue-seamless-scroll>

          <!-- <line-chart class="line_area"
                      graphNameId="wl"
                      title="近30天报警趋势"></line-chart> -->
          <div style="color:#fff; font-size: 16px;">近30天报警趋势</div>
          <div id="baojingLine"></div>
        </div>
        <div class="screen_right_bottom screen_right_item">
          <div class="screen_little_title">
            巡查统计
          </div>
          <div class="screen_right_bottom_item">
            <!-- 柱状图 -->
            <div class="zjt"
                 id="zjt">

            </div>
            <div class="tongji">
              <div class="tongji_title">授权使用统计</div>
              <div class="tongji_content">
                <div class="tongji_content_item item1">
                  <div class="content">
                    <div class="title">语音</div>
                    <div class="num">
                      <span class="num1">7/</span>
                      <span class="num2">5000</span>
                    </div>
                    <div class="pre">
                      <div class="pre_in"
                           :style="{'width': '10px'}"></div>
                    </div>
                  </div>
                </div>
                <div class="tongji_content_item item2">
                  <div class="content">
                    <div class="title">短信</div>
                    <div class="num">
                      <span class="num1">0/</span>
                      <span class="num2">5000</span>
                    </div>
                    <div class="pre">
                      <div class="pre_in"
                           :style="{'width': '0px'}"></div>
                    </div>
                  </div>
                </div>
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
import vueSeamlessScroll from 'vue-seamless-scroll'
export default {
  components: {
    centerMap,
    lineChart,
    PieChart,
    vueSeamlessScroll
  },
  computed: {
    defaultOption () {
      return {
        step: 0.2, // 数值越大速度滚动越快
        limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
      }
    }

  },
  data () {
    return {
      height: document.body.clientHeight / 1080,
      icon: icon,
      show: true,
      loading: false,
      info: {

      }
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
          hoverAnimation: false,
          emphasis: {
            disabled: false
          },
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
      piechart.setOption(option);
      window.addEventListener('resize', function () {
        //宽度自适应
        piechart.resize();
      });
    },
    getData () {
      this.loading = true
      this.$get('/v1/dr/in-big-screen-count').then(res => {
        console.log(res);
        if (res.code == 200) {
          for (let key in res.data) {
            this.$set(this.info, key, res.data[key])
          }
        }
        this.setywPie();
        this.setwulianLine();
        this.setbaojingLine();
        this.setBar()
        this.loading = false

      }).catch(err => {
        console.log(err);
        this.$$message.info(err);
        this.loading = fail
      })
    },
    setBar () {
      let barProChart = this.$echarts.init(document.getElementById(`zjt`));
      let options = {
        legend: {//图例组件，颜色和名字
          left: 'center',
          top: 0,
          itemGap: 16,
          itemWidth: 8,
          itemHeight: 8,
          data: [{
            name: '已完成',
          },
          {
            name: '未完成',
          }],
          textStyle: {
            color: '#ffffff',
            fontStyle: 'normal',
            fontFamily: 'PingFangSC-Regular',
            fontSize: 12,
          }
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: true,//坐标轴两边留白
            data: ['7/17', '7/22', '7/27', '08/01', '08/06', '08/11', '08/14'],
            axisLabel: { //坐标轴刻度标签的相关设置。
              interval: 0,//设置为 1，表示『隔一个标签显示一个标签』
              margin: 15,
              textStyle: {
                color: '#ffffff',
                fontStyle: 'normal',
                fontFamily: 'PingFangSC-Regular',
                fontSize: 12,
              }
            },
            axisTick: {//坐标轴刻度相关设置。
              show: false,
            },
            axisLine: {//坐标轴轴线相关设置
              lineStyle: {
                color: '#0A4E85',
                width: 1
              }
            },
            splitLine: { //坐标轴在 grid 区域中的分隔线。
              show: false,
            }
          },

        ],
        yAxis: [
          {
            type: 'value',
            splitNumber: 4,  // Y轴分割数
            axisLine: {
              show: true,
              lineStyle: {
                color: '#0A4E85',
                width: 1
              }
            },
            axisLabel: {
              color: '#ffffff'
            },
            splitLine: {
              lineStyle: {
                color: '#0A4E85',
                opacity: 0.5
              }
            }
          }
        ],
        series: [
          {
            name: '已完成',
            type: 'bar',
            data: [35, 45, 95, 80, 110, 80, 100],
            barWidth: 7,
            barGap: 0,//柱间距离
            itemStyle: {//图形样式
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0, color: '#00D0C9'
                },
                {
                  offset: 0.7, color: '#094854'
                }], false),
              },
            },
          },
          {
            name: '未完成',
            type: 'bar',
            data: [35, 35, 28, 20, 40, 30, 40],
            barWidth: 7,
            barGap: 0.5,//柱间距离
            itemStyle: {//图形样式
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0.8, color: '#EE6408'
                },
                {
                  offset: 1, color: '#094854'
                }], false),
              },
            },
          }
        ]
      };
      barProChart.setOption(options);
      window.addEventListener('resize', function () {
        //宽度自适应
        barProChart.resize();
      });
    },
    setwulianLine () {
      var line_ChartPro = this.$echarts.init(document.getElementById(`wl_line`));
      let options = {
        xAxis: {
          type: 'category',
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#0A4E85',
              width: 1
            }
          },
          axisLabel: {
            color: '#ffffff',
            fontSize: "12px",
            fontFamily: 'PingFangSC-Regular'
          },
          data: ['7/17', '7/18', '7/19', '7/20', '7/21', '7/22', '7/23', '7/24', '7/25', '7/26', '7/27', '7/28']
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#0A4E85',
              width: 1
            }
          },
          axisLabel: {
            color: '#ffffff'
          },
          splitLine: {
            lineStyle: {
              color: '#0A4E85',
              opacity: 0.5
            }
          }
        },
        series: [
          {
            data: [50, 30, 60, 40, 90, 120, 50, 30, 60, 40, 90, 120],
            type: 'line',
            smooth: true,
            symbol: 'none',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0, color: '#169DAE ' // 0% 处的颜色
                }, {
                  offset: 1, color: '#4CFB9B ' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }
        ]
      };
      line_ChartPro.setOption(options);
      window.addEventListener('resize', function () {
        //宽度自适应
        line_ChartPro.resize();
      });
    },
    setbaojingLine () {
      let bjline_ChartPro = this.$echarts.init(document.getElementById(`baojingLine`));
      let options = {
        xAxis: {
          type: 'category',
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#0A4E85',
              width: 1
            }
          },
          axisLabel: {
            color: '#ffffff',
            fontSize: "12px",
            fontFamily: 'PingFangSC-Regular'
          },
          data: ['7/17', '7/18', '7/19', '7/20', '7/21', '7/22', '7/23',]
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#0A4E85',
              width: 1
            }
          },
          axisLabel: {
            color: '#ffffff'
          },
          splitLine: {
            lineStyle: {
              color: '#0A4E85',
              opacity: 0.5
            }
          }
        },
        series: [
          {
            data: [50, 30, 60, 40, 90, 120, 50],
            type: 'line',
            smooth: true,
            symbol: 'none',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0, color: '#169DAE ' // 0% 处的颜色
                }, {
                  offset: 1, color: '#4CFB9B ' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }
        ]
      };
      bjline_ChartPro.setOption(options);
      window.addEventListener('resize', function () {
        //宽度自适应
        bjline_ChartPro.resize();
      });
    },
    lineChart (data, name, unit) {
      let serve = {
        name: '',
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
        data: [],
        smooth: !0,
      };
      let servers = [];
      data.y.map((it) => {
        let obj = { ...serve };
        obj.name = it.name;
        obj.data = it.data;
        servers.push(obj);
      });
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
              formatter: '{value}' + unit,
              color: 'rgba(255,255,255,0.40)',
              interval: 2,
            },
          },
        ],
        series: servers,
        color: color,
      };

      this.chart = this.$echarts.init(document.getElementById('lineChart'));
      this.chart.setOption(option, !0);
    }
  },
  mounted () {
    console.log(icon);
    // setTimeout(() => {
    //   this.show = true
    // }, 2000)
    this.getData()

  },
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
