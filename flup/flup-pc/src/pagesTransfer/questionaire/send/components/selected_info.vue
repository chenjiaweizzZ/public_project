<template>
  <section>
    <el-row class="margin-left20">
      <label class="width120px margin-right10">{{getNameLabel()}}</label>
      <span>{{getTemplateName()}}</span>
    </el-row>
    <el-row
      type="flex"
      v-if="sendBy == 'patient'"
      class="margin-bottom20 margin-top20 margin-left20"
    >
      <label class="width120px margin-right10" style="min-width:100px">{{getSendedLabel()}}</label>
      <span>{{sendInfo.join('，')}}</span>
    </el-row>
    <el-row class="margin-bottom20 margin-top20 margin-left20">
      <label class="width120px margin-right10">{{getSelectedLabel()}}</label>
      <span>{{count}}</span>
    </el-row>
  </section>
</template>

<script>
export default {
  props: {
    type: Number, //1 以模板为维度, 2 以患者为维度
    selectedList: Array, //选中的列表
    currentSelectedList: {
      type: Array,
      default: () => {
        return []
      },
    },
    sendBy: String,
  },
  data() {
    return {
      sendInfo: [],
    }
  },
  computed: {
    count() {
      return this.currentSelectedList.length
    },
  },
  created() {
    let patient = this.selectedList[0]
    if (patient.sendState == 1) {
      this.$apis
        .questionnairequeryPatientSendRecord({
          userId: patient.userId,
          createTime: patient.admissionDatetime || patient.medicalDate,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.sendInfo = res.map((element) => {
            return `${element.questionnaireName}（${element.createTime.replace(
              'T',
              ' '
            )}）`
          })
        })
    }
  },
  methods: {
    getNameLabel() {
      if (this.type === 1) {
        return (this.$route.params.type === 'WJDC' ? '问卷' : '宣教') + '名称: '
      } else {
        return '患者姓名：'
      }
    },
    getTemplateName() {
      if (this.type === 1) {
        return this.selectedList
          .map((element) => {
            return element.questionnaireName
          })
          .join('，')
      } else {
        return this.selectedList
          .map((element) => {
            return this.$utils.shield(element.patientName, 1)
          })
          .join('，')
      }
    },
    getSelectedLabel() {
      if (this.type === 1) {
        return '选中人数：'
      } else {
        return (
          (this.$route.params.type === 'WJDC' ? '问卷' : '宣教') + '选中数：'
        )
      }
    },
    getSendedLabel() {
      return (
        '已发送' + (this.$route.params.type === 'WJDC' ? '问卷' : '宣教') + '：'
      )
    },
  },
}
</script>
