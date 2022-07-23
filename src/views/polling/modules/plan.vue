<template>
  <div class="dashboard-container">
    <el-row :gutter="20" type="flex">
      <el-col :span="24" style="flex: 1">
        <div class="btnBox">
          <!-- 按钮 -->
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="handleAdd"
            >添加</el-button
          >
          <!-- <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            :disabled="selective"
            @click="handleDelete"
            >删除
          </el-button> -->
          <el-button
            type="primary"
            size="small"
            @click="handleFilter"
            class="floatR"
          >
            <svg-icon icon-class="filter" /><i
              :class="!filterBtn ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"
            ></i>
          </el-button>
          <!-- 检索区域 -->
          <div class="filterBox" v-show="filterBtn">
            <el-form
              ref="dataForm"
              class="formBox formBox100"
              :inline="true"
              :model="listQuery"
              label-position="right"
              label-width="100px"
            >
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="巡查计划名称">
                    <el-input
                      clearable
                      size="small"
                      v-model="listQuery.drPatrolPlanName"
                      placeholder="请输入"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="巡检类型">
                    <el-select
                      size="small"
                      v-model="listQuery.drPatrolPlanType"
                      placeholder="请选择"
                      clearable
                    >
                      <el-option
                        v-for="item in drPatrolPlanTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label=" ">
                    <el-button type="primary" size="small" @click="handleSearch"
                      >搜索</el-button
                    >
                    <el-button size="small" @click="handleReset"
                      >重置</el-button
                    >
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <!-- 表格 -->
        <el-table
          :data="tableData"
          :height="tableHeight"
          border
          size="small"
          v-loading="loading"
          :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
          highlight-current-row
          style="width: 100%"
          empty-text="暂无数据"
        >
          <!-- <el-table-column type="selection" align="center" fixed width="55" /> -->
          
          <el-table-column
            prop="drPatrolPlanName"
            label="巡查计划名称"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="drPatrolPlanType"
            label="巡查周期"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{
                drPatrolPlanTypes.filter((it) => {
                  return scope.row.drPatrolPlanType == it.value;
                })[0].label
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="drPatrolPlanStart"
            label="开始时间"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{
                formatDateTime(scope.row.drPatrolPlanStart * 1000)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="drPatrolPlanEnd"
            label="结束时间"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{
                formatDateTime(scope.row.drPatrolPlanEnd * 1000)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="drUserName"
            label="巡查员"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="address"
            label="状态"
            align="center"
            width="100"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="scope.row.drPatrolStatus == 1">未开始</span>
              <span v-if="scope.row.drPatrolStatus == 2">进行中</span>
              <span v-if="scope.row.drPatrolStatus == 0">关闭</span>
              <span v-if="scope.row.drPatrolStatus == 3">结束</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="edit(scope.row)"
                >修改</el-button
              >
              <el-button
                type="primary"
                size="small"
                v-if="!scope.row.drPatrolStatus"
                @click="handleDelete(scope.row)"
                >启用</el-button
              >
              <el-button
                type="danger"
                size="small"
                v-if="scope.row.drPatrolStatus"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
              <el-button
                type="primary"
                size="small"
                @click="openLog(scope.row)"
                >巡查日志</el-button
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
      </el-col>
    </el-row>
    <!-- 新增 -->
    <el-dialog :close-on-click-modal="false"
      :title="isEdit ? '编辑巡查计划' : '添加巡查计划'"
      :visible.sync="dialogVisible"
      width="820px"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="巡检计划名称" prop="drPatrolPlanName">
          <el-input
            clearable
            size="small"
            v-model="ruleForm.drPatrolPlanName"
          ></el-input>
        </el-form-item>
        <el-form-item label="巡检计划类型" prop="drPatrolPlanType">
          <el-select
            v-model="ruleForm.drPatrolPlanType"
            size="small"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in drPatrolPlanTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属单位" prop="drPatrolPlanUnit">
          <el-cascader
            @change="changeUnit"
            :options="units"
            :props="{
              checkStrictly: true,
              value: 'dr_unit_id',
              label: 'dr_unit_name',
              children: 'dr_son',
            }"
            clearable
            v-model="ruleForm.drPatrolPlanUnit"
            size="small"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="巡检人员" prop="drPatrolPlanPerson">
          <el-select
            v-model="ruleForm.drPatrolPlanPerson"
            size="small"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in users"
              :key="item.dr_user_id"
              :label="item.dr_user_name"
              :value="item.dr_user_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="巡检计划开始时间" prop="drPatrolPlanStart">
          <el-date-picker
            v-model="ruleForm.drPatrolPlanStart"
            :picker-options="pickerBeginDateBefore"
            type="datetime"
            placeholder="选择日期时间"
            size="small"
            value-format="timestamp"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="巡检计划结束时间" prop="drPatrolPlanEnd">
          <el-date-picker
            v-model="ruleForm.drPatrolPlanEnd"
            type="datetime"
            placeholder="选择日期时间"
            size="small"
            value-format="timestamp"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="巡检配置" prop="drPatrolPlanId">
          <el-table
            v-if="dialogVisible"
            :data="f_list"
            border
            size="mini"
            v-loading="loading"
            :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
            highlight-current-row
            style="width: 100%"
            empty-text="暂无数据"
            @selection-change="handleSelectionChange"
            :row-key="getRowKeys"
            ref="multipleTable"
            height="300"
            @select-all="selectAll"
          >
            <el-table-column
              type="selection"
              :reserve-selection="true"
              align="center"
              fixed
              width="55"
            />
            <el-table-column
              prop="drPatrolName"
              label="巡检名称"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="drPatrolCardNum"
              label="巡检卡号"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="drPatrolAddress"
              label="巡检地址"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column prop="address" label="启停状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.drPatrolStatus" class="normal">正常</span>
                <span v-else class="deactivate">停用</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="f_total > 0"
            :total="f_total"
            :page.sync="f_params.page"
            :limit.sync="f_params.PageSize"
            @pagination="getFacilities"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="巡检日志"
      :visible.sync="showLog"
      width="900px">
        <el-table :data="logList" style="width: 100%" border :header-cell-style="{background:'#f5f7fa',color:'#606266'}" size="mini">
    <el-table-column prop="dr_patrol_plan_name" label="巡检名称" align="center" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="dr_patrol_plan_time" label="巡检标签" align="center" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="dr_time" label="巡检时间" align="center" show-overflow-tooltip>
    </el-table-column>
    <el-table-column prop="dr_patrol_finish_status" label="巡检状态" align="center" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{scope.row.dr_patrol_finish_status == 1 ? '已完成' : '未完成'}}</span>
      </template>
    </el-table-column>
    <!-- <el-table-column label="报警时间" width="180" align="center" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{formatDateTime(scope.row.dr_create_time*1000)}}</span>
      </template>
    </el-table-column> -->
  </el-table>
      <span slot="footer">
        <el-button @click="showLog = false">关闭</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDate, formatDateTime } from "@/utils";
