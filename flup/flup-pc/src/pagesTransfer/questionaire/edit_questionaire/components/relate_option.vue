<template>
  <div class="relate-option">
    <el-table :data="optionList">
      <el-table-column show-overflow-tooltip width="200" label="选项">
        <template slot-scope="scope">{{scope.row.label}}</template>
      </el-table-column>
      <el-table-column width="300" label="跳转题目">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="scope.row.optionRelated==undefined"
            @click="toRelate(scope.row)"
          >添加关联</el-button>

          <div v-else>
            <el-row type="margin10X">
              <el-col>
                <el-select
                  v-model="scope.row.optionRelated.questionIndex"
                  clearable
                  placeholder="请选择"
                  @focus="setOptionWidth"
                  @change="changeOption(scope.row,scope.row.optionRelated.questionIndex)"
                >
                  <el-option
                    v-for="jitem in relatedQuestion"
                    :key="jitem.value"
                    :label="jitem.label"
                    :value="jitem.value"
                    :disabled="jitem.disabled"
                    :style="{width: selectOptionWidth}"
                  ></el-option>
                </el-select>
              </el-col>
            </el-row>
            <el-row class="margin10X">
              <el-col :offset="2">
                <el-checkbox-group
                  class="flex-column"
                  v-if="scope.row.optionRelated.questionIndex!==''"
                  v-model="scope.row.optionRelated.optionIndex"
                >
                  <el-checkbox
                    v-for="(jitem,jindex) in questionList[scope.row.optionRelated.questionIndex].options"
                    :key="jindex"
                    :label="jindex">
                    <div class="option" :title="jitem.label">{{jitem.label}}</div>
                  </el-checkbox>
                </el-checkbox-group>
              </el-col>
            </el-row>
            <el-row class="flex">
              <!-- {{relatedQuestion[scope.row.optionRelated.questionIndex].type}} -->
              <el-col
                v-if="relatedQuestion[scope.row.optionRelated.questionIndex]"
                class="flex-align"
              >
                <el-radio-group v-model="scope.row.optionRelated.relatedWay">
                  <el-radio
                    :disabled="relatedQuestion[scope.row.optionRelated.questionIndex]?relatedQuestion[scope.row.optionRelated.questionIndex].type !='checkbox':false "
                    label="and"
                  >选中全部</el-radio>
                  <el-radio label="or">选中其中一个</el-radio>
                </el-radio-group>
              </el-col>
            </el-row>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="relateDialog flex-align-justify" style="margin-top:20px">
      <el-button @click="deleteRelated">删 除 关 联</el-button>
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </span>
  </div>
</template>

<script>
import Template from '../../preview/template.vue'
export default {
  name: 'relate_option',
  props: ['questionList', 'relateIndex'],
  data() {
    return {
      optionList: JSON.parse(
        JSON.stringify(this.questionList[this.relateIndex].options)
      ),
      relatedQuestion: [],
      selectOptionWidth: null
    }
  },
  computed: {},
  created() {
    this.getRelateQues()
  },
  methods: {
    // 下拉框弹出时，设置弹框的宽度
    setOptionWidth(event){
      this.$nextTick(() => {
        this.selectOptionWidth = event.srcElement.offsetWidth + "px"
      })
    },
    toRelate(item) {
      if (item.optionRelated == undefined) {
        let obj = {
          questionIndex: '',
          optionIndex: [],
          relatedWay: 'or',
        }
        this.$set(item, 'optionRelated', obj)
      }
    },
    getRelateQues() {
      for (let i = 0; i < this.relateIndex; i++) {
        if (
          'select|radio|checkbox|inventoryProblem'.includes(
            this.questionList[i].type
          )
        ) {
          this.relatedQuestion.push({
            value: i,
            label: `题${this.questionList[i].key}、${this.questionList[i].label}`,
            disabled: false,
            type: this.questionList[i].type,
          })
        }
      }
    },
    changeOption(item, val) {
      if (val === '') {
        this.$set(item, 'optionRelated', undefined)
      }
    },
    onCancel() {
      this.$emit('close')
    },
    onSubmit() {
      let a = this.optionList
      let submit = false
      try {
        this.optionList.forEach((element) => {
          if (element.optionRelated) {
            if (
              element.optionRelated.questionIndex !== undefined &&
              element.optionRelated.questionIndex !== '' &&
              element.optionRelated.optionIndex.length == 0
            ) {
              this.$message({
                showClose: true,
                message: '请设置关联题目选项！',
                type: 'warning',
              })
              throw new Error('')
            } else if (
              element.optionRelated.questionIndex !== undefined &&
              element.optionRelated.questionIndex !== '' &&
              element.optionRelated.optionIndex.length > 0
            ) {
              submit = true
            }
          }
        })
      } catch (e) {
        return
      }

      // if (submit) {
      this.$emit('modifyOptionRelate', this.relateIndex, this.optionList)
      this.$message({
        showClose: true,
        message: '关联成功！',
        type: 'success',
      })
      // } else {
      //   this.$message({
      //     showClose: true,
      //     message: '请设置关联题目！',
      //     type: 'warning',
      //   })
      // }
    },
    deleteRelated() {
      this.$confirm('是否删除已有关联题?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.optionList.forEach((item) => {
            item.optionRelated = undefined
          })

          this.$emit('modifyOptionRelate', this.relateIndex, this.optionList)
          this.$message({
            showClose: true,
            message: '删除成功！',
            type: 'success',
          })
        })
        .catch(() => {})
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
.relate-option {
  .el-checkbox {
    display: flex;
    align-items: center;
    padding: 2px 0;

    .option {
      width: 240px;
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
