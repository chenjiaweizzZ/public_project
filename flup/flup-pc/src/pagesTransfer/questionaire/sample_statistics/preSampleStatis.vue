<template>
  <QustionaireTemplate
    v-if="show"
    ref="question"
    :content="content"
    :hideSubmit="hideSubmit"
    :state="questionState"
  ></QustionaireTemplate>
</template>
<script>
import QustionaireTemplate from '@/components/questionaire_template'
export default {
  data() {
    return {
      serialNo: this.$route.query.serialNo,
      content: '',
      hideSubmit: true,
      questionnaireRecord: {},
      questionState: -1,
      show: false,
    }
  },
  components: {
    QustionaireTemplate,
  },
  created() {
    this.$apis.querySaveContent({ serialNo: this.serialNo }).then((res) => {
      if (this.isJSON(res.result)) {
        this.content = JSON.parse(res.result)
        if (this.questionnaireRecord) {
          if (this.questionnaireRecord.questionList) {
            for (var i in this.content.questionList) {
              for (var j in this.questionnaireRecord.questionList) {
                if (
                  this.questionnaireRecord.questionList[j].label ==
                  this.content.questionList[i].label
                ) {
                  this.content.questionList[
                    i
                  ].value = this.questionnaireRecord.questionList[j].value
                  if (
                    this.content.questionList[i].type == 'radio' ||
                    this.content.questionList[i].type == 'checkbox'
                  ) {
                    for (var k in this.content.questionList[i].options) {
                      if (
                        this.content.questionList[i].options[k].label ==
                          this.content.questionList[i].value &&
                        this.content.questionList[i].options[k].abnormal
                      ) {
                        this.content.questionList[i].options[k].abnormal = true
                      }
                    }
                  }
                }
              }
            }
          }
        }
        this.content = JSON.stringify(this.content)
      }
      this.questionState = res.state
      this.show = true
    })
  },
  methods: {
    isJSON(str) {
      try {
        if (typeof JSON.parse(str) == 'object') {
          return true
        }
      } catch (e) {}
      return false
    },
  },
}
</script>
