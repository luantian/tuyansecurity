<template>
  <div style="width: 100%;" class="flex1 flex" ref="box">
    <div class="flex1 center box-wrap" style="color: #f8dd74">
      <i class="el-icon-school"></i>
      <div class="text">单位数量</div>
      <div class="center num">{{info.dr_unit_count}}</div>
    </div>
    <!-- <div class="flex1 center box-wrap" style="color: #f8dd74">
      <i class="el-icon-user"></i>
      <div class="text">使用人数</div>
      <div class="center num">3702</div>
    </div> -->
    <div class="flex1 center box-wrap" style="color: #7bd7f5">
      <i class="el-icon-monitor"></i>
      <div class="text">设备数量</div>
      <div class="center num">{{info.dr_device_count}}</div>
    </div>
    <!-- <el-table v-if="maxHeight" :max-height="maxHeight" :data="list" size="mini" style="width: 100%" :row-style="{color:'#fff'}">
      <el-table-column prop="date" label="报警时间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="name" label="单位名称">
      </el-table-column>
      <el-table-column prop="info" label="警情描述">
      </el-table-column>
      <el-table-column prop="type" label="设备类型">
      </el-table-column>
    </el-table> -->

  </div>
</template>
<script>
export default {
  props:['info'],
  data() {
    return {
      maxHeight: 0
    }
  },
  mounted(){
  	this.maxHeight = this.$refs.box.offsetHeight
  },
  methods:{

  }
}

</script>
<style lang="scss" scoped>
.box-wrap{
  flex-direction: column;
  i{
    font-size: 50px;
  }
  .text{
    margin-top: 5px;
    font-size: 20px;
    font-family: '微软雅黑';
  }
  .num{
    margin-top: 5px;
    font-size: 32px;
  }
}
</style>
