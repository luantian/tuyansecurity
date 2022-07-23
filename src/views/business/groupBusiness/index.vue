<template>
<div class="dashboard-container">
  <el-row :gutter="20" type="flex">
    <!-- <el-col :span="6" style="width:220px">
        <AreaSelect @handleSelect="handleSelectArea" ref="areaTree"></AreaSelect>
      </el-col> -->
    <el-col :span="24" style="flex: 1">
      <div class="btnBox">
        <!-- 按钮 -->
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd">添加</el-button>
        <!-- <el-button type="primary" size="mini" icon="el-icon-right" :disabled="selective" @click="handleMove">移动
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-check" :disabled="selective" @click="handleEnable">启用
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-remove-outline" :disabled="selective" @click="handleDeactivate">停用</el-button>
          <el-button type="primary" size="mini" icon="el-icon-lock" :disabled="selective" @click="handleResetPassword">
            重置密码</el-button>
          <el-button type="primary" size="mini" icon="el-icon-finished" @click="handleTransfer">批量划拨</el-button>
          <el-button type="primary" size="mini" icon="el-icon-s-promotion" @click="handleExport">批量导出</el-button> -->
        <el-button type="primary" size="mini" @click="handleFilter" class="floatR">
          <svg-icon icon-class="filter" /><i :class="!filterBtn ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"></i>
        </el-button>
        <!-- 检索区域 -->
        <div class="filterBox" v-show="filterBtn">
          <el-form ref="dataForm" class="formBox" :inline="true" :model="listQuery" label-position="right" label-width="80px">
            <el-row :gutter="20">
              <!-- <el-col :span="8">
                  <el-form-item label="用户名称">
                    <el-input clearable size="mini" v-model="listQuery.dr_user_name" placeholder="请输入" />
                  </el-form-item>
                </el-col> -->
              <el-col :span="8">
                <el-form-item label="用户账号">
                  <el-input clearable size="mini" v-model="listQuery.dr_login_account" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="手机号码">
                  <el-input clearable size="mini" v-model="listQuery.dr_user_phone" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <!-- <el-col :span="8">
                  <el-form-item label="用户单位">
                    <el-input clearable size="mini" v-model="listQuery.dr_group_name" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="启用状态">
                    <el-select clearable size="mini" v-model="listQuery.dr_status" placeholder="请选择">
                      <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="用户业务">
                    <el-select clearable size="mini" v-model="listQuery.value" placeholder="请选择">
                      <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="用户角色">
                    <el-input clearable size="mini" v-model="listQuery.name" placeholder="请输入" />
                  </el-form-item>
                </el-col> -->
              <el-col :span="8">
                <el-form-item label=" ">
                  <el-button type="primary" size="mini" @click="handleSearch">过滤</el-button>
                  <el-button size="mini" @click="handleReset">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" :height="tableHeight" border size="mini" v-loading="loading" :header-cell-style="{ background: '#f5f7fa', color: '#606266' }" highlight-current-row style="width: 100%" empty-text="暂无数据" @selection-change="handleSelectionChange">

        <el-table-column prop="dr_user_name" label="用户名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" size="mini" title="点击修改" @click="edit(scope.row)">{{ scope.row.dr_user_name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="dr_login_account" label="用户账号" align="center" show-overflow-tooltip />
        <el-table-column prop="dr_user_phone" label="手机号" align="center" show-overflow-tooltip />
        <el-table-column prop="dr_unit_name" label="用户单位" align="center" show-overflow-tooltip />

        <el-table-column prop="dr_status" label="启用状态" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.dr_status" class="normal">正常</span>
            <span v-else class="deactivate">停用</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="dr_name" label="用户角色" align="center" width="100" show-overflow-tooltip />
           -->
        <el-table-column prop="dr_overdue_time" label="创建时间" align="center" width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{
                formatDateTime(scope.row.dr_register_time * 1000)
              }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" v-if="scope.row.dr_status == 1" @click="changeUser(scope.row, 0)">停用</el-button>
            <el-button type="primary" size="mini" v-if="scope.row.dr_status == 0" @click="changeUser(scope.row, 1)">启用</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="address" label="设备详情" align="center" width="100" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleEquipment(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="API网关详情" align="center" width="100" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="handleGateway(scope.row)">查看</el-button>
            </template>
          </el-table-column> -->
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.PageSize" @pagination="getList" />
    </el-col>
  </el-row>
  <!-- 新增 -->
  <el-dialog :close-on-click-modal="false" :title="isEdit ? '修改' : '添加'" :visible.sync="dialogVisible" width="500px">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <!-- <el-form-item label="所属区域">
          <el-input v-if="$refs.areaTree" size="mini" :value="ruleForm.areaName||$refs.areaTree.checked.name" disabled></el-input>
        </el-form-item> -->
      <el-form-item label="用户账号" prop="dr_login_account">
        <el-input clearable size="mini" v-model="ruleForm.dr_login_account"></el-input>
      </el-form-item>
      <el-form-item label="密码" :prop="isEdit?'':'dr_login_pass'">
        <el-input clearable size="mini" v-model="ruleForm.dr_login_pass"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="dr_user_name">
        <el-input clearable size="mini" v-model="ruleForm.dr_user_name"></el-input>
      </el-form-item>
      <el-form-item label="所属单位" prop="dr_unit_key">
        <el-cascader :options="units" :props="{
              checkStrictly: true,
              value: 'dr_self_key',
              label: 'dr_unit_name',
              children: 'dr_son',
            }" clearable v-model="ruleForm.dr_unit_key" size="mini"></el-cascader>
      </el-form-item>
      <el-form-item label="邮箱" prop="dr_user_email">
        <el-input clearable size="mini" v-model="ruleForm.dr_user_email"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="dr_user_phone">
        <el-input clearable size="mini" v-model="ruleForm.dr_user_phone"></el-input>
      </el-form-item>

      <el-form-item label="用户类型" prop="dr_is_admin">
        <el-radio-group v-model="ruleForm.dr_is_admin">
          <el-radio :label="'commonly'">终端用户</el-radio>
          <el-radio :label="'service'" v-if="$bus.user.dr_is_admin!=='commonly'">运维用户</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否接收报警" prop="dr_is_push_socket">
        <el-radio-group v-model="ruleForm.dr_is_push_socket">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="关联角色" prop="dr_role">
        <el-checkbox-group v-model="ruleForm.dr_role">
          <el-checkbox :key="item.dr_role_key" :label="item.dr_role_key" v-for="item in roles">{{ item.dr_role_value }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>

</div>
</template>

<script>
import {
  mapGetters
} from "vuex";
import {
  formatDate,
  formatDateTime
} from "@/utils";
import Pagination from "@/components/Pagination"; // 分页
import {
  getList,
  getDetail,
  addUser,
  changeUser,
  updataUser,
} from "@/api/business";
import {
  getOrigin
} from "@/api/origin";
import AreaSelect from "@/components/AreaSelect";
import {
  getAllRoles
} from "@/api/roles";
//import { getDevice } from '@/api/device'

export default {
  name: "GroupBusiness",
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
      showArea: false,
      tableHeight: "",
      dialogVisible: false,
      dialogVisibleMove: false,
      dialogVisibleTransfer: false,
      dialogVisibleGateway: false,
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
        dr_role_type: 2,
      },
      statusOptions: [{
          value: 1,
          label: "正常",
        },
        {
          value: 0,
          label: "停用",
        },
      ],
      ruleForm: {
        dr_role: [],
        dr_is_admin: "commonly",
        dr_unit_key: "",
        dr_is_push_socket:1,
        //dr_overdue_time: ''
      },
      rules: {
        //dr_org_id: [{ required: true, message: '不能为空', trigger: 'blur' }],
        dr_login_account: [{
          required: true,
          message: "不能为空",
          trigger: "blur"
        }, ],
        dr_login_pass: [{
          required: true,
          message: "不能为空",
          trigger: "blur"
        }, ],
        dr_user_phone: [{
          required: true,
          message: "不能为空",
          trigger: "blur"
        }, {pattern:/^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,message:'请填写正确的手机号'}],
        dr_user_email: [{
          required: true,
          message: "不能为空",
          trigger: "blur"
        }, ],
        //dr_is_push_msg: [{ required: true, message: '不能为空', trigger: 'blur' }],
        //dr_nike_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        //dr_overdue_time: [{ required: true, message: '不能为空', trigger: 'blur' }],
        //dr_group_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        //dr_limit_device: [{ required: true, message: '不能为空', trigger: 'blur' }],
        //dr_limit_user: [{ required: true, message: '不能为空', trigger: 'blur' }],
        dr_user_name: [{
          required: true,
          message: "不能为空",
          trigger: "blur"
        }, ],
        dr_role: [{
          required: true,
          message: "不能为空",
          trigger: "blur"
        }],
      },
      restaurants: [],
      fileList: [],
      acceptFileType: ".xlsx,.xls",
      roles: [],
      isEdit: false,
      equipmentDetail: {},
      dialogVisibleDetail: true,
      units: [],
    };
  },
  created() {
    this.tableHeight = document.body.clientHeight - 250;
    this.getList();
    this.getUnits();
    getAllRoles().then((res) => {
      this.roles = res.data;
    });
  },
  methods: {
    formatDate,
    formatDateTime,
    upSuccess(response, file, fileList) {
      //log(response)
      if (response.code == 200) {
        this.$message.success("上传成功");
      } else {
        this.$message.error("上传失败");
      }
    },
    getUnits() {
      this.$get("/v1/dr/unit-list").then((res) => {
        this.units = forobj(res.data);
      });
    },
    upError(err, file, fileList) {
      this.$message.error("上传失败");
    },
    edit(data) {
      this.resetFormData();
      this.isEdit = true;
      this.dialogVisible = true;
      getDetail(data.dr_user_id).then((res) => {
        this.ruleForm = res.data.dr_user_detail;
        //this.ruleForm.areaName = data.dr_org_name
        this.$set(
          this.ruleForm,
          "dr_role",
          res.data.dr_have_role
          .map((it) => {
            if (it.dr_is_existence) return it.dr_role_key;
          })
          .filter((it) => {
            return it;
          })
        );
        //this.ruleForm.dr_overdue_time = res.data.dr_user_detail.dr_overdue_time * 1000
      });
    },
    areaS(val) {
      this.ruleForm.dr_org_id = val.id;
      this.$set(this.ruleForm, "areaName", val.name);
    },
    changeUser(row, status) {
      // data.dr_ids = this.multipleSelection.map(it => { return it.dr_user_id })
      // changeUser(data).then(res => {
      //   this.$message.success('修改成功')
      //   this.handleReset()
      // })
      this.$post("/v1/dr/update-user", {
        dr_user_uuid: row.dr_user_uuid,
        dr_status: status,
      }).then((res) => {
        this.$message.success("修改成功");
        this.handleReset();
      });
    },
    handleSelectArea(data) {
      this.listQuery.dr_org_id = data.id;
      this.listQuery.page = 1;
      this.getList();
    },
    handleFilter() {
      this.filterBtn = !this.filterBtn;
      if (!this.filterBtn) {
        this.tableHeight = document.body.clientHeight - 250;
      } else {
        this.tableHeight = document.body.clientHeight - 250 - 211;
      }
    },
    handleSearch() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        dr_role_type: 2,
      };
      this.getList();
    },
    getList() {
      this.loading = true;
      getList(this.listQuery)
        .then((res) => {
          this.loading = false;
          this.total = res.data.count;
          this.tableData = res.data.list;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEquipment(row) {
      this.$router.push({
        path: "/groupBusinessDetail",
        query: {
          dr_user_name: row.dr_user_name,
          dr_user_id: row.dr_user_id
        },
      });

      // this.equipmentDetail = {}
      // this.dialogVisibleDetail = true
      // getDevice({dr_user_id:row.dr_user_id}).then(res => {
      //   console.log(res.list)
      //   this.equipmentDetail = res.data.list[0] || null
      // })
    },
    handleGateway(row) {
      this.dialogVisibleGateway = true;
    },

    handleSelect(item) {
      console.log(item);
    },
    resetFormData() {
      this.ruleForm = {
        dr_role: [],
        dr_is_admin: "commonly",
        dr_unit_key: "",
      };
    },
    handleAdd() {
      this.resetFormData();
      this.isEdit = false;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].clearValidate(); // 清除校验
      });
    },
    submitForm() {
      //this.ruleForm.type = 2
      //this.ruleForm.dr_org_id = this.$refs.areaTree.checked.id

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          //this.ruleForm.dr_overdue_time = this.ruleForm.dr_overdue_time / 1000
          delete this.ruleForm.areaName;
          delete this.ruleForm.dr_status;
          console.log(this.ruleForm);
          if (typeof this.ruleForm.dr_unit_key === "object") {
            this.ruleForm.dr_unit_key =
              this.ruleForm.dr_unit_key[this.ruleForm.dr_unit_key.length - 1];
          }
          if (this.isEdit) {
            //修改
            updataUser(this.ruleForm).then((res) => {
              this.$message.success("修改成功！");
              this.handleReset();
            });
          } else {
            //新增
            //this.ruleForm.dr_org_id = this.$refs.areaTree.checked.id;
            //this.ruleForm.dr_unit_key ='6049cc9c97b41'
            addUser(this.ruleForm).then((res) => {
              this.$message.success("添加成功！");
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
    // 移动
    handleMove() {
      this.dialogVisibleMove = true;
      this.resetFormData();
    },
    submitMoveForm() {
      if (this.ruleForm.dr_org_id) {
        this.dialogVisibleMove = false;
        this.changeUser({
          dr_org_id: this.ruleForm.dr_org_id
        });
      } else {
        this.$message.error("请选择区域");
      }
    },
    // 启用
    handleEnable() {
      this.$confirm("确定要启用用户吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          this.changeUser({
            dr_status: 1
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 停用
    handleDeactivate() {
      this.$confirm("确定要停用用户吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          this.changeUser({
            dr_status: 0
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 重置密码
    handleResetPassword() {
      this.$confirm("确定要重置用户密码吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          this.changeUser({
            dr_reset_pwd: 1
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 批量划拨
    handleTransfer() {
      this.fileList = [];
      this.dialogVisibleTransfer = true;
    },

    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    submitTransferForm() {
      // this.$refs.upload.submit();
      this.fileList = [];
      this.dialogVisibleTransfer = false;
    },
    handleExport() {
      this.$confirm(
          "最多导出3W设备的数据，设备较多时请分区域导出。",
          "导出集团列表", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
        .then(() => {
          this.$down("/v1/dr/device-export", "集团列表").then((res) => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    handleDown(res) {
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = res.FilePath;
      link.setAttribute("download", res.FileName);
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
