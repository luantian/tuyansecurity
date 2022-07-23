<template>
  <div>
    <el-dialog
      :title="row.dr_order_status == 2 ? '审核' : '详情'"
      :visible.sync="showDia"
      width="1200px"
    >
      <div>
        <el-table
          :data="list"
          border
          size="small"
          :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
          highlight-current-row
          style="width: 100%"
          empty-text="暂无数据"
        >
          <el-table-column
            prop="dr_order_name"
            label="类型"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.dr_device_serial ? '设备' : '设施' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="dr_order_name"
            label="整改问题"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.dr_component }}
            </template>
          </el-table-column>

          <el-table-column
            prop="dr_order_name"
            label="整改图片"
            align="center"
            min-width="150"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.pic && scope.row.pic.length">
                <el-image
                  v-for="img in scope.row.pic"
                  :key="img"
                  style="width: 60px; height: 60px"
                  :src="img"
                  :preview-src-list="scope.row.pic"
                >
                </el-image>
              </div>
              <div v-else>暂无图片</div>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="dr_order_name"
            label="操作"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.dr_component }}
            </template>
          </el-table-column> -->
        </el-table>
        <!-- <div v-for="item in list" :key="item.dr_id">
          <el-image 
            v-if="item.pic&&item.pic.length"
            style="width: 100px; height: 100px"
            :src="item.pic[0]" 
            :preview-src-list="item.pic">
          </el-image>
        </div> -->
      </div>
      <span slot="footer" v-if="row && row.dr_order_status == 2">
        <el-button type="primary" @click="save(1)">通过</el-button>
        <el-button type="danger" @click="save(3)">未通过</el-button>
        <el-button @click="showDia = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ['dr_num', 'row'],
  data() {
    return {
      params: {
        dr_page: 1,
        dr_num: '',
      },
      showDia: false,
      list: [],
      total: 0,
      loading: false,
    }
  },
  watch: {
    showDia(val) {
      if (val) {
        this.params.dr_num = this.dr_num
        this.params.dr_page = 1
        this.getList()
      }
    },
  },
  created() {},
  methods: {
    save(status) {
      this.$post('/v1/dr/get-work-order-operate', {
        dr_order_uuid: this.dr_num,
        dr_order_status: status,
      }).then((res) => {
        this.$message.success('操作成功')
        this.showDia = false
        this.$emit('change')
      })
    },
    getList() {
      this.$post('/v1/dr/patrol-abnormal-list', this.params).then((res) => {
        this.total = res.data.count
        this.list = res.data.list.map((it) => {
          return {
            ...it,
            pic: it.dr_patrol_order_pic
              ? JSON.parse(it.dr_patrol_order_pic)
              : [],
          }
        })
      })
    },
  },
}
</script>

<style>
</style>