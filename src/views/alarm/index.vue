<template>
  <div class="alarm_main">
    <div class="system-list-content">
      <div @click="changeTab(item)"
           v-for="item in tabList"
           :key="item.id"
           :class="`system-item ${active == item.id && 'active'}`">
        <span class="label">
          {{ item.title }}
        </span>
      </div>
    </div>
    <div class="content"
         v-if="active !== 4">
      <div class="content_left">
        <div class="left_can can_fitst">
          <p class="can_text"> <span class="line"></span> 报警类型</p>
          <div class="text_box"
               id="bjty">
            <!-- <span class="dot_box">
              <span class="dot dot1"></span>
              <span>
                <p>在线</p>
                <p>39%</p>
              </span>
            </span>
            <span class="dot_box">
              <span class="dot dot2"></span>
              <span>
                <p>在线</p>
                <p>39%</p>
              </span>
            </span>
            <span class="dot_box">
              <span class="dot dot3"></span>
              <span>
                <p>在线</p>
                <p>39%</p>
              </span>
            </span>
            <span class="dot_box">
              <span class="dot dot4"></span>
              <span>
                <p>在线</p>
                <p>39%</p>
              </span>
            </span> -->
          </div>
        </div>
        <div class="left_can">
          <p class="can_text"> <span class="line"></span> 报警类型</p>
          <div class="text_box"
               id="bjzb">
            <!-- <span class="dot_box">
              <span class="dot dot2"></span>
              <span>
                <p>未报过警的设备</p>
                <p>39%</p>
              </span>
            </span>
            <span class="dot_box">
              <span class="dot dot3"></span>
              <span>
                <p>报过警的设备</p>
                <p>39%</p>
              </span>
            </span> -->
          </div>
        </div>
      </div>
      <div class="content_right">
        <div class="search_box">
          <el-form :model="params"
                   ref="form"
                   label-width="80px"
                   :inline="true"
                   label-position="top"
                   size="small">
            <el-form-item>
              <label for="">所属区域</label>
              <el-input class="iner"
                        placeholder="请输入所属区域"
                        v-model="params.dr_unit_name"></el-input>
            </el-form-item>
            <el-form-item>
              <label for="">设备名称</label>
              <el-input class="iner"
                        placeholder="请输入设备名称"
                        v-model="params.dr_device_name"></el-input>
            </el-form-item>
            <el-form-item>
              <label for="">序列号</label>
              <el-input class="iner"
                        placeholder="请输入序列号"
                        v-model="params.dr_device"></el-input>
            </el-form-item>
            <el-form-item>
              <label for="">设备状态</label>
              <el-select class="iner"
                         v-model="params.dr_online_status"
                         placeholder="请选择设备状态"
                         clearable>
                <el-option v-for="(item, key) in options"
                           :key="key"
                           :label="item"
                           :value="key">
                </el-option>
              </el-select>
            </el-form-item>
            <div class="btn_box"
                 @click="onSearch">查询
            </div>
          </el-form>
          <ul class="alarm-list">
            <li class="alarm-item "
                v-for="item in list"
                :key="item.dr_notice_uuid">
              <div class="top"></div>
              <div class=" ch f14 ml20">
                <div class="info-tx">
                  <div class="cfff">{{ item.dr_device_name }} <span class="tag">异常</span></div>
                  <div class="text">
                    <i class="iconfont icon-time"></i>
                    {{
                      new Date(item.dr_create_time * 1000).Format(
                        'yy-MM-dd hh:mm:ss'
                      )
                    }}
                  </div>
                </div>
                <div class="text"><i class="iconfont icon-address"></i>{{ item.dr_unit_name }}</div>
                <div class="text"> <i class="iconfont icon-listNumber"></i>{{ item.dr_device_serial }}发生报警
                  <span style="float:right"><span class="dot"></span>{{ options[item.dr_online_status] }} </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <detect v-else />
  </div>
</template>

<script>
import detect from './detect'

