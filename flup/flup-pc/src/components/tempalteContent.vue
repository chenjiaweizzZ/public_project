<template>
  <section class="width100">
    <QustionaireTemplate
      ref="question"
      v-if="type == 1 && show"
      :content="content"
      :hideSubmit="hideSubmit"
      :state="questionState"
      @submit="
        (v) => {
          $emit('submit', v);
        }
      "
      :review="review"
    ></QustionaireTemplate>
    <div v-if="type == 2 && show" class="img-auto" v-html="content"></div>
  </section>
</template>

<script>
import QustionaireTemplate from '@/components/questionaire_template'
export default {
  name: 'tempalte-content',
  props: {
    type: Number,
    query: Object,
    hideSubmit: {
      type: Boolean,
      default: false,
    },
    preview: {
      type: Boolean,
      default: false,
    },
    questionnaireRecord: Object,
  },
  components: {
    QustionaireTemplate,
  },
  data() {
    return {
      content: '',
      show: false,
      questionState: -1,
      contentSubstitute: '',
      review: null,
    }
  },
  watch: {
    query: {
      handler() {
        this.show = false
        this.getData({
          ...this.query,
        }).then((res) => {
          // console.log('handlerRes:',res)
          if (this.type === 2) {
            if (this.preview) {
              this.content = res.result
            } else {
              this.content = res.dataList
            }
          } else {
            if (this.preview) {
              this.content = res.contentHtml
            } else {
              this.content = JSON.stringify(res.dataList)
              this.questionState = res.state
            }
          }
          this.show = true
        })
      },
      deep: true,
    },
  },
  created() {
    // console.log(this.questionnaireRecord)
    this.getData({
      ...this.query,
    }).then((res) => {
      // console.log('执行')
      // console.log('this:res',res);
      this.show = true
      if (this.type === 2) {
        //健康宣教
        if (this.preview) {
          this.content = this.HTMLDecode(
            res.result ? res.result : res.contentHtml
          )
        } else {
          this.content = res.result ? res.result : res.contentHtml
        }
      } else {
        if (this.preview) {
          this.content = res.contentHtml
        } else {
          //用于问卷反填
          // debugger
          // console.log('res in else',res)
          // console.log('questionnaireRecord',this.questionnaireRecord)
          if (this.isJSON(res.result)) {
            this.review = res
            this.content = JSON.parse(res.result)
            if (res.point) {
              this.content.point = res.point
            }
            if (res.predictResult) {
              this.content.predictResult = res.predictResult
            }
            if (this.questionnaireRecord) {
              if (this.questionnaireRecord.questionList) {
                for (var i in this.content.questionList) {
                  for (var j in this.questionnaireRecord.questionList) {
                    if (
                      this.questionnaireRecord.questionList[j].label ==
                      this.content.questionList[i].label
                    ) {
                      this.content.questionList[i].value =
                        this.questionnaireRecord.questionList[j].value
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
                            this.content.questionList[i].options[
                              k
                            ].abnormal = true
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

          // console.log()
          // this.content = JSON.stringify(res.result);
          // console.log(this.content)
        }
        this.questionState = res.state
      }
    })
  },
  methods: {
    getData(v) {
      if (this.preview) {
        return this.$apis.templatequeryTemplateContent(v)
      } else {
        return this.$apis.getTelSaveContent(v)
      }
    },
    HTMLDecode(text) {
      var temp = document.createElement('div')
      temp.innerHTML = text
      var output = temp.innerText || temp.textContent
      temp = null
      return output
    },
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
