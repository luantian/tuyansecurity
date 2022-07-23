<template>
  <div class="">
    <el-row :gutter="20" type="flex">
      <el-col :span="6" style="width: 220px">
        <AreaSelect @handleSelect="handleSelectArea" ref="areaTree"></AreaSelect>
      </el-col>
      <el-col :span="18" style="flex:1">
        <div class="btnBox">
          <!-- 按钮 -->
          <el-button type="primary" size="mini" icon="el-icon-delete" :disabled="selective" @click="handleDelete">删除
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-right" :disabled="selective" @click="handleMove">移动
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-check" :disabled="selective" @click="handleEnable">启用
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-remove-outline" :disabled="selective" @click="handleDeactivate">停用</el-button>
          <el-button type="primary" size="mini" @click="handleExport">批量导出</el-button>
          <el-button type="primary" size="mini" :disabled="selective" @click="handleEquipmentSort">设备分类</el-button>
          <el-button type="primary" size="mini" @click="handleFilter" class="floatR">
            <svg-icon icon-class="filter" /><i :class="!filterBtn?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
          </el-button>
          <!-- 检索区域 -->
          <div class="filterBox" v-show="filterBtn">
            <el-form ref="dataForm" class="formBox formBox100" :inline="true" :model="listQuery" label-position="right" label-width="100px">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="设备名称">
                    <el-input clearable size="mini" v-model="listQuery.dr_device_name" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="序列号">
                    <el-input clearable size="mini" v-model="listQuery.dr_device_serial" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="设备类型">
                    <el-select clearable size="mini" v-model="listQuery.dr_model" placeholder="请选择">
                      <el-option v-for="item in modelOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="设备型号">
                    <el-input clearable size="mini" v-model="listQuery.dr_model_type" placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <!--  <el-col :span="8">
                  <el-form-item label="所属区域">
                    <el-input clearable size="mini" v-model="listQuery.name" placeholder="请输入" />
                  </el-form-item>
                </el-col> -->
                <!--  <el-col :span="8">
                  <el-form-item label="所属用户">
                    <el-input clearable size="mini" v-model="listQuery.name" placeholder="请输入" />
                  </el-form-item>
                </el-col> -->
                <el-col :span="8">
                  <el-form-item label="在线状态">
                    <el-select clearable size="mini" v-model="listQuery.dr_online_status" placeholder="请选择">
                      <el-option v-for="item in onlineStatus" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="启停状态">
                    <el-select clearable size="mini" v-model="listQuery.dr_status" placeholder="请选择">
                      <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!--  <el-col :span="8">
                  <el-form-item label="直播状态">
                    <el-select clearable size="mini" v-model="listQuery.value" placeholder="请选择">
                      <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col> -->
                <!--  <el-col :span="8">
                  <el-form-item label="设备分类">
                    <el-input clearable size="mini" v-model="listQuery.name" placeholder="请输入" />
                  </el-form-item>
                </el-col> -->
                <el-col :span="8">
                  <el-form-item label="布撤防状态">
                    <el-select clearable size="mini" v-model="listQuery.dr_defence" placeholder="请选择">
                      <el-option v-for="item in defenceOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                  <el-form-item label="智能检测开关">
                    <el-select clearable size="mini" v-model="listQuery.value" placeholder="请选择">
                      <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col> -->
                <el-col :span="8">
                  <el-form-item label="是否加密">
                    <el-select clearable size="mini" v-model="listQuery.dr_is_encrypt" placeholder="请选择">
                      <el-option v-for="item in encryptOptions" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
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
          <el-table-column prop="dr_device_name" label="设备名称" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" size="mini" title="点击修改" @click="edit(scope.row)">{{scope.row.dr_device_name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="dr_device_serial" label="序列号" align="center" width="100" show-overflow-tooltip />
          <el-table-column prop="dr_channel_num" label="通道号" align="center" width="100" show-overflow-tooltip />
          <el-table-column prop="dr_model" label="设备类型" align="center" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{d_type[scope.row.dr_model]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dr_org_name" label="所属区域" align="center" width="100" show-overflow-tooltip />
          <el-table-column prop="dr_login_account" label="所属用户" align="center" width="100" show-overflow-tooltip />
          <el-table-column prop="address" label="在线状态" align="center" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.dr_online_status" class="normal">在线</span>
              <span v-else class="deactivate">不在线</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="启停状态" align="center" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.dr_status" class="normal">启用</span>
              <span v-else class="deactivate">停用</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="address" label="直播状态" align="center" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.address" class="normal">已开通</span>
              <span v-else class="deactivate">为开通</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="address" label="设备分类" align="center" width="100" show-overflow-tooltip />
          <el-table-column prop="address" label="升级状态" align="center" width="100" show-overflow-tooltip />
          <el-table-column fixed="right" label="操作" width="120" align="center">
            <template slot-scope="scope">
              <!-- 是否布防 -->
              <i v-if="scope.row.dr_model=='CAMERA'" type="text" :class="`btn-icon el-icon-s-help ${scope.row.dr_defence?'blue':'hui'}`" @click="bufang(scope.row,scope.row.dr_defence===0?1:0)" :title="scope.row.dr_defence?'点击可撤防':'点击可布防'"></i>
              <i v-if="scope.row.dr_model=='SOCKET'" type="text" :class="`btn-icon ${scope.row.dr_switch==1?'el-icon-open blue':'el-icon-turn-off hui'}`" @click="switch_(scope.row,scope.row.dr_switch==0?1:0)" :title="scope.row.dr_switch==0?'点击打开智能开关':'点击关闭智能开关'"></i>
              <i v-if="scope.row.dr_model!=='SOCKET'" type="text" class="el-icon-turn-off hui" title="不支持智能检查开关"></i> 
              <i v-if="scope.row.dr_model=='ALARM'" type="text" :class="`btn-icon ${scope.row.dr_defence?'el-icon-bicycle blue':'el-icon-moon-night'}`" @click="bufang(scope.row,scope.row.dr_defence===0?16:0)" :title="scope.row.dr_defence?'点击睡眠':'点击外出'"></i>
              <i type="text" :class="`btn-icon ${scope.row.dr_is_encrypt>0?'el-icon-lock blue':'el-icon-unlock hui'}`" @click="lock(scope.row,scope.row.dr_is_encrypt>0?1:0)" :title="scope.row.dr_is_encrypt>0?'点击可解密':'点击可加密'"></i>
              <el-button title="详情" type="text" class="btn-icon el-icon-document" @click="deviceDetail(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.PageSize" @pagination="getList" />
      </el-col>
    </el-row>
    <!-- 移动 -->
    <el-dialog :close-on-click-modal="false" title="移动设备到区域" :visible.sync="dialogVisibleMove" width="30%">
      <p style="font-weight: 600;">已选择：{{ruleForm.areaName}}</p>
      <AreaSelect @handleSelect="areaS"></AreaSelect>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleMove = false">取 消</el-button>
        <el-button type="primary" @click="submitMoveForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改设备名称和经纬度 -->
    <el-dialog :close-on-click-modal="false" title="修改设备名称和经纬度" :visible.sync="showEdit" width="500px">
      <el-form :model="editForm" ref="editForm" label-width="80px">
        <el-form-item size="mini" label="设备名称" prop="dr_device_name" required>
          <el-input v-model="editForm.dr_device_name"></el-input>
        </el-form-item>
        <el-form-item size="mini" label="经度">
          <el-input v-model="editForm.dr_lng"></el-input>
        </el-form-item>
        <el-form-item size="mini" label="纬度">
          <el-input v-model="editForm.dr_lat"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEdit = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog :close-on-click-modal="false" title="查看详情" :visible.sync="showDetail" width="700px">
      <el-form label-width="120px">
        <div class="detailForm" v-if="detail">
          <el-form-item label="设备名称">
            {{detail.dr_device_name}}
          </el-form-item>
          <el-form-item label="是否加密">
            {{detail.dr_is_encrypt?'加蜜':'未加密'}}
          </el-form-item>
          <el-form-item label="序列号">
            {{detail.dr_device_serial}}
          </el-form-item>
          <el-form-item label="布撤防状态">
            {{d_is_encrypt[detail.dr_model][detail.dr_is_defence]}}
          </el-form-item>
          <el-form-item label="通道号">
            {{detail.dr_channel_num}}
          </el-form-item>
          <el-form-item label="设备类型">
            {{d_type[detail.dr_model]}}
          </el-form-item>
          <el-form-item label="启停状态">
            {{detail.dr_status?'停用':'启用'}}
          </el-form-item>
          <el-form-item label="设备型号">
            {{detail.dr_model_type}}
          </el-form-item>
          <el-form-item label="所属区域">
            {{detail.dr_org_name}}
          </el-form-item>
          <el-form-item label="所属用户">
            {{detail.dr_login_account}}
          </el-form-item>
          <el-form-item label="在线状态">
            {{detail.dr_is_online?'在线':'不在线'}}
          </el-form-item>
          <el-form-item label="添加时间">
            {{formatDateTime(detail.dr_create_time*1000)}}
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDetail = false">关 闭</el-button>
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
import { getDevice, addDevice, changeDevice, updateDevice, getDeviceDetail, defence, lock, switch_ } from '@/api/device'
import AreaSelect from '@/components/AreaSelect'

export default {
  name: "Group",
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
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      modelOptions: [{ value: 'CAMERA', label: '摄像头' }, { value: 'ALARM', label: '报警装置' }],
      tableHeight: '',
      filterText: '',
      dialogVisible: false,
      dialogVisibleMove: false,
      action: 'https://jsonplaceholder.typicode.com/posts/',
      dialogVisibleRenamed: false,
      actionGrouping: 'https://jsonplaceholder.typicode.com/posts/',
      dialogVisibleGrouping: false,
      filterBtn: false,
      tableData: [],
      total: 0,
      multipleSelection: [],
      loading: false,
      dataMove: [],
      listQuery: {
        page: 1,
        dr_device_nature: 1
      },
      onlineStatus: [{ value: 0, label: '在线' }, { value: 1, label: '不在线' }],
      encryptOptions: [{ value: 0, label: '不加密' }, { value: 1, label: '加密' }],
      defenceOptions: [{ value: 0, label: '睡眠' }, { value: 1, label: '布放' }, { value: 8, label: '在家' }, { value: 16, label: '外出' }],
      statusOptions: [{
        value: 1,
        label: '正常'
      }, {
        value: 0,
        label: '停用'
      }, ],
      ruleForm: {},
      rules: {
        dr_validate_code: [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }],
        dr_device_serial: [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }],
        dr_model: [{
          required: true,
          message: '不能为空',
          trigger: 'blur'
        }]
      },
      d_type: {
        'CAMERA': '摄像头',
        'ALARM': '报警装置',
        'SOCKET':'智能插座'
      },
      d_is_encrypt: {
        'CAMERA': {
          0: '撤防',
          1: '布防'
        },
        'ALARM': {
          0: '睡眠',
          8: '在家',
          16: '外出'
        }
      },
      restaurants: [],
      fileList: [],
      acceptFileType: ".xlsx,.xls",
      showEdit: false,
      editForm: {},
      showDetail: false,
      detail: null
    }
  },
  created() {
    this.tableHeight = document.body.clientHeight - 250 - 54 - 42
    this.getList()
  },
  methods: {
    formatDate,
    formatDateTime,
    lock(data, status) {
      this.loading = true
      lock(data.dr_device_serial, status).then(res => {
        this.$message.success('操作成功')
        this.loading = false
        this.handleReset()
      }).catch(err => {
        this.loading = false
      })
    },
    switch_(data, status) {
      this.loading = true
      switch_({ dr_device_serial: data.dr_device_serial, dr_switch: status }).then(res => {
        // console.log(res)
        this.$message.success('操作成功')
        this.loading = false
        this.handleReset()
      }).catch(err => {
        this.loading = false
      })
    },
    bufang(data, status) {
      this.loading = true
      defence(data.dr_device_serial, status).then(res => {
        this.$message.success('操作成功')
        this.loading = false
        this.handleReset()
      }).catch(err => {
        this.loading = false
      })
    },
    deviceDetail(data) {
      this.showDetail = true
      getDeviceDetail(data.dr_id).then(res => {
        this.detail = res.data
      })
    },
    editSubmit() {
      if (!this.editForm.dr_device_name) {
        return this.$message.error('请输入设备名称')
      }
      updateDevice(this.editForm).then(res => {
        this.$message.success('修改成功')
        this.showEdit = false
        this.handleReset()
      })
    },
    edit(data) {
      this.showEdit = true
      this.editForm = {}
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate() // 清除校验
      })
      getDeviceDetail(data.dr_id).then(res => {
        this.editForm = {
          dr_device_name: res.data.dr_device_name,
          dr_device_serial: res.data.dr_device_serial,
          dr_group_id: res.data.dr_group_id,
          dr_lng: res.data.dr_lng,
          dr_lat: res.data.dr_lat
        }
      })
    },
    areaS(val) {
      this.ruleForm.dr_org_id = val.id;
      this.$set(this.ruleForm, 'areaName', val.name)
    },
    handleSelectArea(data) {
      this.listQuery.dr_org_id = data.id
      this.listQuery.page = 1
      this.getList()
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleFilter() {
      this.filterBtn = !this.filterBtn
      if (!this.filterBtn) {
        this.tableHeight = document.body.clientHeight - 250 - 54 - 42
      } else {
        this.tableHeight = document.body.clientHeight - 250 - 150 - 54
      }
    },
    handleSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        dr_device_nature: 1
      }
      this.getList()
    },
    getList() {
      this.loading = true;
      getDevice(this.listQuery).then(res => {
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
    resetFormData() {
      this.ruleForm = {

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
      this.ruleForm.dr_device_nature = 1
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          delete this.ruleForm.areaName
          addDevice(this.ruleForm).then(res => {
            this.$message.success('添加成功')
            this.handleReset()
          })
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
    changeDevice(data) {
      if (!data.dr_delete) {
        data.dr_ids = this.multipleSelection.map(it => { return it.dr_id })
      }
      changeDevice(data).then(res => {
        this.$message.success('修改成功')
        this.handleReset()
      })
    },
    submitMoveForm() {
      if (this.ruleForm.dr_org_id) {
        this.dialogVisibleMove = false
        this.changeDevice({ dr_org_id: this.ruleForm.dr_org_id })
      } else {
        this.$message.error('请选择区域')
      }
    },
    // 启用
    handleEnable() {
      this.$confirm('确定要启用设备吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeDevice({ dr_status: 1 })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 停用
    handleDeactivate() {
      this.$confirm('确定要停用设备吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeDevice({ dr_status: 0 })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 删除
    handleDelete() {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeDevice({ dr_delete: this.multipleSelection.map(it => { return it.dr_device_serial }) })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 设置直播
    handleSetUpBroadcast() {
      this.$confirm('确定要设置直播吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 发布直播
    handleReleaseBroadcast() {
      this.$confirm('确定要发布直播吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 批量改名
    handleRenamed() {
      this.fileList = []
      this.dialogVisibleRenamed = true
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    submitRenamedForm() {
      // this.$refs.upload.submit();
      this.fileList = []
      this.dialogVisibleRenamed = false
    },
    handleDown() {
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = res.FilePath
      link.setAttribute('download', res.FileName)
      link.target = '_blank';
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link); //下载完成移除元素
    },
    // 批量导出
    handleExport() {
      this.$confirm('最多导出3W设备的数据，设备较多时请分区域导出。', '导出设备列表', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    // 批量分组
    handleGrouping() {
      this.fileList = []
      this.dialogVisibleGrouping = true
    },
    submitGroupingForm() {
      // this.$refs.uploadGrouping.submit();
      this.fileList = []
      this.dialogVisibleGrouping = false
    },
    handleDownGrouping() {
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = res.FilePath
      link.setAttribute('download', res.FileName)
      link.target = '_blank';
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link); //下载完成移除元素
    },
    // 设备分类
    handleEquipmentSort() {

    }

  },
};

</script>
<style lang="scss" scoped>
</style>
