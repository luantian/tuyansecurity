<template>
  <div>
    <div class="flex">
      <div style="width: 300px;">
        <el-card v-loading="loading" :style="`height: ${height}px`">
          <div class="p-title">权限列表</div>
          <el-scrollbar :style="`height: ${height-84}px;overflow-y: auto`">
            <ul :key="item.dr_self_key" v-for="item in navList" class="nav-box">
              <div :class="`nav-title ${item.dr_self_key==form.dr_self_key?'active':''}`" @click="getInfo(item)">
                <i :class="`iconfont ${item.dr_power_icon} icon-${item.dr_power_icon}`"></i>
                <span>{{ item.dr_power_name }}</span>
              </div>
              <li :key="li.dr_self_key" v-for="li in item.dr_son">
                <div @click="getInfo(li)" :class="`nav-list ${li.dr_self_key==form.dr_self_key?'active':''}`">
                  {{ li.dr_power_name }}
                </div>
                <div @click="getInfo(btn)" :class="`btn-list ${btn.dr_self_key==form.dr_self_key?'active':''}`"
                     v-for="btn in li.dr_son" :key="btn.dr_self_key">{{ btn.dr_power_name }}
                </div>
              </li>
            </ul>
          </el-scrollbar>

        </el-card>
      </div>
      <div class="flex1 ml20">
        <el-card>
          <div class="p-title flex">
            <div class="flex1">{{ status == 1 ? '新增权限规则' : '权限规则详情' }}</div>
            <div>
              <el-button v-if="status==2" type="primary" size="small" @click="add">新增权限</el-button>
              <el-button v-if="status==2&&form.dr_power_type<3" type="primary" size="small" @click="add1">新增子菜单
              </el-button>
            </div>
          </div>
          <el-form :model="form" ref="form" label-width="80px" :rules="rules" :disabled="disabled" v-loading="loading1">
            <el-form-item label="权限类别" prop="dr_power_type">
              <el-radio-group v-model="form.dr_power_type" @change="changeType">
                <el-radio v-for="item in types" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="权限名称" prop="dr_power_name">
              <el-input v-model="form.dr_power_name" size="samll" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="上级权限" v-if="form.dr_power_type!=1" prop="dr_power_father_key">
              <el-select v-model="form.dr_power_father_key" placeholder="请选择">
                <el-option v-for="item in navs" :key="item.dr_self_key" :label="item.dr_power_name" :value="item.dr_self_key">
                </el-option>
              </el-select>
              <!-- <el-cascader :options="navList" :props="{ checkStrictly: true,value:'dr_id',label:'dr_power_name',children:'dr_son' }" clearable ></el-cascader> -->
            </el-form-item>
            
            <el-form-item label="排序" prop="dr_power_sort">
              <el-input-number v-model="form.dr_power_sort" size="samll" label=""
                :min="0" :max="9999" :step="1" :controls="false" controls-position="both">
              </el-input-number>
            </el-form-item>
            <el-form-item label="权限图标" prop="dr_power_icon" v-if="form.dr_power_type==1">
              <el-input v-model="form.dr_power_icon" size="samll" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="权限链接" prop="dr_power_href" v-if="form.dr_power_type!==3">
              <el-input v-model="form.dr_power_href" size="samll" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="按钮标记" prop="dr_power_func_tag" v-if="form.dr_power_type==3">
              <el-input v-model="form.dr_power_func_tag" size="samll" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
          <div class="f-right mt40">
            <el-button type="primary" size="small" v-if="status==2&&disabled" @click="edit">编辑权限</el-button>
            <el-button type="primary" size="small" v-if="status==2&&!disabled" @click="formSubmit">保存</el-button>
            <el-button type="danger" size="small" @click="del(form)" v-if="status==2">删除权限</el-button>
            <el-button type="primary" size="small" v-if="status==1" @click="formSubmit">保存</el-button>
            <el-button type="danger" size="small" @click="resetForm" v-if="status==1">清空</el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      status: 1, //1新增 2修改
      showDia: false,
      loading: false,
      loading1: false,
      disabled: false,
      height: document.body.clientHeight - 105,
      params: {
        page: 1
      },
      list: [],
      count: 0,
      form: {
        dr_power_name: '',
        dr_power_type: 1,
        dr_power_icon: '',
        dr_power_func_tag: '',
        dr_power_href: '',
        dr_power_father_key: '',
        dr_power_sort:0
      },
      editData: {},
      rules: {
        dr_power_name: [{required: true, message: '请选择', trigger: 'blur'}]
      },
      navs: [],
      navList: [{
        dr_power_key: '332233',
        dr_power_icon: 'icon-dibutubiao_shouye',
        dr_power_name: '首页',
        dr_power_href: '/home',
      },
        {
          dr_power_key: '33233',
          dr_power_icon: 'icon-tiaomacaiji',
          dr_power_name: '资产盘点',
          dr_son: [
            {dr_power_key: '44224', dr_power_name: '盘点列表', dr_power_href: '/check'},
          ]
        },
        {
          dr_power_key: '332343',
          dr_power_icon: 'icon-kucunguanli',
          dr_power_name: '资产管理',
          dr_son: [
            {dr_power_key: '44224', dr_power_name: '资产列表', dr_power_href: '/asset'},
            {dr_power_key: '442224', dr_power_name: '资产分类', dr_power_href: '/asset_class'},
          ]
        },
        {
          dr_power_key: '3323333',
          dr_power_icon: 'icon-piliangyiku',
          dr_power_name: '流程审批',
          dr_son: [
            {dr_power_key: '44224', dr_power_name: '审批列表', dr_power_href: '/process'},
          ]
        },
        {
          dr_power_key: '3312313',
          dr_power_icon: 'icon-kucun',
          dr_power_name: '存放地管理',
          dr_son: [
            {dr_power_key: '44224', dr_power_name: '存放地列表', dr_power_href: '/address'},
          ]
        },
        {
          dr_power_key: '33222313',
          dr_power_icon: 'icon-daohuoqingdian',
          dr_power_name: '日志管理',
          dr_power_href: '/log'
        }, {
          dr_power_key: '33133',
          dr_power_icon: 'icon-gongju',
          dr_power_name: '系统设置',
          dr_son: [
            {dr_power_key: '444', dr_power_name: '管理员列表', dr_power_href: '/user'},
            {dr_power_key: '4442', dr_power_name: '身份管理', dr_power_href: '/role'},
            {dr_power_key: '4442', dr_power_name: '权限规则', dr_power_href: '/menu'},
            {dr_power_key: '4442', dr_power_name: '部门管理', dr_power_href: '/unit'}
          ]
        },

      ],
      types: [{label: '导航', value: 1}, {label: '菜单', value: 2}, {label: '按钮', value: 3}]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.navList = []
      this.loading = true
      this.$post('/v1/dr/get-power').then(res => {
        this.loading = false
        this.navList = res.data
        let result = []

        function getLeaf(data) {
          for (var key in data) {
            result.push(data[key])
            if (!data[key].dr_son) {
              //result.push(data[key])
            } else {
              getLeaf(data[key].dr_son)
            }
          }
        }

        getLeaf({...this.navList})
        this.navs = result
        this.navs[0] && this.getInfo(this.navs[0])
      }).catch(err => {
        this.loading = false

      })
    },
    getInfo(it) {
      this.status = 2;
      //this.disabled = true;
      this.editData = it;
      this.loading1 = true
      this.$refs.form.clearValidate()
      this.$get('/v1/dr/get-power-detail/'+it.dr_self_key).then(res => {
        this.loading1 = false;
        let info = res.data;
        this.form = {
          dr_power_name: info.dr_power_name || '',
          dr_power_type: info.dr_power_type || '',
          dr_power_icon: info.dr_power_icon || '',
          dr_power_func_tag: info.dr_power_func_tag || '',
          dr_power_href: info.dr_power_href || '',
          dr_power_father_key: info.dr_power_father_key || '',
          dr_power_key: info.dr_power_key || '',
          dr_power_sort:info.dr_power_sort||0
          //dr_power_parent_name:info.dr_power_parent_name,

        }
      }).catch(err => {
        this.loading1 = false;

      })
    },
    changeType() {
      this.form.dr_power_name = '';
      this.form.dr_power_icon = '';
      this.form.dr_power_func_tag = '';
      this.form.dr_power_href = '';
      this.form.dr_power_father_key = '';
      this.form.dr_power_sort = 0
    },
    edit(it) {
      this.status = 2;
      this.showDia = true;
      this.disabled = false;
    },
    add() {
      this.status = 1;
      this.$refs['form'].resetFields();
      this.form = {
        dr_power_name: '',
        dr_power_type: 1,
        dr_power_icon: '',
        dr_power_func_tag: '',
        dr_power_href: '',
        dr_power_father_key: '',
        dr_power_sort:0
      }
      this.disabled = false;
    },
    add1() {//增加子菜单
      let pid = this.editData.dr_self_key;
      let level = this.form.dr_power_type + 1
      this.status = 1;
      this.resetForm()
      this.form.dr_power_father_key = pid;
      this.form.dr_power_type = level;
      this.disabled = false;
    },
    del(it) {
      this.$confirm('确定删除所选内容？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$post('/v1/dr/update-power', {dr_power_key: this.form.dr_power_key,dr_power_status:0}).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList()
        })

      }).catch(() => {
      })

    },
    formSubmit() {
      this.$refs['form'].validate((valid) => {
        let api = this.status == 2 ? '/v1/dr/update-power' : '/v1/dr/add-power';
        if (!this.form.dr_power_func_tag) {
          delete this.form.dr_power_func_tag
        }
        if (valid) {
          this.$post(api, this.form).then(res => {
            this.$message.success('保存成功');
            this.getList();
            this.status == 1 && this.resetForm()
          }).catch(err=>{
            this.$message.error('保存失败')
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs['form'].resetFields();
      this.form = {
        dr_power_name: '',
        dr_power_type: 1,
        dr_power_icon: '',
        dr_power_func_tag: '',
        dr_power_href: '',
        dr_power_father_key: '',
        dr_power_sort:0
      }
    },
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
.nav-box {
  color: #666;

  .active {
    background-color: #ecf5ff;
  }

  .nav-title {
    padding: 10px;
    cursor: pointer;
    transition: all .3s;

    &:hover {
      background-color: #ecf5ff;
    }
  }

  .nav-list, .btn-list {
    cursor: pointer;
    padding: 4px 0 4px 45px;
    transition: all .3s;

    &:hover {
      background-color: #ecf5ff;
    }
  }

  .btn-list {
    padding-left: 62px;
  }
}
</style>