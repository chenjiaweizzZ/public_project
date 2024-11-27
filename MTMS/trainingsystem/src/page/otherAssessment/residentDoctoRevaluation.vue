<template>
    <div class="wapper">
        <div class="funcTools">
            <el-button type="primary" @click="exportData">批量导出</el-button>
        </div>
        <div class="topTools">
            <div class="queryTools newQueryTools">
                <el-row>
                    <el-col :span="1">
                        <div class="queryAll">
                            <el-button type="text" @click="queryAll">全部</el-button>
                        </div>
                    </el-col>
                    <el-col :span="18">
                        <el-form :model="queryForm" :inline="true" ref="queryForm" label-width="100px">
                            <div class="mainQuery">
                                <el-form-item label="轮转科室">
                                    <el-select v-model="queryForm.deptidName" placeholder="全部" @change="changeDeptId">
                                        <el-option label="全部" value=""></el-option>
                                        <el-tree :data="turnDeptRoom" node-key="id" :check-strictly="true" :expand-on-click-node="true" :props="defaultProps" @node-click="nodeClick"
                                            ref="treeDom" class="selfTree"></el-tree>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="评价情况" prop="deptid">
                                    <el-select filterable v-model="queryForm.finishinfo" placeholder="请选择">
                                        <el-option label="全部" value=""></el-option>
                                        <el-option v-for="(item,index) in finishinfolist" :key="index" :label="item &&item.name" :value="item &&item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item prop="searchinfo">
                                    <el-input v-model="queryForm.searchinfo" placeholder="请输入姓名/学号" @keyup.enter.native="query"></el-input>
                                </el-form-item>
                            </div>
                            <div class="additionQuery">
                                <el-form-item label="评分日期" prop="starttime">
                                    <el-date-picker v-model="queryForm.starttime" type="month" placeholder="选择日期" format="yyyy-MM" @change="gettime">
                                    </el-date-picker>
                                    -
                                    <el-date-picker v-model="queryForm.endtime" type="month" placeholder="选择日期" format="yyyy-MM" @change="getendtime">
                                    </el-date-picker>
                                </el-form-item>
                            </div>
                        </el-form>
                    </el-col>
                    <el-col :span="5">
                        <div class="queryWrap" style="float:right">

                            <el-button class="querybtn new-el-button" type="primary" @click="query" style="display: inline-block;">
                                查询
                            </el-button>
                        </div>
                    </el-col>
                </el-row>


            </div>
        </div>
        <div class="dataTable">
            <el-table ref="detailTable" :data="rateList"  border tooltip-effect="dark" style="width: 100%;z-index:50;"
                @selection-change="handleSelectionChange" v-loading="showLoading" :element-loading-text="loadingText">
                <!--<el-table-column type ="selection" width = "45"  >-->
                <!--</el-table-column>-->
                <!--<el-table-column type ="index" width = "65" label = "序号" ></el-table-column>-->
                <el-table-column prop="stdname" fixed="left" width="120" label="护培生">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.stdname" placement="top">
                                <el-button type="text" size="small" @click="personalDetail(scope.$index, scope.row)">{{scope.row.stdname}}</el-button>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="username" width="100" label="学号"></el-table-column>
                <el-table-column prop="type" width="120" label="学员类型">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.type" placement="top">
                                <span>
                                    {{scope.row.type}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="sex" label="性别"></el-table-column>
                <el-table-column prop="mobile" width="120" label="手机号"></el-table-column>
                <el-table-column prop="turngradename" label="年级"></el-table-column>
                <el-table-column prop="basename" label="专业基地" width="120">
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
                <!-- <el-table-column prop="deptname" label="科室" width="120">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.deptname" placement="top">
                                <span>
                                    {{scope.row.deptname}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column> -->
                <el-table-column prop="turndeptname" label="轮转科室" width="120">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.turndeptname" placement="top">
                                <span>
                                    {{scope.row.turndeptname}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="evaluatedept" label="评价科室" width="100"></el-table-column>
                <el-table-column prop="evaluateteacher" label="评价带教" width="100"></el-table-column>
                <el-table-column prop="evaluationmonth" label="日期" width="100"></el-table-column>
                <el-table-column fixed="right" width="200" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="showDetailDept(scope.$index, scope.row,'1')" type="text" size="small">评价科室详情
                        </el-button>
                        <el-button @click="showDetailTeaching(scope.$index, scope.row,'2')" type="text" size="small">
                            评价带教详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pagenum" :page-sizes="[10, 20, 50, 100]" :page-size="pagepersize" layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
        </div>

        <el-dialog :title="evaluation.title" :customClass="changeWidth" :visible.sync="dialog.dept" :close-on-click-modal="false"
            size="small" class="special-dialog">
            <el-table :data="evaluation.dept" border>
                <!--<el-table-column type ="index" width = "65" label = "序号" ></el-table-column>-->
                <template v-if="evaluation.type===1">
                    <el-table-column property="name" label="姓名" min-width="100">
                        <template slot-scope="scope">
                            <div class="actionplansty">
                                <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.name" placement="top">
                                    <span>
                                        {{scope.row.name}}
                                    </span>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column property="username" label="工号" min-width="100"></el-table-column>
                    <el-table-column property="mobile" label="手机号码" min-width="100"></el-table-column>
                </template>
                <el-table-column property="deptname" label="科室" min-width="100">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.deptname" placement="top">
                                <span>
                                    {{scope.row.deptname}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <!--<el-table-column property="totalscore" label="总分" ></el-table-column>-->
                <el-table-column property="hundredmarksystem" label="百分制" min-width="180">
                    <template slot-scope="scope">
                        {{ scope.row.hundredmarksystem | hundredmark}}
                    </template>
                </el-table-column>
                <el-table-column property="evaluationmonth" label="评价月份" min-width="100"></el-table-column>
                <!--<el-table-column property="evaluationmonth" label="评价细则"></el-table-column>-->
                <el-table-column fixed="right" min-width="80" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="showDetailEvaluate(scope.$index, scope.row)" type="text" size="small">详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog v-if="dialog.openDetail" :title="evaluation.title" :visible.sync="dialog.openDetail" size="large" :modal-append-to-body="false"
            :close-on-click-modal="false">
            <!--:data="evaluation.dept"-->
            <el-table :data="evaluation.dept" border tooltip-effect="dark">
                <el-table-column property="totalscore" v-for="(value,index) in evaluation.detail" :key="index" :label="value.title" :render-header="handleHelp">
                    <template slot-scope="scope">
                        {{value.score}}
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- 个人档案 -->
        <student-personal-Info :studentDetailId="studentDetailId" :dialogRecords.sync="dialogRecords"></student-personal-Info>
    </div>
</template>
<script>
    import { post, getCookie, exportWord, exportExcel, currentYear, getStorage } from '../../config/util';
    import { mapState, mapActions } from 'vuex';
    import moment from 'moment';
    import studentPersonalInfo from "../../components/studentPersonalInfo.vue"

    const _ = require('lodash');

    export default {
        data() {
            return {
                defaultProps: {
                    label: 'name',
                    children: 'childrens'
                },
                dialogRecords: false,
                studentDetailId: "",
                //查询列表
                queryForm: {
                    hospitalId: "",
                    deptid: '',
                    deptidName: "",
                    finishinfo: '',
                    starttime: '',
                    endtime: '',
                    searchinfo: '',
                    // state:''
                },
                finishinfolist: [
                    {
                        id: 0,
                        name: '未全部完成评价'
                    },
                    {
                        id: 1,
                        name: '未完成评价科室'
                    },
                    {
                        id: 2,
                        name: '未完成评价带教老师'
                    },
                    {
                        id: 3,
                        name: '全部完成评价'
                    },
                ],
                turnDeptRoom: [],//轮转科室（all）
                //分页 三个变量
                pagenum: 1,
                pagepersize: 10,
                totalCount: 0,

                rateList: [],//表格数据
                dialog: {
                    dept: false,
                    teaching: false,
                    size: '',
                    openDetail: false,
                },
                ports: {
                    valuate: '/dailyevaluation/queryturndoctorevaluate',
                    valuateDetail: '/dailyevaluation/queryturndoctorevaluatedetail',
                },
                evaluation: {
                    dept: [],
                    teacher: [],
                    type: 1,
                    title: '评价带教详情',
                    detail: [],
                },
                showLoading: false,
                loadingText: '数据加载中',
                usePage: false,
                exportOptions: {},
                showAdditionQuery: false,
                menuId: ""
            }
        },
        computed: {
            changeWidth() {
                return this.evaluation.type === 1 ? 'cm-large' : 'cm-small';
            }
        },
        components: {
            studentPersonalInfo
        },
        filters:{
			hundredmark(score) {
                if(score == "NaN" || score == "Infinity") {
                    return ""
                }else {
                    return score
                }
            }
		},
        mounted() {
            this.menuId = getStorage("menuId")
            this.initTurnDept();//轮转科室

            //当前年月
            this.queryForm.starttime = currentYear();
            this.queryForm.endtime = currentYear();
            this.query();//获得表格数据
        },
        watch: {

        },
        methods: {
            changeDeptId(val) {
                console.log(val)
                // this.queryForm.deptidName = val == "" || val == undefined ? "全部" : this.queryForm.deptidName
                // this.queryForm.deptid = val == "" || val == undefined ? "" : val
                if (val == undefined || val == null || val == "") {
                    this.queryForm.deptid = ""
                    this.queryForm.hospitalId = ""
                    this.queryForm.deptidName = ""
                }
            },
            nodeClick(node) {
                if (node.havePermission != 1) {
                    return false;
                }
                // this.queryForm.deptid = node.id
                // this.queryForm.deptidName = node.name
                if (node.deptlevel == 1) {
                    this.queryForm.deptid = ""
                    this.queryForm.deptidName = node.name
                    this.queryForm.hospitalId = node.id
                } else {
                    this.queryForm.deptid = node.id
                    this.queryForm.deptidName = node.name
                    this.queryForm.hospitalId = ""
                }

            },
            personalDetail(index, row) {
                this.dialogRecords = true;
                this.studentDetailId = row.stdid
            },
            handleHelp(h, { column }) {
                return (
                    <el-tooltip class="item" effect="light" content={column.label} placement="top">
                        <span style="width:100%;">{column.label}</span>
                    </el-tooltip>
                )
            },

            //显示具体评价详情
            showDetailEvaluate(index, row) {
                this.dialog.openDetail = true;
                this.evaluation.detail = row.finishpointtable;
                this.$set(this.evaluation, "detail", row.finishpointtable)
                this.$set(this, "evaluation", this.evaluation)
                console.log(this.evaluation.detail)
            },
            //导出选项
            exportData: function () {					//批量导出
                let self = this;
                let data = {
                    command: this.ports.valuate.substr(1),
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    ...self.exportOptions
                };
                exportExcel(data);
            },

            _ajax(port, option) {
                let host = '';
                let ports = this.ports[port];
                return post(host + ports, {
                    command: ports.substr(1),
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    ...option
                })
            },
            handleSizeChange(size) {
                this.pagepersize = size;
                this.getRateList();
            },
            handleCurrentChange(currentPage) {
                this.pagenum = currentPage;
                this.usePage = true;
                this.getRateList();
            },
            getRateList() {
                let self = this;
                self.showLoading = true;
                let pagenum = 1;
                if (this.usePage) {
                    pagenum = this.pagenum;
                } else {
                    pagenum = this.pagenum = 1;
                }
                self.exportOptions = {
                    ...this.queryForm
                }
                this._ajax('valuate', {
                    pagenum: pagenum,
                    pagepersize: this.pagepersize,
                    ...this.queryForm
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.rateList = data.doctorevaluatelist;
                        self.totalCount = data.totalcount;
                    }
                    self.showLoading = false;
                    self.usePage = false;
                }).catch(function (error) {
                    //console.log(error);
                    self.showLoading = false;
                })
            },

            gettime: function (date) {		//选取时间段
                this.queryForm.starttime = moment(new Date(date)).format("YYYY-MM");
            },
            getendtime: function (date) {		//选取时间段
                this.queryForm.endtime = moment(new Date(date)).format("YYYY-MM");
            },
            handleSelectionChange() {
                //勾选
            },
            //轮转科室 下拉框
            // initTurnDept() {
            //     let deptList = [];
            //     post('/actionplanbase/getusermanagerdept', {
            //         command: 'actionplanbase/getusermanagerdept',
            //         sessionid: getCookie('sid'),
            //         loginid: getCookie('uid'),
            //         uid: getCookie('uid')
            //     }).then((data) => {
            //         if (data && data.errcode == 0) {
            //             this.turnDeptRoom = data.beanlist.officelist;
            //         }
            //     })
            // },
            // 科室列表
            initTurnDept() {
                this.turnDeptRoom = []
                post("/base/dept/getMyDeptTree", {
                    showHospital: 1,
                    showNoDeptHospital: 0,
                    needBaseDept: false,
                }).then(data => {
                    if (data && data.resCode == 200) {
                        this.turnDeptRoom = data.model;
                    }
                });

            },
            //评价科室
            showDetailDept(index, row) {
                this.dialog.dept = true;
                this.evaluation.type = 5;
                this.evaluation.size = 'small';
                this.evaluation.title = '评价科室详情';
                let option = {
                    stdid: row.stdid,
                    evaluationmonth: row.evaluationmonth,
                    businessid: row.detailid
                };
                this.showDetailAll(option)
            },
            //评价带教老师
            showDetailTeaching(index, row) {
                this.dialog.dept = true;
                this.evaluation.type = 1;
                this.evaluation.size = 'large';
                this.evaluation.title = '评价带教详情';
                let option = {
                    stdid: row.stdid,
                    evaluationmonth: row.evaluationmonth,
                    businessid: row.detailid
                };
                this.showDetailAll(option);
            },
            //请求详情数据
            showDetailAll(option) {
                return this._ajax('valuateDetail', {
                    type: this.evaluation.type, //5评价科室
                    ...option
                }).then(data => {
                    if (data && data.errcode == 0) {
                        this.evaluation.dept = data.detaillist;
                        this.$set(this.evaluation, "dept", data.detaillist)
                    }
                });
            },
            query: function () {			//按条件查询，查询按钮
                this.pagenum = 1;
                this.getRateList();
            },
            queryAll: function () {
                this.$refs.queryForm.resetFields();
                this.queryForm.endtime = '';
                this.queryForm.finishinfo = '';
                this.queryForm.deptid = ""
                this.queryForm.hospitalId = ""
                this.queryForm.deptidName = ""
                this.pagenum = 1;
                this.getRateList();
            },
        },
    }

</script>
<style scoped>
    .wapper {
        padding: 0 20px;
    }
    .topTools {
        height: 50px;
    }


    .queryTools {
        float: left;
        width: 100%;
    }

    .queryAll {
        float: left;
        margin-right: 20px;
    }

    .queryTools .el-form-item {
        width: auto !important;
        margin-bottom: 10px;
    }

    .queryTools .el-form-item {
        width: 100px;
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

    .special-dialog>>>.el-dialog--small {
        min-width: 820px;
    }
</style>