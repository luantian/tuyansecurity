
<template>
  <!-- <div id="login" class="center">
    <div class="wrap">
      <div class="l-form">
        <div class="login-logo"></div>
        <div style="font-size: 32px;margin-top: 100px;font-weight: 700;">
          欢迎使用
        </div>
        <el-form class="login-container" label-position="left" label-width="0px" :model="user" :rules="rules" ref="user">
          <el-form-item prop="dr_login_account">
            <el-input prefix-icon="el-icon-user" type="text" v-model="user.dr_login_account" auto-complete="off" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="dr_login_pass">
            <el-input prefix-icon="el-icon-lock" type="password" v-model="user.dr_login_pass" auto-complete="off" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <el-form-item class="f-right">
            <el-checkbox label="记住账号" v-model="saveNumber">记住账号</el-checkbox>
            <el-checkbox label="记住密码" v-model="savePass">记住密码</el-checkbox>
          </el-form-item>
          <div class="login-btn" :loading="loading" @click="submit">登 录</div>
        </el-form>
      </div>
    </div>
  </div> -->
  <div id="poster">
    <!-- <div class="logo1 animated fadeInDown"></div> -->
    <div class="flex loginbox animated fadeInRight">
      <div :class="`l-r center`">
        <h3 class="login_title">智慧消防管理系统</h3>
        <el-form class="login-container" label-position="left" label-width="0px" :model="user" :rules="rules"
                 ref="user">
          <el-form-item prop="dr_login_account">
            <el-input prefix-icon="el-icon-user" type="text" v-model="user.dr_login_account" auto-complete="off"
                      placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="dr_login_pass">
            <el-input prefix-icon="el-icon-lock" type="password" v-model="user.dr_login_pass" auto-complete="off"
                      placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <!-- <el-form-item class="center f-right">
              <el-checkbox label="记住账号" v-model="saveNumber">记住账号</el-checkbox>
              <el-checkbox label="记住密码" v-model="savePass">记住密码</el-checkbox>
          </el-form-item> -->
          <div class="login-btn" v-loading="loading" @click="submit">登 录</div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { login } from '@/api/user'
export default {
  components: {},
  data() {
    return {
      user: {
        dr_login_account: '',
        dr_login_pass: ''
      },
      rules: {
        dr_login_account: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
        dr_login_pass: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      },
      savePass: true,
      saveNumber: true,
      loading: false
    }
  },
  mounted() {
  },
  created() {
    if (this.$db.get('token')) {
      this.$router.replace('/')
    }
    if (this.$db.get('account')) {
      this.user = this.$db.get('account')
    }
  },
  methods: {
    submit() {
      this.$refs['user'].validate((valid) => {
        if (valid) {
          this.login()
        } else {
          return false;
        }
      });
    },
    login() {
      this.loading = true
      // this.$loading;
      this.user.dr_login_type = 2
      login(this.user).then(res => {
        this.loading = false
        if (res.code == 200) {
          if (this.savePass) {
            this.$db.save('account', this.user)
          } else {
            this.$db.remove('account')
          }
          res.data.token = res.data.dr_veryfiy_code
          res.data.dr_unit_platform_name = res.data.dr_unit_platform_name || '图研智慧消防平台'
          res.data.dr_unit_logo = res.data.dr_unit_logo || 'https://af.tuyanplat.com/upload/ty-logo.png'
          this.$db.save('user', res.data)
          this.$bus.user = res.data
          //this.$router.push({ path: this.redirect || '/home' })
          this.$router.push({ path: '/home' })
        }
      }).catch(res => {
        this.loading = false
        //this.$message.error('登录失败！')
      })
    }
  },

}

</script>
<style lang="scss">
.b-icon {
  width: 35px;
  height: 35px;
  cursor: pointer;
  transition: all .3s;

  &:hover {
    opacity: .7;
  }
}


.logo1 {
  width: 200px;
  height: 50px;
  background: url('~@/assets/img/logo-wr.png') center no-repeat;
  background-size: contain;
  position: fixed;
  top: 50px;
  left: 80px;
  z-index: 33;
}

.flex {
  display: flex;
}

.flex1 {
  flex: 1;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.align-center {
  display: flex;
  align-items: center;
}

.tx-center {
  text-align: center;
}

.c-f {
  color: #fff;
}

#poster {
  background: url(~@/assets/img/web1.png) center no-repeat;
  height: 100%;
  width: 100%;
  background-size: cover;

  .loginbox {
    position: fixed;
    top: 50%;
    margin-top: -240px;
    right: 40px;
    width: 400px;
    height: 390px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 10px 8px rgba(0, 0, 0, .1);
    background: #fff;

    .l-r {
      padding: 40px 30px;
      flex-direction: column;
    }

    .el-input {
      line-height: 44px;
      height: 44px;

      input {
        height: 44px;
      }
    }
  }

  .login-container {
    width: 340px;

  }

  .login_title {
    margin: 18px auto 50px auto;
    text-align: center;
    color: #3D62DE;
    font-size: 28px;
  }

  .login-btn {
    margin-top: 30px;
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    text-align: center;
    color: #fff;
    background-image: linear-gradient(to right, #2B74EA, #56CCF2);
    cursor: pointer;
    border-radius: 5px;
    transition: all .3s;

    &:hover {
      opacity: .8
    }
  }
}
</style>
