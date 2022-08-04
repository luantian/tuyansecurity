<template>
  <div class="flex bt-box">
    <div class="sj-box">
      <div v-for="(info,index) in list" class="dev-wrap">
        <div
        class="wrap_sysDiv box1_water"
        style="height: calc(202px); width: 192px"
        v-if="info.sw"
      >
        <div class="title f16 center"><span class=""></span></div>
        <div
          :class="`anmiteBox boxcontent normalData ${
            active == `1-${index}` ? 'active' : ''
          }`"
          @click="setLine(`1-${index}`, '水位', 'cm')"
        >
          <div class="eqName" title="水位">水位</div>
          <div class="box">
            <img src="@/assets/wulian/waterBox.png" />
            <div class="btword"></div>
          </div>
          <div class="bo">
            <div>
              <img src="@/assets/wulian/bo1.png" class="bo1" /><img
                src="@/assets/wulian/bo2.png"
                class="bo2"
              />
            </div>
          </div>
        </div>
        <div class="word currentWord yaliword1">{{ info.sw.dr_value }}cm</div>
        <div class="shuiweidata fontSize14">参考值: 20.0 - 300.0cm</div>
      </div>

      <div
        class="wrap_sysDiv"
        style="position: relative; height: calc(202px); width: 192px"
        v-if="info.sy"
      >
        <div class="title f16 center"><span class=""></span></div>
        <div
          :class="`boxcontent normalData ${active == `2-${index}` ? 'active' : ''}`"
          @click="setLine(`2-${index}`, '水压', 'Kpa')"
        >
          <div class="eqName" title="水压">水压</div>
          <div class="chartDiv" :id="'yali'+index"></div>
          <div class="cankaodata fontSize14">参考值 : 20 - 80Kpa</div>
        </div>
      </div>
      <div class="mt10 center dev-name">{{info.sy.dr_device_name}}</div>
      </div>
      

      <!-- <div
        class="wrap_sysDiv"
        style="position: relative; height: calc(202px); width: 192px"
      >
        <div class="title fontSize16"><span class=""></span></div>
        <div
          :class="`boxcontent normalData ${active == 3 ? 'active' : ''}`"
          @click="setLine(3, '温度', '℃')"
        >
          <div class="eqName" title="泵房温度">泵房温度</div>
          <div class="humCont">
            <div class="tempdiv" style="height: 100%; bottom: 15%">
              <div class="tempbar">
                <div class="tempData" style="height: 34.8%"></div>
                <div class="msg msgblue" style="bottom: 34.8%">
                  <span class="tempNumber">34.8</span>℃
                </div>
              </div>
            </div>
          </div>
          <div class="cankaodata fontSize14">参考值 : 0.0 - 50.0℃</div>
        </div>
      </div> -->

      <!-- <div
        class="wrap_sysDiv"
        style="position: relative; height: calc(202px); width: 192px"
      >
        <div class="title fontSize16"><span class=""></span></div>
        <div
          :class="`boxcontent normalData ${active == 4 ? 'active' : ''}`"
          @click="setLine(4, '湿度', '%RH')"
        >
          <div class="eqName" title="泵房湿度">泵房湿度</div>
          <div class="chartDiv contentimg">
            <img src="@/assets/wulian/shidu.png" />
          </div>
          <div class="yaliword1">19.83%RH</div>
          <div class="cankaodata fontSize14">参考值 : 0.0 - 90.0%RH</div>
        </div>
      </div> -->
    </div>

    <div id="lineChart" class="line_Chart" v-if="showChart"></div>
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
export default {
  props: ["unit"],
  data() {
    return {
      active: 1,
      chart: null,
      lineData: [],
      list:[],
      info: {},
      type_map: {
        1: "sw",
        2: "sy",
      },
      showChart:false
    };
  },
  watch: {
    unit(val) {
      this.$get(`/v1/dr/get-water-device/${val.dr_unit_id}`).then((res) => {
        this.info = {};
        this.list = []
        if (res.data) {
          res.data.map(i=>{
            let obj = {}
            i.map(j=>{
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
  },
  mounted() {
    //this.init();
  },
  methods: {
    init() {
      this.active = '1-0';
      this.list.map((it,index)=>{
        if(it.sy){
          this.getHFCChart(
          {
            id: "yali"+index,
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
    setLine(type, name, unit) {
      this.active = type;
      let index = type.split('-')[1]
      let key = type.split('-')[0]
      this.$get(
        `/v1/dr/get-water-device-monitor/${
          this.list[index][this.type_map[key]].dr_device_id
        }`
      ).then((res) => {
        let x_arr = [];
        let y_arr = [];
        res.data.map(it=>{
          x_arr.push(moment(it.dr_create_time * 1000).format("MM-DD HH:mm:ss"))
          y_arr.push(it.dr_value)
        })
        this.lineData = {
          x: x_arr,
          y: y_arr,
        };
        this.lineChart(this.lineData, name, unit);
      });
    },
    getHFCChart(obj, color) {
      var data = obj.data;
      var CO2Chart = this.$echarts.init(document.getElementById(obj.id));
      CO2Chart.title = "压力";

      var wordColor = ""; //数据显示颜色
      var barColor = ""; //仪表盘颜色显示
      var arrowColor = ""; //指针颜色
      var axisLabelSize = null;
      var detailSize = 20;
      if (window.innerWidth <= 1366) {
        axisLabelSize = 8;
        detailSize = 14;
      }

      if (color == 0) {
        wordColor = "#43eec9";
        barColor = "#03b7c9";
        arrowColor = "#43eec9";
      } else {
        wordColor = "#f4704d";
        barColor = "#f4704d";
        arrowColor = "#f4704d";
      }

      //data.analogup = 55,data.analogdown = 42.5,data.analogWarningUp = 80,data.analogWarningDown=30;

      // var axisSplit1 = (data.analogdown - data.analogWarningDown)/(data.analogWarningUp - data.analogWarningDown);
      // var axisSplit2 = (data.analogup - data.analogWarningDown)/(data.analogWarningUp - data.analogWarningDown);
      // var axisSplit1 = parseFloat(data.analogdown * 0.2 / (data.analogup * 1.2 - data.analogdown * 0.8)).toFixed(0,2);
      // var axisSplit2 = parseFloat((data.analogup - data.analogdown * 0.8) / (data.analogup * 1.2 - data.analogdown * 0.8)).toFixed(0,2);

      var minValue = 0;
      var maxValue = data.max;

      var axisSplit1 = 0.2//data.analogWarningUp; //(data.analogdown - minValue) / (maxValue - minValue);
      var axisSplit2 = 0.8 //(data.analogup - minValue) / (maxValue - minValue);

      var option = {
        grid: {
          z: 1, //grid作为柱状图的坐标系，其层级要和仪表图层级不同，同时隐藏
          show: false,
          left: "0%",
          right: "0%",
          top: "5%",
          containLabel: true,
          splitLine: {
            show: false, //隐藏分割线
          },
        },
        xAxis: [
          //这里有很多的show，必须都设置成不显
          {
            type: "category",
            data: [],
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            splitArea: {
              interval: "auto",
              show: false,
            },
          },
        ],
        yAxis: [
          //这里有很多的show，必须都设置成不显示
          {
            type: "value",
            axisLine: {
              show: false,
            },
            splitLine: {
              show: false,
            },
          },
        ],
        toolbox: {
          show: false,
        },
        series: [
          {
            name: "刻度盘",
            type: "gauge",
            startAngle: 180,
            endAngle: 0,
            center: ["50%", "65%"], //整体的位置设置
            z: 3,
            min: minValue,
            max: maxValue,
            splitNumber: 1,
            radius: "95%",
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 10,
                color: [
                  [axisSplit1, "#f4704d"],
                  [axisSplit2, "#03b7c9"],
                  [1, "#f4704d"],
                ],
              },
            },
            axisTick: {
              // 坐标轴小标记
              length: 5, // 属性length控制线长
              splitNumber: 10,
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: "#4375AA",
              },
            },
            splitLine: {
              // 分隔线
              length: 15, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                color: "#4375AA",
              },
            },
            axisLabel: {
              textStyle: {
                fontSize: axisLabelSize,
                color: "#03b7c9",
              },
            },
            pointer: {
              show: true,
              length: "70%",
              width: 2,
            },
            itemStyle: {
              normal: {
                color: arrowColor,
                borderWidth: 0,
              },
            },
            title: {
              //仪表盘标题
              show: false,
              offsetCenter: ["0", "20"],
              textStyle: {
                color: "#03b7c9",
                fontSize: 12,
                fontFamily: "Microsoft YaHei",
              },
            },
            // detail:{
            //     show: false
            // },
            detail: {
              textStyle: {
                fontSize: 12,
                color: wordColor,
              },
              offsetCenter: ["0%", "45%"],
              formatter: "{value}" + data.analogUnit,
            },
            data: [
              {
                value: data.currentValue || 0,
                name: "",
              },
            ],
          },
          {
            name: "灰色内圈",
            type: "gauge",
            z: 2,
            radius: "95%",
            startAngle: 180,
            endAngle: 0,
            center: ["50%", "65%"], //整体的位置设置
            splitNumber: 4,
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[1, "#4375AA"]],
                width: 12,
                opacity: 1,
              },
            },
            splitLine: {
              //分隔线样式
              show: false,
            },
            axisLabel: {
              //刻度标签
              show: false,
            },
            axisTick: {
              //刻度样式
              show: false,
            },
            detail: {
              show: false,
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                //fontWeight: 'bolder',
                fontSize: 10,
              },
            },
          },
        ],
      };

      CO2Chart.setOption(option);
      window.addEventListener("resize", function () {
        //宽度自适应
        CO2Chart.resize();
      });
    },
    lineChart(data, name, unit) {
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
    },
  },
};
</script>

<style lang="scss" scoped>
.sj-box {
  height: 50%;
  overflow-y: auto;
  border-bottom: 1px solid #064278;
}
.dev-wrap{
  border: 1px solid #064278;
  border-radius: 8px;
  overflow: hidden;
  padding: 0 15px 30px 15px;
  position: relative;
  float: left;
  width: 427px;
  margin-bottom: 15px;
  margin-right: 15px;
  .dev-name{
    position: absolute;
    bottom: 8px;
    left: 0;
    right: 0;
  }
}
.line_Chart {
  height: 50%;
}

.bt-box {
  flex-direction: column;
}

.title {
  width: 100%;
  height: 22px;
  /*line-height: 30px;*/
  text-align: center;
  color: #fff;
}
</style>
