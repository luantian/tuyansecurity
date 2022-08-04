<template>
  <el-header class="align-center header">
    <div class="flex1 align-center animate__animated animate__fadeInDown">
      <div class="logo"
           :style="`background: url(${$bus.user.dr_unit_logo}) center no-repeat;background-size: contain;`"></div>
      <div class="f18 ">{{$bus.user.dr_unit_platform_name || '智慧消防平台'}}</div>
    </div>
    <div class="right-menu align-center">
      <a href="/#/monitorCenter"
         target="_blank">
        <div class="header_btn">大屏监控</div>
      </a>
      <!-- <el-button type="primary"
                 size="small"
                 @click="$router.push($bus.user.dr_is_admin=='commonly'?'/alert':'/monitorCenter')">大屏监控</el-button> -->
      <el-dropdown class="avatar-container"
                   trigger="hover"
                   @command="clickDown">
        <div class="avatar-wrapper align-center cursor">
          <i class="iconfont icon-userHeader" style="font-size:18px;"></i>
          <span class="c-f ml5">{{ $bus.user.dr_user_name||'' }}</span>
          <i class="el-icon-arrow-down"
             style="color: #E1EFFE;font-size:14px;margin-left:14px"></i>
        </div>
        <el-dropdown-menu slot="dropdown"
                          class="user-dropdown">
          <el-dropdown-item command="1">修改密码</el-dropdown-item>
          <!-- <el-dropdown-item command="2">退出登录</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
      <i class="iconfont icon-logOut cursor"
         @click="logout()"></i>

    </div>

    <el-dialog :close-on-click-modal="false"
               title="修改密码"
               :visible.sync="showDia1"
               width="500px"
               :append-to-body="true">
      <el-form ref="sform"
               :model="sform"
               label-width="80px"
               :rules="rules">
        <el-form-item label="密码"
                      prop="dr_login_pass">
          <el-input v-model="sform.dr_login_pass"
                    size="small"
                    type="password"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码"
                      prop="dr_login_pass_">
          <el-input v-model="sform.dr_login_pass_"
                    size="small"
                    type="password"
                    clearable></el-input>
        </el-form-item>
      </el-form>
      <div class="center mt20">
        <el-button type="primary"
                   @click="Submit"
                   size="small">保存</el-button>
        <el-button @click="showDia1 = false"
                   size="small">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false"
               title="系统配置"
               :visible.sync="showDia"
               width="500px"
               :append-to-body="true">
      <el-form ref="sform"
               :model="sform"
               label-width="110px"
               :rules="rules">
        <el-form-item label="系统名称"
                      prop="name">
          <el-input placeholder="请输入"
                    v-model="sform.name"
                    maxlength="12"
                    show-word-limit
                    size="small"></el-input>
        </el-form-item>
        <el-form-item label="系统Logo"
                      prop="logo">
          <!-- <el-input placeholder="系统Logo" v-model="sform.logo"></el-input> -->
          <el-upload class="avatar-uploader"
                     action="https://jsonplaceholder.typicode.com/posts/"
                     :headers="{'token':$store.state.token}"
                     :show-file-list="false"
                     :on-success="handleAvatarSuccess"
                     accept="image/*">
            <img v-if="sform.logo"
                 :src="sform.logo"
                 class="avatar"
                 title="点击更换logo">
            <i v-else
               class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="center mt20">
        <el-button type="primary"
                   @click="Submit"
                   size="small">保存</el-button>
        <el-button @click="showDia = false"
                   size="small">取消</el-button>
      </div>
    </el-dialog>

    <!-- <div class="ml20 logout cursor" @click="logout" title="退出登录"></div> -->
  </el-header>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      showDia: false,
      showDia1: false,
      weather: {},
      timer: null,
      weatherIcon: '',
      winddirectionIcon: '',
      sform: {
        dr_login_pass: '',
        dr_login_pass_: ''
      },
      rules: {
        dr_login_pass: [{ required: true, message: '不能为空', trigger: 'blur' }],
        dr_login_pass_: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
    }
  },
  created () {
  },
  methods: {
    clickDown (name) {
      if (name == 1) {
        this.showDia1 = true
      }
      else if (name == 2) {
        this.logout()
      }
    },
    showForm () {
      this.showDia = true
      this.$nextTick(() => {
        this.$refs.sform.resetFields()
      })
    },
    Submit () {
      let _this = this
      this.$refs.sform.validate((valid) => {
        if (valid) {
          if (this.sform.dr_login_pass === this.sform.dr_login_pass_) {
            this.showDia1 = false
            this.$post('/v1/dr/update-user', { dr_login_pass: this.sform.dr_login_pass, dr_user_uuid: this.$bus.user.dr_user_uuid }).then(res => {
              this.$message.success('修改成功')
              this.sform = {
                dr_login_pass: '',
                dr_login_pass_: ''
              }
            }).catch(err => {
              this.$message.error('修改失败')
            })
          } else {
            this.$message.error('两次密码不一致！')
          }

        } else {
          return false
        }
      })

    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    logout () {
      //this.$post('/dr/v1/logout')
      //this.$store.commit('clearUser')
      this.$db.remove('user')
      this.$db.remove('token')
      this.$bus.user = {}
      this.$router.replace({
        path: '/login'
      });
      //window.location.href = 'https://sso.tuyanplat.com/#/choose'
    }
  }
}
</script>
<style scoped lang="scss">
.logout {
  width: 30px;
  height: 30px;
  background: url('~@/assets/img/out.png') center no-repeat;
  background-size: contain;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  line-height: 78px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar {
  width: 78px;
  height: 78px;
  display: block;
}

.main_weather {
  margin-right: 10px;
  font-size: 12px;
  width: 100px;

  i {
    font-size: 14px;
  }

  .wi {
    display: inline-block;
    width: 15px;
    text-align: center;
  }

  .weather,
  .w-x {
    margin-right: 3px;
  }

  .wind {
    margin-top: 4px;
  }
}

.logo {
  width: 33px;
  height: 33px;
  //background: url('~@/assets/img/logo-w.png') center no-repeat;
  //background-size: contain;
  margin-right: 10px;
}

.set-btn {
  cursor: pointer;
}

.header {
  border-bottom: 1px solid #ddd;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 6;
}

.right-menu {
  &:focus {
    outline: none;
  }
  .header_btn {
    width: 139px;
    height: 44px;
    background-image: url('../assets/header-image/header_btn.png');
    background-repeat: no-repeat;
    background-size: 100%;
    text-align: center;
    line-height: 44px;
    font-size: 18px;
    // margin-right: 57px;
    cursor: pointer;
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }

  .avatar-container {
    margin-left: 56px;
    margin-right: 24px;
    .avatar-wrapper {
      position: relative;
      font-size: 18px;
      color: #e1effe;
    }
  }
}
</style>