<template>
  <div class="wx-page">
    <el-result v-if="success===true" icon="success" title="微信绑定成功">
    </el-result>
    <el-result v-if="success===false" icon="warning" title="绑定失败" subTitle="请稍后重试">
    </el-result>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        wxcode: '',
        isWeixin: false,
        html: '',
        wxReady: false,
        user_id:'',
        success:null
      }
    },
    created () {
      document.title = '绑定微信'
    },
    mounted(){
      let str = window.location.href
      var ua = navigator.userAgent.toLowerCase()
      var isWeixin = ua.indexOf('micromessenger') !== -1 // 是否 在微信浏览   器内
      let isURL = window.location.href.indexOf('code=') === -1 // 是否 没有授权重定向回来
      this.isWeixin = isWeixin
      //console.log("参数1：", str, ua, isWeixin, isURL)
      if (isWeixin && isURL) {
        //return this.getLogin()
      } else {
        console.log("没有执行")
        //this.setWx()
      }

      // 重定向回来
      if (!isURL) {
        let num1 = str.indexOf('code=')
        let num2 = str.indexOf('&state=')
        this.wxcode = str.slice(num1 + 5, num2)
        this.user_id = this.$route.query.user_id;
        this.$db.save('WXcode', this.wxcode)
        if(this.wxcode){
          this.getopen_id()
        }
      }
    },
    methods: {
      getopen_id() {
        this.$get('/v1/dr/dr-wx-get-access-token/authorization_code/'+this.wxcode).then(res=>{
          this.dr_openid = res.data.dr_openid
          //this.$bus.user.token = res.data.dr_access_token
          this.bind()
        }).catch(err=>{
          this.success = false
        })
      },
      bind(){
        this.$post('/v1/dr/update-user',{dr_user_uuid:this.user_id,dr_openid:this.dr_openid}).then(res=>{
          this.success = true
        }).catch(err=>{
          this.success = false
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
.wx-page{
  padding: 15px;
}
</style>