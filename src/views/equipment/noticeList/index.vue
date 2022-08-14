<template>
  <div class="dashboard-container">
    <div class="btnBox ">
      <el-date-picker v-model="ex_date"
                      type="daterange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerOptions"
                      size="mini"
                      value-format="timestamp">
      </el-date-picker>
      <el-select size="mini"
                 style="width: 200px;margin-left: 20px;"
                 v-model="listQuery.dr_notice_status"
                 placeholder="选择报警状态"
                 clearable
                 filterable>
        <el-option v-for="(item,index) in handle"
                   :key="index"
                   :label="item"
                   :value="index">
        </el-option>
      </el-select>
      <el-select size="mini"
                 style="width: 200px;margin-left: 20px;"
                 v-model="listQuery.dr_model_type"
                 placeholder="选择设备类型"
                 clearable
                 filterable>
        <el-option v-for="(item,index) in typesData"
                   :key="index"
                   :label="item.dr_name"
                   :value="item.dr_id">
        </el-option>
      </el-select>
      <el-button type="primary"
                 size="mini"
                 style="margin-left: 15px"
                 @click="handleSearch">搜索</el-button>
      <el-button type="primary"
                 size="mini"
                 style="margin-left: 15px"
                 @click="export_data">导出</el-button>

    </div>

    <!-- 表格 -->
    <el-table :row-class-name="tableRowClassName"
              :stripe="true"
              :data="tableData"
              :height="tableHeight"
              style="width: 100%"
              v-loading="loading"
              row-key="id"
              border
              :header-cell-style="{background:'#f5f7fa',color:'#606266'}"
              highlight-current-row
              size="mini">
      <el-table-column prop="dr_device_name"
                       label="设备名称"
                       align="center"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="dr_notice_status"
                       label="报警状态"
                       align="center"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{handle[scope.row.dr_notice_status]||'核实中'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dr_notice_status"
                       label="处理人"
                       align="center"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.dr_user_name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dr_notice_status"
                       label="处理时间"
                       align="center"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{formatDateTime(scope.row.dr_alarm_time*1000)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dr_handel_suggest"
                       label="处理意见"
                       align="center"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="dr_device_serial"
                       label="设备号"
                       align="center"
                       show-overflow-tooltip />
      <el-table-column label="设备型号"
                       align="center"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.dr_model}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="dr_user_phone" label="所属人电话" align="center" show-overflow-tooltip /> -->
      <el-table-column label="报警时间"
                       width="180"
                       align="center"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{formatDateTime(scope.row.dr_create_time*1000)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0"
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.PageSize"
                @pagination="getList" />
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
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() >= new Date().getTime() //如果没有后面的-8.64e7就是不可以选择今天的
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
        PageSize: 20,
      },
      ruleForm: {
        handle: '',
        dr_power_father_key: ''
      },
      handle: {
        1: '核实中',
        2: '误报',
        3: '报警',
        4: '真实火警',
        5: '测试'
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
      },
      typesData: []
    }
  },
  created () {
    this.tableHeight = document.body.clientHeight - 250
    this.getList();
    this.getTypes();
  },
  methods: {
    formatDate,
    formatDateTime,
    handleSearch () {
      this.listQuery.page = 1;
      this.getList()
    },
    export_data () {
      if (!this.ex_date) {
        return this.$message.error('请先选择日期')
      }
      let s_time = this.ex_date[0] / 1000
      let e_time = this.ex_date[1] / 1000
      let dr_model_type = this.listQuery.dr_model_type || 'none';
      let dr_notice_status = this.listQuery.dr_notice_status || 'none';
      this.$down(`/v1/dr/notice-export/${s_time}/${e_time}/${dr_model_type}/${dr_notice_status}`, '报警日志')
    },
    getList () {
      for (let key in this.listQuery) {
        if (this.listQuery[key] === '') {
          delete this.listQuery[key]
        }
      }
      this.listQuery.dr_start_time = this.ex_date && this.ex_date[0] / 1000 || ''
      this.listQuery.dr_end_time = this.ex_date && this.ex_date[1] / 1000 || ''
      this.loading = true;
      noticeList(this.listQuery).then(res => {
        this.loading = false;
        this.tableData = res.data.list
        this.total = res.data.count
      }).catch(err => {
        this.loading = false;
      })
    },
    //获取设备类型
    getTypes () {
      this.$get('/v1/dr/mapcode-list/42').then(res => {
        this.typesData = [...res.data]
      })
    },
     tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "stripe1-row";
      } else {
        return "stripe2-row";
      }
    },
  }
}
</script>

<style scoped lang="scss" >
.btnBox {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  .el-button {
    margin-bottom: 0px !important;
  }
}
</style>