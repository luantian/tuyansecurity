<template>
  <div class="black flex alarm-detail new-alarm-detail">
    <div class="video-box"
         v-if="nowUnit.dr_camera_url||nowUnit.dr_notice_point">
      <div v-if="nowUnit.dr_camera_url">
        <div class="title">
          <div>
            <span style="margin-right: 15px">视频监控</span>
          </div>
        </div>
        <video ref="v101"
               class="video-js video"
               style="margin-bottom:5px"></video>
        <div class="center">
          <el-button type="primary"
                     size="mini"
                     @mousedown.native="setVideo(2)"
                     @mouseup.native="endVideo()">向左</el-button>
          <el-button type="primary"
                     size="mini"
                     @mousedown.native="setVideo(3)"
                     @mouseup.native="endVideo()">向右</el-button>
          <el-button type="primary"
                     size="mini"
                     @mousedown.native="setVideo(0)"
                     @mouseup.native="endVideo()">向上</el-button>
          <el-button type="primary"
                     size="mini"
                     @mousedown.native="setVideo(1)"
                     @mouseup.native="endVideo()">向下</el-button>
          <!-- <el-button type="primary" size="mini" @mousedown.native="setVideo(8)" @mouseup.native="endVideo()">放大</el-button>
          <el-button type="primary" size="mini" @mousedown.native="setVideo(9)" @mouseup.native="endVideo()">缩小</el-button> -->
        </div>
      </div>
      <div v-if="nowUnit.dr_notice_point">
        <div class="title">
          <div>
            <span style="margin-right: 15px">点位图</span>
          </div>
        </div>
        <div class="point-wrap alert-point"
             ref="wrap">
          <img class="bim"
               :src="nowUnit.dr_notice_point.dr_building_pic" />
          <div class="point-marker"
               v-for="(item, index) in nowUnit.dr_notice_point.dr_building_point"
               :key="index"
               :style="`left:${item.x};top:${item.y}`">
            <el-tooltip class="item"
                        effect="dark"
                        :content="item.dr_device_name"
                        placement="top">
              <img :src="item.dr_icon"
                   :class="nowUnit.dr_device_id==item.dr_device_id?'blink':''" />
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>
    <div class="flex1 right-box">
      <div class="company-info">
        <div class="title">
          <div>
            <span style="margin-right: 15px">单位信息</span>
          </div>
        </div>
        <ul class="company-table">
          <li>
            <div class="name">单位名称</div>
            <div class="info">
              <div :title="nowUnit.dr_unit_name">{{ nowUnit.dr_unit_name }}</div>
            </div>
          </li>
          <li>
            <div class="name">所属位置</div>
            <div class="info">
              <div :title="nowUnit.dr_address">{{ nowUnit.dr_address }}</div>
            </div>
          </li>
          <li>
            <div class="name">设备地点</div>
            <div class="info">
              <div :title="nowUnit.dr_device_name">{{ nowUnit.dr_device_name }}</div>
            </div>
          </li>
          <li>
            <div class="name">报警设备</div>
            <div class="info">
              <div :title="nowUnit.dr_device_serial">{{ nowUnit.dr_device_serial }}</div>
            </div>
          </li>
          <li>
            <div class="name">报警时间</div>
            <div class="info">
              <div>
                {{
                  new Date(nowUnit.dr_create_time * 1000).Format(
                    "yy-MM-dd hh:mm:ss"
                  )
                }}
              </div>
            </div>
          </li>
          <li>
            <div class="name">联系人</div>
            <div class="info">
              <div>{{ nowUnit.dr_duty_name }}</div>
            </div>
          </li>
          <li>
            <div class="name">联系电话</div>
            <div class="info">
              <div>{{ nowUnit.dr_duty_phone }}</div>
            </div>
          </li>
          <li>
            <div class="name">序列号</div>
            <div class="info">
              <div :title="nowUnit.dr_device_serial">{{ nowUnit.dr_device_serial }}</div>
            </div>
          </li>

          <li>
            <div class="name">报警类型</div>
            <div class="info">
              <div>{{ typeMap[nowUnit.dr_model_type] }}</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="heshi mt20">
        <div class="title">
          <div>
            <span style="margin-right: 15px">确认结果</span>
          </div>
        </div>
        <!-- <div class="mt10" style="color: #999;">处理状态</div>
      <div class="mt10">
        <el-radio v-model="form.dr_notice_status" :label="1">核实中</el-radio>
        <el-radio v-model="heshi" :label="1">已核实</el-radio>
        </div>-->
        <div>
          <!-- <div class="mt20" style="color: #999;">核实结果</div> -->
          <div class="mt10">
            <!-- <el-radio v-model="form.dr_notice_status" :label="1"
              >核实中</el-radio
            >-->
            <el-radio v-model="form.dr_notice_status"
                      :label="2">误报</el-radio>
            <el-radio v-model="form.dr_notice_status"
                      :label="3">报警</el-radio>
            <el-radio class="mt10"
                      v-model="form.dr_notice_status"
                      :label="4">真实火警</el-radio>
            <el-radio class="mt10"
                      v-model="form.dr_notice_status"
                      :label="5">测试</el-radio>
          </div>
          <div class="mt20">
            <el-input v-model="form.dr_handel_suggest"
                      placeholder="请填写处理意见"
                      size="small"
                      clearable></el-input>
          </div>
          <div class="mt20">
            <el-input v-model="form.dr_user_name"
                      placeholder="请填写确认人"
                      size="small"
                      clearable></el-input>
          </div>
        </div>
        <div class="mt20">
          <el-button type="primary"
                     class="big-btn"
                     @click="save">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: ["nowUnit"],
  data () {
    return {
      form: {
        dr_notice_status: 2,
        type: 1,
        dr_handel_suggest: "",
        dr_user_name: '',
      },
      heshi: 0,
      video: null,
      options: {
        autoplay: true,
        controls: true,
        language: "zh-CN",
        src: "",
        sources: [
          {
            src: "",
            //type: "video/mp4"
          },
        ],
      },
      typeMap: {
        'co': '一氧化碳',
        'yc': '用户传输装置',
        'smoke': '烟感',
        'bw': '无线燃气(丙烷)',
        'camera': '摄像头',
        'sw': '水位',
        'sy': '水压',
        'dq': '电气检测',
        'ch4': '甲烷',
      }
    };
  },
  mounted () {
    if (this.nowUnit.dr_camera_url) {
      this.options.src = this.nowUnit.dr_camera_url;
      this.options.sources[0].src = this.nowUnit.dr_camera_url;
      this.video = this.$video(
        this.$refs.v101,
        this.options,
        function onPlayerReady () {
          //it.player = this
        }
      );
    }
    if (this.nowUnit.dr_notice_point) {
      this.nowUnit.dr_notice_point.dr_building_point =
        JSON.parse(this.nowUnit.dr_notice_point.dr_building_point || "[]") || [];
    }
  },
  methods: {
    setVideo (direction) {
      let formData = new FormData();
      formData.append('accessToken', this.nowUnit.dr_device_token);
      formData.append('deviceSerial', this.nowUnit.dr_device_serial);
      formData.append('channelNo', this.nowUnit.dr_channel_num);
      formData.append('direction', direction);
      formData.append('speed', 1);

      axios({
        method: 'post',
        url: 'https://open.ys7.com/api/lapp/device/ptz/start',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
      }).then(res => {
        if (res.data.code != 200) {
          this.$message.warning(res.data.msg)
        }
      })
    },
    endVideo () {
      let formData = new FormData();
      formData.append('accessToken', this.nowUnit.dr_device_token);
      formData.append('deviceSerial', this.nowUnit.dr_device_serial);
      formData.append('channelNo', this.nowUnit.dr_channel_num);
      // formData.append('direction',direction);
      // formData.append('speed',1);

      axios({
        method: 'post',
        url: 'https://open.ys7.com/api/lapp/device/ptz/stop',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
      });
    },
    save () {
      if (!this.form.dr_user_name) {
        return this.$message.warning('请填写确认人！')
        // return this.$message({type: 'error', message: '请填写确认人！', duration: 300000})
      }
      this.form.dr_device = this.nowUnit.dr_device_serial;
      this.form.dr_notice_uuid = this.nowUnit.dr_notice_uuid;
      this.$post("/v1/dr/notice-handle", this.form).then((res) => {
        if (this.video) {
          this.video.dispose();
          this.video = null
        }
        this.$emit("finish", this.nowUnit);
        this.$message.success("处理成功");
      });
    },
  },
};
</script>

