<template>
  <div class="flex bt-box">
    <div class="sj-box">
      <div
        v-for="(item, index) in info"
        :key="item.dr_id"
        class="wrap_sysDiv"
        style="position: relative; height: 300px; width: 360px"
      >
        <div class="title fontSize16"><span class="">{{item.dr_device_name}}</span></div>
        <div
          :class="`boxcontent normalData ${active == index ? 'active' : ''}`"
          @click="setLine(index, '电流', 'mA')"
        >
          <div class="flex" style="height: 170px">
            <div class="flex1 relative">
              <div class="eqName" title="剩余电流">漏电电流</div>
              <div class="chartDiv" :id="`yali${index}`"></div>
              <div class="cankao fontSize14">参考值 : 0.0 - 500.0mA</div>
            </div>
            <div class="flex1 relative">
              <div class="eqName" title="配电箱温度">配电箱温度</div>
              <div class="humCont">
                <div class="tempdiv" style="height: 100%; bottom: 15%">
                  <div class="tempbar">
                    <div
                      class="tempData"
                      :style="`height: ${item.dr_temperature}%;`"
                    ></div>
                    <div
                      class="msg msgblue"
                      :style="`bottom: ${item.dr_temperature}%;`"
                    >
                      <span class="tempNumber">{{ item.dr_temperature }}</span
                      >℃
                    </div>
                  </div>
                </div>
              </div>
              <div class="cankao fontSize14">温度参考值 : 0.0 - 60.0℃</div>
            </div>
          </div>
          <div class="flex bt-tx">
            <div class="flex1" style="color: #3b7dd2">
              <div>电压</div>
              <div class="mt5">UA {{ item.dr_ua }}V</div>
              <div class="mt5">UB {{ item.dr_ub }}V</div>
              <div class="mt5">UC {{ item.dr_uc }}V</div>
            </div>
            <div class="flex1" style="color: #b88b16">
              <div>电流</div>
              <div class="mt5">IA {{ item.dr_ia }}A</div>
              <div class="mt5">IB {{ item.dr_ib }}A</div>
              <div class="mt5">IC {{ item.dr_ic }}A</div>
            </div>
            <div class="flex1" style="color: #b3454f">
              <div>温度</div>
              <div class="mt5">WA {{ item.dr_wa }}°C</div>
              <div class="mt5">WB {{ item.dr_wb }}°C</div>
              <div class="mt5">WC {{ item.dr_wc }}°C</div>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="wrap_sysDiv" style="position: relative; height: calc(202px); width: 192px;">
      <div class="title fontSize16"><span class="">配电箱温度</span></div>
      <div :class="`boxcontent normalData ${active==2?'active':''}`" @click="setLine(2,'温度','℃')">

        <div class="eqName" title="配电箱温度">配电箱温度</div>
        <div class="humCont">
          <div class="tempdiv" style="height: 100%;bottom: 15%;">
            <div class="tempbar">
              <div class="tempData " style="height: 34.8%;"></div>
              <div class="msg msgblue" style="bottom: 34.8%;"><span class="tempNumber">34.8</span>℃ </div>
            </div>
          </div>
        </div>
        <div class="cankaodata fontSize14">参考值 : 0.0 - 50.0℃</div>
      </div>
    </div>  -->
    </div>

    <div id="lineChart" class="line_Chart" v-show="info.length"></div>
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
      info: {},
    };
  },
  watch: {
    unit(val) {
      this.info = []
      this.$get(`/v1/dr/get-electricity-device/${this.unit.dr_unit_id}`).then(
        (res) => {
          this.info = res.data;
          this.$nextTick(() => {
            this.info.map((it, index) => {
              this.getHFCChart(
                {
                  id: "yali" + index,
                  data: {
                    currentValue: it.dr_electric_leakage,
                    analogdown: 200,
                    analogup: 800,
                    analogWarningUp: 800,
                    analogWarningDown: 0,
                    analogUnit: "mA",
                  },
                },
                0
              );
            });

            this.setLine(0, "电流", "mA");
          });
        }
      );
    },
  },
  mounted() {},
  methods: {
    setLine(type, name, unit) {
      this.active = type;
      this.$get(
        "/v1/dr/get-electricity-device-diagram/" + this.info[type].dr_device_id
      ).then((res) => {
        let x_arr = [];
        let y_arr = [
          { name: "IA", data: [] },
          { name: "IB", data: [] },
          { name: "IC", data: [] },
        ];
        res.data.map((it) => {
          x_arr.push(moment(it.dr_create_time * 1000).format("MM-DD HH:mm:ss"));
          y_arr[0].data.push(it.dr_ia);
          y_arr[1].data.push(it.dr_ib);
          y_arr[2].data.push(it.dr_ic);
        });
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

      var minValue = data.analogdown - (data.analogup - data.analogdown) * 0.2;
      var maxValue =
        parseFloat(data.analogup) + (data.analogup - data.analogdown) * 0.2;

      var axisSplit1 = (data.analogdown - minValue) / (maxValue - minValue);
      var axisSplit2 = (data.analogup - minValue) / (maxValue - minValue);

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
            min: 0,
            max: 500,
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
      let serve = {
        name: "",
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
        data: [],
        smooth: !0,
      };
      let servers = []
      data.y.map(it=>{
        let obj = {...serve}
        obj.name = it.name;
        obj.data = it.data
        servers.push(obj)
      })
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
        series: servers,
        color: color,
      };

      this.chart = this.$echarts.init(document.getElementById("lineChart"));
      this.chart.setOption(option, !0);
    },
  },
};
</script>

<style lang="scss" scoped>
.boxcontent {
}
.bt-tx {
  text-align: center;
  font-size: 14px;
}
.sj-box {
  height: 50%;
  overflow-y: auto;
  border-bottom: 1px solid #064278;
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
.relative {
  position: relative;
}
.cankao {
  text-align: center;
  font-size: 12px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 20px;
}
</style>
