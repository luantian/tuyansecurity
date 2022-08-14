<template>
  <div class="water_main">
    <!--机构 start-->
    <div class="left">
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
      <TreeData @handleSelect="handleSelectArea"
                @ready="handleSelectArea"
                ref="areaTree"></TreeData>
    </div>
    <!--机构 end-->
    <!-- 图表 start -->
    <div class="right">
      <div class="right_top">
        <template v-for="(info,index) in list">
          <div class="right_top_item"
               :key="index">
            <div class="item_title">
              {{info.sy.dr_device_name}}
            </div>
            <div class="item_content">
              <div class="item_content_line"></div>
              <div class="item_content_left">
                <div class="eqName"
                     title="水位">水位</div>
                <div class="chartDiv"
                     :id="`sw${index}`"></div>
                <div class="cankao fontSize14">参考值 : 20.0 - 300.0cm</div>
              </div>
              <div class="item_content_right">
                <div class="eqName"
                     title="水压">水压</div>
                <div class="chartDiv"
                     :id="`sy${index}`"></div>
                <div class="cankao fontSize14">参考值 : 0.0 - 60.0Kpa</div>
              </div>

            </div>
            <!-- 图标区 start -->

            <!-- 图标区 end -->
          </div>
        </template>

      </div>
      <!-- 折线图 start -->
      <div class="right_bottom"
           v-if="list.length">
        <div class="right_bottom_line"></div>
        <div id="lineChart"
             class="line_Chart"></div>
        <!-- <div id="lineChart"
             class="line_Chart"
             v-show="info.length"></div> -->
      </div>
      <!-- 折线图 end -->
    </div>
    <!-- 图表 end -->
  </div>
</template>

<script>
var color = ["#74FFF3", "#5E8FFF"],
  ecolor = [
    [
      {
        offset: 0,
        color: "rgba(41,255,206, 0.32)",
      },
      {
        offset: 1,
        color: "rgba(83,255,233,0.00)",
      },
    ],
    [
      {
        offset: 0,
        color: "rgba(44,141,254,0.32)",
      },
      {
        offset: 1,
        color: "rgba(43,107,255,0.00)",
      },
    ],
  ];
