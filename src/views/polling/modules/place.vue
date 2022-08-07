<template>
  <div class="dashboard-container">
    <el-row :gutter="20"
            type="flex">
      <el-col :span="24"
              style="flex: 1">
        <div class="btnBox">
          <!-- 按钮 -->
          <el-button type="primary"
                     size="small"
                     icon="el-icon-plus"
                     @click="handleAdd">添加</el-button>
          <!-- <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            :disabled="selective"
            @click="handleDelete"
            >删除
          </el-button> -->
          <el-button type="primary"
                     size="small"
                     @click="handleFilter"
                     class="floatR">
            <svg-icon icon-class="filter" /><i :class="!filterBtn ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"></i>
          </el-button>
          <!-- 检索区域 -->
          <div class="filterBox"
               v-show="filterBtn">
            <el-form ref="dataForm"
                     class="formBox formBox100"
                     :inline="true"
                     :model="listQuery"
                     label-position="right"
                     label-width="100px">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="巡查点名称">
                    <el-input clearable
                              size="small"
                              v-model="listQuery.drPatrolName"
                              placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="巡检卡号">
                    <el-input clearable
                              size="small"
                              v-model="listQuery.drPatrolCardNum"
                              placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="巡检地址">
                    <el-input clearable
                              size="small"
                              v-model="listQuery.drPatrolAddress"
                              placeholder="请输入" />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label=" ">
                    <el-button type="primary"
                               size="small"
                               @click="handleSearch">搜索</el-button>
                    <el-button size="small"
                               @click="handleReset">重置</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <!-- 表格 -->
        <el-table :stripe="true"
                  :row-class-name="tableRowClassName"
                  :data="tableData"
                  :height="tableHeight"
                  border
                  size="small"
                  v-loading="loading"
                  :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
                  highlight-current-row
                  style="width: 100%"
                  empty-text="暂无数据">
          <!-- <el-table-column type="selection" align="center" fixed width="55" /> -->

          <el-table-column prop="drPatrolName"
                           label="巡查点名称"
                           align="center"
                           show-overflow-tooltip>
            <!-- <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                title="点击修改"
                @click="edit(scope.row)"
                >{{ scope.row.drPatrolName }}</el-button
              >
            </template> -->
          </el-table-column>
          <el-table-column prop="drPatrolCardNum"
                           label="巡查卡卡号"
                           align="center"
                           show-overflow-tooltip />
          <el-table-column prop="drUnitName"
                           label="所属区域"
                           align="center"
                           show-overflow-tooltip />
          <el-table-column prop="drPatrolAddress"
                           label="详细位置"
                           align="center"
                           show-overflow-tooltip />
          <el-table-column prop="address"
                           label="启停状态"
                           align="center"
                           width="100"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.drPatrolStatus"
                    class="normal">启用</span>
              <span v-else
                    class="deactivate">停用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="260"
                           align="center">
            <template slot-scope="scope">
              <el-button type="primary"
                         size="small"
                         @click="showQR(scope.row)">获取二维码</el-button>
              <el-button type="primary"
                         size="small"
                         @click="edit(scope.row)">修改</el-button>
              <el-button type="primary"
                         size="small"
                         v-if="!scope.row.drPatrolStatus"
                         @click="handleDelete(scope.row)">启用</el-button>
              <el-button type="danger"
                         size="small"
                         v-if="scope.row.drPatrolStatus"
                         @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0"
                    :total="total"
                    :page.sync="listQuery.page"
                    :limit.sync="listQuery.PageSize"
                    @pagination="getList" />
      </el-col>
    </el-row>
    <!-- 新增 -->
    <el-dialog :close-on-click-modal="false"
               :title="isEdit ? '编辑巡查配置' : '添加巡查配置'"
               :visible.sync="dialogVisible"
               width="820px">
      <el-form :model="ruleForm"
               :rules="rules"
               ref="ruleForm"
               label-width="120px"
               class="demo-ruleForm">
        <el-form-item label="巡检名称"
                      prop="drPatrolName">
          <el-input clearable
                    size="small"
                    v-model="ruleForm.drPatrolName"></el-input>
        </el-form-item>
        <el-form-item label="巡检卡号"
                      prop="drPatrolCardNum">
          <el-input clearable
                    size="small"
                    v-model="ruleForm.drPatrolCardNum"></el-input>
        </el-form-item>
        <el-form-item label="巡检地址"
                      prop="drPatrolAddress">
          <el-input clearable
                    size="small"
                    v-model="ruleForm.drPatrolAddress"></el-input>
        </el-form-item>
        <el-form-item label="所属单位"
                      prop="drPatrolUnitId">
          <el-cascader :options="units"
                       @change="changeUnit"
                       :props="{
              checkStrictly: true,
              value: 'dr_unit_id',
              label: 'dr_unit_name',
              children: 'dr_son',
            }"
                       clearable
                       v-model="ruleForm.drPatrolUnitId"
                       size="small"></el-cascader>
        </el-form-item>
        <el-form-item label="巡检建筑"
                      prop="drPatrolBuild">
          <el-select v-model="ruleForm.drPatrolBuild"
                     size="small"
                     placeholder="请选择"
                     style="width: 100%">
            <el-option v-for="item in buildings"
                       :key="item.dr_building_id"
                       :label="item.dr_building_floor"
                       :value="item.dr_building_id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="消防设施"
                      prop="drFacilitiesId">
          <el-table v-if="dialogVisible"
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
                    @select-all="selectAll">
            <el-table-column type="selection"
                             :reserve-selection="true"
                             align="center"
                             fixed
                             width="55" />
            <el-table-column prop="dr_facilities_name"
                             label="消防设施名称"
                             align="center"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="dr_component"
                             label="组件"
                             align="center"
                             show-overflow-tooltip />
            <el-table-column prop="address"
                             label="启停状态"
                             align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.dr_status"
                      class="normal">正常</span>
                <span v-else
                      class="deactivate">已删除</span>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="f_total > 0"
                      :total="f_total"
                      :page.sync="f_params.page"
                      :limit.sync="f_params.PageSize"
                      @pagination="getFacilities" />
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDate, formatDateTime } from "@/utils";
import Pagination from "@/components/Pagination"; // 分页
import {
  getDevice,
  addDevice,
  changeDevice,
  switch_,
  delDevice,
} from "@/api/device";
import AreaSelect from "@/components/AreaSelect";

