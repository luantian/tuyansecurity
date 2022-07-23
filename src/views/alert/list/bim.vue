<template>
  <div style="width: 100%" class="bim-box" ref="box">
    <el-carousel trigger="click" :height="maxHeight+'px'" :autoplay="false" ref="carousel" indicator-position="none">
      <el-carousel-item v-for="build in list" :key="build.dr_building_id" :name="build.dr_building_id+''">
        <div class="point-wrap" ref="wrap">
          <img class="bim" :src="build.dr_building_pic" alt="" />
          <div
            class="point-marker"
            v-for="(item, index) in build.dr_building_point"
            :key="index"
            :style="`left:${item.x};top:${item.y}`"
          >
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.dr_device_name"
              placement="top"
            >
              <img :src="item.dr_icon" :class="nowWarning.dr_device_id==item.dr_device_id?'blink':''"/>
            </el-tooltip>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  <Message @warn="warn" ref="msg" :type="'alert'" />
  </div>
</template>

<script>
import { formatDate, formatDateTime } from "@/utils";
import Message from '@/components/message/index'

export default {
  components: {
    Message
  },
  props: ["unit_key"],
  data() {
    return {
      maxHeight: 0,
      list: [],
      nowWarning:{}
    };
  },
  mounted() {
    this.maxHeight = this.$refs.box.offsetHeight;
    this.getList();
  },
  methods: {
    formatDateTime,
    warn(data){
      this.$refs.msg.endWarning()
      if(data.dr_notice_point){
        this.nowWarning = data
        this.$refs.carousel.setActiveItem(data.dr_notice_point.dr_building_id+'')
        this.$emit('warn',data)
      }
      
    },
    getList() {
      this.list = [];
      this.$post("/v1/dr/get-unit-building", {
        dr_unit_key: this.unit_key,
      }).then((res) => {
        res.data.map((it) => {
          if (it.dr_building_pic) {
            it.dr_building_point =
              JSON.parse(it.dr_building_point || "[]") || [];
            this.list.push(it);
          }
        });
      });
    },
    getWarn(data) {
      this.getList();
      //console.log(this.$bus.warnInfo)
    },
  },
  watch: {
    // '$bus.warnInfo'(val){
    //   //console.log(2222,val)
    // }
  },
};
</script>

<style lang="scss" scoped>
.bim-box {
  height: 100%;
  width: 100%;
}
.point-wrap {
  position: relative;
  height: 100%;
  .bim {
    width: 100%;
    height: 100%;
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

  .blink{
    animation: bli 0.5s infinite alternate;
  }
}
</style>
