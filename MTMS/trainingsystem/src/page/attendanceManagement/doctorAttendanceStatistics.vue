<template>
    <div class="wapper">
        <div class="tools">
            <el-button type="primary" @click="exportData()">批量导出</el-button>
        </div>
        <div class="queryTools">
            <el-form :model="queryForm" :inline="true" ref="queryForm" label-width="70px" class="flexForm">
                <div class="queryAll" style="margin-right:0;">
                    <el-button type="text" @click="queryAll">全部</el-button>
                </div>
                <el-form-item label="专业基地">
                    <el-select v-model="hosBaseDeptName" placeholder="请选择基地" :popper-append-to-body="false" collapse-tags @clear="clearall" clearable>
                        <el-option label="全部" value="" @click.native="clearall"></el-option>
                        <el-option disabled class="baseOption" value></el-option>
                            <el-tree :data="hosBaseTree" :props="defaultProps" ref="tree" check-strictly node-key="id" @node-click="handleNodeClick"
                                class="hosWithNoCheckBox">
                            </el-tree>
                        
                    </el-select>
                </el-form-item>
                <el-form-item label="日期" prop="" style="width: 356px;">
                    <el-date-picker style="width: 133px" v-model="queryForm.startime" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="gettime">
                    </el-date-picker>
                    -
                    <el-date-picker style="width: 133px" v-model="queryForm.endtime" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="getendtime">
                    </el-date-picker>
                </el-form-item>

                <el-input style="width: 200px;" v-model="queryForm.inputquery" placeholder="请输入名字" @keyup.enter.native="query"></el-input>

                <el-button class="querybtn" type="primary" @click="query" style="display: inline-block;">查询</el-button>

            </el-form>
        </div>
        <div style="width:100%;">
            <transition name="el-fade-in">
                <div class="dataTable" v-if="!charts.visible">
                    <el-table ref="detailTable" :data="rateList" border tooltip-effect="dark" style="width: 100%" @sort-change="PercentileOrdering"
                        v-loading="loading">
                        <!--<el-table-column type ="selection" width = "45"  >
                        </el-table-column>-->
                        <el-table-column type="index" fixed width="65" label="序号"></el-table-column>
                        <el-table-column prop="name" fixed width="120" label="姓名">
                            <template slot-scope="scope">
                                <div class="actionplansty">
                                    <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.name" placement="top">
                                        <el-button type="text" size="small" @click="personalDetail(scope.$index, scope.row)">{{scope.row.name}}</el-button>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="code" width="120" label="学号"></el-table-column>
                        <el-table-column prop="mobile" width="120" label="手机号"></el-table-column>
                        <el-table-column prop="sex" width="120" label="性别"></el-table-column>
                        <el-table-column prop="basename" width="120" label="专业基地">
                            <template slot-scope="scope">
                                <div class="actionplansty">
                                    <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.basename" placement="top">
                                        <span>
                                            {{scope.row.basename}}
                                        </span>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="stutype" width="120" label="学员类型">
                            <template slot-scope="scope">
                                <div class="actionplansty">
                                    <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.stutype" placement="top">
                                        <span>
                                            {{scope.row.stutype}}
                                        </span>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="checkinrate" width="110" sortable="custom" label="签到率"></el-table-column>
                        <el-table-column prop="leaverate" width="110" sortable="custom" label="请假率"></el-table-column>
                        <el-table-column prop="absencerate" width="110" sortable="custom" label="旷工率"></el-table-column>
                        <el-table-column prop="leaveearlyrate" width="110" sortable="custom" label="早退率"></el-table-column>
                        <el-table-column prop="laterate" width="110" sortable="custom" label="迟到率"></el-table-column>
                        <!-- <el-table-column prop="other" width="110" sortable="custom" label="其他"></el-table-column> -->

                    </el-table>
                    <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="pageno" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount">
                    </el-pagination>
                </div>
            </transition>
            <transition name="el-zoom-in-bottom">
                <my-charts v-if="charts.visible" :AllData="echartsList"></my-charts>
            </transition>
        </div>
        <!-- 个人档案 -->
        <student-personal-Info :studentDetailId="studentDetailId" :dialogRecords.sync="dialogRecords"></student-personal-Info>
    </div>
