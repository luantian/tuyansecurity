<template>
  <el-aside width="230px" class="animate__animated animate__fadeInLeft" v-if="!noAccess">
    <el-menu :default-openeds="open" class="nav-wrap el-menu--dark">
      <el-scrollbar style="height:100%" class="el-scroll">
        <template v-for="(item,index) in navList">
          <el-submenu :index="item.dr_self_key" v-if="item.dr_son&&item.dr_son.length" :default-openeds="openeds">
            <template slot="title"><i :class="`iconfont ${item.dr_power_icon} icon-${item.dr_power_icon}`"></i>{{ item.dr_power_name }}</template>
            <el-menu-item-group>
              <router-link :to="child.dr_power_href||''" v-for="child in item.dr_son" v-if="child.dr_power_href">
                <el-menu-item>{{ child.dr_power_name }}</el-menu-item>
              </router-link>
            </el-menu-item-group>
          </el-submenu>
          <router-link :to="item.dr_power_href||''" v-if="!item.dr_son||!item.dr_son.length">
            <el-menu-item :index="item.dr_power_href">
              <i :class="`iconfont ${item.dr_power_icon} icon-${item.dr_power_icon}`"></i>
              <span slot="title">{{ item.dr_power_name }}</span>
            </el-menu-item>
          </router-link>
        </template>
        <!-- <router-link tag="a" target="_blank" to="/chart">
          <el-menu-item>
            <i :class="`iconfont el-icon-pie-chart`"></i>
            <span slot="title">数据看板</span>
          </el-menu-item>
        </router-link> -->

      </el-scrollbar>
    </el-menu>
  </el-aside>
</template>
<script>

export default {
  components: {},
  data() {
    return {
      openeds: [],
      navList: [],
      key: 1, //this.$local.get('user').key,
      open: [],
      menuList: [],
      btnList: [],
      menu: {},
      noAccess: false,
      driver: null,
    }
  },

  mounted() {
    this.getMenu()
    this.noAccess = false
  },
  methods: {
    getMenu() {
      this.navList = [{
        dr_level: 1,
        dr_parent_key: "",
        dr_power_href: "/area/areaManagement",
        dr_power_icon: "el-icon-notebook-2",
        dr_power_name: "单位管理",
        dr_self_key: "3fa19b14fc224206bc123ab64c3680b7",
        dr_son: [],
        dr_sort: 4
      }]
      this.$get('/v1/dr/get-menu').then(res => {
        console.log('res')
        console.log(res)
        this.menu = res.data
        this.setMenu()
        this.noAccess = false
      }).catch(err => {
        log(err)
        //this.$router.replace('/404')
        this.noAccess = true
      })
    },
    setMenu() {
      let dr_menu = this.menu

      for (let key in dr_menu) {
        this.navList.push(dr_menu[key])
      }
      console.log(this.navList);
      for (let key in this.navList) {
        this.navList[key].dr_power_href && this.menuList.push(this.navList[key].dr_power_href)
        //console.log(this.navList[key].dr_son);
        this.navList[key].dr_son = Object.values(this.navList[key].dr_son)
        this.navList[key].dr_son && this.navList[key].dr_son.forEach(menu => {
          //log(menu.dr_power_href)
          if(menu.dr_power_href){
            this.menuList.push(menu.dr_power_href.split('?')[0])
          }
          
          if (menu.dr_power_href == this.$route.path) {
            this.open = [this.navList[key].dr_self_key]
          }
          if (menu.dr_son) {
            menu.dr_son = Object.values(menu.dr_son)
            menu.dr_son.forEach(btn => {
              this.btnList.push(btn)
            })
          }

        })
      }

      this.$store.state.btnList = this.btnList.map(it => {
        return it.dr_power_func_tag
      })
      // this.$nextTick(() => { //开始提示步骤
      //   this.steps()
      // })
      //console.log(this.$store.state.btnList)
      this.checkRouter(this.$route.path)
      //console.log(this.navList[0].dr_son[0].dr_power_href)
      //return
      if (this.$route.query.reload == 1) {
        if (this.navList[0].dr_power_href) {
          return this.$router.replace(this.navList[0].dr_power_href)
        } else {
          return this.$router.replace(this.navList[0].dr_son[0].dr_power_href)
        }
      }else{

      }
      

    },
    steps() {
      this.driver = new this.$driver({
        closeBtnText: '关闭',
        doneBtnText: "完成", //结束按钮的文字
        nextBtnText: "下一步", //下一步按钮的文字
        prevBtnText: "上一步", //上一步按钮的文字
        overlayClickNext: true,
        onDeselected: (() => {
          //console.log(111)
        }),
        onNext: (() => {
          //console.log(this.driver)
        })
      })
      this.driver.defineSteps([{
        element: ".nav-shenpi",
        popover: {
          title: "提示",
          description: "请先在审批列表中添加审批流程",
          position: "right"
        }
      }])
      setTimeout(() => {
        this.driver.start()
      }, 500)

    },
    checkRouter(val) {
       return
      if (this.$store.state.isDev) {
        return
      }
      if(val=='/chart'||val=='/chart1'){
        return
      }
      log(this.menuList,val)
      if (this.menuList.indexOf(val) === -1) {
        if (this.$route.path !== '/404') {
          this.$router.replace('/404')
        }
      }
    }
  },
  watch: {
    '$route.path'(val, old) {
      if (this.menuList.length > 1) {
        this.checkRouter(val)
      }
    }
  }
}
</script>
<style lang="scss">

// .el-menu-item-group__title {
//   padding: 0
// }

// .el-menu-item, .el-submenu__title {
//   height: 44px !important;
//   line-height: 44px !important;
//   overflow: hidden;
//   border-radius: 4px;
// }

// .el-menu-item.is-active {
//   color: #303133 !important;
// }

// .router-link-exact-active .el-menu-item.is-active {
//   color: #fff !important;

// }


// .el-menu-item:hover, .el-menu-item:focus, .el-submenu__title:hover {
//   outline: none;
//   background-color: initial !important;
// }

// .el-menu-item, .el-submenu__title {
//   margin: 6px;
//   //transition: all .3s !important;
//   transition: transform .3s !important;

//   &:hover {
//     transform: translateX(5px);
//   }
// }

// .nav-wrap {
//   padding: 0 8px !important;
//   box-sizing: border-box;

//   .iconfont {
//     color: #666 !important;
//     margin-right: 8px;
//     font-size: 18px;
//   }


//   .is-horizontal {
//     display: none;
//   }

//   ul::-webkit-scrollbar {
//     display: none; /* Chrome Safari */
//   }

//   ul {
//     scrollbar-width: none; /* firefox */
//     -ms-overflow-style: none; /* IE 10+ */
//     overflow-x: hidden;
//     overflow-y: auto;
//   }
// }

// .router-link-exact-active {
//   display: block;
//   width: 100%;

//   li {
//     background: linear-gradient(118deg, #3c78e6, rgba(106, 131, 252, .6));
//     box-shadow: 0 0 6px 1px rgba(106, 131, 252, .7);
//     color: #fff;
//     border-radius: 4px;
//     transform: translateX(0) !important;
//   }


//   .el-menu-item, span {
//     color: #fff;
//   }

//   .iconfont {
//     color: #fff !important;
//   }
// }
</style>