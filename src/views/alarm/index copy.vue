<template>
  <div id="gss">
    <div class="alarm-box">
      <div class="system-list-wrap">
        <div class="system-list-content">
          <div
            @click="changeTab(item)"
            v-for="item in tabList"
            :key="item.id"
            :class="`system-item ${active == item.id && 'active'}`"
          >
            <span class="label">
              {{ item.title }}
            </span>
          </div>
        </div>
      </div>
      <div v-if="active !== 4">
        <el-row :gutter="0" style="padding: 10px 100px 0 100px">
          <el-col :span="12" :offset="0" class="chart-box">
            <div id="chart1" class="charts"></div>
            <div class="pie-title">报警类型统计</div>
          </el-col>
          <el-col :span="12" :offset="0" class="chart-box">
            <div id="chart2" class="charts"></div>
            <div class="pie-title">报警类型统计</div>
          </el-col>
        </el-row>
        <div class="search_box">
          <el-form
            :model="params"
            class="flex"
            ref="form"
            label-width="80px"
            :inline="true"
            label-position="top"
            size="small"
          >
            <el-form-item label="所属区域">
              <el-input
                placeholder="请输入所属区域"
                v-model="params.dr_unit_name"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备名称">
              <el-input
                placeholder="请输入设备名称"
                v-model="params.dr_device_name"
              ></el-input>
            </el-form-item>
            <el-form-item label="序列号">
              <el-input
                placeholder="请输入序列号"
                v-model="params.dr_device"
              ></el-input>
            </el-form-item>
            <el-form-item label="设备状态">
              <el-select
                v-model="params.dr_online_status"
                placeholder="请选择设备状态"
                clearable
              >
                <el-option
                  v-for="(item, key) in options"
                  :key="key"
                  :label="item"
                  :value="key"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <div class="btn_box">
              <el-button size="small" type="primary" @click="onSearch"
                >查询</el-button
              >
              <el-button size="small" @click="reset">重置</el-button>
            </div>
          </el-form>
        </div>

        <div class="list-wrap">
          <div>
            <el-button type="text" icon="el-icon-refresh" @click="reset"
              >刷新</el-button
            >
          </div>
          <ul class="alarm-list">
            <li
              class="alarm-item flex"
              v-for="item in list"
              :key="item.dr_notice_uuid"
            >
              <div class="tag">异常</div>
              <div class="flex1 ch f14 ml20">
                <div class="flex info-tx">
                  <div class="cfff">{{ item.dr_device_name }}</div>
                  <div>
                    {{
                      new Date(item.dr_create_time * 1000).Format(
                        'yy-MM-dd hh:mm:ss'
                      )
                    }}
                  </div>
                </div>
                <div class="flex info-tx">
                  <div>序列号: {{ item.dr_device_serial }}</div>
                  <div>所属单位: {{ item.dr_unit_name }}</div>
                  <div>设备状态：{{ options[item.dr_online_status] }}</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="pagination-wrapper">
          <el-pagination
            @current-change="getList"
            :current-page.sync="params.page"
            :page-size="20"
            layout="total, prev, pager, next"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
      <detect v-else/>
    </div>
  </div>
</template>

<script>
import detect from './detect'

