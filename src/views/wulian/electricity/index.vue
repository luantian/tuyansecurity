<template>
  <div class="electricity_main">
    <!--机构 start-->
    <div class="left">
      <TreeData @handleSelect="handleSelectArea"
                @ready="handleSelectArea"
                ref="areaTree"></TreeData>
      <!-- <el-input placeholder="输入关键字进行过滤"
                v-model="filterText">
      </el-input>

      <el-tree class="filter-tree"
               :data="data"
               :props="defaultProps"
               default-expand-all
               :filter-node-method="filterNode"
               ref="tree">
      </el-tree> -->
    </div>
    <!--机构 end-->

    <!-- 图表 start -->
    <div class="right">
      <div class="right_top">
        <template v-if="info.length">
          <div class="right_top_item"
               v-for="(item, index) in info"
               :class="`boxcontent normalData ${active == index ? 'active' : ''}`"
               @click="setLine(index, '电流', 'mA')"
               :key="item.dr_id">
            <div class="item_title">
              {{item.dr_device_name}}
            </div>
            <div class="item_content">
              <div class="item_content_line"></div>
              <div class="item_content_top">
                <div class="item_content_top_left">
                  <div class="eqName"
                       title="剩余电流">漏电电流</div>
                  <div class="chartDiv"
                       :id="`yali${index}`"></div>
                  <div class="cankao fontSize14">参考值 : 0.0 - 500.0</div>
                </div>
                <div class="item_content_top_right">
                  <div class="eqName"
                       title="配电箱温度">配电箱温度</div>
                  <div class="chartDiv"
                       :id="`wendu${index}`"></div>
                  <div class="cankao fontSize14">参考值 : 0.0 - 60.0</div>
                </div>
              </div>
              <div class="item_content_bottom">
                <div class="bottom_row">
                  <div class="mt5">电压</div>
                  <div class="mt5">电流</div>
                  <div class="mt5">温度</div>

                </div>
                <div class="bottom_row odd">
                  <div class="mt5"
                       style="color: #EE7B48;">UA {{ item.dr_ua }}V</div>
                  <div class="mt5"
                       style="color: #48C1FF;">IA {{ item.dr_ia }}A</div>
                  <div class="mt5"
                       style="color: #24F2FF;">WA {{ item.dr_wa }}°C</div>

                </div>
                <div class="bottom_row">
                  <div class="mt5"
                       style="color: #EE7B48;">UB {{ item.dr_ub }}V</div>
                  <div class="mt5"
                       style="color: #48C1FF;">IB {{ item.dr_ib }}A</div>
                  <div class="mt5"
                       style="color: #24F2FF;">WB {{ item.dr_wb }}°C</div>
                </div>
                <div class="bottom_row odd">
                  <div class="mt5"
                       style="color: #EE7B48;">UC {{ item.dr_uc }}V</div>
                  <div class="mt5"
                       style="color: #48C1FF;">IC {{ item.dr_ic }}A</div>
                  <div class="mt5"
                       style="color: #24F2FF;">WC {{ item.dr_wc }}°C</div>
                </div>
              </div>
            </div>
          </div>
        </template>

      </div>
      <!-- 折线图 start -->
      <div class="right_bottom"
           v-if="info.length">
        <div class="right_bottom_line"></div>
        <div id="lineChart"
             class="line_Chart"
             v-show="info.length"></div>
      </div>
      <!-- 折线图 end -->
    </div>
    <!-- 图表 end -->
  </div>
</template>

<script>
var color = ['#74FFF3', '#5E8FFF'],
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
  ];
