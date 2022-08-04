<template>
  <div class="v-box">
    <div class="flex">
      <div class="tree-list" v-show="showList">
        <AreaSelect
          @handleSelect="handleSelectArea"
          @ready="handleSelectArea"
          ref="areaTree"
        ></AreaSelect>
      </div>
      <div class="flex1 v-right">
        <div class="align-center topbar">
          <i
            :class="`el-icon-s-${showList ? 'fold' : 'unfold'} topbar-icon`"
            @click="listToggle"
          ></i>
          <div class="flex1"></div>
          <div class="align-center">
            <i
              :class="`${
                nowV == 'v1' ? 'active' : ''
              } topbar-icon el-icon-monitor`"
              @click="changeV('v1')"
            ></i>
            <i
              :class="`${
                nowV == 'v4' ? 'active' : ''
              } topbar-icon el-icon-menu`"
              @click="changeV('v4')"
            ></i>
            <i
              :class="`${
                nowV == 'v9' ? 'active' : ''
              } topbar-icon el-icon-s-grid`"
              @click="changeV('v9')"
            ></i>
            <!-- <el-button type="primary" size="mini" @click="closeAll">一键关闭</el-button> -->
            <i
              class="topbar-icon el-icon-full-screen"
              title="全屏"
              @click="fullScreen"
            ></i>
          </div>
        </div>
        <div v-if="showVideo" style="height:100%">
          <div class="v1" id="fulldiv-v1" v-if="nowV == 'v1'">
            <el-row :gutter="0">
              <el-col :span="24">
                <video ref="v10" class="video-js video"></video>
              </el-col>
            </el-row>
          </div>
          <div class="v4" id="fulldiv-v4" v-if="nowV == 'v4'">
            <el-row :gutter="20">
              <el-col :span="12">
                <video ref="v40" class="video-js video"></video>
              </el-col>
              <el-col :span="12">
                <video ref="v41" class="video-js video"></video>
              </el-col>
            </el-row>
            <el-row class="mt20" :gutter="20">
              <el-col :span="12">
                <video ref="v42" class="video-js video"></video>
              </el-col>
              <el-col :span="12">
                <video ref="v43" class="video-js video"></video>
              </el-col>
            </el-row>
          </div>
          <div class="v9" id="fulldiv-v9" v-if="nowV == 'v9'">
            <el-row :gutter="20">
              <el-col :span="8">
                <video ref="v90" class="video-js video"></video>
              </el-col>
              <el-col :span="8">
                <video ref="v91" class="video-js video"></video>
              </el-col>
              <el-col :span="8">
                <video ref="v92" class="video-js video"></video>
              </el-col>
            </el-row>
            <el-row class="mt20" :gutter="20">
              <el-col :span="8">
                <video ref="v93" class="video-js video"></video>
              </el-col>
              <el-col :span="8">
                <video ref="v94" class="video-js video"></video>
              </el-col>
              <el-col :span="8">
                <video ref="v95" class="video-js video"></video>
              </el-col>
            </el-row>
            <el-row class="mt20" :gutter="20">
              <el-col :span="8">
                <video ref="v96" class="video-js video"></video>
              </el-col>
              <el-col :span="8">
                <video ref="v97" class="video-js video"></video>
              </el-col>
              <el-col :span="8">
                <video ref="v98" class="video-js video"></video>
              </el-col>
            </el-row>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import AreaSelect from "@/components/AreaSelect";

export default {
  components: { AreaSelect },
  data() {
    return {
      params: {
        dr_unit_id: "",
        dr_model_type: "camera",
      },
      showVideo: true,
      fullscreen: false,
      filterText: "",
      showList: true,
      nowV: "v1",
      player: null,
      v1: [],
      v4: [],
      v9: [],
      options: {
        autoplay: true,
        controls: true,
        language: "zh-CN",
        src: "",
        sources: [
          {
            src: "",
          },
        ],
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    
  },
  methods: {
    handleSelectArea(data) {
      this.params.dr_unit_id = data.dr_unit_id;
      this.getList();
    },
    getList() {
      this.showVideo = false;
      this.$post("/v1/dr/device-list-custom", this.params).then((res) => {
        let arr = res.data;

        this.showVideo = true;
        this.$nextTick(() => {
          this.v1 = [
            {
              options: {
                ...this.options,
                src: arr[0] ? arr[0].dr_camera_url : "",
                sources: [
                  {
                    src: arr[0] ? arr[0].dr_camera_url : "",
                  },
                ],
              },
            },
          ];
          for (let i = 0; i < 4; i++) {
            this.v4.push({
              options: {
                ...this.options,
                src: arr[i] ? arr[i].dr_camera_url : "",
                sources: [
                  {
                    src: arr[i] ? arr[i].dr_camera_url : "",
                  },
                ],
              },
            });
          }
          for (let i = 0; i < 9; i++) {
            this.v9.push({
              options: {
                ...this.options,
                src: arr[i] ? arr[i].dr_camera_url : "",
                sources: [
                  {
                    src: arr[i] ? arr[i].dr_camera_url : "",
                  },
                ],
              },
            });
          }
          this.setVideo();
        });
      });
    },
    setVideo() {
      this[this.nowV].map((it, i) => {
        this.$video(
          this.$refs[this.nowV + i],
          it.options,
          function onPlayerReady() {
            it.player = this;
          }
        );
      });
    },
    fullScreen() {
      let fullarea = document.getElementById("fulldiv-" + this.nowV);
      if (fullarea.requestFullscreen) {
        fullarea.requestFullscreen();
      } else if (fullarea.webkitRequestFullScreen) {
        fullarea.webkitRequestFullScreen();
      } else if (fullarea.mozRequestFullScreen) {
        fullarea.mozRequestFullScreen();
      } else if (fullarea.msRequestFullscreen) {
        // IE11
        fullarea.msRequestFullscreen();
      }
    },
    changeV(v) {
      this.nowV = v;
      this.closeAll();
      this.$nextTick(() => {
        this.setVideo();
      });
    },
    closeAll() {
      this[this.nowV].map((it) => {
        // it.player && it.player.src({
        //   src: ''
        // })
      });
    },
    listToggle() {
      this.showList = !this.showList;
    },
  },
};
</script>

<style lang="scss" scoped>
.topbar {
  padding-bottom: 10px;

  .topbar-icon {
    cursor: pointer;
    font-size: 22px;
    color: #fff;
    font-weight: 400;
    transition: all 0.3s;
    margin: 0 8px;

    &:hover {
      color: #02acd3;
    }

    &.active {
      color: #02acd3;
    }
  }
}

.v-box {
  width: 100%;
}

.video-wrap {
  height: 60vh;
  width: 100%;
  flex-wrap: wrap;
}

.vitem {
  width: 33%;
  height: 33%;
  //border: 1px solid #666;
  margin: 1px;

  video {
    width: 100%;
    height: 100%;
  }
}

.video {
  width: 100%;
  height: 100%;
}

.v9 {
  height: calc(100% - 65px);

  .el-row {
    height: 33%;
  }

  .el-col {
    height: 100%;
  }
}

.v4 {
  height: calc(100% - 45px);

  .el-row {
    height: 50%;
  }

  .el-col {
    height: 100%;
  }
}

.v1 {
  height: calc(100% - 35px);

  .el-row {
    height: 100%;
  }

  .el-col {
    height: 100%;
  }
}

.v-right {
  height: 65vh;
}
</style>

<style lang="scss">
.tree-list {
  width: 170px;
  margin-right: 20px;

  .el-input__inner {
    background-color: rgba(0, 0, 0, 0) !important;
    color: #fff !important;
    font-size: 12px !important;
  }

  .el-tree,
  .el-tree:focus,
  .el-tree-node:focus {
    background-color: rgba(0, 0, 0, 0);
    color: #fff;
  }

  .el-tree-node:focus > .el-tree-node__content,
  .el-tree-node__content:hover {
    background-color: #082b60;
    color: #fff;
  }
}
</style>
