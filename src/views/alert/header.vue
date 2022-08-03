<template>
<div>
  <!-- <el-dialog :close-on-click-modal="false" title="视频监控" :visible.sync="showVideo" v-if="showVideo" width="80vw"> -->
    <Videos />
  <!-- </el-dialog> -->
</div>
</template>

<script>
import Videos from "./video.vue";

export default {
  components:{Videos},
  data() {
    return {
      showVideo: false,
    }
  },
  mounted() {
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
#space {
  background-color: #010817;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

header {
  width: 100%;
  height: 6vw;
  //background: url(./img/bg_top.png) center no-repeat;
  text-align: center;
  font-size: 1.87vw;
  color: #52eef6;
  line-height: 6vw;
  margin: 0 auto;
  padding-bottom: 5px;
  position: relative;
  color: #fff;

  .h-title {
    letter-spacing: 3px;
    background: url('~@/assets/img/nav3.png') no-repeat center;
    background-size: contain;
    width: 29.6vw;
    height: 4.73vw;
    position: absolute;
    left: 50%;
    margin-left: -14.8vw;
    top: .5vw;
  }

  .nav-item {
    transition: all .3s;
    cursor: pointer;
  }

  .nav-item:hover {
    color: #fff;
  }

  .left-title,
  .right-title {
    position: absolute;
    top: 2.9vw;
    width: 35.4vw;
    height: 2.3vw;
    font-size: .73vw;
    line-height: 1.5;
    padding: 0 .6vw;
    justify-content: space-around;
    align-items: center;
  }

  .left-title {
    left: .6vw;
    background: url('~@/assets/img/nav1.png') no-repeat center;
    background-size: contain;
    padding-right: 2vw;
  }

  .right-title {
    padding-left: 2vw;
    right: .6vw;
    background: url('~@/assets/img/nav2.png') no-repeat center;
    background-size: contain;
  }
}

.pd0 {
  padding: 0 !important;
}

.center {
  flex: 2.5;
}

.h-warp {
  position: relative;
  z-index: 2;
}
</style>
