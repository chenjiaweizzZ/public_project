<template>
    <div class="wapper">
        <div class="tool-box">
            <div class="func-tools">
                <el-button type="primary" @click="exportData">批量导出</el-button>
            </div>
            <div class="search-input">
                <el-input style="width:200px" v-model="inputInfo" @keyup.enter.native="doInputQuery" placeholder="请输入考官或者学员姓名"></el-input>
                <el-button type="primary" @click="doInputQuery">搜索</el-button>
            </div>
        </div>
        <div class="top-tools">
            <el-row :gutter="20">
                <el-col :span="1">
                    <el-button type="text" @click="queryAll">全部</el-button>
                </el-col>
                <el-col :span="22">
                    <div class="query-tools">
                        <el-form :model="queryForm" :inline="true">
                            <hospital-base-dept1 @updateSelectIds="setQueryFormOne" :hasHospital="hasHospital" :showDeptTree="showDeptTree"></hospital-base-dept1>
                            <el-form-item label="学生完成状态">
                                <el-select filterable v-model="queryForm.stuFinishStatus" placeholder="请选择">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="item in finishRateList" :key="item.val" :label="item.content" :value="item.val"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="教师完成状态">
                                <el-select filterable v-model="queryForm.teaFinishStatus" placeholder="请选择">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="item in finishRateList" :key="item.val" :label="item.content" :value="item.val"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="科主任完成状态">
                                <el-select filterable v-model="queryForm.directorFinishStatus" placeholder="请选择">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="item in finishRateList" :key="item.val" :label="item.content" :value="item.val"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="学员类型">
                                <el-select filterable v-model="queryForm.stuType" placeholder="请选择">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="item in selectOptions.stud_type" :key="item.key" :label="item.name" :value="item.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="年级">
                                <el-select filterable v-model="queryForm.turnGrade" placeholder="请选择">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="item in gradeList" :key="item.key" :label="item.name" :value="item.key">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-button style="margin-left: 10px;" class="btn-search" type="primary" @click="querySeach">
                                查询</el-button>
                        </el-form>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="container">
            <el-table :data="tableData" border tooltip-effect="dark" style="width: 100%" v-loading="loadingShow">
                <el-table-column label="姓名" prop="stdName" min-width="120" fixed>
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" :content="scope.row.stdName" placement="top">
                                <el-button type="text" size="small" @click="personalDetail(scope.$index, scope.row)">{{scope.row.stdName}}</el-button>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="学号" prop="username" min-width="120">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" :content="scope.row.username" placement="top">
                                <span>{{scope.row.username}}</span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="年级" prop="grade" min-width="100"></el-table-column>
                <el-table-column label="手机号" prop="moblie" min-width="120"></el-table-column>
                <el-table-column label="专业基地" prop="profBase" min-width="150">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" :content="scope.row.profBase" placement="top">
                                <span>{{scope.row.profBase}}</span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="学员类型" prop="stdType" min-width="120"></el-table-column>
                <el-table-column label="轮转科室" prop="turnDept" min-width="120">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" :content="scope.row.turnDept" placement="top">
                                <span>{{scope.row.turnDept}}</span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="带教老师" prop="tecName" min-width="120"></el-table-column>
                <el-table-column label="计划轮转周期" prop="planTime" min-width="150">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" :content="scope.row.planTime" placement="top">
                                <span>{{scope.row.planTime}}</span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="实际轮转周期" prop="realTime" min-width="150">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" :content="scope.row.realTime" placement="top">
                                <span>{{scope.row.realTime}}</span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="科室轮转状态" prop="deptStatus" min-width="100"></el-table-column>
                <el-table-column label="学生完成状态" prop="stdStatus" min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.stdStatus == 0">未完成</span>
                        <span v-if="scope.row.stdStatus == 1">完成</span>
                    </template>
                </el-table-column>
                <el-table-column label="教师完成状态" prop="tecStatus" min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.tecStatus == 0">未完成</span>
                        <span v-if="scope.row.tecStatus == 1">完成</span>
                    </template>
                </el-table-column>
                <el-table-column label="科主任完成状态" prop="directorStatus" min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.directorStatus == 0">未完成</span>
                        <span v-if="scope.row.directorStatus == 1">完成</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" min-width="100" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="detailRow(scope.$index, scope.row)" type="text" size="small">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pagenum" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
        </div>
        <!-- 查看出科评价详情 -->
        <el-dialog :title="dialogTitle" :visible.sync="detailDialog" :close-on-click-modal="false">
            <!-- <el-button type="primary">导出为PDF</el-button> -->
            <div class="stu-box">
                <div class="title">出科小结:</div>
                <div class="content">{{summaryData.stdAppraise}}</div>
                <div class="date-box">
                    <div>{{summaryData.stdname}}</div>
                    <div>{{summaryData.stdDate}}</div>
                </div>
            </div>
            <div class="tea-box">
                <div class="title">带教评语:</div>
                <div class="content">{{summaryData.tecAppraise}}</div>
                <!-- <div class="singnature-box">
                    <img :src="summaryData.tecsignature">
                </div> -->
                <div class="date-box" v-if="summaryData.phase > 0">
                    <div>{{summaryData.tecname}}</div>
                    <div>{{summaryData.tecDate}}</div>
                </div>
            </div>
            <div class="director-box">
                <div class="title-box">
                    <div class="title">科主任鉴定:</div>
                    <el-radio v-if="summaryData.status == 1" class="radio" v-model="summaryData.status" label="1">同意出科</el-radio>
                    <el-radio v-if="summaryData.status == 2" class="radio" v-model="summaryData.status" label="2">不同意出科</el-radio>
                </div>
                <div class="content">{{summaryData.directorAppraise}}</div>
                <!-- <div class="singnature-box">
                    <img :src="summaryData.directorsignature">
                </div> -->
                <div class="date-box" v-if="summaryData.phase > 1">
                    <div>{{summaryData.directorname}}</div>
                    <div>{{summaryData.directorDate}}</div>
                </div>
            </div>
        </el-dialog>

        <!-- 个人档案 -->
        <student-personal-Info :studentDetailId="studentDetailId" :dialogRecords.sync="dialogRecords"></student-personal-Info>
    </div>
