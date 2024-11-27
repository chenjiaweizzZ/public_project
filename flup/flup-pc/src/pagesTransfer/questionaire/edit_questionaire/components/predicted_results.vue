<template>
  <div>
    <el-table :data="predictResultList" stripe border>
      <el-table-column show-overflow-tooltip :width="50" type="index" label="序号"></el-table-column>
      <el-table-column label="得分范围">
        <template slot-scope="scope" >
          <span v-for="(item, index) in scope.row.queryList" :key="index">{{ showName(item.project, 'project') }}{{ item.minScore }}-{{ item.maxScore }}{{ showName(item.relation, 'relation') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="测评结果" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.result }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="toModify(scope.$index,scope.row)">修改</el-button>
          <el-button type="text" @click="toDelete(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button class="margin10X width100 flex-align-end" type="text" :disabled="add" @click="addPredict">添加测评结果或建议
    </el-button>
    <div v-if="add">
      <div class="addPredictTitle width100 flex-align-justify margin20X">设置测评结果或建议</div>
      <el-form :model="query" :rules="rules" ref="ruleForm" label-position="top" label-width="80px">
        <el-row :span="24" :gutter="20" v-for="(el, elIndex) in query.queryList" :key="elIndex">
          <el-col :span="4">
            <el-form-item label="项目" :required="true">
              <el-select v-model="el.project" @change="repeatTip($event, elIndex)">
                <el-option
                  v-for="(item, index) in projectList"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                  :disabled="item.disabled"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="得分范围" :required="true" class="predicted-range">
              <el-input-number v-model="el.minScore" :min="0"></el-input-number>
              <span class="paddingX5">-</span>
              <el-input-number v-model="el.maxScore" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="关系" :required="elIndex !== query.queryList.length-1">
              <el-select v-model="el.relation">
                <el-option
                  v-for="(item, index) in relationList"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <div class="operator">
            <el-button type="text" @click="operate(elIndex, 'inset')">插入一行</el-button>
            <el-button type="text" @click="operate(elIndex, 'delete')" v-if="query.queryList.length !== 1">删除一行</el-button>
          </div>
        </el-row>
        <el-form-item prop="result" label="测评结果">
          <el-input class="predict-textarea" type="textarea" maxlength="500" show-word-limit :autosize="{ minRows: 4,maxRows:4 }" v-model="query.result"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="predictDialog width100 flex-align-end">
        <el-button type="primary" @click="predictSubmit">{{predictedSubmit}}</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "predicted_results",
    props: ['predictList', 'scoringRules', 'dimensionalList'],
    data() {
      return {
        predictResultList: [...this.predictList],
        add: false,
        predictedSubmit: '保 存',
        modifyIndex: '',
        query: {queryList: [{minScore: 0, maxScore: 0, project: '', relation: ''}], result: ''},
        defaultQuery: {minScore: 0, maxScore: 0, project: '', relation: ''},
        rules: {
          result: [{required: true, message: '请输入测评结果', trigger: 'blur'}]
        },
        relationList: [{ name: '并且', value: '0' }, { name: '或者', value: '1' }]
      }
    },
    created() {
      console.log('scoringRules', this.scoringRules)
      console.log('dimensionalList', this.dimensionalList)
      console.log('predictList', this.predictList)
      this.add = (this.predictResultList.length === 0)
      this.predictResultList.forEach(el => {
        el.queryList.forEach(i => {
          if (i.project === '1') {
            i.project = '0'
          }
        })
      })
    },
    computed: {
      // 根据维度和得分规则相关情况处理可选项目
      projectList() {
        let list = []
        if (this.scoringRules.length) {
          let isTotal = this.scoringRules.filter(i => i.dimensionId === '0').length
          let dimensionalArr = this.scoringRules.filter(i => i.dimensionId)
          list.push({
            name: '总分',
            value: '0',
            disabled: !isTotal ? true : false
          })
          if (dimensionalArr.length) {
            this.dimensionalList.forEach(el => {
              let isExist = false
              dimensionalArr.forEach(i => {
                if (el.serialNo === i.dimensionId) {
                  isExist = true
                  list.push({
                    name: el.dimension,
                    value: el.serialNo
                  })
                }
              })
              if (!isExist) {
                list.push({
                  name: el.dimension,
                  value: el.serialNo,
                  disabled: true
                })
              }
            })
          } else {
            this.dimensionalList.forEach(el => {
              list.push({
                name: el.dimension,
                value: el.serialNo,
                disabled: true
              })
            })
          }
        } else {
          list = []
        }
        return list
      }
    },
    methods: {
      /**
       * 已选择项目不可重复选择
       * value: 选中值, index: 操作行下标
       */
      repeatTip(value, index) {
        if (this.query.queryList.filter(i => i.project === value).length > 1) {
          this.query.queryList[index].project = ''
          this.$message.warning('已选择项目不可重复选择')
        }
      },
      /**
       * 测评方式的插入与删除
       * elIndex：操作行下标, type: 操作类型
       */
      operate(elIndex, type) {
        if (type === 'inset') {
          if (elIndex === this.query.queryList.length - 1) {
            this.query.queryList.push({
              ...this.defaultQuery
            })
          } else {
            this.query.queryList.splice(elIndex + 1, 0, {...this.defaultQuery})
          }
        } else {
          this.query.queryList.splice(elIndex, 1)
        }
      },
      // 根据ID显示名称
      showName(value, type) {
        let name = ''
        if (value) {
          switch (type) {
            case 'project':
              name = this.projectList.filter(i => i.value === value)[0]['name'] + '分值为'
              break;
            case 'relation':
              name = this.relationList.filter(i => i.value === value)[0]['name']
              break;
            default:
              name = ''
              break;
          }
        }
        return name
      },
      //点击修改
      toModify(index, item) {
        console.log(item)
        this.predictedSubmit = '修 改';
        this.add = true
        this.query = JSON.parse(JSON.stringify({...item}))
        this.modifyIndex = index
      },
      //点击删除
      toDelete(index) {
        this.$confirm('是否删除该预测结果?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.predictResultList.splice(index, 1)
          if (this.predictResultList.length === 0 || this.modifyIndex === index) {
            this.add = true
            this.predictedSubmit = '保 存'
            this.query = {queryList: [{minScore: 0, maxScore: 0, project: '', relation: ''}], result: ''}
          }
          this.$message({showClose: true, message: '删除成功！', type: 'success'})
          this.$emit('modifyPredictList', this.predictResultList)
        }).catch(() => {
        })
      },
      //添加预测结果
      addPredict() {
        this.query = {queryList: [{minScore: 0, maxScore: 0, project: '', relation: ''}], result: ''}
        this.predictedSubmit = '保 存';
        this.add = true;
      },
      //点击取消
      close() {
        this.$emit('close')
      },
      //保存/修改
      predictSubmit() {
        let message = ''
        this.query.queryList.forEach((el, index) => {
          if (el.minScore === undefined || el.maxScore === undefined) message = '得分范围不可为空'
          if (el.minScore > el.maxScore) message = '分数最小值不能大于分数最大值'
          if (!el.project) message = '请选择项目'
          if (!el.relation && index !== this.query.queryList.length-1) message = '请选择关系'
        })
        if (!this.query.result) message = '请输入测评结果'
        if (message) {
          this.$message({showClose: true, message: message, type: 'warning'})
          return
        }
        if (this.predictedSubmit === '保 存') {
          this.predictResultList.push({
            ...this.query
          })
          this.add = false
          this.query = {queryList: [{minScore: 0, maxScore: 0, project: '', relation: ''}], result: ''}
          this.$message({showClose: true, message: '保存成功！', type: 'success'})
          console.log('predictResultList', this.predictResultList)
          this.$emit('modifyPredictList', this.predictResultList)
        } else {
          this.$set(this.predictResultList, this.modifyIndex, {...this.query})
          this.add = false
          this.$message({showClose: true, message: '保存成功！', type: 'success'})
          this.$emit('modifyPredictList', this.predictResultList)
        }
      },
    }

  }
</script>
<style lang="scss">
  /*多行文本框*/
  .predict-textarea {
    .el-textarea__inner {
      resize: none;
      overflow-y: scroll;
      min-height: 60px!important;
      height: 60px!important
    }
    .el-input__count {
      color: #999;
      background: inherit !important;
      position: absolute;
      font-size: 12px;
      bottom: -32px !important;
      right: 0px !important;
    }
  }

  /*预测结果对话框底部边框*/
  // .el-form-item__error{
  //   margin-top: 70px;
  // }
  .predictDialog {
    margin-top: 68px;
    .dialog-footer {
      border-bottom: 0;
    }
  }
  .operator {
    text-align: right;
    height: 94px;
    line-height: 115px;
    margin: 0 10px;
  }
  .predicted-range {
    .el-form-item__content {
      display: flex;
    }
  }
</style>
<style scoped>
  .addPredictTitle {
    height: 30px;
    border-radius: 5px;
    background-color: #EBEEF5;
  }
  /* .el-input-number {
    max-width: 120px;
  } */
</style>
