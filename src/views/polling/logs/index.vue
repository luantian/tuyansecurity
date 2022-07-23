<template>
  <div class="dashboard-container">
    <!-- <div class="btnBox">
      <el-date-picker
      v-model="ex_date"
      type="date"
      placeholder="选择日期"
      :picker-options="pickerOptions"
      size="mini" value-format="timestamp">
    </el-date-picker>
      <el-button type="primary" size="mini" style="margin-left: 15px" @click="export_data">导出</el-button>
    </div> -->

    <!-- 表格 -->
    <el-table
      :data="tableData"
      :height="tableHeight"
      style="width: 100%"
      v-loading="loading"
      row-key="id"
      border
      :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
      highlight-current-row
      size="mini"
    >
      <el-table-column
        prop="drPatrolPlan"
        label="巡检计划名称"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="drPatrol"
        label="巡检配置名称"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="drPatrolFacility"
        label="消防设施"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="drPatrolFacility"
        label="状态"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.drUnfinsh > 0 ? "未完成" : "已完成" }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="巡检计划开始时间"
        width="180"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ formatDateTime(scope.row.drPatrolPlanTime * 1000) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="info(scope.row)"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.PageSize"
      @pagination="getList"
    />
    <el-dialog :close-on-click-modal="false" title="详情" :visible.sync="dialogVisible" width="820px">
      <el-table
        :data="details"
        :height="450"
        style="width: 100%"
        border
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
        highlight-current-row
        size="mini"
      >
        <el-table-column
          prop="drPatrolPlan"
          label="巡检计划名称"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="drPatrol"
          label="巡检配置名称"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
        prop="drPatrolFacility"
        label="消防设施"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="drPatrolFacility"
        label="状态"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span v-if="scope.row.drPatrolStatus==1">正常</span>
          <span v-if="scope.row.drPatrolStatus==0">异常</span>
          <span v-if="scope.row.drPatrolStatus==2">未巡检</span>
        </template>
      </el-table-column>

      <el-table-column
        label="巡检开始时间"
        width="180"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ formatDateTime(scope.row.drPatrolPlanTime * 1000) }}</span>
        </template>
      </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // 分页
import { formatDate, formatDateTime } from "@/utils";

export default {
  name: "NoticeList",
  components: {
    Pagination,
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7; //如果没有后面的-8.64e7就是不可以选择今天的
        },
      },
      ex_date: "",
      tableHeight: "",
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
        handle: "",
        dr_power_father_key: "",
      },
      details: [],
    };
  },
  created() {
    this.tableHeight = document.body.clientHeight - 250;
    this.getList();
  },
  methods: {
    formatDate,
    formatDateTime,
    handleSearch() {
      this.getList();
    },
    getList() {
      this.loading = true;
      this.$post("/v1/dr/patrol-note", this.listQuery)
        .then((res) => {
          this.loading = false;
          this.tableData = res.data.list;
          this.total = res.data.count;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    info(row) {
      this.details = [];
      this.$get(
        `/v1/dr/patrol-note-list/${row.drPatrolPlanUuid}/${row.drPatrolPlanTime}`
      ).then((res) => {
        this.details = res.data;
        this.dialogVisible = true
      });
    },
  },
};
</script>

<style scoped>
</style>
