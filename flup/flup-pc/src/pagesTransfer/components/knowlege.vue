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
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item) in typeList"
        :key="item.serialNo"
        :label="item.dict_name"
        :name="item.serial_no"
      ></el-tab-pane>
    </el-tabs>
    <el-collapse v-model="activeItem" accordion>
      <el-collapse-item
        v-for="item in knowledgeList"
        :key="item.serialNo"
        :name="item.serialNo"
        :title="item.knowledgeName"
      >
        <p
          style="word-break: break-all;overflow-wrap: break-word; white-space: break-spaces;"
          v-html="contentHTML"
        ></p>
      </el-collapse-item>
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
  data() {
    return {
      keyword: '',
      activeItem: '',
      knowledgeList: [],
      typeList: [],
      activeTab: 0,
      hospitalId: this.$global.hospital_id,
      contentHTML: '',
    }
  },
  watch: {
    activeItem() {
      this.$apis
        .GetKnowledgeContent({ serialNo: this.activeItem })
        .then((res) => {
          this.contentHTML = res.knowledgeContentHtml
        })
    },
  },
  created() {
    //获取知识库类型
    this.$apis
      .BaseDictGetDictItems({ parentId: '20210414154335152xx8' })
      .then((res) => {
        this.typeList = res
        this.activeTab = res[1].serial_no
      })
    this.pageSize = 2
    this.getMainList()
  },
  mixins: [pagination],
  methods: {
    handleClick() {
      this.$apis
        .FlupKnowledgeGetKnowledgeRecord({
          hospitalId: this.hospitalId,
          pageNo: 1,
          pageSize: 2,
          searchKey: 'knowledgeType',
          searchValue: this.activeTab,
        })
        .then((res) => {
          this.knowledgeList = res.list
          this.total = res.total
        })
    },
    searchKnowlege() {
      this.pageIndex = 1
      this.getMainList()
    },
    getMainList() {
      return this.$apis
        .FlupKnowledgeGetKnowledgeRecord({
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          hospitalId: this.$global.hospital_id,
          keyword: this.keyword,
          searchKey: 'knowledgeType',
          searchValue: this.activeTab,
        })
        .then((res) => {
          this.knowledgeList = res.list
          this.total = res.total
        })
    },
    getKnowledgeContent(serialNo) {
      this.$apis.GetKnowledgeContent({ serialNo: serialNo }).then((res) => {
        this.contentHTML = res.knowledgeContentHtml
      })
    },
  },
}
</script>