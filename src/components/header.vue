<template>
  <el-header class="align-center header">
    <div class="flex1 align-center animate__animated animate__fadeInDown">
      <div class="logo" :style="`background: url(${$bus.user.dr_unit_logo}) center no-repeat;background-size: contain;`"></div>
      <div class="f18 ">{{$bus.user.dr_unit_platform_name || '智慧消防平台'}}</div>
<!--      <div class="f18 ">{{ $map.data_types[$store.state.dr_data_type] }}</div>-->
      <!--            <div class="ml10 center">-->
      <!--                <i class="el-icon-setting bw set-btn" title="设置" @click="showDia = true"></i>-->
      <!--                &lt;!&ndash;  <el-button slot="reference" icon="el-icon-setting" type="text" style="color: #fff;" class="animate__animated animate__fadeInDown"> </el-button> &ndash;&gt;-->
      <!--            </div>-->
    </div>
    <div class="right-menu align-center">
      <!-- <el-popover width="200" trigger="hover">
        <div>
          <img src="@/assets/img/erv.png" alt="" style="max-width: 200px">
          <div class="mt10 tx-center">联系方式：<span class="blue">15588667442</span></div>
        </div>
        <el-button slot="reference" icon="el-icon-phone-outline" type="text" style="color: #fff;"
                   class="animate__animated animate__fadeInDown">咨询
        </el-button>
      </el-popover> -->
      <el-button type="primary" size="small" @click="$router.push($bus.user.dr_is_admin=='commonly'?'/alert':'/home')">返回首页</el-button>
      
      <div v-show="weather.temperature" class="main_weather animate__animated animate__fadeInDown ml20"
           style="margin-right: 20px;">
        <template>
          <div class="flex">
            <div class="weather">
              <i :class="'wi wi-' + weatherIcon"></i>
            </div>
            <div class="wd flex">
              <div class="ssd">
                {{ weather.weather }}
              </div>
              <div class="tq" style="margin-left: 3px">
                {{ weather.temperature }} ℃
              </div>
            </div>
          </div>
          <div class="wind flex">
            <div class="w-x">
              <i :class="'wi wi-wind wi-towards-'+winddirectionIcon"></i>
            </div>
            <div class="w-level">
              {{ weather.winddirection }}风{{ weather.windpower }}级
            </div>
          </div>
        </template>
      </div>
      <div style="margin-right: 50px;width: 175px" class="f14 ml20 animate__animated animate__fadeInRight">{{ nowTime }}
      </div>
      <!--      <div class="ml20">{{ $store.state.userInfo.dr_user_name || 'Admin' }}</div>-->
      <el-dropdown class="avatar-container" trigger="hover" @command="clickDown">
        <div class="avatar-wrapper align-center cursor">
          <i class="el-icon-user-solid" style="color:#fff;font-size:16px"></i>
          <span class="c-f ml5">{{ $bus.user.dr_user_name||'' }}</span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item command="1">修改密码</el-dropdown-item>
          <el-dropdown-item command="2">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog :close-on-click-modal="false" title="修改密码" :visible.sync="showDia1" width="500px" :append-to-body="true">
      <el-form ref="sform" :model="sform" label-width="80px" :rules="rules">
        <el-form-item label="密码" prop="dr_login_pass">
          <el-input v-model="sform.dr_login_pass" size="small" type="password" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="dr_login_pass_">
          <el-input v-model="sform.dr_login_pass_" size="small" type="password" clearable></el-input>
        </el-form-item>
      </el-form>
      <div class="center mt20">
        <el-button type="primary" @click="Submit" size="small">保存</el-button>
        <el-button @click="showDia1 = false" size="small">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :close-on-click-modal="false" title="系统配置" :visible.sync="showDia" width="500px" :append-to-body="true">
      <el-form ref="sform" :model="sform" label-width="110px" :rules="rules">
        <el-form-item label="系统名称" prop="name">
          <el-input placeholder="请输入" v-model="sform.name" maxlength="12" show-word-limit size="small"></el-input>
        </el-form-item>
        <el-form-item label="系统Logo" prop="logo">
          <!-- <el-input placeholder="系统Logo" v-model="sform.logo"></el-input> -->
          <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
                     :headers="{'token':$store.state.token}" :show-file-list="false" :on-success="handleAvatarSuccess"
                     accept="image/*">
            <img v-if="sform.logo" :src="sform.logo" class="avatar" title="点击更换logo">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="center mt20">
        <el-button type="primary" @click="Submit" size="small">保存</el-button>
        <el-button @click="showDia = false" size="small">取消</el-button>
      </div>
    </el-dialog>

    <!-- <div class="ml20 logout cursor" @click="logout" title="退出登录"></div> -->
  </el-header>
