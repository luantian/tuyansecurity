<template>
  <div class="dashboard-container">
    <el-row :gutter="20"
            type="flex">
      <!-- <el-col :span="6" style="width: 220px;">
        <AreaSelect @handleSelect="handleSelectArea" ref="areaTree"></AreaSelect>
      </el-col> -->
      <el-col :span="24"
              style="flex:1">
        <div class="btnBox">
          <!-- 按钮 -->
          <el-button type="primary"
                     size="small"
                     icon="el-icon-plus"
                     @click="handleAdd">添加</el-button>
          <!-- <el-button type="danger" size="small" icon="el-icon-delete" :disabled="selective" @click="handleDelete">删除
          </el-button> -->
          <!-- <el-button type="primary" size="small" @click="handleFilter" class="floatR">
          <svg-icon icon-class="filter" /><i :class="!filterBtn?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
        </el-button> -->
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
                  <el-form-item label="设备名称">
                    <el-input clearable
                              size="small"
                              v-model="listQuery.dr_facilities_name"
                              placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="组件">
                    <el-input clearable
                              size="small"
                              v-model="listQuery.dr_component"
                              placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label=" ">
                    <el-button type="primary"
                               size="small"
                               @click="handleSearch">过滤</el-button>
                    <el-button size="small"
                               @click="handleReset">重置</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
        <!-- 表格 -->
        <el-table :data="tableData"
                  :height="tableHeight"
                  border
                  size="small"
                  v-loading="loading"
                  :row-class-name="tableRowClassName"
                  :header-cell-style="{background:'#f5f7fa',color:'#606266'}"
                  highlight-current-row
                  style="width: 100%"
                  empty-text="暂无数据"
                  stripe
                  @selection-change="handleSelectionChange">
          <!-- <el-table-column type="selection" align="center" fixed width="55" /> -->
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
                    class="normal">启用</span>
              <span v-else
                    class="deactivate">已删除</span>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="200"
                           align="center">
            <template slot-scope="scope">
              <el-button type="primary"
                         size="small"
                         @click="edit(scope.row)">修改</el-button>
              <el-button type="primary"
                         size="small"
                         @click="handleDelete(scope.row)"
                         v-if="scope.row.dr_status==0&&!scope.row.dr_device_serial">启用</el-button>
              <el-button type="danger"
                         size="small"
                         @click="handleDelete(scope.row)"
                         v-if="scope.row.dr_status==1&&!scope.row.dr_device_serial">删除</el-button>

            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0"
                    :total="total"
                    :page.sync="listQuery.page"
                    :limit.sync="listQuery.PageSize"
                    @pagination="getList" />
      </el-col>
    </el-row>
    <!-- 新增 -->
    <el-dialog :close-on-click-modal="false"
               :title="isEdit?'编辑消防设施':'添加消防设施'"
               :visible.sync="dialogVisible"
               width="520px">
      <el-form :model="ruleForm"
               :rules="rules"
               ref="ruleForm"
               label-width="120px"
               class="demo-ruleForm">
        <el-form-item label="消防设施名称"
                      prop="drFacilitiesName">
          <el-input clearable
                    size="small"
                    v-model="ruleForm.drFacilitiesName"></el-input>
        </el-form-item>
        <el-form-item label="组件"
                      prop="drComponent">
          <el-input clearable
                    size="small"
                    v-model="ruleForm.drComponent"></el-input>
        </el-form-item>
        <el-form-item label="所属单位"
                      prop="drUnitId">
          <el-cascader :options="units"
                       :props="{
              checkStrictly: true,
              value: 'dr_unit_id',
              label: 'dr_unit_name',
              children: 'dr_son',
            }"
                       clearable
                       v-model="ruleForm.drUnitId"
                       size="small"></el-cascader>
        </el-form-item>
        <el-form-item label="上传图片"
                      prop="drPic">
          <el-upload class="upload-demo avatar-uploader"
                     ref="upload"
                     :action="`/v1/dr/upload-point`"
                     accept="image/*"
                     :on-preview="handlePreview"
                     :before-remove="beforeRemove"
                     :headers="{ token: $bus.user.token }"
                     :show-file-list="false"
                     :on-success="
                        (res) => {
                          return upSuccess(res);
                        }
                      "
                     :on-error="upError">
            <el-button type="primary"
                       size="mini">上传图片</el-button>
          </el-upload>
          <img v-if="ruleForm.drPic"
               :src="ruleForm.drPic"
               style="margin-top: 20px; height: 180px" />
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
import {
  mapGetters
} from "vuex";
import {
  formatDate,
  formatDateTime
} from "@/utils";
import Pagination from "@/components/Pagination"; // 分页
import AreaSelect from '@/components/AreaSelect'

