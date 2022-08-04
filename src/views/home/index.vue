<template>
<div class="home-root" id="gss">
  <cmap></cmap>
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
  data() {
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
      alarm_count:0
    }
  },
  created(){
    if(this.$bus.user.dr_is_admin==='commonly'){
      this.$router.replace('/alert')
    }
  },
  mounted() {
    this.tick()
    this.getAlarmList()
    this.getInfo()
    this.$get('/v1/dr/in-big-screen-count').then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    getCount(){
      this.$post('/v1/dr/notice-list-count',{dr_notice_status:1}).then(res=>{
        this.alarm_count = res.data.count
      })
    },
    open(url){
      window.open(url)
    },
    getInfo() {
      this.$get('/v1/dr/in-notice-map-count').then(res => {
        this.info = res.data
      })
    },
    clickDown(name) {
      if (name == 1) {
        this.showDia1 = true
      } else if (name == 2) {
        this.logout()
      }
    },
    /**
     * 登出
     */
    logout() {
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
    Submit() {
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
    handled() {
      this.showDia = false;
      this.$refs.map.handle()
      this.getAlarmList()
    },
    goMapUnit(it) {
      this.$refs.map.goUnit(it)
    },
    changeTab(tab, key) {
      this.activeUnit = tab;
      this.showUnitList = this.unitList[key]
    },
    searchUnit() {
      this.$post('/v1/dr/unit-search', {
        dr_unit_name: this.keyword,
        dr_status:1
      }).then(res => {
        this.unitList = res.data
        this.showSearch = true
        this.showUnitList = res.data.dr_detect_unit
      })
    },
    bjTest() {
      this.$post('/v1/dr/dr-industrial', 
      {
        "drDeviceId":"220325313001",
        "drDeviceType":"CH4",
        "drSensorNum":1,
        "drConcentration":"23.0",
        "drUnderreported":"20.0",
        "drReported":"50.0",
        "drRange":"100.0",
        "drMonitorUnit":"%LEL",
        "drConcentrationNum":"23.0%LEL",
        "drUnderreportedNum":"20.0%LEL",
        "drReportedNum":"50.0%LEL",
        "drRangeNum":"100.0%LEL",
        "drMonitorStatus":"低报",
        "drStatus":1,
        "drTag":5001,
        "drDetectorNum":0,
        "drUuid":"1650534129"
      })
    },
    newWarn(data) {
      this.getInfo()
    },
    getAlarmList() {
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
    showDetail(it) {
      this.nowUnit = {
        ...it
      }
      this.showDia = true
    },
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
  },
}
</script>

<style lang="scss" scoped>
@import "./index.scss";

.home-root .home-container {
  background: rgb(27, 32, 51);
}

.home-wrapper {
  height: calc(100vh - 80px);
}
</style>
