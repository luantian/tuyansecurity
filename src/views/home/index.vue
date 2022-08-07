<template>
  <div class="home-root"
       id="gss">
    <div class="home_main">
      <cmap></cmap>
      <!-- 头部提示 start-->
      <div class="home_main_top">
        <div class="today_warring top_item">
          <img src="../../assets/home-image/jingbao.png"
               alt="">
          <div class="top_content">
            <div class="content_title">今日报警</div>
            <div class="content_num">{{info && info.dr_today_notice_count || 0}}</div>
          </div>
        </div>
        <div class="today_yinhuan top_item">
          <img src="../../assets/home-image/yinhuan.png"
               alt="">
          <div class="top_content">
            <div class="content_title">今日隐患</div>
            <div class="content_num">{{info && info.dr_hidden_danger || 0}}</div>
          </div>
        </div>
        <div class="lianwang_unitnum top_item">
          <img src="../../assets/home-image/unit.png"
               alt="">
          <div class="top_content">
            <div class="content_title">联网单位数</div>
            <div class="content_num">{{info && info.dr_unit_count || 0}}</div>
          </div>
        </div>
        <div class="jiankong_num top_item">
          <img src="../../assets/home-image/jiankong.png"
               alt="">
          <div class="top_content">
            <div class="content_title">监控点数</div>
            <div class="content_num">{{info && info.dr_unit_count || 0}}</div>
          </div>
        </div>
        <div class="xiaofang_totalnum top_item">
          <img src="../../assets/home-image/xiaofang.png"
               alt="">
          <div class="top_content">
            <div class="content_title">消防设备总数</div>
            <div class="content_num">{{info && info.dr_device_count || 0}}</div>
          </div>
        </div>
      </div>
      <!-- 头部提示 end-->
      <!-- 右侧列表 start -->
      <div class="home_main_right">
        <div class="home_main_right_title">
          <div class="sline"></div>
          待处理报警 <div class="waring_num">{{alarm_count}}</div>
        </div>
        <div class="home_main_right_list">
          <el-scrollbar style="height:100%">
            <template v-for="item in $bus.warnInfo">
              <div class="list_item"
              @click="getPosition(item)"
                   :key="item.dr_unit_id">
                <div class="list_item_top">
                  <div class="time">
                    {{new Date(item.dr_create_time * 1000).Format('yy-MM-dd hh:mm:ss')}}
                  </div>
                  <div class="status">
                    未处理
                  </div>
                </div>
                <div class="list_item_main">
                  <div class="site">
                    <i class="iconfont icon-address"
                       style="color: #129CE0;margin-right:8px"></i>
                  </div>
                  <div class="specific_site">
                    {{item.dr_address+item.dr_unit_name+item.dr_device_name}}
                  </div>
                </div>
                <div class="list_item_bottom">
                  <div class="device">
                    <i class="iconfont icon-fireFightObj"
                       style="color: #129CE0;margin-right:8px"></i>
                    {{item.dr_device_serial}}发生报警
                  </div>
                  <div class="history"
                       @click.stop="goHistoryDetail()"
                       style="color: #129CE0;opacity: 0.64;">
                    历史报警 >
                  </div>
                </div>
              </div>

              <!-- <div class="list_item is_active">

              </div> -->
            </template>

          </el-scrollbar>

        </div>
      </div>
      <!-- 右侧列表 end -->
      <!-- 底部提示 start -->
      <div class="home_main_bottom">
        <div class="home_main_bottom_item"
             id="devicePie"></div>
        <div class="home_main_bottom_item"
             id="errDevicePie"></div>
        <div class="home_main_bottom_item"
             id="monitorPointPie"></div>
      </div>
      <!-- 底部提示 end -->
    </div>
    <!-- <el-dialog :close-on-click-modal="false" title="报警详情" :visible.sync="showDia" v-if="showDia" :width="(nowUnit.dr_camera_url||nowUnit.dr_notice_point)?'1000px':'500px'" top="9vh" @close="$refs.detail.video.dispose()">
    <aDetail :nowUnit="nowUnit" @finish="handled" ref="detail"></aDetail>
  </el-dialog> -->
  </div>
</template>