export default {
  name: "efire",
  components: {
    Pagination,
    AreaSelect
  },
  computed: {
    ...mapGetters(["name"]),
    selective () {
      return this.multipleSelection.length === 0
    },
  },
  data () {
    return {
      tableHeight: '',
      filterText: '',
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
      onlineStatus: [{
        value: 1,
        label: '在线'
      }, {
        value: 0,
        label: '不在线'
      }],

      statusOptions: [{
        value: 1,
        label: '正常'
      }, {
        value: 0,
        label: '已删除'
      },],
      ruleForm: {
        drUnitId: '',
        drPic: ''
      },
      rules: {
        drFacilitiesName: [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }],
        drComponent: [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }],
        drUnitId: [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }],
        drPic: [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }],
      },
      restaurants: [],
      showEdit: false,
      editForm: {},
      detail: {},
      isEdit: false,
      units: []
    }
  },
  created () {
    this.tableHeight = document.body.clientHeight - 250 - 54 - 42
    this.getList()
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
    editSubmit () {
      this.$post('/v1/dr/inspection-update', this.ruleForm).then(res => {
        this.$message.success('修改成功')
        this.dialogVisible = false
        this.handleReset()
      })
    },
    edit (data) {
      this.dialogVisible = true
      this.ruleForm = {}
      this.isEdit = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate() // 清除校验
      })
      this.$get('/v1/dr/inspection-detail/' + data.dr_id).then(res => {
        this.ruleForm = {
          drFacilitiesName: res.data.dr_facilities_name,
          drId: res.data.dr_id,
          drComponent: res.data.dr_component,
          drUnitId: res.data.dr_unit_id,
          drPic: res.data.dr_pic
        }
      })
    },

    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleFilter () {
      this.filterBtn = !this.filterBtn
      if (!this.filterBtn) {
        this.tableHeight = document.body.clientHeight - 250 - 54 - 42
      } else {
        this.tableHeight = document.body.clientHeight - 250 - 150 - 54
      }
    },
    handleSearch () {
      this.listQuery.page = 1
      this.getList()
    },
    handleReset () {
      this.listQuery = {
        page: 1,
        //dr_device_nature: 2
      }
      this.getList()
    },
    getList () {
      this.loading = true;
      this.$post('/v1/dr/inspection-list', this.listQuery).then(res => {
        this.loading = false;
        this.total = res.data.count
        this.tableData = res.data.list
      }).catch(error => {
        this.loading = false;
      });
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    resetFormData () {
      this.ruleForm = {
        drUnitId: '',
        drPic: ''
      }
    },
    handleAdd () {
      this.resetFormData()
      this.isEdit = false
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate() // 清除校验
      })
    },
    submitForm () {
      //this.ruleForm.dr_device_nature = 2
      //this.ruleForm.dr_org_id = this.$refs.areaTree.checked.id

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          if (typeof this.ruleForm.drUnitId === "object") {
            this.ruleForm.drUnitId =
              this.ruleForm.drUnitId[this.ruleForm.drUnitId.length - 1];
          }
          if (this.isEdit) {
            this.editSubmit()
          } else {
            this.$post('/v1/dr/inspection-add', this.ruleForm).then(res => {
              this.$message.success('添加成功')
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
    // 删除
    handleDelete (it) {
      this.$confirm(`确定要${it.dr_status == 1 ? '删除' : '启用'}吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post('/v1/dr/inspection-update', {
          drId: it.dr_id,
          drStatus: it.dr_status == 1 ? 0 : 1
        }).then(res => {
          this.$message.success('操作成功')
          this.handleReset()
        })
      }).catch(() => { });
    },
    handlePreview (file) {
      console.log(file);
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    upSuccess (res) {
      if (res) {
        if (res.code == 200) {
          this.ruleForm.drPic = res.data.img
          this.$message.success("上传成功");
        } else {
          this.$message.error("上传失败");
        }
      }
    },
    upError (err, file, fileList) {
      this.$message.error("上传失败");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
