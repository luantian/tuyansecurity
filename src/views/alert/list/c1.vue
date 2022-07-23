<template>
<div style="width: 100%;" class="flex1 c1" ref="box">
  <el-table v-if="maxHeight" :max-height="maxHeight" :data="list" size="mini" :style="`width: ${maxWidth}px;`" :row-style="{color:'#fff'}">
    <el-table-column align="center" prop="time" label="报警时间" width="180" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{formatDateTime(scope.row.dr_create_time*1000)}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="dr_device_name" show-overflow-tooltip label="设备名称">
    </el-table-column>
    <el-table-column prop="dr_notice_status" label="报警状态" align="center" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{handle[scope.row.dr_notice_status]}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="dr_device_serial" label="设备号" align="center" show-overflow-tooltip />
    <el-table-column label="设备型号" align="center" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{scope.row.dr_model}}</span>
      </template>
    </el-table-column>
    <el-table-column label="处理" align="center">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="showDetail(scope.row)">处理</el-button>
        
      </template>
    </el-table-column>
  </el-table>
  <!-- <el-dialog :close-on-click-modal="false" title="报警详情" :visible.sync="showDia" v-if="showDia" :width="(nowUnit.dr_camera_url||nowUnit.dr_notice_point)?'1000px':'500px'" top="9vh" @close="$refs.detail.video.dispose()">
    <aDetail :nowUnit="nowUnit" @finish="handled" ref="detail"></aDetail>
  </el-dialog> -->
</div>
</template>

<script>
import {
  formatDate,
  formatDateTime
} from "@/utils";

export default {
  data() {
    return {
      maxHeight: 0,
      maxWidth:0,
      list: [],
      handle: {
        0: '已删除',
        1: '核实中',
        2: '误报',
        3:'报警',
        4:'真实火警',
        5:'测试'
      },
      showDia:false,
      nowUnit:{}
    }
  },
  mounted() {
    this.maxHeight = this.$refs.box.offsetHeight
    this.maxWidth = this.$refs.box.offsetWidth
    this.getList()
  },
  methods: {
    formatDateTime,
    showDetail(it) {
      this.nowUnit = {
        ...it
      }
      this.$emit('showDetail',this.nowUnit)
    },
    handled() {
      this.showDia = false;
      this.getList()
    },
    getList() {
      this.$post('/v1/dr/notice-list', {
        page: 1,
        dr_notice_status:1
      }).then(res => {
        this.list = res.data.list
      })
      
    },
    getWarn(data) {
      //this.getList()
      //console.log(this.$bus.warnInfo)
    }
  },
  watch: {
    // '$bus.warnInfo'(val){
    //   //console.log(2222,val)
    // }
  }
}
</script>

<style lang="scss">
/* .tableX为要显示滚动条的类名 */
/* 显示横向滚动条 */
// .c1 .el-table--scrollable-y .el-table__body-wrapper {
//   padding: 0 0 5px 0;
//   margin: 0 0 5px 0;
//   overflow-y: auto;
// }
/* 滚动条的滑块样式 */
// .c1 .el-table .el-table__body-wrapper::-webkit-scrollbar-thumb {
// display: block;
//   background-color: #ccc !important;
//   border-radius: 30px !important;
// }
.c1 .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar{
  display: block;
}
/* 去除右侧固定定位阴影多出来的像素 */
// .c1 .el-table__fixed-right{
//   height: calc(100% - 27px) !important;
// }

</style>
