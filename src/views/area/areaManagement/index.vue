<template>
  <div :class="`dashboard-container unit-box status${status}`">
    <el-row :gutter="20" type="flex">
      <el-col :span="6" style="width: 320px;background-color: #000C12;">
        <!-- <AreaSelect
          @handleSelect="handleSelectArea"
          @ready="handleSelectArea"
          ref="AreaSelect"
        ></AreaSelect> -->
        <TreeData @handleSelect="handleSelectArea"
                @ready="handleSelectArea"
                ref="areaTree"></TreeData>
      </el-col>
      <el-col :span="18">
        <div class="l-title flex align-center">
          <span>单位详情</span>
          <div class="flex1 f-right">
            <el-button type="primary" size="mini" @click="addUnit"
              >新增单位</el-button
            >
          </div>
        </div>
        <div class="formbox">
          <!-- <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="上级单位">
              <el-input v-model="ruleForm.dr_unit_parent_id" disabled></el-input>
            </el-form-item>
            <el-form-item label="单位编号">
              <el-input v-model="ruleForm.dr_unit_id" disabled></el-input>
            </el-form-item>
            <el-form-item label="单位名称" prop="dr_unit_name">
              <el-input v-model="ruleForm.dr_unit_name" :disabled="editDisabled"></el-input>
            </el-form-item>
            <el-divider></el-divider>
            <div v-show="ruleForm.dr_unit_id">
              <el-button type="primary" size="mini" v-if="btnShow" @click="handleAdd">添加单位</el-button>
              <el-button type="primary" size="mini" v-if="btnShow" @click="handleEdit">编辑</el-button>
              <el-button type="primary" size="mini" v-if="btnShow" @click="handleDelete">删除</el-button>
              <el-button type="primary" size="mini" v-if="!btnShow" @click="handleSave">保存</el-button>
              <el-button type="primary" size="mini" v-if="!btnShow" @click="handleCancel">取消</el-button>
            </div>
          </el-form> -->

          <el-tabs v-model="nowIndex" @tab-click="changeTab">
            <el-tab-pane
              :label="tab.title"
              :name="'' + index"
              v-for="(tab, index) in tabList"
              :key="tab.title"
              :disabled="status==1&&index>0"
            ></el-tab-pane>
          </el-tabs>

          <el-form
            :disabled="status == 3"
            ref="form"
            :model="form"
            label-width="100px"
            :rules="rules"
            class="mt20"
            v-show="nowIndex == 0"
          >
            <el-row :gutter="5">
              <el-col :span="8">
                <el-form-item
                  label="单位名称"
                  :rules="{
                    message: '不能为空',
                    trigger: 'change',
                    required: true,
                  }"
                  prop="dr_unit_base.dr_unit_name"
                >
                  <el-input
                    size="small"
                    v-model="form.dr_unit_base.dr_unit_name"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="单位类型"
                  :rules="{
                    message: '不能为空',
                    trigger: 'change',
                    required: true,
                  }"
                  prop="dr_unit_base.dr_unit_type"
                >
                  <el-select
                    size="small"
                    v-model="form.dr_unit_base.dr_unit_type"
                  >
                    <el-option :value="0" label="受检测单位"></el-option>
                    <el-option :value="1" label="运营单位"></el-option>
                    <el-option :value="2" label="平台单位"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="单位类别"
                  :rules="{
                    message: '不能为空',
                    trigger: 'change',
                    required: true,
                  }"
                  prop="dr_unit_base.dr_unit_category"
                >
                  <el-select
                    size="small"
                    v-model="form.dr_unit_base.dr_unit_category"
                  >
                    <el-option :value="1" label="一般单位"></el-option>
                    <el-option :value="2" label="重点单位"></el-option>
                    <el-option :value="3" label="九小场所"></el-option>
                    <el-option :value="4" label="火灾高危单位"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item
                  label="省"
                  :rules="{
                    message: '不能为空',
                    trigger: 'change',
                    required: true,
                  }"
                  prop="dr_unit_base.dr_province"
                >
                  <el-select
                    size="small"
                    v-model="form.dr_unit_base.dr_province"
                    placeholder="请选择省份"
                    @change="proChanege"
                  >
                    <el-option
                      :value="item.dr_code"
                      :label="item.dr_area_name"
                      v-for="item in proList"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="市"
                  :rules="{
                    message: '不能为空',
                    trigger: 'change',
                    required: true,
                  }"
                  prop="dr_unit_base.dr_city"
                >
                  <el-select
                    size="small"
                    v-model="form.dr_unit_base.dr_city"
                    placeholder="请选择市"
                    @change="cityChanege"
                  >
                    <el-option
                      :value="item.dr_code"
                      :label="item.dr_area_name"
                      v-for="item in cityList"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="区"
                  :rules="{
                    message: '不能为空',
                    trigger: 'change',
                    required: true,
                  }"
                  prop="dr_unit_base.dr_area"
                >
                  <el-select
                    size="small"
                    v-model="form.dr_unit_base.dr_area"
                    placeholder="请选择区"
                  >
                    <el-option
                      :value="item.dr_code"
                      :label="item.dr_area_name"
                      v-for="item in areaList"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="详细地址"
                  :rules="{
                    message: '不能为空',
                    trigger: 'change',
                    required: true,
                  }"
                  prop="dr_unit_base.dr_address"
                >
                  <el-input
                    size="small"
                    v-model="form.dr_unit_base.dr_address"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item
                  label="所属行业"
                  :rules="{
                    message: '不能为空',
                    trigger: 'change',
                    required: true,
                  }"
                  prop="dr_unit_base.dr_industry"
                >
                  <el-select
                    size="small"
                    v-model="form.dr_unit_base.dr_industry"
                  >
                    <el-option
                      :value="item.dr_id"
                      :label="item.dr_name"
                      v-for="item in industrys"
                      :key="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item
                  label="消防负责人"
                  :rules="{
                    message: '不能为空',
                    trigger: 'change',
                    required: true,
                  }"
                  prop="dr_unit_base.dr_duty_name"
                >
                  <el-input
                    size="small"
                    v-model="form.dr_unit_base.dr_duty_name"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="负责人电话"
                  :rules="[{
                    message: '不能为空',
                    trigger: 'blur',
                    required: true,
                  },{pattern:/^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,message:'请填写正确的手机号'}]"
                  prop="dr_unit_base.dr_duty_phone"
                >
                  <el-input
                    size="small"
                    v-model="form.dr_unit_base.dr_duty_phone"
                    maxlength="11"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item
                  label="建筑"
                  :rules="{
                    message: '不能为空',
                    trigger: 'change',
                    required: true,
                  }"
                  prop="dr_unit_base.dr_building"
                >
                  <el-input
                    size="small"
                    v-model="form.dr_unit_base.dr_building"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item
                  label="经度"
                  :rules="{
                    message: '不能为空',
                    trigger: 'blur',
                    required: true,
                  }"
                  prop="dr_unit_base.dr_lng"
                >
                  <el-input
                    size="small"
                    placeholder="下方地图中选择"
                    v-model="form.dr_unit_base.dr_lng"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="维度"
                  :rules="{
                    message: '不能为空',
                    trigger: 'blur',
                    required: true,
                  }"
                  prop="dr_unit_base.dr_lat"
                >
                  <el-input
                    size="small"
                    placeholder="下方地图中选择"
                    v-model="form.dr_unit_base.dr_lat"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <!-- <el-form-item label="上级单位">
                <el-input size="small" v-model="ruleForm.dr_unit_name" disabled></el-input>
              </el-form-item> -->
                <el-form-item label="上级单位">
                  <el-cascader
                    :options="units"
                    placeholder="无"
                    :props="{
                      checkStrictly: true,
                      value: 'dr_self_key',
                      label: 'dr_unit_name',
                      children: 'dr_son',
                    }"
                    clearable
                    v-model="dr_unit_parent_id"
                    size="small"
                    @change="changeP_unit"
                  ></el-cascader>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="8" v-if="!dr_unit_parent_id">
                <el-form-item label="平台名称" prop="dr_unit_base.dr_unit_platform_name" :rules="{
                    message: '不能为空',
                    trigger: 'change',
                    required: true,
                  }">
                  <el-input
                    size="small"
                    placeholder="请输入平台名称"
                    v-model="form.dr_unit_base.dr_unit_platform_name"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="!dr_unit_parent_id">
                <el-form-item label="平台logo" prop="dr_unit_base.dr_unit_logo">
                  <el-upload class="upload-demo avatar-uploader" ref="upload" :action="`/v1/dr/upload-point`" accept="image/*" :headers="{ token: $bus.user.token }" :show-file-list="false" :on-success="
                                  (res) => {
                                    return upSuccess1(res);
                                  }
                                " :on-error="upError">
                    <el-button type="primary" size="mini">上传图片</el-button>
                  </el-upload>
                  <img v-if="form.dr_unit_base.dr_unit_logo" :src="form.dr_unit_base.dr_unit_logo" style="margin-top: 20px; height: 80px" />
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="8">
                <el-form-item
                  label="类别"
                  :rules="{
                    message: '不能为空',
                    trigger: 'change',
                    required: true,
                  }"
                  prop="dr_unit_base.dr_type"
                >
                  <el-select
                    size="small"
                    v-model="form.dr_unit_base.dr_type"
                  >
                    <el-option :value="1" label="公司"></el-option>
                    <el-option :value="2" label="物业"></el-option>
                    <el-option :value="3" label="小区"></el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->

              <el-col
                :span="24"
                :offset="0"
                style="height: 400px; position: relative"
              >
                <el-amap-search-box
                  v-if="true"
                  class="map-search-box"
                  :search-option="searchOption"
                  :on-search-result="onSearchResult"
                ></el-amap-search-box>
                <el-amap
                  ref="map"
                  class="amap-box"
                  :events="mapEvents"
                  vid="amap"
                  :zoom="zoom"
                  :resizeEnable="true"
                  :center="mapcenter"
                  mapStyle="amap://styles/darkblue"
                >
                  <el-amap-marker
                    v-if="marker.position.length"
                    :position="marker.position"
                    :visible="marker.visible"
                    icon="//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png"
                  ></el-amap-marker>
                  <el-amap-marker
                    v-for="(item, index) in markers"
                    :position="item.position"
                    :key="'marker' + index"
                    :events="markEvents"
                    :title="item.name"
                    :label="{
                      content:item.name,
                      offset:[-30,-30]
                    }"
                  ></el-amap-marker>
                  <!-- :label="{content:item.name,offset:[0,-25]}" -->
                </el-amap>
              </el-col>
            </el-row>

            <div class="f-right mt20">
               <el-button
                type="danger"
                size="small"
                @click="delUnit"
                v-if="status == 2"
                >删除单位</el-button
              >
              <el-button
                type="primary"
                size="small"
                @click="editBase"
                v-if="status == 2"
                >保存基本信息</el-button
              >
            </div>
          </el-form>

          <div
            v-for="(item, index) in tabList"
            v-show="nowIndex == index"
            v-if="index !== 0"
          >
            <div class="f-right">
              <el-button
                type="primary"
                size="mini"
                @click="addList(index)"
                v-if="status != 3"
                :disabled="adding"
                >新增</el-button
              >
            </div>
            <table
              class="common-table mt20"
              v-if="
                form[tabList[nowIndex].form] &&
                form[tabList[nowIndex].form].length
              "
            >
              <thead>
                <tr class="f14">
                  <th v-for="data in item.data">
                    {{ data.text }}
                  </th>
                  <th v-show="status != 3">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(data, index) in form[tabList[nowIndex].form]">
                  <td
                    class="common-add"
                    style="text-align: center"
                    v-for="(input, key, index2) in data"
                    v-if="item.data[index2]"
                  >
                    <el-input
                      :disabled="status == 3"
                      size="mini"
                      :placeholder="status == 3 ? '' : '请输入'"
                      v-model="
                        form[tabList[nowIndex].form][index][
                          item.data[index2].form_name
                        ]
                      "
                      v-if="item.data[index2].type == 'text'"
                    ></el-input>
                    <el-input
                      :disabled="status == 3"
                      size="mini"
                      :placeholder="status == 3 ? '' : '请输入'"
                      :maxlength="item.data[index2].maxlength"
                      onkeyup="value=value.replace(/[^\d]/g,'')"
                      v-model.number="
                        form[tabList[nowIndex].form][index][
                          item.data[index2].form_name
                        ]
                      "
                      v-if="item.data[index2].type == 'number'"
                    ></el-input>
                    <el-select
                      :disabled="status == 3"
                      size="mini"
                      v-model="
                        form[tabList[nowIndex].form][index][
                          item.data[index2].form_name
                        ]
                      "
                      v-if="item.data[index2].type == 'select'"
                    >
                      <el-option
                        v-for="item in item.data[index2].option"
                        :value="item.value"
                        :label="item.label"
                      ></el-option>
                    </el-select>
                    <el-date-picker
                      :disabled="status == 3"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                      v-model="
                        form[tabList[nowIndex].form][index][
                          item.data[index2].form_name
                        ]
                      "
                      v-if="item.data[index2].type == 'date'"
                    ></el-date-picker>

                    <el-upload
                      :disabled="status == 3"
                      v-if="item.data[index2].type == 'upload'"
                      class="upload-demo avatar-uploader"
                      ref="upload"
                      :action="`/v1/dr/upload-point`"
                      accept="image/*"
                      :on-preview="handlePreview"
                      :limit="1"
                      :before-remove="beforeRemove"
                      :headers="{ token: $bus.user.token }"
                      :show-file-list="false"
                      :on-success="
                        (res) => {
                          return upSuccess(res, { index, index2, item });
                        }
                      "
                      :on-error="upError"
                    >
                      <img
                        v-if="
                          form[tabList[nowIndex].form][index][
                            item.data[index2].form_name
                          ]
                        "
                        :src="
                          form[tabList[nowIndex].form][index][
                            item.data[index2].form_name
                          ]
                        "
                        style="width: 60px; height: 60px"
                      />
                      <el-button
                        v-if="
                          !form[tabList[nowIndex].form][index][
                            item.data[index2].form_name
                          ] && status != 3
                        "
                        type="primary"
                        size="mini"
                        >上传图片</el-button
                      >
                      <div
                        v-if="
                          !form[tabList[nowIndex].form][index][
                            item.data[index2].form_name
                          ] && status == 3
                        "
                      >
                        无
                      </div>
                    </el-upload>
                  </td>
                  <td class="td-btn" v-show="status != 3">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="edit_edit(form[tabList[nowIndex].form][index])"
                      v-if="
                        status == 2 &&
                        form[tabList[nowIndex].form][index].dr_create_time
                      "
                      :disabled="adding"
                      >确定修改</el-button
                    >
                    <el-button
                      type="primary"
                      size="mini"
                      @click="edit_add(form[tabList[nowIndex].form][index])"
                      v-if="!form[tabList[nowIndex].form][index].dr_create_time"
                      >确定添加</el-button
                    >
                    <el-button
                      v-if="form[tabList[nowIndex].form][index].dr_create_time"
                      type="danger"
                      size="mini"
                      @click="edit_del(form[tabList[nowIndex].form][index])"
                      :disabled="adding"
                      >删除</el-button
                    >
                    <el-button
                      v-if="!form[tabList[nowIndex].form][index].dr_create_time"
                      type="danger"
                      size="mini"
                      @click="del(index)"
                      >删除</el-button
                    >
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-else>
              <div v-if="status == 1 || status == 2" class="mt20 center c999">
                请点击右上角新增进行添加
              </div>
              <div v-if="status == 3" class="mt20 center c999">暂无数据</div>
            </div>
          </div>

          <div class="f-right mt20">
            <el-button
              type="primary"
              size="small"
              @click="onSubmit"
              v-if="status == 1"
              >保存</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="status = 2"
              v-if="status == 3"
              >编辑</el-button
            >
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatDate, formatDateTime } from "@/utils";
import Pagination from "@/components/Pagination"; // 分页
import AreaSelect from "@/components/AreaSelect";
import TreeData from '@/components/TreeData';
import {
  getOriginDetail,
  addOrigin,
  updateOrigin,
  delOrigin,
} from "@/api/origin";