import moment from "moment";
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
      list: [],
      info: {},
      type_map: {
        1: "sw",
        2: "sy",
      },
      showChart: false,
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
    };
  },
  watch: {
    unit: {
      handler (val) {
        this.$get(`/v1/dr/get-water-device/${val.dr_unit_id}`).then((res) => {
          this.info = {};
          this.list = []
          if (res.data) {
            res.data.map(i => {
              let obj = {}
              i.map(j => {
                obj[j.dr_model_type] = j;
              })
              this.list.push(obj)

            })
            this.info = this.list[0]
            this.$nextTick(() => {
              this.init();
              this.showChart = true
            });
          } else {
            this.showChart = false
            this.$message.info(res.msg);
          }
        });
      },
      deep: true
    },
  },
  mounted () {
    //this.init();
  },
  methods: {
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
    handleSelectArea (val) {
      console.log(val);
      for (let key in val) {
        this.$set(this.unit, key, val[key])
      }
    },
    init () {
      this.active = '1-0';
      this.list.map((it, index) => {
        if (it.sy) {
          this.getHFCChart(
            {
              id: index,
              data: {
                currentValue: it.sy.dr_value,
                analogdown: 0,
                max: 80,
                analogUnit: "Kpa",
              },
            },
            0
          );
        }
      })

      this.setLine('1-0', "水位", "cm");
    },
    setLine (type, name, unit) {
      this.active = type;
      let index = type.split('-')[1]
      let key = type.split('-')[0]
      this.$get(
        `/v1/dr/get-water-device-monitor/${this.list[index][this.type_map[key]].dr_device_id
        }`
      ).then((res) => {
        let x_arr = [];
        let y_arr = [];
        res.data.map(it => {
          x_arr.push(moment(it.dr_create_time * 1000).format("MM-DD HH:mm:ss"))
          y_arr.push(it.dr_value)
        })
        this.lineData = {
          x: x_arr,
          y: y_arr,
        };
        this.lineChartPro(this.lineData, name, unit);
        // this.lineChart(this.lineData, name, unit);
      });
    },
    getHFCChart (obj, color) {
      var data = obj.data;
      var swChart = this.$echarts.init(document.getElementById(`sw${obj.id}`));
      var syChart = this.$echarts.init(document.getElementById(`sy${obj.id}`));
      var value = data.currentValue || 0;
      let option = {
        series: [{
          type: 'liquidFill',
          // radius: '47%',
          radius: '94%',
          color: [{
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: '#446bf5',
            },
            {
              offset: 1,
              color: '#2ca3e2',
            },
            ],
            globalCoord: false,
          },],
          data: [0.45, 0.42], // data个数代表波浪数
          backgroundStyle: {

            color: 'RGBA(29, 64, 90, 0.9)',
          },
          label: {

            normal: {
              show: true,
              formatter: val => {
                console.log('val~', val)
                return `${value}cm`
              },
              textStyle: {
                fontSize: 18,
                color: '#fff',
              },
            },
          },
          outline: {
            borderDistance: 0,
            itemStyle: {
              borderWidth: 1,
              borderColor: '#0e2d45',
            },
          },
        },



        ],
      };
      // ==============压力值 ==============
      let option1 = {
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
      swChart.setOption(option);
      syChart.setOption(option1);
      window.addEventListener("resize", function () {
        //宽度自适应
        swChart.resize();
        syChart.resize();
      });
    },
    lineChart (data, name, unit) {
      let option = {
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(0,0,0,0.7)",
          borderWidth: "0",
          axisPointer: {
            type: "shadow",
          },
          textStyle: {
            fontSize: 14,
            color: "rgba(255,255,255,0.80)",
          },
        },
        legend: {
          show: false,
          icon: "rect",
          orient: "horizontal",
          right: 0,
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            color: "rgba(255,255,255,0.70)",
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
          type: "category",
          data: data.x,
          axisLabel: {
            show: !0,
            //interval: 13,
            fontSize: 12,
            color: "rgba(255,255,255,0.40)",
          },
        },
        yAxis: [
          {
            type: "value",
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
              formatter: "{value}" + unit,
              color: "rgba(255,255,255,0.40)",
              interval: 2,
            },
          },
        ],
        series: [
          {
            name: name,
            type: "line",
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "red",
                  },
                  {
                    offset: 1,
                    color: "blue",
                  },
                ],
              },
            },
            areaStyle: {
              color: new this.$echarts["graphic"].LinearGradient(
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
            data: data.y,
            smooth: !0,
          },
        ],
        color: color,
      };

      this.chart = this.$echarts.init(document.getElementById("lineChart"));
      this.chart.setOption(option, !0);
      window.addEventListener('resize', () => {
        this.chart.resize()
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.water_main {
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
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: auto;
    .right_top {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding-bottom: 20px;

      gap: 25px;
      // &::after {
      //   flex: auto;
      //   content: '';
      // }
      
      .right_top_item {
        // margin-right: 25px;
        // margin-bottom: 25px;
        flex-shrink: 0;
        flex: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .item_title {
          text-align: center;
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #ffffff;
          margin-bottom: 12px;
          width: 440px;
        }
        .item_content {
          position: relative;
          flex-shrink: 0;
          width: 440px;
          height: 208px;
          background: #011a2a;
          border: 1px solid #004a70;
          box-shadow: inset -2px -2px 4px 0px #004a70,
            inset 2px 2px 4px 0px #004a70;
          border-radius: 3px;
          display: flex;
          padding: 18px 0px 22px 0px;
          .item_content_line {
            position: absolute;
            top: 0px;
            left: 50%;
            transform: translate(-50%, 0);
            width: 143px;
            height: 4px;
            background: #43c6d9;
          }
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
            width: 100%;
          }
          .item_content_left {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex: 1;
            flex-shrink: 0;
            // width: 60%;
            overflow: hidden;
            align-items: center;
          }
          .item_content_right {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex: 1;
            // width: 40%;
            flex-shrink: 0;
            overflow: hidden;
            align-items: center;
          }
        }

        // &:nth-child(3n) {
        //   margin-right: 0;
        // }
      }
    }
    .right_bottom {
      flex-shrink: 0;
      position: relative;
      height: 300px;
      width: 100%;
      background: #000c14;
      border-radius: 3px;
      border: 1px solid #0f2937;
      box-shadow: inset -2px -2px 4px 0px #0f2937, inset 2px 2px 4px 0px #0f2937;
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
