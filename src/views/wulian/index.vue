<template>
<div id="gss" class="wulian-box">
  <bheader></bheader>
  <div class="black-box flex">
    <div class="tree-unit tree-list">
      <AreaSelect
          @handleSelect="handleSelectArea"
          @ready="handleSelectArea"
          ref="areaTree"
        ></AreaSelect>
    </div>
    <div class="flex1 flex right-box">
      <!-- <nav>
        <form class="layui-form" action="" id="sysBoxForm" autocomplete="off" lay-filter="sysBoxForm">
          <div :class="`navbt bt1 ${tab==1?'active':''}`" title="水系统" style="display: block;" @click="tab=1">消防水系统</div>
          <div :class="`navbt bt2 ${tab==2?'active':''}`" title="电气火灾" style="display: block;" @click="tab=2">智慧用电</div>
        </form>
      </nav> -->
      <water class="flex1" v-if="tab == 1" :unit="unit"></water>
      <electricity class="flex1" v-if="tab == 2" :unit="unit"></electricity>
    </div>
  </div>
</div>
</template>

<script>
import bheader from '../alert/header.vue';
import water from './water';
import electricity from './electricity';
import AreaSelect from "@/components/AreaSelect";

export default {
  components: {
    bheader,water,electricity,AreaSelect
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      filterText: '',
      unit:null,
      tab:this.$route.query.tab|| 1,
      params:{

      },
    }
  },
  methods: {
    handleSelectArea(data){
      this.unit = data
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    changeUnit(val){
      this.tab = 0
      setTimeout(() => {
        this.tab = 1
        this.unit = val
      }, 500);
      
    }
  },
}
</script>

<style lang="scss" scoped>
@import './index.css';

.tree-unit {
  width: 200px;
}
.navbt{
  font-size: 12px;
}
.wulian-box{
  font-size: 12px;
}
.right-box{
  flex-direction: column;
}



</style>
