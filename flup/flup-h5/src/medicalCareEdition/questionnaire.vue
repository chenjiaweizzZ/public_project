//调查问卷
<template>
  <div class="medicalcarebox16">
    <van-notice-bar
      wrapable
      :scrollable="false"
      :text="basicInformation.patientName + ' ' + basicInformation.age+' 岁 '  + ( (basicInformation.sex != 'null'&&basicInformation.sex)  ? basicInformation.sex :'')+' '+ basicInformation.phone"
    />
    <div class="basicInformation">
      <div>
        <h3>
          {{basicInformation.flupPlan}}
          <div>
            <span>{{basicInformation.fuWay==0?'全院随访':basicInformation.fuWay==1?'专科随访':'慢病随访'}}</span>
            <p>{{basicInformation.status}}</p>
          </div>
        </h3>

        <van-button
          style="width: 70px;"
          v-if="review&&review.answerTime&&review.evaluationEnabled==1"
          :disabled="JSON.parse(review.patientSide).length == 0"
          size="small"
          type="default"
          @click="goToEvaluationResults"
        >评测结果</van-button>
      </div>
      <p>
        随访内容
        <span>{{basicInformation.flupContent}}</span>
      </p>
      <p>
        执行时间
        <span>{{basicInformation.flupStartTime}}</span>
      </p>
      <p>
        完成时间
        <span>{{basicInformation.flupTimeReal}}</span>
      </p>
    </div>
    <div v-if="type == 2" class="frombox">
      <div class="ignore tel-content flex-column-align paddingX20 padding-bottom20">
        <template v-if="state == 0">
          <div
            class="question flex-align-self-start"
            style="width: 100%"
            v-for="(item, index) in questionList.slice(
            startQuestion,
            endQuestion + 1
          )"
            :key="index"
          >
            <el-form v-if="item.type !== 'addPage' " :model="item" ref="form">
              <el-form-item
                v-if="showInventoryProblem(item, index + startQuestion)"
                :label="item.key + '、' + item.label"
                prop="value"
                :required="item.required"
                :rules="[{ required: item.required, message: '请输入问题答案' }]"
              >
                <el-input
                  v-model="item.value"
                  v-if="item.type === 'input'"
                  placeholder="请输入内容"
                  maxlength="50"
                  show-word-limit
                ></el-input>
                <el-input
                  type="textarea"
                  resize="none"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="请输入内容"
                  v-if="item.type === 'textarea'"
                  v-model="item.value"
                  maxlength="200"
                  show-word-limit
                ></el-input>
                <select
                  class="select"
                  v-model="item.value"
                  placeholder="请选择"
                  v-if="item.type === 'select'"
                >
                  <option value disabled selected style="display: none">请选择</option>
                  <option
                    v-for="item1 in  showOptions(item)"
                    :key="item1.label"
                    :label="item1.label"
                    :value="item1.label"
                  >{{ item1.label }}</option>
                </select>

                <van-radio-group
                  @change="getPoint(item, $event)"
                  v-model="item.value"
                  v-if="item.type === 'inventoryProblem'&&!item.multiple"
                >
                  <van-radio
                    class="vanRadio"
                    :style="item.value==item1.label?'border: 1px solid #409eff;':'border:1px solid #ddd;'"
                    v-for="(item1,index) in  showOptions(item)"
                    :key="index"
                    :name="item1.label"
                    icon-size="14px"
                  >
                    {{item1.label}}
                    <template v-if="item.value==item1.label" #icon="props">
                      <img
                        style="width: 14px;height: 14px;"
                        class="img-icon"
                        :src="props.checked?getImgUrls():getImgUrls()"
                      />
                    </template>
                  </van-radio>
                </van-radio-group>

                <!-- <el-checkbox-group
                @change="getPoint(item, $event)"
                v-model="item.value"
                v-if="item.type === 'inventoryProblem'&&item.multiple"
              >
                <el-checkbox
                  v-for="item1 in  showOptions(item)"
                  :key="item1.label"
                  border
                  :label="item1.label"
                >{{ item1.label }}</el-checkbox>
                </el-checkbox-group>-->

                <van-checkbox-group
                  v-model="item.value"
                  @change="getPoint(item, $event)"
                  v-if="item.type === 'inventoryProblem'&&item.multiple"
                >
                  <van-checkbox
                    class="vanRadio"
                    :style="item.value.indexOf(item1.label)!=-1?'border: 1px solid #409eff;':'border:1px solid #ddd;'"
                    shape="square"
                    icon-size="15px"
                    v-for="item1 in  showOptions(item)"
                    :key="item1.label"
                    border
                    :name="item1.label"
                  >{{ item1.label }}</van-checkbox>
                </van-checkbox-group>

                <van-radio-group
                  v-model="item.value"
                  v-if="item.type === 'radio'"
                  @change="item.otherOption=''"
                >
                  <template v-for="(item1,index) in  showOptions(item)">
                    <div :key="index">
                      <van-radio
                        class="vanRadio"
                        :style="item.value==item1.label?'border: 1px solid #409eff;':'border:1px solid #ddd;'"
                        :name="item1.label"
                        icon-size="14px"
                      >
                        {{item1.label}}
                        <template v-if="item.value==item1.label" #icon="props">
                          <img
                            style="width: 14px;height: 14px;"
                            class="img-icon"
                            :src="props.checked?getImgUrls():getImgUrls()"
                          />
                        </template>
                      </van-radio>

                      <el-input
                        v-if="item.value == item1.label&&item1.supplement"
                        class="margin-bottom5"
                        autosize
                        placeholder="请输入补充说明"
                        v-model="item.otherOption"
                        maxlength="200"
                      ></el-input>
                    </div>
                  </template>

                  <van-radio
                    v-if="item.hasOtherOption"
                    @change="selectOther(item)"
                    class="vanRadio"
                    :style="item.value=== undefined?'border: 1px solid #409eff;':'border:1px solid #ddd;'"
                    icon-size="14px"
                  >
                    其它
                    <template v-if="item.value===undefined" #icon="props">
                      <img
                        style="width: 14px;height: 14px;"
                        class="img-icon"
                        :src="props.checked?getImgUrls():getImgUrls()"
                      />
                    </template>
                  </van-radio>
                </van-radio-group>
                <el-radio-group v-model="item.value" v-if="item.type === 'radio'">
                  <el-input
                    class="margin-top10"
                    type="textarea"
                    autosize
                    placeholder="请输入"
                    v-model="item.otherOption"
                    v-if="item.hasOtherOption && item.value === undefined"
                  ></el-input>
                </el-radio-group>
                <!-- 引用题 -->
                <el-radio-group v-model="item.value" v-if="item.type === 'refProblem'">
                  <el-radio
                    v-for="jitem in getRefOptions(item)"
                    :key="jitem.key"
                    :value="jitem.value"
                    :label="jitem.label"
                    border
                  ></el-radio>
                </el-radio-group>

                <van-checkbox-group
                  @change="getPoint(item, $event)"
                  v-model="item.value"
                  v-if="item.type === 'checkbox'"
                >
                  <van-checkbox
                    class="vanRadio"
                    :style="item.value.indexOf(item1.label)!=-1?'border: 1px solid #409eff;':'border:1px solid #ddd;'"
                    shape="square"
                    icon-size="15px"
                    v-for="item1 in  showOptions(item)"
                    :key="item1.label"
                    border
                    :name="item1.label"
                  >{{ item1.label }}</van-checkbox>
                </van-checkbox-group>

                <!-- <p>日期</p> -->
                <div v-if="item.type === 'datePickerinput'" class="datePickerinput">
                  <el-input type="number" v-model="item.value[0]" maxlength="4"></el-input>
                  <p>年</p>
                  <el-input type="number" v-model="item.value[1]" maxlength="2"></el-input>
                  <p>月</p>
                  <el-input type="number" v-model="item.value[2]" maxlength="2"></el-input>
                  <p>日</p>
                </div>
                <el-date-picker
                  v-if="item.type === 'datePicker'"
                  v-model="item.value"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <el-row class="page-button flex-align-justify width100pct">
            <el-button
              type="primary"
              class="flex1"
              v-if="currentPage !== 1"
              @click="current_change('up')"
            >上一页</el-button>
            <el-button
              type="primary"
              class="flex1"
              v-if="currentPage !== pagesize.length"
              @click="current_change('down')"
            >下一页</el-button>
            <el-button
              type="primary"
              class="flex1"
              v-if="currentPage === pagesize.length"
              @click.once="submit"
            >提交</el-button>
          </el-row>
        </template>
        <template v-if="state == 1">
          <el-row
            class="width100pct margin-top20"
            v-for="(item,index) in questionList"
            :key="index"
          >
            <div>{{index + 1}}、{{item.label}}</div>
            <div v-if="item.value instanceof Array" class="padding-left20">
              <p
                style="margin-bottom: 10px;"
                v-for="(item, index) in item.value"
                :key="index"
              >{{item}}</p>
            </div>
            <div class="padding-left20" v-else>{{item.value}}</div>
          </el-row>
        </template>
      </div>
    </div>
    <div v-else-if="type == 3">
      <section class="wrapper" v-html="html"></section>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/index.css'
