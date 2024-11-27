<template>
  <div class="ignore tel-content flex-column-align paddingX20 padding-bottom20">
    <el-button
      class="evaluatingBut"
      v-if="review&&review.answerTime&&review.evaluationEnabled==1&&$route.name == 'healtharchives'"
      :disabled="JSON.parse(review.patientSide).length == 0"
      type="info"
      @click="isShowEvaluating"
    >评测结果</el-button>
    <div class="questionTitle">{{ title }}</div>
    <div class="questionDescription">{{ description }}</div>
    <template v-if="state == 0">
      <div
        class="question flex-align-self-start"
        style="width:100%"
        v-for="(item, index) in questionList.slice(
          startQuestion,
          endQuestion + 1
        )"
        :key="index"
      >
        <el-form v-if="item.type !== 'addPage'" :model="item" ref="form">
          <el-form-item
            v-if="showInventoryProblem(item, index + startQuestion)"
            :label="item.key + '、' + item.label"
            prop="value"
            :required="item.required"
            :rules="[{ required: item.required, message: '请输入问题答案' }]"
          >
            <el-input v-model="item.value" v-if="item.type === 'input'" placeholder="请输入内容" maxlength="50" show-word-limit></el-input>
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
            <select class="select" v-model="item.value" placeholder="请选择" v-if="item.type === 'select'">
              <option value disabled selected style="display:none;">请选择</option>
              <option v-for="item1 in  showOptions(item)" :key="item1.label" :label="item1.label" :value="item1.label">{{ item1.label }}</option>
            </select>

            <el-radio-group @change="getPoint(item, $event)" v-model="item.value" v-if="item.type === 'inventoryProblem'&& !item.multiple">
              <el-radio v-for="item1 in  showOptions(item)" :key="item1.label" :label="item1.label" :value="item1.label" border></el-radio>
            </el-radio-group>
            <el-checkbox-group @change="getPoint(item, $event)" v-model="item.value" v-if="item.type === 'inventoryProblem'&&item.multiple">
              <el-checkbox v-for="item1 in  showOptions(item)" :key="item1.label" border :label="item1.label">{{ item1.label }}</el-checkbox>
            </el-checkbox-group>
            <el-radio-group v-model="item.value" v-if="item.type === 'radio'" @change="item.otherOption =''">
              <template v-for="item1 in showOptions(item)">
                <div class="margin3" :key="item1.label">
                  <el-radio class="margin-bottom2" :label="item1.label" :value="item1.label" border></el-radio>
                  <el-input
                    type="textarea"
                    resize="none"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    v-if="item.value == item1.label&&item1.supplement"
                    class="margin-bottom5"
                    placeholder="请输入补充说明"
                    v-model="item.otherOption"
                    maxlength="200"
                    show-word-limit
                  ></el-input>
                </div>
              </template>
              <el-radio @change="selectOther(item)" v-if="item.hasOtherOption" border>其它</el-radio>
              <el-input class="margin-top10" type="textarea" autosize placeholder="请输入" v-model="item.otherOption" v-if="item.hasOtherOption && item.value === undefined"></el-input>
            </el-radio-group>
            <!-- 引用题 -->
            <el-radio-group v-model="item.value" v-if="item.type === 'refProblem'">
              <el-radio v-for="jitem in getRefOptions(item)" :key="jitem.key" :value="jitem.value" :label="jitem.label" border></el-radio>
            </el-radio-group>
            <el-checkbox-group v-model="item.value" v-if="item.type === 'checkbox'">
              <el-checkbox v-for="item1 in  showOptions(item)" :key="item1.label" border :label="item1.label">{{ item1.label }}</el-checkbox>
            </el-checkbox-group>
            <div v-if="item.type === 'datePickerinput'" class="datePickerinput">
              <!-- <p>日期</p> -->
              <el-input v-model="item.value[0]" maxlength="4"></el-input>
              <p>年</p>
              <el-input v-model="item.value[1]" maxlength="2"></el-input>
              <p>月</p>
              <el-input v-model="item.value[2]" maxlength="2"></el-input>
              <p>日</p>
            </div>
            <div class="datePickerinput" v-if="item.type === 'datePicker'">
              <!-- <p>日期</p> -->
              <el-date-picker v-model="item.value" type="date" placeholder="选择日期"></el-date-picker>
            </div>
            <div class="datePickerinput" v-if="item.type === 'image'">
              <!-- <p>图片</p> -->
              <uploadImage :imgList.sync="item.value" :isPreview="true"></uploadImage>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <el-row class="page-button flex-align-justify width100">
        <el-button type="primary" class="flex1" v-if="currentPage !== 1" @click="current_change('up')">上一页</el-button>
        <el-button type="primary" class="flex1" v-if="currentPage !== pagesize.length && conceal" @click="current_change('down')">下一页</el-button>

        <!-- <el-button
          type="primary"
          class="flex1"
          v-if="currentPage===pagesize.length && !hideSubmit"
          @click="submit">提交
        </el-button>-->

        <div v-if="!conceal" class="nonexistenceData">一条记录都没有</div>
      </el-row>
    </template>
    <template v-if="state == 1">
      <el-row class="width100 margin-top20" v-for="(item, index) in questionList" :key="index">
        <div>
          {{ index + 1 }}、{{ item.label }}
          <span style="color:#ff0000" v-if="item.abnormal">(异常)</span>
        </div>
        <div v-if="item.value instanceof Array" class="padding-left20">
          <p style="margin-bottom: 10px;" v-for="(item, index) in item.value" :key="index">{{item}}</p>
        </div>
        <div class="padding-left20" v-else>{{item.value}}</div>
      </el-row>
    </template>

    <div v-if="isEvaluating" class="evaluatingBox">
      <div class="evaluating">
        <div class="title">
          <h3>患者{{$route.query.name}}{{title}}得分结果如下</h3>
          <i class="el-icon-close" @click="isEvaluating=false"></i>
        </div>
        <div class="main">
          <el-table v-if="questionnaireScoringList.length" :data="questionnaireScoringList" border style="width: 100%" max-height="300">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="dimensionName" label="维度名称"></el-table-column>
            <el-table-column prop="scoring" label="分数" width="120"></el-table-column>
          </el-table>
          <!-- <div v-if="JSON.parse(review.patientSide).indexOf('score') !=-1" class="totalPointsBox">
            <span>总分：</span>
            {{totalPoints.scoring}}
          </div>-->
          <div v-if="JSON.parse(review.patientSide).indexOf('result') !=-1" class="resultBox">
            <p v-for="(item, index) in review.questionnaireResultList" :key="index">
              <span>
                评测结果{{review.questionnaireResultList.length ==1 ?'':index+1}}
                <span style="font-size: 14px;color: #999">(由【 {{item.dimensionList}}】得出)</span>：
              </span>
              {{item.description}}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-chalk/index.css';