let form = {
  dr_unit_base: {
    dr_unit_type: "",
    dr_unit_name: "",
    dr_duty_phone: "",
    dr_unit_category: "",
    dr_province: "",
    dr_city: "",
    dr_area: "",
    dr_address: "",
    dr_industry: "",
    dr_duty_name: "",
    dr_building: "",
    dr_lng: "",
    dr_lat: "",
    dr_unit_parent_id: "",
    dr_unit_level: "",
    //dr_type:"",
    dr_unit_platform_name:'',
    dr_unit_logo:''
  },
  dr_unit_building: [],
  dr_key_parts: [],
  dr_unit_facility: [],
  dr_unit_service: [],
};

export default {
  name: "AreaManagement",
  computed: {
    ...mapGetters(["name"]),
  },
  components: {
    Pagination,
    AreaSelect,
    TreeData
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  data() {
    return {
      adding:false, //是否在新增中
      industrys: [],
      status: 3, //1新增，2编辑，3详情
      marker: {
        position: [121.329402, 31.228667],
        visible: true,
      },
      zoom: 11,
      markEvents: {
        click: (e) => {
          if (this.status == 3) {
            return;
          }
          this.form.dr_unit_base.dr_lng = e.lnglat.lng + "";
          this.form.dr_unit_base.dr_lat = e.lnglat.lat + "";
          this.marker.position = [e.lnglat.lng,e.lnglat.lat]
          this.marker.visible = true;
        },
      },
      mapEvents: {
        click: (e) => {
          if (this.status == 3) {
            return;
          }
          this.form.dr_unit_base.dr_lng = e.lnglat.lng + "";
          this.form.dr_unit_base.dr_lat = e.lnglat.lat + "";
          this.marker.position = [e.lnglat.lng, e.lnglat.lat];
          this.marker.visible = true;
        },
        complete: () => {
          this.mapShow = true;
        },
      },
      mapShow: false,
      markers: [],
      mapcenter: [120.381552, 36.155331],
      searchOption: {
        city: "青岛",
        citylimit: false,
      },
      tableHeight: "",
      filterText: "",
      dialogVisible: false,
      dialogVisibleTransfer: false,
      filterBtn: false,
      loading: false,
      ruleForm: {},
      addForm: {},
      editDisabled: true,
      btnShow: true,
      form: JSON.parse(JSON.stringify(form)),
      tabList: [
        {
          title: "基本信息",
          form: "dr_unit_base",
        },
        {
          title: "建筑信息",
          form: "dr_unit_building",
          id_key: "dr_building_id",
          api: {
            list: "/v1/dr/get-unit-building",
            add: "/v1/dr/add-unit-building",
            edit: "/v1/dr/update-unit-building",
            del: "/v1/dr/delete-unit-building",
          },
          data: [
            {
              form_name: "dr_building_floor",
              type: "text",
              text: "楼层名称",
            },
            {
              form_name: "dr_building_area",
              type: "text",
              text: "楼层面积",
            },
            {
              form_name: "dr_building_pic",
              type: "upload",
              text: "楼层点位图",
            },
          ],
        },
        {
          title: "消防重点部位",
          form: "dr_key_parts",
          id_key: "dr_key_parts_id",
          api: {
            list: "/v1/dr/get-unit-key-parts",
            add: "/v1/dr/add-unit-key-parts",
            edit: "/v1/dr/update-unit-key-parts",
            del: "/v1/dr/delete-unit-key-parts",
          },
          data: [
            {
              form_name: "dr_key_parts_name",
              type: "text",
              text: "部位名称",
            },
            {
              form_name: "dr_key_parts_local",
              type: "text",
              text: "所在位置",
            },
            {
              form_name: "dr_nature_of_use",
              type: "text",
              text: "使用性质",
            },
            {
              form_name: "dr_duty",
              type: "select",
              text: "消防负责人",
              option: [],
            },
          ],
        },
        // {
        //   title: '消防设施',
        //   form: 'dr_unit_facility',
        //   id_key:'dr_facility_id',
        //   api: {
        //     list: '/v1/dr/get-unit-facility',
        //     add: '/v1/dr/add-unit-facility',
        //     edit: '/v1/dr/update-unit-facility',
        //     del: '/v1/dr/delete-unit-facility'
        //   },
        //   data: [{
        //       form_name: 'dr_facility_name',
        //       type: 'text',
        //       text: '设施名称'
        //     },
        //     {
        //       form_name: 'dr_facility_branch',
        //       type: 'text',
        //       text: '设施品牌'
        //     },
        //     {
        //       form_name: 'dr_facility_specification',
        //       type: 'text',
        //       text: '规格型号'
        //     },
        //     {
        //       form_name: 'dr_facility_num',
        //       type: 'text',
        //       text: '数量'
        //     }
        //   ],
        // },
        {
          title: "消防服务",
          form: "dr_unit_service",
          id_key: "dr_service_id",
          api: {
            list: "/v1/dr/get-unit-service",
            add: "/v1/dr/add-unit-service",
            edit: "/v1/dr/update-unit-service",
            del: "/v1/dr/delete-unit-service",
          },
          data: [
            {
              form_name: "dr_service_name",
              type: "text",
              text: "服务单位名称",
            },
            {
              form_name: "dr_service_user",
              type: "text",
              text: "服务人",
            },
            {
              form_name: "dr_service_phone",
              type: "number",
              text: "服务联系方式",
              maxlength:11,
            },
          ],
        },
      ],
      nowIndex: "0",
      proList: [],
      cityList: [],
      areaList: [],
      rules: {},
      userList: [],
      units: [],
      dr_unit_parent_id: "",
    };
  },
  created() {
    this.getMap();
    this.tabList.forEach((it, index) => {
      let obj = {};
      if (it.data) {
        // it.data.forEach(li => {
        //   obj[li.form_name] = ''
        // })
        // this.form[it.form].push(obj)
        this.form[it.form] = [];
      }
    });
    this.$get("/v1/dr/unit-list").then((res) => {
      this.units = forobj(res.data);
    });
  },
  methods: {
    formatDate,
    formatDateTime,
    upSuccess1(res) {
      if (res) {
        if (res.code == 200) {
          this.form.dr_unit_base.dr_unit_logo = res.data.img
          this.$set(this.form.dr_unit_base,'dr_unit_logo',res.data.img)
          this.$message.success("上传成功");
        } else {
          this.$message.error("上传失败");
        }
      }
    },
    upError(err, file, fileList) {
      this.$message.error("上传失败");
    },
    changeP_unit(val) {
      //上级单位改变
      if(val[val.length - 1]==this.form.dr_unit_base.dr_unit_key){
        this.$message.info('上级单位不能选择自己')
        this.form.dr_unit_base.dr_unit_level = 1;
        this.form.dr_unit_base.dr_unit_parent_id = "";
        this.dr_unit_parent_id = ''
        return
      }
      if (!val || !val.length) {
        this.form.dr_unit_base.dr_unit_level = 1;
        this.form.dr_unit_base.dr_unit_parent_id = "";
      } else {
        this.form.dr_unit_base.dr_unit_parent_id = val[val.length - 1];
        this.form.dr_unit_base.dr_unit_level = val.length + 1;
      }
    },
    delUnit(){
      this.$confirm(
        `确定要删除该单位吗?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$post("/v1/dr/unit-update", {
            dr_status:0,
            dr_unit_key:this.ruleForm.dr_unit_key
          }).then((res) => {
            this.$message.success("删除成功");
            this.resetUnits()
          });
        })
        .catch(() => {});
    },
    resetUnits() {
      this.$get("/v1/dr/unit-list").then((res) => {
        this.units = forobj(res.data);
      });
      this.$refs.AreaSelect.reset();
    },
    edit_add(it) {
      //编辑时添加
      let nowForm = this.tabList[this.nowIndex];
      let form1 = {};
      form1.dr_unit_key = this.ruleForm.dr_unit_key;
      form1[nowForm.form] = [it];
      this.$post(nowForm.api.add, form1).then((res) => {
        this.$message.success("保存成功");
        this.changeTab({ index: this.nowIndex });
      });
    },
    edit_edit(it) {
      //编辑时编辑
      let nowForm = this.tabList[this.nowIndex];
      let form1 = {};
      //form[nowForm.form] = [it]
      nowForm.data.map((item) => {
        form1[item.form_name] = it[item.form_name];
      });
      form1[nowForm.id_key] = it[nowForm.id_key];
      this.$post(nowForm.api.edit, form1).then((res) => {
        this.$message.success("保存成功");
        this.changeTab({ index: this.nowIndex });
      });
    },
    edit_del(it) {
      //编辑时删除
      let nowForm = this.tabList[this.nowIndex];
      this.$confirm("是否删除该条数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let form1 = {};
        form1[nowForm.id_key] = it[nowForm.id_key];
        this.$post(nowForm.api.del, form1).then((res) => {
          this.$message.success("删除成功");
          this.changeTab({ index: this.nowIndex });
        });
      });
    },
    getMap() {
      this.$get("/v1/dr/mapcode-list/18").then((res) => {
        //所属行业
        this.industrys = res.data;
      });
      this.$get("/v1/dr/get-area/0").then((res) => {
        //获取省份
        this.proList = res.data.map((it) => {
          return {
            ...it,
            dr_code: +it.dr_code,
          };
        });
      });
    },
    addUnit() {
      //新增单位
      this.status = 1;
      this.nowIndex = "0";
      this.resetForm();
    },
    onSearchResult(pois) {
      let latSum = 0;
      let lngSum = 0;
      this.markers = []
      if (pois.length > 0) {
        pois.forEach((poi,index) => {
          if(index<3){
            let { lng, lat } = poi;
            lngSum += lng;
            latSum += lat;
            this.markers.push({
              position: [poi.lng, poi.lat],
              name: poi.name,
            });
          }
        });
        
        let mapcenter = {
          lng: this.markers[0].position[0],
          lat: this.markers[0].position[1],
        };
        this.mapcenter = [mapcenter.lng, mapcenter.lat];
        this.zoom = 16
      }
    },
    proChanege(flag) {
      this.cityList = [];
      this.areaList = [];
      flag !== 1 && (this.form.dr_unit_base.dr_city = "");
      flag !== 1 && (this.form.dr_unit_base.dr_area = "");
      this.$get("/v1/dr/get-area/" + this.form.dr_unit_base.dr_province).then(
        (res) => {
          //获取市
          this.cityList = res.data.map((it) => {
            return {
              ...it,
              dr_code: +it.dr_code,
            };
          });
        }
      );
    },
    cityChanege(flag) {
      this.areaList = [];
      !flag && (this.form.dr_unit_base.dr_area = "");
      this.$get("/v1/dr/get-area/" + this.form.dr_unit_base.dr_city).then(
        (res) => {
          //获取市
          this.areaList = res.data.map((it) => {
            return {
              ...it,
              dr_code: +it.dr_code,
            };
          });
        }
      );
    },
    editBase() {
      //编辑保存基本信息
      this.$refs.form.validate((valid) => {
        if (valid) {
          let params = {};
          for (let key in form.dr_unit_base) {
            params[key] = this.form.dr_unit_base[key];
          }
          params.dr_unit_key = this.ruleForm.dr_unit_key;
          this.$post("/v1/dr/unit-update", params).then((res) => {
            this.$message.success("保存成功");
            this.resetUnits();
            // this.handleSelectArea({
            //   id: this.ruleForm.dr_unit_id
            // })
          });
        } else {
          this.$message.error("请检查将表单填写完整！");
          this.nowIndex = "0";
          return false;
        }
      });
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.save();
        } else {
          this.$message.error("请检查将表单填写完整！");
          this.nowIndex = "0";
          return false;
        }
      });
    },
    save() {
      //新增
      // this.form.dr_unit_base.dr_unit_parent_id = this.ruleForm.dr_unit_key
      this.form.dr_unit_base.dr_unit_level =
        this.form.dr_unit_base.dr_unit_level || 1;

      let logading = this.$loading({
        background: "rgba(0, 0, 0, 0.6)",
      });
      let form = {...this.form}
      if(!form.dr_key_parts.length){
        delete form.dr_key_parts
      }
      if(!form.dr_unit_building.length){
        delete form.dr_unit_building
      }
      if(!form.dr_unit_facility.length){
        delete form.dr_unit_facility
      }
      if(!form.dr_unit_service.length){
        delete form.dr_unit_service
      }
      this.$post("/v1/dr/unit-add", form)
        .then((res) => {
          this.$message.success("保存成功");
          this.resetUnits();
          logading.close();
        })
        .catch((res) => {
          logading.close();
        });
    },
    changeTab(it) {
      this.adding = false
      if (this.status != 1 && it.index != 0) {
        //查看详情
        let now = this.tabList[+it.index];
        this.$post(now.api.list, {
          dr_parent_key: this.ruleForm.dr_unit_key,
          dr_unit_key: this.ruleForm.dr_unit_key,
        }).then((res) => {
          this.$set(this.form, now.form, res.data || []);
        });
      }
    },
    addList(index) {
      this.adding = true
      let obj = {};
      this.tabList[this.nowIndex].data.forEach((it) => {
        obj[it.form_name] = "";
      });
      this.form[this.tabList[this.nowIndex].form].push(obj);
    },
    del(index) {
      this.adding = false
      this.form[this.tabList[this.nowIndex].form].splice(index, 1);
    },
    handleSelectArea(data) {
      //获取单位基本详情
      getOriginDetail(data.id).then(async (res) => {
        this.status = 3;
        this.ruleForm = res.data;
        this.resetForm();
        this.nowIndex = "0";
        this.form.dr_unit_base = {
          ...res.data,
        };
        this.dr_unit_parent_id = this.form.dr_unit_base.dr_unit_parent_id;
        this.getUser(res.data.dr_unit_key);
        this.zoom = 11;
        this.marker.position = [+res.data.dr_lng, +res.data.dr_lat];
        this.mapcenter = [+res.data.dr_lng, +res.data.dr_lat];
        await this.proChanege(1);
        await this.cityChanege(1);
      });
    },
    getUser(key) {
      this.$get("/v1/dr/get-user-list-unit/" + key).then((res) => {
        this.userList = res.data || [];
        this.tabList.forEach((it) => {
          if (it.form == "dr_key_parts") {
            it.data.map((form) => {
              if (form.form_name == "dr_duty") {
                form.option = this.userList.map((op) => {
                  return {
                    value: op.dr_user_id,
                    label: op.dr_user_name,
                  };
                });
              }
            });
          }
        });
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        PageSize: 20,
      };
    },
    resetForm() {
      this.form = JSON.parse(JSON.stringify(form));
      this.marker.position = [];
      this.form.dr_unit_base.dr_unit_level = 1;
      this.dr_unit_parent_id = "";
      this.$nextTick(() => {
        this.$refs["form"].clearValidate(); // 清除校验
      });
    },
    handleAdd() {
      this.addForm = {};
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["addForm"].clearValidate(); // 清除校验
      });
    },

    handleEdit() {
      this.editDisabled = false;
      this.btnShow = false;
    },

    handleCancel() {
      this.editDisabled = true;
      this.btnShow = true;
    },
    handleDelete() {
      this.$confirm("确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delOrigin({
            dr_unit_key: this.ruleForm.dr_unit_key,
            dr_status: 0,
          }).then((res) => {
            this.$message.success("删除成功！");
            this.$refs.AreaSelect.reset();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    upSuccess(res, obj) {
      console.log(obj, res);
      if (res) {
        if (res.code == 200) {
          this.form[this.tabList[this.nowIndex].form][obj.index][
            obj.item.data[obj.index2].form_name
          ] = res.data.img;
          this.$message.success("上传成功");
        } else {
          this.$message.error("上传失败");
        }
      }
    },
    upError(err, file, fileList) {
      this.$message.error("上传失败");
    },
  },
};
</script>

<style lang="scss">
.status3 {
  .el-input.is-disabled .el-input__inner {
    background-color: #fff;
    color: hsla(0, 0%, 100%, 0.3);
    border: 0;
    font-size: 14px;
  }

  .el-input--mini .el-input__inner {
    text-align: center;
  }

  .el-input.is-disabled .el-input__icon {
    display: none;
  }
}

#dark .el-input.is-disabled .el-input__inner {
  background-color: initial;
  color:  hsla(0, 0%, 100%, 0.65);
  cursor: not-allowed;
  border: 0;
}

.amap-copyright,
.amap-logo {
  display: none !important;
}
#dark {
  .map-search-box {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(33,33,33,0.8);
  }
  .el-vue-search-box-container{
    background: rgba(33,33,33,0.8);
  }
  .el-vue-search-box-container .search-box-wrapper input{
    background: rgba(0,0,0,0);
    color:#fff;
  }
  .el-vue-search-box-container .search-tips{
    background: #242a30;
    border: 1px solid #555;
  }
  .el-vue-search-box-container .search-tips ul li.autocomplete-selected{
    background: #444;
  }
  .amap-marker-label{
    background: #333;
    border: 1px solid #000;
    color: #ccc;
    padding: 5px;
  }
}
.amap-icon img{
  width: 25px;
}
.unit-box {
  .common-table {
    width: 100%;
  }

  td {
    padding: 0 6px;
  }

  .amp,
  .amap-box {
    width: 100%;
    height: 100%;
  }

  .el-tabs__item {
    font-size: 14px;
  }

  th {
    min-width: 50px;
    line-height: 30px;
  }

  .td-btn {
    text-align: center;
    white-space: nowrap;
  }

  .formbox {
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    box-sizing: border-box;
    width: 100%;
  }

  .title {
    height: 28px;
    line-height: 28px;
    margin-bottom: 10px;
  }

  .btnbox {
    margin-top: 20px;
  }
}
</style>