export default {
  name: "efire",
  components: {
    Pagination,
    AreaSelect,
  },
  computed: {
    ...mapGetters(["name"]),
    selective () {
      return this.multipleSelection.length === 0;
    },
  },
  data () {
    return {
      getRowKeys (row) {
        return row.dr_id;
      },
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
        drFacilitiesId: [],
        drPatrolUnitId: "",
        drPatrolBuild: "",
      },
      rules: {
        drPatrolName: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        drPatrolBuild: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        drPatrolUnitId: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        // drPatrolCardNum: [
        //   {
        //     required: true,
        //     message: "不能为空",
        //     trigger: "blur",
        //   },
        // ],
        drPatrolAddress: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        drFacilitiesId: [
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
        dr_unit_id: 120008,
      },
      f_total: 0,
      f_list: [],
    };
  },
  created () {
    this.tableHeight = document.body.clientHeight - 250 - 54 - 42;
    this.getList();
    this.$get("/v1/dr/unit-list").then((res) => {
      this.units = forobj(res.data);
    });
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "stripe1-row";
      } else {
        return "stripe2-row";
      }
    },
    formatDate,
    formatDateTime,
    showQR (row) {
      this.$get(`/v1/dr/get-patrol-qr/${row.drPatrolUuid}`).then(res => {
        this.$alert(`<img style="display:block;margin:0 auto" src="${res.data.dr_qr}"/>`, '查看', {
          dangerouslyUseHTMLString: true
        });
      })
    },
    async changeUnit (val) {
      this.ruleForm.drPatrolBuild = "";
      this.f_list = [];
      this.ruleForm.drFacilitiesId = [];
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
      this.$get(`/v1/dr/unit-detail/${unit_id}/2`).then((res) => {
        this.$post("/v1/dr/get-unit-building", {
          dr_unit_key: res.data.dr_unit_key,
        }).then((ress) => {
          //获取建筑信息
          this.buildings = ress.data;
        });
      });
    },
    getFacilities (callback) {
      this.$post("/v1/dr/inspection-list", this.f_params).then((res) => {
        this.f_total = res.data.count;
        this.f_list = res.data.list;
        if (typeof callback == "function") {
          callback();
        } else {
          this.setCk();
        }
      });
    },
    setCk () {
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection();
        this.f_list.map((it) => {
          if (this.ruleForm.drFacilitiesId.indexOf(it.dr_id) !== -1) {
            this.$refs.multipleTable.toggleRowSelection(it, true);
          }
        });
      });
    },
    editSubmit () {
      delete this.ruleForm.drSysFacilitiesList;
      delete this.ruleForm.drPatrolStatus;
      this.$post("/v1/dr/patrol-update", this.ruleForm).then((res) => {
        this.$message.success("修改成功");
        this.dialogVisible = false;
        this.handleReset();
      });
    },
    async edit (data) {
      this.dialogVisible = true;
      this.ruleForm = {
        drFacilitiesId: [],
        drPatrolUnitId: "",
        drPatrolBuild: "",
      };
      this.multipleSelection = [];
      this.isEdit = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].clearValidate(); // 清除校验
      });
      this.f_params.page = 1;
      await this.changeUnit(data.drPatrolUnitId);
      this.$get(`/v1/dr/patrol-detail/${data.drPatrolUuid}/none`).then(
        (res) => {
          this.ruleForm = res.data;
          this.ruleForm.drFacilitiesId = res.data.drSysFacilitiesList.map(
            (it) => {
              return it.drId;
            }
          );
          this.setCk();
        }
      );
    },
    handleFilter () {
      this.filterBtn = !this.filterBtn;
      if (!this.filterBtn) {
        this.tableHeight = document.body.clientHeight - 250 - 54 - 42;
      } else {
        this.tableHeight = document.body.clientHeight - 250 - 150 - 54;
      }
    },
    handleSearch () {
      this.listQuery.page = 1;
      this.getList();
    },
    handleReset () {
      this.listQuery = {
        page: 1,
        //dr_device_nature: 2
      };
      this.getList();
    },
    getList () {
      this.loading = true;
      this.$post("/v1/dr/patrol-list", this.listQuery)
        .then((res) => {
          this.loading = false;
          this.total = res.data.count;
          this.tableData = res.data.list;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    selectAll (val) {
      if (!val.length) {
        //全部取消
        this.f_list.map((it) => {
          if (this.ruleForm.drFacilitiesId.indexOf(it.dr_id) !== -1) {
            this.ruleForm.drFacilitiesId.splice(
              this.ruleForm.drFacilitiesId.indexOf(it.dr_id),
              1
            );
          }
        });
      }
    },
    handleSelectionChange (val) {
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
          this.ruleForm.drFacilitiesId.splice(
            this.ruleForm.drFacilitiesId.indexOf(del_id),
            1
          );
        }
      } else {
        this.ruleForm.drFacilitiesId.push(...new_data);
        this.ruleForm.drFacilitiesId = [
          ...new Set(this.ruleForm.drFacilitiesId),
        ];
      }
      this.multipleSelection = val;
    },
    resetFormData () {
      this.ruleForm = {
        drFacilitiesId: [],
        drPatrolUnitId: "",
        drPatrolBuild: "",
      };
      this.multipleSelection = [];
    },
    handleAdd () {
      this.resetFormData();
      this.isEdit = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].clearValidate(); // 清除校验
      });
    },
    submitForm () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          if (typeof this.ruleForm.drPatrolUnitId === "object") {
            this.ruleForm.drPatrolUnitId =
              this.ruleForm.drPatrolUnitId[
              this.ruleForm.drPatrolUnitId.length - 1
              ];
          }
          if (this.isEdit) {
            this.editSubmit();
          } else {
            this.$post("/v1/dr/patrol-add", this.ruleForm).then((res) => {
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
    handleDelete (it) {
      this.$confirm(
        `确定要${it.drPatrolStatus == 1 ? "删除" : "启用"}吗?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$post("/v1/dr/patrol-update", {
            drPatrolUuid: it.drPatrolUuid,
            drPatrolStatus: it.drPatrolStatus == 1 ? 0 : 1,
          }).then((res) => {
            this.$message.success("操作成功");
            this.handleReset();
          });
        })
        .catch(() => { });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