import moment from 'moment';
import TreeData from '@/components/TreeData';
export default {
  // props: ["unit"],
  components: {
    TreeData,
  },
  data () {
    return {
      active: 1,
      chart: null,
      lineData: [],
      info: {},
      unit: {
        dr_unit_id: '',
        dr_level: 3,
        dr_parent_key: "",
        dr_self_key: "",
        dr_sort: 0,
        dr_unit_id: 0,
        dr_unit_name: "",
        id: 0
      },
      filterText: '',
    };
  },
  watch: {
    unit: {
      handler () {
        console.log('unit:   ', this.unit)
        this.info = [];
        this.$get(`/v1/dr/get-electricity-device/${this.unit.dr_unit_id}`).then(
          (res) => {
            if (res.msg !== '获取用电设备成功') {
              this.$message.info(res.msg);
              return
            }

            this.info = res.data;
            this.$nextTick(() => {
              this.info.map((it, index) => {
                console.log('温度： ', it.dr_temperature)
                this.getHFCChart(
                  {
                    id: index,
                    data: {
                      currentValue: it.dr_electric_leakage,
                      analogdown: 200,
                      analogup: 800,
                      analogWarningUp: 800,
                      analogWarningDown: 0,
                      analogUnit: 'mA',
                      wd: it.dr_temperature
                    },
                  },
                  0
                );
              });

              this.setLine(0, '电流', 'mA');
            });
          }
        );
      },
      deep: true,
    },
  },
  mounted () {
    // setTimeout(() => {
    //   this.unit.dr_unit_id = '120034';
    // }, 1000);
  },
  methods: {
    // handleSelectArea () {

    // },
    handleSelectArea (val) {
      console.log(val);
      for (let key in val) {
        this.$set(this.unit, key, val[key])
      }
    },
    setLine (type, name, unit) {
      this.active = type;
      this.$get(
        '/v1/dr/get-electricity-device-diagram/' + this.info[type].dr_device_id
      ).then((res) => {
        let x_arr = [];
        let y_arr = [
          { name: 'IA', data: [] },
          { name: 'IB', data: [] },
          { name: 'IC', data: [] },
        ];
        res.data.map((it) => {
          x_arr.push(moment(it.dr_create_time * 1000).format('MM-DD HH:mm:ss'));
          y_arr[0].data.push(it.dr_ia);
          y_arr[1].data.push(it.dr_ib);
          y_arr[2].data.push(it.dr_ic);
        });
        this.lineData = {
          x: x_arr,
          y: y_arr,
        };
        // this.lineChart(this.lineData, name, unit);
        this.lineChartPro()
      });
    },
    getHFCChart (obj, color) {
      var data = obj.data;
      console.log(data)
      var CO2Chart = this.$echarts.init(document.getElementById(`yali${obj.id}`));
      var wenduChart = this.$echarts.init(document.getElementById(`wendu${obj.id}`));
      // CO2Chart.title = '压力';
      let option = {
        color: ["#37A2DA", "#32C5E9", "#67E0E3"],
        title: {
          text: `${data.currentValue}A`,
          x: 'center',
          // y: '43%',
          bottom: '0%',
          // bottom: '10%',
          textStyle: {
            color: '#00FFDE',
            fontSize: '18px'
          }

        },
        series: [{
          name: '业务指标',
          radius: '94%',
          type: 'gauge',
          detail: {
            show: false,
            // formatter: `${data.currentValue}A`,
            // offsetCenter: [0, 42],
            // textStyle: {
            //     padding: [0, 0, 0, 0],
            //     fontSize: 28,
            //     fontWeight: '700',
            // }
          },
          title: { //标题
            show: false,
            offsetCenter: [0, 46], // x, y，单位px
            textStyle: {
              color: "#999",
            }
          },
          startAngle: 230,
          endAngle: -50,
          axisLine: {
            show: true,
            lineStyle: {
              width: 8,
              shadowBlur: 0,
              color: [
                [0.3, '#e67f33'],
                [0.7, '#32d7c2'],
                [1, '#e67f33']
              ]
            }
          },
          axisLabel: {
            show: true,
            color: 'rgba(255,255,255,0.5)',
            distance: 30,
            formatter: function (v) {
              switch (v + '') {
                case '0':
                  return '0';
                case '30':
                  return '30';
                case '70':
                  return '70';
                case '100':
                  return '100';
              }
            }
          },

          axisTick: {
            show: true,
            splitNumber: 2,
            lineStyle: {
              color: '#011b29', //用颜色渐变函数不起作用
              width: 1,
            },
            length: -15
          }, //刻度样式
          splitLine: {
            show: true,
            length: -20,
            lineStyle: {
              color: '#011b29', //用颜色渐变函数不起作用
              width: 1,
            }
          },
          data: [{
            value: data.currentValue || 0,
            name: '完成率',
          }]

        }]
      };
      // ============温度计================
      var kd = [];
      for (let i = 0, len = 100; i <= len; i++) {
        if (i > 100 || i < 0) {
          kd.push('0')
        } else {
          if (i % 25 === 0) {
            kd.push('2');
          } else if (i % 5 === 0) {
            kd.push('1');
          } else {
            kd.push('0');
          }
        }

      }
      let option1 = {
        // backgroundColor: '#000',
        title: {
          text: `${data.wd}℃`,
          x: 'center',
          // y: '43%',
          bottom: '0%',
          textStyle: {
            color: '#00FFDE',
            fontSize: '18px'
          }

        },
        grid: {
          left: '0',
          right: '0',
          top: '8%',
          bottom: '28%',
          // bottom: '28%',
        },
        yAxis: [{
          show: false,
          min: 0,
          max: 108,
        }, {
          show: false,
          data: [],
          min: -15,
          max: 110,
        }],
        xAxis: [{
          show: false,
          data: []
        }, {
          show: false,
          data: []
        }, {
          show: false,
          data: []
        }, {
          show: false,
          min: -30,
          max: 50,

        }],
        series: [{
          name: '条',
          type: 'bar',
          // 对应上面XAxis的第一个对象配置
          xAxisIndex: 0,
          barWidth: 10,
          itemStyle: {
            normal: {
              color: '#32d6c2',
              barBorderRadius: 10,
            }
          },
          data: [50],
          label: {
            normal: {
              show: false,
              position: 'top',
              textStyle: {
                color: '#ccc',
                fontSize: '11',
              }
            }
          },
          z: 2
        }, {
          name: '白框',
          type: 'bar',
          xAxisIndex: 1,
          barGap: '-100%',
          data: [110],
          barWidth: 18,
          label: {
            normal: {
              show: false,
              position: 'top',
              distance: 5,
              color: '#fff',
              fontSize: 14,
              offset: [25, 25],
              formatter: '°C'
            }
          },
          itemStyle: {
            normal: {
              color: '#08496a',
              barBorderRadius: 50,
            }
          },
          z: 1
        }, {
          name: '圆',
          type: 'scatter',
          hoverAnimation: false,
          data: [0],
          xAxisIndex: 0,
          symbolSize: 32,
          itemStyle: {
            normal: {
              color: '#32d6c2',
              opacity: 1,
            }
          },
          z: 2
        }, {
          name: '白圆',
          type: 'scatter',
          hoverAnimation: false,
          data: [0],
          xAxisIndex: 1,
          symbolSize: 42,
          itemStyle: {
            normal: {
              color: '#08496a',
              opacity: 1,
            }
          },
          z: 1
        }, {
          name: '刻度',
          type: 'bar',
          yAxisIndex: 1,
          xAxisIndex: 3,
          label: {
            normal: {
              show: true,
              position: 'left',
              distance: 5,
              color: '#1799db',
              fontSize: 10,
              formatter: function (params) {
                // 因为柱状初始化为0，温度存在负值，所以，原本的0-100，改为0-130，0-30用于表示负值
                if (params.dataIndex > 120 || params.dataIndex < -30) {
                  return '';
                } else {
                  if (params.dataIndex % 20 === 0) {
                    return params.dataIndex - 20;
                  } else {
                    return '';
                  }
                }
              }
            }
          },
          barGap: '-100%',
          barWidth: 0.5,
          itemStyle: {
            normal: {
              color: '#066c9f',
              barBorderRadius: 1,
            }
          },
          data: kd,
          z: 0
        }]
      };

      CO2Chart.setOption(option);
      wenduChart.setOption(option1);
      window.addEventListener('resize', function () {
        //宽度自适应
        CO2Chart.resize();
        wenduChart.resize()
      });

    },
    lineChartPro () {
      var line_ChartPro = this.$echarts.init(document.getElementById(`lineChart`));
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
    },
  },
};
</script>

