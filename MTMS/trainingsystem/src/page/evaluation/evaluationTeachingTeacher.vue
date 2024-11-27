<template>
  <div class="wapper">
    <div class="funcTools">
      <el-button type="primary" @click="exportData">批量导出</el-button>
      <el-button type="primary" @click="showEcharts" :loading="charts.loading">查看{{ charts.title }}</el-button>
    </div>

    <div class="topTools zy-clear">
      <div class="zy-tool" style="margin:0;">
        <div class="queryAll">
          <el-button type="text" @click="queryAll">全部</el-button>
        </div>

        <el-form class="zy-clear flexForm" :model="queryForm" :inline="true" ref="queryForm" label-width="70px">
          <hospital-base-dept1 :clearAll="rightNowClear" @updateSelectIds="setQueryFormOne" :hasHospital="hasHospital" :showDeptTree="showDeptTree"></hospital-base-dept1>
          <el-form-item label="年级" prop>
            <el-select filterable v-model="queryForm.grade" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option v-for="item in gradelist" :key="item.key" :label="item.name" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评分日期" style="width: 315px;" label-width="70px">
            <el-date-picker style="width: 114px" v-model="queryForm.startime" type="month" placeholder="选择日期" format="yyyy-MM" @change="gettime"></el-date-picker>-
            <el-date-picker style="width: 114px" v-model="queryForm.endtime" type="month" placeholder="选择日期" format="yyyy-MM" @change="getendtime"></el-date-picker>
          </el-form-item>
          <el-form-item label="评价状态" prop>
            <el-select v-model="queryForm.state" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option v-for="item in stateList" :key="item.val" :label="item.content" :value="item.val"></el-option>
            </el-select>
          </el-form-item>
          <el-input style="width: 200px;" v-model="queryForm.inputquery" placeholder="请输入姓名或工号" @keyup.enter.native="query"></el-input>

          <el-button class="querybtn" type="primary" @click="query" style="display: inline-block;">查询</el-button>
        </el-form>
      </div>
    </div>
    <div style="position: relative; width: 100%;">
      <transition name="el-fade-in">
        <div class="dataTable" v-if="!charts.visible">
          <el-table ref="detailTable" :data="rateList" border tooltip-effect="dark" style="width: 100%" @sort-change="PercentileOrdering"
            v-loading="loading">
            <!--<el-table-column type ="selection" width = "45"  >
            </el-table-column>-->
            <!--<el-table-column type ="index" fixed width = "65" label = "序号" ></el-table-column>-->
            <el-table-column prop label="序号" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 + (pageno - 1) * pagesize }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="teacherName" width="120" label="带教老师">
              <template slot-scope="scope">
                <div class="actionplansty">
                  <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.teacherName" placement="top">
                    <el-button type="text" size="small" @click="employeeDetail(scope.$index, scope.row)">{{ scope.row.teacherName
                      }}</el-button>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="teacherNo" label="带教工号" width="150"></el-table-column>
            <el-table-column prop="teacherDept" label="带教所属科室">
              <template slot-scope="scope">
                <div class="actionplansty">
                  <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.teacherDept" placement="top">
                    <span>{{ scope.row.teacherDept }}</span>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="mobile" width="120" label="手机号"></el-table-column> -->
            <el-table-column prop="studName" width="120" label="护陪生">
              <template slot-scope="scope">
                <div class="actionplansty">
                  <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.studName" placement="top">
                    <el-button type="text" size="small" @click="personalDetail(scope.$index, scope.row)">{{ scope.row.studName
                      }}</el-button>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="studNo" width="100" label="学号"></el-table-column>
            <el-table-column prop="grade" width="100" label="年级"></el-table-column>

            <el-table-column prop="baseName" label="专业基地"></el-table-column>
            <el-table-column prop="deptName" label="轮转科室"></el-table-column>
            <el-table-column prop label="计划轮转时间">
              <template slot-scope="scope">
                <span>{{ scope.row.planBeginTime }} - {{ scope.row.planEndTime }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="evaluateMonth" label="应评价月份"></el-table-column>
            <el-table-column prop="evaluatedMonth" label="评价日期"></el-table-column>
            <el-table-column prop="score" width="50" label="评分"></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="opendetail(scope.$index, scope.row)" type="text" size="small" v-if="scope.row.scoreSubmitRecordId">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageno" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"></el-pagination>
        </div>
      </transition>
      <transition name="el-zoom-in-bottom" class="chartBox">
        <my-charts v-if="charts.visible" :AllData="echartsList"></my-charts>
      </transition>
    </div>

    <!--查看详情-->
    <el-dialog title="评价带教老师详情" size="large" :visible.sync="detailteaching" :close-on-click-modal="false">
      <div class="funcTools" style="margin-top: 0;">
        <el-button type="primary" @click="detailexportData">批量导出</el-button>
      </div>
      <el-table ref="detailTable" :data="detailList" v-loading="loading" border tooltip-effect="dark">
        <!--<el-table-column type ="index" width = "65" label = "序号" ></el-table-column>-->
        <el-table-column prop="name" label="带教老师">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.name" placement="top">
                <span>{{ scope.row.name }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="finishpointtable " v-for="(item, index) in detaillisttitle" :key="index" width="150" :label="item.title">
          <template slot-scope="scope">
            <template v-for="(item2, index2) in scope.row.finishpointtable">
              <template v-if="index == index2">
                <div class="actionplansty">
                  <el-tooltip effect="light" popper-class="zy-limit-width" :content="item2.content" placement="top">
                    <span>{{ item2.content }}</span>
                  </el-tooltip>
                </div>
              </template>
            </template>
          </template>
        </el-table-column>

        <!--<el-table-column prop = "totalscore" label ="得分"></el-table-column>-->
        <el-table-column prop="recommend" label="是否推荐其为优秀带教老师">
          <template slot-scope="scope">
            <template>
              <div v-if="scope.row.recommend == 0">是</div>
              <div v-if="scope.row.recommend == 1">否</div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="advise" width="130" label="意见和建议">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.advise" placement="left">
                <span>{{ scope.row.advise }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="hundredmarksystem" label="百分制"></el-table-column>
        <el-table-column prop="doctorname" label="住院医" width="120">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.doctorname" placement="top">
                <span>{{ scope.row.doctorname }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="evaluationmonth" label="评价日期" width="100"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="预览" :visible.sync="dialogVisible" width="80%" :before-close="handleClose" class="selfComp">
      <scoring-table :id="previewId" :isAnswer="isAnswer" :needHeader="needHeader"></scoring-table>
    </el-dialog>
    <!-- 职工信息 -->
    <employee-info :dialogEmployee.sync="dialogEmployee" :currentDataId="currentDataId"></employee-info>
    <student-personal-Info :studentDetailId="studentDetailId" :dialogRecords.sync="dialogRecords"></student-personal-Info>
  </div>
</template>
<script>
  import {
    post,
    getCookie,
    exportWord,
    exportExcel,
    currentYear
  } from "../../config/util";
  import myCharts from "../../components/echartEvaluation";
  import employeeInfo from "../../components/employeeInfo.vue";
  import studentPersonalInfo from "../../components/studentPersonalInfo.vue";
  import scoringTable from "../../components/scoringTable.vue";
  import hospitalBaseDept1 from "../../components/hospitalBaseDept1"
  import moment from 'moment';
  export default {
    components: {
      myCharts,
      employeeInfo,
      studentPersonalInfo,
      scoringTable,
      hospitalBaseDept1
    },
    data() {
      return {
        showDeptTree: true,
        hasHospital: false,
        rightNowClear: 0,
        previewId: "",
        isAnswer: true,
        needHeader: true,
        dialogVisible: false,
        currentDataId: "", // 当前点击职工详情信息
        studentDetailId: "",
        dialogEmployee: false, //职工详情弹窗
        dialogRecords: false,
        queryForm: {
          hospitalId: "",
          newbaseid: "",
          newdepartment: "",
          inputquery: "",
          startime: "",
          endtime: "",
          hospitalIdForBase: "",
          state: "",
          grade: "",
        },
        //全部
        newroomList: [],
        newdeptList: [],
        pageno: 1,
        pagesize: 10,
        totalCount: 0,

        gradelist: [],
        rateList: [],
        echartsList: [],
        roomList: [],
        finishpointtablelist: [],
        baseList: [],
        newRoomList: [],
        detailteaching: false,
        detailList: [],
        detaillistoffor: [],
        tabletitlelist: [],
        detaillisttitle: [],
        detail_evaluationmonth: "",
        detail_evaluatedid: "",
        charts: {
          title: "图表",
          visible: false,
          loading: false,
          bar: {},
          pie: {}
        },
        usePage: false,
        ordertype: "",
        exportOptions: {},
        loading: false,

        stateList: [
          { val: 0, content: '未评价' },
          { val: 1, content: '已评价' }
        ]
      };
    },
    computed: {},
    mounted() {
      this.queryForm.startime = currentYear();
      this.queryForm.endtime = currentYear();
      this.gethospitaltree();
      this.initGradeList();
    },
    watch: {},

    methods: {
      setQueryFormOne(form) {
        if (form.hospitalIdForBase == "") {
          this.queryForm.newbaseid = form.baseId
          this.queryForm.hospitalIdForBase = ""
        } else {
          this.queryForm.newbaseid = ""
          this.queryForm.hospitalIdForBase = form.hospitalIdForBase
        }
        if (form.hospitalId == "") {
          this.queryForm.hospitalId = ""
          this.queryForm.newdepartment = form.deptId
        } else {
          this.queryForm.hospitalId = form.hospitalId
          this.queryForm.newdepartment = ""
        }
      },
      employeeDetail(index, row) {
        console.log(row);
        this.dialogEmployee = true;
        // textData-fix
        this.currentDataId = row.teacherId;
      },
      personalDetail(index, row) {
        console.log(111);
        this.studentDetailId = row.studId;
        this.dialogRecords = true;
        console.log(row);
      },
      //表头扩展
      renderHeader(h, { column }) {
        return (
          <el-tooltip
            class="item"
            effect="dark"
            content={column.label}
            placement="top"
          >
            <span>{column.label}</span>
          </el-tooltip>
        );
      },
      showEcharts() {
        if (this.charts.loading) return;
        this.charts.loading = true;
        if (this.charts.visible) {
          //显示表格
          this.charts.visible = false;
          this.charts.title = "图表";
          this.echartsList = [];
          this.getRateList(
            this.pageno,
            this.pagesize,
            this.queryForm.newbaseid,
            this.queryForm.newdepartment,
            this.queryForm.startime,
            this.queryForm.endtime,
            this.queryForm.inputquery,
            this.queryForm.grade,
            this.queryForm.state
          );
        } else {
          //显示图表
          this.charts.visible = true;
          this.charts.title = "表格";
          this.rateList = [];
          this.getRateList(
            "",
            "",
            this.queryForm.newbaseid,
            this.queryForm.newdepartment,
            this.queryForm.startime,
            this.queryForm.endtime,
            this.queryForm.inputquery,
            this.queryForm.grade,
            this.queryForm.state
          );
        }
      },
      handleSizeChange(size) {
        this.pagesize = size;
        this.getRateList(
          this.pageno,
          this.pagesize,
          this.queryForm.newbaseid,
          this.queryForm.newdepartment,
          this.queryForm.startime,
          this.queryForm.endtime,
          this.queryForm.inputquery,
          this.queryForm.grade,
          this.queryForm.state
        );
      },
      handleCurrentChange(currentPage) {
        this.pageno = currentPage;
        this.usePage = true;
        this.getRateList(
          this.pageno,
          this.pagesize,
          this.queryForm.newbaseid,
          this.queryForm.newdepartment,
          this.queryForm.startime,
          this.queryForm.endtime,
          this.queryForm.inputquery,
          this.queryForm.grade,
          this.queryForm.state
        );
      },
      /*表格降序升序*/
      PercentileOrdering: function (column) {
        //0-降序，1-升序
        if (column && column.order == "descending") {
          this.ordertype = 0;
        } else if (column && column.order == "ascending") {
          this.ordertype = 1;
        } else {
          this.ordertype = "";
        }
        this.getRateList(
          this.pageno,
          this.pagesize,
          this.queryForm.newbaseid,
          this.queryForm.newdepartment,
          this.queryForm.startime,
          this.queryForm.endtime,
          this.queryForm.inputquery,
          this.queryForm.grade,
          this.queryForm.state
        );
      },
      getRateList(
        pagenum,
        pagesize,
        baseVal,
        deptidVal,
        stardate,
        enddate,
        searchVal,
        gradeVal
      ) {
        let self = this;
        self.loading = true;
        if (!self.charts.visible) {
          pagenum = 1;
          if (this.usePage) {
            pagenum = this.pageno;
          } else {
            pagenum = this.pageno = 1;
          }
        } else {
          pagenum = "";
          pagesize = "";
        }
        self.exportOptions = {
          turngrade: gradeVal,
          startdate: this.queryForm.startime == null ? "" : moment(this.queryForm.startime).format('YYYY-MM'), //评价月份
          enddate: this.queryForm.endtime == null ? "" : moment(this.queryForm.endtime).format('YYYY-MM'), //评价月份
          baseid: this.queryForm.newbaseid, //基地id
          doctoroffice: this.queryForm.newdepartment, //科室id
          hospitalId: this.queryForm.hospitalId,
          hospitalIdForBase: this.queryForm.hospitalIdForBase,
          type: 1,
          searchinfo: this.queryForm.inputquery,
          ordertype: self.ordertype,
          evaluateflag: this.queryForm.state
        };
        self.loading = true;
        post("/turn/queryevaluatedlist", {
          command: "turn/queryevaluatedlist",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          pagenum: pagenum, //1
          turngrade: gradeVal,
          hospitalId: this.queryForm.hospitalId,
          pagepersize: pagesize, //10
          startdate: this.queryForm.startime == null ? "" : moment(this.queryForm.startime).format('YYYY-MM'), //评价月份
          enddate: this.queryForm.endtime == null ? "" : moment(this.queryForm.endtime).format('YYYY-MM'), //评价月份
          baseid: this.queryForm.newbaseid, //基地id
          doctoroffice: this.queryForm.newdepartment, //科室id
          hospitalId: this.queryForm.hospitalId,
          hospitalIdForBase: this.queryForm.hospitalIdForBase,
          type: 1,
          searchinfo: this.queryForm.inputquery,
          ordertype: self.ordertype,
          evaluateflag: this.queryForm.state
        })
          .then(function (data) {
            self.loading = false;
            if (data && data.errcode == 0) {
              self.rateList = data.evaluatedlist;
              if (self.charts.visible) {
                self.echartsList = data.evaluatedlist;
              }
              self.tabletitlelist = data.evaluatedlist.length > 0 ? data.evaluatedlist[0].finishpointtable : "";
              self.totalCount = data.totalcount;
            } else {
              self.rateList = [];
              self.echartsList = [];
              self.tabletitlelist = [];
            }
            self.charts.loading = false;
            self.usePage = false;
          })
          .catch(function (error) {
            self.loading = false;
          });
      },
      queryAll: function () {
        let self = this;
        this.rightNowClear = this.rightNowClear + 1
        this.queryForm.hospitalId = ""
        this.queryForm.hospitalIdForBase = ""
        self.queryForm.grade = "";
        self.queryForm.newbaseid = "";
        self.queryForm.newdepartment = "";
        self.queryForm.inputquery = "";
        self.queryForm.state = "";
        self.queryForm.startime = currentYear();
        self.queryForm.endtime = currentYear();
        self.getRateList(
          this.pageno,
          this.pagesize,
          "",
          "",
          self.queryForm.startime,
          self.queryForm.endtime,
          ""
        );
      },
      gettime: function (date) {
        //选取时间段
        this.queryForm.startime = date; //选取时间段
      },
      getendtime: function (date) {
        //选取时间段
        this.queryForm.endtime = date; //选取时间段
      },
      query: function () {
        //按条件查询，查询按钮
        let self = this;
        self.getRateList(
          self.pageno,
          self.pagesize,
          self.queryForm.newbaseid,
          self.queryForm.newdepartment,
          self.queryForm.startime,
          self.queryForm.endtime,
          self.queryForm.inputquery,
          self.queryForm.grade,
          self.queryForm.state
        );
      },
      opendetail: function (index, row) {
        console.log(row);
        let self = this;
        if (row.scoreSubmitRecordId) {
          self.previewId = row.scoreSubmitRecordId;
          console.log(self.previewId);
          self.dialogVisible = true;
        } else {
          this.$message("暂无详情");
        }

        //查看详情
        //   let self = this;
        //   self.detailteaching = true;
        //   self.detail_evaluationmonth = row.evaluationmonth;
        //   self.detail_evaluatedid = row.evaluatedid;
        //   post("/turn/queryevaluatedinfo", {
        //     command: "turn/queryevaluatedinfo",
        //     sessionid: getCookie("sid"),
        //     loginid: getCookie("uid"),
        //     evaluationmonth: row.evaluationmonth, //评价月份
        //     evaluatedid: row.evaluatedid, //被评价教师或科室ID
        //     type: 1,
        //     pagenum: 1, //1
        //     pagepersize: 100 //10
        //   })
        //     .then(function(data) {
        //       if (data && data.errcode == 0) {
        //         self.detailList = data.evaluateddetaillist;
        //         if (data.evaluateddetaillist.length > 0) {
        //           self.detaillisttitle =
        //             data.evaluateddetaillist[0].finishpointtable;
        //         }
        //       }
        //     })
        //     .catch(function(error) {
        //       //console.log(error)
        //     });
      },
      handleClose() {
        this.dialogVisible = false;
      },
      exportData: function () {
        //批量导出
        let self = this;
        let data = {
          command: "turn/queryevaluatedlist",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          startdate: this.queryForm.startime, //评价月份
          enddate: this.queryForm.endtime,
          type: 1,
          ordertype: self.ordertype,
          ...self.exportOptions
        };
        console.log(data);
        exportExcel(data);
      },
      detailexportData: function () {
        //查看详情批量导出
        let self = this;
        let data = {
          command: "turn/queryevaluatedinfo",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          evaluationmonth: self.detail_evaluationmonth, //评价月份
          evaluatedid: self.detail_evaluatedid, //被评价教师或科室ID
          type: 1
        };
        exportExcel(data);
      },

      initGradeList: function () {
        //年级查询
        let self = this;
        post("turnbaseinfo/turnbaseinfolevel", {
          command: "turnbaseinfo/turnbaseinfolevel",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          code: "turngrade"
        })
          .then(function (data) {
            if (data && data.errcode == 0) {
              self.gradelist = JSON.parse(data.baseinfolevellist);
            }
          })
          .catch(function (error) {
            //console.log(error)
          });
      },

      gethospitaltree: function () {
        //带权限的基地科室和病区
        let self = this;
        post("/turnbaseinfo/getusermanagerdepttree", {
          command: "turnbaseinfo/getusermanagerdepttree",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          uid: getCookie("uid")
        })
          .then(function (data) {
            if (data && data.errcode == 0) {
              let arr = data.depttree.childlist;
              for (let i = 0; i < data.depttree.childlist.length; i++) {
                for (
                  let j = 0;
                  j < data.depttree.childlist[i].childlist.length;
                  j++
                ) {
                  if (
                    data.depttree.childlist[i].childlist[j].childlist.length > 0
                  ) {
                    data.depttree.childlist[i].childlist[j].childlist.forEach(
                      k => {
                        arr[i].childlist.push(k);
                      }
                    );
                  }
                }
              }
              self.newroomList = arr;
              // self.newroomList = data.depttree.childlist;
              self.getRateList(
                self.pageno,
                self.pagesize,
                "",
                "",
                self.queryForm.startime,
                self.queryForm.endtime,
                ""
              );
            }
          })
          .catch(function (error) {
            //console.log(error)
          });
      },
      newbasechange: function () {
        let self = this;
        self.queryForm.newdepartment = "";
        self.newdeptList = [];
        self.newroomList.map(item => {
          if (self.queryForm.newbaseid == item.id) {
            self.newdeptList = item.childlist;
          }
        });
      }
    }
  };
</script>
<style>
  .scoringTemplate .selfComp .el-dialog__body {
    padding-top: 0px;
  }
</style>
<style scoped>
  .wapper {
    padding: 0 20px;
  }

  .topTools {
    min-height: 50px;
  }

  .funcTools {
    margin-bottom: 15px;
  }

  .zy-tool {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .queryAll {
    /* float: left; */
    margin-right: 10px;
  }

  .zy-tool .el-form-item {
    margin-bottom: 10px;
  }

  .zy-tool .el-select {
    width: 120px;
  }

  .search {
    float: right;
  }

  .querybtn {
    margin-left: 20px;
    margin-bottom: 10px;
  }

  .flexForm {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
  }
</style>