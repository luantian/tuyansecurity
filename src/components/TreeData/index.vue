<template>
  <div class="areaBox">
    <el-input placeholder="输入关键字进行过滤"
              v-model="filterText"
              clearable
              size="small" />
    <el-tree class="filter-tree"
             :data="areaList"
             :props="defaultProps"
             :default-expand-all="true"
             :filter-node-method="filterNode"
             ref="tree"
             @node-click="handleNodeClick"
             :highlight-current="true"
             node-key="dr_unit_id"
             :expand-on-click-node="false">
    </el-tree>
  </div>
</template>
<script>
import { getOrigin } from '@/api/origin';

export default {
  data () {
    return {
      filterText: '',
      areaList: [],
      defaultProps: {
        label: 'dr_unit_name',
        children: 'dr_son',
      },
      checked: {},
    };
  },
  mounted () {
    this.getTree();
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    getTree () {
      getOrigin().then((res) => {
        //let data = [{ id: res.data.dr_unit_id, name: res.data.name, son: res.data.son }]
        let data = forobj(res.data);
        this.areaList = data;
        this.$bus.areaList = data;
        //this.checked = { id: res.data.dr_unit_id, name: res.data.dr_unit_name }
        data[0].id = data[0].dr_unit_id;
        this.checked = data[0];

        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(data[0].dr_unit_id);
          this.$emit('ready', this.checked);
        });
      });
    },
    handleNodeClick (data) {
      data.id = data.dr_unit_id;
      this.checked = data;
      console.log(data);
      this.$emit('handleSelect', data);
    },
    reset () {
      this.areaList = [];
      this.$bus.areaList = [];
      this.getTree();
    },
    filterNode (value, data) {
      if (!value) return true;
      if (data) {
        return data.dr_unit_name.indexOf(value) !== -1;
      }
    },
  },
};
</script>
<style scoped>
.areaBox {
  max-height: 77vh;
  overflow: auto;
}
</style>