<template>
  <section class="health_monitor">
    <div class="health_monitor_wrapper">
      <section class="health_monitor_aside">
        <el-input v-model="keywords" placeholder="请输入" @keyup.enter.native="onSearch" clearable>
          <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
        </el-input>
        <div ref="health_monitor_list" class="health_monitor_list">
          <el-table
            ref="table"
            :data="patientList"
            highlight-current-row
            stripe
            border
            @current-change="changePatient"
          >
            <el-table-column prop="flup_type" label="姓名"></el-table-column>
            <el-table-column prop="flup_type" label="性别"></el-table-column>
            <el-table-column prop="flup_type" label="年龄"></el-table-column>
          </el-table>
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="pageSize"
            :pager-count="5"
            :current-page.sync="pageIndex"
            @current-change="handleCurrentChange"
            background
            small
          ></el-pagination>
        </div>
      </section>
      <div class="health_monitor_main">
        <div class="health_monitor_main_header">
          <div class="pre-wrap">
            <span class="color-333 font-size2 bold">{{currentItem.name}}</span>
            <span class="color-111">{{` ${currentItem.sex} ${currentItem.age}`}}</span>
            <span class="color-333 margin-left30">联系电话 {{currentItem.phone}}</span>
            <i class="icon-phone"></i>
          </div>
          <el-row class="bgcolor-white margin-top16 border1" type="flex" align="middle">
            <div class="padding10 border-right1 color-333 bold">最近数据</div>
            <div class="padding15" v-for="item in options" :key="item.value">
              <div class="text-align-center">{{item.label}}</div>
              <div class="text-align-center margin-top9">{{item.value}}</div>
            </div>
          </el-row>
        </div>
        <div class="margin-top20">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import pagination from '@/mixins/pagination'
export default {
  name: 'health_monitor',
  mixins: [pagination],
  data() {
    return {
      keywords: '',
      currentItem: {
        name: '张三',
        sex: '男',
        age: '15',
        phone: '1588888888',
      },
      options: [
        { label: '血压', value: '123' },
        { label: '血样', value: '456' },
      ],
      patientList: [],
    }
  },
  async created() {
    this.$startLoading()
    this.$nextTick(() => {
      var ro = new ResizeObserver(this.$_.debounce(this.setPageSize, 300))
      ro.observe(this.$refs['health_monitor_list'])
    })
    this.$stopLoading()
  },
  methods: {
    async setPageSize(entries) {
      for (let entry of entries) {
        const cr = entry.contentRect
        let oldPageSize = this.pageSize
        this.pageSize = Math.floor((cr.height - 75) / 40)
        if (this.pageSize <= 0) {
          this.pageSize = 1
        }
        if (oldPageSize !== this.pageSize) {
          await this.getMainList()
          this.$stopLoading()
        }
      }
    },
    getMainList() {
      return []
    },
    onSearch() {
      this.pageIndex = 1
      this.getMainList()
    },
    changePatient() {},
  },
}
</script>

<style lang="scss">
.health_monitor {
  position: fixed;
  top: 20px;
  bottom: 20px;
  left: 20px;
  right: 20px;
  &_wrapper {
    position: relative;
    height: 100%;
    display: flex;
  }
  &_aside {
    width: 330px;
    display: flex;
    flex-direction: column;
    background: #fbfbfb;
    padding: 16px 20px;
  }
  &_list {
    flex: 1;
    margin-top: 20px;
  }
  &_main {
    flex: 1;
    margin-left: 20px;
    overflow: auto;
  }
  &_main_header {
    padding: 20px;
    background-color: #f8f8f8;
  }
}
</style>