</template>
<script>
import {getTime, getWeather} from '../api/common.js'

export default {
  components: {},
  data() {
    return {
      showDia: false,
      showDia1: false,
      nowTime: '',
      weather: {},
      timer: null,
      weatherIcon: '',
      winddirectionIcon: '',
      sform: {
        dr_login_pass: '',
        dr_login_pass_: ''
      },
      rules: {
        dr_login_pass: [{required: true, message: '不能为空', trigger: 'blur'}],
        dr_login_pass_: [{required: true, message: '不能为空', trigger: 'blur'}]
      },
    }
  },
  created() {
    this.setTime()
    this.setWeather();

  },
  methods: {
    changeSys(value) {
      window.location.href = `/?data_type=${value}#/home?reload=1`
      //window.location.reload()
    },
    clickDown(name) {
      if (name == 1) {
        this.showDia1 = true
      }
      else if(name==2){
        this.logout()
      }
    },
    setTime() {
      let timeLine = Date.now()
      this.nowTime = new Date(timeLine).Format('yy年MM月dd日 hh:mm:ss')

      this.timer = setInterval(() => {
        let timeLine = Date.now()
        this.nowTime = new Date(timeLine).Format('yy年MM月dd日 hh:mm:ss')
      }, 1000)

    },
    setWeather() {
      getWeather({
        key: 'c2033986fe11749475852e35030fe835',
        city: '370200',
        extensions: 'base'
      }).then(data => {
        this.weather = data.lives[0];
        console.log(this.weather);
        this.weatherIcon = this.getweatherName(this.weather.weather);
        this.winddirectionIcon = this.getwind(this.weather.winddirection)
      })
    },
    getweatherName(text) { //获取天气ICON名
      var map = {
        "雨": 'rain',
        '晴': 'day-sunny',
        '雪': 'snow',
        '风': 'wind',
        '云': 'cloudy',
        '雾': 'fog',
        '雷': 'thunderstorm',
        '尘': 'day-haze',
        '霾': 'day-haze',
        '沙': 'day-haze'
      };
      for (var key in map) {
        if (text.indexOf(key) !== -1) {
          return map[key]
        }
      }
      return null
    },
    getwind(text) { //获取风向
      var map = {
        '东': 'e',
        '南': 's',
        '西': 'w',
        '北': 'n'
      };
      var str = '';
      for (var key in text) {
        str += map[text[key]]
      }
      return str.split('').reverse().join('')
    },
    showForm() {
      this.showDia = true
      this.$nextTick(() => {
        this.$refs.sform.resetFields()
      })
    },
    Submit() {
      let _this = this
      this.$refs.sform.validate((valid) => {
        if (valid) {
          if (this.sform.dr_login_pass === this.sform.dr_login_pass_) {
            this.showDia1 = false
            this.$post('/v1/dr/update-user', {dr_login_pass: this.sform.dr_login_pass,dr_user_uuid:this.$bus.user.dr_user_uuid}).then(res => {
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
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    logout() {
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
  border-color: #409EFF;
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
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, .1);
  z-index: 6;
}

.right-menu {
  &:focus {
    outline: none;
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
      transition: background .3s;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }
  }

  .avatar-container {
    margin-right: 20px;

    .avatar-wrapper {
      position: relative;

      .user-avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
      }

    }
  }
}
</style>