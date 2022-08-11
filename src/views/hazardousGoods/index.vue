<!--
 * @Author: your name
 * @Date: 2022-08-10 16:11:00
 * @LastEditTime: 2022-08-11 13:16:15
 * @LastEditors: your name
 * @Description: 
-->
<template>
  <div class="hazardous_main">
    <div class="hazardous_main_left">
      <!-- <el-input placeholder="输入关键字进行过滤"
                v-model="filterText"
                clearable
                size="small" /> -->

      <el-tree class="filter-tree"
               :data="dangerousTypeList"
               :props="defaultProps"
               :default-expand-all="true"
               :filter-node-method="filterNode"
               ref="tree"
               @node-click="handleNodeClick"
               :highlight-current="true"
               node-key="dr_id"
               :expand-on-click-node="false">
        <span class="custom-tree-node"
              slot-scope="{ node, data }">
          <div class="tree_left">
            {{ node.label }}
          </div>
          <div class="tree_right">
            <el-button type="text"
                       size="mini"
                       @click.stop="() => updatedHazardousGoodType(node,data)">
              <i class="el-icon-delete"></i>
            </el-button>
            <el-button type="text"
                       size="mini"
                       @click.stop="() => updatedHazardousGoodType(node, data)">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button type="text"
                       size="mini"
                       @click.stop="() => addHazardousGoodType(node, data)">
              <i class="el-icon-plus"></i>
            </el-button>
          </div>
        </span>
      </el-tree>
    </div>
    <div class="hazardous_main_right">
      <div class="main_right_top">
        <div class="right_top_filter">
          <el-button type="primary"
                     size="mini"
                     @click="handleFilter"
                     class="floatR">
            <svg-icon icon-class="filter" /><i :class="!filterBtn ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"></i>
          </el-button>
        </div>
        <!-- 检索区域 -->
        <div class="filterBox"
             v-show="filterBtn">
          <el-form ref="dataForm"
                   class="formBox"
                   :inline="true"
                   :model="filter"
                   label-position="right"
                   label-width="80px">
            <el-row :gutter="24">
              <!-- <el-col :span="8">
                  <el-form-item label="用户名称">
                    <el-input clearable size="mini" v-model="listQuery.dr_user_name" placeholder="请输入" />
                  </el-form-item>
                </el-col> -->
              <el-col :span="5">
                <el-form-item label="名称">
                  <el-input clearable
                            size="mini"
                            v-model="filter.dr_name"
                            placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="状态">
                  <el-select clearable
                             size="mini"
                             v-model="filter.dr_status"
                             placeholder="请选择">
                    <el-option v-for="item in statusOptions"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="大分类">
                  <el-select clearable
                             size="mini"
                             v-model="filter.dr_category"
                             placeholder="请选择">
                    <el-option v-for="item in mapList"
                               :key="item.dr_id"
                               :label="item.dr_name"
                               :value="item.dr_id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="责任人">
                  <el-input clearable
                            size="mini"
                            v-model="filter.dr_duty"
                            placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <el-form-item label=" ">
                  <el-button type="primary"
                             size="mini"
                             @click="selectHazardousGood()">过滤</el-button>
                  <!-- <el-button size="mini"
                             @click="handleReset">重置</el-button> -->
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="add_btn">

      </div>
      <div class="main_right_bottom">

        <el-table :data="list"
                  :row-class-name="tableRowClassName"
                  :stripe="true"
                  :height="tableHeight"
                  style="width: 100%"
                  v-loading="loading"
                  row-key="id"
                  border
                  :header-cell-style="{background:'#f5f7fa',color:'#606266'}"
                  highlight-current-row
                  size="mini">
          <el-table-column prop="dr_key"
                           label="key"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="dr_duty"
                           label="责任人"
                           align="center"
                           show-overflow-tooltip>
            <!-- <template slot-scope="scope">
              <span>{{handle[scope.row.dr_notice_status]||'核实中'}}</span>
            </template> -->
          </el-table-column>
          <el-table-column prop="dr_desc"
                           label="详情"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="dr_notice_status"
                           label="创建时间"
                           align="center"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{formatDateTime(scope.row.dr_create_time*1000)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dr_category_name"
                           label="分类名称"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="dr_name"
                           label="名称"
                           align="center"
                           show-overflow-tooltip />
          <el-table-column label="状态"
                           prop="dr_status"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="规格"
                           prop="dr_spu"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <!-- <el-table-column prop="dr_user_phone" label="所属人电话" align="center" show-overflow-tooltip /> -->
          <el-table-column label="图片"
                           width="180"
                           prop="dr_pic"
                           align="center"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column fixed="right"
                           label="操作"
                           align="center"
                           width="100"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text"
                         @click="updatedHazardousGood(scope.row)">修改</el-button>
              <el-button type="text"
                         @click="updatedHazardousGood(scope.row)">禁用</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0"
                    :total="total"
                    :page.sync="page"
                    :limit.sync="PageSize"
                    @pagination="selectHazardousGood" />
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // 分页

import {
  formatDate,
  formatDateTime
} from "@/utils";
export default {
  name: 'hazardousGoods',
  data () {
    return {
      mapList: [], // 码表下拉 dr_name dr_id
      list: [], // 列表数据
      page: 0,
      total: 0,
      tableHeight: '',
      loading: true,
      PageSize: 0,
      defaultProps: {
        label: 'dr_name',
        children: 'dr_son',
      },
      dangerousTypeList: [],
      filterBtn: false,
      filter: {
        dr_name: '',
        dr_status: null,
        dr_big_category: null,
        dr_category: null,
        dr_duty: ''
      },
      statusOptions: [
        { value: "1", name: '正常' },
        { value: "0", name: '删除' },
      ],
      filterText: ''
    }
  },
  components: {
    Pagination
  },
  methods: {
    formatDate,
    formatDateTime,
    handleFilter () {
      this.filterBtn = !this.filterBtn;
      if (!this.filterBtn) {
        this.tableHeight = document.body.clientHeight - 250;
      } else {
        this.tableHeight = document.body.clientHeight - 250 - 211;
      }
    },
    handleNodeClick (data) {
      // data.dr_id = data.dr_id;
      // this.checked = data;
      console.log(data);
      // this.$emit('handleSelect', data);
    },
    filterNode (value, data) {
      if (!value) return true;
      if (data) {
        return data.dr_name.indexOf(value) !== -1;
      }
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "stripe1-row";
      } else {
        return "stripe2-row";
      }
    },
    /**
     * 获取码表
     */
    getMapCode () {
      return new Promise((reslove, reject) => {
        this.$get('/v1/dr/mapcode-list/92').then(res => {
          this.mapList = res.data;
          reslove()
        }).catch(err => {
          console.log(err);
          reslove()
        })
      })
    },
    /**
     * 添加易燃易爆品分类
     * @param {object} item 添加分类时选中的对象没有则为空
     */
    addHazardousGoodType (item) {

    },
    /**
     * 修改易燃易爆品分类
     * @param {object} item 添加分类时选中的对象没有则为空
     */
    updatedHazardousGoodType (node, data) {
      console.log(node, data)
    },
    /**
     * 查询易燃易爆品分类
     */
    selectHazardousGoodType () {
      this.$get('/v1/dr/dangerous-tree').then(res => {
        let list = []
        if (res.code == 200) {
          for (let key in res.data) {
            list.push(res.data[key])
          }
        }
        this.$set(this, "dangerousTypeList", list)
      })
    },
    /**
     * 删除易燃易爆品分类
     */
    deleteHazardousGoodType (item) {

    },
    /**
     * 添加易燃易爆品
     */
    addHazardousGood () {

    },
    /**
     * 修改易燃易爆品
     * @param {object} item 添加时选中的对象没有则为空
     */
    updatedHazardousGood (item) {

    },
    /**
     * 查询易燃易爆品
     */
    selectHazardousGood () {
      this.loading = true;
      let obj = {
        "dr_name": "测试位号1"
      }
      // 查询条件
      this.$post('/v1/dr/dangerous-list', obj).then(res => {
        console.log(res)
        this.$set(this, 'list', res.data.list)
        this.total = res.data.count || 0;
        this.page = res.data.page || 0;
        this.loading = false;
      })
    },
  },
  async mounted () {
    await this.getMapCode();
    this.selectHazardousGoodType()
    this.selectHazardousGood();
  },
  created () {
    this.tableHeight = document.body.clientHeight - 250
  }
}
</script>

<style lang="scss">
.hazardous_main {
  width: 100%;
  height: 100%;
  display: flex;
  .hazardous_main_left {
    width: 270px;
    height: 100%;
    flex-shrink: 0;
    background: #000C12;
    .el-tree {
      width: 100%;
      height: 100%;
      background: #000C12 !important;
    }
    .filter-tree {
      .el-tree-node__content {
        width: 100%;
        display: flex !important;
        align-items: center;
      }
      .custom-tree-node {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
  .hazardous_main_right {
    flex: 1;
    width: calc(100% - 270px);
    padding: 30px;
    .main_right_top {
      .right_top_filter {
        display: flex;
        justify-content: right;
      }
      .filterBox {
        background: rgba(0, 77, 116, 0.3);
        border: 1px solid rgba(0, 138, 207, 0.66);
        padding: 16px;
      }
    }
    .add_btn {
      height: 69px;
      width: 100%;
    }
    .main_right_bottom {
    }
  }
}
</style>