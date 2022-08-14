<template>
  <el-dialog :close-on-click-modal="false"
    :title="`${info.dr_building_floor} 点位图设置`"
    :visible.sync="dialogVisible"
    v-if="dialogVisible"
    :fullscreen="true"
  >
    <div class="cfff flex sp-b">
      <span>选择设备，然后在点位图中标记</span>
      <span class="ml20 flex1 cfff" v-if="dev"
        >当前选择：{{ dev.dr_device_name }}，请在图中进行标记</span
      >
      <span v-show="pointList.length > 0">点击图中标记，可移除设备</span>
    </div>
    <div class="mt20 point-box flex">
      <div class="dev-list">
        <div class="search_box">
          <el-input placeholder="请输入设备名称" size="small" v-model="keyword" clearable @keyup.enter.native="getSearch">
            <i slot="prefix" class="el-input__icon el-icon-search" @click="getSearch"></i>
          </el-input>
        </div>
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
        <el-pagination class="home_pagination" v-show="devList.length > 0" small :pager-count="5" :page-size="20" layout="prev, pager, next" :total="total" @current-change="getDevList"></el-pagination>
      </div>
      <div class="point_wrap_box">
        <div v-drag class="point-wrap" @click.stop="setPoint($event)" ref="wrap">
          <img :src="info.dr_building_pic" alt="" style="width:100%" draggable="false" />
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
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: ["build", "all_build", "dr_unit_id"],
  watch: {
    build(val) {
      //当前建筑
      this.getDevList(this.page);
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
    dialogVisible(val){
      if(val){
        this.$nextTick(() => {
          this.$refs['wrap'].addEventListener('mousewheel', this.debounce(this.handleScroll,300), false)||window.addEventListener("DOMMouseScroll",this.debounce(this.handleScroll,300),false)
        })
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      info: {},
      devList: [],
      dev: null,
      pointList: [],
      all_ponit: [],
      all_dev:[],
      scaleNum:1,
      keyword:'',
      page:1,
      total:0
    };
  },
  directives: {
    drag: {
      // 指令的定义
      bind: function (el) {
          let odiv = el;
          el.onmousedown = (e) => {
              //算出鼠标相对元素的位置
              let disX = e.clientX - odiv.offsetLeft+210;
              let disY = e.clientY - odiv.offsetTop;
              let left = '';
              let top = '';
              odiv.setAttribute('drag-flag',false)
              document.onmousemove = (e)=>{
                  //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                  left = e.clientX - disX;
                  top = e.clientY - disY;
                  //移动当前元素
                  odiv.style.left = left + 'px';
                  odiv.style.top = top + 'px';
                  odiv.setAttribute('drag-flag',true)
              };
              document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
              };
          };
      }
    }
  },
  methods: {
    setPoint(e) {
      // console.log(
      //   e.layerX,
      //   e.layerY,
      //   this.$refs.wrap.offsetWidth,
      //   this.$refs.wrap.offsetHeight
      // );
      let dragFlag = this.$refs['wrap'].getAttribute('drag-flag');
      if(dragFlag == 'true'){
        return;
      }
      if (!this.dev) {
        return this.$message.info("请先选择设备");
      }
      this.dev.x = ((e.layerX - 15) / this.$refs.wrap.getBoundingClientRect().width).toFixed(3) * 100 + "%";
      this.dev.y = ((e.layerY - 15) / this.$refs.wrap.getBoundingClientRect().height).toFixed(3) * 100 + "%";
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
    //搜索功能
    getSearch(){
      this.page = 1;
      this.getDevList()
    },
    getDevList(page) {
      this.page = page
      this.$post("/v1/dr/device-list-custom", {
        dr_device_name: this.keyword,
        page:this.page
      }).then((res) => {
        this.devList = [];
        this.total = res.data.count;
        this.all_dev = [...res.data.list];
        let ids = this.all_ponit.map((it) => {
          return it.dr_device_id;
        });
        res.data.list.map((it) => {
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
    //防抖
    debounce(func, wait) {
        let timeout;
        return function () {
					let context = this;
					let args = arguments;
					if (timeout) clearTimeout(timeout);
					timeout = setTimeout(() => {
            func.apply(context, args)
					}, wait);
        }
    },
    //判断滚动方向
    handleScroll(e){
      console.log(11)
      if(e.deltaY > 0){
        this.scaleNum -= 0.2;
      }else{
        this.scaleNum += 0.2;
      }
      this.$refs['wrap'].style.transform = `scale(${this.scaleNum})`
    }
  },
};
</script>

<style lang="scss" scoped>
.point_wrap_box{
  overflow: auto;
  flex: 1;
  margin-left: 20px;
}
.point-box{
  position: relative;
  height: calc(100% - 36px);
}
.point-wrap {
  position: relative;
  cursor: crosshair;
  transform-origin: 0 0;
  transition: transform ease-in 0.3s;
  .point-marker {
    position: absolute;
    width: 30px;
    height: 30px;
  }
}
.dev-list {
  width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .search_box{
    padding-bottom: 10px;
  }
  ul{
    flex: 1;
    overflow-y: auto;
    li {
      margin-bottom: 10px;
      cursor: pointer;
    }
  }
  .home_pagination{
    text-align: center !important; 
  }
}

.point-img {
  width: 20px;
}
.sp-b{
  justify-content: space-between;
}
</style>