import { Row, Button, Form, FormItem, Input, RadioGroup, Radio, CheckboxGroup, Checkbox, DatePicker } from 'element-ui';
import uploadImage from "@/pagesTransfer/questionaire/edit_questionaire/components/uploadImage.vue"
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
    [DatePicker.name]: DatePicker,
    uploadImage
  },
  props: {
    content: {
      type: String,
    },
    hideSubmit: {
      type: Boolean,
      default: false,
    },
    noAutoSave: {
      type: Boolean,
      default: false,
    },
    state: {
      type: Number,
      default: 0,
    },
    review: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      isTel: true,
      currentPage: 1, //默认开始的页面
      pagesize: [],
      total: 0, //默认数据总数
      endQuestion: 0,
      startQuestion: 0,
      questionList: [],
      description: '',
      title: '',
      conceal: true,
      obj: null,
      isEvaluating: false,
      questionnaireScoringList: [],
      totalPoints: {},
    };
  },
  created() {
    console.log(this.review);
    console.log(this.$route.query);
    let obj;
    if (this.isJSON(this.content)) {
      obj = JSON.parse(this.content);
    }
    if (!obj) {
      this.conceal = false;
      return;
    }
    if (typeof obj == 'string') {
      obj = JSON.parse(obj);
    }

    if (this.review) {
      this.questionnaireScoringList = this.review.questionnaireScoringList.filter((element) => {
        if (JSON.parse(this.review.patientSide).indexOf('dimension') != -1) {
          return element;
        } else if (JSON.parse(this.review.patientSide).indexOf('score') != -1) {
          return element;
        }
      });
    }

    this.obj = obj;
    this.questionList = obj.questionList || obj.questionListNew;
    this.description = obj.description;
    this.title = obj.title;
    this.total = this.questionList.length;
    for (let i = 0, count = 0; i < this.total; i++, count++) {
      if (this.questionList[i].type === 'addPage' || i === this.total - 1) {
        if (this.pagesize.length === 0) {
          this.endQuestion = count;
        }
        this.pagesize.push(count);
        count = 0;
      }
    }
  },
  methods: {
    isShowEvaluating() {
      this.isEvaluating = true;
    },
    selectOther(item) {
      item.otherOption = '';
    },
    getPoint(obj, value) {
      if (obj.type === 'inventoryProblem' && !obj.multiple) {
        obj.score = obj.options.find((element) => {
          return element.label === value;
        }).score;
      } else {
        obj.score = 0;
        obj.options.forEach((element) => {
          value.forEach((item) => {
            if (element.label === item) {
              obj.score += element.score;
            }
          });
        });
      }
    },
    ifAbnormal(element) {
      if ('input|textarea|datePicker'.indexOf(element.type) > -1) {
        return element.value != '' && element.abnormal == true;
      } else if ('datePickerinput' == element.type) {
        return element.value != '' && element.abnormal == true && element.value.length == 3;
      } else {
        let op = element.options.filter((x) => x.label == element.value);
        // return op[0].abnormal
        let abnormal = false;
        for (let i in element.options) {
          if (Array.isArray(element.value)) {
            for (let j in element.value) {
              if (element.options[i].label == element.value[j]) {
                abnormal = element.options[i].abnormal;
              }
              if (abnormal) {
                return abnormal;
              }
            }
          } else {
            if (element.options[i].label == element.value) {
              abnormal = element.options[i].abnormal;
            }
          }
          if (abnormal) {
            return abnormal;
          }
        }
        // element.options.forEach((jelement) => {
        //   if (jelement.label === element.value) {
        //     abnormal = jelement.abnormal
        //   }
        //   if (abnormal) {
        //     return abnormal
        //   }
        // })
        return abnormal;
      }
    },
    getAnswerContent() {
      let flag = true;
      for (let i in this.$refs.form) {
        this.$refs.form[i].validate((valid) => {
          if (valid) {
            flag = true;
          } else {
            flag = false;
            return;
          }
        });
        if (!flag) {
          return;
        }
      }
      // this.$refs.form.forEach((element) => {
      //   element.validate((valid) => {
      //     if (valid) {
      //       flag = true
      //     } else {
      //       flag = false
      //       return
      //     }
      //   })
      // })
      this.questionList = this.questionList.filter((element) => {
        return element.type !== 'addPage';
      });
      let questionList = this.questionList.map((element) => {
        return {
          label: element.label,
          value: element.value && element.otherOption ? element.value + ',' + element.otherOption : element.value || element.otherOption || '',
          point: element.score || 0,
          abnormal: this.ifAbnormal(element),
          key: element.key,
        };
      });
      if (flag) {
        return {
          title: this.title,
          description: this.description,
          questionList,
        };
      }
    },
    submit() {
      this.questionList = this.questionList.filter((element) => {
        return element.type !== 'addPage';
      });

      let questionList = this.questionList.map((element) => {
        return {
          label: element.label,
          value: element.value && element.otherOption ? element.value + ',' + element.otherOption : element.value || element.otherOption || '',
          point: element.score || 0,
          abnormal: this.ifAbnormal(element),
          key: element.key,
        };
      });
      let answer_content = {
        title: this.title,
        description: this.description,
        questionList,
      };
      let flag = true;
      this.$refs.form.forEach((element) => {
        element.validate((valid) => {
          if (valid) {
            flag = true;
          } else {
            flag = false;
          }
        });
      });
      if (flag) {
        this.$emit(
          'submit',
          JSON.stringify({
            master_id: this.$parent.query.master_id,
            target_ext_user_id: this.$parent.query.user_id,
            version_number: this.$parent.query.version_number,
            answer_content_json: JSON.stringify(answer_content),
            serial_no: this.$parent.query.serial_no,
            hospital_id: this.$parent.query.hospital_id,
            taskid: this.$parent.query.taskid,
          })
        );
      }
    },
    showInventoryProblem(item, index) {
      if (!item.relatedList || item.relatedList.length === 0) return true;
      let flag = 0;
      if (item.relatedList.length < 2 || item.relatedWay !== 'and') {
        for (let i = 0; i < index; i++) {
          // if (this.questionList[i].type === 'inventoryProblem') {
          item.relatedList.forEach((element) => {
            if (i === element.questionIndex) {
              element.optionIndex.forEach((jelement) => {
                if (this.questionList[i].type == 'checkbox') {
                  this.questionList[i].value.forEach((zelement) => {
                    if (zelement === this.questionList[i].options[jelement].label) {
                      flag = 1;
                    }
                  });
                } else {
                  if (this.questionList[i].value === this.questionList[i].options[jelement].label) {
                    flag = 1;
                  }
                }
              });
            }
          });
          // }
        }
        return flag;
      } else if (item.relatedWay === 'and') {
        for (let i = 0; i < index; i++) {
          // if (this.questionList[i].type === 'inventoryProblem') {
          item.relatedList.forEach((element) => {
            if (i === element.questionIndex) {
              element.optionIndex.forEach((jelement) => {
                if (this.questionList[i].type == 'checkbox') {
                  this.questionList[i].value.forEach((zelement) => {
                    if (zelement === this.questionList[i].options[jelement].label) {
                      flag++;
                    }
                  });
                } else {
                  if (this.questionList[i].value === this.questionList[i].options[jelement].label) {
                    flag++;
                  }
                }
              });
            }
          });
          // }
        }
        return flag === item.relatedList.length;
      }
    },
    current_change(direction) {
      if (direction === 'up') {
        this.currentPage--;
      } else {
        let flag = true;
        this.$refs.form.forEach((element) => {
          element.validate((valid) => {
            if (valid) {
              flag = true;
            } else {
              flag = false;
            }
          });
        });
        if (!flag) {
          return;
        }
        this.currentPage++;
      }
      this.startQuestion = 0;
      this.endQuestion = 0;
      for (let i = 0; i < this.currentPage; i++) {
        if (i !== this.currentPage - 1) {
          this.startQuestion += this.pagesize[i];
        }
        this.endQuestion += this.pagesize[i];
      }
    },
    //判断字符串是否为JSON
    isJSON(str) {
      try {
        if (typeof JSON.parse(str) == 'object') {
          return true;
        }
      } catch (e) {}
      return false;
    },
    getRefOptions(item) {
      let options = [];
      let mul = this.questionList[item.refOption - 1].value;
      if (mul) {
        mul.forEach((i) => {
          options.push({ key: i, value: i, label: i });
        });
      }
      return options;
    },
    showOptions(item) {
      let options = [];
      item.options.forEach((element) => {
        let flag = 0;
        //添加选项关联且选项大于1
        if (element.optionRelated && element.optionRelated.optionIndex.length > 0) {
          element.optionRelated.optionIndex.forEach((jelement) => {
            //多选框的value是Array
            if (this.questionList[element.optionRelated.questionIndex].type == 'checkbox') {
              this.questionList[element.optionRelated.questionIndex].value.forEach((zelement) => {
                if (zelement === this.questionList[element.optionRelated.questionIndex].options[jelement].label) {
                  flag++;
                }
              });
            } else {
              if (this.questionList[element.optionRelated.questionIndex].value === this.questionList[element.optionRelated.questionIndex].options[jelement].label) {
                flag++;
              }
            }

            //如果是and类型。全部选择方可添加options
            if (element.optionRelated.relatedWay == 'and') {
              if (flag == element.optionRelated.optionIndex.length) {
                if (options.findIndex((item) => item == element) == -1) {
                  options.push(element);
                }
              }
            } else {
              //如果是or类型，满足其中一个方可添加options
              if (flag > 0) {
                if (options.findIndex((item) => item == element) == -1) {
                  options.push(element);
                }
              }
            }
          });
        } else {
          //选项未被关联
          options.push(element);
        }
      });
      let showRequire = item.oriRequired == undefined ? item.required : item.oriRequired;
      if (options.length == 0) {
        item.oriRequired = showRequire;
        item.required = false;
      } else {
        item.required = showRequire;
      }
      return options;
    },
  },
};
</script>

