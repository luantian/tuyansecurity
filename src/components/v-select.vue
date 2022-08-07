<!--
 * @Author: your name
 * @Date: 2022-07-26 21:40:36
 * @LastEditTime: 2022-08-07 12:56:48
 * @LastEditors: your name
 * @Description: 
-->
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

