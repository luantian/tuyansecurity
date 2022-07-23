<template>
<div class="dashboard-container">
  <div class="btnBox">
      <el-date-picker
      v-model="ex_date"
      type="date"
      placeholder="选择日期"
      :picker-options="pickerOptions"
      size="mini" value-format="timestamp">
    </el-date-picker>
    <el-button type="primary" size="mini" style="margin-left: 15px" @click="export_data">导出</el-button>
    <el-select size="mini" style="width: 200px;margin-left: 20px;" v-model="listQuery.dr_notice_status" placeholder="根据类型搜索" clearable filterable>
      <el-option v-for="(item,index) in handle"
        :key="index"
        :label="item"
        :value="index">
      </el-option>
    </el-select>
    <el-button type="primary" size="mini" style="margin-left: 15px" @click="handleSearch">搜索</el-button>
    
    </div>

  <!-- 表格 -->
  <el-table :data="tableData" :height="tableHeight" style="width: 100%" v-loading="loading" row-key="id" border :header-cell-style="{background:'#f5f7fa',color:'#606266'}" highlight-current-row size="mini">
    <el-table-column prop="dr_device_name" label="设备名称" align="center" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="dr_notice_status" label="报警状态" align="center" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{handle[scope.row.dr_notice_status]||'核实中'}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="dr_notice_status" label="处理人" align="center" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{scope.row.dr_user_name}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="dr_notice_status" label="处理时间" align="center" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{formatDateTime(scope.row.dr_alarm_time*1000)}}</span>
      </template>
    </el-table-column>
     <el-table-column prop="dr_handel_suggest" label="处理意见" align="center" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="dr_device_serial" label="设备号" align="center" show-overflow-tooltip />
    <el-table-column label="设备型号" align="center" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{scope.row.dr_model}}</span>
      </template>
    </el-table-column>
    <!-- <el-table-column prop="dr_user_phone" label="所属人电话" align="center" show-overflow-tooltip /> -->
    <el-table-column label="报警时间" width="180" align="center" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{formatDateTime(scope.row.dr_create_time*1000)}}</span>
      </template>
    </el-table-column>
  </el-table>
  <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.PageSize" @pagination="getList" />
</div>
</template>

<script>
import Pagination from "@/components/Pagination"; // 分页
import {
  noticeList
} from "@/api/device"
import {
  formatDate,
  formatDateTime
} from "@/utils";

export default {
  name: 'NoticeList',
  components: {
    Pagination
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天的 
        }
      },
      ex_date: '',
      tableHeight: '',
      dialogVisible: false,
      tableData: [],
      total: 0,
      multipleSelection: [],
      loading: false,
      listQuery: {
        page: 1,
        PageSize: 10,
      },
      ruleForm: {
        handle: '',
        dr_power_father_key: ''
      },
      handle: {
        //1: '核实中',
        2: '误报',
        3:'报警',
        4:'真实火警',
        5:'测试'
      },
      device_category: {
        "CAMERA": '摄像头',
        "ALARM": '报警器',
        'SOCKET': '智能插座'
      },
      person_category: {
        0: '自己',
        1: '托管人',
        2: '集团'
      }
    }
  },
  created() {
    this.tableHeight = document.body.clientHeight - 250
    this.getList()
  },
  methods: {
    formatDate,
    formatDateTime,
    handleSearch() {
      this.getList()
    },
    export_data() {
      if (!this.ex_date) {
        return this.$message.error('请先选择日期')
      }
      let s_time = this.ex_date / 1000
      let e_time = s_time + 86399

      this.$down(`/v1/dr/notice-export/${s_time}/${e_time}`, '报警日志').then(res => {

      })
    },
    getList() {
      for(let key in this.listQuery){
        if(this.listQuery[key]===''){
          delete this.listQuery[key]
        }
      }
      this.loading = true;
      noticeList(this.listQuery).then(res => {
        this.loading = false;
        this.tableData = res.data.list
        this.total = res.data.count
      }).catch(err => {
        this.loading = false;
      })
    }
  }
}
</script>

<style scoped>

</style>