<script>
import cmap from './map'
import bheader from '../alert/header.vue'
import aDetail from './detail'
import electricity from '../wulian/electricity'
export default {
  components: {
    cmap,
    bheader,
    aDetail,
    electricity
  },
  data () {
    return {
      time: '',
      showDia: false,
      noticeList: [],
      showSearch: false,
      keyword: '',
      unitList: {},
      showUnitList: [],
      activeUnit: 1,
      nowUnit: {},
      info: null,
      showDia1: false,
      sform: {
        dr_login_pass: '',
        dr_login_pass_: ''
      },
      rules: {
        dr_login_pass: [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }],
        dr_login_pass_: [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }]
      },
      alarm_count: 0
    }
  },
  created () {
    if (this.$bus.user.dr_is_admin === 'commonly') {
      this.$router.replace('/alert')
    }
  },
  mounted () {
    this.getAlarmList()
    this.getInfo()
  },
  methods: {
    goHistoryDetail () {
      this.$router.push({ path: '/equipment/noticeList' })
    },
    getCount () {
      this.$post('/v1/dr/notice-list-count', { dr_notice_status: 1 }).then(res => {
        this.alarm_count = res.data.count
      })
    },
    open (url) {
      window.open(url)
    },
    getInfo () {
      this.$get('/v1/dr/in-notice-map-count').then(res => {
        this.info = res.data;
        this.setDevicePie(this.info);
        this.setErrDeveicePie(this.info);
        this.setMonitorPointPie(this.info)
      })
    },
    clickDown (name) {
      if (name == 1) {
        this.showDia1 = true
      } else if (name == 2) {
        this.logout()
      }
    },
    /**
     * 登出
     */
    logout () {
      this.$db.remove('user')
      this.$db.remove('token')
      this.$bus.user = {}
      this.$router.replace({
        path: '/login'
      });
    },
    /**
     * 修改密码提交操作
     */
    Submit () {
      let _this = this
      this.$refs.sform.validate((valid) => {
        if (valid) {
          if (this.sform.dr_login_pass === this.sform.dr_login_pass_) {
            this.showDia1 = false
            this.$post('/v1/dr/update-user', {
              dr_login_pass: this.sform.dr_login_pass,
              dr_user_uuid: this.$bus.user.dr_user_uuid
            }).then(res => {
              this.$message.success('修改成功')
              this.sform = {
                dr_login_pass: '',
                dr_login_pass_: ''
              }
            }).catch(err => {
              this.$message.error('修改失败')
            })
          } else {
            this.$message.error('两次密码不一致！')
          }

        } else {
          return false
        }
      })

    },
    getPosition (unit) {
      console.log(unit);
      this.$get(`/v1/dr/get-device-detail/${unit.dr_id}`).then(res => {
        // 打点
        console.log(res)
      })
      // this.$get(`/v1/dr/unit-detail/${unit.dr_id }/2`).then(res => {
      //   console.log(res)
      // })
      // dr_id
    },
    handled () {
      this.showDia = false;
      this.$refs.map.handle()
      this.getAlarmList()
    },
    goMapUnit (it) {
      this.$refs.map.goUnit(it)
    },
    changeTab (tab, key) {
      this.activeUnit = tab;
      this.showUnitList = this.unitList[key]
    },
    searchUnit () {
      this.$post('/v1/dr/unit-search', {
        dr_unit_name: this.keyword,
        dr_status: 1
      }).then(res => {
        this.unitList = res.data
        this.showSearch = true
        this.showUnitList = res.data.dr_detect_unit
      })
    },
    bjTest () {
      this.$post('/v1/dr/dr-industrial',
        {
          "drDeviceId": "220325313001",
          "drDeviceType": "CH4",
          "drSensorNum": 1,
          "drConcentration": "23.0",
          "drUnderreported": "20.0",
          "drReported": "50.0",
          "drRange": "100.0",
          "drMonitorUnit": "%LEL",
          "drConcentrationNum": "23.0%LEL",
          "drUnderreportedNum": "20.0%LEL",
          "drReportedNum": "50.0%LEL",
          "drRangeNum": "100.0%LEL",
          "drMonitorStatus": "低报",
          "drStatus": 1,
          "drTag": 5001,
          "drDetectorNum": 0,
          "drUuid": "1650534129"
        })
    },
    newWarn (data) {
      this.getInfo()
    },
    getAlarmList () {
      this.getCount()
      this.$post('/v1/dr/notice-list', {
        page: 1,
        dr_notice_status: 1
      }).then(res => {
        console.log('res', res.data.list, res.data.list.length)
        this.$bus.warnInfo = res.data.list;
        // this.$bus.warnInfo = res.data.list.slice(0, 4);
        console.log(this.$bus.warnInfo.length)
      })
    },
    showDetail (it) {
      this.nowUnit = {
        ...it
      }
      this.showDia = true
    },
    /**
     * 设备饼状图
     */
    setDevicePie (info) {
      var myChart = this.$echarts.init(document.getElementById('devicePie'));
      let data = [
        {
          "name": "正常",
          "value": info.dr_device_normal_count || 0
        },
        {
          "name": "待续费",
          "value": info.dr_device_pay_count || 0
        },
        {
          "name": "异常",
          "value": info.dr_device_abnormal_count || 0,
        }]
      let count = 0;
      data.forEach(item => count = count + item.value)
      let option = {
        color: ['#00D7DF', '#014e85', "#e9410b"],
        title: {
          text: '设备',
          // subtext: count,
          subtext: `${count}`,
          textStyle: {
            color: '#c4cfd2',
            fontSize: 13,
            align: 'center',
            verticalAlign: 'top',
            fontFamily: 'PingFang SC'
          },
          subtextStyle: {
            fontSize: 20,
            color: ['#c4cfd2'],
            align: 'center'
          },
          left: 'center',
          // top: '30%', //top待调整
          top: '40%',
          itemGap: 3
        },
        series: [
          // 主要展示层的
          {
            clockWise: false,
            // radius: ['40%', '45%'],
            radius: [40, 53],
            center: ['50%', '50%'],
            type: 'pie',
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
                formatter: function (name) {
                  let total = 0;
                  let tarValue;
                  for (let index = 0; index < data.length; index++) {
                    total += data[index].value;
                    if (name === data[index].name) {
                      tarValue = data[index].value
                    }
                  }
                  let num = Math.round((tarValue / total) * 100)
                  return (name + '\n' + num + '%');
                  // return (name +'  ' + num + '%');
                },
                textStyle: {
                  fontSize: 13,
                },
                position: 'outside'
              },
              emphasis: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false,
                length: 30,
                length2: 55
              },
              emphasis: {
                show: true
              }
            },
            // name: "在用运输车",
            data: data,
          }
        ]
      };

      myChart.setOption(option);
    },
    /**
     * 异常设备饼状图
     */
    setErrDeveicePie (info) {
      let myChart = this.$echarts.init(document.getElementById('errDevicePie'));
      let data = [{
        "name": "低电压",
        "value": 0
      },
      {
        "name": "故障",
        "value": info.dr_device_gz_count || 0
      },
      {
        "name": "离线",
        "value": info.dr_device_not_online_count || 0,
      }]
      let count = 0;
      data.forEach(item => count = count + item.value)
      let option = {
        color: ['#1a5aef', "#ed6f04", '#004974'],
        title: {
          text: '异常设备',
          subtext: `${count}`,
          textStyle: {
            color: '#c4cfd2',
            fontSize: 13,
            align: 'center',
            verticalAlign: 'top',
            fontFamily: 'PingFang SC'
          },
          subtextStyle: {
            fontSize: 20,
            color: ['#c4cfd2'],
            align: 'center'
          },
          left: 'center',
          // top: '30%', //top待调整
          top: '40%',
          // top: 47,
          itemGap: 3
        },
        series: [
          // 主要展示层的
          {
            clockWise: false,
            // radius: ['40%', '45%'],
            radius: [40, 53],
            center: ['50%', '50%'],
            type: 'pie',
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
                formatter: "{a} {b}",
                textStyle: {
                  fontSize: 13,
                },
                position: 'outside'
              },
              emphasis: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false,
                length: 30,
                length2: 55
              },
              emphasis: {
                show: false
              }
            },
            // name: "在用运输车",
            data: data,
          },
        ]
      };

      myChart.setOption(option);
    },
    /**
     * 监控点饼状图
     */
    setMonitorPointPie (info) {
      let myChart = this.$echarts.init(document.getElementById('monitorPointPie'));
      let data = [{
        "name": "在线",
        "value": info.dr_device_online_count || 0
      }, {
        "name": "离线",
        "value": info.dr_device_not_online_count || 0,
      }]
      let count = 0;
      data.forEach(item => count = count + item.value)
      let option = {
        color: ['#00e2c9', '#006c82', "#e9410b"],
        title: {
          text: '监控点',
          subtext: `${count}`,
          textStyle: {
            color: '#c4cfd2',
            fontSize: 13,
            align: 'center',
            verticalAlign: 'top',
            fontFamily: 'PingFang SC'
          },
          subtextStyle: {
            fontSize: 20,
            color: ['#c4cfd2'],
            align: 'center'
          },
          left: 'center',
          // top: '30%', //top待调整
          top: '40%',
          itemGap: 3
        },
        series: [
          // 主要展示层的
          {
            clockWise: false,
            // radius: ['40%', '45%'],
            radius: [40, 53],
            center: ['50%', '50%'],
            type: 'pie',
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
                formatter: (name) => {
                  let total = 0;
                  let tarValue;
                  for (let index = 0; index < data.length; index++) {
                    total += data[index].value;
                    if (name === data[index].name) {
                      tarValue = data[index].value
                    }
                  }
                  let num = Math.round((tarValue / total) * 100)
                  return (name + '\n\n' + num + '%');
                  // return (name +'  ' + num + '%');
                },
                textStyle: {
                  fontSize: 13,
                },
                position: 'outside'
              },
              emphasis: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false,
                length: 30,
                length2: 55
              },
              emphasis: {
                show: true
              }
            },
            // name: "在用运输车",
            data: data,
          },
        ]
      };

      myChart.setOption(option);
    }
  },
}
</script>

