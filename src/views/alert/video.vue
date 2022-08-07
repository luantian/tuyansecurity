<template>
  <div class="v-box">
    <div class="flex">
      <div class="tree-list"
           v-show="showList">
        <TreeData @handleSelect="handleSelectArea"
                  @ready="handleSelectArea"
                  ref="areaTree"></TreeData>
        <!-- <AreaSelect @handleSelect="handleSelectArea"
                    @ready="handleSelectArea"
                    ref="areaTree"></AreaSelect> -->
      </div>
      <div class="flex1 v-right">
        <!-- <div class="align-center topbar">
          <i :class="`el-icon-s-${showList ? 'fold' : 'unfold'} topbar-icon`"
             @click="listToggle"></i>
          <div class="flex1"></div>
          <div class="align-center">
            <i :class="`${
                nowV == 'v1' ? 'active' : ''
              } topbar-icon el-icon-monitor`"
               @click="changeV('v1')"></i>
            <i :class="`${
                nowV == 'v4' ? 'active' : ''
              } topbar-icon el-icon-menu`"
               @click="changeV('v4')"></i>
            <i :class="`${
                nowV == 'v9' ? 'active' : ''
              } topbar-icon el-icon-s-grid`"
               @click="changeV('v9')"></i>
            <i class="topbar-icon el-icon-full-screen"
               title="全屏"
               @click="fullScreen"></i>
          </div>
        </div> -->
        <div v-if="showVideo"
             style="height:100%">
          <div class="v1"
               id="fulldiv-v1"
               v-if="nowV == 'v1'">
            <el-row :gutter="24">
              <el-col :span="24">
                <video ref="v10"
                       class="video-js video"></video>
              </el-col>
            </el-row>
          </div>
          <div class="v4"
               id="fulldiv-v4"
               v-if="nowV == 'v4'">
            <el-row :gutter="20">
              <el-col :span="12">
                <video ref="v40"
                       class="video-js video"></video>
              </el-col>
              <el-col :span="12">
                <video ref="v41"
                       class="video-js video"></video>
              </el-col>
            </el-row>
            <el-row class="mt20"
                    :gutter="20">
              <el-col :span="12">
                <video ref="v42"
                       class="video-js video"></video>
              </el-col>
              <el-col :span="12">
                <video ref="v43"
                       class="video-js video"></video>
              </el-col>
            </el-row>
          </div>
          <div class="v9"
               id="fulldiv-v9"
               v-if="nowV == 'v9'">
            <div class="oneRow">
              <div class="colDiv">
                <video ref="v90"
                       class="video-js video classVideo">
                </video>
                <!-- <div class="videoDiv">青岛万科中心A座710号房间水探测</div> -->
                <div class="videoDiv">{{this.v9[0] && this.v9[0].name  }}</div>
                <!-- <div class="videoDiv">{{this.v9[0].option.name }}</div> -->
              </div>
              <div class="colDiv">
                <video ref="v91"
                       class="video-js video">
                </video>
                <div class="videoDiv">{{this.v9[1] && this.v9[1].name  }}</div>
              </div>
              <div class="colDiv">
                <video ref="v92"
                       class="video-js video classVideo">
                </video>
                <div class="videoDiv">{{this.v9[2] && this.v9[2].name  }}</div>
              </div>
            </div>
            <div class="oneRow">
              <div class="colDiv">
                <video ref="v93"
                       class="video-js video classVideo">
                </video>
                <div class="videoDiv">{{this.v9[3] && this.v9[3].name  }}</div>
              </div>
              <div class="colDiv">
                <video ref="v94"
                       class="video-js video classVideo">
                </video>
                <div class="videoDiv">{{this.v9[4] && this.v9[4].name }}</div>
              </div>
              <div class="colDiv">
                <video ref="v95"
                       class="video-js video classVideo">
                </video>
                <div class="videoDiv">{{this.v9[5] && this.v9[5].name  }}</div>
              </div>
            </div>
            <div class="oneRow">
              <div class="colDiv">
                <video ref="v96"
                       class="video-js video classVideo">
                </video>
                <div class="videoDiv">{{this.v9[6] && this.v9[6].name  }}</div>
              </div>
              <div class="colDiv">
                <video ref="v97"
                       class="video-js video classVideo">
                </video>
                <div class="videoDiv">{{this.v9[7] && this.v9[7].name  }}</div>
              </div>
              <div class="colDiv">
                <video ref="v98"
                       class="video-js video classVideo">
                </video>
                <div class="videoDiv">{{this.v9[8] && this.v9[8].name }}</div>
              </div>
            </div>
            <!-- <el-row :gutter="20"
                    class="classRow">
              <el-col :span="8"
                      class="elCol">
                <video ref="v90"
                       class="video-js video classVideo">
                </video>
                <div class="videoDiv">青岛万科中心A座710号房间水探测</div>
              </el-col>
              <el-col :span="8">
                <video ref="v91"
                       class="video-js video"></video>
              </el-col>
              <el-col :span="8">
                <video ref="v92"
                       class="video-js video"></video>
              </el-col>
            </el-row>
            <el-row class="mt20"
                    :gutter="20">
              <el-col :span="8">
                <video ref="v93"
                       class="video-js video"></video>

              </el-col>
              <el-col :span="8">
                <video ref="v94"
                       class="video-js video"></video>
              </el-col>
              <el-col :span="8">
                <video ref="v95"
                       class="video-js video"></video>
              </el-col>
            </el-row>
            <el-row class="mt20"
                    :gutter="20">
              <el-col :span="8">
                <video ref="v96"
                       class="video-js video"></video>
              </el-col>
              <el-col :span="8">
                <video ref="v97"
                       class="video-js video"></video>
              </el-col>
              <el-col :span="8">
                <video ref="v98"
                       class="video-js video"></video>
              </el-col>
            </el-row> -->
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import AreaSelect from '@/components/AreaSelect';
import TreeData from '@/components/TreeData';

export default {
  components: { AreaSelect, TreeData },
  data () {
    return {
      params: {
        dr_unit_id: '',
        dr_model_type: 'camera',
      },
      showVideo: true,
      fullscreen: false,
      filterText: '',
      showList: true,
      nowV: 'v9',
      player: null,
      v1: [],
      v4: [],
      v9: [],
      options: {
        autoplay: true,
        controls: true,
        language: 'zh-CN',
        src: '',
        sources: [
          {
            src: '',
          },
        ],
      },
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    };
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted () { },
  methods: {
    handleSelectArea (data) {
      this.params.dr_unit_id = data.dr_unit_id;
      this.getList();
    },
    getList () {
      this.showVideo = false;
      this.$post('/v1/dr/device-list-custom', this.params).then((res) => {
        let arr = res.data;

        this.showVideo = true;
        this.$nextTick(() => {
          this.v1 = [
            {
              options: {
                ...this.options,
                src: arr[0] ? arr[0].dr_camera_url : '',
                sources: [
                  {
                    src: arr[0] ? arr[0].dr_camera_url : '',
                  },
                ],
              },

              name: arr[0] ? arr[0].dr_device_name : '',
            },
          ];
          for (let i = 0; i < 4; i++) {
            this.v4.push({
              options: {
                ...this.options,
                src: arr[i] ? arr[i].dr_camera_url : '',

                sources: [
                  {
                    src: arr[i] ? arr[i].dr_camera_url : '',
                  },
                ],
              },
              name: arr[i] ? arr[i].dr_device_name : '',
            });
          }
          for (let i = 0; i < 9; i++) {
            this.v9.push({
              options: {
                ...this.options,
                src: arr[i] ? arr[i].dr_camera_url : '',
                sources: [
                  {
                    src: arr[i] ? arr[i].dr_camera_url : '',
                  },
                ],
              },
              name: arr[i] ? arr[i].dr_device_name : '',
            });
          }
          this.setVideo();
        });
      });
    },
    setVideo () {
      this[this.nowV].map((it, i) => {
        this.$video(
          this.$refs[this.nowV + i],
          it.options,
          function onPlayerReady () {
            it.player = this;
          }
        );
      });
    },
    fullScreen () {
      let fullarea = document.getElementById('fulldiv-' + this.nowV);
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
    changeV (v) {
      this.nowV = v;
      this.closeAll();
      this.$nextTick(() => {
        this.setVideo();
      });
    },
    closeAll () {
      this[this.nowV].map((it) => {
        // it.player && it.player.src({
        //   src: ''
        // })
      });
    },
    listToggle () {
      this.showList = !this.showList;
    },
  },
};
</script>

<style lang="scss">
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
  height: 100%;
  width: 100%;
  display: flex;
  .flex {
    flex: 1;
  }
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
  // height: calc(100% - 65px);
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-row {
    height: 33%;
    padding-left: 0px !important;
    .elCol {
      width: 100%;
      background: #00293d;
      border: 1px solid #0875b6;
      border-image: linear-gradient(0deg, #004a70) 10 10;
      border-radius: 3px 3px 0px 0px;
    }
    .classVideo {
      padding: 0px;
    }
  }

  .el-col {
    height: 80%;
    padding: 0px;
  }
  .videoDiv {
    width: 100%;
    height: 48px;
    background: #012233;
    font-size: 18px;
    line-height: 48px;
    text-align: center;
    border: 1px solid;
    border-image: linear-gradient(0deg, #004a70) 10 10;
    border-radius: 3px 3px 0px 0px;
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
  height: 100%;
  padding: 30px;
}
.oneRow {
  flex: 1%;
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  gap: 29px 20px;
  .colDiv {
    flex: 1;
    border: 1px solid;
    border-image: linear-gradient(0deg, #004a70) 10 10;
    border-radius: 3px 3px 0px 0px;
    display: flex;
    flex-direction: column;
    // min-width: 32%;
    // height: 100%;
    .videoDiv {
      flex-shrink: 0;
    }
  }
  // justify-items: center;
}

.tree-list {
  width: 270px;
  // height: 875px;
  height: 100%;
  background: #000c12;
  border: 1px solid rgba(0, 138, 207, 0.66);
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
