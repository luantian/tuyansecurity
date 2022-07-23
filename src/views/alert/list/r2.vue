<template>
<div style="width: 100%;" class="flex1">
  <div id="r2" style="width: 100%;height: 100%;"></div>
</div>
</template>

<script>
export default {
  props: ['info'],
  data() {
    return {

    }
  },
  watch: {
    info(val) {
      if (val.dr_month_count) {
        setTimeout(() => {
          this.makecir()
        }, 1000)
      }
    }
  },
  mounted() {

  },
  methods: {
    makecir() {
      var chartDom = document.getElementById('r2');
      var myChart = this.$echarts.init(chartDom, 'dark');
      var option;

      option = {
        backgroundColor: 'rgba(0,0,0,0)',

        grid: {
          top: '10%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.info.dr_month_count.map((it,i)=>{return i+1+'月'}),//['8月', '9月', '10月', '11月', '12月', '01月'],
          "axisLabel": {
            interval: 0
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: this.info.dr_month_count,//[130, 150, 80, 70, 110, 130],
          type: 'line'
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
