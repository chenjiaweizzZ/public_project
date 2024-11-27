<template>
  <div class="followup-record" :class="{ 'followup-record--open': isOpen }">
    <div class="followup-record_wrapper">
      <i
        class="followup-record_btn"
        :class="
          isOpen ? 'followup-record_btn--close' : 'followup-record_btn--open'
        "
        @click="isOpen = !isOpen"
      ></i>
      <div class="scroll-auto height100 padding20">
        <section class="followup-record_userinfo">
          <div>
            <span class="color-333">个人信息</span>
            <span class="margin-left20 color-111">
              {{
              `${patientInfo.patient_name || ""}，${patientInfo.sex || ""}，${
              patientInfo.date_of_birth
              ? $utils.getAge(
              $utils.formatDate(new Date(patientInfo.date_of_birth))
              )
              : ""
              }`
              }}
            </span>
          </div>
          <div class="margin-top10">
            <span class="color-333">联系电话</span>
            <span class="margin-left20 color-111">{{ patientInfo.phone }}</span>
          </div>
          <div class="margin-top10">
            <span class="color-333">身份证号</span>
            <span class="margin-left20 color-111">{{ patientInfo.id_no }}</span>
          </div>
        </section>
        <section class="followup-record_content">
          <el-tabs v-model="activeTab" @tab-click="handleClick">
            <el-tab-pane label="随访记录" name="1" disabled>用户管理</el-tab-pane>
            <el-tab-pane label="电话记录" name="2" disabled>配置管理</el-tab-pane>
            <el-tab-pane label="体征数据" name="3" disabled>角色管理</el-tab-pane>
            <el-tab-pane label="住院记录" name="4">
              <el-table :data="mainList" border stripe>
                <el-table-column
                  show-overflow-tooltip
                  prop="admission_datetime"
                  :width="120"
                  :formatter="$utils.formatTableDate()"
                  label="入院时间"
                ></el-table-column>
                <el-table-column
                  prop="discharge_datetime"
                  :formatter="$utils.formatTableDate()"
                  label="出院时间"
                ></el-table-column>
                <el-table-column show-overflow-tooltip prop="admission_ward" label="住院病区"></el-table-column>
                <el-table-column show-overflow-tooltip ::width="40" fixed="right" label="操作">
                  <template slot-scope="scope">
                    <el-button @click="onView(scope.row)" type="text">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                v-if="total != 0"
                layout="prev, pager, next"
                :total="total"
                @current-change="handleCurrentChange"
                :page-size="pageSize"
                :pager-count="5"
                :current-page.sync="pageIndex"
                background
                small
              ></el-pagination>
            </el-tab-pane>
            <el-tab-pane label="门诊记录" name="5" disabled>定时任务补偿</el-tab-pane>
          </el-tabs>
        </section>
        <knowlege></knowlege>
        <!-- <section class="followup-record_knowlegelist">
        <div class="followup-record_knowlegelist_title">随访知识库</div>
        <el-input
          class="width200px padding10"
          v-model="keyWord"
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
        </section>-->
      </div>
    </div>
  </div>
</template>

<script>
import pagination from '@/mixins/pagination'
import Knowlege from './knowlege'
export default {
  data() {
    return {
      isOpen: false,
      activeTab: '4',
      activeItem: '',
      mainList: [],
      knowlegeList: [],
      patientInfo: {},
      knowledgeList: [],
      keyWord: '',
    }
  },
  mixins: [pagination],
  components: { Knowlege },
  props: {
    id: String,
  },
  watch: {
    id: {
      async handler() {
        if (this.id) {
          await this.$apis
            .bgetPatientInfoByUserId({
              patientId: this.id || '',
            })
            .then((res) => {
              this.patientInfo = res
            })
          this.$apis
            .getDischargeRecordList({
              user_id: this.$route.query.user_id,
              page_index: this.pageIndex,
              page_size: this.pageSize && 3,
            })
            .then((res) => {
              this.mainList = res.dataList
              this.total = res.total
            })
        }
      },
      immediate: true,
    },
  },
  created() {
    this.$apis
      .getKnowledge({
        pageIndex: 1,
        pageSize: 3,
        hospital_id: this.$global.hospital_id,
        keyword: '',
      })
      .then((res) => {
        if (res.return_code === 0) {
          this.knowledgeList = res.rows
        }
      })
  },
  methods: {
    handleClick() {},
    onView(row) {
      var urlx
      if (location.pathname) {
        urlx = location.origin + location.pathname
      } else {
        urlx = location.origin + '/pc'
      }
      window.parent.postMessage(
        JSON.stringify({
          method: 'addTab',
          url:
            urlx +
            `/#/healtharchives?userId=${this.patientInfo.userId}&name=${
              this.patientInfo.patientName
            }&sex=${this.patientInfo.sex}&age=${this.$utils.getAge(
              this.patientInfo.dateOfBirth
            )}&phone=${
              this.patientInfo.phone
            }&dateTime=${this.$utils.formatDate(this.patientInfo.createTime)}
            &recordSerialNo=${
              this.patientInfo.recordSerialNo
            }&joinPlanPatientType=${
              this.patientInfo.joinPlanPatientType
            }&flupPlanId=${this.patientInfo.serialNo}&conceal=${true}`,
          title: '健康档案',
        }),
        '*'
      )
    },
    searchKnowlege() {},
  },
}
</script>

<style lang="scss">
.followup-record {
  // font-family: MicrosoftYaHei;
  // width: 480px;
  // position: fixed;
  // right: 0;
  // top: 0;
  // height: 100vh;
  // transition: all 0.3s ease-in;
  // background-color: #fff;
  // border: 1px solid #e6e6e6;
  // z-index: 9999;
  transition: all 0.3s ease;
  &--open {
    // background-color: red;
    // transform: translateX(-480px);
    .followup-record_wrapper {
      transform: translate(0);
    }
  }
  &_wrapper {
    position: fixed;
    width: 480px;
    top: 0;
    right: 0;
    height: 100vh;
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    background: #fff;
    z-index: 40000;
    transform: translate(100%);
  }
  &_btn {
    position: absolute;
    left: -19px;
    top: calc(50vh - 28px);
    transition: all 0.3s ease;
    background-size: cover;
  }
  &_btn--open {
    height: 87px;
    width: 19px;
    background-image: url('~@/assets/images/open.png');
  }
  &_btn--close {
    height: 87px;
    width: 19px;
    background-image: url('~@/assets/images/close.png');
  }
  &_userinfo {
    background: #fbfbfb;
    padding: 16px 20px;
  }
  &_content {
    margin-top: 20px;
    .el-tabs__item {
      padding: 0 10px;
    }
  }
  &_knowlegelist {
    margin-top: 20px;
  }
  &_knowlegelist_title {
    padding: 14px 20px;
    background: #f7f7f7;
    font-size: 16px;
    color: #333333;
  }
}
</style>
