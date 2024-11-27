<template>
  <div class="scoringRubricBox">
    <el-container>
      <el-aside width="170px" style="border: 1px dashed #ccc">
        <draggable
          class="mdc_left"
          v-model="originDataArr"
          :sort="false"
          :group="{ name:'assembly', pull:'clone' }"
          :clone="cloneItem"
        >
          <div v-for="(item,index) in originDataArr" :key="index">
            <span>{{item.name}}</span>
            <div v-if="item.type === 'select'">
              <el-select class="marginX20" v-model="item.defaultValue">
                <el-option
                  v-for="(jitem, index1) in item.value"
                  :key="index1"
                  :label="jitem.operatorName"
                  :value="jitem.operatorValue"
                ></el-option>
              </el-select>
            </div>
          </div>
        </draggable>
      </el-aside>
      <el-main class="paddingX20 padding0X">
        <el-row class="margin-bottom20 flex-align" :gutter="20">
          <el-col :span="6">
            <el-select v-model="computeType">
              <el-option
                v-for="item in computeTypeArr"
                :key="item.value"
                :value="item.value"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6" v-if="computeType !== 1">
            <el-select v-model="dimension">
              <el-option
                v-for="(item,index) in dimensionalList"
                :key="index"
                :value="item.serialNo"
                :label="item.dimension"
              ></el-option>
            </el-select>
          </el-col>
          <el-button type="text" @click="setDimensional">设置维度</el-button>
        </el-row>
        <div class="flex-align margin-bottom10" v-if="computeType === 1">
          <div class="margin-right20">总分得分规则</div>
          <el-button type="text" @click="edit">{{ isShow ? '取消' : '修改' }}</el-button>
          <el-button type="text" v-if="isShow" @click="save">保存</el-button>
          <el-button type="text" v-if="isShow" @click="deleteRubric" :disabled="isDisabled" class="delete">置空</el-button>
        </div>
        <div class="flex-align margin-bottom10" v-if="computeType !== 1 && dimension">
          <div class="margin-right20">维度{{ dimensionName }}分得分规则</div>
          <el-button type="text" @click="edit">{{ isShow ? '取消' : '修改' }}</el-button>
          <el-button type="text" v-if="isShow" @click="save">保存</el-button>
          <el-button type="text" v-if="isShow" @click="deleteRubric" :disabled="isDisabled" class="delete">置空</el-button>
        </div>
        <el-card class="box-card" v-if="isShow">
          <div class="flex-align margin-bottom20">
            <el-radio-group v-model="isSystem" size="small">
              <el-radio :label="0" border>自定义</el-radio>
              <el-radio :label="1" border v-if="computeType === 1">设置总分为所有题目得分加和</el-radio>
              <el-radio :label="1" border v-else>设置维度总分为所有维度题目得分加和</el-radio>
            </el-radio-group>
          </div>
          <div v-if="isSystem === 0" class="rubric-tip">PS:运算符是乘号或除号时，控件后面不要放具体的题目（除非该题目的选项中无0分的选项），否则患者端会报错</div>
          <div v-if="isSystem === 0">
            <draggable
              class="mdc_right"
              v-model="newDataArr"
              :group="{ name:'assembly' }"
              @end="rightEnd"
            >
              <el-col
                :span="4"
                v-for="(item,index) in newDataArr"
                :key="index"
                style="height: 40px"
              >
                <div v-if="item.type === 'select'" class="margin-right10 margin-bottom10">
                  <el-select v-model="item.defaultValue">
                    <el-option
                      v-for="(jitem, index1) in item.value"
                      :key="index1"
                      :label="jitem.operatorName"
                      :value="jitem.operatorValue"
                    ></el-option>
                  </el-select>
                </div>
                <div v-else-if="item.type === 'input'" class="margin-right10 margin-bottom10">
                  <el-input
                    v-model="item.defaultValue"
                    @blur="handlerBlur(item.defaultValue, index)"
                    @keyup.native="item.defaultValue=$utils.onlyNumOnePoint(item.defaultValue)"
                  ></el-input>
                </div>
              </el-col>
            </draggable>
            <div class="show-rule" v-if="newDataArr.length">
              <div>计算公式：</div>
              <span>{{ description }}</span>
            </div>
          </div>
          <div v-else>
            <div v-if="computeType === 1">总分= 所有题目得分加和</div>
            <div v-else>{{ dimensionName }}总分= 所有维度题目得分加和</div>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import { draggableTypeArr, computeTypeArr } from '../constant/enum'
