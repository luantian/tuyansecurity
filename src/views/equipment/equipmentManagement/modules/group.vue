<template>
  <div class="dashboard-container">
    <el-row :gutter="20"
            type="flex">
      <!-- <el-col :span="6" style="width: 220px;">
        <AreaSelect @handleSelect="handleSelectArea" ref="areaTree"></AreaSelect>
      </el-col> -->
      <el-col :span="24"
              style="flex: 1">
        <div class="btnBox">
          <!-- 按钮 -->
          <el-button type="primary"
                     size="small"
                     icon="el-icon-plus"
                     @click="handleAdd">添加</el-button>
          <el-button type="primary"
                     size="small"
                     icon="el-icon-s-promotion"
                     @click="handleExport">导出</el-button>
          <el-upload ref="upload"
                     class="upload-box"
                     action="/v1/dr/device-import"
                     accept=".xlsx,.xls"
                     :headers="{ token: $bus.user.token }"
                     :show-file-list="false"
                     :on-success="handleSuccess"
                     :file-list="fileList">
            <el-button icon="el-icon-upload"
                       size="small"
                       type="primary">导入</el-button>
          </el-upload>
          <!-- <el-button type="primary" size="small" icon="el-icon-delete" :disabled="selective" @click="handleDelete">删除
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
                  <el-form-item label="设备地点">
                    <el-input clearable
                              size="small"
                              v-model="listQuery.dr_device_name"
                              placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="序列号">
                    <el-input clearable
                              size="small"
                              v-model="listQuery.dr_device_serial"
                              placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="设备型号">
                    <el-input clearable
                              size="small"
                              v-model="listQuery.dr_model"
                              placeholder="请输入" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="设备类型">
                    <v-select :id="42"
                              :value.sync="listQuery.dr_model_type"></v-select>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="在线状态">
                    <el-select clearable
                               size="small"
                               v-model="listQuery.dr_online_status"
                               placeholder="请选择">
                      <el-option v-for="item in onlineStatus"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="启停状态">
                    <el-select clearable
                               size="small"
                               v-model="listQuery.dr_status"
                               placeholder="请选择">
                      <el-option v-for="item in statusOptions"
                                 :key="item.value"
                                 :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="品牌">
                    <el-input clearable
                              size="small"
                              v-model="listQuery.dr_branch"
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
                  size="small"
                  v-loading="loading"
                  :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
                  highlight-current-row
                  style="width: 100%"
                  empty-text="暂无数据"
                  @selection-change="handleSelectionChange"
                  :row-class-name="tableRowClassName">

          <el-table-column prop="dr_device_name"
                           label="设备地点"
                           align="center"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text"
                         size="small"
                         title="点击修改"
                         @click="edit(scope.row)">{{ scope.row.dr_device_name }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="dr_device_serial"
                           label="序列号"
                           align="center"
                           show-overflow-tooltip />
          <el-table-column prop="dr_model"
                           label="设备型号"
                           align="center"
                           show-overflow-tooltip />
          <el-table-column prop="dr_model_type"
                           label="设备类型"
                           align="center"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="d_type.length">{{ d_type.filter(it=>{return it.dr_desc==scope.row.dr_model_type})[0].dr_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dr_unit_name"
                           label="所属单位"
                           align="center"
                           show-overflow-tooltip />
          <el-table-column prop="dr_bind_device_name"
                           label="绑定设备"
                           align="center"
                           show-overflow-tooltip />
          <el-table-column prop="address"
                           label="在线状态"
                           align="center"
                           width="100"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.dr_online_status"
                    class="normal">在线</span>
              <span v-else
                    class="deactivate">不在线</span>
            </template>
          </el-table-column>
          <el-table-column prop="address"
                           label="启停状态"
                           align="center"
                           width="100"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.dr_status"
                    class="normal">启用</span>
              <span v-else
                    class="deactivate">停用</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right"
                           label="操作"
                           width="260"
                           align="center">
            <template slot-scope="scope">
              <el-button type="text"
                         style="color:#4AC3FF"
                         v-if="
                  scope.row.dr_model_type === 'yc'
                "
                         @click="check(scope.row)">查岗</el-button>
              <el-button type="text"
                         style="color:#4AC3FF"
                         v-if="
                  scope.row.dr_model_type !== 'camera' && !scope.row.dr_slave_id
                "
                         @click="bind(scope.row)">联动绑定</el-button>
              <el-button type="text"
                         style="color:#4AC3FF"
                         v-if="
                  scope.row.dr_model_type !== 'camera' && scope.row.dr_slave_id
                "
                         @click="unbind(scope.row)">设备解绑</el-button>
              <el-button type="text"
                         style="color:#4AC3FF"
                         v-if="scope.row.dr_model_type == 'camera'"
                         @click="play(scope.row)">监控播放</el-button>
              <el-button type="text"
                         style="color:#4AC3FF"
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
               :title="isEdit ? '编辑设备' : '添加设备'"
               :visible.sync="dialogVisible"
               width="520px">
      <el-form :model="ruleForm"
               :rules="rules"
               ref="ruleForm"
               label-width="120px"
               class="demo-ruleForm">
        <el-form-item label="设备地点"
                      prop="dr_device_name">
          <el-input clearable
                    size="small"
                    v-model="ruleForm.dr_device_name"></el-input>
        </el-form-item>
        <el-form-item label="设备序列号"
                      prop="dr_device_serial">
          <el-input clearable
                    size="small"
                    v-model="ruleForm.dr_device_serial"></el-input>
        </el-form-item>
        <el-form-item label="设备品牌"
                      prop="dr_branch">
          <v-select :id="1"
                    :value.sync="ruleForm.dr_branch"></v-select>
        </el-form-item>
        <el-form-item label="设备平台"
                      prop="dr_platform">
          <v-select :id="4"
                    :value.sync="ruleForm.dr_platform"></v-select>
        </el-form-item>
         <el-form-item label="平台设备号" prop="dr_device_id">
          <el-input
            clearable
            size="small"
            v-model="ruleForm.dr_device_id"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备验证码"
                      prop="dr_validate_code"
                      v-if="ruleForm.dr_platform == 5">
          <el-input clearable
                    size="small"
                    v-model="ruleForm.dr_validate_code"></el-input>
        </el-form-item>
        <el-form-item label="所属单位"
                      prop="dr_unit_id">
          <el-cascader :options="units"
                       :props="{
              checkStrictly: true,
              value: 'dr_unit_id',
              label: 'dr_unit_name',
              children: 'dr_son',
            }"
                       clearable
                       v-model="ruleForm.dr_unit_id"
                       size="small"></el-cascader>
        </el-form-item>
        <el-form-item label="设备型号"
                      prop="dr_model">
          <el-input clearable
                    size="small"
                    v-model="ruleForm.dr_model"></el-input>
        </el-form-item>
        <el-form-item label="设备型号类型"
                      prop="dr_model_type">
          <v-select :id="42"
                    key_name="dr_desc"
                    :value.sync="ruleForm.dr_model_type"></v-select>
        </el-form-item>
        <el-form-item label="设备详细位置"
                      prop="dr_address">
          <el-input clearable
                    size="small"
                    v-model="ruleForm.dr_address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 播放视频 -->
    <el-dialog :close-on-click-modal="false"
               title="播放视频"
               :visible.sync="showEdit"
               width="624px"
               @close="closeVideo"
               :destroy-on-close="true">
      <video ref="video"
             class="video-js video"></video>
      <div class="mt20 center">
        <el-button type="primary"
                   size="mini"
                   @mousedown.native="setVideo(2)"
                   @mouseup.native="endVideo()">向左</el-button>
        <el-button type="primary"
                   size="mini"
                   @mousedown.native="setVideo(3)"
                   @mouseup.native="endVideo()">向右</el-button>
        <el-button type="primary"
                   size="mini"
                   @mousedown.native="setVideo(0)"
                   @mouseup.native="endVideo()">向上</el-button>
        <el-button type="primary"
                   size="mini"
                   @mousedown.native="setVideo(1)"
                   @mouseup.native="endVideo()">向下</el-button>
        <!-- <el-button type="primary" size="mini" @mousedown.native="setVideo(8)" @mouseup.native="endVideo()">放大</el-button>
        <el-button type="primary" size="mini" @mousedown.native="setVideo(9)" @mouseup.native="endVideo()">缩小</el-button> -->
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="showEdit = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 绑定设备 -->
    <el-dialog :close-on-click-modal="false"
               title="绑定设备"
               :visible.sync="showBind"
               width="624px"
               v-if="showBind">
      <el-form :model="bindForm"
               :rules="rules"
               ref="bindForm"
               label-width="120px"
               class="demo-ruleForm">
        <el-form-item label="摄像头选择"
                      prop="dr_slave_id">
          <el-select v-model="bindForm.dr_slave_id"
                     size="small"
                     placeholder="请选择"
                     style="width: 100%">
            <el-option v-for="item in cameraList"
                       :key="item.dr_id"
                       :label="item.dr_device_name"
                       :value="item.dr_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="showBind = false">关 闭</el-button>
        <el-button type="primary"
                   @click="bindSubmit">确 定</el-button>
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
  updateDevice,
  getDeviceDetail,
  defence,
  lock,
  switch_,
  delDevice,
} from "@/api/device";
import AreaSelect from "@/components/AreaSelect";
import axios from 'axios';
// import { log } from '_video.js@7.14.3@video.js';

export default {
  name: "Group",
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
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    },
  },
  data () {
    return {
      stripe: true,
      nowVideo: {},
      bindForm: {
        dr_master_id: "",
        dr_slave_id: "",
      },
      tableHeight: "",
      filterText: "",
      dialogVisible: false,
      dialogVisibleMove: false,
      action: "https://jsonplaceholder.typicode.com/posts/",
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
      ruleForm: {},
      rules: {
        dr_slave_id: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        dr_device_name: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        dr_branch: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        dr_device_serial: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
          // {pattern:/^[0-9]{0,15}$/,message:'请填写正确的序列号'}
        ],
        dr_device_id: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          }
        ],
        dr_device_parent: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          }
        ],
        dr_validate_code: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        dr_platform: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        dr_model: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        dr_address: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        dr_unit_id: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        dr_model_type: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        dr_lng: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
        dr_lat: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
      },
      d_type: [],
      restaurants: [],
      fileList: [],
      acceptFileType: ".xlsx,.xls",
      showEdit: false,
      editForm: {},
      detail: {},
      uploadInfo: {
        title: "",
        url: "",
        down_url: "",
        down_name: "",
      },
      isEdit: false,
      units: [],
      video: null,
      options: {
        autoplay: true,
        controls: true,
        language: "zh-CN",
        src: "",
        sources: [
          {
            src: "",
            //type: "video/mp4"
          },
        ],
      },
      cameraList: [],
      showBind: false,
    };
  },
  created () {
    this.tableHeight = document.body.clientHeight - 250 - 54 - 42;
    this.getList();
    this.$get("/v1/dr/unit-list").then((res) => {
      this.units = forobj(res.data);
      //console.log(this.units)
    });
    this.$get('/v1/dr/mapcode-list/42').then(res => {
      this.d_type = res.data
    })
  },
  methods: {
    formatDate,
    formatDateTime,
    setVideo (direction) {
      let formData = new FormData();
      formData.append('accessToken', this.nowVideo.dr_device_token);
      formData.append('deviceSerial', this.nowVideo.dr_device_serial);
      formData.append('channelNo', this.nowVideo.dr_channel_num);
      formData.append('direction', direction);
      formData.append('speed', 1);

      axios({
        method: 'post',
        url: 'https://open.ys7.com/api/lapp/device/ptz/start',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
      }).then(res => {
        if (res.data.code != 200) {
          this.$message.warning(res.data.msg)
        }
      })
    },
    endVideo () {
      let formData = new FormData();
      formData.append('accessToken', this.nowVideo.dr_device_token);
      formData.append('deviceSerial', this.nowVideo.dr_device_serial);
      formData.append('channelNo', this.nowVideo.dr_channel_num);
      // formData.append('direction',direction);
      // formData.append('speed',1);

      axios({
        method: 'post',
        url: 'https://open.ys7.com/api/lapp/device/ptz/stop',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
      });
    },
    check (row) {
      this.$post('/v1/dr/monitor-yc', { dr_sn_list: [row.dr_device_serial] }).then(res => {
        this.$message.success('查岗成功！')
      })
    },
    bind (it) {
      this.bindForm = {
        dr_master_id: "",
        dr_slave_id: "",
      };
      this.bindForm.dr_slave_id = it.dr_slave_id || "";
      this.bindForm.dr_master_id = it.dr_id;
      this.showBind = true;
      this.$get("/v1/dr/bind-camera-list").then((res) => {
        this.cameraList = res.data;
      });
    },
    unbind (it) {
      this.$confirm("确定要解绑吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$post("/v1/dr/link-unbind", {
            dr_master_id: it.dr_id,
            dr_slave_id: it.dr_slave_id,
          }).then((res) => {
            this.$message.success("解绑成功");
            this.getList();
          });
        })
        .catch(() => { });
    },
    bindSubmit () {
      if (!this.bindForm.dr_slave_id) {
        return this.$message.error("请选择摄像头");
      }
      this.showBind = false;
      this.$post("/v1/dr/link-bind", this.bindForm).then((res) => {
        this.$message.success("绑定成功");
        this.getList();
      });
    },
    play (it) {
      this.showEdit = true;
      this.nowVideo = {}
      getDeviceDetail(it.dr_id).then((res) => {
        this.nowVideo = res.data
        this.$nextTick(() => {
          this.options.src = res.data.dr_camera_url;
          this.options.sources[0].src = res.data.dr_camera_url;
          this.video = this.$video(
            this.$refs.video,
            this.options,
            function onPlayerReady () {
              //it.player = this
            }
          );
        });
      });
    },
    closeVideo () {
      this.video.dispose()
    },
    upSuccess (response, file, fileList) {
      //log(response)
      if (response.code == 200) {
        this.$message.success(response.msg);
      } else {
        this.$message.error(response.msg);
      }
    },
    upError (err, file, fileList) {
      this.$message.error("上传失败");
    },
    switch_ (data, status) {
      this.loading = true;
      switch_({
        dr_device_serial: data.dr_device_serial,
        dr_switch: status,
      })
        .then((res) => {
          // console.log(res)
          this.$message.success("操作成功");
          this.loading = false;
          this.handleReset();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    editSubmit () {
      updateDevice(this.ruleForm).then((res) => {
        this.$message.success("修改成功");
        this.dialogVisible = false;
        this.handleReset();
      });
    },
    edit (data) {
      this.dialogVisible = true;
      this.ruleForm = {};
      this.isEdit = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].clearValidate(); // 清除校验
      });
      getDeviceDetail(data.dr_id).then((res) => {
        this.ruleForm = res.data;
      });
    },
    areaS (val) {
      this.ruleForm.dr_org_id = val.id;
      this.$set(this.ruleForm, "areaName", val.name);
    },
    handleSelectArea (data) {
      this.listQuery.dr_org_id = data.id;
      this.ruleForm.dr_org_id = this.$refs.areaTree.checked.id;

      this.listQuery.page = 1;
      this.getList();
    },
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
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
      getDevice(this.listQuery)
        .then((res) => {
          this.loading = false;
          this.total = res.data.count;
          this.tableData = res.data.list;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    resetFormData () {
      this.ruleForm = {};
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
      //this.ruleForm.dr_device_nature = 2
      //this.ruleForm.dr_org_id = this.$refs.areaTree.checked.id

      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          delete this.ruleForm.areaName;
          if (typeof this.ruleForm.dr_unit_id === "object") {
            this.ruleForm.dr_unit_id =
              this.ruleForm.dr_unit_id[this.ruleForm.dr_unit_id.length - 1];
          }
          if (this.isEdit) {
            this.editSubmit();
          } else {
            addDevice(this.ruleForm).then((res) => {
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
    changeDevice (data) {
      if (!data.dr_delete) {
        data.dr_ids = this.multipleSelection.map((it) => {
          return it.dr_id;
        });
      }
      changeDevice(data).then((res) => {
        this.$message.success("修改成功");
        this.handleReset();
      });
    },
    // 启用
    handleEnable () {
      this.$confirm("确定要启用设备吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.changeDevice({
            dr_status: 1,
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
    handleDeactivate () {
      this.$confirm("确定要停用设备吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.changeDevice({
            dr_status: 0,
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 删除
    handleDelete (it) {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delDevice({
            dr_id: it.dr_id,
          }).then((res) => {
            this.$message.success("删除成功");
            this.getList();
          });
        })
        .catch(() => { });
    },
    handleImport () {
      this.uploadInfo = {
        title: "批量导入",
        url: `${this.$bus.baseUrl}v1/dr/device-import`,
        down_url: "https://gd.tuyanplat.com/deviceImport.xlsx",
        down_name: "设备导入模板.xlsx",
      };
      this.fileList = [];
      this.dialogVisibleUpload = true;
    },
  handleSuccess(res){
      if(res.code == 200){
        this.$message.success(res.msg);
        this.handleSearch()
      }else{
        this.$message.error(res.msg);
      }
    },
    handleDown (res) {
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = res.FilePath;
      link.setAttribute("download", res.FileName);
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
    },
    // 批量导出
    handleExport () {
      this.$confirm(
        "最多导出3W设备的数据，设备较多时请分区域导出。",
        "导出设备列表",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$down("/v1/dr/device-export", "设备列表").then((res) => { });
        })
        .catch(() => { });
    },
    submitUploadForm () {
      // this.$refs.uploadGrouping.submit();
      this.handleReset();
      this.uploadInfo = {
        title: "",
        url: "",
        down_url: "",
        down_name: "",
      };
      this.fileList = [];
      this.dialogVisibleUpload = false;
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "stripe1-row";
      } else {
        return "stripe2-row";
      }
    },
  },
};
</script>

<style scoped lang="scss">
.video {
  width: 600px;
  height: 400px;
}
// 表格斑马自定义颜色
</style>
<style lang="scss">
// .stripe1-row {
//   background: #03283B  !important;
// }
// .stripe2-row {
//   background: #011F2F !important;
// }
.upload-box{
  display: inline-block;
  margin-left: 8px;
}
</style>