<style lang="scss" scoped>
@import './index.scss';

.home-root .home-container {
  background: rgb(27, 32, 51);
}

.home-wrapper {
  height: calc(100vh - 80px);
}
.home-root {
  position: relative;
}
.home_main {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  .home_main_top {
    position: absolute;
    left: 135px;
    top: 38px;
    width: 1086px;
    height: 72px;
    background-image: url('../../assets/home-image/top_area.png');
    background-repeat: no-repeat;
    background-size: 100%;
    z-index: 1;
    display: flex;
    align-items: center;
    .top_item {
      display: flex;
      height: 72px;
      align-items: center;
      // justify-content: center;
      img {
        width: 50px;
        height: 46px;
        margin-right: 20px;
      }
      .top_content {
        display: flex;
        flex-direction: column;
        height: 46px;
        justify-content: space-between;
        .content_title {
          height: 14px;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #ffffff;
          line-height: 20px;
          margin-bottom: 7px;
        }
        .content_num {
          font-size: 24px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #ffffff;
          text-shadow: 0px 0px 16px rgba(0, 0, 0, 0.16);
        }
      }
      &.today_warring {
        padding-left: 51px;
        width: 228px;
        border-right: 1px solid #1e323f;
      }
      &.today_yinhuan {
        padding-left: 27px;
        // width: 228px;
        flex: 1;
      }
      &.lianwang_unitnum {
        padding-left: 27px;
        // width: 228px;
        flex: 1;
      }
      &.jiankong_num {
        width: 210px;
        padding-left: 25px;
        border-right: 1px solid #1e323f;
        border-left: 1px solid #1e323f;
      }
      &.xiaofang_totalnum {
        width: 224px;
        padding-left: 21px;
      }
    }
  }
  .home_main_right {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 349px;
    height: 100%;
    background: rgba(0, 12, 18, 0.92);
    box-shadow: -5px 0px 21px 0px rgba(13, 98, 140, 0.58);
    z-index: 1;
    .home_main_right_title {
      width: 100%;
      height: 53px;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      padding: 0px 22px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .sline {
        width: 6px;
        height: 18px;
        background: #12cfe0;
        border-radius: 2px;
        margin-right: 12px;
      }
      .waring_num {
        display: inline-block;
        padding: 0px 8px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background: #ca4630;
        border-radius: 10px;
        margin-left: 12px;
      }
    }
    .home_main_right_list {
      width: 100%;
      height: calc(100% - 53px);
      .list_item {
        cursor: pointer;
        position: relative;
        box-sizing: border-box;
        min-height: 92px;
        border-top: 1px solid #053b44;
        border-bottom: 1px solid #053b44;
        padding: 17px 23px;
        &.is_active {
          background: rgba(0, 41, 61, 0.5);
          box-shadow: 0px 1px 0px 0px rgba(12, 119, 140, 0.38);
        }
        &:before {
          content: ' ';
          position: absolute; //定位边框的位置
          top: 14px;
          left: 0;
          height: calc(100% - 28px);
          width: 2px;
          background: #e96553;
        }
        .list_item_top {
          display: flex;
          justify-content: space-between;
          .time {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #ffffff;
          }
          .status {
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #ffffff;
          }
        }
        .list_item_main {
          display: flex;
          font-size: 13px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #ffffff;
          opacity: 0.64;
          margin: 10px 0px;
        }
        .list_item_bottom {
          display: flex;
          justify-content: space-between;
          .device {
            font-size: 13px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #ffffff;
            opacity: 0.64;
          }
        }
      }
    }
  }
  .home_main_bottom {
    position: absolute;
    left: 144px;
    bottom: 0px;
    width: 1062px;
    height: 166px;
    display: flex;
    background-image: url('../../assets/home-image/bottom_area.png');
    background-repeat: no-repeat;
    background-size: 100%;
    z-index: 1;
    .home_main_bottom_item {
      flex: 1;
    }
  }
}
</style>
