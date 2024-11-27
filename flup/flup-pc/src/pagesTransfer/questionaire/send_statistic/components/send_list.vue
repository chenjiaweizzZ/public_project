<template>
  <section class="padding10">
    <div class="font-size1 margin20X">
      <span class="margin-right10">
        <b>姓名：</b>
        {{curItem.patientName}}
      </span>
      <span class="margin-right10">
        <b>性别：</b>
        {{curItem.sex}}
      </span>
      <span class="margin-right10">
        <b>入院日期：</b>
        {{$utils.formatDate(new Date(curItem.admissionDatetime))}}
      </span>
      <span>
        <b>出院日期：</b>
        {{$utils.formatDate(new Date(curItem.dischargeDatetime))}}
      </span>
    </div>
    <el-table ref="table" :data="mainList" stripe border>
      <el-table-column show-overflow-tooltip :width="50" type="index" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip :width="90" prop="senderName" label="发送人"></el-table-column>
      <el-table-column show-overflow-tooltip :label="label+'内容'">
        <template slot-scope="scope">
          <el-button
            style="max-width:100%"
            class="line-ellipsis"
            @click="onView(scope.row)"
            type="text"
          >{{scope.row.questionnaireName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        :formatter="$utils.formatTableDate()"
        prop="sendTime"
        label="发送日期"
      ></el-table-column>
    </el-table>
    <el-pagination
      class="page-custom"
      v-if="mainList.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageIndex"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      background
    ></el-pagination>
  </section>
</template>

<script>
import templateType from '@/mixins/templateType'
import pagination from '@/mixins/pagination'
export default {
  name: 'send-list',
  props: {
    curItem: Object
  },
  mixins: [templateType, pagination],
  data() {
    return {
      mainList: []
    }
  },
  created() {
    this.pageSize = 5
    this.getMainList()
  },
  methods: {
    onView(row) {
      let serial_no = row.serial_no
      if (
        row.serial_no.indexOf('JKXJ') > -1 ||
        row.serial_no.indexOf('WJDC') > -1
      ) {
        serial_no = row.questionnaire_id
      } else if (row.serial_no.indexOf('YYTX') > -1) {
        serial_no = 'YYTX_' + row.patient_taskid
      }
      let query = qs.stringify({
        serial_no: serial_no,
        type: row.type
      })
      if (this.$isProduction) {
        window.parent.postMessage(
          JSON.stringify({
            method: 'addTab',
            url: location.origin + '/pc/#/newpreview?' + query,
            title: `预览`
          }),
          '*'
        )
      } else {
        window.open(location.origin + '/#/newpreview?' + query)
      }
    },
    getMainList() {
      this.$apis
        .questionnairequeryPatientSendRecordStatisticsDetail({
          sourceTableId: this.curItem.serialNo, // 出院记录表id
          questionType: this.type == 2 ? 'WJDC' : 'JKXJ',
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        })
        .then(res => {
          this.mainList = res.list
          this.total = res.total
        })
    }
  }
}
</script>
