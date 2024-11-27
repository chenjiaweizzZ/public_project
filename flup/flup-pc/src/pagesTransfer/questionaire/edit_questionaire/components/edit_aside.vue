<template>
  <div class="flex-column-align aside">
    <el-row class="margin20X flex-align-justify" type="flex">
      <el-upload
        class="inline-block"
        :show-file-list="false"
        :before-upload="importTemplate"
        action="/"
      >
        <el-button class="marginX10" type="primary">导入模板</el-button>
      </el-upload>
      <el-button class="marginX10" type="primary" @click="exportTemplate">导出模板</el-button>
    </el-row>
    <div class="edit-questionaire-aside flex-column-align">
      <el-button
        v-for="item in questionTypeList"
        :key="item.type"
        @click="addQuestion(item.type)"
        :icon="item.icon"
      >{{item.label}}</el-button>
    </div>
    <div class="butBox">
      <el-button @click="setDimensional">设置维度</el-button>
      <el-button @click="setScoringRubric">设置得分规则</el-button>
      <el-button @click="setResult">设置测评结果</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'edit-questionaire-aside',
  data() {
    return {
      totalQuestionList: [],
      questionTypeList: [
        { type: 'input', icon: 'el-icon-document-remove', label: '单行文本框' },
        { type: 'textarea', icon: 'el-icon-document', label: '多行文本框' },
        { type: 'select', icon: 'el-icon-arrow-down', label: '下拉框' },
        { type: 'radio', icon: 'el-icon-remove-outline', label: '单选框' },
        { type: 'checkbox', icon: 'el-icon-circle-check', label: '多选框' },
        { type: 'inventoryProblem', icon: 'el-icon-share', label: '量表题' },
        { type: 'refProblem', icon: 'el-icon-connection', label: '引用题' },
        { type: 'addPage', icon: 'el-icon-document-copy', label: '分页' },
        { type: 'datePickerinput', icon: 'el-icon-date', label: '日期输入框' },
        { type: 'datePicker', icon: 'el-icon-date', label: '日期控件' },
        { type: 'image', icon: 'el-icon-picture-outline', label: '图片' },
      ],
    }
  },
  methods: {
    async importTemplate(file) {
      let data = await file.text()
      data = JSON.parse(data)
      this.totalQuestionList = {
        title: data.title,
        description: data.description,
        questionList: data.questionList,
        predictList: data.predictList,
      }
      this.$emit('importTemplate', this.totalQuestionList)
      return false
      // console.log(
      //   f.text().then((v) => {
      //     let obj = JSON.parse(v)
      //     this.totalQuestionList = {
      //       // dept: obj.dept,
      //       title: obj.title,
      //       description: obj.description,
      //       questionList: obj.questionList,
      //       predictList: obj.predictList,
      //     }
      //     this.$emit('importTemplate', this.totalQuestionList)
      //   })
      // )
      // return false
    },
    exportTemplate() {
      this.$emit('exportTemplate')
    },
    addQuestion(type) {
      this.$emit('addQuestion', type)
    },
    setDimensional() {
      this.$emit('setDimensional')
    },
    setScoringRubric() {
      this.$emit('setScoringRubric')
    },
    setResult() {
      this.$emit('setResult')
    },
  },
}
</script>

<style lang="scss">
.edit-questionaire-aside {
  max-width: 208px;
  max-height: 470px;
  border: 1px dashed #ccc;
  border-radius: 4px;
  padding: 10px 20px;
  overflow-y: auto;
  .el-button,
  .el-button + .el-button {
    text-align: start;
    margin-left: 0;
    width: 160px;
    background: #f7f7f7;
  }

  .el-button + .el-button {
    margin-top: 10px;
  }
}
@media screen and (max-width: 1366px) {
  .edit-questionaire-aside {
    max-width: 208px;
    max-height: 300px;
    overflow-y: scroll;
  }
}
</style>

<style  lang="scss" scoped>
.aside {
  max-width: 300px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* align-content: center; */
  // position: fixed;
  // top: 0;
  // bottom: 0;
  .butBox {
    width: 200px;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    .el-button {
      width: 100%;
      margin: 0 0 10px 0;
    }
  }
}
</style>
