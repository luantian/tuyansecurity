<template>
<div>
  <el-select :value="value" v-model="nValue" ref="select" placeholder="请选择" clearable :size="size||'small'" @change="change">
    <el-option v-for="item in options" :key="item.dr_id" :label="item.dr_name" :value="item[key_name||'dr_id']">
    </el-option>
  </el-select>

</div>
</template>

<script>
export default {
  props: ['size', 'id', 'value','key_name'],
  data() {
    return {
      nValue: this.value,
      options: []
    }
  },
  watch: {
    value() {
      this.nValue = this.value
    }
  },
  created() {
    this.$get('/v1/dr/mapcode-list/' + this.id).then(res => {
      this.options = res.data
      this.nValue = this.value
    })
  },
  methods: {
    change(val) {
      this.$emit('update:value',val)
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
