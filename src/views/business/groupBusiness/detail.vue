<template>
  <div class="dashboard-container">
    <el-row type="flex">
      <!-- <el-col :span="6" style="width: 220px;">
        <AreaSelect @handleSelect="handleSelectArea" ref="areaTree"></AreaSelect>
      </el-col> -->
      <el-col :span="24" style="flex:1">
        <div>客户名称：{{query.dr_user_name}}</div>
        
        <!-- 表格 -->
        <el-table :data="tableData" :height="tableHeight" border size="mini" v-loading="loading" :header-cell-style="{background:'#f5f7fa',color:'#606266'}" highlight-current-row style="width: 100%;margin-top: 15px" empty-text="暂无数据" @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" fixed width="55" />
          <el-table-column prop="dr_device_name" label="设备名称" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.dr_device_name}}</span>
              <!-- <el-button type="text" size="mini" title="点击修改" @click="edit(scope.row)"></el-button> -->
            </template>
          </el-table-column>
          <el-table-column prop="dr_device_serial" label="序列号" align="center" show-overflow-tooltip />
          <el-table-column prop="dr_channel_num" label="通道号" align="center" show-overflow-tooltip />
          <el-table-column prop="dr_model" label="设备类型" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{d_type[scope.row.dr_model]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dr_org_name" label="所属区域" align="center" show-overflow-tooltip />
          <el-table-column prop="dr_login_account" label="所属用户" align="center" show-overflow-tooltip />
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
          <el-table-column prop="dr_model" label="是否加密" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.dr_is_encrypt?'否':'是'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dr_model" label="布撤防状态" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{d_is_encrypt[scope.row.dr_model][scope.row.dr_defence]}}</span>
              
            </template>
          </el-table-column>
        </el-table>
        <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.PageSize" @pagination="getList" /> -->
      </el-col>
    </el-row>
    <!-- 新增 -->
    <el-dialog :close-on-click-modal="false" title="添加设备" :visible.sync="dialogVisible" width="50%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="设备序列号" prop="dr_device_serial">
          <el-input clearable size="mini" v-model="ruleForm.dr_device_serial"></el-input>
        </el-form-item>
        <el-form-item label="设备验证码" prop="dr_validate_code">
          <el-input clearable size="mini" v-model="ruleForm.dr_validate_code"></el-input>
        </el-form-item>
        <el-form-item label="设备类型" prop="dr_model">
          <el-select v-model="ruleForm.dr_model" size="mini" placeholder="请选择" style="width: 100%">
            <el-option v-for="item in modelOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 移动 -->
    <el-dialog :close-on-click-modal="false" title="移动设备到区域" :visible.sync="dialogVisibleMove" width="30%">
      <p style="font-weight: 600;">已选择：{{ruleForm.areaName}}</p>
      <AreaSelect @handleSelect="areaS"></AreaSelect>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleMove = false">取 消</el-button>
        <el-button type="primary" @click="submitMoveForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 上传 -->
    <el-dialog :close-on-click-modal="false" :title="uploadInfo.title" :visible.sync="dialogVisibleUpload" width="400px">
      <el-upload class="upload-demo" ref="uploadGrouping" :action="uploadInfo.url" :accept="acceptFileType" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :before-remove="beforeRemove" :headers="{token:$bus.user.token}" :on-success="upSuccess" :on-error="upError">
        <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">
          提示：<br />
          1.请先下载模板，向模板中填写数据后，再上传文件。<br />
          2.上传后处理结果将在反馈的Excel文件中显示。<br />
          3.Excel中文本框标红的为未导入成功的错误数据。
        </div>
      </el-upload>
      <!-- <el-button type="text" class="downClass" @click="handleDownGrouping">点击此处下载模板</el-button> -->
      <el-button type="text" class="downClass" @click="handleDown({FilePath:uploadInfo.down_url,FileName:uploadInfo.down_name})">点击此处下载模板</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleUpload = false">取 消</el-button>
        <el-button type="primary" @click="submitUploadForm">确 定</el-button>
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
        <div class="detailForm" v-if="detail.dr_device_name">
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
            {{d_is_encrypt[detail.dr_model][detail.dr_defence]}}
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
import { getDevice, addDevice, changeDevice, updateDevice, getDeviceDetail, defence, lock } from '@/api/device'
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
      query: this.$route.query,
      modelOptions: [{ value: 'CAMERA', label: '摄像头' }, { value: 'ALARM', label: '报警装置' }],
      tableHeight: '',
      filterText: '',
      dialogVisible: false,
      dialogVisibleMove: false,
      action: 'https://jsonplaceholder.typicode.com/posts/',
      dialogVisibleRenamed: false,
      actionGrouping: 'https://jsonplaceholder.typicode.com/posts/',
      dialogVisibleUpload: false,
      filterBtn: false,
      tableData: [],
      total: 0,
      multipleSelection: [],
      loading: false,
      dataMove: [],
      listQuery: {
        dr_user_id: this.$route.query.dr_user_id
      },
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
        'ALARM': '报警装置'
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
      detail: {},
      uploadInfo: {
        title: '',
        url: '',
        down_url: '',
        down_name: ''
      }
    }
  },
  created() {
    this.tableHeight = document.body.clientHeight - 250 
    this.getList()
  },
  methods: {
    formatDate,
    formatDateTime,
    upSuccess(response, file, fileList) {
      //log(response)
      if (response.code == 200) {
        this.$message.success(response.msg)
      } else {
        this.$message.error(response.msg)
      }
    },
    upError(err, file, fileList) {
      this.$message.error('上传失败')
    },
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
      this.detail = {}
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
      // this.listQuery.dr_org_id = data.id
      // this.ruleForm.dr_org_id = this.$refs.areaTree.checked.id

      // this.listQuery.page = 1
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
      //this.listQuery.page = 1
      this.getList()
    },
    handleReset() {
      this.listQuery = {
        dr_user_id: this.$route.query.dr_user_id
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
      this.ruleForm.dr_device_nature = 2
      this.ruleForm.dr_org_id = this.$refs.areaTree.checked.id

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
    handleImport() {
      this.uploadInfo = {
        title: '批量导入',
        url: `${this.$bus.baseUrl}v1/dr/device-import`,
        down_url: 'https://gd.tuyanplat.com/deviceImport.xlsx',
        down_name: '设备导入模板.xlsx'
      }
      this.fileList = []
      this.dialogVisibleUpload = true
    },
    handleTransfer() {
      this.uploadInfo = {
        title: '划拨设备',
        url: `${this.$bus.baseUrl}v1/dr/device-divide`,
        down_url: 'https://gd.tuyanplat.com/assignDeviceTemplate.xlsx',
        down_name: '划拨设备模板.xlsx'
      }
      this.fileList = []
      this.dialogVisibleUpload = true
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
    handleDown(res) {
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
        this.$down('/v1/dr/device-export', '设备列表').then(res => {})

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
      this.dialogVisibleUpload = true
    },
    submitUploadForm() {
      // this.$refs.uploadGrouping.submit();
      this.handleReset()
      this.uploadInfo = {
        title: '',
        url: '',
        down_url: '',
        down_name: ''
      }
      this.fileList = []
      this.dialogVisibleUpload = false

    },
    // 设备分类
    handleEquipmentSort() {

    }

  },
};

</script>
<style lang="scss" scoped>
</style>
