<template>
  <div class="ignore tel-content flex-column-align paddingX20 padding-bottom20">
    <div class="questionTitle">{{title}}</div>
    <div class="questionDescription">{{description}}</div>
    <!-- 未提交问卷 -->
    <template v-if="state ==0">
      <div
        class="question flex-align-self-start"
        style="width:100%"
        v-for="(item,index) in questionList.slice(startQuestion,endQuestion+1)"
        :key="index">
        <el-form  v-if="item.type!=='addPage'" :model="item" ref="form">
          <el-form-item
            v-if="showInventoryProblem(item,index + startQuestion)"
            :label="item.key+'、'+item.label" prop="value"
            :required="item.required"
            :rules="[{required:item.required ,message: '请输入问题答案'}]">
            <el-input
              v-model="item.value"
              v-if="item.type==='input'"
              placeholder="请输入内容"></el-input>
            <el-input
              type="textarea"
              resize="none"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-if="item.type==='textarea'"
              v-model="item.value"></el-input>
            <select class="select" v-model="item.value" placeholder="请选择" v-if="item.type==='select'">
              <option value='' disabled selected style='display:none;'>请选择</option>
              <option
                v-for="item1 in item.options"
                :key="item1.label"
                :label="item1.label"
                :value="item1.label">{{item1.label}}
              </option>
            </select>
            <el-radio-group
              @change="getPoint(item,$event)"
              v-model="item.value"
              v-if="item.type==='inventoryProblem'">
              <el-radio
                v-for="item1 in item.options"
                :key="item1.label"
                :label="item1.label"
                :value="item1.label"
                border>
              </el-radio>
            </el-radio-group>
            <el-radio-group
              v-model="item.value"
              v-if="item.type==='radio'">
              <el-radio
                v-for="item1 in item.options"
                :key="item1.label"
                :label="item1.label"
                :value="item1.label"
                border>
              </el-radio>
              <el-radio
                @change="selectOther(item)"
                v-if="item.hasOtherOption"
                border>
                其它
              </el-radio>
              <el-input class="margin-top10" type="textarea" autosize placeholder="请输入" v-model="item.otherOption" v-if="item.hasOtherOption && item.value === undefined"></el-input>
            </el-radio-group>
            <el-checkbox-group v-model="item.value" v-if="item.type==='checkbox'">
              <el-checkbox
                v-for="item1 in item.options"
                :key="item1.label"
                border
                :label="item1.label">{{item1.label}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <el-row class="page-button flex-align-justify width100">
        <el-button
          type="primary"
          class="flex1"
          v-if="currentPage!==1"
          @click="current_change('up')">上一页
        </el-button>
        <el-button
          type="primary"
          class="flex1"
          v-if="currentPage!==pagesize.length"
          @click="current_change('down')">下一页
        </el-button>
        <el-button
          type="primary"
          class="flex1"
          v-if="currentPage===pagesize.length && !hideSubmit"
          @click="submit">提交
        </el-button>
      </el-row>
    </template>
    <!-- 已提交问卷 -->
    <template v-if="state == 1">
      <el-row class="width100 margin-top20" v-for="(item,index) in questionList" :key="index">
        <div>{{index + 1}}、{{item.label}}</div>
        <div class="padding-left20">{{item.value instanceof Array ? item.value.join('、') : item.value}}</div>
      </el-row>
    </template>
  </div>
</template>

<script>
  import 'element-ui/lib/theme-chalk/index.css';
  import {Row,Button,Form,FormItem,Input,RadioGroup,Radio,CheckboxGroup,Checkbox} from 'element-ui'
  export default {
    name: "tel_preview",
    components:{
      [Row.name]:Row,
      [Button.name]:Button,
      [Form.name]:Form,
      [FormItem.name]:FormItem,
      [Input.name]:Input,
      [RadioGroup.name]:RadioGroup,
      [Radio.name]:Radio,
      [CheckboxGroup.name]:CheckboxGroup,
      [Checkbox.name]:Checkbox,
    },
    props:{
      content:{
        type: String
      },
      hideSubmit: {
        type: Boolean,
        default: false
      },
      noAutoSave: {
        type: Boolean,
        default: false
      },
      state: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        isTel: true,
        currentPage: 1,//默认开始的页面
        pagesize: [],
        total: 0,//默认数据总数
        endQuestion: 0,
        startQuestion: 0,
        questionList: [],
        description: '',
        title: ''
      };
    },
    created() {
      let obj = JSON.parse(this.content)
      this.questionList = obj.questionList
      this.description = obj.description
      this.title = obj.title
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
      selectOther(item) {
        item.otherOption = ''
      },
      getPoint(obj, value) {
        if (obj.type === 'inventoryProblem') {
          obj.score = obj.options.find(element => {
            return element.label === value
          }).score
        }
      },
      ifAbnormal(element) {
        if('input|textarea'.indexOf(element.type) > -1) {
          return element.value !== '' && element.abnormal === true
        } else {
          let abnormal = false
          element.options.forEach(jelement => {
            if(jelement.label === element.value) {
              abnormal = true
            }
          })
          return abnormal
        }
      },
      submit() {
        this.questionList = this.questionList.filter(element => {
          return element.type !== 'addPage'
        })
        let questionList = this.questionList.map((element => {
          return {
            label: element.label,
            value: element.value || element.otherOption || '',
            point: (element.score || 0),
            abnormal: this.ifAbnormal(element),
          }
        }))
        let answer_content = {
          title: this.title,
          description: this.description,
          questionList
        }
        let flag = true
        this.$refs.form.forEach(element => {
          element.validate((valid) => {
            if (valid) {
              flag = true
            } else {
              flag = false
            }
          })
        })
        if (flag) {
          this.$emit('submit', JSON.stringify({
            master_id: this.$parent.query.master_id,
            target_ext_user_id: this.$parent.query.user_id,
            version_number: this.$parent.query.version_number,
            answer_content_json: JSON.stringify(answer_content),
            serial_no: this.$parent.query.serial_no,
            hospital_id: this.$parent.query.hospital_id,
            taskid:this.$parent.query.taskid
          }))
        }
      },
      showInventoryProblem(item, index) {
        if(item.type!=='inventoryProblem' || item.relatedList.length === 0)
          return true
        let flag = 0
        if (item.relatedList.length < 2 || item.relatedWay !== 'and') {
          for (let i = 0; i < index; i++) {
            if (this.questionList[i].type === 'inventoryProblem') {
              item.relatedList.forEach(element => {
                if(i === element.questionIndex) {
                  element.optionIndex.forEach(jelement => {
                    if(this.questionList[i].value === this.questionList[i].options[jelement].label) {
                      flag = 1
                    }
                  })
                }
              })
            }
          }
          return flag
        }
        else if (item.relatedWay === 'and') {
          for (let i = 0; i < index; i++) {
            if(this.questionList[i].type === 'inventoryProblem') {
              item.relatedList.forEach(element => {
                if(i === element.questionIndex) {
                  element.optionIndex.forEach(jelement => {
                    if(this.questionList[i].value === this.questionList[i].options[jelement].label) {
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
          this.currentPage--;
        } else {
          let flag = true
          this.$refs.form.forEach(element => {
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
      }
    }
  }
</script>

<style lang="scss" scoped>
/deep/.ignore{
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
    outline: 0
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
    .el-radio-group, .el-checkbox-group {
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

    .el-radio, .el-checkbox {
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
</style>
