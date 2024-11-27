<template>
  <el-row class="box">
    <el-row class="top">
      <el-row type="flex">
        <el-row type="flex" style="width:400px">
          <div class="box-label">随访类型</div>
          <span>{{currentItem.flup_type || ''}}</span>
        </el-row>
        <el-row type="flex">
          <div class="box-label">随访名称</div>
          <span>{{$utils.formatFollowupContent(currentItem) || ''}}</span>
        </el-row>
      </el-row>
      <el-row style="margin-top:10px" type="flex">
        <el-row type="flex" style="width:400px">
          <div class="box-label">随访执行时间</div>
          <span>{{ currentItem.flup_start_time?$utils.formatDate(new Date(currentItem.flup_start_time)):''}}</span>
        </el-row>
        <el-row type="flex">
          <div class="box-label">随访完成时间</div>
          <span>{{currentItem.flup_time_real?$utils.formatDate(new Date(currentItem.flup_time_real)):''}}</span>
        </el-row>
      </el-row>
    </el-row>
    <!-- <el-row style="margin-top:20px;padding:0 15%" v-if="url" v-loading="isLoadingUrl" element-loading-background="#fff" type="flex"> -->
    <!-- <iframe :src="$route.query.address" style="border:none; width:100%;"></iframe> -->
    <!-- <iframe style="flex:1;height:50px" ref="iframe" frameborder='0' :src="url"></iframe> -->
    <!-- </el-row> -->
    <el-row style="margin-top:20px;padding:0 15%" v-if="currentItem.flup_address && ['调查问卷', '健康宣教'].includes(currentItem.flup_type)" type="flex">
      <TemplateContent :type="currentItem.flup_type == '健康宣教' ? 2 : 1" :query="templateQuery" :hideSubmit="true"></TemplateContent>
    </el-row>
    <el-row class="margin-top20" style="padding:0 15%" v-else-if="currentItem.flup_type == '定期检查' || currentItem.flup_type == '定期检验'">
      <el-table :data="checkList" highlight-current-row stripe border>
        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <template v-if="currentItem.flup_type == '定期检查'">
          <el-table-column key="checkType" show-overflow-tooltip :formatter="formatCheckType" label="检查分类"></el-table-column>
          <el-table-column key="checkPart" show-overflow-tooltip :formatter="formatCheckPart" label="检查部位"></el-table-column>
          <el-table-column key="checkItem" show-overflow-tooltip :formatter="formatCheckItem" label="检查项目"></el-table-column>
        </template>
        <template v-else>
          <el-table-column key="inspectionName" show-overflow-tooltip :formatter="formatInspectionType" label="检查名称"></el-table-column>
          <el-table-column key="inspectionType" show-overflow-tooltip :formatter="formatInspectionName" label="样本类型"></el-table-column>
        </template>
      </el-table>
    </el-row>
  </el-row>
</template>

<script>
import TemplateContent from '@/components/tempalteContent'
export default {
  name: 'task-detail',
  components: { TemplateContent },
  data() {
    return {
      currentItem: {},
      isLoadingUrl: false,
      url: null,
      checkList: [],
      templateQuery: {},
    }
  },
  async created() {
    this.$startLoading()
    window.addEventListener('message', (e) => {
      if (e.data.height && e.data.width && this.$refs.iframe) {
        this.$refs.iframe.style.height = e.data.height + 80 + 'px'
        this.isLoadingUrl = false
      }
    })
    console.log(this.$route.query.serial_no)
    await this.$apis
      .getFollowupTaskInfo({
        serial_no: this.$route.query.serial_no || '',
      })
      .then((res) => {
        console.log(res)
        this.currentItem = res || {}
        if (
          this.currentItem.flup_type == '定期检查' ||
          this.currentItem.flup_type == '定期检验'
        ) {
          this.checkList = this.currentItem.flup_content.split(',')
        }
        if (
          ['调查问卷', '健康宣教'].includes(this.currentItem.flup_type) &&
          this.currentItem.flup_address
        ) {
          this.isLoadingUrl = true
          // if(this.$route.query.status == '已完成' && this.currentItem.flup_address) {
          //   // this.url = this.currentItem.flup_address
          //   let query = this.currentItem.flup_address.substring(this.currentItem.flup_address.lastIndexOf('?')+1)
          //   this.templateQuery=this.$qs.parse(query)
          //   return
          // }
          // this.url = this.$baseURL.Questionnaire + '/MyQuestionnaire/GetQuestionnaireNew?' + this.$qs.stringify({
          //   token: this.$cookie.get('token'),
          //   serial_no: this.currentItem.flup_content_id,
          //   hospital_id: this.$global.hospital_id
          // })
          this.templateQuery = {
            master_id: this.currentItem.master_id,
            user_id: this.currentItem.id_no,
            version_number: this.currentItem.version_number,
            serial_no:
              this.currentItem.master_id == null
                ? this.currentItem.detail_serial_no
                : this.currentItem.flup_content_id,
            hospital_id: this.$global.hospital_id,
            taskid: this.currentItem.serial_no,
          }
        }
      })
    this.$stopLoading()
  },
  methods: {
    formatCheckType(row) {
      return row.split('|')[0]
    },
    formatCheckPart(row) {
      return row.split('|')[2]
    },
    formatCheckItem(row) {
      return row.split('|')[4]
    },
    formatInspectionType(row) {
      return row.split('|')[0]
    },
    formatInspectionName(row) {
      return row.split('|')[2]
    },
  },
}
</script>


<style lang="scss" scoped>
.box {
  position: relative;
  background-color: #ffffff;
  padding: 20px;
  .top {
    background-color: rgba(42, 63, 84, 0.04);
    padding: 20px 15%;
  }
  .box-label {
    min-width: 120px;
    width: 120px;
    text-align: right;
    margin-right: 10px;
    color: #425b77;
  }
}
</style>

 