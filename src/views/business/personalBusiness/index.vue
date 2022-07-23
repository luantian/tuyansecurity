<template>
  <div class="dashboard-container">
    <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="用户开户" name="first"></el-tab-pane>
      <el-tab-pane label="设备开户" name="second"></el-tab-pane>
    </el-tabs> -->
    <user v-if="activeName === 'first'" />
    <equipment v-if="activeName === 'second'" />
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import User from './modules/user'
  import Equipment from './modules/equipment'
  export default {
    name: 'PersonalBusiness',
    components: {
      User,
      Equipment
    },
    computed: {},
    watch: {},
    data() {
      return {
        activeName: 'first',
      }
    },
    created() {

    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>