<template>
  <div class="dashboard-container">
    <el-row :gutter="20" type="flex">
      <el-col :span="6" style="width:220px">
        <AreaSelect @handleSelect="handleSelectArea" ref="areaTree"></AreaSelect>
      </el-col>
      <el-col :span="18" style="flex:1">
        <div class="btnBox">
          <!-- 按钮 -->
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd">添加</el-button>
          <el-button type="primary" size="mini" icon="el-icon-right" :disabled="selective" @click="handleMove">移动
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-check" :disabled="selective" @click="handleEnable">启用
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-remove-outline" :disabled="selective" @click="handleDeactivate">停用</el-button>
          <el-button type="primary" size="mini" icon="el-icon-lock" :disabled="selective" @click="handleResetPassword">
            重置密码</el-button>
          <el-button type="primary" size="mini" @click="handleFilter" class="floatR">
            <svg-icon icon-class="filter" /><i :class="!filterBtn?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
          </el-button>
          <!-- 检索区域 -->
          <div class="filterBox" v-show="filterBtn">
            <el-form ref="dataForm" class="formBox" :inline="true" :model="listQuery" label-position="right" label-width="80px">
              <el-row :gutter="20">
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
                <el-col :span="8">
                  <el-form-item label="单位名称">
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
                  <el-form-item label="用户角色">
                    <el-input clearable size="mini" v-model="listQuery.name" placeholder="请输入" />
                  </el-form-item>
                </el-col>
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
        <el-table :data="tableData" :height="tableHeight" border size="mini" v-loading="loading" :header-cell-style="{background:'#f5f7fa',color:'#606266'}" highlight-current-row style="width: 100%" empty-text="暂无数据" @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" fixed width="55" />
          <el-table-column prop="dr_login_account" label="用户账号" align="center" width="100" show-overflow-tooltip >
            <template slot-scope="scope">
              <el-button type="text" size="mini" title="点击修改" @click="edit(scope.row)">{{scope.row.dr_login_account}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="dr_user_phone" label="手机号码" align="center" width="100" show-overflow-tooltip />
          <el-table-column prop="dr_group_name" label="单位名称" align="center" width="100" show-overflow-tooltip />
          <el-table-column prop="dr_org_name" label="所属区域" align="center" width="100" show-overflow-tooltip />
          <el-table-column prop="address" label="启用状态" align="center" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.dr_status" class="normal">正常</span>
              <span v-else class="deactivate">停用</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="用户角色" align="center" width="100" show-overflow-tooltip />
          <el-table-column prop="address" label="创建者" align="center" width="100" show-overflow-tooltip />
          <el-table-column prop="dr_overdue_time" label="到期时间" align="center" width="160" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{formatDateTime(scope.row.dr_overdue_time*1000)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dr_overdue_time" label="上次登录时间" align="center" width="160" show-overflow-tooltip>
            <template slot-scope="scope">
              <!-- <span>{{formatDateTime(scope.row.dr_overdue_time*1000)}}</span> -->
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.PageSize" @pagination="getList" />
      </el-col>
    </el-row>
    <!-- 新增 -->
    <el-dialog :close-on-click-modal="false" :title="isEdit?'修改':'添加'" :visible.sync="dialogVisible" width="50%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="所属区域">
          <el-input v-if="$refs.areaTree" size="mini" :value="ruleForm.areaName||$refs.areaTree.checked.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户账号" prop="dr_login_account">
          <el-input clearable size="mini" v-model="ruleForm.dr_login_account" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input clearable size="mini" v-model="ruleForm.dr_nike_name"></el-input>
        </el-form-item>
        <el-form-item label="单位名称" prop="dr_group_name">
          <el-input clearable size="mini" v-model="ruleForm.dr_group_name"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="dr_user_phone">
          <el-input clearable size="mini" v-model="ruleForm.dr_user_phone"></el-input>
        </el-form-item>
        <el-form-item label="短信通知" prop="dr_is_push_msg">
          <el-radio-group v-model="ruleForm.dr_is_push_msg">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联角色" prop="dr_role">
          <el-checkbox-group v-model="ruleForm.dr_role">
            <el-checkbox :label="item.dr_role_key" v-for="item in roles">{{item.dr_role_value}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="到期时间" prop="dr_overdue_time">
          <el-date-picker size="mini" :clearable="true" type="datetime" placeholder="到期时间" v-model="ruleForm.dr_overdue_time" format="yyyy-MM-dd HH:mm:ss" value-format="timestamp" style="width: 100%" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 移动 -->
    <el-dialog :close-on-click-modal="false" title="移动客户到区域" :visible.sync="dialogVisibleMove" width="400px">
      <p style="font-weight: 600;">已选择：{{ruleForm.areaName}}</p>
      <AreaSelect @handleSelect="areaS"></AreaSelect>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleMove = false">取 消</el-button>
        <el-button type="primary" @click="submitMoveForm">确 定</el-button>
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
import { getList, getDetail, addUser, changeUser ,updataUser} from '@/api/business'
import { getOrigin } from '@/api/origin'
import AreaSelect from '@/components/AreaSelect'
import { getAllRoles } from '@/api/roles'
export default {
  name: "GroupBusiness",
  components: {
    Pagination,
    AreaSelect
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
      dialogVisibleMove: false,
      dialogVisibleTransfer: false,
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
      ruleForm: {
        type: 1,
        dr_overdue_time: '',
        dr_role: []
      },
      rules: {
        dr_org_id: [{ required: true, message: '不能为空', trigger: 'blur' }],
        dr_login_account: [{ required: true, message: '不能为空', trigger: 'blur' }],
        dr_user_phone: [{ required: true, message: '不能为空', trigger: 'blur' }],
        dr_is_push_msg: [{ required: true, message: '不能为空', trigger: 'blur' }],
        dr_nike_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        dr_overdue_time: [{ required: true, message: '不能为空', trigger: 'blur' }],
        dr_group_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        // dr_limit_device: [{ required: true, message: '不能为空', trigger: 'blur' }],
        // dr_limit_user: [{ required: true, message: '不能为空', trigger: 'blur' }],
        // dr_user_name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        dr_role: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
      restaurants: [],
      fileList: [],
      acceptFileType: ".xlsx,.xls",
      roles: [],
      isEdit: false
    }
  },
  created() {
    this.tableHeight = document.body.clientHeight - 250
    this.getList()
    getAllRoles().then(res => {
      this.roles = res.data
    })
  },
  methods: {
    formatDate,
    formatDateTime,
    areaS(val) {
      this.ruleForm.dr_org_id = val.id;
      this.$set(this.ruleForm, 'areaName', val.name)
    },
    edit(data) {
      this.resetFormData()
      this.isEdit = true
      this.dialogVisible = true
      getDetail(data.dr_user_id).then(res => {
        this.ruleForm = res.data.dr_user_detail
        this.ruleForm.areaName = data.dr_org_name
        this.ruleForm.dr_overdue_time = res.data.dr_user_detail.dr_overdue_time * 1000
        this.$set(this.ruleForm,'dr_role',res.data.dr_have_role.map(it => { if (it.dr_is_existence) return it.dr_role_key }).filter(it=>{return it}))
      })
    },
    changeUser(data) {
      data.dr_ids = this.multipleSelection.map(it => { return it.dr_user_id })
      changeUser(data).then(res => {
        this.$message.success('修改成功')
        this.handleReset()
      })
    },
    handleSelectArea(data) {
      this.listQuery.dr_org_id = data.id
      //this.ruleForm.dr_org_id = data.id
      this.listQuery.page = 1
      this.getList()
    },
    handleFilter() {
      this.filterBtn = !this.filterBtn
      if (!this.filterBtn) {
        this.tableHeight = document.body.clientHeight - 250
      } else {
        this.tableHeight = document.body.clientHeight - 250 - 211
      }
    },
    handleSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        dr_role_type: 1
      }
      this.getList()
    },
    getList() {
      this.loading = true;
      getList(this.listQuery).then(res => {
        this.loading = false;
        this.total = res.data.count
        this.tableData = res.data.list
      }).catch(error => {
        this.loading = false;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEquipment(row) {
      getDetail(row.dr_user_id).then(res => {

      })
    },
    handleGateway(row) {

    },
    // 输入后匹配输入建议
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item);
    },
    resetFormData() {
      this.ruleForm = {
        type: 1,
        dr_overdue_time: '',
        dr_role: []
      }
    },
    handleAdd() {
      this.resetFormData()
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate() // 清除校验
      })
    },
    submitForm() {
      this.ruleForm.type = 1
      //console.log(this.$refs.areaTree)
      this.ruleForm.dr_org_id = this.$refs.areaTree.checked.id
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          this.ruleForm.dr_overdue_time = this.ruleForm.dr_overdue_time / 1000
          delete this.ruleForm.areaName
          delete this.ruleForm.dr_status

          if (this.isEdit) { //修改
            updataUser(this.ruleForm).then(res => {
              this.$message.success('修改成功！')
              this.handleReset()
            })
          } else { //新增
            this.ruleForm.dr_org_id = this.$refs.areaTree.checked.id;
            addUser(this.ruleForm).then(res => {
              this.$message.success('添加成功！')
              this.handleReset()
            })
          }

        } else {
          console.log('error submit!!');
          this.$message.error('请检查将表单填写完整！')
          return false;
        }
      });
    },
    // 移动
    handleMove() {
      this.dialogVisibleMove = true
      this.resetFormData()
    },
    submitMoveForm() {
      if (this.ruleForm.dr_org_id) {
        this.dialogVisibleMove = false
        this.changeUser({ dr_org_id: this.ruleForm.dr_org_id })
      } else {
        this.$message.error('请选择区域')
      }
    },
    // 启用
    handleEnable() {
      this.$confirm('确定要启用客户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeUser({ dr_status: 1 })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 停用
    handleDeactivate() {
      this.$confirm('确定要停用客户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeUser({ dr_status: 0 })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 重置密码
    handleResetPassword() {
      this.$confirm('确定要重置客户密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeUser({ dr_reset_pwd: 1 })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    handleDelete() {

    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },

  }
};

</script>
<style lang="scss" scoped>
</style>
