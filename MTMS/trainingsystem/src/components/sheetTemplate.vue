<template>
  <div class="sheetTemplate">
    <div class="sheetBox">
      <p class="flexBox">
        <el-button type="text" @click="previewSheet">评分表预览</el-button>
        <span>总分：{{totalScore}}</span>
      </p>
      <div class="questionBox" v-for="(item,index) in dataList" :key="index + 'all'">
        <el-input v-model="item.category" placeholder="请输入题目名称" class="titltName" maxlength="64" @blur="changeTitle($event,index)"></el-input>
        <div class="sheetSelf" v-for="(citem,cindex) in item.questionList" :key="cindex  + 'call'">
          <div class="spaceBetween title">
            <el-input v-model="citem.content" :placeholder="citem.type == 5 ? ' 常用标签' : '在此输入题目描述'" class="titltName" maxlength="250"></el-input>
            <p class="questionType"><span>（{{typeList[citem.type-1].typeName}}）</span></p>
            <p class="radioMargin">
              <span>是否必填</span>
              <el-radio class="radio" v-model="citem.required" label="1">是</el-radio>
              <el-radio class="radio" v-model="citem.required" label="0">否</el-radio>
            </p>
          </div>
          <div class="content" v-if="citem.type  == 1 || citem.type  == 2 || citem.type  ==5 ">
            <div v-for="(val,valindex) in citem.items" :key="valindex  + 'vall'" class="spaceBetween contentItem">
              <span class="scoreItem">{{String.fromCharCode(valindex + 65)}}</span>
              <el-input v-model="val.content" placeholder="输入选项内容" class="titltName" maxlength="100"></el-input>
              <p>
                <el-input v-model.number="val.scoreStatus ? '' : val.score" placeholder="输入分值" class="scoreInput" maxlength="3" v-if="citem.type !=5"
                  :disabled="val.scoreStatus" @change="changeScore"></el-input>
              </p>
              <el-checkbox v-model="val.scoreStatus" v-if="citem.type != 5" @change="changeScore">不计分</el-checkbox>
              <p class="radioMargin">
                <span>是否描述</span>
                <el-radio class="radio" v-model="val.reasonStatus" label="1">是</el-radio>
                <el-radio class="radio" v-model="val.reasonStatus" label="0">否</el-radio>
              </p>
              <div class="oprateButton" v-if="valindex == 0" @click="addSelect(index,cindex,valindex)"><i class="el-icon-plus"></i></div>
              <div type="primary" class="oprateButton" v-else @click="deleteSelect(index,cindex,valindex)"><i class="el-icon-delete"></i></div>
            </div>
          </div>
          <div class="content" v-if="citem.type == 3">
            <el-input placeholder="" type="textarea" :disabled="true"></el-input>
          </div>
          <div class="content" v-if="citem.type == 4">
            <p style="display: flex;margin-bottom:14px">
              <label v-for="i in 5" class="star-active"></label>
            </p>
          </div>
          <div class="content" v-if="citem.type == 6">
            <div class="startFlex title">
              <el-input placeholder="输入分值（满分）" maxlength="3" v-model="citem.score" @change="changeScore"></el-input>
              <p class="radioMargin">
                <span>是否描述</span>
                <el-radio-group v-model="citem.reasonStatus">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </p>
            </div>
          </div>
          <div class="positionButton">
            <el-button type="primary" v-if="cindex != 0" @click="moveTop(cindex, index)">上移</el-button>
            <el-button type="primary" v-if="cindex != item.questionList.length-1" @click="moveBottom(cindex, index)">下移</el-button>
            <el-button type="primary" @click="deleteItem(cindex, index)">删除</el-button>
          </div>
        </div>
        <div class="positionButton outButton">
          <el-button type="primary" v-if="index != 0" @click="moveTop(index,-1)">上移</el-button>
          <el-button type="primary" v-if="index != dataList.length-1" @click="moveBottom(index,-1)">下移</el-button>
          <el-button type="primary" @click="deleteItem(index, -1)">删除</el-button>
        </div>
      </div>

      <div class="buttonBox">
        <el-button type="primary" @click="addProblem">添加题目</el-button>
        <div class="nomalButton">
          <el-button type="primary" @click="sumbit">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="选择类型" :visible.sync="problemVisible">
      <el-form :model="problem" label-width="110px" class="addProblemDialog">
        <el-form-item label="题目名称" :label-width="formLabelWidth">
          <el-select v-model="problem.type" placeholder="输入或选择题目名称" allow-create filterable popper-class="selfSelect" maxlength="64"
            ref="problemType">
            <ul v-for="(item,index) in categoryList2" :key="index + 'list2'">
              <el-option :label="item" :value="item"></el-option>
            </ul>
            <ul v-for="(item,index) in categoryList" :key="index + 'list'">
              <el-option :label="item" :value="item" v-if="categoryJudge(item)"></el-option>
            </ul>
          </el-select>
        </el-form-item>
        <el-form-item label="题目类别" :label-width="formLabelWidth">
          <el-select v-model="problem.kind" placeholder="请选择">
            <el-option :label="item.typeName" :value="item.value" v-for="(item,index) in typeList" :key="index + 'type'"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="problemVisible = false">取 消</el-button>
        <el-button type="primary" @click="addQuestion">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="预览" :visible.sync="showPreview" width="80%" class="selfComp">
      <scoring-table :needHeader="needHeader" :dataList="PreDataList" :isAnswer="isAnswer"></scoring-table>
    </el-dialog>
  </div>
