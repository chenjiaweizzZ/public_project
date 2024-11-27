//维度设置
<template>
  <div class="dimensionalBox">
    <div class="butBox">
      <el-button type="primary" @click="addDimensional">添加维度</el-button>
    </div>
    <el-table
      :data="dimensionalList.filter((item) => {return item.isDelete!=1}) "
      border
      style="width: 100%"
      max-height="400"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="dimension" show-overflow-tooltip label="维度"></el-table-column>
      <el-table-column prop="description" show-overflow-tooltip label="说明"></el-table-column>
      <el-table-column prop="keyId" show-overflow-tooltip label="绑定题目"></el-table-column>
      <el-table-column prop="address" label="操作" width="100px">
        <template slot-scope="scope">
          <el-button type="text" @click="setBinding(scope.row)">编辑</el-button>
          <el-button type="text" @click="deleteItem(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="binding" class="dimensionalObjBox">
      <div>
        <div class="title">
          <h3>维度详情</h3>
          <!-- <i class="el-icon-close"></i> -->
        </div>
        <div class="main">
          <p>
            <span>维度名称：</span>
            <el-input
              type="text"
              placeholder="请输入内容"
              v-model="dimensionalObj.dimension"
              maxlength="20"
              show-word-limit
            ></el-input>
            <!-- {{dimensionalObj.name}} -->
          </p>
          <p>
            <span>维度说明：</span>
            <el-input
              resize="none"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6}"
              placeholder="请输入内容"
              maxlength="150"
              show-word-limit
              v-model="dimensionalObj.description"
            ></el-input>
          </p>
          <div class="examsBox">
            <p>
              <span>绑定题目：</span>
            </p>
            <div>
              <el-checkbox-group v-model="dimensionalObj.keyId">
                <template v-for="(item, index) in questionList">
                  <el-checkbox
                    v-if="item.type == 'inventoryProblem'"
                    :disabled="isDisabled(item)"
                    :key="index"
                    :label="item.key"
                  >题目：{{item.key}}、{{item.label}}</el-checkbox>
                </template>
              </el-checkbox-group>
            </div>
          </div>
          <p class="pcBox">Ps：题目灰色不可选中是因为得分规则里使用了,请先在得分规则里取消使用！</p>
        </div>

        <div class="butBox">
          <el-button type="primary" @click="setDimensionalObj">确 定</el-button>
          <!-- <el-button @click="setDimensionalObj">取 消</el-button> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { nanoid } from 'nanoid'
export default {
  name: 'Dimensional',
  props: ['questionList', 'dimensionalList', 'scoringRules'],
  data() {
    return {
      binding: false,
      dimensionalObj: null,
      backups: null,
    }
  },
  mounted() {
    console.log('questionList', this.questionList)
  },
  methods: {
    isDisabled(item) {
      let arr = this.scoringRules.filter((element) => {
        return (
          element.dimensionId == this.dimensionalObj.serialNo &&
          element.isSystem == 0
        )
      })
      if (arr.length != 0) {
        for (let i in arr) {
          for (let j in arr[i].mathematicalFormula) {
            if (arr[i].mathematicalFormula[j].defaultValue == item.key) {
              return true
            }
          }
        }
      } else {
        return false
      }
    },
    addDimensional() {
      this.$prompt('', '请输入维度名称', {
        customClass: 'putInBox',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '请输入维度名称,长度在 1 到 20 个字符',
        inputPattern: /^[\S]{1,20}$/,
      })
        .then(({ value }) => {
          // let arr = this.dimensionalList.filter((item) => {
          //   return item.dimension == value
          // })
          // if (arr.length != 0) {
          //   this.$message({
          //     message: '维度不可重复!',
          //     type: 'warning',
          //   })
          // } else {
          //   let dimensional = {
          //     dimension: value,
          //     description: null,
          //     keyId: '',
          //     serialNo: nanoid(),
          //     isDelete: 0,
          //   }
          //   this.dimensionalList.push(dimensional)
          // }
          let dimensional = {
            dimension: value,
            description: null,
            keyId: '',
            serialNo: nanoid(),
            isDelete: 0,
          }
          this.dimensionalList.push(dimensional)
        })
        .catch(() => {})
    },
    deleteItem(item) {
      let arr = this.scoringRules.filter((element) => {
        return element.dimensionId == item.row.serialNo
      })

      if (arr.length == 0) {
        this.$confirm('此操作将删除该维度, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(() => {
            // this.dimensionalList.splice(item.$index, 1)
            if (item.row.questionnaireId) {
              this.dimensionalList.forEach((element) => {
                if (element.serialNo == item.row.serialNo) {
                  element.isDelete = 1
                }
              })
            } else {
              for (let i = 0; i < this.dimensionalList.length; i++) {
                if (this.dimensionalList[i].serialNo == item.row.serialNo) {
                  this.dimensionalList.splice(i, 1)
                }
              }
            }
          })
          .catch(() => {})
      } else {
        this.$message({
          message: '请先在得分规则里取消使用此维度!',
          type: 'warning',
        })
      }
    },
    setBinding(row) {
      this.binding = true
      this.dimensionalObj = row
      if (this.dimensionalObj.keyId == '') {
        this.dimensionalObj.keyId = []
      } else {
        this.dimensionalObj.keyId = row.keyId.split(',').map(Number)
      }
    },
    setDimensionalObj() {
      this.dimensionalObj.keyId.sort(function (a, b) {
        return a - b
      })
      this.dimensionalObj.keyId = this.dimensionalObj.keyId.join(',')
      this.binding = false
    },
  },
}
</script>
<style lang="scss" scoped>
.dimensionalBox {
  .butBox {
    margin-bottom: 10px;
  }
  .dimensionalObjBox {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2100;
    background-color: rgba(0, 0, 0, 0.3);
    > div {
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -60%);
      width: 700px;
      height: 60vh;
      min-height: 575px;

      background-color: #fff;
      .title {
        padding: 10px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #ccc;
        i {
          font-size: 22px;
          color: #ccc;
          cursor: pointer;
        }
      }
      .main {
        padding: 10px 20px;
        p {
          margin-bottom: 10px;
          display: flex;
          font-size: 14px;
          line-height: 2;
          span {
            width: 100px;
            font-size: 16px;
            color: #666;
          }
        }
        .examsBox {
          display: flex;
          > div {
            width: 580px;
            height: 280px;
            padding: 5px 0;
            overflow-x: hidden;
            overflow-y: scroll;
            /deep/ .el-checkbox {
              margin-bottom: 5px;
            }
            /deep/ .el-checkbox__label {
              width: 560px;
              vertical-align: top;
              white-space: break-spaces;
            }
          }
        }
        .pcBox {
          margin-bottom: 0px;
          line-height: 1;
          font-size: 12px;
          color: #666;
        }
      }
      .butBox {
        display: flex;
        flex-direction: row-reverse;
        padding: 0 20px;
        margin: 10px 0;
        .el-button {
          margin: 0 10px;
        }
      }
    }
  }
}
</style>