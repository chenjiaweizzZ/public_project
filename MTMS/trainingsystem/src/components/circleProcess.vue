<template>
  <div class="circleProcess">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="统计日期：" style="width:550px;">
        <el-date-picker v-model="formInline.startTime" type="date" placeholder="选择日期" @change="selectTime">
        </el-date-picker>
        -
        <el-date-picker v-model="formInline.endTime" type="date" placeholder="选择日期" @change="selectTime">
        </el-date-picker>
      </el-form-item>
      <!-- <hospital-base-dept key="deform" :clearAll="rightNowClear" :deptTitle="轮转科室" @updateSelectIds="setQueryFormOne" :multiBase="multiBase"
        :multiDept="multiDept"></hospital-base-dept> -->
      <el-form-item label="专业基地：">
        <el-select v-model="baseSelectShowList" placeholder="请选择" multiple collapse-tags clearable @clear="baseClear()" @remove-tag="baseRemove()">
          <el-option disabled class="baseOption" value>
            <el-tree :props="baseProps" :data="baseList" show-checkbox ref="baseTree" check-strictly node-key="id" check-on-click-node
              @check-change="baseSelect" class="hosWithNoCheckBox"></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科室：">
        <el-select v-model="deptSelectShowList" placeholder="请选择" multiple collapse-tags clearable @clear="deptClear()" @remove-tag="deptRemove()" >
          <el-option disabled class="baseOption" value>
            <el-tree :props="baseProps" :data="deptList" show-checkbox ref="deptTree" check-strictly node-key="id" check-on-click-node
              @check-change="deptSelect" class="hosWithNoCheckBox"></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年级：">
        <el-select v-model="formInline.degree" placeholder="请选择">
          <el-option v-for="item in gradelist" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.searchVal" autocomplete="off" placeholder="输入姓名、学号、手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch()">搜索</el-button>
        <el-button @click="onReset()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="exportData" class="button-export">导出</el-button>
    <el-table :data="tableData" border style="width: 100%" :key="tabIndex">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="stuName" label="护培生" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="personalDetail(scope.$index, scope.row)">{{scope.row.stuName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="stuNo" label="学号" width="150"></el-table-column>
      <el-table-column prop="grade" label="年级" width="90"></el-table-column>
      <el-table-column prop="baseName" label="专业基地" width="150"></el-table-column>
      <el-table-column prop="turnDeptName" label="轮转科室" width="150"></el-table-column>
      <el-table-column prop="planStartTime" label="计划轮转时间" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.planStartTime}}至{{scope.row.planEndTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="kms" label="科秘书" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="employeeDetail(scope.$index, item)" v-for="item in scope.row.secretaryList">{{item.name}},</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="teacherName" label="带教老师" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="employeeDetail(scope.$index, {tecid: scope.row.teacherId})">{{scope.row.teacherName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="turnInStatus" label="入科状态" width="80">
        <template slot-scope="scope">
          {{scope.row.turnInStatus == 1 ? '已入科' : '未入科'}}
        </template>
      </el-table-column>
      <el-table-column prop="turnOutStatus" label="出科状态" width="80">
        <template slot-scope="scope">
          {{scope.row.turnOutStatus == 1 ? '已出科' : '未出科'}}
        </template>
      </el-table-column>
      <el-table-column prop="turnDailyEvaluates" label="护培生评价带教" width="180">
        <template slot-scope="scope">
          <div class="evaluate" v-if="scope.row.turnDailyEvaluates.turnDailyEvaluate1.length != 0">
            <p v-for="item in scope.row.turnDailyEvaluates.turnDailyEvaluate1" :key="item.turnPlanDetailId" @click="showSheetTable(item)">
              <span :class="!item.evaluate ? 'redPoiont' : 'greenScore'">{{item.evaluate ? '已评（' + item.evaluateScore +'）':
                '未评'}}
              </span><span>{{item.evaluateDate}}</span>
            </p>
          </div>
          <div v-else class="evaluate">
            <span>——</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="turnDailyEvaluate2" label="带教评价护培生" width="180">
        <template slot-scope="scope">
          <div class="evaluate" v-if="scope.row.turnDailyEvaluates.turnDailyEvaluate3.length != 0">
            <p v-for="item in scope.row.turnDailyEvaluates.turnDailyEvaluate3" :key="item.turnPlanDetailId" @click="showSheetTable(item)">
              <span :class="!item.evaluate ? 'redPoiont' : 'greenScore'">{{item.evaluate ? '已评（' + item.evaluateScore +'）':
                '未评'}}
              </span><span>{{item.evaluateDate}}</span>
            </p>
          </div>
          <div v-else class="evaluate">
            <span>——</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="turnDailyEvaluate3" label="护培生评价科室" width="180">
        <template slot-scope="scope">
          <div class="evaluate" v-if="scope.row.turnDailyEvaluates.turnDailyEvaluate2.length != 0">
            <p v-for="item in scope.row.turnDailyEvaluates.turnDailyEvaluate2" :key="item.turnPlanDetailId" @click="showSheetTable(item)">
              <span :class="!item.evaluate ? 'redPoiont' : 'greenScore'">{{item.evaluate ? '已评（' + item.evaluateScore +'）':
                '未评'}}
              </span><span>{{item.evaluateDate}}</span>
            </p>
          </div>
          <div v-else class="evaluate">
            <span>——</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="turnDailyEvaluate4" label="护士长评价护培生" width="180">
        <template slot-scope="scope">
          <div class="evaluate" v-if="scope.row.turnDailyEvaluates.turnDailyEvaluate4.length != 0">
            <p v-for="item in scope.row.turnDailyEvaluates.turnDailyEvaluate4" :key="item.turnPlanDetailId" @click="showSheetTable(item)">
              <span :class="!item.evaluate ? 'redPoiont' : 'greenScore'">{{item.evaluate ? '已评（' + item.evaluateScore +'）':
                '未评'}}
              </span><span>{{item.evaluateDate}}</span>
            </p>
          </div>
          <div v-else class="evaluate">
            <span>——</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="skillScore" label="出科技能考核" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.skillScore == '——' || scope.row.skillScore == ''|| scope.row.skillScore === null">{{scope.row.skillScore}}</span>
          <span v-else :class="Number(scope.row.skillScore) - Number(scope.row.skillScoreConf) >= 0 ? 'greenScore' : 'redPoiont'">{{scope.row.skillScore}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="theoryScore" label="出科理论考核" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.theoryScore == '——' || scope.row.theoryScore == ''|| scope.row.theoryScore === null">{{scope.row.theoryScore}}</span>
          <span v-else :class="Number(scope.row.theoryScore) - Number(scope.row.theoryScoreConf) >= 0 ? 'greenScore' : 'redPoiont'">{{scope.row.theoryScore}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="compreScore" label="出科综合考核" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.compreScore == '——' || scope.row.compreScore == ''|| scope.row.compreScore === null">{{scope.row.compreScore}}</span>
          <span v-else :class="Number(scope.row.compreScore) - Number(scope.row.compreScoreConf) >= 0 ? 'greenScore' : 'redPoiont'">{{scope.row.compreScore}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="teachingActionCount" label="教学活动" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="showDetail(scope.$index, scope.row)">{{scope.row.teachingActionCount}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <el-dialog title="教学活动详情" :visible.sync="dialogTableVisible" class="activeDetailDailog">
      <el-table :data="activeData" border>
        <el-table-column type="index" width="50" label="序号"></el-table-column>
        <el-table-column prop="theme" label="教学活动主题" width="150"></el-table-column>
        <el-table-column prop="typeName" label="活动类型" width="200"></el-table-column>
        <el-table-column prop="deptname" label="科室" width="150"></el-table-column>
        <el-table-column prop="actiontime" label="活动时间" width="220">
          <template slot-scope="scope">
            <p v-for="(item,index) in scope.row.actiontime" :key="index">{{item.date}}&nbsp;{{item.startTime}}-{{item.endTime}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="place" label="活动地点" width="150"></el-table-column>
        <el-table-column prop="speakerlist" label="主讲人" width="150">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.speakerlist">{{item.uname}}{{index == scope.row.speakerlist.length-1 ?
              '' : ','}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="validFlag" label="签到状态" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.validFlag == 0 ? '未签到' : '已签到'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="活动反馈" width="100"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 个人档案 -->
    <student-personal-Info :studentDetailId="studentDetailId" :dialogRecords.sync="dialogRecords"></student-personal-Info>
    <!-- 职工信息 -->
    <employee-info :dialogEmployee.sync="dialogEmployee" :currentDataId="currentDataId"></employee-info>
    <!-- 评分详情 -->
    <el-dialog :title="title" :visible.sync="dialogVisible" size="large">
      <scoring-table :id="previewId" :isAnswer="isAnswer" :needHeader="needHeader"></scoring-table>
    </el-dialog>
  </div>

</template>
<script>
  import employeeInfo from "./employeeInfo.vue"
  import studentPersonalInfo from "./studentPersonalInfo.vue"
  import scoringTable from "./scoringTable.vue"
  import { post, getCookie, exportExcel } from '../config/util';
  import hospitalBaseDept from "./hospitalBaseDept.vue"

  import moment from 'moment';
  export default {
    components: {
      studentPersonalInfo,
      employeeInfo,
      scoringTable,
      hospitalBaseDept
    },
    data() {
      return {
        title:"",
        tabIndex:"",
        baseProps: {
          children: "childrens",
          label: "name",
          disabled: function (data, node) {
            // 禁用回收站选项
            if (data.deptlevel == 1) {
              return true;
            } else {
              return false;
            }
          }
        },
        baseList: [],
        baseSelectList: [],
        baseSelectShowList: [],
        deptList: [],
        deptSelectList: [],
        deptSelectShowList: [],
        multiDept: true,
        multiBase: true,
        rightNowClear: 0,
        isAnswer: true,
        needHeader: true,
        previewId: "",
        dialogVisible: false,
        activeData: [],
        gradelist: [],
        dialogTableVisible: false,
        tableData: [],
        formInline: {
          hospitalId: "",
          startTime: "",
          endTime: "",
          region: [],
          dept: [],
          searchVal: "",
          degree: ""
        },
        pageSize: 10,
        pageNum: 1,
        total: 0,
        baseidList: [],
        newroomList: [],
        newdeptList: [],
        alldeptList: [],
        currentDataId: "",
        dialogEmployee: false,
        studentDetailId: "",
        dialogRecords: false,
      }

    },
    created() {
      this.formInline.startTime = moment(new Date()).startOf('month').format("YYYY-MM-DD")
      this.formInline.endTime = moment(new Date()).endOf('month').format("YYYY-MM-DD")
      this.getTableData();
      this.getbaseidList();
      this.initGradeList();
      this.getMyBaseTree();
      this.getMyDeptTree()
    },
    methods: {
      getMyBaseTree() {
        let self = this
        post("/base/dept/getHosBaseTree", {}).then(res => {
          if (res.resCode == 200) {
            self.baseList = res.model;
          }
        });
      },
      baseSelect() {
        let baseSelectList = this.$refs.baseTree.getCheckedNodes()
        let newArr = []
        let newArr2 = []
        baseSelectList.forEach(i => {
          newArr.push({
            name: i.name,
            id: i.id
          })
          newArr2.push(i.name)
        })
        this.baseSelectList = newArr
        this.baseSelectShowList = newArr2
      },
      baseClear() {
        this.baseSelectList = []
        this.baseSelectShowList = []
        this.$refs.baseTree.setCheckedNodes([])
      },
      baseRemove() {
        this.baseSelectList.shift()
        let arr = this.baseSelectList.map(i => i.id)
        this.$refs.baseTree.setCheckedKeys(arr)
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
      setQueryFormOne(form) {
        this.formInline.hospitalId = form.hospitalId
        this.formInline.region = form.baseId
        this.formInline.dept = form.deptIdList
      },
      showSheetTable(item) {
        if (item.evaluate) {
          this.dialogVisible = true
          this.previewId = item.evaluateSubmitRecordId
        }
      },
      selectTime() {
        if (this['formInline']["endTime"] && this['formInline']["startTime"]) {
          let tempEnd = new Date(this['formInline']["endTime"]).getTime();
          let startTime = new Date(this['formInline']["startTime"]).getTime()
          if (startTime - tempEnd > 0) {
            this.$message({
              message: '统计开始时间不能大于结束时间！',
              type: 'warning'
            });
            this['formInline']["endTime"] = ""
          }
        }
      },
      exportData() {
        let baseid = this.baseSelectList.map(i => i.id)
        let deptid = this.deptSelectList.map(i => i.id)
        let data = {
          "command": "statistal/report/queryTurnPlanReport",
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          hospitalId: this.formInline.hospitalId,
          baseIds: baseid,
          deptIds: deptid,
          grade: this.formInline.degree == 0 ? '' : this.formInline.degree,
          keyword: this.formInline.searchVal,
          startTime: this.formInline.startTime,
          endTime: this.formInline.endTime,
        };
        exportExcel(data);
      },
      initGradeList: function () {				//年级查询
        let self = this;
        post('turnbaseinfo/turnbaseinfolevel', {
          command: 'turnbaseinfo/turnbaseinfolevel',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          code: "turngrade",
        }).then(function (data) {
          if (data && data.errcode == 0) {
            self.gradelist = JSON.parse(data.baseinfolevellist);
          }
        }).catch(function (error) {
          //console.log(error)
        })
      },
      newbasechange(val) {
        if (val.length == 0) {
          this.newdeptList = this.alldeptList
          return false
        }
        this.newdeptList = [];
        this.newroomList.forEach((item) => {
          val.forEach(citem => {
            if (citem == item.id) {
              this.newdeptList = this.newdeptList.concat(item.childlist)
              item.childlist.forEach(item1 => {
                this.newdeptList = this.newdeptList.concat(item1.childlist)
              })
            }
          })
        })
      },
      getbaseidList() {
        let self = this;
        post('/turnbaseinfo/getusermanagerdepttree', {
          command: 'turnbaseinfo/getusermanagerdepttree',
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          uid: getCookie('uid'),
        }).then(function (data) {
          if (data && data.errcode == 0) {
            self.newroomList = data.depttree.childlist
            data.depttree.childlist.map(function (item, index) {
              self.baseidList.push(item)
              self.alldeptList = self.alldeptList.concat(item.childlist)
              item.childlist.forEach(item1 => {
                self.alldeptList = self.alldeptList.concat(item1.childlist)
              })
            })
            self.newdeptList = self.alldeptList
          }
        }).catch(function (error) {
        })
      },
      getTableData() {
        let baseid = this.baseSelectList.map(i => i.id)
        let deptid = this.deptSelectList.map(i => i.id)
        post("/statistal/report/queryTurnPlanReport", {
          command: "statistal/report/queryTurnPlanReport",
          sessionid: getCookie('sid'),
          loginid: getCookie('uid'),
          hospitalId: this.formInline.hospitalId,
          // baseIds: this.formInline.region,
          // deptIds: this.formInline.dept,
          baseIds: baseid,
          deptIds: deptid,
          grade: this.formInline.degree == 0 ? '' : this.formInline.degree,
          keyword: this.formInline.searchVal,
          startTime: this.formInline.startTime,
          endTime: this.formInline.endTime,
          pagesize: this.pageSize,
          pagenum: this.pageNum
        }).then((data) => {
          if (data && data.errcode == 0) {
            this.total = data.totalcount
            this.tableData = data.list
            this.total = data.totalcount
          } else {
            this.$message({
              type: 'warning',
              message: data.errdesc
            });
          }
        }).catch(function (error) {
        })
      },
      showDetail(inedx, row) {
        this.dialogTableVisible = true;
        row.teacherActionCountDetails.forEach(item => {
          item.actiontime = JSON.parse(item.actiontime)
        })
        this.activeData = row.teacherActionCountDetails
        console.log(this.activeData, "----")
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getTableData()
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getTableData()
      },
      onSearch() {
        this.getTableData()
      },
      onReset() {
        this.rightNowClear = this.rightNowClear + 1
        this.formInline = {
          startTime: moment(new Date()).startOf('month').format("YYYY-MM-DD"),
          endTime: moment(new Date()).endOf('month').format("YYYY-MM-DD"),
          region: [],
          dept: [],
          searchVal: "",
          degree: ""
        }
      },
      personalDetail(index, row) {
        this.dialogRecords = true;
        this.studentDetailId = row.stuId
      },
      employeeDetail(index, row) {
        this.dialogEmployee = true
        this.currentDataId = row.tecid
      },

    }
  }
</script>
<style>
  .circleProcess .el-date-editor {
    width: 135px;
  }

  .circleProcess .el-pagination {
    text-align: right;
    margin-top: 20px;
  }

  .circleProcess .activeDetailDailog .el-dialog {
    width: 75%;
  }
</style>
<style scoped lang="scss">
  .evaluate p {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .redPoiont {
    color: red;
  }

  .greenScore {
    color: green;
  }

  .button-export {
    margin-bottom: 20px;
  }
</style>
