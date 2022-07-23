<template>
<div style="width: 100%;" class="flex1">
  <div id="l3" style="width: 100%;height: 100%;"></div>
</div>
</template>

<script>
export default {
  props: ['info'],
  data() {
    return {
      map:{
        yc:'用户传输装置',
        smoke:'烟感',
        bw:'无线燃气(丙烷)',
        camera:'摄像头',
        sw:'水位',
        sy:'水压',
        dq:'电气检测',
        ch4:'甲烷',
        co:'一氧化碳'
      }
    }
  },
  watch: {
    info(val) {
      if (val.dr_device_model_type_count) {
        setTimeout(() => {
          //console.log(this.$echarts)
          this.makecir()
        }, 1000)
      }
    }
  },
  mounted() {

  },
  methods: {
    makecir() {
      var chartDom = document.getElementById('l3');
      var myChart = this.$echarts.init(chartDom, 'dark');
      var option;

      option = {
        backgroundColor: 'rgba(0,0,0,0)',

        grid: {
          top: '10%',
          bottom: '18%',
          left: '40',
          rihgt: '20'
        },
        tooltip: {
          trigger: 'item'
        },
        xAxis: {
          type: 'category',
          data: this.info.dr_device_model_type_count.map(it=>{return this.map[it.dr_model_type]}),//['自动报警', '智慧用电', '无线设备', '智慧用水', '视频监控'],
          axisLabel: {
            show: true,
            interval: 0,
            rotate: -20,
            textStyle: {
              color: '#fff',
              fontSize: 10
            },
            
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.info.dr_device_model_type_count.map(it=>{return it.num}),//[120, 200, 30, 80, 29],
          type: 'bar',
          barWidth: 20
        }]
      };

      option && myChart.setOption(option);

      // this.$echarts.init(document.getElementById('r2')).setOption({
      //   grid: {
      //     top: '10%',
      //     bottom: '15%',
      //     left: '40',
      //     rihgt: '20'
      //   },
      //   xAxis: {
      //     type: 'category',
      //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      //   },
      //   yAxis: {
      //     type: 'value'
      //   },
      //   series: [{
      //     data: [120, 200, 150, 80, 70, 110, 130],
      //     type: 'bar'
      //   }]
      // }, 'dark');
    },
  }
}
</script>

<style lang="scss">
</style>
