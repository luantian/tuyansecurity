<template>
<div style="width: 100%;" class="flex1">
  <div id="r3" style="width: 100%;height: 100%;"></div>
</div>
</template>

<script>
export default {
  props: ['info'],
  data() {
    return {
map:{
        alarm:'警报',
        camera:'摄像头',
        co:'一氧化碳'
      }
    }
  },
  watch: {
    info(val) {
      if (val.dr_month_notice_type_count) {
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
      var chartDom = document.getElementById('r3');
      var myChart = this.$echarts.init(chartDom, 'dark');
      var option;

      option = {
        backgroundColor: 'rgba(0,0,0,0)',
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.info.dr_month_notice_type_count[0].map((it,index)=>{return this.map[it.dr_model_type]}),//['邮件营销', '联盟广告', '视频广告']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top:'30',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.info.dr_month_notice_type_count.map((it,i)=>{return i+1+'月'})//['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: this.info.dr_month_notice_type_count[0].map((it,index)=>{return {
          name:this.map[it.dr_model_type],
          type:'line',
          stack: '报警数量',
          data:this.info.dr_month_notice_type_count.map(im=>{
            return im[index].dr_num
          })
        }})

        // [{
        //     name: '邮件营销',
        //     type: 'line',
        //     stack: '总量',
        //     data: [120, 132, 101, 134, 90, 230, 210]
        //   },
        //   {
        //     name: '联盟广告',
        //     type: 'line',
        //     stack: '总量',
        //     data: [220, 182, 191, 234, 290, 330, 310]
        //   },
        //   {
        //     name: '视频广告',
        //     type: 'line',
        //     stack: '总量',
        //     data: [150, 232, 201, 154, 190, 330, 410]
        //   }
        // ]
      };

      option && myChart.setOption(option);

    },
  }
}
</script>