export default {
  components: {
    detect,
  },
  watch: {},
  data() {
    return {
      options: {
        1: '在线',
        0: '不在线',
      },
      params: {
        page: 1,
        dr_unit_name: '',
        dr_notice_status: 1,
        dr_device_name: '',
        dr_device: '',
        dr_online_status: '',
      },
      active: this.$route.query.tab || 0,
      list: [],
      total: 0,
      tabList: [
        {
          title: '火灾自动报警系统',
          id: 0,
          type: 'yc',
        },
        {
          title: '无线烟感',
          id: 1,
          type: 'smoke',
        },
        {
          title: '无线燃气',
          id: 2,
          type: 'bw',
        },
        {
          title: '一氧化碳',
          id: 3,
          type: 'co',
        },
        {
          title: '工业探测器',
          id: 4,
          type: 'detect',
        },
        // {title:'可燃气体系统',id:4},
        // {title:'消防水系统',id:5},
        // {title:'其他系统',id:6},
      ],
      chartData: {},
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.list = []
      this.params = {
        page: 1,
        dr_notice_status: 1,
        dr_unitid: '',
        dr_device_name: '',
        dr_device: '',
        dr_online_status: '',
      }
      this.getData()
      this.getList()
    },
    reset() {
      this.init()
    },
    getData() {
      let logading = this.$loading({
        background: 'rgba(0, 0, 0, 0.6)',
      })
      this.$get(
        `/v1/dr/in-notice-sys-count/${this.tabList[this.active].type}/2`
      )
        .then((res) => {
          this.chartData = res.data
          logading.close()
          let data1 = []
          for (let key in this.chartData.dr_device_model_status_count_map) {
            data1.push(this.chartData.dr_device_model_status_count_map[key])
          }
          let data2 = [
            { name: '报过警的设备', value: this.chartData.dr_notice_count },
            {
              name: '未报过警的设备',
              value: (
                this.chartData.dr_device_count - this.chartData.dr_notice_count
              ).toFixed(0),
            },
          ]
          this.makeChart('chart1', {
            title: '报警数量统计',
            center: '设备',
            center_num: this.chartData.dr_device_count,
            data: data1.map((it) => {
              return {
                name: it.name,
                value: it.num,
              }
            }),
          })
          this.makeChart('chart2', {
            title: '报警类型统计',
            center: '设备',
            center_num: this.chartData.dr_device_count,
            data: data2,
          })
        })
        .catch((err) => {
          logading.close()
        })
    },
    changeTab(it) {
      this.active = it.id
      if (this.active !== 4) {
        this.init()
      }
    },
    onSearch() {
      this.list = []
      this.params.page = 1
      this.getList()
    },
    getList() {
      let params = {
        ...this.params,
      }
      for (let i in params) {
        if (params[i] === '') {
          delete params[i]
        }
      }
      params.dr_alarm_type = this.tabList[this.active].type
      this.$post('/v1/dr/notice-list', params).then((res) => {
        this.list = res.data.list
        this.total = res.data.count
      })
    },
    makeChart(id, data) {
      let chartDom = document.getElementById(id)
      let myChart = this.$echarts.init(chartDom, 'dark')
      let options = {
        backgroundColor: 'rgba(0,0,0,0)',
        tooltip: {
          backgroundColor: '#fff',
          padding: 8,
          textStyle: {
            fontSize: 10,
            color: '#02092A',
            fontWeight: 'bold',
          },
          formatter: function (e) {
            return ''.concat(e.data.name, ' ').concat(e.data.value)
          },
        },
        legend: {
          orient: 'vertical',
          left: '50%',
          top: '30%',
          data: data.data,
          itemGap: 24,
          selectedMode: !1,
          textStyle: {
            color: '#fff',
          },
          icon: 'rect',
          itemWidth: 10,
          itemHeight: 10,
        },
        color: [],
        series: [
          {
            type: 'pie',
            radius: ['60%', '80%'],
            center: ['25%', '48%'],
            label: {
              normal: {
                show: !1,
              },
              emphasis: {
                show: !1,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold',
                },
              },
            },
            labelLine: {
              normal: {
                show: !1,
              },
            },
            z: 1,
            hoverAnimation: 1,
            animation: 1,
            itemStyle: {
              normal: {
                show: !0,
                position: 'center',
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold',
                  color: '#00C2FF',
                },
                rich: {
                  p: {
                    color: '#fff',
                    align: 'center',
                  },
                },
              },
            },
            data: data.data,
          },
          {
            type: 'pie',
            radius: ['56%', '57%'],
            center: ['25%', '48%'],
            itemStyle: {
              normal: {
                opacity: 1,
                label: {
                  show: !0,
                  position: 'center',
                  textStyle: {
                    fontSize: '24',
                    fontWeight: 'bold',
                    color: '#00C2FF',
                  },
                  formatter: function (e) {
                    return '{h|'
                      .concat(data.center_num, '}\n{p|')
                      .concat(data.center, '总数}')
                  },
                  rich: {
                    p: {
                      color: '#fff',
                      align: 'center',
                      fontSize: 14,
                    },
                    h: {
                      color: '#fff',
                      align: 'center',
                      fontSize: 18,
                      fontWeight: 'bold',
                      lineHeight: 30,
                    },
                  },
                },
                labelLine: {
                  show: !1,
                },
              },
            },
            z: 1,
            hoverAnimation: !1,
            animation: !1,
            label: {
              show: !1,
            },
            tooltip: {
              show: !1,
            },
            data: [1],
          },
        ],
      }
      options && myChart.setOption(options, true)
    },
  },
}
</script>

