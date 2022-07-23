<template>
  <div class="dashboard-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="集团设备" name="first"></el-tab-pane>
      <el-tab-pane label="个人设备" name="second"></el-tab-pane>
    </el-tabs>
    <group v-if="activeName === 'first'"/>
    <personal v-if="activeName === 'second'"/>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import Group from './modules/group'
  import Personal from './modules/personal'
  export default {
    name: 'EquipmentManagement',
    computed: {
      ...mapGetters([
        'name'
      ]),
    },
    components: {
      Group,
      Personal
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