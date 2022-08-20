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
            v-if="false"
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
                  <el-form-item label="工单名称">
                    <el-input
                      clearable
                      size="small"
                      v-model="listQuery.dr_order_name"
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
            prop="dr_order_name"
            label="工单名称"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="dr_order_start"
            label="工单开始时间"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ formatDateTime(scope.row.dr_order_start * 1000) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="dr_order_end"
            label="工单结束时间"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ formatDateTime(scope.row.dr_order_end * 1000) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="dr_user_name"
            label="工单执行人"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="dr_order_uuid"
            label="工单号"
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
              <span v-if="scope.row.dr_order_status == 1">已完成</span>
              <span v-if="scope.row.dr_order_status == 2">审核</span>
              <span v-if="scope.row.dr_order_status == 0">整改中</span>
              <span v-if="scope.row.dr_order_status == 3">未通过</span>
              <span v-if="scope.row.dr_order_status == 4">已删除</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                v-if="scope.row.dr_order_status == 2"
                @click="openSH(scope.row)"
                >审核</el-button
              >
              <el-button
                type="primary"
                size="small"
                v-if="scope.row.dr_order_status == 1"
                @click="openSH(scope.row)"
                >详情</el-button
              >
              <!-- <el-button
                type="primary"
                size="small"
                v-if="scope.row.dr_order_status===4"
                @click="handleDelete(scope.row)"
                >启用</el-button
              > -->
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="listQuery.dr_page"
          :limit.sync="listQuery.PageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
    <!-- 新增 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="isEdit ? '编辑工单' : '添加工单'"
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
        <el-form-item label="工单名称" prop="dr_order_name">
          <el-input
            clearable
            size="small"
            v-model="ruleForm.dr_order_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属单位" prop="dr_unit">
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
            filterable
            v-model="ruleForm.dr_unit"
            size="small"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="工单处理人" prop="dr_order_duty">
          <el-select
            v-model="ruleForm.dr_order_duty"
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
        <el-form-item label="工单开始时间" prop="dr_order_start">
          <el-date-picker
            v-model="ruleForm.dr_order_start"
            :picker-options="pickerBeginDateBefore"
            type="datetime"
            placeholder="选择日期时间"
            size="small"
            value-format="timestamp"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工单结束时间" prop="dr_order_end">
          <el-date-picker
            v-model="ruleForm.dr_order_end"
            type="datetime"
            placeholder="选择日期时间"
            size="small"
            value-format="timestamp"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="工单异常列表" prop="dr_log_id">
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
              label="类型"
              align="center"
              width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.dr_device_serial ? "设备" : "设施" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="dr_patrol_plan_name"
              label="工单名称"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="dr_unit_name"
              label="单位"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="dr_facilities_name"
              label="设施名称"
              align="center"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="dr_component"
              label="组件"
              align="center"
              show-overflow-tooltip
            />
          </el-table>
          <pagination
            v-show="f_total > 0"
            :total="f_total"
            :page.sync="f_params.dr_page"
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
    <Check
      :dr_num="row ? row.dr_order_uuid : ''"
      :row="row"
      ref="check"
      @change="getList"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDate, formatDateTime } from "@/utils";