</template>
<script>
    import studentPersonalInfo from "../../components/studentPersonalInfo.vue"
    import { post, getCookie, exportWord, exportExcel } from '../../config/util';
    import { mapState, mapActions } from 'vuex';
    import moment from 'moment';
    import myCharts from '../../components/echartPieAndLine'     // echartEvaluation'    //echartPieAndLine
    import hospitalBaseDept from "../../components/hospitalBaseDept"
    const _ = require('lodash');

    export default {
        data() {
            return {
                hosBaseDeptName: "",
                hosBaseTree: [],
                defaultProps: {
                    children: "childrens",
                    label: "name"
                },
                hasDept: false,
                rightNowClear: 0,
                dialogRecords: false,
                studentDetailId: "",
                queryForm: {
                    grade: '', baseid: '', deptid: '', inputquery: '', startime: '', endtime: '', hospitalId: "",
                    newbaseid: "", newdepartment: [], newarea: [],
                },
                //全部
                isnewbaseid: '',
                isnewdepartment: '',
                isnewarea: '',

                baseidlist: [],
                officeidlist: [],
                areaidlist: [],

                newroomList: [],
                newdeptList: [],
                newareaList: [],

                studentsList: [{}],
                pageno: 1,
                pagesize: 10,
                totalCount: 0,

                rateList: [],
                echartsList: [],
                roomList: [],
                finishpointtablelist: [],
                baseList: [],
                newRoomList: [],
                startime: '',
                endtime: '',
                tabletitlelist: [],
                scoreSorting: '',//总分排序
                charts: {
                    title: "图表",
                    visible: false,
                    loading: false,
                    bar: {},
                    pie: {},
                },
                usePage: false,
                ordername: '',   //字段名
                ordertype: '',   //升降序
                exportOptions: {},
                loading: false
            }
        },
        computed: {
            // ...mapState([
            //     'sysTypeNum'
            // ]),
        },
        components: {
            studentPersonalInfo,
            myCharts,
            hospitalBaseDept
        },
        created() {
            this.queryForm.startime = moment(new Date()).format('YYYY-MM-DD');
            this.queryForm.endtime = moment(new Date()).format('YYYY-MM-DD');
        },
        mounted() {
            this.getMyBaseTree()
            this.gethospitaltree();
            this.getRateList(this.pageno, this.pagesize, '', this.queryForm.startime, this.queryForm.endtime, '', '', '');
        },
        watch: {
        },
        methods: {
            getMyBaseTree() {
                let self = this
                post("/base/dept/getHosBaseTree", {}).then(res => {
                    if (res.resCode == 200) {
                        self.hosBaseTree = res.model;
                    }
                });
            },
            handleNodeClick(data, checked, node) {
                this.hosBaseDeptName = data.name
                if (data.deptlevel == 1) {
                    this.queryForm.hospitalId = data.id
                    this.queryForm.newbaseid = ""
                    this.queryForm.deptid = ""
                } else {
                    this.queryForm.hospitalId = ""
                    this.queryForm.newbaseid = data.id
                    this.queryForm.deptid = ""
                }
            },
            clearall() {
                this.queryForm.hospitalId = ""
                this.queryForm.newbaseid = ""
                this.queryForm.deptid = ""
            },
            setQueryFormOne(form) {
                this.queryForm.hospitalId = form.hospitalId
                this.queryForm.newbaseid = form.baseId

            },
            personalDetail(index, row) {
                this.dialogRecords = true;
                // textData-fix
                this.studentDetailId = String(row.uid)
            },
            exportData() {
                let self = this;
                let data = {
                    command: 'workattendance/queryturndoctorattendancestats',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    // systype:this.sysTypeNum,  //1住院医；2实习生
                    ...self.exportOptions
                }
                exportExcel(data);
            },
            handleSizeChange(size) {
                this.pagesize = size;
                this.getRateList(
                    this.pageno, this.pagesize,
                    this.queryForm.newbaseid,
                    this.queryForm.startime, this.queryForm.endtime, this.queryForm.inputquery,
                    this.ordername, this.ordertype,
                )
            },
            handleCurrentChange(currentPage) {
                this.pageno = currentPage;
                this.usePage = true;
                this.getRateList(
                    this.pageno, this.pagesize,
                    this.queryForm.newbaseid,
                    this.queryForm.startime, this.queryForm.endtime, this.queryForm.inputquery,
                    this.ordername, this.ordertype,
                )
            },
            /*表格降序升序*/
            PercentileOrdering: function (column) {    //0-降序，1-升序
                this.ordername = column.prop;
                if (column && column.order == 'descending') {
                    this.ordertype = 0;
                } else if (column && column.order == 'ascending') {
                    this.ordertype = 1;
                } else {
                    this.ordertype = '';
                }
                this.getRateList(
                    this.pageno, this.pagesize,
                    this.queryForm.newbaseid,
                    this.queryForm.startime, this.queryForm.endtime, this.queryForm.inputquery,
                    this.ordername, this.ordertype,
                )
            },
            getRateList(pagenum, pagesize, baseVal, stardate, enddate, searchVal, colname, colvalue) {
                let self = this;
                if (!self.charts.visible) {
                    pagenum = 1;
                    if (this.usePage) {
                        pagenum = this.pageno;
                    } else {
                        pagenum = this.pageno = 1;
                    }
                }
                self.exportOptions = {
                    baseid: baseVal,//基地id
                    starttime: stardate,
                    endtime: enddate,
                    hospitalId: this.queryForm.hospitalId,
                    searchinfo: searchVal,
                    orderobject: colname,
                    ordertype: colvalue
                }
                self.loading = true;
                post('/workattendance/queryturndoctorattendancestats', {
                    command: 'workattendance/queryturndoctorattendancestats',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    pagenum: pagenum,//1
                    hospitalId: this.queryForm.hospitalId,
                    pagepersize: pagesize,//10
                    // systype: this.sysTypeNum,  //1住院医；2实习生
                    baseid: baseVal,//基地id
                    //deptid:deptidVal,//科室id
                    starttime: stardate,
                    endtime: enddate,
                    searchinfo: searchVal,
                    orderobject: colname,
                    ordertype: colvalue,
                    /*cheackinorder:checkinrate,       //签到率
                    leaveorder:"",          //请假率
                    absenceorder:"",        //缺勤率
                    leaveearlyorder:"",     //早退率
                    lateorder:"",           //迟到率
                    otherorder:"",          //其他*/
                }).then(function (data) {
                    self.loading = false;
                    if (data && data.errcode == 0) {
                        if (data.turnDoctorattendancelist) {
                            self.rateList = data.turnDoctorattendancelist;
                            //        if(self.charts.visible){
                            //            self.echartsList = data.deptattendancelist;
                            //        }
                            self.totalCount = data.totalcount;
                            //        self.tabletitlelist = data.evaluatedlist[0].finishpointtable
                        } else {
                            //接口无返回值
                            self.rateList = [];
                            self.totalCount = 0;
                            //        self.tabletitlelist = [];
                            self.echartsList = [];
                        };
                        self.charts.loading = false;
                    }
                    self.usePage = false;
                }).catch(function (error) {
                    self.loading = false;
                    //console.log(error)
                })
            },

            queryAll: function () {
                let self = this;
                this.queryForm.hospitalId = ""
                self.queryForm.grade = "";
                self.queryForm.newbaseid = '';
                self.queryForm.newdepartment = '';
                self.queryForm.inputquery = "";
                self.queryForm.startime = "";
                self.queryForm.endtime = "";
                this.rightNowClear = this.rightNowClear + 1;
                self.clearall();
                self.hosBaseDeptName = ""
                self.getRateList(this.pageno, this.pagesize, '', '', '', '', '', '');
            },
            gettime: function (time) {		//选取时间段
                this.queryForm.startime = moment(new Date(time)).format("YYYY-MM-DD");//选取时间段
            },
            getendtime: function (time) {		//选取时间段
                this.queryForm.endtime = moment(new Date(time)).format("YYYY-MM-DD");//选取时间段
            },

            query: function () {			//按条件查询，查询按钮
                let self = this;
                if (self.queryForm.newbaseid == 0 || self.queryForm.newbaseid == '') {
                    self.isnewbaseid = '';
                    if (self.queryForm.newdepartment == 0 || self.queryForm.newdepartment == '') {
                        self.isnewdepartment = '';
                    }
                    self.isnewarea = '';
                } else {
                    if (self.queryForm.newbaseid && self.queryForm.newbaseid != 0) {

                        self.baseidlist.push(self.queryForm.newbaseid);
                    };
                    if (self.queryForm.newdepartment && self.queryForm.newdepartment != 0) {

                        self.officeidlist.push(self.queryForm.newdepartment);
                    };

                    self.isnewbaseid = self.queryForm.newbaseid;
                    self.isnewdepartment = self.queryForm.newdepartment;
                };
                self.getRateList(
                    self.pageno, self.pagesize,
                    self.queryForm.newbaseid,
                    self.queryForm.startime, self.queryForm.endtime, self.queryForm.inputquery,
                    self.ordername, self.ordertype,
                )

            },
            //带权限的基地科室和病区
            gethospitaltree: function () {
                let self = this;
                post('/turnbaseinfo/getusermanagerdepttree', {
                    command: 'turnbaseinfo/getusermanagerdepttree',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        // newroomList  newdeptList  newareaList
                        self.newroomList = data.depttree.childlist
                        let treeidlist = data.depttree.childlist
                        treeidlist.map(function (index, item) {
                            self.baseidlist.push(item.id)
                            item.childlist.map(function (index2, item2) {
                                self.officeidlist.push(item2.id)
                                item2.childlist.map(function (index3, item3) {
                                    self.areaidlist.push(item3.id)
                                })
                            })
                        })
                    }
                }).catch(function (error) {
                    //console.log(error)
                })
            },
            newbasechange: function () {
                let self = this;
                self.queryForm.newdepartment = '';
                self.newdeptList = [];
                self.queryForm.newarea = '';
                self.newareaList = [];
                self.newroomList.map(function (index, item) {
                    if (self.queryForm.newbaseid == item.id) {
                        self.newdeptList = item.childlist
                    }
                })
            },

            showEcharts() {
                if (this.charts.loading) return;
                this.charts.loading = true;

                if (this.charts.visible) {
                    //显示表格
                    this.charts.visible = false;
                    this.charts.title = '图表';
                    this.echartsList = [];
                    this.getRateList(
                        this.pageno, this.pagesize,
                        this.queryForm.newbaseid,
                        this.queryForm.startime, this.queryForm.endtime, this.queryForm.inputquery,
                        this.ordername, this.ordertype,
                    )
                } else {
                    //显示图表
                    this.charts.visible = true;
                    this.charts.title = '表格';
                    this.rateList = [];
                    this.getRateList(
                        this.pageno, this.pagesize,
                        this.queryForm.newbaseid,
                        this.queryForm.startime, this.queryForm.endtime, this.queryForm.inputquery,
                        this.ordername, this.ordertype,
                    )
                }
                //                setTimeout(()=>{
                //                    this.charts.loading=false;
                //                },300);
            },
        }
    }

</script>
<style scoped>
    .wapper {
        padding: 0 20px;
    }
    ::-webkit-scrollbar {
        width: 5px;
        height: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #c1c1c1;
        border-radius: 32px;
    }

    ::-webkit-scrollbar-track {
        border-radius: 32px;
    }

    .topTools {
        min-height: 50px;
    }

    .topTools:after {
        content: '';
        display: table;
        clear: both;
    }

    .funcTools {
        margin: 15px 0px;
    }

    .queryTools {
        float: left;
        width: 100%;
    }

    .queryAll {
        display: inline-block;
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
    }

    .flexForm {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
    }
    .el-select-dropdown__item {
        overflow: visible;
        height: auto;
    }
</style>