import {
  Row,
  Button,
  Form,
  FormItem,
  Input,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
} from 'element-ui'
export default {
  name: 'tel_preview',
  components: {
    [Row.name]: Row,
    [Button.name]: Button,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Input.name]: Input,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [CheckboxGroup.name]: CheckboxGroup,
    [Checkbox.name]: Checkbox,
  },
  data() {
    return {
      serialNo: this.$route.query.serialNo,
      detailSerialNo: this.$route.query.detailSerialNo,
      versionNumber: this.$route.query.versionNumber,
      type: null,
      basicInformation: {},
      state: -1,
      isTel: true,
      currentPage: 1, //默认开始的页面
      pagesize: [],
      total: 0, //默认数据总数
      endQuestion: 0,
      startQuestion: 0,
      questionList: [],
      description: '',
      title: '',
      html: '',
      hospitalId: null,
      review: null,
    }
  },
  computed: {
    getImgUrls() {
      return function () {
        return require('@/assets/images/dxxz.png')
      }
    },
  },
  watch: {},
  mounted() {
    this.$apis.getPatientPlanDetail({ serialNo: this.serialNo }).then((res) => {
      this.basicInformation = res.retData
    })
    this.$apis.querySaveContent(this.serialNo).then((res) => {
      this.type = res.retData.type
      this.hospitalId = res.retData.hospitalId
      if (this.type == 2) {
        this.review = res.retData
        var result = JSON.parse(res.retData.result)
        this.questionList = result.questionList
        this.description = result.description
        this.title = result.title
        this.state = res.retData.state
        this.total = this.questionList.length
        for (let i = 0, count = 0; i < this.total; i++, count++) {
          if (this.questionList[i].type === 'addPage' || i === this.total - 1) {
            if (this.pagesize.length === 0) {
              this.endQuestion = count
            }
            this.pagesize.push(count)
            count = 0
          }
        }
      } else if (this.type == 3) {
        this.html = res.retData.result
      }
    })
  },
  methods: {
    showOptions(item) {
      let options = []
      item.options.forEach((element) => {
        let flag = 0
        //添加选项关联且选项大于1
        if (
          element.optionRelated &&
          element.optionRelated.optionIndex.length > 0
        ) {
          element.optionRelated.optionIndex.forEach((jelement) => {
            //多选框的value是Array
            if (
              this.questionList[element.optionRelated.questionIndex].type ==
              'checkbox'
            ) {
              this.questionList[
                element.optionRelated.questionIndex
              ].value.forEach((zelement) => {
                if (
                  zelement ===
                  this.questionList[element.optionRelated.questionIndex]
                    .options[jelement].label
                ) {
                  flag++
                }
              })
            } else {
              if (
                this.questionList[element.optionRelated.questionIndex].value ===
                this.questionList[element.optionRelated.questionIndex].options[
                  jelement
                ].label
              ) {
                flag++
              }
            }

            //如果是and类型。全部选择方可添加options
            if (element.optionRelated.relatedWay == 'and') {
              if (flag == element.optionRelated.optionIndex.length) {
                if (options.findIndex((item) => item == element) == -1) {
                  options.push(element)
                }
              }
            } else {
              //如果是or类型，满足其中一个方可添加options
              if (flag > 0) {
                if (options.findIndex((item) => item == element) == -1) {
                  options.push(element)
                }
              }
            }
          })
        } else {
          //选项未被关联
          options.push(element)
        }
      })
      let showRequire =
        item.oriRequired == undefined ? item.required : item.oriRequired
      if (options.length == 0) {
        item.oriRequired = showRequire
        item.required = false
      } else {
        item.required = showRequire
      }
      return options
    },
    selectOther(item) {
      item.otherOption = ''
    },
    getPoint(obj, value) {
      if (obj.type === 'inventoryProblem' && !obj.multiple) {
        obj.score = obj.options.find((element) => {
          return element.label === value
        }).score
      } else {
        obj.score = 0
        obj.options.forEach((element) => {
          value.forEach((item) => {
            if (element.label === item) {
              obj.score += element.score
            }
          })
        })
      }
    },
    ifAbnormal(element) {
      if ('input|textarea'.indexOf(element.type) > -1) {
        return element.value !== '' && element.abnormal === true
      } else {
        let abnormal = false
        element.options.forEach((jelement) => {
          if (jelement.label === element.value) {
            abnormal = true
          }
        })
        return abnormal
      }
    },
    submit() {
      let flag = true
      for (let i in this.$refs.form) {
        this.$refs.form[i].validate((valid) => {
          if (valid) {
            flag = true
          } else {
            flag = false
            return
          }
        })
        if (!flag) {
          return
        }
      }

      this.questionList = this.questionList.filter((element) => {
        return element.type !== 'addPage' && element.relatedList
          ? element.relatedList.length > 0
            ? element.value
            : true
          : true
      })

      let questionList = this.questionList.map((element) => {
        if (
          typeof element.value === 'object' &&
          element.type.indexOf('datePicker') != -1
        ) {
          if (element.value.length == 3) {
            element.value = element.value.join('-')
          }
        }
        return {
          firstTimeMedicationFeel: element.firstTimeMedicationFeel,
          firstTimeMedicationTime: element.firstTimeMedicationTime,
          label: element.label,
          value:
            element.value && element.otherOption
              ? element.value + ',' + element.otherOption
              : element.value || element.otherOption || '',
          point: element.score || 0,

          abnormal: this.ifAbnormal(element),
          key: element.key,
        }
      })
      let answer_content = {
        title: this.title,
        description: this.description,
        questionList,
      }

      if (flag) {
        this.$apis
          .saveTemplateContent({
            answerContentJson: JSON.stringify(answer_content),
            serialNo: this.detailSerialNo,
            hospitalId: this.hospitalId,
            taskId: this.serialNo,
          })
          .then((res) => {
            if (res.retInfo == '操作成功') {
              location.reload()
            } else {
              this.$toast.fail('提交失败')
            }
          })
      }
    },
    showInventoryProblem(item, index) {
      if (item.type !== 'inventoryProblem' || item.relatedList.length === 0)
        return true
      let flag = 0
      if (item.relatedList.length < 2 || item.relatedWay !== 'and') {
        for (let i = 0; i < index; i++) {
          if (this.questionList[i].type === 'inventoryProblem') {
            item.relatedList.forEach((element) => {
              if (i === element.questionIndex) {
                element.optionIndex.forEach((jelement) => {
                  if (
                    this.questionList[i].value ===
                    this.questionList[i].options[jelement].label
                  ) {
                    flag = 1
                  }
                })
              }
            })
          }
        }
        return flag
      } else if (item.relatedWay === 'and') {
        for (let i = 0; i < index; i++) {
          if (this.questionList[i].type === 'inventoryProblem') {
            item.relatedList.forEach((element) => {
              if (i === element.questionIndex) {
                element.optionIndex.forEach((jelement) => {
                  if (
                    this.questionList[i].value ===
                    this.questionList[i].options[jelement].label
                  ) {
                    flag++
                  }
                })
              }
            })
          }
        }
        return flag === item.relatedList.length
      }
    },
    current_change(direction) {
      if (direction === 'up') {
        this.currentPage--
      } else {
        let flag = true
        this.$refs.form.forEach((element) => {
          element.validate((valid) => {
            if (valid) {
              flag = true
            } else {
              flag = false
            }
          })
        })
        if (!flag) {
          return
        }
        this.currentPage++
      }
      this.startQuestion = 0
      this.endQuestion = 0
      for (let i = 0; i < this.currentPage; i++) {
        if (i !== this.currentPage - 1) {
          this.startQuestion += this.pagesize[i]
        }
        this.endQuestion += this.pagesize[i]
      }
    },
    goToEvaluationResults() {
      this.$router.push({
        path: '/evaluationResults',
        query: {
          title: this.title,
          patientName: this.basicInformation.patientName,
          showModule: this.review.patientSide,
          questionnaireScoringList: JSON.stringify(
            this.review.questionnaireScoringList
          ),
          questionnaireResultList: JSON.stringify(
            this.review.questionnaireResultList
          ),
        },
      })
    },
  },
}
</script>

