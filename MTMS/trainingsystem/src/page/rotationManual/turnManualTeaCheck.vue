<template>
    <div class="wapper">
        <el-radio-group v-model="checkItem" @change="changeItem">
            <el-radio-button label="0">待审核</el-radio-button>
            <el-radio-button label="1">已审核</el-radio-button>
        </el-radio-group>
        <div class="func-box">
            <div class="func-no-check" v-if="checkItem == 0">
                <el-button type="primary" @click="handlePass">审核通过</el-button>
                <el-button type="primary" @click="handleNoPass">打回</el-button>
            </div>
            <div class="func-check" v-if="checkItem == 1">
                <el-button type="primary" @click="handleCancel">撤销</el-button>
            </div>
        </div>
        <div class="queryTools">
            <el-col :span="16">
                <el-form :model="queryForm" :inline="true" ref="queryForm" label-width="70px">
                    <el-form-item label="填写日期" prop="">
                        <el-date-picker v-model="queryForm.startTime" type="date" placeholder="选择日期" style="width:120px;" format="yyyy-MM-dd">
                        </el-date-picker>
                        -
                        <el-date-picker v-model="queryForm.endTime" type="date" placeholder="选择日期" style="width:120px;" format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-button type="primary" @click="doSelectQuery">查询</el-button>
                </el-form>
            </el-col>
            <div class="search">
                <div class="search-input" style="float:left">
                    <el-input style="width:200px" v-model="input" placeholder="请输入学员姓名/学号"></el-input>
                </div>
                <div class="search-btn" style="float:left;margin-left:20px">
                    <el-button type="primary" @click="doInputQuery">搜索</el-button>
                </div>
            </div>
        </div>
        <div class="dataTable">
            <el-table ref="multipleTable" :data="turnCaseDetailList" border tooltip-effect="dark" style="width: 100%" v-loading="loading"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection"></el-table-column>
                <el-table-column prop="turnManualName" label="类型" min-width="120">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" :content="scope.row.turnManualName" placement="top">
                                <span>
                                    {{scope.row.turnManualName}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" min-width="100">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="employeeDetail(scope.$index, scope.row)">{{scope.row.name}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="username" label="学号" min-width="100"></el-table-column>
                <el-table-column prop="deptname" label="轮转科室" min-width="100">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" :content="scope.row.deptname" placement="top">
                                <span>
                                    {{scope.row.deptname}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="realTime" label="轮转周期" min-width="150">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" :content="scope.row.realTime" placement="top">
                                <span>
                                    {{scope.row.realTime}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号" min-width="120"></el-table-column>
                <el-table-column prop="turngradename" label="年级" min-width="100"></el-table-column>
                <el-table-column prop="baseName" label="专业基地" min-width="100">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" :content="scope.row.baseName" placement="top">
                                <span>
                                    {{scope.row.baseName}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="stdTypeName" label="学员类型" min-width="100"></el-table-column>
                <el-table-column prop="createTime" label="填写日期" min-width="120">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" :content="scope.row.createTime" placement="top">
                                <span>
                                    {{scope.row.createTime}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" width="80" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="detail(scope.$index, scope.row)" type="text" size="small">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pagenum" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
        </div>
        <!-- 查看 -->
        <el-dialog :title="dialogTitle" :visible.sync="checkDialog" :close-on-click-modal="false">
            <ul class="item-box">
                <li v-for="(item, index) in items" :key="item.id">
                    <template v-if="item.type == 3">
                        <span class="item-title">{{item.writeInfo}}:</span>
                        <span class="item-content" v-if="item.content == 0">否</span>
                        <span class="item-content" v-if="item.content == 1">是</span>
                    </template>
                    <template v-else>
                        <span class="item-title">{{item.writeInfo}}:</span>
                        <span class="item-content">{{item.content}}</span>
                    </template>
                </li>
            </ul>
            <ul v-if="checkType == 1" class="item-box noPass-reason">
                <li>
                    <span class="item-title">不通过原因:</span>
                    <span class="item-content">{{suggest}}</span>
                </li>
            </ul>
            <div class="fun-footer-box">
                <template v-if="checkItem == 0">
                    <el-button type="primary" @click="handlePass">审核通过</el-button>
                    <el-button @click="handleNoPass">打回</el-button>
                    <el-button @click="checkDialog = false">关闭</el-button>
                </template>
                <template v-else>
                    <el-button type="primary" @click="handleCancel">撤销</el-button>
                    <el-button @click="closeDetailDialog">关闭</el-button>
                </template>
            </div>
        </el-dialog>
        <!-- 审核不通过 dialog -->
        <el-dialog title="不通过原因" :visible.sync="noPassDialog" :close-on-click-modal="false" size="tiny">
            <el-radio-group v-model="noPassRadio" @change="reasonChange">
                <el-radio :label="1">与事实不符</el-radio>
                <el-radio :label="2">填写不规范</el-radio>
                <el-radio :label="3">其他</el-radio>
            </el-radio-group>
            <el-input class="no-pass-text" type="textarea" :disabled="disabledFlag" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容"
                v-model="noPassText" maxlength="250">
            </el-input>
            <div class="no-pass-box">
                <el-button @click="closeNoPassReason">取消</el-button>
                <el-button type="primary" @click="noPass">确定</el-button>
            </div>
        </el-dialog>
        <!-- 职工信息 -->
        <employee-info :dialogEmployee.sync="dialogEmployee" :currentDataId="currentDataId"></employee-info>
        <!-- 个人档案 -->
        <student-personal-Info :studentDetailId="currentDataId" :dialogRecords.sync="dialogRecords"></student-personal-Info>
    </div>
</template>

<script>
    import { post, getCookie, exportExcel } from '../../config/util'
    import employeeInfo from "../../components/employeeInfo.vue"
    import studentPersonalInfo from "../../components/studentPersonalInfo.vue";
    import { mapState, mapActions } from 'vuex'
    import api from '../../config/common_data.js';
    const _ = require('lodash');
    import moment from 'moment';
    export default {
        data() {
            return {
                dialogRecords: false,
                currentDataId: "", // 当前点击职工详情信息
                dialogEmployee: false, //职工详情弹窗
                pagenum: 1,
                pagesize: 10,
                totalCount: 0,
                input: '', // 搜索框
                exportInput: false,
                // 0 待审核 1 已审核
                checkItem: '0',
                // tab默认选择
                // activeName: 'second',
                // 查找条件
                queryForm: {
                    startTime: '',
                    endTime: ''
                },
                loading: true,
                turnCaseDetailList: [],

                // 查看
                checkDialog: false,
                dialogTitle: '查看',
                items: [],
                // 不通过
                noPassRadio: '',
                noPassDialog: false,
                noPassText: '',
                disabledFlag: true,
                checkType: 0, // 是否不通过 0否 1是
                suggest: '', // 不通过原因
                // table 选择的 column
                curIdList: [], // array id
                validateList: [], // 验证 array
            }
        },
        components: {
            employeeInfo,
            studentPersonalInfo
        },
        methods: {
            employeeDetail(index, row) {
                this.dialogRecords = true
                this.currentDataId = row.stuId;
            },
            changeItem(val) {
                this.checkItem = val;
                this.loading = true;
                this.queryForm.endTime = '';
                this.queryForm.startTime = '';
                this.pagenum = 1;
                this.pagesize = 10;
                this.input = '';
                this.queryCheckList(this.checkItem);
            },
            // 查询审核列表
            queryCheckList(val) {
                let _startTime = this.queryForm.startTime ? moment(this.queryForm.startTime).format('YYYY-MM-DD') : '';
                let _endTime = this.queryForm.startTime ? moment(this.queryForm.endTime).format('YYYY-MM-DD') : '';
                post('/turnManual/turnManualCheckPcList', {
                    command: 'turnManual/turnManualCheckPcList',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                    check: val,
                    serchInfo: this.input,
                    startTime: _startTime,
                    endTime: _endTime,
                    pagenum: this.pagenum,
                    pagesize: this.pagesize,
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        this.loading = false;
                        this.turnCaseDetailList = data.list;
                        this.totalCount = data.count;
                    }
                })
            },
            // 查看
            detail(index, row) {

                this.curIdList = [];
                this.validateList = [];
                this.curIdList.push(row.id);
                this.validateList.push({
                    id: row.id,
                    createTime: row.createTime,
                });
                this.dialogTitle = row.name + row.turnManualName + '的查看';
                let checkType = row.check;
                post('/turnManual/queryturnManualItemDetail', {
                    command: 'turnManual/queryturnManualItemDetail',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                    detailId: row.id,
                    check: checkType,
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        this.checkDialog = true;
                        let arr = [];
                        data.itemList.forEach(item => {
                            if (item.type) {
                                arr.push(item);
                            }

                            if (item.checkType != undefined) {
                                this.checkType = item.checkType;
                                this.suggest = item.checksuggestion;
                            } else {
                                this.checkType = row.check == 1 ? 0 : row.check == 2 ? 1 : row.check;
                            }
                        });
                        this.items = arr;
                    }
                })
            },
            closeDetailDialog() {
                this.checkDialog = false;
                this.checkType = 0;
                this.suggest = '';
            },
            // table 勾选
            handleSelectionChange(items) {
                this.curIdList = [];
                this.validateList = [];
                items.map(item => {
                    this.curIdList.push(parseInt(item.id));
                    this.validateList.push({
                        id: item.id,
                        createTime: item.createTime,
                    })
                });
            },

            closeNoPassReason() {
                this.noPassText = '';
                this.noPassRadio = '';
                this.noPassDialog = false;
            },
            // 不通过原因选择
            reasonChange(val) {
                if (val == 1) {
                    this.noPassText = '与事实不符';
                    this.disabledFlag = true;
                }
                if (val == 2) {
                    this.noPassText = '填写不规范';
                    this.disabledFlag = true;
                }
                if (val == 3) {
                    this.disabledFlag = false;
                    this.noPassText = '';
                }
            },
            noPass() {
                let type = 2;
                this.checkCase(type);
            },
            // 通过
            handlePass() {
                let type = 1;
                // 单个审核
                if (this.checkDialog) {
                    this.$confirm('确认审核通过该记录？', '审核确认', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.checkCase(type);
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消审核通过'
                        })
                    })
                } else {
                    // 批量审核
                    if (this.curIdList.length > 0) {
                        this.$confirm('确认批量通过选中记录？', '批量审核', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.checkCase(type);
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消批量审核'
                            })
                        })
                    } else {
                        this.$message({
                            type: 'warning',
                            message: '请先勾选审核项'
                        })
                    }
                }
            },
            // 打回
            handleNoPass() {
                // 单个审核
                if (this.checkDialog) {
                    this.noPassDialog = true;
                } else {
                    // 批量审核
                    if (this.curIdList.length > 0) {
                        this.$confirm('确认批量打回选中记录？', '批量打回', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.noPassDialog = true;
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消批量打回'
                            })
                        })
                    } else {
                        this.$message({
                            type: 'warning',
                            message: '请先勾选审核项'
                        })
                    }
                }
            },
            // 撤销
            handleCancel() {
                // 单个审核
                let type = 0;
                if (this.checkDialog) {
                    this.$confirm('确认撤销该记录？', '审核确认', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.checkCase(type);
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消撤销'
                        })
                    })
                } else {
                    // 批量审核
                    if (this.curIdList.length > 0) {
                        this.$confirm('确认批量撤销选中记录？', '批量撤销', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.checkCase(type);
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消批量撤销'
                            })
                        })
                    } else {
                        this.$message({
                            type: 'warning',
                            message: '请先勾选审核项'
                        })
                    }
                }
            },
            // 审核
            checkCase(type) {
                // 验证是否可以审核
                this.validateCheck().then(res => {
                    post('/turnManual/turnManualCheck', {
                        command: 'turnManual/turnManualCheck',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        uid: getCookie('uid'),
                        checksuggestion: this.noPassText,
                        checkType: type, // 0待审核 1 审核通过 2 审核不通过
                        list: this.curIdList
                    }).then((data) => {
                        if (data && data.errcode == 0) {
                            this.noPassText = '';
                            this.noPassRadio = '';
                            this.curIdList = [];
                            // 关闭dialog
                            if (this.noPassDialog) {
                                this.noPassDialog = false;
                            }
                            if (this.checkDialog) {
                                this.checkDialog = false;
                            }
                            this.items = data.itemList;
                            if (this.exportInput) {
                                this.doInputQuery();
                            } else {
                                this.doSelectQuery();
                            }
                        }
                    })
                }).catch(data => {
                    data.forEach(val => {
                        this.turnCaseDetailList.forEach(item => {
                            if (item.id == val) {
                                this.$refs.multipleTable.toggleRowSelection(item, false);
                            }
                        })
                    });
                    this.$message({
                        type: 'info',
                        message: '时间已过的审核项已去除勾选,请继续审核'
                    });
                })
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

            doSelectQuery() {
                this.inputInfo = '';
                this.exportInput = false;
                this.loading = true;
                this.queryCheckList(this.checkItem);
            },
            doInputQuery() {
                this.loading = true;
                this.queryForm.startTime = '';
                this.queryForm.endTime = '';
                this.exportInput = true;
                this.pagenum = 1;
                this.queryCheckList(this.checkItem);
            },
            /*分页区*/
            handleSizeChange(size) {
                this.pagesize = size;
                if (this.exportInput) {
                    this.doInputQuery();
                } else {
                    this.doSelectQuery();
                }
            },
            handleCurrentChange(currentPage) {
                this.pagenum = currentPage;
                this.usePage = true;
                if (this.exportInput) {
                    this.doInputQuery();
                } else {
                    this.doSelectQuery();
                }
            },
        },
        mounted() {
            this.queryCheckList(this.checkItem);
            if (this.$route.query.user) {
                this.input = this.$route.query.user;
                console.log(this.$route.query)
                this.doInputQuery();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .wapper {
        padding: 0 20px;
    }

    .el-tabs {
        margin-top: 20px;
    }

    .func-box {
        margin-top: 10px;
        margin-bottom: 20px;
    }

    .search {
        position: absolute;
        right: 20px;
        top: 0;
    }

    .item-box {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
    }

    .item-box li {
        display: flex;
        align-items: flex-start;
        margin-right: 20px;
        padding-bottom: 14px;
    }

    .item-title {
        width: 160px;
        text-align: right;
    }

    .item-title {
        margin-right: 20px;
    }

    .item-content {
        max-width: 400px;
        min-width: 100px;
        white-space: normal;
        line-height: 20px;
    }

    .fun-footer-box {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
    }

    .fun-footer-box button {
        margin: 0 10px;
    }

    .no-pass-text {
        margin: 14px 0;
    }

    .no-pass-box {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .noPass-reason {
        width: 100%;
        border-top: 1px solid #e2e2e2;
        margin-top: 10px;
    }

    .noPass-reason li {
        margin-top: 10px;
    }
</style>