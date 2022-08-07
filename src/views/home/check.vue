<template>
  <div class="home-root check-wrap" id="gss">
    <div>
      <div class="home-container">
        <div class="home-wrapper">
          <div class="left-side-warp">
            <div class="today-num-wrap borderWidth" style="margin-bottom: 10px;background: #000C12;">
              <div class="content-wrap">
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAhCAYAAAC4JqlRAAAABGdBTUEAALGPC/xhBQAAAsdJREFUWAntVk9rE0EUf2+3MV0oImg2asQKHgSRevLkH4oHLz1IU6NWK72IH0ARFE0cE0tR/PMBFFQMVoxNQQWvRfTirf0EXhSzCSJSSZt2ZnyTNEvYzW7Nbgse8g6Zmffe7/deZua9HYCuhNwBKSWGpAgOLw3femAlM2+DMwBoYcCIsl8C9Ifh6PECl4fZWdrcXrPInnn5UALzIOGPl13py6fYoARhmG+yH9r5ee4AgQ4A8CdWkh1rB1S62HQuaxZz4172ciq3Twj+Xgo47+XjuQOxni0T5ZVfQxLFcQJ/dBJYKbYdgSeA61Lq8N0ssB9OH8FrJ+mG/kaIXnXammvfG6xuOAkdc0MqqTsJLmpXQMAwgNzT1DdG/AqARb0n8nBb4eY3patXyOlHvVi4XG34uH99E2h1t0bS16SEDJ250ap3zRGqKPG2OZO967K1UayZgGRMs+ZEnv7PaBu8twrhpTmgX0DGhLfTP5ShNS/udRxcRZRwroH1C0+H5mcuJdOHieiTn8+aNoQj8WLus5dfvQpKZ3J7cXn5uoba7FYNXmOB1RSAznJSUgZhRHEQ3i7lSjJ9iCMOGpu0p5unWKXRB2qyj5yGuOAvyoJfUgF/pthuCn5UzcOI4lBciqOcZBe5hC8o5eTiEuxXunoC8ZnMXGxAS0Q0/WBsZ+yxMnAOJ9S4HtLkMqKRdxroo4Zu7KAOW+8tdiNava3zzYCUeage3+RRY5Orb+pGiZavWm2NI2jVrM4JFGujDqTy4/JMgPL2rZDOMvHm8kmgsxBBvbsJdHeguwN2J3SWEaK2SL1gwakPtEYkrv9UXN1uYXQiXl1aGtuIfI1oNL/6PbDpXUdQXVncJSTctz3WcULcs0SnPki2uKpA43qJXsK+7zgb3cFEcSpuJ8R1BMrBGsmM05N6jF4zEScgyFqiXKYE8uZ09nkQ/IZi/gLf1+lInh43+QAAAABJRU5ErkJggg=="
                  alt="ico_home_risks"
                />
                <div>
                  <div class="label">今日报警</div>
                  <div class="value">
                    {{ (info && info.dr_today_notice_count) || 0 }}
                  </div>
                </div>
              </div>
              <div class="content-wrap">
                <img
                  @click="bjTest"
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAhCAYAAAC4JqlRAAAABGdBTUEAALGPC/xhBQAABNBJREFUWAntVltvVUUUnjV7n55SCcQ3LzHyaGJIlJgoPKmJkRhUYvCILVoScnjh0eiLv0CDxhcoUhKPKRALiERMvMR4iwkhMd7iJSL46I0YTGmxPZcZv2/NzOk+l9KDPugD057O7Jm1vvWtb609PcZcHf+xAvJv4i8cG7/VOLPZGXtqReWVD/4J1hUT8Cd3jszPzlas2KozZoMXMYKPMXJGrN1XHh6uyaaJC4OSGZhA/bXH1hnvq97YUQReFYJa4w0gLGG4Bg0jfxmbTWcm2ze0Zf/p5YhcloA/OLaqYS6NArbqxKwzYjUEZw3M4LrHbZzpflzrmXwhtjQxfM3Kw3L/7rl+ZPoSaEw9DGldVbxUkO1IAkeEEJiSI5iIfV5MNt0S97TxsjXYRRsoAgO1R7lmvLVTWZ5PlB/a822RSA+Beu2BA8De4XysbSErZo2gCorVD+Wxo7cQzH+4fbj+e/NPkC2TZLcSyU/5Z/aZkc0v704kqGnHsKY15j1dUFHM3jtC6pp74RnnYs4nR7mnNm+cmzWwhSF+6RPmzrUR3/Qo6eLoIYAQMwGIYBGoDRaJ4dn51iKKrnAGwiCiBEg+EVIyxCCeAL8wegjA6Tc6ECxl7l1LMypmpY1fADJKiEECScXAE3GoGveVlHO/FN16CCDoTzSkU5Jbg6WMdAZYi8GKgwEWs9egMXCbuCpgzhW98uID1wh9TjPXg8SeO+CKGHwBUAC1VJP4h0G0d9CktBDyoZuSiM1LzpnrINBHAf+lh5wKiHq22StQkjL1RozOSc91EddBkeAf11AvM/J5wYtpdY7MyulQglBLrpmIAlECBNJmYzbFoXbMnAfRjnP80B+fuVJz4zdFtx4C5sn3f7TiLwgDRSDf7uygAAkF4CIUt2LftEmAQPRlefDzmVQqHa9PDwHc8bR8Vx0iiZS9KkEgBjLuJn/k0UypHBq9Fl25mqSSrZYEdmkvvFXurS7KvSVQQN86HrJPEgKIWREwkjKudXNjfu5Q8+CmLU138YR3PtdzNmiySYRUEezn5ng3gaBm164/cvdKN9M6j3yGte21s2Ea7/alr1rC4apWO5rHa5v+Yr8qPz59W1eo/gpI5aNZpHG4KGe6FxZVAGZRkbjmbacKqGKhJHqfOLe3Ozife3ogGVlnngOQC00UgLQHaJCCifkYPfMUEv4Om/gN/dFBnK+y+J9LJVNL2MV5SQKy89MzMDwWeiFkxcCaDQ7EuF9zd8PG0vg7L+al0n1oXXxlANFC5iTFnkYhXpDK0XoxcFovSYAGVkrPAuSiAnMDBBIh3G0Ns2ZNk9umni1Aerw4IKpKxDKQgPNf59ev7is/Xfs2IQ/S8JMbtrW8n2o3lA2NxaKIsSdMnr2ON2AXUr1LGxCObVuxl/Kh0h2y9Y3vE173vCwBOrQm19fQ2uNAZk6MgA/FCzNf1uJz2AdBm1fzJ04e4PFS47IlSE729rVVFHe/yqsU4p2ANf9vsPm0NO1n1wC1HcsFJz7sBh9+cv0ufFV7CQrki2oEJbQkVMXKH5mxj8j29z4ZBHkgBRKQVE/tsbm7E9niSnVMX7NncwJoQcTtzbJs7aDBiXtFCiQinP2r995omo0H8V5c58WezYZWvCnb3u74ulW0v7r+3yrwNwo9oHX0KDnxAAAAAElFTkSuQmCC"
                  alt="ico_home_risks"
                />
                <div>
                  <div class="label">今日隐患</div>
                  <div class="value">
                    {{ (info && info.dr_hidden_danger) || 0 }}
                  </div>
                </div>
              </div>
              <div class="bar"></div>
            </div>
            <div class="search-input-wrap"
            style="background-color: #000000;">
              <el-input
                placeholder="单位搜索"
                size="normal"
                v-model="keyword"
                clearable
                @keyup.enter.native="searchUnit"
                @clear="showSearch = false"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-search"
                  @click="searchUnit"
                ></i>
              </el-input>
            </div>

            <div class="panel">
              <div class="untreated-alarm-wrap untreated-alarm borderWidth">
                <div v-show="!showSearch">
                  <div class="title-wrap borderWidth">
                    <span class="title">待处理报警</span
                    ><span class="untreated-alarm-num">{{
                      alarm_count
                    }}</span>
                    <!-- <span class="h-icon-angles_up_sm toggle-btn"></span> -->
                    <div style="width: 35px"></div>
                  </div>
                  <div class="alarm-content-wrap borderWidth">
                    <div class="result-content ">
                      <el-scrollbar style="height: 100%;background:#000C12;">
                        <div class="result-item-wrap"
                        style="background:#000C12;"
                        >
                          <div class="center" v-if="!alarm_count"
                          style="background:#000C12;">
                            暂无未处理报警
                          </div>
                          <div
                            class="result-item borderWidth"
                            v-if="alarm_count"
                            style="background:#000C12;"
                            v-for="item in $bus.warnInfo"
                            :key="item.dr_notice_uuid"
                          >
                            <div class="result-title-wrap "
                            style="background:#000C12;">
                              <div class="result-title-left ">
                                <i class="el-icon-bell"></i
                                ><span class="result-title">未处理报警</span>
                              </div>
                              <div
                                class="detail-button-wrap"
                                @click="showDetail(item)"
                              >
                                <i class="detail-button el-icon-document"></i>
                              </div>
                            </div>
                            <div class="result-table-wrap"
                            style="background:#000C12;">
                              <div class="result-table">
                                <div style="background:#000C12;">
                                  {{
                                    new Date(item.dr_create_time * 1000).Format(
                                      "yy-MM-dd hh:mm:ss"
                                    )
                                  }}
                                </div>
                                <div :title="item.dr_unit_name" style="background:#000C12;">
                                  {{ item.dr_unit_name }}
                                </div>
                                <div :title="item.dr_device_serial" style="background:#000C12;">
                                  {{ item.dr_device_serial }}发生报警
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
                        <div
                          :class="`tabs-item ${
                            activeUnit == 1 ? 'is-active' : ''
                          }`"
                          @click="changeTab(1, 'dr_detect_unit')"
                        >
                          单位({{ unitList.dr_detect_num }})
                          <div class="active-bar"></div>
                        </div>
                        <div
                          :class="`tabs-item ${
                            activeUnit == 2 ? 'is-active' : ''
                          }`"
                          @click="changeTab(2, 'dr_operation_unit')"
                        >
                          运营公司({{ unitList.dr_operation_num }})
                          <div class="active-bar"></div>
                        </div>
                      </div>
                      <div class="result">
                        <div class="result-wrap">
                          <div class="el-scrollbar">
                            <div
                              class="
                                el-scrollbar__wrap
                                el-scrollbar__wrap--hidden-default
                              "
                            >
                              <div class="el-scrollbar__view">
                                <div class="result-list">
                                  <div
                                    class="search-resource-item"
                                    @click="goMapUnit(item)"
                                    v-for="item in showUnitList"
                                    :key="item.dr_unit_id"
                                  >
                                    <i class="icon el-icon-school"></i>
                                    <div class="item-content">
                                      <p
                                        :title="item.dr_unit_name"
                                        class="name"
                                      >
                                        {{ item.dr_unit_name }}
                                      </p>
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
          <div class="center-box">
            <div class="c-top-count">
              <div class="c-list borderWidth">
                <div class="c-num">{{count.dr_slave_num||0}}</div>
                <div class="c-tx">下属单位</div>
              </div>
              <div class="c-list borderWidth">
                <div class="c-num">{{count.dr_fool_num||0}}</div>
                <div class="c-tx">楼层总数</div>
              </div>
              <div class="c-list borderWidth">
                <div class="c-num">{{count.dr_device_count||0}}</div>
                <div class="c-tx">设备总数</div>
              </div>
            </div>
            <div class="c-bot borderWidth">
                <div class="point-wrap" ref="wrap">
                  <img
                    class="bim"
                    :src="nowBuild.dr_building_pic"
                    alt=""
                  />
                  <div
                    class="point-marker"
                    v-for="(item, index) in nowBuild.dr_building_point"
                    :key="index"
                    :style="`left:${item.x};top:${item.y}`"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.dr_device_name"
                      placement="top"
                    >
                      <img :src="item.dr_icon" alt="" />
                    </el-tooltip>
                  </div>
                </div>
            </div>
          </div>
          <div class="right-box borderWidth">
            <div class="r-top borderWidth">
              <!-- <AreaSelect
                @handleSelect="handleSelectArea"
                @ready="handleSelectArea"
                ref="areaTree"
              ></AreaSelect> -->
              <TreeData
                @handleSelect="handleSelectArea"
                @ready="handleSelectArea"
                ref="areaTree"
              ></TreeData>
            </div>
            <div class="r-bottom borderWidth">
              <div class="f18">建筑列表：</div>
              <ul class="mt10">
                <li
                  :class="`${
                    nowBuild.dr_building_id == item.dr_building_id
                      ? 'active'
                      : ''
                  }`"
                  @click="setPoint(item)"
                  v-for="item in tableData"
                  :key="item.dr_building_id"
                >
                  {{ item.dr_building_floor }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :close-on-click-modal="false"
      title="报警详情"
      :visible.sync="showDia"
      v-if="showDia"
      :width="nowUnit.dr_camera_url ? '1000px' : '500px'"
      top="9vh"
      @close="$refs.detail.video.dispose()"
    >
      <aDetail :nowUnit="nowUnit" @finish="handled" ref="detail"></aDetail>
    </el-dialog>
  </div>
</template>

<script>
import aDetail from "./detail";
import AreaSelect from "@/components/AreaSelect";
import VueDragResize from "vue-drag-resize";
import  TreeData  from "@/components/TreeData";
export default {
  components: {
    aDetail,
    AreaSelect,
    VueDragResize,
    TreeData
  },
  data() {
    return {
      time: "",
      showDia: false,
      noticeList: [],
      showSearch: false,
      keyword: "",
      unitList: {},
      showUnitList: [],
      activeUnit: 1,
      nowUnit: {},
      info: null,
      showDia1: false,
      loading: false,
      sform: {
        dr_login_pass: "",
        dr_login_pass_: "",
      },
      rules: {
        dr_login_pass: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        dr_login_pass_: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
      },
      tableData: [],
      listQuery: {
        page: 1,
        PageSize: 20,
        dr_role_type: 1,
      },
      nowBuild: {},
      count:{},
      alarm_count:0
    };
  },
  mounted() {
    this.tick();
    this.getAlarmList();
    this.getInfo();
    // setTimeout(() => {
    //   this.$refs.areaTree.$refs.tree.setCurrentKey(120019)
    // }, 3000);
  },
  methods: {
    setPoint(item) {
      this.nowBuild = { ...item };
      this.nowBuild.dr_building_point =
        JSON.parse(item.dr_building_point || "[]") || [];
    },
    handleSelectArea(data) {
      this.listQuery.dr_unit_key = data.dr_self_key;
      this.dr_unit_id = data.dr_unit_id;
      //this.ruleForm.dr_unit_key = data.id
      this.getList();
      this.getCount()
    },
    getAlarmCount(){
      this.$post('/v1/dr/notice-list-count',{dr_notice_status:1}).then(res=>{
        this.alarm_count = res.data.count
      })
    },
    getCount(){
      this.$get(`/v1/dr/in-point-map-count/${this.dr_unit_id}/${this.listQuery.dr_unit_key}`).then(res=>{
        this.count = res.data
      })
    },
    getList() {
      this.loading = true;
      this.$post("/v1/dr/get-unit-building", this.listQuery)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data;
          if (this.tableData.length) {
            this.setPoint(this.tableData[0]);
          }
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    open(url) {
      window.open(url);
    },
    getInfo() {
      this.$get("/v1/dr/in-notice-map-count").then((res) => {
        this.info = res.data;
      });
    },
    clickDown(name) {
      if (name == 1) {
        this.showDia1 = true;
      } else if (name == 2) {
        this.logout();
      }
    },
    logout() {
      //this.$post('/dr/v1/logout')
      //this.$store.commit('clearUser')
      this.$db.remove("user");
      this.$db.remove("token");
      this.$bus.user = {};
      this.$router.replace({
        path: "/login",
      });
      // window.location.href = 'https://sso.tuyanplat.com/#/choose'
    },
    Submit() {
      let _this = this;
      this.$refs.sform.validate((valid) => {
        if (valid) {
          if (this.sform.dr_login_pass === this.sform.dr_login_pass_) {
            this.showDia1 = false;
            this.$post("/v1/dr/update-user", {
              dr_login_pass: this.sform.dr_login_pass,
              dr_user_uuid: this.$bus.user.dr_user_uuid,
            })
              .then((res) => {
                this.$message.success("修改成功");
                this.sform = {
                  dr_login_pass: "",
                  dr_login_pass_: "",
                };
              })
              .catch((err) => {
                this.$message.error("修改失败");
              });
          } else {
            this.$message.error("两次密码不一致！");
          }
        } else {
          return false;
        }
      });
    },
    handled() {
      this.showDia = false;
      this.$refs.map.handle();
      this.getAlarmList();
    },
    goMapUnit(it) {
      this.$refs.map.goUnit(it);
    },
    changeTab(tab, key) {
      this.activeUnit = tab;
      this.showUnitList = this.unitList[key];
    },
    searchUnit() {
      this.$post("/v1/dr/unit-search", {
        dr_unit_name: this.keyword,
        dr_status:1
      }).then((res) => {
        this.unitList = res.data;
        this.showSearch = true;
        this.showUnitList = res.data.dr_detect_unit;
      });
    },
    bjTest() {
      this.$post("/v1/dr/dr-site-well-call-back", {
        msg: {
          at: 1631674738813,
          imei: "868474044670402",
          type: 1,
          ds_id: "3200_0_5503",
          value: 1,
          dev_id: 736607308,
        },
        msg_signature: "KPWR7+q3nNv78WR7z+NYyg\u003d\u003d",
        nonce: "mqR1hha\u0026",
      });
    },
    newWarn(data) {
      this.getInfo();
    },
    getAlarmList() {
      this.getAlarmCount()
      this.$post("/v1/dr/notice-list", {
        page: 1,
        dr_notice_status: 1,
      }).then((res) => {
        this.$bus.warnInfo = res.data.list.slice(0, 4);
      });
    },
    showDetail(it) {
      this.nowUnit = {
        ...it,
      };
      this.showDia = true;
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
      if (MM < 10) MM = "0" + MM;
      var dd = objD.getDate();
      if (dd < 10) dd = "0" + dd;
      var hh = objD.getHours();
      if (hh < 10) hh = "0" + hh;
      var mm = objD.getMinutes();
      if (mm < 10) mm = "0" + mm;
      var ss = objD.getSeconds();
      if (ss < 10) ss = "0" + ss;
      var ww = objD.getDay();
      if (ww == 0) colorhead = '<font color="#ccc">';
      if (ww > 0 && ww < 6) colorhead = '<font color="#ccc">';
      if (ww == 6) colorhead = '<font color="#ccc">';
      if (ww == 0) ww = "星期日";
      if (ww == 1) ww = "星期一";
      if (ww == 2) ww = "星期二";
      if (ww == 3) ww = "星期三";
      if (ww == 4) ww = "星期四";
      if (ww == 5) ww = "星期五";
      if (ww == 6) ww = "星期六";
      colorfoot = "</font>";
      str =
        colorhead +
        yy +
        "-" +
        MM +
        "-" +
        dd +
        " " +
        hh +
        ":" +
        mm +
        ":" +
        ss +
        "  " +
        ww +
        colorfoot;
      return str;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./index.css";

.c-bot {
  height: calc(100vh - 80px - 12px - 120px);
  padding: 30px;
  position: relative;
  overflow: hidden;
}
.point-wrap {
  position: relative;
  display: flex;
  .bim {
    width: 100%;
    max-width: 100%;
    max-height: 100%;
  }
  .point-marker {
    position: absolute;
    width: 30px;
    height: 30px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
// .home-root .home-container {
//   padding-top: 80px;
//   background: rgb(27, 32, 51);
// }

.home-wrapper {
  height: calc(100vh - 80px);
}
.center-box {
  position: absolute;
  left: 344px;
  top: 12px;
  bottom: 12px;
  background-color: #404d6c;
  right: 344px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
}
.right-box {
  position: absolute;
  right: 12px;
  top: 12px;
  bottom: 12px;
  background-color: #404d6c;
  width: 320px;
  border-radius: 4px;
  padding: 15px;
  .r-top {
    height: 50%;
    overflow-y: auto;
    border-bottom: 1px solid #010817;
  }
  .r-bottom {
    height: 50%;
    overflow-y: auto;
    padding: 15px 0;
    li {
      font-size: 14px;
      padding: 5px;
      cursor: pointer;
      transition: all 0.3s;
      &.active {
        background-color: #6b72cc !important;
      }
    }
  }
}
.c-top-count {
  display: flex;
  text-align: center;
  border-bottom: 1px solid #010817;
  .c-list {
    padding: 20px;
    flex: 1;
    & + .c-list {
      border-left: 1px solid #010817;
    }
  }
  .c-num {
    font-size: 36px;
    margin-bottom: 10px;
  }
}

@keyframes bli {
  0% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.blink{
  animation: bli 0.6s infinite alternate;
}
.borderWidth {
  background: #000C12;
border: 1px solid rgba(0,138,207,0.6600);
opacity: 0.9;
}
</style>