</template>

<script>
    import studentPersonalInfo from "../../components/studentPersonalInfo.vue"
    import { post, get, getCookie, setTitle, exportMouldExcel, exportExcel } from '../../config/util'
    import { mapState, mapActions } from 'vuex'
    import api from '../../config/common_data.js';
    import hospitalBaseDept1 from "../../components/hospitalBaseDept1"
    var _ = require('lodash');
    export default {
        data() {
            return {
                hasHospital: false,
                showDeptTree: true,
                rightNowClear: 0,
                dialogRecords: false,
                studentDetailId: "",
                exportOptions: {}, // 导出
                exportInput: false,
                pagenum: 1,
                pagesize: 10,
                totalCount: 0,
                inputInfo: '', // 搜索内容
                queryForm: {
                    hospitalId: "",
                    baseid: '', // 基地
                    deptid: '', // 科室
                    stuFinishStatus: '', // 学员完成状态 
                    teaFinishStatus: '', // 教师完成状态
                    directorFinishStatus: '', // 科主任完成状态
                    stuType: '', // 学员类型
                    turnGrade: '', // 年级
                    majorBaseid: '', // 专业基地
                    hospitalIdForBase: "",
                },
                // 基地
                baseidList: [],
                // 科室
                deptInBaseList: [],
                // 完成状态
                finishRateList: [
                    { val: 0, content: '未完成' },
                    { val: 1, content: '完成' }
                ],
                gradeList: [], // 年级
                loadingShow: false,
                tableData: [],
                // 查看
                dialogTitle: '',
                detailDialog: false,
                summaryData: {},
            }
        },
        computed: {
            ...mapState(['selectOptions']),
        },
        components: {
            studentPersonalInfo,
            hospitalBaseDept1
        },
        methods: {
            ...mapActions(['initSelectList']),
            setQueryFormOne(form) {
                console.log(form, "-----------")
                if (form.hospitalIdForBase == "") {
                    this.queryForm.baseid = form.baseId
                    this.queryForm.hospitalIdForBase = ""
                } else {
                    this.queryForm.baseid = ""
                    this.queryForm.hospitalIdForBase = form.hospitalIdForBase
                }
                if (form.hospitalId == "") {
                    this.queryForm.hospitalId = ""
                    this.queryForm.deptid = form.deptId
                } else {
                    this.queryForm.deptid = ""
                    this.queryForm.hospitalId = form.hospitalId
                }

            },
            personalDetail(index, row) {
                this.dialogRecords = true;
                // textData-fix
                this.studentDetailId = row.uid
            },
            exportData() {
                let data = {
                    command: 'turnAppraise/querypcTurnAppraiseInfo',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    ...this.exportOptions
                }
                exportExcel(data);
            },

            // 查询出科小结信息
            getTurnAppraise(turnId, detailId) {
                post('/turnAppraise/queryTurnAppraise', {
                    command: 'turnAppraise/queryTurnAppraise',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    turnId: turnId,
                    roleId: 2,
                    detailId: detailId
                }).then(data => {
                    if (data && data.errcode == 0) {
                        this.summaryData = data.result;
                    }
                }).catch(error => {

                })
            },

            // 获取用户基础数据
            getTurnId(detailId) {
                return new Promise((resolve, reject) => {
                    post('/turn/getturndetailbyid', {
                        command: 'turn/getturndetailbyid',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        plandetailid: detailId,
                    }).then(data => {
                        resolve(data.detailinfo.turnId);
                    }).catch(data => {
                        reject(data);
                    })
                });
            },

            // 查看详情
            detailRow(index, row) {
                this.summaryData = {};
                let detailId = row.detailId;
                this.dialogTitle = row.stdName + '的出科小结';
                this.detailDialog = true;
                this.getTurnId(detailId).then(res => {
                    this.getTurnAppraise(res, detailId);
                });
            },

            doInputQuery() {
                this.queryForm = {
                    hospitalId: "",
                    baseid: '', // 基地
                    deptid: '', // 科室
                    stuFinishStatus: '', // 学员完成状态 
                    teaFinishStatus: '', // 教师完成状态
                    directorFinishStatus: '', // 科主任完成状态
                    stuType: '', // 学员类型
                    turnGrade: '', // 年级
                    majorBaseid: '', // 专业基地
                    hospitalIdForBase: '', // 专业基地
                };
                this.pagenum = 1;
                this.exportInput = true;
                this.initData();
            },

            queryAll() {
                this.pagenum = 1;
                this.queryForm = {
                    hospitalId: "",
                    baseid: '', // 基地
                    deptid: '', // 科室
                    stuFinishStatus: '', // 学员完成状态 
                    teaFinishStatus: '', // 教师完成状态
                    directorFinishStatus: '', // 科主任完成状态
                    stuType: '', // 学员类型
                    turnGrade: '', // 年级
                    majorBaseid: '', // 专业基地,
                    hospitalIdForBase: ""
                };
                this.initData();
            },

            querySeach() {
                this.pagenum = 1;
                this.inputInfo = '';
                this.exportInput = false;
                this.initData();
            },
            /*分页区*/
            handleSizeChange(size) {
                this.pagesize = size;
                this.initData()
            },
            handleCurrentChange(currentPage) {
                this.pagenum = currentPage;
                this.initData()
            },

            initData() {
                let option = {
                    hospitalId: this.queryForm.hospitalId,
                    baseId: this.queryForm.baseid,
                    deptId: this.queryForm.deptid,
                    stdStatus: this.queryForm.stuFinishStatus,
                    tecStatus: this.queryForm.teaFinishStatus,
                    directorStatus: this.queryForm.directorFinishStatus,
                    stdType: this.queryForm.stuType,
                    grade: this.queryForm.turnGrade,
                    turnBaseId: this.queryForm.majorBaseid,
                    hospitalIdForBase: this.queryForm.hospitalIdForBase,
                };
                // 导出
                this.exportOptions = option;
                post('/turnAppraise/querypcTurnAppraiseInfo', {
                    command: 'turnAppraise/querypcTurnAppraiseInfo',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    pagenum: this.pagenum,
                    pagesize: this.pagesize,
                    serchInfo: this.inputInfo,
                    ...option
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        this.exportInput = false;
                        this.tableData = data.list;
                        this.totalCount = data.count;
                    }
                }).catch((error) => {
                });
            },

            // 科室
            //年级列表
            getgreadlist: function () {
                get(`/base/level/getByCode?code=turngrade`).then(res => {
                    if (res.resCode == 200) {
                        this.gradeList = res.model
                    } else {
                        this.$message({
                            message: '请求查询信息失败',
                            type: 'error'
                        });
                    }

                })
            },
        },
        mounted() {
            this.getgreadlist();
            this.initSelectList({ type: 'stud_type' })
            // 查询 table
            this.initData();
        }
    }
</script>

<style lang="scss" scoped>
    .wapper {
        padding: 0 20px;
    }

    .tool-box {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .top-tools {
        margin-left: 2px;
    }

    .query-tools .el-form-item {
        width: 250px;
        margin-bottom: 10px;
        text-align: right;
    }

    .query-tools .el-select {
        width: 140px;
    }

    .stu-box,
    .tea-box,
    .director-box {
        margin-top: 12px;
    }

    .title {
        font-weight: 600;
        font-size: 14px;
    }

    .content {
        margin-top: 8px;
    }

    .date-box {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin: 8px 12px 0 0;
    }

    .date-box div {
        margin: 0 4px;
    }

    .date-box div:last-child {
        margin-top: 2px;
    }

    .singnature-box img {
        width: 200px;
    }

    .title-box {
        display: flex;
        align-items: center;
    }

    .title-box .title {
        margin-right: 12px;
    }
</style>