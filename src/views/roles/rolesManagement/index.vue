<template>
  <div class="dashboard-container">
    <!-- <div v-loading="loading" class="search-form" style="padding:20px">
            <el-form :model="params" ref="params" label-width="80px">
              <el-form-item label="角色编号">
                <el-input v-model="params.dr_role_key" size="small" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="角色名称">
                <el-input v-model="params.dr_role_value" size="small" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="创建时间">
                <el-date-picker v-model="timeArr" type="daterange" range-separator="至" start-placeholder="开始日期"
                                end-placeholder="结束日期" size="small" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="f-right">
            <el-button type="primary" @click="searchSubmit" size="small" icon="el-icon-search">搜索</el-button>
            <el-button type="warning" @click="resetSearch" size="small" icon="el-icon-refresh-right">重置</el-button>
          </div> -->
    <div v-loading="loading"
         class="mt20">
      <div class="f-right">
        <el-button type="primary"
                   @click="add"
                   size="samll">新建角色</el-button>
      </div>
      <el-table :row-class-name="tableRowClassName"
                 :stripe="true"
                :data="list"
                class="mt10">
        <el-table-column prop="dr_role_key"
                         label="角色编号"
                         align="center">
        </el-table-column>
        <el-table-column prop="dr_role_value"
                         align="center"
                         label="角色名称">
        </el-table-column>
        <!-- <el-table-column prop="dr_unit_name" align="center" label="所属部门">
            </el-table-column> -->
        <el-table-column prop="create_person"
                         align="center"
                         label="创建时间">
          <template slot-scope="scope">
            <div>{{new Date(scope.row.dr_create_time*1000).Format('yy-MM-dd hh:mm:ss')  }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="create_person"
                         align="center"
                         label="操作">
          <template slot-scope="scope">
            <el-button type="primary"
                       size="mini"
                       @click="edit(scope.row)">修改</el-button>
            <el-button type="danger"
                       size="mini"
                       @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background
                     class="mt20 tx-center"
                     @current-change="handleCurrentChange"
                     :current-page.sync="params.page"
                     :page-size="20"
                     layout="total,prev, pager, next, jumper"
                     :total="count">
      </el-pagination>
    </div>

    <el-dialog :close-on-click-modal="false"
               :title="status==1?'新增角色':'修改角色'"
               :visible.sync="showDia"
               width="620px">
      <el-form :model="form"
               ref="form"
               label-width="90px"
               inline
               :rules="rules">
        <el-form-item label="角色名称"
                      prop="dr_role_value">
          <el-input size="small"
                    v-model="form.dr_role_value"
                    placeholder="请输入"></el-input>
        </el-form-item>
        <!-- <el-form-item label="所属部门" prop="//">
          <el-cascader
              :options="units"
              :props="{ checkStrictly: true ,value:'//',label:'dr_power_name',children:'dr_son'}"
              clearable v-model="form.//" size="small"></el-cascader>
        </el-form-item> -->
      </el-form>
      <tree-transfer v-if="showDia"
                     :title="title"
                     :from_data='navList'
                     :to_data='toData'
                     :defaultProps="{label:'dr_power_name',children: 'dr_son', isLeaf: 'leaf'}"
                     pid="dr_parent_key"
                     node_key="dr_self_key"
                     @addBtn='addTree'
                     @removeBtn='removeTree'
                     :mode='mode'
                     height='400px'
                     filter
                     openAll
                     :renderContentLeft="renderContent"
                     :renderContentRight="renderContent"
                     :indent="30">
      </tree-transfer>
      <div class="f-right mt20">
        <el-button type="primary"
                   @click="formSubmit"
                   size="small">保存</el-button>
        <el-button type="warning"
                   @click="showDia=false"
                   size="small">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import treeTransfer from 'el-tree-transfer';

export default {
  components: { treeTransfer },
  data () {
    return {
      status: 1, //1新增 2修改
      hideSearch: true,
      showDia: false,
      loading: false,
      params: {
        page: 1
      },
      timeArr: [],
      rules: {
        dr_role_value: [{ required: true, message: '请输入', trigger: 'blur' }],
        ////: [{required: true, message: '请选择', trigger: 'change'}],
      },
      list: [],
      count: 0,
      title: ["未分配菜单", "已分配菜单"],
      mode: "transfer",
      form: {
        dr_role_value: '',
        ////: '',
        dr_role_to_power: [],
        // drMenu: [],
        // drButton: [],
        // drNav: [],

      },
      units: [],
      allList: [],
      navList: [],
      toData: [], //目标数据 类型：Array 必填：true 补充：数据格式同element-ui tree组件，但必须有id和pid
    }
  },
  created () {
    this.getList()
    this.getNav()
    //this.getUnit()
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return "stripe1-row";
      } else {
        return "stripe2-row";
      }
    },
    getUnit () {
      this.$post('/v1/dr/unit-list', {}).then(res => {
        this.units = forobj(res.data)
      })
    },
    getNav () {
      this.navList = []
      this.$post('/v1/dr/get-power').then(res => {
        this.forobj(res.data)
        for (let key in res.data) {
          res.data[key].dr_pid = 0
          this.allList.push(res.data[key])
        }
        this.navList = [...this.allList]
        console.log(this.navList);

        //this.navList = [...res.data]
      })
    },
    getList () {
      this.loading = true
      this.$post('/v1/dr/get-role-list', this.params).then(res => {
        this.loading = false
        this.list = res.data.list
        this.count = res.data.count
      }).catch(err => {
        this.loading = false
      })
    },
    add () {
      this.status = 1;
      this.showDia = true;
      this.$nextTick(() => {
        this.resetForm();
      })
    },
    edit (row) {
      this.status = 2;
      this.showDia = true;
      this.$nextTick(() => {
        this.resetForm();
      })
      this.$get('/v1/dr/get-role-detail/' + row.dr_role_key).then(res => {
        let detail = res.data.dr_role_detail
        this.form = {
          dr_role_id: detail.dr_role_id,
          dr_role_key: detail.dr_role_key,
          dr_role_value: detail.dr_role_value,
          //: +detail.//
        }
        res.data.dr_have_not_menu = Object.values(res.data.dr_have_not_menu)
        res.data.dr_have_menu = Object.values(res.data.dr_have_menu)
        this.forobj(res.data.dr_have_not_menu)
        this.forobj(res.data.dr_have_menu)
        this.navList = res.data.dr_have_not_menu
        this.toData = res.data.dr_have_menu
        for (let key in this.navList) {
          this.navList[key].dr_pid = 0
        }
        for (let key in this.toData) {
          this.toData[key].dr_pid = 0
        }
      })
    },
    forobj (obj, callback) {
      for (let key in obj) {
        callback && callback(obj[key])
        obj[key].dr_son = Object.values(obj[key].dr_son)
        if (obj[key].dr_son.length) {
          this.forobj(obj[key].dr_son, callback)
        }
      }
    },
    handleCurrentChange (page) {
      this.params.page = page
      this.getList()
    },
    del (row) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '我再想想',
        type: 'warning',
      }).then(() => {
        this.$post('/v1/dr/update-role', { dr_role_key: row.dr_role_key, dr_status: 0 }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList()
        })

      }).catch(() => {
      })
    },
    searchSubmit () {
      if (this.timeArr.length) {
        this.params.dr_start_create_time = this.timeArr[0]
        this.params.dr_end_create_time = this.timeArr[1]
      }
      this.params.page = 1
      this.getList()
    },
    getToData (val) {
      let arr = [...val]
      // this.form.drMenu = [];
      // this.form.drButton = [];
      // this.form.drNav = [];
      this.form.dr_role_to_power = []
      // arr.forEach(it=>{
      //   this.form.dr_role_to_power[it.dr_self_key] = it.dr_son.map(it => { return it.dr_self_key })
      // })

      arr.forEach(it => {
        this.form.dr_role_to_power.push(it.dr_self_key);
        it.dr_son && it.dr_son.forEach(menu => {
          this.form.dr_role_to_power.push(menu.dr_self_key);
          menu.dr_son && menu.dr_son.forEach(btn => {
            this.form.dr_role_to_power.push(btn.dr_self_key)
          })
        })
      })
    },
    formSubmit () {
      if (!this.toData.length) {
        this.$message.error('请选择权限后保存')
        return
      }
      //console.log(this.toData);
      this.getToData(this.toData)

      //console.log(this.form)

      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.showDia = false
          // if (typeof this.form.// === "object") {
          //   this.form.// = this.form.//[this.form.//.length - 1]
          // }
          // this.form.dr_have_not_menu = this.navList;
          // this.form.dr_have_menu = this.toData
          let api = this.form.dr_role_key ? '/v1/dr/update-role' : '/v1/dr/add-role';
          this.$post(api, this.form).then(res => {
            this.getList()
            this.$message.success('保存成功')
          }).catch(err => {
            this.loading = false
            this.$message.error('保存失败')
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetSearch () {
      this.params = { page: 1 }
      this.timeArr = []
      this.getList()
    },
    resetForm () {
      this.$refs['form'].resetFields();
      this.form = {
        dr_role_value: '',
        //dr_company_id: '',
        dr_role_to_power: []
        // drMenu: [],
        // drButton: [],
        // drNav: []
      }
      this.navList = [...this.allList]
      this.toData = []
    },
    addTree (fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log("fromData:", fromData);
      console.log("toData:", toData);
      console.log("obj:", obj);
    },
    // 监听穿梭框组件移除
    removeTree (fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log("fromData:", fromData);
      console.log("toData:", toData);
      console.log("obj:", obj);
    },
    renderContent (h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <i class={'iconfont ' + data.dr_power_icon}
            style={data.dr_power_icon ? '' : 'display:none'}></i>
          <span>{node.label}</span>
        </span>);
    }
  },
  watch: {
    showDia (val) {
      if (val) {

      } else {
        this.editData = {}
      }
    }
  }
}
</script>