<template>
<div>
  <header id="header">
    <canvas id="space"></canvas>
    <div class="h-warp">
      <div class="h-title center">{{$bus.user.dr_unit_platform_name || '智慧消防平台'}}</div>
      <div class="left-title flex">
        <div class="nav-item" @click="$router.push('/alarm')">报警系统</div>
        <div class="nav-item" @click="$router.push('/wulian?tab=2')">智慧用电</div>
        <div class="nav-item" @click="$router.push('/wulian?tab=1')">消防水系统</div>
        <div class="nav-item" @click="showVideo=true">视频监控</div>
      </div>
      <div class="right-title flex">
        <div class="nav-item" @click="$router.push('/polling')">安全巡检</div>
        <div class="nav-item" @click="$router.push('/area/areaManagement')">单位管理</div>
        <div class="nav-item" @click="$router.push('/area/areaManagement')">跳转后台</div>
      </div>
      <span id=localtime style="font-size:.9vw; position: absolute; right: 1.5vw; top:1.2vw; line-height:1" v-html="time"></span>
    </div>
  </header>
  <el-dialog :close-on-click-modal="false" title="视频监控" :visible.sync="showVideo" v-if="showVideo" width="80vw">
    <Videos />
  </el-dialog>
</div>
</template>

<script>
import $ from "jquery";
import Videos from "./video.vue";

export default {
  components:{Videos},
  data() {
    return {
      showVideo: false,
      time: ''
    }
  },
  mounted() {
    this.creatTop();
    this.tick()
  },
  methods: {
    tick() {
      var today;
      today = new Date();
      this.time = this.showLocale(today);
      window.setTimeout(this.tick, 1000);
    },
    showLocale(objD) {
      var str, colorhead, colorfoot;
      var yy = objD.getYear();
      if (yy < 1900) yy = yy + 1900;
      var MM = objD.getMonth() + 1;
      if (MM < 10) MM = '0' + MM;
      var dd = objD.getDate();
      if (dd < 10) dd = '0' + dd;
      var hh = objD.getHours();
      if (hh < 10) hh = '0' + hh;
      var mm = objD.getMinutes();
      if (mm < 10) mm = '0' + mm;
      var ss = objD.getSeconds();
      if (ss < 10) ss = '0' + ss;
      var ww = objD.getDay();
      if (ww == 0) colorhead = "<font color=\"#ccc\">";
      if (ww > 0 && ww < 6) colorhead = "<font color=\"#ccc\">";
      if (ww == 6) colorhead = "<font color=\"#ccc\">";
      if (ww == 0) ww = "星期日";
      if (ww == 1) ww = "星期一";
      if (ww == 2) ww = "星期二";
      if (ww == 3) ww = "星期三";
      if (ww == 4) ww = "星期四";
      if (ww == 5) ww = "星期五";
      if (ww == 6) ww = "星期六";
      colorfoot = "</font>"
      str = colorhead + yy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss + "  " + ww + colorfoot;
      return (str);
    },
    creatTop() {
      var canvas;
      var context;
      var screenH;
      var screenW;
      var stars = [];
      var fps = 60;
      var numStars = 1000;
      // Calculate the screen size
      screenH = $('#header').height();
      screenW = $('#header').width();

      // Get the canvas
      canvas = $('#space');

      // Fill out the canvas
      canvas.attr('height', screenH);
      canvas.attr('width', screenW);
      context = canvas[0].getContext('2d');

      // Create all the stars
      for (var i = 0; i < numStars; i++) {
        var x = Math.round(Math.random() * screenW);
        var y = Math.round(Math.random() * screenH);
        var length = 1 + Math.random() * 1.2;
        var opacity = Math.random();

        // Create a new star and draw
        var star = new Star(x, y, length, opacity);

        // Add the the stars array
        stars.push(star);
      }

      setInterval(animate, 1000 / fps);

      /**
       * Animate the canvas
       */
      function animate() {
        context.clearRect(0, 0, screenW, screenH);
        $.each(stars, function () {
          this.draw(context);
        })
      }

      /**
       * Star
       *
       * @param int x
       * @param int y
       * @param int length
       * @param opacity
       */
      function Star(x, y, length, opacity) {
        this.x = parseInt(x);
        this.y = parseInt(y);
        this.length = parseInt(length);
        this.opacity = opacity;
        this.factor = 1;
        this.increment = Math.random() * .03;
      }

      /**
       * Draw a star
       *
       * This function draws a start.
       * You need to give the contaxt as a parameter
       *
       * @param context
       */
      Star.prototype.draw = function () {
        context.rotate((Math.PI * 1 / 10));

        // Save the context
        context.save();

        // move into the middle of the canvas, just to make room
        context.translate(this.x, this.y);

        // Change the opacity
        if (this.opacity > 1) {
          this.factor = -1;
        } else if (this.opacity <= 0) {
          this.factor = 1;

          this.x = Math.round(Math.random() * screenW);
          this.y = Math.round(Math.random() * screenH);
        }

        this.opacity += this.increment * this.factor;

        context.beginPath()
        for (var i = 5; i--;) {
          context.lineTo(0, this.length);
          context.translate(0, this.length);
          context.rotate((Math.PI * 2 / 10));
          context.lineTo(0, -this.length);
          context.translate(0, -this.length);
          context.rotate(-(Math.PI * 6 / 10));
        }
        context.lineTo(0, this.length);
        context.closePath();
        context.fillStyle = "rgba(255, 255, 255, " + this.opacity + ")";
        context.shadowBlur = 5;
        context.shadowColor = '#ffff33';
        context.fill();

        context.restore();
      }
    },
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
