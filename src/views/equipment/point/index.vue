<template>
<div class="dashboard-container">
  <el-row :gutter="20" type="flex">
    <el-col :span="6" style="width:220px">
      <AreaSelect @handleSelect="handleSelectArea" @ready="handleSelectArea" ref="areaTree"></AreaSelect>
    </el-col>
    <el-col :span="18" style="flex:1">
      <!-- 表格 -->
      <el-table  :stripe="true" :row-class-name="tableRowClassName" :data="tableData" :height="tableHeight" border size="mini" v-loading="loading" :header-cell-style="{background:'#f5f7fa',color:'#606266'}" highlight-current-row style="width: 100%" empty-text="暂无数据">
        <el-table-column prop="dr_building_floor" label="楼层名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dr_building_area" label="楼层面积" align="center" show-overflow-tooltip />

        <el-table-column prop="dr_overdue_time" label="点位图" align="center" width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <img v-if="scope.row.dr_building_pic" :src="scope.row.dr_building_pic" alt="" style="width:80px;height:80px">
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column prop="dr_overdue_time" label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.dr_building_pic" type="primary" size="small" @click="setPoint(scope.row)">设置点位</el-button>

          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <point ref="point" :build="nowBuild" :all_build="tableData" @finish="getList" :dr_unit_id="dr_unit_id"></point>
</div>
</template>

<script>
import {
  mapGetters
} from "vuex";
import point from "./point.vue";
import {
  formatDate,
  formatDateTime
} from "@/utils";
import Pagination from "@/components/Pagination"; // 分页
import AreaSelect from '@/components/AreaSelect'
export default {
  name: "GroupBusiness",
  components: {
    Pagination,
    AreaSelect,
    point
  },
  computed: {
    ...mapGetters(["name"]),
    selective() {
      return this.multipleSelection.length === 0
    },
  },

  data() {
    return {
      showArea: false,
      tableHeight: '',
      dialogVisible: false,
      filterBtn: false,
      tableData: [],
      total: 0,
      multipleSelection: [],
      loading: false,
      areaList: [],
      dataMove: [],
      listQuery: {
        page: 1,
        PageSize: 20,
        dr_role_type: 1
      },
      statusOptions: [{
        value: 1,
        label: '正常'
      }, {
        value: 0,
        label: '停用'
      }, ],
      isEdit: false,
      nowBuild: null,
      dr_unit_id: ''
    }
  },
  created() {
    this.tableHeight = document.body.clientHeight - 200;
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "stripe1-row";
      } else {
        return "stripe2-row";
      }
    },
    formatDate,
    formatDateTime,
    handleSelectArea(data) {
      this.listQuery.dr_unit_key = data.dr_self_key
      this.dr_unit_id = data.dr_unit_id
      //this.ruleForm.dr_unit_key = data.id
      this.getList()
    },
    setPoint(it) {
      console.log(it)
      this.nowBuild = {
        ...it
      };
      this.$refs.point.show()
    },
    handleSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    handleReset() {
      this.getList()
    },
    getList() {
      this.loading = true;
      this.$post('/v1/dr/get-unit-building', this.listQuery).then(res => {
        this.loading = false;
        this.tableData = res.data || []
      }).catch(error => {
        this.loading = false;
      });
    },
    submitForm() {

    }
  }
};
</script>

<style lang="scss" scoped>
</style>
