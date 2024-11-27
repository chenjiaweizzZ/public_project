<template>
  <div class="deptMangeSupervisor">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="督导科室：">
          <el-select v-model="deptSelectShowList" placeholder="请选择" multiple collapse-tags clearable @clear="deptClear()" @remove-tag="deptRemove()">
            <el-option disabled class="baseOption" value> </el-option>
              <el-tree
                :props="baseProps"
                :data="deptList"
                show-checkbox
                ref="deptTree"
                check-strictly
                node-key="id"
                check-on-click-node
                @check-change="deptSelect"
                class="hosWithNoCheckBox"
              ></el-tree>
           
          </el-select>
        </el-form-item>
      <el-form-item label="督导专家">
        <el-select v-model="formInline.expert" placeholder="督导专家" multiple>
          <el-option v-for="item in expertList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="督导时间：" style="width:410px;">
        <el-date-picker v-model="formInline.startTime" type="date" placeholder="选择日期" @change="selectTime($event,'formInline')" style="width:135px">
        </el-date-picker>
        -
        <el-date-picker v-model="formInline.endTime" type="date" placeholder="选择日期" @change="selectTime($event,'formInline')" style="width:135px">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getTableData()">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" class="button-export" @click="showAdd()">发起督导</el-button>
    <el-table :data="tableData" border>
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="deptName" label="督导科室"></el-table-column>
      <el-table-column prop="date" label="督导时间" width="300">
        <template slot-scope="scope">
          <span><img src="../../assets/images/icon-time.svg" style="margin-right: 6px;vertical-align:-2px">{{scope.row.date}}&nbsp;{{scope.row.startTime}}-{{scope.row.endTime}}</span>
        </template>
        <!-- <template slot-scope="scope">
          <p><img src="../../assets/images/icon-time.svg" style="margin-right: 6px;">{{scope.row.date}}&nbsp;{{scope.row.startTime}}-{{scope.row.endTime}}</p>
        </template> -->
      </el-table-column>
      <el-table-column prop="supervisorExpertDTOS" label="督导专家">
        <template slot-scope="scope">
          <span>{{scope.row.supervisorExpertDTOS | filterName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="supervisorExpertDTOS" label="督导专家评分" width="180">
        <template slot-scope="scope">
          <div class="cellButton">
            <div :class="item.score === null ? 'noScore' : 'score'" @click="showDetail(scope.$index,item,1)" v-for="item in scope.row.supervisorExpertDTOS">
              <!-- <span v-if="item.score === null">{{item.name}}未评分</span>
              <span v-else="item.score === null">{{item.name}}（{{item.score}}分）</span> -->
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.supervisorExpertDTOS | filterName" placement="left">
                <span v-if="item.score === null">{{item.name}}未评分</span>
                <span v-else="item.score === null">{{item.name}}（{{item.score}}分）</span>
                <div slot="content">
                  <span v-if="item.score === null">{{item.name}}未评分</span>
                  <span v-else="item.score === null">{{item.name}}（{{item.score}}分）</span>
                </div>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="feedbackExpertNames" label="科室反馈" width="180">
        <template slot-scope="scope">
          <div class="cellButton">
            <div class="score" @click="showDetail(scope.$index,item,2)" v-for="item in scope.row.feedbackExpertDTOS" v-if="item.secretaryEvaluateId != null">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.supervisorExpertDTOS | filterName" placement="left">
                <span>已反馈（{{item.name}}）</span>
                <div slot="content">
                  <span>已反馈（{{item.name}}）</span>
                </div>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="附件" width="100px">
        <template slot-scope="scope">
          <div class="noScore" @click="lookPhotos(scope.row.files)">查看照片</div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showAdd(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="deleteItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination> -->
    <!-- 图片预览 -->
    <el-dialog title="查看照片" :visible.sync="dialogPhoto" width="60%">
      <viewer v-if="srcList !== null">
        <div class="lookPhoto">
          <div v-for="item in srcList" class="photoDetail">
            <img style="width: 120px; height: 120px" :src="item" :preview-src-list="srcList" />
          </div>
        </div>
      </viewer>
      <div v-else class="noPhoto">暂无照片</div>
    </el-dialog>
    <!-- 督导评分详情 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="80%">
      <p class="evaluteDetail" v-if="currentType == 1">
        <span>督导专家：{{currentItem.name}}</span>
        <span>评分时间：{{currentItem.submitTime}}</span>
        <span>评分: {{currentItem.score}}分</span>
      </p>
      <p class="evaluteDetail dept" v-if="currentType == 2">
        <span>反馈人：{{currentItem.feedbackName}}</span>
        <span>督导专家：{{currentItem.name}}</span>
        <span>反馈时间: {{currentItem.feedbackSubmitTime}}</span>
        <span>反馈评分: {{currentItem.feedbackScore}}分</span>
      </p>
      <scoring-table :id="previewId" :isAnswer="isAnswer" :needHeader="needHeader"></scoring-table>
    </el-dialog>
    <!-- 发起督导 -->
    <el-dialog title="发起督导" :visible.sync="addDailog" class="addSupervisor">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <!-- <el-form-item label="督导科室"> -->
          <!-- <el-select v-model="addformInline.dept" placeholder="科室">
            <el-option v-for="item in alldeptList" :key="item.id" :label="item.deptname" :value="item.id">
          </el-select> -->
          <!-- <select-tree @updateSingleDept="updateSingleDept" key="add" :hasBase="hasBase" :single="single"></select-tree>
        </el-form-item> -->
        <el-form-item label="督导科室" prop="" style="width: 300px;" class="hosDeptBox">
                <el-select v-model="hosDeptName"  placeholder="请选择科室" :popper-append-to-body="false"  collapse-tags @clear="clearall" clearable >
                    <el-option  disabled class="baseOption" value>
                        <el-tree 
                        :data="deptList" 
                        :props="defaultProps" 
                        ref="tree"
                        check-strictly  
                        node-key="id"
                        @node-click="handleNodeClick"
                        class="hosWithNoCheckBox">
                        </el-tree>
                    </el-option>
                </el-select>
                </el-form-item>
        <el-form-item label="督导时间：">
          <el-date-picker v-model="addformInline.timeArr" type="datetimerange" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入名字筛选" v-model="selectSupervisor" :data="data"
        :titles="transferTitle">
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDailog = false">取 消</el-button>
        <el-button type="primary" @click="submitSupervisor">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { getCookie, post } from '../../config/util'
  import scoringTable from "../../components/scoringTable.vue"
  import selectTree from "../../components/selectTree.vue"
  import moment from 'moment';
  export default {
    components: { scoringTable, selectTree },
    data() {
      return {
        defaultProps:{
					children: 'childrens',
					label: 'name'
                },
                hosDeptName: "",
        baseProps: {
        children: "childrens",
        label: "name",
        disabled: function(data, node) {
          // 禁用回收站选项
          if (data.deptlevel == 1) {
            return true;
          } else {
            return false;
          }
        }
      },
      deptList: [],
      deptSelectList: [],
      deptSelectShowList: [],
        single: true,
        rightNowClear: 0,
        hasBase: true,
        currentId: "",
        title: "督导评分详情",
        currentType: "",
        currentItem: {},
        previewId: "",
        isAnswer: true,
        needHeader: false,
        filterMethod(query, item) {
          return item.label.indexOf(query) > -1;
        },
        transferTitle: ['可选督导专家', '已选列表'],
        data: [],
        selectSupervisor: [],
        srcList: [
          'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
          'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
        ],
        alldeptList: [],
        expertList: [],
        addDailog: false,
        dialogPhoto: false,
        dialogVisible: false,
        tableData: [],
        formInline: {
          dept: [],
          expert: [],
          startTime: moment(new Date()).startOf('month').format("YYYY-MM-DD"),
          endTime: moment(new Date()).endOf('month').format("YYYY-MM-DD"),
        },
        addformInline: {
          dept: "",
          timeArr: [
            moment(new Date()).startOf('month').format("YYYY-MM-DD HH:mm:ss"), moment(new Date()).endOf('month').format("YYYY-MM-DD HH:mm:ss")
          ]
        },
        currentRow: {}
      }
    },
    filters: {
      filterName(val) {
        let temp = [];
        if (!val || val == undefined) {
          return ""
        }
        val.forEach(item => {
          temp.push(item.name)
        })
        return temp.join(",")
      },
    },
    created() {
      this.getTableData();
      this.getExpert();
      this.getbaseidList();
      this.getMyDeptTree()
    },
    methods: {
      handleNodeClick(data, checked, node) {
                if(data.deptlevel == 1) {
                }else {
                this.hosDeptName = data.name
                this.formInline.dept = data.id
                this.addformInline.dept = data.id
                }
            },
            clearall() {
              this.hosDeptName = ""
              this.formInline.dept = ""
            },
       getMyDeptTree() {
      let self = this
      post("/base/dept/getMyDeptTree", {
          showHospital: 1,
          showNoDeptHospital: 0,
          needBaseDept: 1
        }).then(res => {
          if (res.resCode == 200) {
            self.deptList = res.model
          }
        })
    },
    deptSelect() {
      let deptSelectList = this.$refs.deptTree.getCheckedNodes()
      let newArr = []
      let newArr2 = []
      deptSelectList.forEach(i => {
        newArr.push({
          name: i.name,
          id: i.id
        })
        newArr2.push(i.name)
      })
      this.deptSelectList = newArr
      this.deptSelectShowList = newArr2
    },
    deptClear() {
      this.deptSelectList = []
      this.deptSelectShowList = []
      this.$refs.deptTree.setCheckedNodes([])
    },
    deptRemove() {
      this.deptSelectList.shift()
      let arr = this.deptSelectList.map(i => i.id)
      this.$refs.deptTree.setCheckedKeys(arr)
    },
      updateSingleDept(node) {
        this.addformInline.dept = node.id
      },
      setSelectDept({ selectDeptIds, selectDeptName }) {
        this.formInline.dept = selectDeptIds.length == 0 ? [] : selectDeptIds
      },
      onReset() {
        this.formInline = {
          dept: [],
          expert: [],
          startTime: moment(new Date()).startOf('month').format("YYYY-MM-DD"),
          endTime: moment(new Date()).endOf('month').format("YYYY-MM-DD"),
        }
        this.rightNowClear = this.rightNowClear + 1
      },
      submitSupervisor() {
        if (this.addformInline.dept == "" || !this.addformInline.dept) {
          this.$message({
            type: 'warning',
            message: "请选择督导科室"
          })
          return false
        }
        if (this.addformInline.timeArr == undefined || this.addformInline.timeArr.length < 2) {
          this.$message({
            type: 'warning',
            message: "请选择督导时间"
          })
          return false
        }
        if (this.addformInline.timeArr[0] == null) {
          this.$message({
            type: 'warning',
            message: "请选择督导时间"
          })
          return false
        }
        if (this.selectSupervisor.length == 0) {
          this.$message({
            type: 'warning',
            message: "请选择督导专家"
          })
          return false
        }
        let params = {
          command: 'supervisor/addSupervisor',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          expertIds: this.selectSupervisor,
          startTime: moment(this.addformInline.timeArr[0]).format("YYYY-MM-DD HH:mm:ss"),
          endTime: moment(this.addformInline.timeArr[1]).format("YYYY-MM-DD HH:mm:ss"),
          businessId: this.addformInline.dept,
          type: 2
        }
        if (this.currentId) {
          params['id'] = this.currentId
        }
        post('/supervisor/addSupervisor', params).then(res => {
          if (res && res.errcode == 0) {
            this.$message({
              type: 'success',
              message: "发起督导成功"
            })
            this.getTableData();
            this.addDailog = false;
          } else {
            this.$message({
              type: 'warning',
              message: res.errdesc
            })
          }
        });
      },
      deleteItem(row) {
        this.$confirm('该督导相关数据将一并删除，确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          post('/supervisor/delSupervisor', {
            command: 'supervisor/delSupervisor',
            sessionid: getCookie('sid'),
            loginid: getCookie('uid'),
            id: row.id
          }).then(res => {
            if (res && res.errcode == 0) {
              this.$message({
                type: 'success',
                message: "删除成功！"
              })
              this.getTableData()
            } else {
              this.$message({
                type: 'warning',
                message: res.errdesc
              })
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      getTableData() {
        let deptIds = this.deptSelectList.map(i => i.id)
        post('/supervisor/deptSupervisor', {
          command: 'supervisor/deptSupervisor',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          deptIds: deptIds,
          startDate: moment(new Date(this.formInline.startTime)).format("YYYY-MM-DD"),
          endDate: moment(new Date(this.formInline.endTime)).format("YYYY-MM-DD"),
          supervisorExportIds: this.formInline.expert,
          type: 2
        }).then(res => {
          if (res && res.errcode == 0) {
            this.tableData = res.result
          } else {
            this.$message({
              type: 'warning',
              message: res.errdesc
            })
          }
        });
      },
      getbaseidList() {
        post('/turnbaseinfo/getusermanagerdepttree', {
          command: 'turnbaseinfo/getusermanagerdepttree',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          uid: getCookie('uid'),
        }).then((data) => {
          if (data && data.errcode == 0) {
            data.depttree.childlist.map((item, index) => {
              this.alldeptList = this.alldeptList.concat(item.childlist)
              item.childlist.forEach(item1 => {
                this.alldeptList = this.alldeptList.concat(item1.childlist)
              })
            })
          }
        }).catch(function (error) {
        })
      },
      getExpert() {
        post('/role/queryBindUserId', {
          command: 'role/queryBindUserId',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          roleid: '342',
        }).then((data) => {
          if (data && data.errcode == 0) {
            this.expertList = data.binduserlist;
            data.binduserlist.forEach(item => {
              item.label = item.name
              item.key = item.id
            })
            this.data = data.binduserlist
          }
        }).catch(() => {
        })
      },
      showAdd(row) {
        if (row) {
          if (row.isEdit == 1) {
            this.$message({
              type: 'success',
              message: "督导已评分，不可编辑!"
            })
            return false
          }
          if (row.isEdit == 2) {
            this.$message({
              type: 'success',
              message: "督导已反馈，不可编辑!"
            })
            return false
          }
          this.addformInline = {
            dept: row.businessId,
            timeArr: [
              row.startTime, row.endTime
              // moment(new Date()).startOf('month').format("YYYY-MM-DD HH:mm:ss"),
              // moment(new Date()).endOf('month').format("YYYY-MM-DD HH:mm:ss")
            ]
          }
          this.selectSupervisor = []
          row.supervisorExpertDTOS.forEach(item => {
            this.selectSupervisor.push(item.expertId)
          })
          this.currentId = row.id
        } else {
          this.addformInline = {
            dept: "",
            timeArr: [
              moment(new Date()).startOf('month').format("YYYY-MM-DD HH:mm:ss"),
              moment(new Date()).endOf('month').format("YYYY-MM-DD HH:mm:ss")
            ]
          }
          this.selectSupervisor = []
          this.currentId = ""
          this.hosDeptName= ""
        }
        this.addDailog = true;
      },
      showDetail(index, row, type) {
        let score = type == 2 ? row.feedbackScore : row.score
        if (score === null) {
          return false;
        }
        this.previewId = type == 2 ? row.secretaryEvaluateId : row.expertEvaluateId
        this.currentType = type
        this.currentItem = row
        this.title = type == 1 ? '督导评分详情' : '科室反馈详情'
        this.dialogVisible = true;
      },
      lookPhotos(files) {
        this.dialogPhoto = true;
        this.srcList = files;
      },
      handleCurrentChange(val) {
        this.pageNum = val
      },
      handleSizeChange(val) {
        this.pageSize = val
      },
      selectTime(val, currentKey) {
        if (this[currentKey]["endTime"] && this[currentKey]["startTime"]) {
          let tempEnd = new Date(this[currentKey]["endTime"]).getTime();
          let startTime = new Date(this[currentKey]["startTime"]).getTime()
          if (startTime - tempEnd > 0) {
            this.$message({
              message: '统计开始时间不能大于结束时间！',
              type: 'warning'
            });
            this[currentKey]["endTime"] = ""
          }

        }
      },
    }
  }
</script>
<style>
  .deptMangeSupervisor .el-date-editor {
    width: 125px;
  }

  .deptMangeSupervisor .el-pagination {
    text-align: right;
    margin-top: 20px;
  }

  .deptMangeSupervisor .el-transfer-panel {
    width: 300px;
  }

  .deptMangeSupervisor .el-transfer__buttons .el-button {
    margin-left: 0;
  }

  .deptMangeSupervisor .addSupervisor .el-dialog {
    width: 820px;
  }

  .deptMangeSupervisor .addSupervisor .el-date-editor {
    width: 335px;
  }

  .deptMangeSupervisor .addSupervisor .el-form-item {
    width: fit-content;
  }
</style>
<style scoped>
  .deptMangeSupervisor {
    padding: 0 20px;
  }

  .lookPhoto {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: center;
  }

  .photoDetail {
    width: 120px;
    height: 120px;
    flex-shrink: 1;
    margin-right: 10px
  }

  .evaluteDetail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 14px;

  }

  .evaluteDetail span {
    display: inline-block;
    /* width: 33%; */
    text-align: left;
    flex-shrink: 1;
  }

  /* .evaluteDetail.dept span {
    width: 25%;
  } */


  .score,
  .noScore {
    background: #67c23a;
    padding: 0 7px;
    height: 24px;
    color: #fff;
    white-space: nowrap;
  }

  .noScore {
    background: #f4f4f5;
    color: #909399;
  }

  .button-export {
    margin-bottom: 20px;
  }

  .cellButton {
    padding: 7px 0;
    text-align: center;
  }

  .cellButton div {
    margin-bottom: 8px;
  }

  .cellButton div:last-child {
    margin-bottom: 0;
  }

  .noPhoto {
    height: 200px;
    text-align: center;
    line-height: 200px;
  }
  .el-select-dropdown__item {
        overflow: visible;
        height: auto;
    }
</style>