import Pagination from "@/components/Pagination"; // 分页
import Check from "./check/index.vue";
export default {
  name: "efire",
  components: {
    Pagination,
    Check,
  },
  computed: {
    ...mapGetters(["name"]),
    selective() {
      return this.multipleSelection.length === 0;
    },
  },
  data() {
    return {
      row: null,
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        },
      },
      getRowKeys(row) {
        return row.dr_id;
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
        dr_page: 1,
        // dr_patrol_status: 0,
      },
      ruleForm: {
        dr_log_id: [],
        dr_unit: "",
        dr_order_duty: "",
      },
      rules: {
        dr_order_name: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        dr_unit: [
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
        dr_order_duty: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        dr_log_id: [
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
      buildings: [],
      f_params: {
        dr_page: 1,
        dr_patrol_status: 0,
      },
      f_total: 0,
      f_list: [],
      users: [],
      units: [],
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
    async changeUnit(val) {
      if (!val) {
        return;
      }
      this.ruleForm.dr_order_duty = "";
      let unit_id = "";
      if (typeof val === "object") {
        unit_id = val[val.length - 1];
      } else {
        unit_id = val;
      }
      // this.f_params.dr_unit_id = unit_id;
      // this.f_params.page = 1;
      // await this.getFacilities();
      unit_id &&
        this.$get(`/v1/dr/unit-detail/${unit_id}/2`).then((res) => {
          this.$get(`/v1/dr/get-user-list-unit/${res.data.dr_unit_key}`).then(
            (res) => {
              //获取人员
              this.users = res.data;
            }
          );
        });
    },
    openSH(row) {
      this.row = { ...row };
      this.$refs.check.showDia = true;
    },
    getFacilities(callback) {
      this.$post("/v1/dr/patrol-abnormal-list", this.f_params).then((res) => {
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
          if (this.ruleForm.dr_log_id.indexOf(it.dr_id) !== -1) {
            this.$refs.multipleTable.toggleRowSelection(it, true);
          }
        });
      });
    },
    editSubmit() {
      delete this.ruleForm.drUnitPatrolList;
      delete this.ruleForm.dr_order_status;
      let form = { ...this.ruleForm };
      if (form.dr_order_start) {
        form.dr_order_start = form.dr_order_start / 1000 + "";
      }
      if (form.dr_order_end) {
        form.dr_order_end = form.dr_order_end / 1000 + "";
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
        dr_log_id: [],
        dr_unit: "",
        dr_order_duty: "",
      };
      this.multipleSelection = [];
      this.isEdit = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].clearValidate(); // 清除校验
      });
      this.f_params.dr_page = 1;

      this.$get(`/v1/dr/patrol-plan-detail/${data.drPatrolPlanUuid}`).then(
        async (res) => {
          //this.ruleForm = res.data;
          await this.getFacilities();
          this.ruleForm = res.data;
          if (this.ruleForm.dr_order_start) {
            this.ruleForm.dr_order_start = parseInt(
              this.ruleForm.dr_order_start * 1000
            );
          }
          if (this.ruleForm.dr_order_end) {
            this.ruleForm.dr_order_end = parseInt(
              this.ruleForm.dr_order_end * 1000
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
      this.listQuery.dr_page = 1;
      this.getList();
    },
    handleReset() {
      this.listQuery = {
        dr_page: 1,
        // dr_patrol_status: 0,
      };
      this.getList();
    },
    getList() {
      this.loading = true;
      this.$post("/v1/dr/get-work-order-list", this.listQuery)
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
          if (this.ruleForm.dr_log_id.indexOf(it.dr_id) !== -1) {
            this.ruleForm.dr_log_id.splice(
              this.ruleForm.dr_log_id.indexOf(it.dr_id),
              1
            );
          }
        });
      }
    },
    handleSelectionChange(val) {
      let new_data = val.map((it) => {
        return it.dr_id;
      });
      let old_data = this.multipleSelection.map((it) => {
        return it.dr_id;
      });
      if (this.multipleSelection.length - val.length == 1) {
        //减少
        if (
          this.f_list
            .map((it) => {
              return it.dr_id;
            })
            .indexOf(old_data[0]) !== -1
        ) {
          let del_id = "";
          old_data.map((it) => {
            if (new_data.indexOf(it) === -1) {
              del_id = it;
            }
          });
          this.ruleForm.dr_log_id.splice(
            this.ruleForm.dr_log_id.indexOf(del_id),
            1
          );
        }
      } else {
        this.ruleForm.dr_log_id.push(...new_data);
        this.ruleForm.dr_log_id = [...new Set(this.ruleForm.dr_log_id)];
      }
      this.multipleSelection = val;
    },
    resetFormData() {
      this.ruleForm = {
        dr_log_id: [],
        dr_order_duty: "",
        dr_unit: "",
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
      this.f_params.dr_page = 1;
      this.getFacilities();
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          if (typeof this.ruleForm.dr_unit === "object") {
            this.ruleForm.dr_unit =
              this.ruleForm.dr_unit[this.ruleForm.dr_unit.length - 1];
          }
          if (this.isEdit) {
            this.editSubmit();
          } else {
            let form = { ...this.ruleForm };
            if (form.dr_order_start) {
              form.dr_order_start = parseInt(form.dr_order_start / 1000) + "";
            }
            if (form.dr_order_end) {
              form.dr_order_end = parseInt(form.dr_order_end / 1000) + "";
            }

            this.$post("/v1/dr/create-work-order", form).then((res) => {
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
      this.$confirm(`确定要${"删除"}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$post("/v1/dr/delete-work-order-operate", {
            dr_num: it.dr_order_uuid,
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

<style lang="scss" scoped></style>
