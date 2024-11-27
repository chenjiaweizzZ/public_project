<template>
  <section class="followup-record_knowlegelist">
    <div class="followup-record_knowlegelist_title">随访知识库</div>
    <el-input
      class="width200px padding10"
      v-model="keyword"
      placeholder="请输入"
      clearable
      @keyup.enter.native="searchKnowlege"
    >
      <el-button slot="append" icon="el-icon-search" @click="searchKnowlege"></el-button>
    </el-input>
    <el-collapse v-model="activeItem" accordion>
      <el-collapse-item
        v-for="item in knowledgeList"
        :key="item.serial_no"
        :title="item.knowledge_name"
      >{{item.knowledge_content}}</el-collapse-item>
    </el-collapse>
    <el-pagination
      layout="prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      :pager-count="5"
      :current-page.sync="pageIndex"
      background
      small
    ></el-pagination>
  </section>
</template>

<script>
import pagination from '@/mixins/pagination'
export default {
  data () {
    return {
      keyword: '',
      activeItem: '',
      knowledgeList: []
    }
  },
  created() {
    this.pageSize = 2
    this.getMainList()
  },
  mixins: [pagination],
  methods: {
    searchKnowlege() {
      this.pageIndex = 1
      this.getMainList()
    },
    getMainList() {
      return this.$apis.getKnowledge({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        hospital_id: this.$global.hospital_id,
        keyword: this.keyword
      }).then((res) => {
        if (res.return_code === 0) {
          this.knowledgeList = res.rows
          this.total = res.total
        }
      })
    }
  }
}
</script>