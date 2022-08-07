<template>
  <el-dialog :close-on-click-modal="false"
    :title="`${info.dr_building_floor} 点位图设置`"
    :visible.sync="dialogVisible"
    v-if="dialogVisible"
    width="70vw"
    top="50px"
  >
    <div class="cfff flex sp-b">
      <span>选择设备，然后在点位图中标记</span>
      <span class="ml20 flex1 cfff" v-if="dev"
        >当前选择：{{ dev.dr_device_name }}，请在图中进行标记</span
      >
      <span v-show="pointList.length > 0">点击图中标记，可移除设备</span>
    </div>
    <div class="mt20 point-box">
      <div class="dev-list">
        <ul>
          <li
            class="align-center"
            v-for="(item, index) in devList"
            :key="item.dr_device_id"
            @click="check_dev(item, index)"
          >
            <img :src="item.dr_icon" alt="" class="point-img" />
            <span class="ml10 sl" :title="item.dr_device_name">{{ item.dr_device_name }}</span>
          </li>
          <div v-if="!devList.length">暂无可标记设备</div>
        </ul>
      </div>
      
      <div class="point-wrap" @click.stop="setPoint($event)" ref="wrap">
        <img :src="info.dr_building_pic" alt="" style="width: 100%" />
        <div
          class="point-marker"
          @click.stop="del(item, index)"
          v-for="(item, index) in pointList"
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

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  components:{},
  props: ["build", "all_build", "dr_unit_id"],
  watch: {
    build(val) {
      //当前建筑
      this.getDevList();
      this.getFacilities()
      this.info = { ...val };
      this.pointList = JSON.parse(this.info.dr_building_point || "[]") || [];
      this.dev = null;
    },
    all_build(val) {
      //所有建筑
      this.all_ponit = [];
      val.map((it) => {
        if (it.dr_building_point) {
          let arr = JSON.parse(it.dr_building_point || "[]") || [];
          this.all_ponit.push(...arr);
        }
      });
    },
  },
  data() {
    return {
      dialogVisible: false,
      info: {},
      devList: [],
      dev: null,
      pointList: [],
      all_ponit: [],
      all_dev:[]
    };
  },
  created() {},
  methods: {
    setPoint(e) {
      // console.log(
      //   e.layerX,
      //   e.layerY,
      //   this.$refs.wrap.offsetWidth,
      //   this.$refs.wrap.offsetHeight
      // );
      if (!this.dev) {
        return this.$message.info("请先选择设备");
      }
      this.dev.x =
        ((e.layerX - 15) / this.$refs.wrap.offsetWidth).toFixed(3) * 100 + "%";
      this.dev.y =
        ((e.layerY - 15) / this.$refs.wrap.offsetHeight).toFixed(3) * 100 + "%";
      this.pointList.push({ ...this.dev });
      this.dev = null;
    },
    del(item, index) {
      this.$confirm("确定要移除该点位吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.pointList.splice(index, 1);
          let ids = this.all_dev.map((it) => {
            return it.dr_device_id;
          });
          console.log(ids,item.dr_device_id);

          if (ids.indexOf(item.dr_device_id) !== -1) {
            this.devList.push(item);
          }
          this.$message.info(`已移除点位图中的设备：${item.dr_device_name}`);
        })
        .catch(() => {});
    },
    check_dev(it, index) {
      if(this.dev){
        this.devList.push(this.dev)
      }
      this.dev = { ...it };
      this.devList.splice(index, 1);
    },
    show() {
      this.dialogVisible = true;
    },
    hide() {
      this.dialogVisible = false;
    },
    getDevList() {
      this.devList = [];
      this.$post("/v1/dr/device-list-custom", {
        dr_unit_id: this.dr_unit_id,
      }).then((res) => {
        this.all_dev = [...res.data]
        let ids = this.all_ponit.map((it) => {
          return it.dr_device_id;
        });
        res.data.map((it) => {
          if (ids.indexOf(it.dr_device_id) === -1) {
            this.devList.push(it);
          }
        });
      });
    },
    getFacilities(){
      this.devList = [];
      this.$post("/v1/dr/facilities-list-custom", {
        dr_unit_id: this.dr_unit_id,
      }).then((res) => {
        this.all_dev = [...res.data]
        let ids = this.all_ponit.map((it) => {
          return it.dr_device_id;
        });
        res.data.map((it) => {
          if (ids.indexOf(it.dr_device_id) === -1) {
            this.devList.push(it);
          }
        });
      });
    },
    submitForm() {
      let data = JSON.stringify(this.pointList);
      this.info.dr_building_point = data;
      this.$post("/v1/dr/update-unit-building", this.info).then((res) => {
        this.$message.success("保存成功");
        this.hide();
        this.$emit("finish");
      });
    },
  },
};
</script>

<style lang="scss">
.point-box{
  position: relative;
}
.point-wrap {
  margin-left: 215px;
  position: relative;
  cursor: crosshair;
  display: flex;
  .point-marker {
    position: absolute;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.dev-list {
  padding-left: 15px;
  width: 200px;
  position: absolute;
  max-height: 100%;
  overflow-y: auto;
  li {
    margin-bottom: 10px;
    cursor: pointer;
  }
}

.point-img {
  width: 20px;
}
.sp-b{
  justify-content: space-between;
}
</style>