export default {
  components: {
    detect,
  },
  watch: {},
  data () {
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
  mounted () {
    this.init()
  },
  methods: {
    init () {
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
    reset () {
      this.init()
    },
    getData () {
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
    changeTab (it) {
      this.active = it.id
      if (this.active !== 4) {
        this.init()
      }
    },
    onSearch () {
      this.list = []
      this.params.page = 1
      this.getList()
    },
    getList () {
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
    makeChart (id, data) {
      let bjtyChartDom = document.getElementById('bjty')
      let bjzbChartDom = document.getElementById('bjzb')
      // let chartDom = document.getElementById(id)
      let bjtyChart = this.$echarts.init(bjtyChartDom)
      let bjzbChart = this.$echarts.init(bjzbChartDom)
      // let myChart = this.$echarts.init(chartDom, 'dark')
      var datas = [
        {
          value: 126,
          name: '在线'
        },
        {
          value: 113,
          name: '低电压'
        },
        {
          value: 102,
          name: '故障'
        },
        {
          value: 17,
          name: '不在线'
        },
      ];
      let options = {
        color: ['#0FD0D0', '#2F84D9', '#D14F0F', '#096796'],
        legend: {
          show: true,
          orient: 'horizontal',
          left: 'center',
          top: '0px',
          data: datas,
          formatter: function (name) {
            let total = 0;
            let tarValue;
            for (let index = 0; index < datas.length; index++) {
              total += datas[index].value;
              if (name === datas[index].name) {
                tarValue = datas[index].value
              }
            }
            let num = Math.round((tarValue / total) * 100)
            return (name + '\n' + num + '%');
            // return (name +'  ' + num + '%');
          },
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 10,
          textStyle: {
            color: "#fff",
            fontSize: "14px",
            fontFamily: 'PingFang SC',

          },
        },
        series: [
          {
            color: ['#0FD0D0', '#2F84D9', '#D14F0F', '#096796'],
            type: 'pie',
            radius: [30, 65],
            center: ['50%', '50%'],
            hoverAnimation: false,
            data: [{
              value: 126,
              name: '在线'
            },
            {
              value: 113,
              name: '低电压'
            },
            {
              value: 102,
              name: '故障'
            },
            {
              value: 17,
              name: '不在线'
            },
            ],
            label: {
              normal: {
                show: true,
                // formatter: "{c}",
                formatter: function (params) {
                  // console.log(params,params.name,'111111');
                  let style = ''
                  switch (params.name) {
                    case '在线':
                      style = 's1'
                      break;
                    case '低电压':
                      style = 's2'
                      break;
                    case '故障':
                      style = 's3'
                      break;
                    case '不在线':
                      style = 's4'
                      break;
                    default:
                  }
                  // return `${params.value}` 
                  return '{' + style + '|' + params.value + '}'
                },
                // textStyle: {
                //     fontSize: 13,
                // },
                rich: {
                  s1: {
                    fontSize: "16px",
                    color: "#0FD0D0"
                  },
                  s2: {
                    fontSize: "16px",
                    color: "#2F84D9"
                  },
                  s3: {
                    fontSize: "16px",
                    color: "#D14F0F"
                  },
                  s4: {
                    fontSize: "16px",
                    color: "#096796"
                  }
                },
                position: 'outside'
              },
              emphasis: {
                show: false
              }
            },

          }, {
            // color: ['#0FD0D0', '#2F84D9', '#D14F0F', '#096796'],
            type: 'pie', // 阴影
            radius: [30, 80],
            center: ['50%', '50%'],
            itemStyle: {
              opacity: 0.3,
            },
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false
              }
            },
            data: [{
              value: 126,
              name: '在线'
            },
            {
              value: 113,
              name: '低电压'
            },
            {
              value: 102,
              name: '故障'
            },
            {
              value: 17,
              name: '不在线'
            },
            ],
          },

        ]
      };
      // =============报警占比==========
      let data1 = [
        {
          value: 2326,
          name: '未报过警的设备'
        },
        {
          value: 102,
          name: '报过警的设备'
        },
      ];
      var options1 = {
        color: ['#179DE0', '#D14F0F'],
        legend: {
          show: true,
          orient: 'horizontal',
          left: 'center',
          top: '0px',
          data: data1,
          formatter: function (name) {
            let total = 0;
            let tarValue;
            for (let index = 0; index < data1.length; index++) {
              total += data1[index].value;
              if (name === data1[index].name) {
                tarValue = data1[index].value
              }
            }
            let num = Math.round((tarValue / total) * 100)
            return (name + '\n' + num + '%');
          },
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 25,
          textStyle: {
            color: "#fff",
            fontSize: "14px",
            fontFamily: 'PingFang SC',
          },
        },
        series: [
          {
            color: ['#179DE0', '#D14F0F'],
            type: 'pie',
            radius: [30, 65],
            center: ['50%', '50%'],
            hoverAnimation: false,
            data: [
              {
                value: 2326,
                name: '未报过警的设备'
              },
              {
                value: 102,
                name: '报过警的设备'
              },
            ],
            label: {
              normal: {
                show: true,
                // formatter: "{c}",
                formatter: function (params) {
                  console.log(params, params.name, '111111');
                  let style = ''
                  switch (params.name) {
                    case '未报过警的设备':
                      style = 's1'
                      break;
                    case '报过警的设备':
                      style = 's2'
                      break;
                    default:
                  }
                  // return `${params.value}` 
                  return '{' + style + '|' + params.value + '}'
                },
                textStyle: {
                  fontSize: 13,
                },
                rich: {
                  s1: {
                    fontSize: "16px",
                    color: "#179DE0"
                  },
                  s2: {
                    fontSize: "16px",
                    color: "#D14F0F"
                  },
                },
                position: 'outside'
              },
              emphasis: {
                show: false
              }
            },

          }, {
            // color: ['#0FD0D0', '#2F84D9', '#D14F0F', '#096796'],
            type: 'pie', // 阴影
            radius: [30, 80],
            center: ['50%', '50%'],
            itemStyle: {
              opacity: 0.3,
            },
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false
              }
            },
            data: [
              {
                value: 2326,
                name: '未报过警的设备'
              },
              {
                value: 102,
                name: '报过警的设备'
              },
            ]
          },

        ]
      };

      options && bjtyChart.setOption(options, true)
      options1 && bjzbChart.setOption(options1, true)
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

.alarm_main {
  padding: 20px 28px 28px 32px;
  overflow-y: auto;
  .system-list-content {
    display: flex;

    margin-bottom: 20px;
    .system-item {
      height: 34px;
      padding: 0px 20px;
      line-height: 34px;
      text-align: center;
      font-size: 16px;
      &.active {
        background: #09425e;
        border-radius: 3px;
      }
    }
  }
  .alarm-list {
    display: flex;
    flex-wrap: wrap;
    height: 720px;
    overflow-y: scroll;
    padding: 24px 33px 0px 33px;
    // justify-content: space-between;
    gap: 21px;
    align-content: flex-start;
    .alarm-item {
      position: relative;
      width: 376px;
      height: 172px;
      background: #011c2d;
      border: 1px solid #004a70;
      box-shadow: inset -2px -2px 4px 0px #004a70, inset 2px 2px 4px 0px #004a70;
      border-radius: 3px;
      flex-shrink: 0;
      padding: 23px;
      .top {
        position: absolute;
        left: 50%;
        top: -1px;
        margin-left: -72px;
        width: 143px;
        height: 4px;
        background: #43c6d9;
      }
      .dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #15e3c4;
        border-radius: 50%;
        margin-right: 5px;
      }
    }

    .info-tx {
      justify-content: space-between;
      line-height: 26px;
    }

    .cfff {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
      margin-bottom: 5px;
    }
    .text {
      i {
        color: #129ce0;
        opacity: 0.64;
      }
      margin-top: 16px;
      font-size: 13px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
      opacity: 0.8;
    }

    .ch {
      color: #888d9f;
    }

    .tag {
      display: inline-block;
      width: 40px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      background: #fd5042;
      border-radius: 10px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #010101;
      margin-top: 2px;
      float: right;
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
    background: #1f263c;
    label {
      padding: 0px 8px 0px 30px;
    }
    .iner {
      width: 180px !important;
      height: 32px;
      background: #00080b;
      border: 1px solid #145677;
      border-radius: 2px;
    }
    .el-form-item {
      margin-bottom: 0;
      margin-right: 0px !important;
      // width: 19%;
    }

    .btn_box {
      display: inline-block;
      text-align: center;
      line-height: 32px;
      width: 78px;
      height: 32px;
      background: linear-gradient(90deg, #1b81b5, #43a6d9);
      border-radius: 2px;
      margin-left: 22px;
      cursor: pointer;
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
  .content {
    width: 100%;
    display: flex;
    .content_left {
      margin-right: 20px;
      .left_can {
        width: 380px;
        height: 384px;
        background: #000b10;
        border: 1px solid rgba(0, 138, 207, 0.66);
        box-shadow: inset -5px -5px 6px 0px #0f2937,
          inset 5px 6px 6px 0px #0f2937;
        // opacity: 0.9;
        padding: 25px 30px;
        display: flex;
        flex-direction: column;
        .line {
          display: inline-block;
          width: 6px;
          height: 18px;
          background: #12cfe0;
          border-radius: 2px;
          vertical-align: middle;
          margin-right: 10px;
        }
        .text_box {
          flex: 1;
          margin-top: 25px;
          width: 100%;
          // .dot_box {
          //   display: flex;
          //   align-items: baseline;
          // }
          // display: flex;
          // justify-content: space-around;
          // .dot {
          //   display: inline-block;
          //   width: 8px;
          //   height: 8px;
          //   margin-right: 5px;
          // }
          // .dot1 {
          //   background: linear-gradient(180deg, #0fd0d0, #0e9696);
          // }
          // .dot2 {
          //   background: linear-gradient(180deg, #0f70d1, #0e5296);
          // }
          // .dot3 {
          //   background: linear-gradient(180deg, #d14f0f, #963b0e);
          // }
          // .dot4 {
          //   background: linear-gradient(180deg, #096796, #023954);
          // }
        }
      }
      .can_fitst {
        margin-bottom: 20px;
      }
    }
    .content_right {
      width: 1240px;
      height: 787px;
      background: #000b10 !important;
      border: 1px solid rgba(0, 138, 207, 0.66);
      box-shadow: inset -5px -5px 6px 0px #0f2937, inset 5px 6px 6px 0px #0f2937;
      opacity: 0.9;
      overflow: hidden;
      .search_box {
        width: 100%;
        height: 58px;
        background: #00080B;
        box-shadow: 0px 1px 0px 0px rgba(13, 98, 140, 0.38);
        // border-bottom: ;
        .alarm-list {
          overflow: auto;
        }
      }
    }
  }
}
</style>
