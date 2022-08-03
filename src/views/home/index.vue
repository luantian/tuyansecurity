<template>
<div class="home-root" id="gss">
  <div>
    <!-- <bheader></bheader> -->
    <div class="app-header-container is-fixed" style="left: 0px;">
      <div class="app-header-content">
        <div class="header-logo-title">
          <div class="app-logo-container"><img :src="$bus.user.dr_unit_logo" class="logo-img">
            <div class="logo-name">{{$bus.user.dr_unit_platform_name || '智慧消防平台'}}</div>
          </div>
          <div class="user-handler-help-wrap">
            <a href="/#/monitorCenter" target="_blank">
              <div class="go-monitor-center-btn">大屏监控</div>
            </a>
            <div id=localtime class="ml10" style="font-size:12px;width:170px;margin-right:10px" v-html="time"></div>
            <el-dropdown class="avatar-container" trigger="hover" @command="clickDown">
              <div class="avatar-wrapper align-center cursor">
                <i class="el-icon-user-solid" style="color:#fff;font-size:18px"></i>
                <span class="c-f ml5">{{ $bus.user.dr_user_name||'' }}</span>
              </div>
              <el-dropdown-menu slot="dropdown" class="user-dropdown">
                <el-dropdown-item command="1">修改密码</el-dropdown-item>
                <el-dropdown-item command="2">退出登录</el-dropdown-item>
                <!-- <el-dropdown-item command="2">返回系统选取页</el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
            <el-dialog :close-on-click-modal="false" title="修改密码" :visible.sync="showDia1" width="500px" :append-to-body="true">
              <el-form ref="sform" :model="sform" label-width="80px" :rules="rules">
                <el-form-item label="密码" prop="dr_login_pass">
                  <el-input v-model="sform.dr_login_pass" size="small" type="password" clearable></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="dr_login_pass_">
                  <el-input v-model="sform.dr_login_pass_" size="small" type="password" clearable></el-input>
                </el-form-item>
              </el-form>
              <div class="center mt20">
                <el-button type="primary" @click="Submit" size="small">保存</el-button>
                <el-button @click="showDia1 = false" size="small">取消</el-button>
              </div>
            </el-dialog>
          </div>
        </div>
        <div class="header-menu-list">
          <div class="app-header-nav">
            <div class="nav-item active">
              <div data-index="0" class="nav-item-title">
                首页
              </div>
            </div>
            <div class="nav-item" @click="open('/#/alarm')">
              <div data-index="2" class="nav-item-title">
                数据监测
              </div>
            </div>
            <div class="nav-item" @click="$router.push('/area/areaManagement')">
              <div data-index="5" class="nav-item-title">
                单位管理
              </div>
            </div>
            <div class="nav-item" @click="$router.push('/check')">
              <div data-index="5" class="nav-item-title">
                日常检查
              </div>
            </div>
            <!-- <div class="nav-item">
              <div data-index="7" class="nav-item-title">
                数据中心
                <i class="el-icon-arrow-down"></i></div>
              <div data-index="7" class="sub-nav">
                <div class="sub-nav-item">
                  报警信息
                </div>
                <div class="sub-nav-item">
                  隐患信息
                </div>
                <div class="sub-nav-item">
                  报警统计
                </div>
                <div class="sub-nav-item">
                  设备统计
                </div>
                <div class="sub-nav-item">
                  运营报表
                </div>
              </div>
            </div> -->
            
          </div>
        </div>
      </div>
    </div>
    <div class="home-container">
      <div class="home-wrapper">
        <cmap ref="map" @warn="newWarn" @showDetail="showDetail"></cmap>

        <div class="left-side-warp">
          <div class="today-num-wrap" style="margin-bottom: 10px;">
            <div class="content-wrap"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAhCAYAAAC4JqlRAAAABGdBTUEAALGPC/xhBQAAAsdJREFUWAntVk9rE0EUf2+3MV0oImg2asQKHgSRevLkH4oHLz1IU6NWK72IH0ARFE0cE0tR/PMBFFQMVoxNQQWvRfTirf0EXhSzCSJSSZt2ZnyTNEvYzW7Nbgse8g6Zmffe7/deZua9HYCuhNwBKSWGpAgOLw3femAlM2+DMwBoYcCIsl8C9Ifh6PECl4fZWdrcXrPInnn5UALzIOGPl13py6fYoARhmG+yH9r5ee4AgQ4A8CdWkh1rB1S62HQuaxZz4172ciq3Twj+Xgo47+XjuQOxni0T5ZVfQxLFcQJ/dBJYKbYdgSeA61Lq8N0ssB9OH8FrJ+mG/kaIXnXammvfG6xuOAkdc0MqqTsJLmpXQMAwgNzT1DdG/AqARb0n8nBb4eY3patXyOlHvVi4XG34uH99E2h1t0bS16SEDJ250ap3zRGqKPG2OZO967K1UayZgGRMs+ZEnv7PaBu8twrhpTmgX0DGhLfTP5ShNS/udRxcRZRwroH1C0+H5mcuJdOHieiTn8+aNoQj8WLus5dfvQpKZ3J7cXn5uoba7FYNXmOB1RSAznJSUgZhRHEQ3i7lSjJ9iCMOGpu0p5unWKXRB2qyj5yGuOAvyoJfUgF/pthuCn5UzcOI4lBciqOcZBe5hC8o5eTiEuxXunoC8ZnMXGxAS0Q0/WBsZ+yxMnAOJ9S4HtLkMqKRdxroo4Zu7KAOW+8tdiNava3zzYCUeage3+RRY5Orb+pGiZavWm2NI2jVrM4JFGujDqTy4/JMgPL2rZDOMvHm8kmgsxBBvbsJdHeguwN2J3SWEaK2SL1gwakPtEYkrv9UXN1uYXQiXl1aGtuIfI1oNL/6PbDpXUdQXVncJSTctz3WcULcs0SnPki2uKpA43qJXsK+7zgb3cFEcSpuJ8R1BMrBGsmM05N6jF4zEScgyFqiXKYE8uZ09nkQ/IZi/gLf1+lInh43+QAAAABJRU5ErkJggg==" alt="ico_home_risks">
              <div>
                <div class="label">今日报警</div>
                <div class="value">{{info&&info.dr_today_notice_count || 0}}</div>
              </div>
            </div>
            <div class="content-wrap"><img @click="bjTest" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAhCAYAAAC4JqlRAAAABGdBTUEAALGPC/xhBQAABNBJREFUWAntVltvVUUUnjV7n55SCcQ3LzHyaGJIlJgoPKmJkRhUYvCILVoScnjh0eiLv0CDxhcoUhKPKRALiERMvMR4iwkhMd7iJSL46I0YTGmxPZcZv2/NzOk+l9KDPugD057O7Jm1vvWtb609PcZcHf+xAvJv4i8cG7/VOLPZGXtqReWVD/4J1hUT8Cd3jszPzlas2KozZoMXMYKPMXJGrN1XHh6uyaaJC4OSGZhA/bXH1hnvq97YUQReFYJa4w0gLGG4Bg0jfxmbTWcm2ze0Zf/p5YhcloA/OLaqYS6NArbqxKwzYjUEZw3M4LrHbZzpflzrmXwhtjQxfM3Kw3L/7rl+ZPoSaEw9DGldVbxUkO1IAkeEEJiSI5iIfV5MNt0S97TxsjXYRRsoAgO1R7lmvLVTWZ5PlB/a822RSA+Beu2BA8De4XysbSErZo2gCorVD+Wxo7cQzH+4fbj+e/NPkC2TZLcSyU/5Z/aZkc0v704kqGnHsKY15j1dUFHM3jtC6pp74RnnYs4nR7mnNm+cmzWwhSF+6RPmzrUR3/Qo6eLoIYAQMwGIYBGoDRaJ4dn51iKKrnAGwiCiBEg+EVIyxCCeAL8wegjA6Tc6ECxl7l1LMypmpY1fADJKiEECScXAE3GoGveVlHO/FN16CCDoTzSkU5Jbg6WMdAZYi8GKgwEWs9egMXCbuCpgzhW98uID1wh9TjPXg8SeO+CKGHwBUAC1VJP4h0G0d9CktBDyoZuSiM1LzpnrINBHAf+lh5wKiHq22StQkjL1RozOSc91EddBkeAf11AvM/J5wYtpdY7MyulQglBLrpmIAlECBNJmYzbFoXbMnAfRjnP80B+fuVJz4zdFtx4C5sn3f7TiLwgDRSDf7uygAAkF4CIUt2LftEmAQPRlefDzmVQqHa9PDwHc8bR8Vx0iiZS9KkEgBjLuJn/k0UypHBq9Fl25mqSSrZYEdmkvvFXurS7KvSVQQN86HrJPEgKIWREwkjKudXNjfu5Q8+CmLU138YR3PtdzNmiySYRUEezn5ng3gaBm164/cvdKN9M6j3yGte21s2Ea7/alr1rC4apWO5rHa5v+Yr8qPz59W1eo/gpI5aNZpHG4KGe6FxZVAGZRkbjmbacKqGKhJHqfOLe3Ozife3ogGVlnngOQC00UgLQHaJCCifkYPfMUEv4Om/gN/dFBnK+y+J9LJVNL2MV5SQKy89MzMDwWeiFkxcCaDQ7EuF9zd8PG0vg7L+al0n1oXXxlANFC5iTFnkYhXpDK0XoxcFovSYAGVkrPAuSiAnMDBBIh3G0Ns2ZNk9umni1Aerw4IKpKxDKQgPNf59ev7is/Xfs2IQ/S8JMbtrW8n2o3lA2NxaKIsSdMnr2ON2AXUr1LGxCObVuxl/Kh0h2y9Y3vE173vCwBOrQm19fQ2uNAZk6MgA/FCzNf1uJz2AdBm1fzJ04e4PFS47IlSE729rVVFHe/yqsU4p2ANf9vsPm0NO1n1wC1HcsFJz7sBh9+cv0ufFV7CQrki2oEJbQkVMXKH5mxj8j29z4ZBHkgBRKQVE/tsbm7E9niSnVMX7NncwJoQcTtzbJs7aDBiXtFCiQinP2r995omo0H8V5c58WezYZWvCnb3u74ulW0v7r+3yrwNwo9oHX0KDnxAAAAAElFTkSuQmCC" alt="ico_home_risks">
              <div>
                <div class="label">今日隐患</div>
                <div class="value">{{info&&info.dr_hidden_danger||0}}</div>
              </div>
            </div>
            <div class="bar"></div>
          </div>
          <div class="search-input-wrap">
            <el-input placeholder="单位搜索" size="normal" v-model="keyword" clearable @keyup.enter.native="searchUnit" @clear="showSearch=false">
              <i slot="suffix" class="el-input__icon el-icon-search" @click="searchUnit"></i>
            </el-input>

          </div>

          <div class="panel">
            <div class="untreated-alarm-wrap untreated-alarm">
              <div v-show="!showSearch">
                <div class="title-wrap"><span class="title">待处理报警</span><span class="untreated-alarm-num">{{alarm_count}}</span>
                  <!-- <span class="h-icon-angles_up_sm toggle-btn"></span> -->
                  <div style="width:35px"></div>
                </div>
                <div class="alarm-content-wrap">
                  <div class="result-content">
                    <el-scrollbar style="height:100%">
                      <div class="result-item-wrap">
                        <div class="center" v-if="!$bus.warnInfo.length">暂无未处理报警</div>
                        <div class="result-item" v-if="$bus.warnInfo.length" v-for="item in $bus.warnInfo" :key="item.dr_notice_uuid">
                          <div class="result-title-wrap">
                            <div class="result-title-left"><i class="el-icon-bell"></i><span class="result-title">未处理报警</span></div>
                            <div class="detail-button-wrap" @click="showDetail(item)"><i class="detail-button el-icon-document"></i></div>
                          </div>
                          <div class="result-table-wrap">
                            <div class="result-table">
                              <div>{{new Date(item.dr_create_time * 1000).Format('yy-MM-dd hh:mm:ss')}}</div>
                              <div :title="item.dr_address+item.dr_unit_name+item.dr_device_name">{{item.dr_address+item.dr_unit_name+item.dr_device_name}}</div>
                              <div :title="item.dr_device_serial">
                                {{item.dr_device_serial}}发生报警
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </el-scrollbar>

                  </div>
                </div>
              </div>
              <div v-show="showSearch">
                <div class="search-result">
                  <div class="content">
                    <div class="tabs">
                      <div :class="`tabs-item ${activeUnit==1?'is-active':''}`" @click="changeTab(1,'dr_detect_unit')">
                        单位({{unitList.dr_detect_num}})
                        <div class="active-bar"></div>
                      </div>
                      <div :class="`tabs-item ${activeUnit==2?'is-active':''}`" @click="changeTab(2,'dr_operation_unit')">
                        运营公司({{unitList.dr_operation_num}})
                        <div class="active-bar"></div>
                      </div>

                    </div>
                    <div class="result">
                      <div class="result-wrap">
                        <div class="el-scrollbar">
                          <div class="el-scrollbar__wrap el-scrollbar__wrap--hidden-default">
                            <div class="el-scrollbar__view">
                              <div class="result-list">
                                <div class="search-resource-item" @click="goMapUnit(item)" v-for="item in showUnitList" :key="item.dr_unit_id"><i class="icon el-icon-school"></i>
                                  <div class="item-content">
                                    <p :title="item.dr_unit_name" class="name">{{item.dr_unit_name}}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
        <div class="right-side-warp" v-if="info">
          <div class="runninng-state" style="margin-bottom: 10px;">
            <div class="state-title-warp"><span class="title">
                设备运行状态
              </span>
              <!-- <i class="h-icon-angles_up_sm toggle-btn"></i> -->
            </div>
            <div class="content">
              <div>
                <div class="device-wrap">
                  <div class="title">
                    设备
                  </div>
                  <div class="status-wrap">
                    <div>正常</div>
                    <div>异常</div>
                    <div>待续费</div>
                  </div>
                  <div class="val-wrap">
                    <div>
                      <div class="bar-wrap">
                        <div class="highlight-bar" :style="`width: ${info.dr_device_normal_count}%;`"></div>
                      </div>
                      <div class="val">{{info.dr_device_normal_count.toFixed(1)||0}}%</div>
                    </div>
                    <div>
                      <div class="bar-wrap">
                        <div class="highlight-bar" :style="`width: ${info.dr_device_abnormal_count||0}%;`"></div>
                      </div>
                      <div class="val">{{info.dr_device_abnormal_count?info.dr_device_abnormal_count.toFixed(1):0}}%</div>
                    </div>
                    <div>
                      <div class="bar-wrap">
                        <div class="highlight-bar" :style="`width: ${info.dr_device_pay_count}%;`"></div>
                      </div>
                      <div class="val">{{info.dr_device_pay_count?info.dr_device_pay_count.toFixed(1):0}}%</div>
                    </div>
                  </div>
                </div>
                <div class="monitor-wrap">
                  <div class="title">
                    异常设备
                  </div>
                  <div class="status-wrap">
                    <div>离线</div>
                    <div>故障</div>
                    <div>低电量</div>
                  </div>
                  <div class="val-wrap">
                    <div>
                      <div class="bar-wrap">
                        <div class="highlight-bar" :style="`width: ${info.dr_device_not_online_count}%;`"></div>
                      </div>
                      <div class="val">{{info.dr_device_not_online_count.toFixed(1)||0}}%</div>
                    </div>
                    <div>
                      <div class="bar-wrap">
                        <div class="highlight-bar" :style="`width: ${info.dr_device_gz_count}%;`"></div>
                      </div>
                      <div class="val">{{info.dr_device_gz_count.toFixed(1)||0}}%</div>
                    </div>
                    <div>
                      <div class="bar-wrap">
                        <div class="highlight-bar" :style="`width: ${0}%;`"></div>
                      </div>
                      <div class="val">0%</div>
                    </div>
                  </div>
                </div>
                <div class="abnormal-wrap">
                  <div class="title">
                    监控点
                  </div>
                  <div class="status-wrap">
                    <div>在线</div>
                    <div>离线</div>
                  </div>
                  <div class="val-wrap">
                    <div>
                      <div class="bar-wrap">
                        <div class="highlight-bar" :style="`width: ${info.dr_device_online_count}%;`"></div>
                      </div>
                      <div class="val">{{info.dr_device_online_count.toFixed(1)||0}}%</div>
                    </div>
                    <div>
                      <div class="bar-wrap">
                        <div class="highlight-bar" :style="`width: ${info.dr_device_not_online_count}%;`"></div>
                      </div>
                      <div class="val">{{info.dr_device_not_online_count.toFixed(1)||0}}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="data-statistics">
            <div class="title-warp"><span class="title">
                数据统计
              </span>
              <!-- <i class="h-icon-angles_up_sm toggle-btn"></i> -->
            </div>
            <div class="content">
              <div class="top-content">
                <div class="item">
                  <div class="name">联网单位数</div>
                  <div class="num">{{info.dr_unit_count}}</div>
                </div>
                <div class="item">
                  <div class="name">监控点数</div>
                  <div class="num">{{info.dr_unit_count}}</div>
                </div>
                <div class="item">
                  <div class="name">消防设备总数</div>
                  <div class="num">{{info.dr_device_count}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <el-dialog :close-on-click-modal="false" title="报警详情" :visible.sync="showDia" v-if="showDia" :width="(nowUnit.dr_camera_url||nowUnit.dr_notice_point)?'1000px':'500px'" top="9vh" @close="$refs.detail.video.dispose()">
    <aDetail :nowUnit="nowUnit" @finish="handled" ref="detail"></aDetail>
  </el-dialog>
</div>
</template>

<script>
import cmap from './map'
import bheader from '../alert/header.vue'
import aDetail from './detail'
export default {
  components: {
    cmap,
    bheader,
    aDetail
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
        this.$bus.warnInfo = res.data.list.slice(0, 4)
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
  padding-top: 80px;
  background: rgb(27, 32, 51);
}

.home-wrapper {
  height: calc(100vh - 80px);
}
</style>