<style lang="scss" scoped>
.datePickerinput {
  display: flex;
  align-items: center;
  justify-content: space-between;
  p {
    margin: 0 10px;
    white-space: nowrap;
  }
}
/deep/.ignore {
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
      height: max-content;
    }

    .el-form-item {
      display: flex;
      flex-direction: column;
    }
    .el-form-item__label {
      text-align: left;
    }
    .el-radio {
      padding-bottom: 8px;
    }
    .el-checkbox__label,
    .el-radio__label {
      word-break: break-all;
      overflow-wrap: break-word;
      white-space: break-spaces;
    }
  }
}

.evaluatingBut {
  position: absolute;
  top: 130px;
  right: 0;
}

.evaluatingBox {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
  .evaluating {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 500px;
    border-radius: 5px;
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #bbb;
    .title {
      padding: 15px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      i {
        font-size: 20px;
        cursor: pointer;
      }
      border-bottom: 1px solid #bbb;
    }
  }
  .main {
    height: 439px;
    padding: 20px;
    overflow-y: scroll;
  }
  .totalPointsBox {
    padding: 10px;
    // text-align: right;
    span {
      font-size: 16px;
    }
  }
  p {
    padding: 5px 0;
    span {
      font-size: 16px;
    }
  }
  .resultBox {
    padding-top: 10px;
    span {
      font-weight: 900;
    }
    p {
      padding: 5px 0;
      line-height: 1.5;
    }
  }
}
</style>