<style lang="scss">
@import './index.css';

.pagination-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50px;
  padding: 0 15px;
  background-color: #1b2033;
  border-top: 1px solid #222;
  z-index: 2009;
  display: flex;
  align-items: center;

  .el-pagination {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .el-pagination__total {
    flex: 1;
    text-align: left;
    color: #ccc;
  }

  .el-pagination button,
  .el-pager li {
    color: #999;
    background-color: initial !important;
  }

  .el-pager li.active {
    color: #fff;
  }
}

.alarm-box {
  padding: 0 15px;
  overflow-y: auto;
  .alarm-list {
    height: calc(100vh - 6vh - 46px - 190px - 123px - 40px);
    overflow-y: auto;
    padding-bottom: 70px;

    .alarm-item {
      margin-bottom: 25px;
      padding: 8px 20px;
      height: 72px;
      background-color: #323d60;
      position: relative;
      border-radius: 2px;
      animation: glow2 0.8s ease-out infinite alternate;
    }

    .info-tx {
      justify-content: space-between;
      line-height: 26px;
    }

    .cfff {
      color: #fff;
    }

    .ch {
      color: #888d9f;
    }

    .tag {
      background-color: rgb(255, 149, 44);
      padding: 0 5px;
      width: 54px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      color: #2b344e;
      border-radius: 2px;
      font-size: 14px;
      padding: 0 5px;
      margin-top: 5px;
    }
  }

  .el-button.el-button--text {
    color: hsla(0, 0%, 100%, 0.7);
  }

  .chart-box {
    height: 180px;
    position: relative;
  }

  .charts {
    width: 100%;
    height: 100%;
  }

  .pie-title {
    position: absolute;
    left: 50%;
    top: 15px;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
  }

  .search_box {
    padding: 12px;
    background: #1f263c;
    margin: 15px 0 0 0;

    .el-form-item {
      margin-bottom: 0;
      margin-right: 20px !important;
      width: 19%;
    }

    .btn_box {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      align-items: flex-end;
    }

    .el-form-item__label {
      color: #f2f2f2;
    }

    .el-button--default {
      border-color: hsla(0, 0%, 100%, 0.3);
      background-color: hsla(0, 0%, 100%, 0.06);
      color: hsla(0, 0%, 100%, 0.7);
    }

    .el-input__inner {
      border: none !important;
      // background-color: #30374b !important;
      border-radius: 2px;
    }
  }
}

.system-list-wrap {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  overflow: hidden;
}

.system-list-wrap .system-list-content {
  position: relative;
  width: 100%;
  padding-top: 5px;
  border-bottom: 1px solid #000;
  white-space: nowrap;
}

.system-list-wrap .system-list-content .system-item {
  padding: 10px 20px;
  display: inline-block;
  cursor: pointer;
}

.system-list-wrap .system-list-content .system-item .label {
  font-size: 14px;
  color: hsla(0, 0%, 100%, 0.7);
  position: relative;
}

.system-list-wrap .system-list-content .system-item.active {
  border-bottom: 2px solid #6c6ece;
}

.system-list-wrap .system-list-content .system-item.active .label {
  color: #6c6ece;
}

