<!--
 * @Author: your name
 * @Date: 2022-07-26 21:40:37
 * @LastEditTime: 2022-07-27 23:18:42
 * @LastEditors: your name
 * @Description: 
-->
<template>
  <div class="base-screen-wrap">
    <div class="screen-header header">智慧消防大屏监控中心</div>
  </div>

</template>

<script>
import centerMap from "./map";
import lineChart from "./lineChart.vue";
import PieChart from "./PieChart";
export default {
  components: {
    centerMap,
    lineChart,
    PieChart
  },
  data () {
    return {
      height: document.body.clientHeight / 1080
    }
  },
}
</script>

<style lang="scss" >
@import './index.scss';

.base-screen-wrap {
  font-family: segoe UI, PingFang SC, Microsoft Yahei, arial, Helvetica,
    'sans-serif';
  line-height: 1.428;
  font-weight: 500;
}
</style>
