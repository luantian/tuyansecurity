<template>
  <div class="pie"
       :id="pieId"></div>
</template>

<script>
export default {
  name: 'percentPieChart',
  props: {
    pieId: {
      type: String,

    },
    data: {
      type: String | Number
    }
  },
  data () {
    return {
      chartPie: null
    }
  },
  methods: {
    initPieChart (precentNum) {
      let percent = precentNum;
      let data = [{
        value: percent,
        itemStyle: {
          normal: {
            color: '#FF8E43',
            shadowBlur: 10,
            shadowColor: '#fb358a'
          }
        }
      }, {
        value: 1 - percent,
        itemStyle: {
          normal: {
            color: '#0B283F'
          }
        }
      }];
      let option = {
        // backgroundColor: '#000',
        title: {
          text: (percent * 100) + '%',
          textStyle: {

            color: '#F6FFFF',
            fontWeight: 'bolder',
            fontSize: 11,
          },
          top: 'center',
          left: 'center'
        },
        series: [
          {
            type: 'pie',
            radius: ['0%', '80%'],
            silent: true,
            label: {
              normal: {
                show: false,
              }
            },

            data: [{
              value: 1,
              itemStyle: {
                normal: {
                  color: '#0B283F',
                  // shadowBlur: 5,
                  shadowBlur: 50,
                  shadowColor: '#1b1e25'
                }
              }
            }],

            animation: false
          },
          {
            type: 'pie',
            radius: ['80%', '90%'],
            silent: true,
            label: {
              normal: {
                show: false,
              }
            },

            data: [{
              value: 1,
              itemStyle: {
                normal: {
                  color: '#000',
                  // shadowBlur: 5,
                  shadowBlur: 50,
                  shadowColor: '#1b1e25'
                }
              }
            }],

            animation: false
          },

          {
            name: 'main',
            type: 'pie',
            radius: ['95%', '100%'],
            label: {
              normal: {
                show: false,
              }
            },
            data: data,

            animationEasingUpdate: 'cubicInOut',
            animationDurationUpdate: 500
          },
        ]
      };
      this.chartPie = this.$echarts.init(document.getElementById(this.pieId))
      this.chartPie.setOption(option);
      // window.addEventListener('resize', function () {
      //   //宽度自适应
      //   this.chartPie.resize();
      // });
    }
  },
  mounted () {
    this.initPieChart(this.data);
  },
  beforeDestroy () {
    this.chartPie = null
  }
}
</script>

<style>
</style>