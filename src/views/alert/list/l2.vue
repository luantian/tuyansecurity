<template>
  <div style="width: 100%;" class="flex1">
    <div id="l2" style="width: 100%;height: 100%;"></div>
  </div>
</template>
<script>
export default {
  props:['info'],
  data() {
    return {

    }
  },
  watch:{
    info(val){
      if(val.dr_device_off_online_count){
        setTimeout(() => {
          this.makecir()
        }, 700);
      }
    }
  },
  mounted() {
    // setTimeout(() => {
    //   //console.log(this.$echarts)
      
    // }, 1000)
  },
  methods: {
    makecir() {
      var chartDom = document.getElementById('l2');
      var myChart = this.$echarts.init(chartDom, 'dark');
      var option;

      option = {
        backgroundColor: 'rgba(0,0,0,0)',
        tooltip: {
          trigger: 'item'
        },
        series: [{
          name: '设备状态统计',
          type: 'pie',
          radius: '65%',
          center: ['50%', '50%'],
          data: [
            { value: this.info.dr_device_on_online_count, name: '在线' },
            { value: this.info.dr_device_off_online_count, name: '离线' },
          ]
        }]
      };

      option && myChart.setOption(option);

    },
  }
}

</script>

