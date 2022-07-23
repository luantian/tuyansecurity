<template>
  <div class="dashboard-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="巡查点配置" name="first"></el-tab-pane>
      <el-tab-pane label="巡查计划配置" name="second"></el-tab-pane>
    </el-tabs>
    <place v-if="activeName === 'first'"/>
    <plan v-if="activeName === 'second'"/>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import place from './modules/place'
  import plan from './modules/plan'
  export default {
    name: 'polling',
    computed: {
      ...mapGetters([
        'name'
      ]),
    },
    components: {
      place,
      plan
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