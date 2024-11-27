<template>
    <div class="wapper">
        <div class="tool-box">
            <div class="func-tools">
                <el-button type="primary" @click="exportData">批量导出</el-button>
            </div>
            <div class="search-input">
                <el-input style="width:200px" v-model="inputInfo" @keyup.enter.native="doInputQuery" placeholder="请输入护培生姓名/学号/手机号查找"></el-input>
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
                            <hospital-base-dept1 :clearAll="rightNowClear" @updateSelectIds="setQueryFormOne" :hasHospital="hasHospital" :showDeptTree="showDeptTree"></hospital-base-dept1>
                            <el-form-item label="待审核例数">
                                <el-select filterable v-model="queryForm.checkNum" placeholder="请选择">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="item in checkNumList" :key="item.val" :label="item.content" :value="item.val"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="科室轮转状态">
                                <el-select filterable v-model="queryForm.turnStatus" placeholder="请选择">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="item in deptTurnStatusList" :key="item.val" :label="item.content" :value="item.val"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="完成状态">
                                <el-select filterable v-model="queryForm.finishStatus" placeholder="请选择">
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
                            <!-- <el-form-item label="专业基地">
                                <el-select filterable v-model="queryForm.majorBaseid" placeholder="请选择">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="item in baseidList" :key="item.id" :label="item.deptname" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item> -->
                            <el-form-item label="结业状态">
                                <el-select filterable v-model="queryForm.graduationStatus" placeholder="请选择">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option v-for="(item,index) in graduationstatelist" :key="index" :label="item.name" :value="item.key">
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
        <div class="table-content">
            <el-table :data="tableData" border tooltip-effect="dark" style="width: 100%" v-loading="loadingShow">
                <el-table-column label="姓名" prop="name" min-width="120">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" :content="scope.row.name" placement="top">
                                <el-button type="text" size="small" @click="personalDetail(scope.$index, scope.row)">{{scope.row.name}}</el-button>
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
                <el-table-column label="年级" prop="turngradename" min-width="100"></el-table-column>
                <el-table-column label="手机号" prop="mobile" min-width="120"></el-table-column>
                <el-table-column label="专业基地" prop="baseName" min-width="150">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" :content="scope.row.baseName" placement="top">
                                <span>{{scope.row.baseName}}</span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="学员类型" prop="stdTypeName" min-width="120"></el-table-column>
                <el-table-column label="轮转科室" prop="deptname" min-width="120">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" :content="scope.row.deptname" placement="top">
                                <span>{{scope.row.deptname}}</span>
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
                <el-table-column label="科室轮转状态" prop="turnstatueName" min-width="100"></el-table-column>
                <el-table-column label="结业状态" prop="isgraduationname" min-width="100"></el-table-column>
                <el-table-column label="完成状态" prop="finishRate" min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.finishRate == 0">无需完成</span>
                        <span v-if="scope.row.finishRate == 1">未完成</span>
                        <span v-if="scope.row.finishRate == 2">完成</span>
                    </template>
                </el-table-column>
                <el-table-column v-for="(item, index) in caseRate" :prop="item.key" :label="item.value" min-width="100">
                </el-table-column>
                <el-table-column label="待审核例数" prop="waiteCheck" min-width="100"></el-table-column>
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
        <!-- 查看个人轮转手册 dialog-->
        <el-dialog :title="dialogTitle" :visible.sync="detailDialog" :close-on-click-modal="false" size="large">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane v-for="item in caseList" :label="item.diseaseName+ '(' + item.finishRate + ')'" :name="item.baseId"></el-tab-pane>
            </el-tabs>
            <div class="case-contanier">
                <template v-if="curType == 1">
                    <div class="case-box" v-for="(item, index) in caseDetailList">
                        <div class="case-title-box">
                            <div class="case-name">{{item.td.content}}</div>
                            <div class="total-case">(要求例数{{item.td.count}}</div>
                            <div class="finish-case">已审核例数{{item.td.alreadyCheck}}</div>
                            <div class="noCheck-case">待审核例数{{item.td.waiteCheck}})</div>
                        </div>
                        <el-table class="case-table" ref="caseDetailTable" :data="patientDetailList[index].caseList" border tooltip-effect="dark"
                            style="width: 100%" :max-height="220">
                            <el-table-column type="index" label="序号"></el-table-column>
                            <el-table-column v-for="(item, index) in itemLabel" :key="index" prop="iteminfo" :label="item.writeInfo" min-width="100">
                                <template slot-scope="scope">
                                    <template v-for="(item, idx) in scope.row.iteminfo">
                                        <div class="actionplansty">
                                            <el-tooltip effect="light" :content="item.content" placement="top">
                                                <template v-if="idx == index">
                                                    <template v-if="item.type == 3">
                                                        <span v-if="item.content == '0'">否</span>
                                                        <span v-if="item.content == '1'">是</span>
                                                    </template>
                                                    <span v-else>{{item.content}}</span>
                                                </template>
                                            </el-tooltip>
                                        </div>
                                    </template>
                                </template>
                            </el-table-column>
                            <el-table-column prop="userinfo" label="填写日期" min-width="150">
                                <template slot-scope="scope">
                                    <div class="actionplansty">
                                        <el-tooltip effect="light" :content="scope.row.userinfo[0].createTime" placement="top">
                                            <span>{{scope.row.userinfo[0].createTime}}</span>
                                        </el-tooltip>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="userinfo" label="状态" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.userinfo[0].checkName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="userinfo" label="审核人" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.userinfo[0].userName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="userinfo" label="审核日期" min-width="150">
                                <template slot-scope="scope">
                                    <span>{{scope.row.userinfo[0].updateTime}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column fixed="right" width="100" label="操作">
                                <template slot-scope="scope">
                                    <el-button @click="handleBack(scope.$index, scope.row)" type="text" size="small">打回
                                    </el-button>
                                    </el-butt>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </template>
                <template v-if="curType == 0">
                    <div class="case-title-box">
                        <div class="case-name">{{caseInfo.diseaseName}}</div>
                        <div class="total-case">(要求例数{{caseInfo.count}}</div>
                        <div class="finish-case">已审核例数{{caseInfo.baseCount}}</div>
                        <div class="noCheck-case">待审核例数{{caseInfo.waiteCheck}})</div>
                    </div>
                    <el-table ref="caseDetailTable" :data="patientDetailList" border tooltip-effect="dark" style="width: 100%">
                        <el-table-column type="index" label="序号"></el-table-column>
                        <el-table-column v-for="(item, index) in itemLabel" :key="index" prop="iteminfo" :label="item.writeInfo" min-width="100">
                            <template slot-scope="scope">
                                <template v-for="(item, idx) in scope.row.iteminfo">
                                    <div class="actionplansty">
                                        <el-tooltip effect="light" :content="item.content" placement="top">
                                            <template v-if="idx == index">
                                                <template v-if="item.type == 3">
                                                    <span v-if="item.content == '0'">否</span>
                                                    <span v-if="item.content == '1'">是</span>
                                                </template>
                                                <span v-else>{{item.content}}</span>
                                            </template>
                                        </el-tooltip>
                                    </div>
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column prop="userinfo" label="填写日期" min-width="150">
                            <template slot-scope="scope">
                                <div class="actionplansty">
                                    <el-tooltip effect="light" :content="scope.row.userinfo[0].createTime" placement="top">
                                        <span>{{scope.row.userinfo[0].createTime}}</span>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="userinfo" label="状态" min-width="150">
                            <template slot-scope="scope">
                                <span>{{scope.row.userinfo[0].checkName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="userinfo" label="审核人" min-width="150">
                            <template slot-scope="scope">
                                <span>{{scope.row.userinfo[0].userName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="userinfo" label="审核日期" min-width="150">
                            <template slot-scope="scope">
                                <span>{{scope.row.userinfo[0].updateTime}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" width="100" label="操作">
                            <template slot-scope="scope">
                                <el-button @click="handleBack(scope.$index, scope.row)" type="text" size="small">打回
                                </el-button>
                                </el-butt>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </div>
        </el-dialog>
        <!-- 个人档案 -->
        <student-personal-Info :studentDetailId="studentDetailId" :dialogRecords.sync="dialogRecords"></student-personal-Info>
    </div>
</template>

<script>
    import studentPersonalInfo from "../../components/studentPersonalInfo.vue"
    import { post, getCookie, setTitle, exportMouldExcel, exportExcel } from '../../config/util'
    import { mapState, mapActions } from 'vuex'
    import hospitalBaseDept1 from "../../components/hospitalBaseDept1"
    import api from '../../config/common_data.js';
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
                    checkNum: '', // 待审核例数
                    turnStatus: '', // 轮转状态
                    finishStatus: '', // 完成状态
                    turnGrade: '', // 年级
                    stuType: '', // 学员类型
                    majorBaseid: '', // 专业基地
                    graduationStatus: '', // 结业状态
                    hospitalIdForBase: ""
                },
                // 基地
                baseidList: [],
                // 科室
                deptInBaseList: [],
                // 待审核例数
                checkNumList: [
                    { val: 0, content: '0' },
                    { val: 1, content: '大于0' }
                ],
                // 科室轮转状态
                deptTurnStatusList: [
                    { val: 0, content: '待入科' },
                    { val: 1, content: '轮转中' },
                    { val: 2, content: '待轮转' },
                    { val: 3, content: '已轮转' }
                ],
                // 完成状态
                finishRateList: [
                    { val: 0, content: '无需完成' },
                    { val: 1, content: '未完成' },
                    { val: 2, content: '完成' }
                ],
                gradeList: [], // 年级
                // 结业状态
                graduationstatelist: [],
                // table 
                tableData: [],
                caseRate: [],
                keyArr: [],
                loadingShow: false,
                // 查看个人轮转手册
                dialogTitle: '',
                detailDialog: false,
                // tab默认选择
                activeName: '',
                caseList: [],
                curItem: {},
                curType: 1, // 0无子项 1有子项
                baseId: '', // 病例病种子项ID
                deptId: '', // 科室ID
                turnTrainId: '', // 轮转培训ID
                turnId: '', // 轮转ID
                stdId: '', // 学生ID
                stage: '', // 阶段
                turnManualId: '', // 添加查询添加信息列表 病例病种ID
                // 查看
                // 完成的病例病种情况
                caseInfo: {},
                caseDetailList: [],
                // 添加的病例信息列表
                patientDetailList: [],
                itemLabel: [],
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
                this.queryForm.hospitalId = form.hospitalId
                this.queryForm.baseid = form.baseId
                this.queryForm.deptid = form.deptId
            },
            setQueryFormOne(form) {
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
                    this.queryForm.hospitalId = form.hospitalId
                    this.queryForm.deptid = ""
                }
            },
            personalDetail(index, row) {
                this.dialogRecords = true;
                // textData-fix
                this.studentDetailId = row.uid
            },
            // 导出
            exportData() {
                let data = {
                    command: 'turnManual/queryturnManual',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                    ...this.exportOptions
                }
                exportExcel(data);
            },

            // 查询table 列表
            initData() {
                let option = {
                    hospitalId: this.queryForm.hospitalId,
                    profbase: this.queryForm.baseid,
                    deptId: this.queryForm.deptid,
                    waitcount: this.queryForm.checkNum,
                    turnStatus: this.queryForm.turnStatus,
                    finishrate: this.queryForm.finishStatus,
                    turnGrade: this.queryForm.turnGrade,
                    stdType: this.queryForm.stuType,
                    graduationname: this.queryForm.graduationStatus,
                    hospitalIdForBase: this.queryForm.hospitalIdForBase
                }
                // 导出
                this.exportOptions = option;
                post('/turnManual/queryturnManual', {
                    command: 'turnManual/queryturnManual',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    pagenum: this.pagenum,
                    pagesize: this.pagesize,
                    serchInfo: this.inputInfo,
                    ...option
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        this.exportInput = false;
                        this.tableData = data.listMap;
                        this.caseRate = data.strlist;
                        this.totalCount = data.count;
                    }
                }).catch((error) => {
                });
            },
            // 搜索查询
            doInputQuery() {
                this.queryForm = {
                    baseid: '', // 基地
                    deptid: '', // 科室
                    checkNum: '', // 待审核例数
                    turnStatus: '', // 轮转状态
                    finishStatus: '', // 完成状态
                    turnGrade: '', // 年级
                    stuType: '', // 学员类型
                    majorBaseid: '', // 专业基地
                    graduationStatus: '', // 结业状态
                };
                this.pagenum = 1;
                this.exportInput = true;
                this.initData();
            },
            // 条件搜索
            querySeach() {
                this.pagenum = 1;
                this.inputInfo = '';
                this.exportInput = false;
                this.initData();
            },
            // 查询全部
            queryAll() {
                this.pagenum = 1;
                this.queryForm = {
                    hospitalId: "",
                    baseid: '', // 基地
                    deptid: '', // 科室
                    checkNum: '', // 待审核例数
                    turnStatus: '', // 轮转状态
                    finishStatus: '', // 完成状态
                    turnGrade: '', // 年级
                    stuType: '', // 学员类型
                    majorBaseid: '', // 专业基地
                    graduationStatus: '', // 结业状态
                    hospitalIdForBase: ""
                };
                this.rightNowClear = this.rightNowClear + 1
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

            /**
             * 查看
             */
            // tab切换
            handleClick(tab) {
                this.caseInfo = {};
                this.caseDetailList = [];
                this.patientDetailList = [];
                this.caseList.map(item => {
                    if (item.baseId == tab.name) {
                        this.curItem = item;
                    }
                });
                this.caseInfo = this.curItem;
                this.activeName = this.curItem.baseId;
                this.curType = this.curItem.type;
                this.turnManualId = this.curItem.turnManualId;
                this.baseId = this.curItem.baseId;
                this.queryAllCase();
            },

            // 查看
            detailRow(index, row) {
                this.queryTurnDetail(row.detailid);
            },

            // 验证是否可以审核
            validateCheck() {
                return new Promise((resolve, reject) => {
                    post('/turnManual/validateCheck', {
                        command: 'turnManual/validateCheck',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        beanList: this.validateList,
                    }).then((data) => {
                        if (data && data.errcode == 0) {
                            if (data.itemList.length > 0) {
                                let arrId = [];
                                data.itemList.map((item, index) => {
                                    let val = Object.keys(item);
                                    arrId.push(val[0]);
                                })
                                reject(arrId);
                            } else {
                                resolve(data);
                            }
                        }
                    })
                })
            },

            // 打回
            handleBack(index, row) {
                this.$confirm('请确认是否打回?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.curIdList = [];
                    this.validateList = [];
                    this.validateList.push({
                        id: row.iteminfo[0].id,
                        createTime: row.userinfo[0].createTime,
                    });
                    this.curIdList.push(row.iteminfo[0].id);
                    // 验证是否可以审核
                    this.validateCheck().then(res => {
                        post('/turnManual/turnManualCheck', {
                            command: 'turnManual/turnManualCheck',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            uid: getCookie('uid'),
                            checksuggestion: '',
                            checkType: 0, // 0待审核 1 审核通过 2 审核不通过
                            list: this.curIdList
                        }).then((data) => {
                            if (data && data.errcode == 0) {
                                this.$message({
                                    type: 'success',
                                    message: '打回成功!'
                                });
                                this.queryAllCase();
                            }
                        })
                    }).catch(err => {
                        this.$message({
                            type: 'warning',
                            message: '科室轮转时间已过,不可打回'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消打回'
                    });
                });
            },

            // 查询轮转详情信息
            queryTurnDetail(detailid) {
                post('/turn/getturndetailbyid', {
                    command: 'turn/getturndetailbyid',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    plandetailid: detailid,
                }).then(data => {
                    // *** 轮转手册 phase为null 传0, 有值阶段数加一 ***
                    let phase = data.detailinfo.phase ? parseInt(data.detailinfo.phase) + 1 : 0;
                    this.deptId = data.detailinfo.deptid; // 科室ID
                    this.turnTrainId = data.detailinfo.profId; // 轮转培训ID
                    this.turnId = data.detailinfo.turnId;
                    this.stdId = data.detailinfo.stdid; // 学生ID
                    this.stage = phase; // 阶段
                    this.getTurnManualData(data.detailinfo.turnId, data.detailinfo.deptid, data.detailinfo.stdid, phase, detailid);
                })
            },

            // 轮转手册数据
            getTurnManualData(turnId, deptId, stdId, phase, detailid) {
                post('/turnManual/queryTurnManualDiseaseDeptList', {
                    command: 'turnManual/queryTurnManualDiseaseDeptList',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    turnId: turnId,
                    deptId: deptId,
                    stdId: stdId,
                    stage: phase,
                    plandetailid: detailid,
                }).then(data => {
                    if (data && data.errcode == 0) {
                        if (data.result.length > 0) {
                            this.detailDialog = true;
                            data.result.map(item => item.finishRate = parseInt(item.finishRate) + '%');
                            this.caseList = data.result;
                            this.activeName = this.caseList[0].baseId;
                            this.curType = this.caseList[0].type;
                            this.turnManualId = this.caseList[0].turnManualId;
                            this.baseId = this.caseList[0].baseId;
                            this.caseInfo = this.caseList[0];
                            this.queryAllCase();
                        } else {
                            this.$message({
                                type: 'warning',
                                message: '该科室的轮转手册未设置'
                            })
                        }
                    }
                })
            },

            // 查询所有病种完成情况信息
            queryAllCase() {
                post('/turnManual/queryTurnManualDiseaseStdPcDetail', {
                    command: 'turnManual/queryTurnManualDiseaseStdPcDetail',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    turnTrainId: this.turnTrainId,
                    turnId: this.turnId,
                    deptId: this.deptId,
                    stdId: this.stdId,
                    stage: this.stage,
                    type: this.curType,
                    baseId: this.baseId,
                    check: 1,
                    turnManualId: this.turnManualId,
                }).then(data => {
                    if (data && data.errcode == 0) {
                        this.patientDetailList = [];
                        this.caseDetailList = [];
                        this.caseDetailList = data.list;
                        // 有子项, 无子项返回数据是不一样的
                        if (this.curType == 0) {
                            for (var i in data.list) {
                                this.patientDetailList.push(data.list[i]);
                            }
                            if (this.patientDetailList.length > 0) {
                                this.itemLabel = this.patientDetailList[0].iteminfo;
                            }
                        }

                        if (this.curType == 1) {
                            data.list.forEach((item, index) => {
                                this.patientDetailList.push({
                                    caseList: []
                                });
                                for (var i in item.map) {
                                    this.patientDetailList[index].caseList.push(item.map[i]);
                                }
                            })
                            if (this.patientDetailList[0].caseList.length > 0) {
                                this.itemLabel = this.patientDetailList[0].caseList[0].iteminfo;
                            }
                        }
                    }
                }).catch(error => {
                })
            },

            //基地
            getbaseidList: function () {
                var self = this;
                post('/turnbaseinfo/getusermanagerdepttree', {
                    command: 'turnbaseinfo/getusermanagerdepttree',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.baseidList = data.depttree.childlist;
                    }
                }).catch(function (error) {
                    //console.log(error)
                })
            },
            // 科室
            initDeptInBaseList() {
                this.queryForm.deptid = '';
                this.deptInBaseList = [];
                this.baseidList.map(item => {
                    if (this.queryForm.baseid == item.id) {
                        this.deptInBaseList = item.childlist;
                    }
                });
            },
            //年级列表
            getgreadlist: function () {
                let self = this;
                post('/turnbaseinfo/turnbaseinfolevel', {
                    command: 'turnbaseinfo/turnbaseinfolevel',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    code: 'turngrade'
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        self.gradeList = JSON.parse(data.baseinfolevellist);
                    }
                }).catch(() => {
                })
            },
            //培训状态
            initgraduationstate() {
                post('/dictionaryinfo/getdictionaryinfolist', {
                    command: 'dictionaryinfo/getdictionaryinfolist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    code: "graduationstatus"
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        this.graduationstatelist = data.beanlist;
                    } else {
                        this.$message({
                            type: 'error',
                            message: '连接失败！'
                        });
                    }
                }).catch(() => {
                    this.$message({
                        type: 'error',
                        message: '连接失败,请联系管理员！'
                    });
                })
            },
        },
        mounted() {
            // 获取基地列表
            this.getbaseidList();
            this.getgreadlist();//年级
            this.initgraduationstate(); // 结业状态
            this.initData();
            this.initSelectList({ type: 'stud_type' })
        },
    }
</script>

<style lang="scss" scoped>
    .wapper {
        padding: 0 20px 90px 20px;
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
        width: 240px;
        margin-bottom: 10px;
        text-align: right;
    }

    .query-tools .el-select {
        width: 140px;
    }

    .case-box {
        margin: 8px 0 12px 0;
    }

    .case-title-box {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 8px;
    }

    .case-name {
        font-weight: 600;
        font-size: 16px;
        margin-right: 12px;
    }

    .total-case {
        color: #FF0000;
    }

    .finish-case {
        color: #199ED8;
        padding: 0 14px;
    }

    .noCheck-case {
        color: #ED7D31;
    }
</style>