@-webkit-keyframes glow1 {
  0% {
    border-color: rgba(250, 50, 57, 0.8);
    -webkit-box-shadow: inset 0 0 15px rgba(250, 50, 57, 0.1),
      inset 0 0 15px rgba(250, 50, 57, 0.1),
      inset 0 0 15px rgba(250, 50, 57, 0.1);
    box-shadow: inset 0 0 15px rgba(250, 50, 57, 0.1),
      inset 0 0 15px rgba(250, 50, 57, 0.1),
      inset 0 0 15px rgba(250, 50, 57, 0.1);
  }

  to {
    border-color: rgba(250, 50, 57, 0.8);
    -webkit-box-shadow: inset 0 0 20px rgba(250, 50, 57, 0.4),
      inset 0 0 20px rgba(250, 50, 57, 0.4),
      inset 0 0 20px rgba(250, 50, 57, 0.4);
    box-shadow: inset 0 0 20px rgba(250, 50, 57, 0.4),
      inset 0 0 20px rgba(250, 50, 57, 0.4),
      inset 0 0 20px rgba(250, 50, 57, 0.4);
  }
}

@keyframes glow1 {
  0% {
    border-color: rgba(250, 50, 57, 0.8);
    -webkit-box-shadow: inset 0 0 15px rgba(250, 50, 57, 0.1),
      inset 0 0 15px rgba(250, 50, 57, 0.1),
      inset 0 0 15px rgba(250, 50, 57, 0.1);
    box-shadow: inset 0 0 15px rgba(250, 50, 57, 0.1),
      inset 0 0 15px rgba(250, 50, 57, 0.1),
      inset 0 0 15px rgba(250, 50, 57, 0.1);
  }

  to {
    border-color: rgba(250, 50, 57, 0.8);
    -webkit-box-shadow: inset 0 0 20px rgba(250, 50, 57, 0.4),
      inset 0 0 20px rgba(250, 50, 57, 0.4),
      inset 0 0 20px rgba(250, 50, 57, 0.4);
    box-shadow: inset 0 0 20px rgba(250, 50, 57, 0.4),
      inset 0 0 20px rgba(250, 50, 57, 0.4),
      inset 0 0 20px rgba(250, 50, 57, 0.4);
  }
}

@-webkit-keyframes glow2 {
  0% {
    border-color: #ff952c;
    -webkit-box-shadow: inset 0 0 15px rgba(255, 149, 44, 0.1),
      inset 0 0 15px rgba(255, 149, 44, 0.1), inset 0 0 15px #ff952c;
    box-shadow: inset 0 0 15px rgba(255, 149, 44, 0.1),
      inset 0 0 15px rgba(255, 149, 44, 0.1), inset 0 0 15px #ff952c;
  }

  to {
    border-color: #ff952c;
    -webkit-box-shadow: inset 0 0 20px rgba(255, 149, 44, 0.4),
      inset 0 0 20px rgba(255, 149, 44, 0.4), inset 0 0 20px #ff952c;
    box-shadow: inset 0 0 20px rgba(255, 149, 44, 0.4),
      inset 0 0 20px rgba(255, 149, 44, 0.4), inset 0 0 20px #ff952c;
  }
}

@keyframes glow2 {
  0% {
    border-color: #ff952c;
    -webkit-box-shadow: inset 0 0 15px rgba(255, 149, 44, 0.1),
      inset 0 0 15px rgba(255, 149, 44, 0.1), inset 0 0 15px #ff952c;
    box-shadow: inset 0 0 15px rgba(255, 149, 44, 0.1),
      inset 0 0 15px rgba(255, 149, 44, 0.1), inset 0 0 15px #ff952c;
  }

  to {
    border-color: #ff952c;
    -webkit-box-shadow: inset 0 0 20px rgba(255, 149, 44, 0.4),
      inset 0 0 20px rgba(255, 149, 44, 0.4), inset 0 0 20px #ff952c;
    box-shadow: inset 0 0 20px rgba(255, 149, 44, 0.4),
      inset 0 0 20px rgba(255, 149, 44, 0.4), inset 0 0 20px #ff952c;
  }
}

@-webkit-keyframes opacityChange {
  0% {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes opacityChange {
  0% {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
