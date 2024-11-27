<template>
  <div class="wapper">
    <div class="funcTools">
      <el-button type="primary" @click="exportData">批量导出</el-button>
      <el-button type="primary" @click="showEcharts" :loading="charts.loading">查看{{charts.title}}</el-button>
    </div>
    <div class="topTools">
      <div class="queryTools">
        <div class="queryAll">
          <el-button type="text" @click="queryAll">全部</el-button>
        </div>
        <el-form :model="queryForm" :inline="true" ref="queryForm" label-width="70px" class="flexForm">
          <hospital-base-dept1 :clearAll="rightNowClear" @updateSelectIds="setQueryFormOne" :hasHospital="hasHospital" :showDeptTree="showDeptTree"></hospital-base-dept1>
          <el-form-item label="年级" prop>
            <el-select filterable v-model="queryForm.grade" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option v-for="item in gradelist" :key="item.key" :label="item.name" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评分日期" prop style="width: 350px;">
            <el-date-picker style="width: 130px" v-model="queryForm.startime" type="month" placeholder="选择日期" format="yyyy-MM" @change="gettime"></el-date-picker>-
            <el-date-picker style="width: 130px" v-model="queryForm.endtime" type="month" placeholder="选择日期" format="yyyy-MM" @change="getendtime"></el-date-picker>
          </el-form-item>
          <el-form-item label="评价状态" prop>
            <el-select v-model="queryForm.state" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option v-for="item in stateList" :key="item.val" :label="item.content" :value="item.val"></el-option>
            </el-select>
          </el-form-item>
          <el-input style="width: 200px;" v-model="queryForm.inputquery" placeholder="请输入科室名称" @keyup.enter.native="query"></el-input>
          <el-button class="querybtn" type="primary" @click="query" style="display: inline-block;">查询</el-button>
        </el-form>
      </div>
    </div>
    <div style="position:relative;width:100%;">
      <transition name="el-fade-in">
        <div class="dataTable" v-if="!charts.visible">
          <el-table ref="detailTable" :data="rateList" border tooltip-effect="dark" style="width: 100%" @sort-change="PercentileOrdering"
            v-loading="loading">
            <el-table-column prop label="序号" width="50">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 + (pageno - 1) * pagesize }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="deptname" label="科室名称">
              <template slot-scope="scope">
                <div class="actionplansty">
                  <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.deptname" placement="top">
                    <span>{{scope.row.deptname}}</span>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="studName" width="120" label="护陪生">
              <template slot-scope="scope">
                <div class="actionplansty">
                  <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.studName" placement="top">
                    <el-button type="text" size="small" @click="personalDetail(scope.$index, scope.row)">{{scope.row.studName}}</el-button>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="studNo" width="100" label="学号"></el-table-column>
            <el-table-column prop="grade" width="100" label="年级"></el-table-column>
            <!-- <el-table-column prop="deptName" width="100" label="轮转科室"></el-table-column> -->
            <el-table-column prop label="计划轮转时间">
              <template slot-scope="scope">
                <span>{{ scope.row.planBeginTime }} - {{ scope.row.planEndTime }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="baseName" label="专业基地"></el-table-column>
            <el-table-column prop="evaluateMonth" label="应评价月份"></el-table-column>
            <el-table-column prop="evaluatedMonth" label="评价日期"></el-table-column>
            <el-table-column prop="score" width="50" label="评分"></el-table-column>
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="opendetail(scope.$index, scope.row)" type="text" size="small" v-if="scope.row.scoreSubmitRecordId">详情</el-button>
              </template>
            </el-table-column>
          </el-table>

          <!--查看详情-->
          <el-dialog title="评价科室详情" size="large" :visible.sync="detailteaching" :close-on-click-modal="false">
            <div class="funcTools" style="margin-top: 0px;">
              <el-button type="primary" @click="detailexportData">批量导出</el-button>
            </div>
            <el-table ref="detailTable" :data="detailList" border tooltip-effect="dark">
              <!--<el-table-column type ="index" width = "65" label = "序号" ></el-table-column>-->
              <el-table-column prop="name" label="科室名称" width="120">
                <template slot-scope="scope">
                  <div class="actionplansty">
                    <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.name" placement="top">
                      <span>{{scope.row.name}}</span>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop label="序号" width="50">
                <template slot-scope="scope">
                  <span>{{ scope.$index + 1 + (pageno - 1) * pagesize }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
          <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageno" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"></el-pagination>
        </div>
      </transition>
      <transition name="el-zoom-in-bottom">
        <my-charts v-if="charts.visible" :AllData="echartsList"></my-charts>
      </transition>
    </div>
    <el-dialog title="预览" :visible.sync="dialogVisible" width="80%" class="selfComp">
      <scoring-table :id="previewId" :isAnswer="isAnswer" :needHeader="needHeader"></scoring-table>
    </el-dialog>
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
  import myCharts from "@/components/echartEvaluation";
  import studentPersonalInfo from "../../components/studentPersonalInfo.vue";
  import employeeInfo from "../../components/employeeInfo.vue";
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
          deptId: "",
          newbaseid: "",
          inputquery: "",
          startime: "",
          endtime: "",
          hospitalIdForBase: "",
          grade: "",
          state: ""
        },
        //全部
        newroomList: [],
        pageno: 1,
        pagesize: 10,
        totalCount: 0,

        gradelist: [],
        rateList: [],
        echartsList: [],
        roomList: [],
        finishpointtablelist: [],
        baseList: [],
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
        ordertype: "", //0-jiangxu,1-shengxu
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
        // this.queryForm.hospitalId = form.hospitalId
        // this.queryForm.newbaseid = form.baseId
        // this.queryForm.deptId = form.deptId

        if (form.hospitalIdForBase == "") {
          this.queryForm.newbaseid = form.baseId
          this.queryForm.hospitalIdForBase = ""
        } else {
          this.queryForm.newbaseid = ""
          this.queryForm.hospitalIdForBase = form.hospitalIdForBase
        }
        if (form.hospitalId == "") {
          this.queryForm.hospitalId = ""
          this.queryForm.deptId = form.deptId
        } else {
          this.queryForm.hospitalId = form.hospitalId
          this.queryForm.deptId = ""
        }
      },
      showEcharts() {
        if (this.charts.loading) return;
        this.charts.loading = true;
        //                setTimeout(()=>{
        //                    this.charts.loading=false;
        //                },300);
        if (this.charts.visible) {
          //显示表格
          this.charts.visible = false;
          this.charts.title = "图表";
          this.echartsList = [];
          this.getRateList(
            this.pageno,
            this.pagesize,
            this.queryForm.newbaseid,
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
          this.queryForm.startime,
          this.queryForm.endtime,
          this.queryForm.inputquery,
          this.queryForm.grade,
          this.queryForm.state
        );
      },
      getRateList(pagenum, pagesize, baseVal, stardate, enddate, searchVal) {
        let self = this;
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
          turngrade: this.queryForm.grade,
          startdate: stardate == null ? "" : moment(stardate).format('YYYY-MM'), //评价月份
          enddate: enddate == null ? "" : moment(enddate).format('YYYY-MM'), //评价月份
          baseid: this.queryForm.newbaseid, //基地id
          type: 5,
          hospitalIdForBase: this.queryForm.hospitalIdForBase,
          hospitalId: this.queryForm.hospitalId,
          deptId: this.queryForm.deptId,
          doctoroffice: this.queryForm.deptId,
          searchinfo: this.queryForm.inputquery,
          baseidlist: self.baseidlist,
          officeidlist: self.officeidlist,
          areaidlist: self.areaidlist,
          ordertype: self.ordertype,
          evaluateflag: this.queryForm.state
        };
        self.loading = true;
        post("/turn/queryevaluatedlist", {
          command: "turn/queryevaluatedlist",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          pagenum: pagenum, //1
          turngrade: this.queryForm.grade,
          pagepersize: pagesize, //10
          startdate: stardate == null ? "" : moment(stardate).format('YYYY-MM'), //评价月份
          enddate: enddate == null ? "" : moment(enddate).format('YYYY-MM'), //评价月份
          baseid: this.queryForm.newbaseid, //基地id
          hospitalIdForBase: this.queryForm.hospitalIdForBase,
          type: 5,
          searchinfo: this.queryForm.inputquery,
          baseidlist: self.baseidlist,
          hospitalId: this.queryForm.hospitalId,
          doctoroffice: this.queryForm.deptId,
          officeidlist: self.officeidlist,
          areaidlist: self.areaidlist,
          ordertype: self.ordertype,
          evaluateflag: this.queryForm.state
        })
          .then(function (data) {
            self.loading = false;
            if (data && data.errcode == 0) {
              if (data.evaluatedlist) {
                self.rateList = data.evaluatedlist;
                self.tabletitlelist = data.evaluatedlist[0].finishpointtable;
              }
              if (self.charts.visible) {
                self.echartsList = data.evaluatedlist;
              }
              self.totalCount = data.totalcount;
            } else {
              self.rateList = [];
              self.echartsList = [];
              self.totalCount = [];
            }
            self.usePage = false;
            self.charts.loading = false;
          })
          .catch(function (error) {
            self.loading = false;
            //console.log(error)
          });
      },
      queryAll: function () {
        let self = this;
        this.rightNowClear = this.rightNowClear + 1
        this.queryForm.hospitalId = "",
          this.queryForm.hospitalIdForBase = "",
          this.queryForm.deptId = "",
          self.queryForm.newbaseid = "";
        self.queryForm.newdepartment = "";
        self.queryForm.inputquery = "";
        self.queryForm.grade = "";
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
      personalDetail(index, row) {
        console.log(111);
        this.studentDetailId = row.studId;
        this.dialogRecords = true;
        console.log(row);
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
          self.queryForm.startime,
          self.queryForm.endtime,
          self.queryForm.inputquery,
          self.queryForm.grade,
          self.queryForm.state
        );
      },
      opendetail: function (index, row) {
        //查看详情
        // let self = this;
        // self.detailteaching = true;
        // self.detail_evaluationmonth = row.evaluationmonth;
        // self.detail_evaluatedid = row.evaluatedid;
        // post("/turn/queryevaluatedinfo", {
        //   command: "turn/queryevaluatedinfo",
        //   sessionid: getCookie("sid"),
        //   loginid: getCookie("uid"),
        //   evaluationmonth: row.evaluationmonth, //评价月份
        //   evaluatedid: row.evaluatedid, //被评价教师或科室ID
        //   type: 5,
        //   pagenum: 1, //1
        //   pagepersize: 100 //10
        // })
        //   .then(function(data) {
        //     if (data && data.errcode == 0) {
        //       self.detailList = data.evaluateddetaillist;
        //       if (data.evaluateddetaillist.length > 0) {
        //         self.detaillisttitle =
        //           data.evaluateddetaillist[0].finishpointtable;
        //       }
        //     }
        //   })
        //   .catch(function(error) {
        //     //console.log(error)
        //   });
        console.log(row);
        let self = this;
        if (row.scoreSubmitRecordId) {
          self.previewId = row.scoreSubmitRecordId;
          console.log(self.previewId);
          self.dialogVisible = true;
        } else {
          this.$message("暂无详情");
        }
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
          type: 5,
          ...self.exportOptions
        };
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
          type: 5
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


      //带权限的基地科室和病区
      gethospitaltree: function () {
        let self = this;
        post("/turnbaseinfo/getusermanagerdepttree", {
          command: "turnbaseinfo/getusermanagerdepttree",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          uid: getCookie("uid")
        })
          .then(function (data) {
            if (data && data.errcode == 0) {
              self.newroomList = data.depttree.childlist;
              self.getRateList(
                self.pageno,
                self.pagesize,
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
      }
    }
  };
</script>
<style scoped>
  .wapper {
    padding: 0 20px;
  }

  .topTools {
    min-height: 50px;
  }

  .funcTools {
    margin: 15px 0;
    float: none;
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


  .queryTools .el-form-item {
    width: 190px;
    margin-bottom: 10px;
  }

  .queryTools .el-select {
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