import Pagination from "@/components/Pagination"; // 分页
import AreaSelect from "@/components/AreaSelect";

export default {
  name: "efire",
  components: {
    Pagination,
    AreaSelect,
  },
  computed: {
    ...mapGetters(["name"]),
    selective() {
      return this.multipleSelection.length === 0;
    },
  },
  data() {
    return {
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() < (Date.now() - 24*60*60*1000);
        }
      },
      getRowKeys(row) {
        return row.drPatrolId;
      },
      drPatrolPlanTypes: [
        { value: 1, label: "每天" },
        { value: 2, label: "每月" },
        { value: 3, label: "随机" },
        { value: 4, label: "定时" },
      ],
      tableHeight: "",
      filterText: "",
      dialogVisible: false,
      dialogVisibleMove: false,
      dialogVisibleRenamed: false,
      dialogVisibleUpload: false,
      filterBtn: false,
      tableData: [],
      total: 0,
      multipleSelection: [],
      loading: false,
      dataMove: [],
      listQuery: {
        page: 1,
        //dr_device_nature: 2
      },
      onlineStatus: [
        {
          value: 1,
          label: "在线",
        },
        {
          value: 0,
          label: "不在线",
        },
      ],

      statusOptions: [
        {
          value: 1,
          label: "正常",
        },
        {
          value: 0,
          label: "停用",
        },
      ],
      ruleForm: {
        drPatrolPlanId: [],
        drPatrolPlanUnit: "",
        drPatrolPlanPerson: "",
      },
      rules: {
        drPatrolPlanName: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        drPatrolPlanUnit: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        drPatrolPlanType: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        drPatrolPlanPerson: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        drPatrolPlanId: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
      },
      showEdit: false,
      editForm: {},
      detail: {},
      isEdit: false,
      units: [],
      buildings: [],
      f_params: {
        page: 1,
      },
      f_total: 0,
      f_list: [],
      users: [],
      logList: [],
      showLog: false
    };
  },
  created() {
    this.tableHeight = document.body.clientHeight - 250 - 54 - 42;
    this.getList();
    this.$get("/v1/dr/unit-list").then((res) => {
      this.units = forobj(res.data);
    });
  },
  methods: {
    formatDate,
    formatDateTime,
    openLog(row) {
      this.logList = []
      this.showLog = true
      this.$get(`/v1/dr/get-patrol-log/${row.drPatrolPlanUuid}`).then(res=>{
        this.logList = res.data
      })
    },
    async changeUnit(val) {
      if(!val){
        return
      }
      this.ruleForm.drPatrolPlanPerson = "";
      this.f_list = [];
      this.ruleForm.drPatrolPlanId = [];
      this.multipleSelection = [];
      let unit_id = "";
      if (typeof val === "object") {
        unit_id = val[val.length - 1];
      } else {
        unit_id = val;
      }
      this.f_params.dr_unit_id = unit_id;
      this.f_params.page = 1;
      await this.getFacilities();
      unit_id&&this.$get(`/v1/dr/unit-detail/${unit_id}/2`).then((res) => {
        this.$get(`/v1/dr/get-user-list-unit/${res.data.dr_unit_key}`).then(
          (res) => {
            //获取人员
            this.users = res.data;
          }
        );
      });
    },
    getFacilities(callback) {
      this.$post("/v1/dr/patrol-list", this.f_params).then((res) => {
        this.f_total = res.data.count;
        this.f_list = res.data.list;
        if (typeof callback == "function") {
          callback();
        } else {
          this.setCk();
        }
      });
    },
    setCk() {
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection();
        this.f_list.map((it) => {
          if (this.ruleForm.drPatrolPlanId.indexOf(it.drPatrolId) !== -1) {
            this.$refs.multipleTable.toggleRowSelection(it, true);
          }
        });
      });
    },
    editSubmit() {
      delete this.ruleForm.drUnitPatrolList;
      delete this.ruleForm.drPatrolStatus;
      let form = { ...this.ruleForm };
      if (form.drPatrolPlanStart) {
        form.drPatrolPlanStart = form.drPatrolPlanStart / 1000 + "";
      }
      if (form.drPatrolPlanEnd) {
        form.drPatrolPlanEnd = form.drPatrolPlanEnd / 1000 + "";
      }
      form.drPatrolPlanType = form.drPatrolPlanType + "";
      this.$post("/v1/dr/patrol-plan-update", form).then((res) => {
        this.$message.success("修改成功");
        this.dialogVisible = false;
        this.handleReset();
      });
    },
    async edit(data) {
      this.dialogVisible = true;
      this.ruleForm = {
        drPatrolPlanId: [],
        drPatrolUnitId: "",
        drPatrolPlanPerson: "",
      };
      this.multipleSelection = [];
      this.isEdit = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].clearValidate(); // 清除校验
      });
      this.f_params.page = 1;
      
      this.$get(`/v1/dr/patrol-plan-detail/${data.drPatrolPlanUuid}`).then(
        async (res) => {
          //this.ruleForm = res.data;
          
          await this.changeUnit(res.data.drPatrolPlanUnit);
          //await this.getFacilities();
          this.ruleForm = res.data;
          if (this.ruleForm.drPatrolPlanStart) {
            this.ruleForm.drPatrolPlanStart = parseInt(
              this.ruleForm.drPatrolPlanStart * 1000
            );
          }
          if (this.ruleForm.drPatrolPlanEnd) {
            this.ruleForm.drPatrolPlanEnd = parseInt(
              this.ruleForm.drPatrolPlanEnd * 1000
            );
          }
          this.setCk();
        }
      );
    },
    handleFilter() {
      this.filterBtn = !this.filterBtn;
      if (!this.filterBtn) {
        this.tableHeight = document.body.clientHeight - 250 - 54 - 42;
      } else {
        this.tableHeight = document.body.clientHeight - 250 - 150 - 54;
      }
    },
    handleSearch() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        //dr_device_nature: 2
      };
      this.getList();
    },
    getList() {
      this.loading = true;
      this.$post("/v1/dr/plan-list", this.listQuery)
        .then((res) => {
          this.loading = false;
          this.total = res.data.count;
          this.tableData = res.data.list;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    selectAll(val) {
      if (!val.length) {
        //全部取消
        this.f_list.map((it) => {
          if (this.ruleForm.drPatrolPlanId.indexOf(it.drPatrolId) !== -1) {
            this.ruleForm.drPatrolPlanId.splice(
              this.ruleForm.drPatrolPlanId.indexOf(it.drPatrolId),
              1
            );
          }
        });
      }
    },
    handleSelectionChange(val) {
      let new_data = val.map((it) => {
        return it.drPatrolId;
      });
      let old_data = this.multipleSelection.map((it) => {
        return it.drPatrolId;
      });
      if (this.multipleSelection.length - val.length == 1) {
        //减少
        if (
          this.f_list
            .map((it) => {
              return it.drPatrolId;
            })
            .indexOf(old_data[0]) !== -1
        ) {
          let del_id = "";
          old_data.map((it) => {
            if (new_data.indexOf(it) === -1) {
              del_id = it;
            }
          });
          this.ruleForm.drPatrolPlanId.splice(
            this.ruleForm.drPatrolPlanId.indexOf(del_id),
            1
          );
        }
      } else {
        this.ruleForm.drPatrolPlanId.push(...new_data);
        this.ruleForm.drPatrolPlanId = [
          ...new Set(this.ruleForm.drPatrolPlanId),
        ];
      }
      this.multipleSelection = val;
    },
    resetFormData() {
      this.ruleForm = {
        drPatrolPlanId: [],
        drPatrolPlanUnit: "",
        drPatrolPlanPerson: "",
      };
      this.multipleSelection = [];
    },
    handleAdd() {
      this.resetFormData();
      this.isEdit = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].clearValidate(); // 清除校验
      });
      this.f_params.page = 1;
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          if (typeof this.ruleForm.drPatrolPlanUnit === "object") {
            this.ruleForm.drPatrolPlanUnit =
              this.ruleForm.drPatrolPlanUnit[
                this.ruleForm.drPatrolPlanUnit.length - 1
              ];
          }
          if (this.isEdit) {
            this.editSubmit();
          } else {
            let form = { ...this.ruleForm };
            if (form.drPatrolPlanStart) {
              form.drPatrolPlanStart =
                parseInt(form.drPatrolPlanStart / 1000) + "";
            }
            if (form.drPatrolPlanEnd) {
              form.drPatrolPlanEnd = parseInt(form.drPatrolPlanEnd / 1000) + "";
            }
            form.drPatrolPlanType = form.drPatrolPlanType + "";
            this.$post("/v1/dr/plan-add", form).then((res) => {
              this.$message.success("添加成功");
              this.handleReset();
            });
          }
        } else {
          console.log("error submit!!");
          this.$message.error("请检查将表单填写完整！");
          return false;
        }
      });
    },
    // 删除
    handleDelete(it) {
      this.$confirm(
        `确定要${it.drPatrolStatus > 0 ? "删除" : "启用"}吗?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$post("/v1/dr/patrol-plan-update", {
            drPatrolPlanUuid: it.drPatrolPlanUuid,
            drPatrolStatus: it.drPatrolStatus > 0 ? 0 : 1,
          }).then((res) => {
            this.$message.success("操作成功");
            this.handleReset();
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
