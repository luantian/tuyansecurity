<template>
  <div style="width: 100%;" class="flex1 flex center" ref="box">
    <div class="center">
      <div v-for="item in numlist" class="bnum">{{item}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props:['info'],
  data() {
    return {
      maxHeight: 0,
      numlist:[]
    }
  },
  mounted(){
  	this.maxHeight = this.$refs.box.offsetHeight
  },
  watch:{
    info(){
      let str = this.info.dr_notice_count+''
      this.numlist = str.split('')
      if(this.numlist.length<4){
        this.numlist.unshift('0')
      }
    }
  },
  methods:{

  }
}

</script>
<style lang="scss" scoped>
.bnum{
  background: linear-gradient(to top, #094d87, #10cbb7);
  font-size: 42px;
  padding: 0 10px;
  margin: 4px;
  border-radius: 6px;
  line-height: 70px;
}
.box-wrap{
  flex-direction: column;
  i{
    font-size: 50px;
  }
  .text{
    margin-top: 5px;
    font-size: 20px;
    font-family: '微软雅黑';
  }
}
</style>
