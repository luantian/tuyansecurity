<template>
<div class="fault-pie-box">
  <div class="chart-box fault-pie">
    <div :id="graphName" class="chart-content"></div>
    <!-- <img src="https://www.hikfirecloud.com/web/static/img/pie_inner.324e0449.png" class="circle-rate rotate-in"><img src="https://www.hikfirecloud.com/web/static/img/pie_inner.324e0449.png" class="circle-rate rotate-out"> -->
  </div>
</div>
</template>

<script>
export default {
  name: "PieChart",
  props: {
    graphName: {
      type: String,
      default: "falut-pie"
    },
    center: {
      type: Number,
      default: 1
    },
    labelLineShow: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: function () {
        return [{
            name: '电气火灾监控系统',
            value: 13
          },
          {
            name: '独立式烟感系统',
            value: 18
          },
          {
            name: '火灾报警系统',
            value: 18
          },
          {
            name: '可燃气体系统',
            value: 18
          },
          {
            name: '消防水系统',
            value: 18
          },
          {
            name: '视频监控系统',
            value: 18
          },
          {
            name: '其他系统',
            value: 18
          },
        ]
      }
    },
    centerAnimation: {
      type: Boolean,
      default: !1
    },
    legendShow: {
      type: Boolean,
      default: !1
    },
    colorList: {
      type: Array,
      default: function () {
        return ["#913fff", "#0097ff", "#00ffc3", "#fff900", "#ff8400", "#ff5022", "#ffb27f"]
      }
    },
    noDataSize: {}
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart(this.data);
  },
  methods: {
    initChart(data) {
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}",
          backgroundColor: "rgba(0,0,0,0.7)",
          borderWidth: "0",
          axisPointer: {
            type: "shadow"
          },
          textStyle: {
            fontSize: 14,
            color: "rgba(255,255,255,1)"
          }
        },
        legend: {
          itemWidth: 6,
          itemHeight: 6,
          textStyle: {
            color: "rgba(255,255,255,0.70)",
            rich: {
              a: {
                color: "rgba(255,255,255,0.70)",
                fontSize: 12
              },
              b: {
                color: "#fff",
                fontSize: 12
              }
            }
          },
          orient: "vertical",
          left: "50%",
          top: "20%",
          show: this.legendShow,
          data: this.data,
        },
        series: [{
          name: "设备数量",
          type: "pie",
          radius: ["50%", "70%"],
          center: ["50%", "50%"],
          startAngle: 90,
          avoidLabelOverlap: !0,
          minAngle: 15,
          data: this.data,
          center: ["50%", "50%"],
          labelLine: {
            show: true,
            lineStyle: {
              color: "#A6A2FF"
            },
            show: this.labelLineShow
          },
          label: {
            show: this.labelLineShow,
            show: !0,
            fontSize: 12,
            color: "#A6A2FF",
            rotate: 0
          }
        }],
        color: this.colorList
      }

      this.chart = this.$echarts.init(document.getElementById(this.graphName))
      this.chart.setOption(option, !0)
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
