<template>
  <div class="wapper">
    <div class="topTools">
      <div class="queryTools">
        <!-- <div style="float:left"> -->
        <!-- <el-button  type ="primary"  @click = "exportData">批量导出</el-button>
        <el-button  type ="primary"  @click = "showEcharts" :loading="charts.loading">查看{{charts.title}}</el-button>-->
        <!-- </div> -->
        <el-form style="margin-top:15px;display: flex;flex-wrap: wrap;align-items:flex-start" :model="queryForm" :inline="true" ref="queryForm"
          label-width="70px">
          <div class="queryAll" style="margin-right:0;">
            <el-button type="text" @click="queryAll">全部</el-button>
          </div>
          <hospital-base-dept1 :clearAll="rightNowClear" @updateSelectIds="setQueryFormOne" :hasHospital="hasHospital" :showDeptTree="showDeptTree"></hospital-base-dept1>
          <el-form-item label="年级" prop>
            <el-select filterable v-model="queryForm.grade" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option v-for="item in gradelist" :key="item.key" :label="item.name" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="评分日期" prop style="width: 328px;">
            <el-date-picker style="width: 114px" v-model="queryForm.startime" type="month" placeholder="选择日期" format="yyyy-MM" @change="gettime"></el-date-picker>-
            <el-date-picker style="width: 114px" v-model="queryForm.endtime" type="month" placeholder="选择日期" format="yyyy-MM" @change="getendtime"></el-date-picker>
          </el-form-item>

          <el-form-item label="评价状态" prop>
            <el-select v-model="queryForm.state" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option v-for="item in stateList" :key="item.val" :label="item.content" :value="item.val"></el-option>
            </el-select>
          </el-form-item>

          <el-input style="width: 200px;" v-model="queryForm.inputquery" placeholder="请输入姓名/学号/手机号"></el-input>
          <el-button class="querybtn" type="primary" @click="query" style="display: inline-block;">查询</el-button>
          <el-button type="primary" @click="exportData">批量导出</el-button>
          <el-button class="querybtn2" type="primary" @click="showEcharts" :loading="charts.loading">查看{{ charts.title }}</el-button>
        </el-form>
      </div>
    </div>

    <div style="position:relative;width:100%;">
      <transition name="el-fade-in">
        <div class="dataTable" v-if="!charts.visible">
          <el-table ref="detailTable" :data="rateList" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange"
            @sort-change="PercentileOrdering">
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
            <el-table-column prop="deptName" width="100" label="轮转科室"></el-table-column>
            <el-table-column prop="baseName" label="专业基地"></el-table-column>
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
      <transition name="el-zoom-in-bottom">
        <my-charts v-if="charts.visible" :AllData="echartsList"></my-charts>
      </transition>
    </div>
    <!-- 个人档案 -->
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
    data() {
      return {
        hasHospital: false,
        showDeptTree: true,
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
          grade: "",
          newbaseid: "",
          newdepartment: "",
          startime: "",
          endtime: "",
          inputquery: "",
          hospitalIdForBase: "",
          state: ""

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
        tabletitlelist: [],
        scoreSorting: "", //总分排序
        sortList: [
          { id: -1, name: "全部" },
          { id: 1, name: "降序" },
          { id: 2, name: "升序" }
        ],
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

        stateList: [
          { val: 0, content: '未评价' },
          { val: 1, content: '已评价' }
        ]

      };
    },
    computed: {},
    components: {
      myCharts,
      employeeInfo,
      studentPersonalInfo,
      scoringTable,
      hospitalBaseDept1
    },
    mounted() {
      this.gethospitaltree();
      this.initGradeList();
      this.queryForm.startime = currentYear();
      this.queryForm.endtime = currentYear();
      this.getRateList(
        this.pageno,
        this.pagesize,
        "",
        "",
        "",
        this.queryForm.startime,
        this.queryForm.endtime,
        ""
      );
    },
    watch: {},
    methods: {
      setQueryFormOne(form) {
        // this.queryForm.hospitalId = form.hospitalId
        // this.queryForm.newbaseid = form.baseId
        // this.queryForm.newdepartment = form.deptId

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
        // textData-fix
        this.dialogEmployee = true;
        this.currentDataId = row.teacherId;
      },
      personalDetail(index, row) {
        this.studentDetailId = row.studId;
        this.dialogRecords = true;
      },
      opendetail: function (index, row) {
        let self = this;
        if (row.scoreSubmitRecordId) {
          self.previewId = row.scoreSubmitRecordId;
          self.dialogVisible = true;
        } else {
          this.$message("暂无详情");
        }
      },
      handleSizeChange(size) {
        this.pagesize = size;
        this.getRateList(
          this.pageno,
          this.pagesize,
          this.queryForm.grade,
          this.queryForm.newbaseid,
          this.queryForm.newdepartment,
          this.queryForm.startime,
          this.queryForm.endtime,
          this.queryForm.inputquery,
          this.queryForm.state
        );
      },
      handleCurrentChange(currentPage) {
        this.pageno = currentPage;
        this.usePage = true;
        this.getRateList(
          this.pageno,
          this.pagesize,
          this.queryForm.grade,
          this.queryForm.newbaseid,
          this.queryForm.newdepartment,
          this.queryForm.startime,
          this.queryForm.endtime,
          this.queryForm.inputquery,
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
          this.queryForm.grade,
          this.queryForm.newbaseid,
          this.queryForm.newdepartment,
          this.queryForm.startime,
          this.queryForm.endtime,
          this.queryForm.inputquery,
          this.queryForm.state
        );
      },

      getRateList(
        pagenum,
        pagesize,
        gradeVal,
        baseVal,
        deptidVal,
        stardate,
        enddate,
        searchVal,

      ) {
        let self = this;
        let _pagesize = pagesize;
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
          baseid: this.queryForm.newbaseid, //基地id
          doctoroffice: this.queryForm.newdepartment, //科室id
          startdate: stardate == null ? "" : moment(stardate).format('YYYY-MM'), //评价月份//评价月份
          enddate: enddate == null ? "" : moment(enddate).format('YYYY-MM'), //评价月份//评价月份
          searchinfo: searchVal,
          type: 4,
          hospitalId: this.queryForm.hospitalId,
          hospitalIdForBase: this.queryForm.hospitalIdForBase,
          ordertype: self.ordertype,
          evaluateflag: this.queryForm.state
        };
        post("/turn/queryevaluatedlist", {
          command: "turn/queryevaluatedlist",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          pagenum: pagenum, //1
          pagepersize: pagesize, //10
          turngrade: gradeVal,
          hospitalId: this.queryForm.hospitalId,
          baseid: this.queryForm.newbaseid, //基地id
          doctoroffice: this.queryForm.newdepartment, //科室id
          startdate: stardate == null ? "" : moment(stardate).format('YYYY-MM'), //评价月份//评价月份
          enddate: enddate == null ? "" : moment(enddate).format('YYYY-MM'), //评价月份//评价月份
          searchinfo: searchVal,
          type: 4,
          hospitalIdForBase: this.queryForm.hospitalIdForBase,
          ordertype: self.ordertype,
          evaluateflag: this.queryForm.state

        })
          .then(function (data) {
            if (data && data.errcode == 0) {
              if (data.evaluatedlist) {
                self.rateList = data.evaluatedlist;
                if (self.charts.visible) {
                  self.echartsList = data.evaluatedlist;
                }
                self.totalCount = data.totalcount;
                if (
                  data.evaluatedlist.length > 0 &&
                  data.evaluatedlist[0].finishpointtable
                ) {
                  self.tabletitlelist = data.evaluatedlist[0].finishpointtable;
                }
              } else {
                //接口无返回值
                self.rateList = [];
                self.totalCount = 0;
                self.tabletitlelist = [];
                self.echartsList = [];
              }
              self.charts.loading = false;
            }
            self.usePage = false;
          })
          .catch(function (error) {
            //console.log(error)
          });
      },
      queryAll: function () {
        let self = this;
        this.rightNowClear = this.rightNowClear + 1
        this.queryForm.hospitalId = ""
        self.queryForm.grade = "";
        self.queryForm.newbaseid = "";
        self.queryForm.newdepartment = "";
        self.queryForm.hospitalIdForBase = "";
        self.queryForm.inputquery = "";
        self.queryForm.state = "";
        self.queryForm.startime = currentYear();
        self.queryForm.endtime = currentYear();
        self.getRateList(
          this.pageno,
          this.pagesize,
          "",
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
      handleSelectionChange() {
        //勾选
      },

      query: function () {
        //按条件查询，查询按钮
        let self = this;
        self.getRateList(
          self.pageno,
          self.pagesize,
          self.queryForm.grade,
          self.queryForm.newbaseid,
          self.queryForm.newdepartment,
          self.queryForm.startime,
          self.queryForm.endtime,
          self.queryForm.inputquery,
          self.queryForm.state
        );
      },
      exportData: function () {
        //批量导出
        let self = this;
        let data = {
          command: "turn/queryevaluatedlist",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          startdate: this.queryForm.startime == null ? "" : moment(this.queryForm.startime).format('YYYY-MM'), //评价月份
          enddate: this.queryForm.endtime == null ? "" : moment(this.queryForm.endtime).format('YYYY-MM'), //评价月份
          type: 4,
          ordertype: self.ordertype,
          ...self.exportOptions
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
      //带权限的基地科室
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
            }
          })
          .catch(function (error) {
            //console.log(error)
          });
      },
      newbasechange: function () {
        let self = this;
        self.newdeptList = [];
        self.newroomList.map(item => {
          if (self.queryForm.newbaseid == item.id) {
            self.newdeptList = item.childlist;
            if (self.queryForm.newdepartment) {
              self.queryForm.newdepartment = "";
            }
          }
        });
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
            this.queryForm.grade,
            this.queryForm.newbaseid,
            this.queryForm.newdepartment,
            this.queryForm.startime,
            this.queryForm.endtime,
            this.queryForm.inputquery,
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
            this.queryForm.grade,
            this.queryForm.newbaseid,
            this.queryForm.newdepartment,
            this.queryForm.startime,
            this.queryForm.endtime,
            this.queryForm.inputquery,
            this.queryForm.state

          );
        }
        //                setTimeout(()=>{
        //                    this.charts.loading=false;
        //                },300);
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

  .topTools:after {
    content: "";
    display: table;
    clear: both;
  }

  .funcTools {
    margin: 15px 0px;
  }

  .queryTools {
    /* float:left; */
    width: 100%;
  }

  .queryAll {
    display: inline-block;
  }

  .queryTools .el-form-item {
    width: 190px;
    margin-bottom: 10px;
    /*margin-right:0!important ;*/
  }

  .queryTools .el-select {
    width: 120px;
  }

  .search {
    float: right;
  }

  .querybtn {
    margin-left: 20px;
  }

  .querybtn2 {
    margin-right: 20px;
    margin-bottom: 10px;
  }

  .global-style div.queryTools {
    /* margin-bottom: 10px; */
  }
</style>