</template>
<script>
  import scoringTable from "./scoringTable.vue"
  import { post, getCookie, exportExcel } from '../config/util';
  export default {
    props: {
      questions: {
        type: ""
      },
      form: {
        type: ""
      },

      // questions: {
      //   type: "Array"
      // },
      // form: {
      //   type: "Object"
      // },
      type: {
        type: Number
      }
    },
    components: {
      scoringTable
    },
    data() {
      return {
        totalScore: 0,
        formLabelWidth: "",
        PreDataList: {},
        isAnswer: false,
        needHeader: true,
        showPreview: false,
        categoryList: [],
        categoryList2: [
          "教学热情",
          "临床教学能力",
          "临床工作能力",
          "医患交流技巧",
          "培养护培生循证医学思维",
          "教学反馈",
          "主观评价"
        ],
        typeList: [],
        typeListCopy: [
          { typeName: "单选题", value: 1 },
          { typeName: "多选题", value: 2 },
          { typeName: "简答题", value: 3 },
          { typeName: "星星等级", value: 4 },
          { typeName: "常用标签", value: 5 },
          { typeName: "滑动评分", value: 6 }
        ],
        formCopy: {
          name: "",
          intro: ""
        },
        problem: {
          type: "",
          kind: ""
        },
        flag: true,
        problemVisible: false,
        type: 5,
        dataList: [],
        // typeNmae: ['多选题'],
        mustHave: "1",
        titleData: {
          type: 1,
          list: [1, 2, 3, 4]
        }
      }
    },
    watch: {
      questions: function (newVal, oldVal) {
        this.dataList = newVal
        this.categoryList = []
        newVal.forEach(item => {
          this.categoryList.push(item.category)
        })
        this.changeScore()
      },
      form: {
        handler: function (newVal, oldVal) {
          this.formCopy = newVal
          if (newVal.type == 5 && this.type == 1) {
            this.typeList = this.typeListCopy.slice(0, 1)
          } else {
            this.typeList = this.typeListCopy
          }
        },
        deep: true,
      }
    },
    created() {
      this.typeList = this.typeListCopy
    },

    methods: {
      changeScore() {
        let total = 0
        this.dataList.forEach(item => {
          item.questionList = item.questionList || []
          item.questionList.forEach(citem => {
            if (citem.type == 6) {
              total = isNaN(citem.score) ? total : total + Number(citem.score)
            }
            if (citem.type == 1) {
              // 单选
              let score = 0
              citem.items.forEach(val => {
                if (!val.scoreStatus && val.score > score) {
                  score = isNaN(val.score) ? score : Number(val.score)
                }
              })
              total = total + score
            }
            if (citem.type == 2) {
              // 多选
              let score = 0
              citem.items.forEach(val => {
                if (!val.scoreStatus) {
                  score = isNaN(val.score) ? score : (score + Number(val.score))
                }
              })
              total = total + score
            }
          })
        })
        this.totalScore = total
      },
      previewSheet() {
        let tips = ""
        let noName = false
        let questionType = 0
        if (this.form.name == "") {

          tips = this.type == 4 ? '问卷名称不可为空' : "评分模板名称不可为空"
          noName = true
        }
        if (this.dataList.length == 0) {
          questionType = 1
        } else {
          this.checkTable(1);
          if (!this.flag) {
            questionType = 2
          }
        }
        if (tips == "" && questionType == 0) {
          this.PreDataList = {
            questions: this.dataList,
            name: this.formCopy.name,
            description: this.formCopy.intro
          }
          this.showPreview = true;
        } else {
          let temp = []
          tips == "" ? "" : temp.push(tips)
          questionType == 1 ? temp.push('题目不可为空') : (questionType == 2 ? temp.push('题目内容没有填完') : '')
          this.$alert(temp.join(";"), '评分表预览错误', {
            confirmButtonText: '确定'
          });
        }
      },
      cancel() {
        if (this.type == 4) {
          window.location.href = "/pages/scmp/surveyRecord.html?_t=1668571239398"
        } else {
          this.$router.push({
            name: 'scoringTemplate'
          })
        }

      },
      changeTitle(val, index) {
        val = this.dataList[index].category
        let temp = this.dataList[index]
        let deleteIndex = -1
        let recover = false
        let coverIndex = -1
        this.categoryList.forEach((item, cindex) => {
          if (val == item && cindex != index) {
            recover = true
            coverIndex = cindex
          }
          if (item == temp.categoryCopy) {
            deleteIndex = cindex
          }
        })
        if (recover) {
          // 重复
          let tips = "是否要与【" + val + "】合并?";
          this.$confirm(tips, '合并提示', {
            confirmButtonText: '是，合并',
            cancelButtonText: '重新编辑'
          }).then(() => {
            let coverItem = this.dataList[coverIndex]
            let currentItem = this.dataList[index]
            coverItem.questionList = coverItem.questionList.concat(currentItem.questionList)
            this.dataList.splice(coverIndex, 1, coverItem)
            this.dataList.splice(index, 1)
            this.$message({
              type: 'success',
              message: '合并成功!'
            });
          }).catch(() => {
            temp.category = ""
            this.dataList.splice(index, 1, temp)
          });
        }
        if (deleteIndex <= -1) {
          this.categoryList.push(val)
        } else {
          if (recover) {
            val = ""
          }
          this.categoryList.splice(deleteIndex, 1, val)
        }
        temp.categoryCopy = val;
        this.dataList.splice(index, 1, temp)
      },
      checkTable(type) {
        if (this.dataList.length == 0) {
          if (type == 0) {
            this.$message({
              type: 'warning',
              message: '请添加题目'
            });
          }
          this.flag = false
          return false;
        }
        for (var i = 0; i < this.dataList.length; i++) {
          let item = this.dataList[i]
          if (item.category.replace(/\s+/g, "") == "") {
            if (type == 0) {
              this.$message({
                type: 'warning',
                message: '还有题目内容没有填完'
              });
            }
            this.flag = false
            return false
          }
          if (item.questionList.length == 0) {
            if (type == 0) {
              this.$message({
                type: 'warning',
                message: '至少要有一道题！'
              });
            }
            this.flag = false
            return false
          }
          for (var j = 0; j < item.questionList.length; j++) {
            let citem = item.questionList[j]
            // 判断items
            if (citem.content.replace(/\s+/g, "") == "") {
              if (type == 0) {
                this.$message({
                  type: 'warning',
                  message: '还有题目内容没有填完'
                });
              }
              this.flag = false
              return false
            }
            if (citem.type == 1 || citem.type == 2 || citem.type == 5) {
              for (let val = 0; val < citem.items.length; val++) {
                let litem = citem.items[val]
                let reg = /^\d+$/
                if (litem.content.replace(/\s+/g, "") == "" || (String(litem.score).replace(/\s+/g, "") == "" && citem.type != 5 && !litem.scoreStatus)) {
                  if (type == 0) {
                    this.$message({
                      type: 'warning',
                      message: '还有题目内容没有填完'
                    });
                  }
                  this.flag = false
                  return false
                }
                if ((!reg.test(litem.score) || litem.score > 200) && citem.type != 5 && !litem.scoreStatus) {
                  if (type == 0) {
                    this.$message({
                      type: 'warning',
                      message: '输入分值应为0-200的整数'
                    });
                  }
                  this.flag = false
                  return false
                }
              }
            }
          }
          this.flag = true
        }
      },
      sumbit() {
        this.checkTable(0);
        if (this.flag) {
          let temp = JSON.parse(JSON.stringify(this.dataList))
          temp.forEach(item => {
            delete item.categoryCopy
            item.questionList.forEach(citem => {
              citem.category = item.category
              if (citem.type == 1 || citem.type == 2 || citem.type == 5) {
                citem.items.forEach((val, ind) => {
                  val.code = String.fromCharCode(ind + 65)
                  val.scoreStatus = val.scoreStatus ? 0 : 1
                  val.score = val.scoreStatus ? val.score : ""
                })
              }
            })
          })
          this.$emit("sumbitTemplate", temp)
        }

      },
      addSelect(index, cindex) {
        let typeItem = this.dataList[index]
        let questItem = typeItem.questionList[cindex]
        let temp = {
          content: "",
          reasonStatus: "0",
          score: "",
          scoreStatus: false,
          status: "1",
        }
        questItem.items.push(temp)
        typeItem.questionList.splice(cindex, 1, questItem)
        this.dataList.splice(index, 1, typeItem)
      },
      deleteSelect(index, cindex, valindex) {
        let typeItem = this.dataList[index]
        let questItem = typeItem.questionList[cindex]
        if (questItem.type == 2 && questItem.items.length <= 2) {
          this.$message({
            type: 'warning',
            message: '选项不可少于两个'
          });
          return false;
        }
        questItem.items.splice(valindex, 1)
        typeItem.questionList.splice(cindex, 1, questItem)
        this.dataList.splice(index, 1, typeItem)
      },
      addQuestion() {
        if (this.problem.kind == "" || this.problem.type == "") {
          this.$message({
            type: 'warning',
            message: '请先选择题目名称和题目类型！'
          });
          return false;
        }
        let temp = {
          category: "",
          content: "",
          // orderNum: item.questionList.length + 1,
          required: "1",
          status: "1",
          type: this.problem.kind
        }
        var items = []
        if (this.problem.kind == 1 || this.problem.kind == 2 || this.problem.kind == 5) {
          for (let i = 0; i < 4; i++) {
            items.push({
              // code: i,
              content: "",
              reasonStatus: "0",
              score: "",
              scoreStatus: false
            })
          }
        }
        let categoryListStr = this.categoryList.join(",")
        if (categoryListStr.indexOf(this.problem.type) > -1) {
          // 已有
          this.dataList.forEach((item, index) => {
            let questItem = {}
            if (item.category === this.problem.type) {
              temp.orderNum = item.questionList.length + 1
              questItem = {
                items,
                ...temp
              }
              item.questionList.push(questItem)
              this.dataList.splice(index, 1, item)
            }

          })

        } else {
          // 新增题目
          this.categoryList.push(this.problem.type)
          temp.orderNum = 1
          let questItem = {
            items,
            ...temp
          }
          this.dataList.push({
            category: this.problem.type,
            categoryCopy: this.problem.type,
            questionList: [questItem]
          })
        }
        this.problemVisible = false;
      },
      deleteItem(cindex, index) {
        if (index == -1) {
          this.$confirm('此操作将永久删除该题目, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            // 外层删除
            let deleteItem = this.dataList[cindex]
            // 删除选项中的类别
            let category = deleteItem.category
            this.categoryList.forEach((item, index) => {
              if (item == category) {
                this.categoryList.splice(index, 1)
              }
            })
            this.dataList.splice(cindex, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        } else {
          this.$confirm('此操作将永久删除该类型以及该类型所有题目, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            // 内层删除
            let item = this.dataList[index]
            item.questionList.splice(cindex, 1)
            this.dataList.splice(index, 1, item)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      moveTop(cindex, index) {
        if (index == -1) {
          let moveItem = this.dataList[cindex]
          let movedItem = this.dataList[cindex - 1]
          this.dataList.splice(cindex, 1, movedItem)
          this.dataList.splice(cindex - 1, 1, moveItem)
        } else {
          let temp = this.dataList[index]
          let moveItem = temp.questionList[cindex]
          let movedItem = temp.questionList[cindex - 1]
          temp.questionList.splice(cindex, 1, movedItem)
          temp.questionList.splice(cindex - 1, 1, moveItem)
          this.dataList.splice(index, 1, temp)

        }
      },
      moveBottom(cindex, index) {
        if (index == -1) {
          let moveItem = this.dataList[cindex]
          let movedItem = this.dataList[cindex + 1]
          this.dataList.splice(cindex, 1, movedItem)
          this.dataList.splice(cindex + 1, 1, moveItem)
        } else {
          let temp = this.dataList[index]
          let moveItem = temp.questionList[cindex]
          let movedItem = temp.questionList[cindex + 1]
          temp.questionList.splice(cindex, 1, movedItem)
          temp.questionList.splice(cindex + 1, 1, moveItem)
          this.dataList.splice(index, 1, temp)

        }
      },
      addProblem() {
        this.problemVisible = true;
        this.problem = {
          type: "",
          kind: ""
        }
      },
      categoryJudge(item) {
        if (item == "教学热情" || item == "临床教学能力" || item == "临床工作能力" || item == "医患交流技巧" || item == "培养护陪生循证医学思维" || item == "教学反馈" || item == "主观评价") {
          return false
        } else {
          return true
        }
      }
    }
  }

</script>
<style>
  .sheetSelf .scoreInput {
    width: 100px;
    margin: 0 10px;
  }

  .sheetTemplate .positionButton .el-button {
    padding: 10px 15px;
  }

  .sheetTemplate .el-textarea {
    margin-bottom: 14px;
  }

  .sheetTemplate .addProblemDialog .el-select {
    width: 400px;

  }

  .selfSelect .el-select-dropdown__item {
    width: 500px;
  }

  .sheetTemplate .startFlex .el-input {
    width: 300px;
  }

  /* .sheetSelf  */
</style>
<style scoped>
  .startFlex {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
  }

  .flexBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }

  .buttonBox {
    padding-top: 30px;
    text-align: center;
  }

  .nomalButton {
    margin-top: 50px;
    text-align: center;
  }

  p {
    margin: 0;
  }

  .spaceBetween {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgb(72, 87, 106);
    font-size: 14px;
  }

  .title {
    margin-bottom: 20px;
  }

  .questionType {
    width: 120px;
    display: inline-block;
    flex-shrink: 0;
  }

  .sheetSelf,
  .questionBox {
    border: 1px solid lightgray;
    border-radius: 5px;
    padding: 10px;
    margin-top: 16px;
  }

  .sheetSelf {
    margin-top: 14px;
  }

  .radioMargin {
    /* width: 240px; */
    margin-left: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .radioMargin span {
    display: inline-block;
    width: 75px;
    text-align: right;
    margin-right: 6px;
  }

  .contentItem {
    margin: 14px 0;
  }

  .scoreItem {
    display: inline-block;
    width: 25px;
  }

  .oprateButton {
    flex-shrink: 0;
    width: 46px;
    height: 36px;
    margin-left: 20px;
    background-color: #20a0ff;
    border-radius: 4px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 36px;
  }

  .star-active {
    width: 25px;
    height: 25px;
    background-image: url("../assets/images/icon_star_on.png");
    -webkit-background-size: cover;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .positionButton {
    text-align: right;
  }

  .outButton {
    margin-top: 14px;
    margin-right: 10px;
  }
</style>