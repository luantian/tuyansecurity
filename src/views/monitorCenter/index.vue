<!--
 * @Author: your name
 * @Date: 2022-07-26 21:40:37
 * @LastEditTime: 2022-08-13 01:35:11
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
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
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
              </div>
              <div class="swiper-slide">
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
              </div>
            </div>
            <!-- 如果需要分页器 -->
            <div class="swiper-pagination"></div>
          </div>
          <div style="color:#fff; font-size: 16px"><img class="dian_img"
                 src="./img/diamond.png" />近30天物联接入趋势</div>
          <!-- <line-chart class="line_area"
                      graphNameId="wl"
                      title="近30天物联接入趋势"></line-chart> -->
          <div id="wl_line"></div>
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
            <img src="./img/diamond.png"
                 class="dian_img" /> 各系统故障设备
          </div>
          <div class="yw_pie"
               id="yw_pie"></div>
        </div>
      </div>
      <!-- 大屏左侧 end -->

      <!-- 地图 start -->
      <div class="screen_map">
        <centerMap></centerMap>
      </div>
      <!-- 地图 end -->

      <!-- 大屏右侧 start -->
      <div class="screen_right">
        <div class="screen_right_top screen_right_item">
          <div class="screen_little_title">报警统计
          </div>

          <ul class="bj_module">
            <vue-seamless-scroll :data="unitList"
                                 :class-option="defaultOption">
              <li class="bj_module_item odd"
                  v-for="(item, index) in unitList"
                  :key="index">
                <div class="left">
                  <div class="bj_module_item_id"
                       :class="{
                        'id1': index==0,
                        'id2': index==1,
                        'id3': index==2,

                       }">{{item.id}}</div>
                  <div class="bj_module_item_name">{{item.name}}</div>
                  <div class="bj_module_item_category">{{item.des}}</div>
                </div>
                <div class="right">
                  <div class="bj_module_item_icon">
                    <img src="./img/alarm.png"
                         alt="">
                  </div>
                  <div class="bj_module_item_num">{{item.num}}</div>
                </div>
              </li>

            </vue-seamless-scroll>
          </ul>

          <!-- <line-chart class="line_area"
                      graphNameId="wl"
                      title="近30天报警趋势"></line-chart> -->
          <div style="color:#fff; font-size: 16px;"><img class="dian_img"
                 src="./img/diamond.png" />近30天报警趋势</div>
          <div id="baojingLine"></div>
        </div>
        <div class="screen_right_bottom screen_right_item">
          <div class="screen_little_title">
            巡查统计
          </div>
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <div class="screen_right_bottom_item">
                  <!-- 柱状图 -->
                  <div class="zjt"
                       id="zjt">

                  </div>
                  <div class="tongji">
                    <div class="tongji_title"><img class="dian_img"
                           src="./img/diamond.png" />授权使用统计</div>
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
              <div class="swiper-slide">
                <div class="screen_right_bottom_item">
                  <div class="screen_right_bottom_title">
                    <img src="./img/diamond.png"
                         class="dian_img" />工作效率（近30天）
                  </div>
                  <!-- 工单 -->
                  <div class="gd_area">
                    <div class="gdTotalPie"
                         id="gdTotalPie">
                    </div>
                    <div class="gdcompletionPie"
                         id="gdcompletionPie">
                    </div>

                  </div>
                  <div class="wb_area">
                    <div class="wb_area_item">
                      <img src="./img/weibao.png" />
                      <div class="wb_area_item_title">维保完成数</div>
                      <div class="wb_area_item_num">352</div>
                    </div>
                    <div class="wb_area_item">
                      <img src="./img/xunjian.png" />
                      <div class="wb_area_item_title">巡检异常数</div>
                      <div class="wb_area_item_num">57</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 如果需要分页器 -->
            <div class="swiper-pagination"></div>
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
import vueSeamlessScroll from 'vue-seamless-scroll';
import 'swiper/dist/js/swiper'
import 'swiper/dist/css/swiper.css'
import Swiper from "swiper"
export default {
  components: {
    centerMap,
    lineChart,
    PieChart,
    vueSeamlessScroll,
    Swiper
  },
  computed: {
    defaultOption () {
      return {
        step: 0.2, // 数值越大速度滚动越快
        limitMoveNum: 3, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 1500 // 单步运动停止的时间(默认值1000ms)
      }
    }

  },
  data () {
    return {
      vshow: false,
      height: document.body.clientHeight / 1080,
      icon: icon,
      show: true,
      loading: false,
      info: {

      },
      unitList: [
        { id: '01', name: '万象城', des: '（一般单位）', num: 78 },
        { id: '02', name: '万达广场', des: '（重点单位）', num: 78 },
        { id: '03', name: '家乐福', des: '（高层建筑）', num: 78 },
        { id: '04', name: '人民医院', des: '（一般单位）', num: 78 },
        { id: '05', name: '华润万象', des: '（一般单位）', num: 78 },
        { id: '06', name: '恒隆广场', des: '（一般单位）', num: 78 },
      ]
    }
  },
  methods: {
    /**
     * 运维饼状图
     */
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
          type: 'scroll',
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
        this.setGDTotalPie();
        this.setGDcompletionPie()
        this.loading = false

      }).catch(err => {
        console.log(err);
        this.$message.info(err);
        this.loading = false
      })
    },
    /**
     * 统计柱状图
     */
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
      this.$nextTick(() => {
        barProChart.setOption(options);
      })

      window.addEventListener('resize', function () {
        //宽度自适应
        barProChart.resize();
      });
    },
    /**
     * 物联折线
     */
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
    /**
     * 报警折线
     */
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
      this.$nextTick(() => {
        bjline_ChartPro.setOption(options);
      })

      window.addEventListener('resize', function () {
        //宽度自适应
        bjline_ChartPro.resize();
      });
    },
    /**
     * 工单总数饼图
     */
    setGDTotalPie () {
      let GDTotalPie = this.$echarts.init(document.getElementById(`gdTotalPie`));
      let dataing = [{
        "name": "已完成",
        "value": 95,
        itemStyle: {
          normal: {
            color: {
              colorStops: [
                {
                  offset: 0.8,
                  color: '#00D7DF' // 0% 处的颜色
                }, {
                  offset: 1,
                  color: '#1AFFD1' // 100% 处的颜色
                }]
            },
          }
        }
      }, {
        "name": "逾期",
        "value": 5,
        itemStyle: {
          normal: {
            // borderWidth: -10,
            // borderColor: '#D06200',
            color: '#D06200',
            opacity: 0,

          }
        }
      }]
      let dataing1 = [{
        "name": "已完成",
        "value": 95,
        itemStyle: {
          normal: {
          }
        }
      }, {
        "name": "逾期",
        "value": 5,
        itemStyle: {
          normal: {
            borderWidth: 4,
            borderColor: '#D06200',
            color: '#D06200'
          }
        }
      }]
      let options = {
        color: ['#00D7DF', "transparent"],
        title: {
          text: '工单总数',
          subtext: '12431',
          textStyle: {
            color: '#c4cfd2',
            // fontSize: 20,
            fontSize: 13,
            align: 'center',
            verticalAlign: 'top',
            fontFamily: 'PingFang SC',
            top: '50%'
          },
          subtextStyle: {
            fontSize: 20,
            color: ['#c4cfd2'],
            align: 'center'
          },
          left: 'center',
          top: '38%',
          itemGap: 3
        },
        series: [
          // // 主要展示层的
          {
            clockWise: false,
            // radius: ['40%', '45%'],
            radius: [40, 53],
            center: ['50%', '50%'],
            type: 'pie',
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
                // formatter: "{a}\n{b}",
                textStyle: {
                  fontSize: 13,
                },
                position: 'outside'
              },
              emphasis: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false,
                length: 30,
                length2: 55
              },
              emphasis: {
                show: false
              }
            },
            // name: "在用运输车",
            data: dataing,
          },
          {
            type: 'pie',
            clockWise: false, //顺时加载
            hoverAnimation: false, //鼠标移入变大
            center: ['50%', '50%'],
            radius: [40, 41],
            label: {
              normal: {
                show: true,
                // formatter: "{b}",
                textStyle: {
                  color: '#ffffff',
                  fontSize: 13,
                },
                position: 'outside'
              }
            },
            data: dataing1,
          },
        ]
      };
      this.$nextTick(() => {
        GDTotalPie.setOption(options);
      })

      window.addEventListener('resize', function () {
        //宽度自适应
        GDTotalPie.resize();
      });
    },
    /**
     * 工单完成率
     */
    setGDcompletionPie () {
      let GDCompletionPie = this.$echarts.init(document.getElementById(`gdcompletionPie`));
      var bgColor = '#10286B';
      var shadowColor = '#374b86';
      let value = 76.2;
      let options = {
        title: {
          text: `工单完成率`,
          subtext: `${value}%`,
          left: 'center',
          top: '38%', //top待调整
          textStyle: {
            color: '#c4cfd2',
            fontSize: 13,
            fontFamily: 'PingFang SC',
            align: 'center',
            verticalAlign: 'top',
          },
          subtextStyle: {
            color: '#fff',
            fontSize: 18,
            fontFamily: 'PingFang SC',
            top: 'center'
          },
          itemGap: 5 //主副标题间距
        },
        series: [{
          name: 'pie1',
          type: 'pie',
          clockWise: true,
          radius: [48, 53],
          itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          },
          hoverAnimation: false,
          data: [{
            value: value,
            name: '已完成',
            itemStyle: {
              normal: {
                borderWidth: 5,
                borderColor: {
                  colorStops: [{
                    offset: 0,
                    color: '#1986F5' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#1986F5' // 100% 处的颜色
                  }]
                },
                color: { // 完成的圆环的颜色
                  colorStops: [{
                    offset: 0,
                    color: '#1986F5' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#1986F5' // 100% 处的颜色
                  }]
                },
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            }
          }, {
            name: '未完成',
            value: 100 - value,
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                color: '#072943',
                borderColor: '#072943',
                borderWidth: 5
              }
            }
          }]
        }]
      }
      this.$nextTick(() => {
        GDCompletionPie.setOption(options);
      })
      window.addEventListener('resize', function () {
        //宽度自适应
        GDCompletionPie.resize();
      });
    }
  },
  mounted () {
    console.log(icon);
    // setTimeout(() => {
    //   this.show = true
    // }, 2000)
    this.getData();
    this.$nextTick(() => {
      new Swiper('.swiper-container', {
        //direction: 'vertical', // 垂直切换选项
        //mousewheel: true, //滚轮
        autoplay: { //自动开始
          delay: 2500, //时间间隔
          disableOnInteraction: false, //*手动操作轮播图后不会暂停*
        },
        // loop: true, // 循环模式选项

        // 如果需要分页器
        pagination: {
          el: '.swiper-pagination',
          clickable: true, // 分页器可以点击
        },
      })
    })

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
.swiper-container {
  width: 100%;
  .swiper-slide {
    width: 100%;
  }
  .swiper-pagination {
    position: absolute;
    top: -9px;
    right: 40px;
    text-align: right;
    &.swiper-pagination-bullets {
      width: unset;
    }
    .swiper-pagination-bullet {
      background: #fff;
    }
    .swiper-pagination-bullet-active {
      background: #2db1ef;
    }
  }
}
</style>