<style lang="scss">
.point-wrap.alert-point {
  width: 550px;
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

  @keyframes bli {
    0% {
      opacity: 0.5;
      transform: scale(0.7);
    }
    100% {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  .blink {
    animation: bli 0.5s infinite alternate;
  }
}

.alarm-detail {
  color: #fff;

  .video-box {
    width: 585px;
    .video {
      width: 550px;
      height: 300px;
    }
  }

  .right-box {
    min-height: 500px;
    overflow: auto;
    flex-basis: 0;
  }

  .el-radio__label {
    color: hsla(0, 0%, 100%, 0.7);
  }

  .big-btn {
    width: 100%;
    max-width: 100%;
  }

  .title {
    margin-bottom: 10px;
    font-size: 16px;
    // color: hsla(0, 0%, 100%, 0.7);
    display: flex;
    align-items: center;
    background-color: #011018;
    justify-content: space-between;
  }

  .company-table {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    color: #fff;
    line-height: 30px;

    li {
      flex: 1;
      margin-bottom: 1px;
      display: flex;

      .name {
        width: 100px;
        display: flex;
        justify-content: flex-end;
        // background: rgba(54, 61, 93, 0.6);
        background-color: #011018;
        padding-right: 8px;
        color: hsla(0, 0%, 100%, 0.4);
      }

      .info {
        color: hsla(0, 0%, 100%, 0.7);
        min-width: 0;
        margin-left: 1px;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        padding: 0 18px;
        // background: rgba(54, 61, 93, 0.6);
        background-color: #011018;
        display: flex;
        align-items: center;

        & > div {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
#dark {
  #gss {
    .el-dialog__body {
      background: #011018 !important;
    }
  }
  .new-alarm-detail {
    background: #011018 !important;
    .right-box {
      background: #011018 !important;
      .name {
        color: #fff;
      }
      .info {
        color: #fff;
      }
    }
    .el-button {
      max-width: 100%;
    }
  }
}
.el-message {
  background: inherit !important;
  &.el-message--success {
    background: #F0F9EB !important;
  }
  &.el-message--error {
    background: #FEF0F0 !important;
  }
}
</style>