<style lang="scss" >
.medicalcarebox16 {
  .van-notice-bar--wrapable .van-notice-bar__content {
    margin: 0 auto;
  }
  .basicInformation {
    width: 100%;
    // height: 135px;
    padding: 3.7%;
    background: #1c97fc;
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      h3 {
        margin-block-start: 0px;
        margin-block-end: 5px;
        margin-inline-start: 0px;
        margin-inline-end: 20px;
        font-size: 16px;
        color: #ffffff;
        letter-spacing: 0.2px;
        > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        span {
          display: inline-block;
          font-size: 10px;
          color: #ffffff;
          letter-spacing: 0.13px;
          padding: 0 5px;
          border: 0.5px solid #fff;
          border-radius: 10px;
        }
      }
      p {
        font-size: 16px;
        color: #ffffff;
        letter-spacing: 0.2px;
      }
    }
    > p {
      span {
        margin-left: 20px;
      }
      line-height: 28px;
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 0.19px;
      opacity: 0.9;
    }
  }
  .frombox {
    .ignore {
      img {
        max-width: 100%;
        height: auto;
      }
      .select {
        width: 100%;
        border-radius: 5px;
        border: solid 1px #dcdfe6;
        height: 40px;
        padding: 0 10px;
        background-color: #fff;
        outline: 0;
      }

      .page-button {
        margin-top: 20px;
      }

      .questionTitle {
        font-size: 22px;
        text-align: center;
        margin-top: 20px;
      }

      .questionDescription {
        font-size: 14px;
        margin-top: 10px;
      }

      .question {
        .el-radio-group,
        .el-checkbox-group {
          display: flex;
          flex-direction: column;
        }

        .el-radio + .el-radio {
          margin-top: 10px;
          margin-left: 0;
        }

        .el-checkbox + .el-checkbox {
          margin-top: 10px;
          margin-left: 0;
        }

        .el-radio,
        .el-checkbox {
          width: 100%;
        }

        .el-form-item {
          display: flex;
          flex-direction: column;
        }
        .el-form-item__label {
          text-align: left;
        }
      }
    }
  }
  .vanRadio {
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 10px;
  }
}
</style>