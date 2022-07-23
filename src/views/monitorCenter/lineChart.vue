<template>
<div class="line-chart-box">
  <div class="chart-title">{{title}}</div>
  <div :id="graphNameId" class="chart-content"></div>
</div>
</template>

<script>
var color = ["#74FFF3", "#5E8FFF"],
  ecolor = [
    [{
      offset: 0,
      color: "rgba(41,255,206, 0.32)"
    }, {
      offset: 1,
      color: "rgba(83,255,233,0.00)"
    }],
    [{
      offset: 0,
      color: "rgba(44,141,254,0.32)"
    }, {
      offset: 1,
      color: "rgba(43,107,255,0.00)"
    }]
  ]

export default {
  name: "lineChart",
  props: {
    title: {
      type: String,
      default: "近30天物联接入趋势"
    },
    graphNameId: {
      type: String,
      default: "deviceLineChart"
    },
    name:{
      type: String,
      default: "数量"
    },
    data: {
      type: Object,
      default: function () {
        return {
          x: ['2021-09-13', '2021-09-12'],
          y: [{
            name: '数量',
            data: [6, 8]
          }]
        }
      }
    },
    isLegendShow: {
      type: Boolean,
      default: !1
    }
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
          trigger: "axis",
          backgroundColor: "rgba(0,0,0,0.7)",
          borderWidth: "0",
          axisPointer: {
            type: "shadow"
          },
          textStyle: {
            fontSize: 14,
            color: "rgba(255,255,255,0.80)"
          }
        },
        legend: {
          show: this.isLegendShow,
          icon: "rect",
          orient: "horizontal",
          right: 0,
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            color: "rgba(255,255,255,0.70)"
          }
        },
        grid: {
          x: 20,
          x2: 20,
          y: 20,
          y2: 10,
          containLabel: true
        },
        xAxis: {
          type: "category",
          data: ['2021-09-12','2021-09-13', '2021-09-14','2021-09-15','2021-09-16'],
          axisLabel: {
            show: !0,
            //interval: 13,
            fontSize: 12,
            color: "rgba(255,255,255,0.40)"
          },
        },
        yAxis: [{
          type: "value",
          minInterval: 1,
          min: 0,
          axisTick: {
            lineStyle: {
              width: 0
            }
          },
          axisLine: {
            lineStyle: {
              width: 0
            }
          },
          splitLine: {
            lineStyle: {
              width: 0
            }
          },
          axisLabel: {
            color: "rgba(255,255,255,0.40)",
            interval: 2
          }
        }],
        series: [{
          name: this.name,
          type: "line",
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: "red"
              }, {
                offset: 1,
                color: "blue"
              }]
            }
          },
          areaStyle: {
            color: new this.$echarts["graphic"].LinearGradient(0, 0, 0, 1, ecolor[0])
          },
          itemStyle: {
            normal: {
              color: color[0],
              lineStyle: {
                color: color[0]
              }
            }
          },
          data: [1, 2,1,5,3],
          smooth: !0
        }],
        color: color
      }

      this.chart = this.$echarts.init(document.getElementById(this.graphNameId))
      this.chart.setOption(option, !0)
    }
  },

}
</script>

<style lang="scss" scoped>

</style>