export default {
  name: 'ScoringRubric',
  components: { draggable },
  props: ['dimensional', 'scoringRules', 'questionList', 'dimensionalList', 'predictList'],
  data() {
    return {
      originDataArr: new Array(),
      newDataArr: new Array(),
      computeTypeArr,
      computeType: 1,
      dimension: '0',
      isSystem: 0,
      isShow: false,
      isDisabled: false
    }
  },
  watch: {
    // 根据选择维度处理可选题目
    dimension(val) {
      if (val !== '0' && val) {
        this.isShow = false
        if (!this.dimensionalList.filter((i) => i.serialNo === val)[0].keyId) {
          this.$message({
            message: `请为${this.dimensionName}维度绑定题目`,
            type: 'warning',
          })
          this.originDataArr.forEach((el) => {
            if (el.name === '题目') {
              el.value = []
              el.defaultValue = ''
            }
          })
          return
        }
        let subjectArr = this.dimensionalList
          .filter((i) => i.serialNo === val)[0]
          .keyId.split(',')
        let formatSubjectArr = []
        subjectArr.forEach((el) => {
          formatSubjectArr.push({
            operatorName: `题目${el}`,
            operatorValue: el,
          })
        })
        this.originDataArr.forEach((el) => {
          if (el.name === '题目') {
            el.value = formatSubjectArr
            el.defaultValue = formatSubjectArr[0].operatorValue
          }
        })
        this.scoringRules.forEach((el) => {
          if (el.dimensionId == val) {
            el.mathematicalFormula.forEach(i => {
              if (i.name === '题目') {
                i.value = formatSubjectArr
              }
            })
          }
        })
      }
    },
    // 得分为总分时，处理题目、维度置空
    computeType(val) {
      this.isShow = false
      if (val === 1) {
        this.initData()
        this.dimension = '0'
      } else {
        this.dimension = null
      }
    },
    // 题目发生变化时处理题目
    questionList: {
      handler() {
        this.initData()
      },
      deep: true,
    },
  },
  computed: {
    // 计算公式的详细描述
    description() {
      let description = ''
      this.newDataArr.forEach((el) => {
        description +=
          el.name === '题目' ? el.name + el.defaultValue : el.defaultValue
      })
      return description
    },
    // 根据维度ID显示维度名称
    dimensionName() {
      return this.dimensionalList.filter(
        (i) => i.serialNo === this.dimension
      )[0].dimension
    }
  },
  mounted() {
    console.log('dimensionalList', this.dimensionalList)
    console.log('questionList', this.questionList)
    console.log('scoringRules', this.scoringRules)
    console.log('predictList', this.predictList)
    this.initData()
  },
  methods: {
    // 置空已保存的得分规则
    deleteRubric() {
      let isDelete = true
      this.predictList.forEach(el => {
        el.queryList.forEach(i => {
          if (i.project === this.dimension) {
            isDelete = false
          }
        })
      })
      if (isDelete) {
        let index = this.scoringRules.findIndex(i => i.dimensionId === this.dimension)
        this.scoringRules.splice(index, 1)
        this.isSystem = 0
        this.newDataArr = []
        this.isDisabled = true
        this.$message.success('操作成功')
      } else {
        this.$message.warning('请先在测评结果里删除使用到该项目的数据！')
      }
    },
    setDimensional() {
      this.isShow = false
      if(this.dimension !== '0') this.dimension = null
      this.$emit('update:dimensional',true)
    },
    // 数值输入框输入0或者(数字.)时置空
    handlerBlur(value, index) {
      if (value === '0' || value.substr(value.length-1,1) === '.') {
        this.$set(this.newDataArr[index], 'defaultValue', '')
        this.$message.warning('请输入合法数值')
      } 
    },
    // 点击修改
    edit() {
      this.isShow = !this.isShow
      let editType = this.scoringRules.filter(
        (i) => i.dimensionId === this.dimension
      )
      if (editType.length) {
        this.newDataArr = editType[0].mathematicalFormula
        this.isSystem = editType[0].isSystem
        this.isDisabled = false
      } else {
        this.newDataArr = []
        this.isSystem = 0
        this.isDisabled = true
      }
    },
    // 点击保存
    save() {
      if (!this.newDataArr.length && this.isSystem === 0) {
        this.$message.warning('请编辑公式后再进行保存')
        return
      }
      let formulaStr = ''
      this.newDataArr.forEach((el) => {
        formulaStr += el.defaultValue
      })
      if (!this.$utils.checkFormula(formulaStr, this.newDataArr) && this.isSystem === 0) {
        this.$message.error('公式错误')
        return
      }
      if (
        this.scoringRules.filter((i) => i.dimensionId === this.dimension).length
      ) {
        this.scoringRules.forEach((el) => {
          if (el.dimensionId === this.dimension) {
            el.isDelete = 0
            el.isSystem = this.isSystem
            ;(el.description =
              this.isSystem === 0 ? this.description : (this.computeType === 1 ? '总分= 所有题目得分加和' : '总分= 所有维度题目得分加和')),
              (el.mathematicalFormula =
                this.isSystem === 0 ? this.newDataArr : [])
          }
        })
      } else {
        this.scoringRules.push({
          isDelete: 0,
          serialNo: '',
          dimensionId: this.computeType === 1 ? '0' : this.dimension,
          questionnaireId: '',
          isSystem: this.isSystem,
          description: this.isSystem === 0 ? this.description : (this.computeType === 1 ? '总分= 所有题目得分加和' : '总分= 所有维度题目得分加和'),
          mathematicalFormula: this.isSystem === 0 ? this.newDataArr : [],
        })
      }
      this.$message.success('保存成功')
      this.isShow = !this.isShow
      console.log('scoringRules', this.scoringRules)
    },
    // 初始化数据
    initData() {
      this.originDataArr = draggableTypeArr
      if (!this.questionList.length) {
        return
      }
      let subjectArr = this.questionList.filter(
        (i) => i.type == 'inventoryProblem'
      )
      let formatSubjectArr = []
      subjectArr.forEach((el) => {
        formatSubjectArr.push({
          operatorName: `题目${el.key}`,
          operatorValue: String(el.key),
        })
      })
      this.originDataArr.forEach((el) => {
        if (el.name === '题目') {
          el.value = formatSubjectArr
          el.defaultValue = formatSubjectArr[0].operatorValue
        }
      })
      this.newDataArr.forEach((el) => {
        if (el.name === '题目') {
          el.value = formatSubjectArr
        }
      })
    },
    // 深复制一个节点
    cloneItem(val) {
      return JSON.parse(JSON.stringify(val))
    },
    // 从右往左拖动数据不改变左侧数据
    rightEnd() {
      this.originDataArr = draggableTypeArr.concat()
    }
  },
}
</script>
<style lang="scss" scoped>
.scoringRubricBox {
  .mdc_left > div {
    padding: 10px 0;
    margin-top: 6px;
    border: 1px solid #cccccc;
    cursor: move;
    margin: 20px;
    text-align: center;
  }

  .mdc_left > div:hover {
    box-shadow: 1px 2px 4px #cccccc;
  }

  .mdc_right {
    min-height: 160px;
    display: flex;
    flex-wrap: wrap;
    border: 1px dashed #ccc;
    padding: 10px 10px 0;
  }

  .mdc_right > div:hover {
    box-shadow: 1px 2px 4px #cccccc;
  }

  .show-rule {
    display: flex;
    margin-top: 10px;
    span {
      padding-left: 5px;
    }
  }

  .rubric-tip {
    margin-bottom: 10px;
    color: red;
    font-weight: 600;
    font-size: 12px;
  }

  .delete {
    color: #f56c6c;
  }

  .delete:hover {
    border-bottom: 0;
  }
}
</style>