<style lang="scss">
.electricity_main {
  width: 100%;
  height: 100%;
  display: flex;
  .left {
    height: 100%;
    width: 270px;
    flex-shrink: 0;
    background: #000c12;
    border-right: 1px solid rgba(0, 138, 207, 0.66);
  }
  .right {
    flex: 1;
    padding: 32px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .right_top {
      display: flex;
      .right_top_item {
        flex-shrink: 0;
        .item_title {
          text-align: center;
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #ffffff;
          margin-bottom: 12px;
        }
        .item_content {
          position: relative;
          flex-shrink: 0;
          width: 323px;
          height: 418px;
          background: #011a2a;
          border: 1px solid #004a70;
          box-shadow: inset -2px -2px 4px 0px #004a70,
            inset 2px 2px 4px 0px #004a70;
          border-radius: 3px;
          margin-right: 25px;
          padding: 28px 16px 27px 22px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .item_content_line {
            position: absolute;
            top: 0px;
            left: 50%;
            transform: translate(-50%, 0);
            width: 143px;
            height: 4px;
            background: #43c6d9;
          }
          .item_content_top {
            display: flex;
            justify-content: space-between;
            text-align: center;
            flex: 1;
            margin-bottom: 22px;
            .eqName {
              flex-shrink: 0;
              font-size: 16px;
              color: #ffffff;
            }
            .cankao {
              flex-shrink: 0;
              font-size: 14px;
              color: #ebe8f0;
            }
            .chartDiv {
              flex: 1;
              display: flex;
              // justify-content: start;
              // width: 120%;
            }
            .item_content_top_left {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              flex: 1;
              flex-shrink: 0;
              // width: 60%;
              overflow: hidden;
            }
            .item_content_top_right {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              flex: 1;
              // width: 40%;
              flex-shrink: 0;
              overflow: hidden;
            }
          }
          .item_content_bottom {
            width: 100%;
            height: 145px;
            display: flex;
            flex-direction: column;
            border-radius: 5px;
            border: 1px solid;
            border-image: linear-gradient(
                45deg,
                #042f47,
                #4eadf5,
                #ffffff,
                #61cafb,
                #09344d
              )
              10 10;
            //  border-image: linear-gradient(45deg, #042E49, #4DA9FA, #FFFFFF, #5FC8FF, #08334F) 10 10;
            .bottom_row {
              display: flex;
              flex: 1;
              align-items: center;
              justify-content: center;
              .mt5 {
                flex: 1;
                text-align: center;
              }
              &.odd {
                background: linear-gradient(90deg, rgba(1, 75, 110, 0.99) 48%);
              }
            }
          }
        }
      }
    }
    .right_bottom {
      position: relative;
      height: 300px;
      width: 100%;
      background: #000c14;
      border-radius: 3px;
      border: 1px solid #0f2937;
      box-shadow: inset -2px -2px 4px 0px #0f2937, inset 2px 2px 4px 0px #0f2937;
      display: flex;
      .right_bottom_line {
        position: absolute;
        top: 0px;
        left: 50%;
        transform: translate(-50%, 0);
        width: 146px;
        height: 4px;
        background: #43c6d9;
      }
      .line_Chart {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
