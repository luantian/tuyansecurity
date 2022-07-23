<template>
  <div class="">
    <div class="btnBox">
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd">设备开户</el-button>
      <el-button type="primary" size="mini" @click="handleDownload">下载模板</el-button>
      <el-button type="primary" size="mini" @click="handleImport">批量导入</el-button>
      <el-button type="primary" size="mini" @click="handleVerify">开启校验</el-button>
      <el-button type="primary" size="mini" @click="handleFilter" class="floatR">
        <svg-icon icon-class="filter" /><i :class="!filterBtn?'el-icon-caret-bottom':'el-icon-caret-top'"></i>
      </el-button>
      <!-- 检索区域 -->
      <div class="filterBox" v-show="filterBtn">
        <el-form ref="dataForm" class="formBox formBox100" :inline="true" :model="listQuery" label-position="right"
          label-width="100px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="序列号">
                <el-input clearable size="mini" v-model="listQuery.name" placeholder="请输入" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="服务开始时间">
                <el-date-picker size="mini" :clearable="true" type="date" placeholder="服务开始时间" v-model="listQuery.name"
                  format="yyyy-MM-dd" value-format="yyyy-MM-dd"  style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="服务结束时间">
                <el-date-picker size="mini" :clearable="true" type="date" placeholder="服务结束时间" v-model="listQuery.name"
                  format="yyyy-MM-dd" value-format="yyyy-MM-dd"  style="width: 100%" />
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
    <el-table :data="tableData" :height="tableHeight" border size="mini" v-loading="loading"
      :header-cell-style="{background:'#f5f7fa',color:'#606266'}" highlight-current-row style="width: 100%"
      empty-text="暂无数据" @selection-change="handleSelectionChange">
      <el-table-column prop="date" label="序列号" align="center" show-overflow-tooltip />
      <el-table-column prop="address" label="开始时间" align="center" :formatter="formatDateTime" show-overflow-tooltip />
      <el-table-column prop="address" label="开始时间" align="center" :formatter="formatDateTime" show-overflow-tooltip />
      <el-table-column fixed="right" label="操作" align="center" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="handleEquipment(scope.row)">查看</span>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.PageSize"
      @pagination="getList" />
    <!-- 设备开户 -->
    <el-dialog :close-on-click-modal="false" title="添加客户" :visible.sync="dialogVisible" width="40%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="序列号" prop="name">
          <el-input clearable size="mini" v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="服务开始时间">
          <el-date-picker size="mini" :clearable="true" type="date" placeholder="服务开始时间" v-model="ruleForm.name"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd"  style="width: 100%" />
        </el-form-item>
        <el-form-item label="服务结束时间">
          <el-date-picker size="mini" :clearable="true" type="date" placeholder="服务结束时间" v-model="ruleForm.name"
            format="yyyy-MM-dd" value-format="yyyy-MM-dd"  style="width: 100%" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 导入 -->
    <el-dialog :close-on-click-modal="false" title="批量导入" :visible.sync="dialogVisibleTransfer" width="30%">
      <el-upload class="upload-demo" ref="upload" action="https://jsonplaceholder.typicode.com/posts/"
        :accept="acceptFileType" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList"
        :before-remove="beforeRemove">
        <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">
          提示：<br />
          请先下载模板，向模板中填写数据后，再上传文件
        </div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleTransfer = false">取 消</el-button>
        <el-button type="primary" @click="submitTransferForm">确 定</el-button>
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
  export default {
    name: "Equipment",
    components: {
      Pagination
    },
    computed: {
      ...mapGetters(["name"]),
      selective() {
        return this.multipleSelection.length === 0
      },
    },
    watch: {

    },
    data() {
      return {
        tableHeight: '',
        filterBtn: false,
        dialogVisible: false,
        dialogVisibleTransfer: false,
        tableData: [],
        total: 0,
        multipleSelection: [],
        loading: false,
        listQuery: {
          page: 1,
          PageSize: 20,
        },
        ruleForm: {},
        rules: {
          name: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }]
        },
        restaurants: [],
        fileList: [],
        acceptFileType: ".xlsx,.xls",
      }
    },
    created() {
      this.tableHeight = document.body.clientHeight - 250 - 54
    },
    methods: {
      formatDate,
      formatDateTime,
      handleFilter() {
        this.filterBtn = !this.filterBtn
        if (!this.filterBtn) {
          this.tableHeight = document.body.clientHeight - 250 - 54
        } else {
          this.tableHeight = document.body.clientHeight - 250 - 54 - 150
        }
      },
      handleSearch() {
        this.listQuery.page = 1
        this.listQuery.PageSize = 20
        this.getList()
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          PageSize: 20,
        }
      },
      getList() {
        // this.loading = true;
        // fetchList(this.listQuery).then(response => {
        //   this.tableData = response.Data.items;
        //   this.total = response.Data.total;
        //   this.loading = false;
        // }).catch(error => {
        //   this.loading = false;
        // });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleEquipment(row) {

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
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            this.$message.error('请检查将表单填写完整！')
            return false;
          }
        });
      },
      handleDownload() {
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = res.FilePath
        link.setAttribute('download', res.FileName)
        link.target = '_blank';
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link); //下载完成移除元素
      },
      handleImport() {
        this.fileList = []
        this.dialogVisibleTransfer = true
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
      submitTransferForm() {
        // this.$refs.upload.submit();
        this.fileList = []
        this.dialogVisibleTransfer = false
      },
      handleVerify() {

      }
    }
  };
</script>

<style lang="scss" scoped>

</style>