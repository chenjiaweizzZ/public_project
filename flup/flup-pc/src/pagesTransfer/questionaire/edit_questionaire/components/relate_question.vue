<template>
  <div class="relate-question">
    <div v-for="(item,index) in relatedList" :key="index" class="margin10X">
      <el-row type="flex">
        <el-col class="flex-align-justify" :span="5">设置关联题{{index+1}}、</el-col>
        <el-col class="flex-align" :span="19">
          <el-select v-model="item.questionIndex" @focus="setOptionWidth" placeholder="请选择" @change="changeOption(item)" style="width: 80%">
            <el-option
              v-for="jitem in options(index)"
              :key="jitem.value"
              :label="jitem.label"
              :value="jitem.value"
              :disabled="jitem.disabled"
              :style="{width: selectOptionWidth}"
            ></el-option>
          </el-select>
          <i
            v-if="relatedList.length<options(index).length&&index===relatedList.length-1"
            class="el-icon-plus icon marginX10"
            title="新增关联题"
            @click="addRelate"
          ></i>
          <i
            v-if="index"
            class="el-icon-minus icon marginX10"
            title="删除关联题"
            @click="deleteRelate(index)"
          ></i>
        </el-col>
      </el-row>
      <el-row class="margin10X">
        <el-col :offset="5">
          <el-checkbox-group
            class="flex-column"
            v-if="item.questionIndex!==''"
            v-model="item.optionIndex"
          >
            <el-checkbox
              v-for="(jitem,jindex) in questionList[item.questionIndex].options"
              :key="jindex"
              :label="jindex">
              <div class="option" :title="jitem.label">{{jitem.label}}</div>
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
    </div>
    <el-row class="margin10X">
      <el-col :offset="5">
        <el-radio-group v-if="relatedList.length>=2" v-model="relatedWay">
          <el-radio label="and">与关系</el-radio>
          <el-radio label="or">或关系</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <span slot="footer" class="relateDialog flex-align-justify">
      <el-button @click="deleteRelated" v-if="haveRelated">删 除 关 联</el-button>
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'relate_question',
  props: ['questionList', 'relateIndex'],
  data() {
    return {
      haveRelated: '',
      relatedWay: 'and',
      relatedList: [{ questionIndex: '', optionIndex: [] }],
      selectOptionWidth: null
    }
  },
  computed: {
    options() {
      return function (index) {
        let options = []
        let count = 0
        for (let i = 0; i < this.relateIndex; i++) {
          if (
            'select|radio|checkbox|inventoryProblem'.includes(
              this.questionList[i].type
            )
          ) {
            options.push({
              value: i,
              label: `题${this.questionList[i].key}、${this.questionList[i].label}`,
              disabled: false,
            })
            for (let j = 0; j < this.relatedList.length; j++) {
              if (this.relatedList[j].questionIndex === i && j !== index) {
                options[count].disabled = true
              }
            }
            count++
          }
        }
        return options
      }
    },
  },
  created() {
    if (this.questionList[this.relateIndex].relatedList.length) {
      this.haveRelated = true
      this.relatedList = JSON.parse(
        JSON.stringify(this.questionList[this.relateIndex].relatedList)
      )
    }
    this.relatedWay = this.questionList[this.relateIndex].relatedWay
  },
  methods: {
    // 下拉框弹出时，设置弹框的宽度
    setOptionWidth(event){
      this.$nextTick(() => {
        this.selectOptionWidth = event.srcElement.offsetWidth + "px"
      })
    },
    //新增关联题
    addRelate() {
      this.relatedList.push({
        questionIndex: '',
        optionIndex: [],
        relatedWay: '',
      })
    },
    //删除关联题
    deleteRelate(index) {
      this.relatedList.splice(index, 1)
    },
    //删除已有关联
    deleteRelated() {
      this.$confirm('是否删除已有关联题?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$emit('deleteRelated', this.relateIndex)
          this.$message({
            showClose: true,
            message: '删除成功！',
            type: 'success',
          })
        })
        .catch(() => {})
    },
    //点击取消，关闭对话框
    onCancel() {
      this.$emit('close')
    },
    //点击确定
    onSubmit() {
      let submit = true
      if (
        this.relatedList.length === 1 &&
        this.relatedList[0].relateIndex === ''
      ) {
        this.$message({
          showClose: true,
          message: '请设置关联题！',
          type: 'warning',
        })
        return
      }
      this.relatedList.forEach((element) => {
        if (element.optionIndex.length === 0) {
          this.$message({
            showClose: true,
            message: '请为关联题设置选项！',
            type: 'warning',
          })
          submit = false
        }
      })
      if (submit) {
        this.$emit(
          'modifyRelate',
          this.relatedList,
          this.relateIndex,
          this.relatedWay
        )
        this.$message({
          showClose: true,
          message: '关联成功！',
          type: 'success',
        })
      }
    },
    changeOption(item) {
      if (item.optionIndex && item.optionIndex.length > 0) {
        item.optionIndex.splice(0, item.optionIndex.length)
      }
    },
  },
}
</script>
<style lang="scss">
/*关联题目对话框底部边框*/
.relateDialog {
  .dialog-footer {
    border-bottom: 0;
  }
}
.relate-question {
  .el-checkbox {
    display: flex;
    align-items: center;
    padding: 2px 0;

    .option {
      width: 28vw;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
<style scoped>
.icon {
  font-size: 18px;
  cursor: pointer;
}

.icon:hover {
  color: #00bc9c;
}
</style>
