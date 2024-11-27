<template>
    <div class="wapper">
        <div class="tool-box">
            <el-button type="primary" @click="addTrainMajor">添加</el-button>
            <el-button type="primary" @click="editTrainMajor">编辑</el-button>
        </div>
        <div class="content">
            <div class="left-box">
                <el-table ref="majorTable" :data="trainMajorList" border tooltip-effect="dark" :max-height="540" style="width: 100%;" highlight-current-row
                    @row-click="rowClick" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" min-width="55"></el-table-column>
                    <el-table-column type="index" label="序号" min-width="45"></el-table-column>
                    <el-table-column label="培训专业名称" prop="trainName" min-width="150">
                        <template slot-scope="scope">
                            <div class="actionplansty">
                                <el-tooltip effect="light" :content="scope.row.trainName" placement="top">
                                    <span>{{scope.row.trainName}}</span>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="适用学位" prop="degreeList" min-width="200">
                        <template slot-scope="scope">
                            <template v-for="(val, idx) in degreeList">
                                <template v-for="(item, index) in scope.row.degreeList">
                                    <template v-if="val.key == item">
                                        <span v-if="val.key == item">{{val.name}}&nbsp;</span>
                                    </template>
                                </template>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否分阶段" prop="isphase" min-width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.isphase == 0">否</span>
                            <span v-if="scope.row.isphase == 1">是</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="right-box" v-if="isStage == 0">
                <div class="stage-box">
                    <el-table :data="allTurnManualList" border tooltip-effect="dark" style="width: 100%;" class="stage-table">
                        <el-table-column label="轮转科室" prop="dept" min-width="150">
                            <template slot-scope="scope">
                                <el-select class="dept-box" v-model="scope.row.deptId" placeholder="请选择轮转科室" filterable size="small" @change="deptChange($event, scope.$index, scope.row.id)">
                                    <el-option hidden key="id" :value="scope.row.deptId" :label="scope.row.deptName" />
                                    <el-tree :data="deptsList" node-key="id" :check-strictly="true" :expand-on-click-node="true" :props="defaultProps" @node-click="nodeClick($event,nodeObj,nodeEle,scope.$index,scope.row.id)"
                                        ref="treeDom" class="selfTree"></el-tree>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="120">
                            <template slot-scope="scope">
                                <el-button @click="settingTurnBook(scope.$index, scope.row)" type="text" size="small">
                                    设置轮转手册</el-button>
                                <el-button @click="deleteTurnDept(scope.$index, scope.row)" type="text" size="small">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <img class="add-icon" @click="addTrunDept()" src="../../assets/images/add.png">
                </div>
            </div>
            <div class="right-box" v-if="isStage == 1">
                <div class="stage-box" v-for="(item, index) in turnManual.turnManualList">
                    <div class="title">第{{(index+1) | turnNum}}阶段</div>
                    <el-table :data="item.stageList" border tooltip-effect="dark" style="width: 100%;" class="stage-table">
                        <el-table-column label="轮转科室" prop="dept" min-width="150">
                            <template slot-scope="scope">
                                <el-select class="dept-box" v-model="scope.row.deptId" placeholder="请选择轮转科室" filterable size="small" @change="deptChange($event, index, scope.row.id)">
                                    <!-- <el-option v-for="item in deptsList" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled"></el-option> -->
                                    <el-option hidden key="id" :value="scope.row.deptId" :label="scope.row.deptName" />
                                    <el-tree :data="deptsList" node-key="id" :check-strictly="true" :expand-on-click-node="true" :props="defaultProps" @node-click="nodeClick($event,nodeObj,nodeEle,scope.$index,index,scope.row.id)"
                                        ref="treeDom" class="selfTree"></el-tree>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="120">
                            <template slot-scope="scope">
                                <el-button @click="settingTurnBook(scope.$index, scope.row)" type="text" size="small">
                                    设置轮转手册</el-button>
                                <el-button @click="deleteTurnDept(scope.$index, scope.row, index)" type="text" size="small">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <img @click="addTrunDept(index)" class="add-icon" src="../../assets/images/add.png">
                </div>
            </div>
        </div>

        <!-- 设置轮转手册 -->
        <el-dialog class="turn-book-box" title="轮转手册登记" width="72%" :visible.sync="settingTurnBookDialog" size="large" :close-on-click-modal="false">
            <div class="turn-book-content">
                <div class="turn-left-box">
                    <el-table ref="caseTable" :data="caseList" border tooltip-effect="dark" style="width: 100%;" highlight-current-row @row-click="rowCaseClick">
                        <el-table-column label="内容" prop="content"></el-table-column>
                    </el-table>
                </div>
                <div class="turn-right-box">
                    <div class="turn-title">标准设置</div>
                    <template v-if="caseType == 1">
                        <div class="base-set-box">
                            <div class="base-title">基本要求</div>
                            <el-row :gutter="20" class="row-box" v-for="(item, index) in basicItems" :key="index">
                                <el-col :span="12">
                                    <div class="item-box">
                                        <span>{{currentCaseName}}:</span>
                                        <el-input v-model="item.content" :maxlength="30" placeholder="请输入名称" style="width:80%;">
                                        </el-input>
                                    </div>
                                </el-col>
                                <el-col :span="10" style="margin-left: -20px;">
                                    <div class="item-box">
                                        <span>要求完成例数:</span>
                                        <el-input-number v-model="item.count" style="width:60%;" :min="1" :max="50">
                                        </el-input-number>
                                    </div>
                                </el-col>
                                <el-col :span="2" style="margin-left: -16px;">
                                    <el-button type="primary" @click="delCaseInfo(item, index, 0)">删除</el-button>
                                </el-col>
                            </el-row>
                            <div class="add-box">
                                <el-button @click="addCaseInfo('0')" type="primary">添加</el-button>
                            </div>
                        </div>
                        <div class="higher-set-box">
                            <div class="base-title">较高要求</div>
                            <el-row :gutter="20" class="row-box" v-for="(item, index) in higherItems" :key="index">
                                <el-col :span="12">
                                    <div class="item-box">
                                        <span>{{currentCaseName}}:</span>
                                        <el-input v-model="item.content" :maxlength="30" placeholder="请输入名称" style="width:80%;">
                                        </el-input>
                                    </div>
                                </el-col>
                                <el-col :span="10" style="margin-left: -20px;">
                                    <div class="item-box">
                                        <span>要求完成例数:</span>
                                        <el-input-number v-model="item.count" style="width:60%;" :min="1" :max="50">
                                        </el-input-number>
                                    </div>
                                </el-col>
                                <el-col :span="2" style="margin-left: -16px;">
                                    <el-button type="primary" @click="delCaseInfo(item, index, 1)">删除</el-button>
                                </el-col>
                            </el-row>
                            <div class="add-box">
                                <el-button @click="addCaseInfo('1')" type="primary">添加</el-button>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div class="set-box" v-for="(item, index) in basicItems">
                            <div class="set-box-title">{{currentCaseName}}</div>
                            <div class="set-item-box">
                                <span>要求完成例数:</span>
                                <el-input-number v-model="item.count" style="width:60%;" :min="1" :max="50">
                                </el-input-number>
                            </div>
                        </div>
                    </template>
                    <div class="case-func-box">
                        <el-button @click="cancelSetting">取消</el-button>
                        <el-button type="primary" @click="saveSetting()" :loading="saveStatus">保存</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>

        <!-- 编辑病种 dialog -->
        <el-dialog class="turn-book-box" :title="trainMajorTitle" :visible.sync="editCaseDialog" :close-on-click-modal="false" @close="resetForm('caseDialogRef')">
            <el-form :model="editCases" ref="caseDialogRef" :rules="rules" label-width="120px">
                <el-form-item label="培训专业:" prop="majorId">
                    <el-select v-model="editCases.majorId" filterable placeholder="请选择" @change="changeMajor">
                        <el-option v-for="(item, index) in majorIdList" :key="item.key" :label="item.name" :value="item.key"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学位:" prop="degreeId">
                    <el-select v-model="editCases.degreeId" multiple v-loading="filterLoading" placeholder="请选择">
                        <el-option v-for="(item, index) in degreeList" :key="item.key" :label="item.name" :value="item.key" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否分阶段:" prop="isphase">
                    <el-radio-group v-model="editCases.isphase">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div class="case-func-box case-tip">
                <el-button @click="resetForm('caseDialogRef')">取消</el-button>
                <el-button type="primary" @click="submitForm('caseDialogRef')" :loading="saveStatus">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { post, getCookie, exportExcel } from '../../config/util'
    import { mapState, mapActions } from 'vuex'
    import api from '../../config/common_data.js';
    const _ = require('lodash');
    export default {
        data() {
            return {
                defaultProps: {
                    label: 'name',
                    children: 'childrens'
                },
                saveStatus: false,
                deptsList: [],
                majorIdList: [],
                degreeList: [],
                // 培训专业 table列表
                trainMajorList: [],
                trainMajorType: 0, // 0添加  1修改 2删除
                trainMajorTitle: '添加',
                // 选中的项
                curTrainMajorList: [],
                curTrainMajorId: '', // 编辑选中项ID
                // 选择项的ID
                curTrainMajorIdList: [],
                // 过滤学位
                filterLoading: false,

                // 轮转阶段
                stageNum: '',
                isStage: 0,
                // 当前专业Id
                currentMajorId: '',
                // 当前点击的专业数据
                currentMajorData: '',
                // 轮转阶段列表
                turnManual: {
                    turnManualList: []
                },
                allTurnManualList: [],
                // 轮转科室选择
                deptSelectflag: false,
                // 病种设置列表
                caseList: [],

                // 设置轮转手册 dialog
                settingTurnBookDialog: false,
                currentPid: '',
                currentDeptId: '',
                // 当前阶段
                currentStageNum: '',
                // 当前病种ID
                currentManualId: '',
                currentManualData: '',
                // 当前选中的内容名称
                currentCaseName: '',
                // 是否子项
                caseType: '',
                // 基本要求列表
                basicItems: [],
                // 较高要求列表
                higherItems: [],

                // 编辑
                editCaseDialog: false,
                editCases: {
                    majorId: '',
                    degreeId: [],
                    isphase: ''
                },

                // 验证规则
                rules: {
                    majorId: [{ required: true, message: '请选择培训专业', trigger: 'change' }],
                    isphase: [{ type: 'number', required: true, message: '请选择是否启用', trigger: 'change' }],
                    degreeId: [{ type: 'array', required: true, message: '请至少选择一个专业', trigger: 'change' }]
                },
            }
        },
        filters: {
            turnNum: function (value) {
                switch (value) {
                    case 1:
                        return "一";
                    case 2:
                        return "二"
                    case 3:
                        return "三"
                    case 4:
                        return "四"
                    case 5:
                        return "五"
                    case 6:
                        return "六"
                    default:
                        return value
                }
            }
        },
        computed: {

        },
        watch: {
        },
        methods: {
            nodeClick(node, nodeObj, nodeEle, index, cindex, id) {
                if (node.deptlevel == 1) {
                    return false;
                }
                if (this.isStage == 0) {
                    let temp = this.allTurnManualList[index]
                    temp.deptName = node.name
                    temp.deptId = node.id
                    this.allTurnManualList.splice(index, 1, temp)
                    this.deptChange(node.id, index, temp.id)

                } else {
                    let temp = this.turnManual.turnManualList[cindex]
                    let ctemp = temp.stageList[index]
                    ctemp.deptName = node.name
                    ctemp.deptId = node.id
                    temp.stageList.splice(index, 1, ctemp)
                    this.turnManual.turnManualList.splice(cindex, 1, temp)
                    this.$set(this.turnManual, "turnManualList", this.turnManual.turnManualList)
                    this.deptChange(node.id, cindex, id)
                }

            },
            // 获取培训专业
            getTrainingMajor() {
                post('/traineestudent/queryDictionaryList', {
                    command: 'traineestudent/queryDictionaryList',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    code: "base"
                }).then(res => {
                    if (res && res.errcode == 0) {
                        this.majorIdList = res.dic_list;
                    }
                });
            },
            // 获取学位列表
            getDegreeList() {
                post('/turnManual/queryManualDegree', {
                    command: 'turnManual/queryManualDegree',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        data.itemList.map(item => item.disabled = false);
                        this.degreeList = data.itemList;
                    }
                }).catch((error) => {
                });
            },
            // 获取所有的科室
            getAllDeptList() {
                this.deptsList = []
                post("/base/dept/getMyDeptTree", {
                    showHospital: 1,
                    showNoDeptHospital: 0,
                    needBaseDept: false,
                }).then(data => {
                    if (data && data.resCode == 200) {
                        this.deptsList = data.model;
                    }
                });
                // post("/base/dept/getHosBaseDeptTree").then(data => {
                //     if (data && data.resCode == 200) {
                //         this.deptsList = data.model;
                //     }
                // });
            },

            // 获取培训专业列表
            queryTrainList() {
                post('/turnManual/queryTrain', {
                    command: 'turnManual/queryTrain',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        this.trainMajorList = data.result;
                        // 默认第一个
                        this.isStage = this.trainMajorList[0].isphase;
                        this.currentMajorId = this.trainMajorList[0].id;
                        this.currentMajorData = this.trainMajorList[0];
                        this.$nextTick(() => {
                            this.$refs.majorTable.setCurrentRow(this.currentMajorData);
                        });
                        // 获取当前专业的轮转情况
                        this.queryTurnStage(this.currentMajorId, 1);
                    }
                }).catch((error) => {
                });
            },

            handleSelectionChange(val) {
                this.curTrainMajorList = val;
            },

            // 专业切换,选过的学位disabled
            changeMajor(data) {
                if (this.trainMajorType == 0 && this.editCases.majorId) {
                    this.editCases.degreeId = [];
                    this.filterLoading = true;
                    this.filterDegree(this.editCases.majorId, '');
                }

                if (this.trainMajorType == 1 && this.editCases.majorId) {
                    this.filterLoading = true;
                    this.filterDegree(this.editCases.majorId, this.curTrainMajorId);
                }
            },

            // 过滤此专业选过的学位
            filterDegree(majorId, id) {
                post('/turnManual/queryManualDegreeByTrainId', {
                    command: 'turnManual/queryManualDegreeByTrainId',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    baseId: majorId,
                    id: id
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        this.$nextTick(() => {
                            data.itemList.forEach(item => {
                                this.degreeList.forEach(val => {
                                    if (val.key == item) {
                                        val.disabled = true;
                                    }
                                })
                            });
                        });
                        this.filterLoading = false;
                    }
                }).catch(() => {
                })
            },

            // 添加
            addTrainMajor() {
                this.editCases = {
                    majorId: '',
                    degreeId: [],
                    isphase: ''
                };
                this.filterLoading = false;
                this.trainMajorType = 0;
                this.trainMajorTitle = '添加';
                this.editCaseDialog = true;
            },
            // 编辑
            editTrainMajor() {
                if (this.curTrainMajorList.length == 1) {
                    this.trainMajorType = 1;
                    this.trainMajorTitle = '编辑';
                    this.editCaseDialog = true;
                    // 格式转换 赋值
                    this.editCases.majorId = parseInt(this.curTrainMajorList[0].trainId);
                    this.editCases.isphase = parseInt(this.curTrainMajorList[0].isphase);
                    this.editCases.degreeId = this.curTrainMajorList[0].degreeList;
                    this.curTrainMajorId = this.curTrainMajorList[0].id;
                    // 戳发
                    this.changeMajor();
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请选择一项进行编辑'
                    })
                }
            },

            // 提交表单
            submitForm(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        // 提交按钮loading状态
                        this.saveStatus = true;
                        let option = {};
                        // 添加
                        if (this.trainMajorType == 0) {
                            option = {
                                baseId: this.editCases.majorId,
                                isphase: this.editCases.isphase,
                                degreeList: this.editCases.degreeId,
                            }
                        }
                        // 编辑 
                        if (this.trainMajorType == 1) {
                            option = {
                                id: this.curTrainMajorId,
                                baseId: this.editCases.majorId,
                                isphase: this.editCases.isphase,
                                degreeList: this.editCases.degreeId,
                            }
                        }
                        post('/turnManual/saveOrEditTrain', {
                            command: 'turnManual/saveOrEditTrain',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            ...option,
                        }).then((data) => {
                            if (data && data.errcode == 0) {
                                this.$message({
                                    message: this.trainMajorType == 0 ? '添加成功!' : '编辑成功',
                                    type: 'success'
                                });
                                this.editCaseDialog = false;
                                this.saveStatus = false;
                                // 查询列表
                                this.queryTrainList();
                            } else {
                                this.$message({
                                    message: data.errdesc,
                                    type: 'warning'
                                });
                                this.saveStatus = false;
                            }
                        }).catch(() => {
                            this.saveStatus = false;
                        })
                    } else {
                        return false;
                    }
                })
            },
            // 重置表单
            resetForm(form) {
                this.editCaseDialog = false;
                // 重置
                this.degreeList.map(item => item.disabled = false);
                try {
                    this.$refs[form].resetFields();
                } catch (e) {

                }
            },

            // 查询阶段数
            queryStageNum() {
                post('/commparaconf/querycommparaconflist', {
                    command: 'commparaconf/querycommparaconflist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    paramcode: 'turn_phase'
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        this.stageNum = parseInt(data.commparaconflist[0].paramvalue);
                    }
                }).catch((error) => {
                });
            },
            //根据培训专业获取轮转阶段设置
            queryTurnStage(id, levelType) {
                post('/turnManual/queryTurnManualBaseInfo', {
                    command: 'turnManual/queryTurnManualBaseInfo',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    level: levelType, // 培训专业 1  科室轮转手册设置传2
                    turnId: id,
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        this.allTurnManualList = [];
                        this.turnManual.turnManualList = [];
                        if (data.resultList.length > 0) {
                            if (this.isStage == 0) {
                                data.resultList.map(item => {
                                    item.deptId = parseInt(item.deptId);
                                    this.allTurnManualList.push(item);
                                });
                            } else {
                                for (var i = 0; i < this.stageNum; i++) {
                                    this.turnManual.turnManualList.push({
                                        stageList: []
                                    });
                                }

                                data.resultList.map((item, index) => {
                                    item.deptId = parseInt(item.deptId);
                                    for (var i = 0; i < this.stageNum; i++) {
                                        if (item.stage == (i + 1)) {
                                            this.turnManual.turnManualList[i].stageList.push(item);
                                        }
                                    }
                                });
                            }
                        } else {
                            if (this.isStage == 0) {
                                this.allTurnManualList.push({
                                    content: '',
                                    count: '',
                                    deptId: '',
                                    deptName: '',
                                    id: '',
                                    level: '',
                                    pid: '',
                                    stage: '',
                                    turnManualId: '',
                                    turnManualName: '',
                                    turnManualType: '',
                                    turnTrainId: '',
                                    type: ''
                                });
                            } else {
                                for (var i = 0; i < this.stageNum; i++) {
                                    this.turnManual.turnManualList.push({
                                        stageList: []
                                    });
                                }
                            }
                        }
                    }
                }).catch((error) => {
                });
            },

            rowClick(row, event, colunm) {
                let nodeName = event.hasOwnProperty('target') && event.target.hasOwnProperty('nodeName') ? event.target.nodeName : ""
                if (nodeName == "" || nodeName != "INPUT") {
                    this.currentMajorData = row;
                    this.isStage = row.isphase;
                    this.currentMajorId = row.id;
                    let levelType = 1;
                    // 重置科室选择
                    this.deptsList.map(item => {
                        item.disabled = false;
                    });
                    this.queryTurnStage(row.id, levelType);
                }
            },

            // 添加轮转科室
            addTrunDept(index) {
                let stageItem = {
                    content: '',
                    count: '',
                    deptId: '',
                    deptName: '',
                    id: '',
                    level: '',
                    pid: '',
                    stage: '',
                    turnManualId: '',
                    turnManualName: '',
                    turnManualType: '',
                    turnTrainId: '',
                    type: ''
                };
                if (this.isStage == 0) {
                    this.allTurnManualList.push(stageItem);
                } else {
                    this.turnManual.turnManualList[index].stageList.push(stageItem);
                }
                this.setDeptsList(index);
            },
            // 科室选择保存
            deptChange(val, index, id) {
                let option = {};
                if (this.isStage == 0) {
                    option = {
                        level: 1,
                        turnId: this.currentMajorId,
                        deptId: val,
                        stage: 0,
                        id: id
                    }
                    if (!id) {
                        delete option.id
                    }
                } else {
                    option = {
                        level: 1,
                        turnId: this.currentMajorId,
                        deptId: val,
                        stage: (index + 1),
                        id: id
                    }
                    if (!id) {
                        delete option.id
                    }
                }
                // if (this.deptSelectflag) {
                this.saveTurnDept(option);
                // }
            },
            // 科室筛选
            deptFilter(flag, index) {
                this.deptSelectflag = flag;
                this.setDeptsList(index);
            },
            setDeptsList(index) {
                // this.deptsList.map(item => {
                //     item.disabled = false;
                // });
                if (this.isStage == 0) {
                    this.allTurnManualList.forEach(item => {
                        this.deptsList.map((val, index) => {
                            if (val.id == item.deptId) {
                                val.disabled = true;
                            }
                        });
                    });
                } else {
                    this.turnManual.turnManualList[index].stageList.map(item => {
                        this.deptsList.map(val => {
                            if (val.id == item.deptId) {
                                val.disabled = true;
                            }
                        })
                    });
                }
            },
            // 保存轮转科室
            saveTurnDept(option) {
                post('/turnManual/addTurnManualBase', {
                    command: 'turnManual/addTurnManualBase',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    ...option,
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        this.$message({
                            type: 'success',
                            message: '轮转科室保存成功'
                        });
                        // table column选中
                        this.$nextTick(() => {
                            this.$refs.majorTable.setCurrentRow(this.currentMajorData);
                        });
                        // 刷新列表
                        this.queryTurnStage(this.currentMajorId, 1);
                    }
                }).catch((error) => {
                });
            },

            // 设置轮转手册
            settingTurnBook(index, row) {
                if (row.deptId) {
                    this.settingTurnBookDialog = true;
                    this.caseList = [];
                    this.currentPid = row.id;
                    this.currentDeptId = row.deptId;
                    this.currentStageNum = row.stage;
                    this.basicItems = [];
                    this.higherItems = [];
                    this.getCaseList(row.deptId);
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请选择轮转科室'
                    })
                }
            },
            deleteTurnDept(index, row, idx) {
                // 外面是否可以删除字段deleFlag 0否 1是
                if (row.deleFlag == 0) {
                    this.$message({
                        type: 'warning',
                        message: '已被引用，不能删除，请先解除引用，再进行操作'
                    });
                } else {
                    if (row.id) {
                        this.$confirm('确认删除该条记录?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            post('/turnManual/deleteTurnManualBaseInfo', {
                                command: 'turnManual/deleteTurnManualBaseInfo',
                                sessionid: getCookie('sid'),
                                loginid: getCookie('uid'),
                                id: row.id
                            }).then((data) => {
                                if (data && data.errcode == 0) {
                                    this.$message({
                                        type: 'success',
                                        message: '删除成功!'
                                    });
                                    this.$nextTick(() => {
                                        this.$refs.majorTable.setCurrentRow(this.currentMajorData);
                                    });
                                    this.queryTurnStage(this.currentMajorId, 1);
                                }
                            }).catch((error) => {
                                this.$message({
                                    type: 'warning',
                                    message: '删除失败!'
                                });
                            });
                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消删除'
                            });
                        });
                    } else {
                        if (this.isStage == 0) {
                            this.allTurnManualList.splice(index, 1);
                        } else {
                            this.turnManual.turnManualList[idx].stageList.splice(index, 1);
                        }
                    }
                }
            },

            /** 轮转手册 */
            // 获取病种内容列表
            getCaseList(id) {
                post('/turnManual/queryTurnManualDiseaseByDeptId', {
                    command: 'turnManual/queryTurnManualDiseaseByDeptId',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    deptId: id
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        this.caseList = data.list;
                        if (data.list.length > 0) {
                            this.currentManualId = data.list[0].id;
                            this.currentManualData = data.list[0];
                            this.caseType = data.list[0].type;
                            this.currentCaseName = data.list[0].content;
                            this.$nextTick(() => {
                                this.$refs.caseTable.setCurrentRow(this.currentManualData);
                            });
                            // 获取table第一行的病种信息设置
                            this.getCaseInfoList(this.currentManualId);
                        } else {
                            this.$message({
                                type: 'warning',
                                message: '当前科室没有添加病例病种'
                            })
                        }
                    }
                }).catch((error) => {
                });
            },
            // 获取当前病种信息的设置方案
            getCaseInfoList(id) {
                this.basicItems = [];
                this.higherItems = [];
                post('/turnManual/queryTurnManualBaseInfo', {
                    command: 'turnManual/queryTurnManualBaseInfo',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    level: 2, // 培训专业 1  科室轮转手册设置传2
                    turnId: this.currentMajorId, // 专业ID
                    pid: this.currentPid,
                    turnManualId: id
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        if (data.resultList.length > 0) {
                            data.resultList.map(item => {
                                // 基本要求
                                if (item.type == 0) {
                                    this.basicItems.push(item);
                                } else {
                                    this.higherItems.push(item);
                                }
                            })
                            if (this.basicItems.length == 0) {
                                this.addCaseInfo('0');
                            }
                            if (this.higherItems.length == 0) {
                                this.addCaseInfo('1');
                            }
                        } else {
                            if (this.basicItems.length == 0) {
                                this.addCaseInfo('0');
                            }
                            if (this.higherItems.length == 0) {
                                this.addCaseInfo('1');
                            }
                        }
                    }
                }).catch((error) => {
                });
            },

            rowCaseClick(row) {
                this.currentManualData = row;
                this.currentManualId = row.id;
                this.caseType = row.type;
                this.currentCaseName = row.content;
                this.getCaseInfoList(this.currentManualId);
            },

            // 添加
            addCaseInfo(type) {
                let item = {
                    turnId: this.currentMajorId,
                    pid: this.currentPid,
                    level: 2,
                    deptId: this.currentDeptId,
                    stage: this.currentStageNum, // 阶段数 不分阶段传0
                    type: type, // 0 基本要求  1 较高要求
                    turnManualId: this.currentManualId,
                    content: '',
                    count: ''
                }
                // 是否有子项
                if (this.caseType == 0) {
                    delete item.content
                    if (type == 0) {
                        this.basicItems.push(item);
                    } else {
                        this.higherItems.push(item);
                    }
                } else {
                    if (type == 0) {
                        this.basicItems.push(item);
                    } else {
                        this.higherItems.push(item);
                    }
                }
            },
            // 删除
            delCaseInfo(item, index, caseType) {
                if (item.deleteFlag == 0) {
                    this.$message({
                        type: 'warning',
                        message: '已被引用，不能删除，请先解除引用，再进行操作'
                    });
                } else {
                    if (item.id) {
                        post('/turnManual/deleteTurnManualBaseInfo', {
                            command: 'turnManual/deleteTurnManualBaseInfo',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            id: item.id
                        }).then((data) => {
                            if (data && data.errcode == 0) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getCaseInfoList(this.currentManualId);
                            }
                        }).catch((error) => {
                        });
                    } else {
                        if (caseType == 0) {
                            this.basicItems.splice(index, 1);
                        } else {
                            this.higherItems.splice(index, 1);
                        }
                    }
                }
            },
            // 取消
            cancelSetting() {
                this.settingTurnBookDialog = false;
            },
            // 保存
            saveCaseSetting(item) {
                post('/turnManual//addTurnManualBaseInfo', {
                    command: 'turnManual/addTurnManualBaseInfo',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    beanList: item
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        this.saveStatus = false;
                        this.$message({
                            type: 'success',
                            message: '保存成功!'
                        });
                        this.getCaseInfoList(this.currentManualId);
                    }
                }).catch((error) => {
                });
            },
            // 保存
            saveSetting() {
                let arrayItem = _.concat(this.basicItems, this.higherItems);
                if (this.caseType == 0) {
                    // 无子项保存基本设置
                    this.saveCaseSetting(this.basicItems);
                } else {
                    let flag = false;
                    for (var i = 0, len = arrayItem.length; i < len; i++) {
                        if (!arrayItem[i].content) {
                            flag = true;
                            break;
                        }
                    }
                    if (flag) {
                        this.$message({
                            type: 'warning',
                            message: '输入框不能为空!'
                        });
                    } else {
                        // 判读是否有重复名称
                        if (this.isRepeater(arrayItem)) {
                            this.saveStatus = true;
                            this.saveCaseSetting(arrayItem);
                        } else {
                            this.$message({
                                type: 'warning',
                                message: '输入框填写内容不能相同!'
                            });
                        }
                    }
                }
            },

            // 判断是否有名称相同的病种
            isRepeater(arr) {
                let s = new Set();
                for (var i in arr) {
                    s.add(arr[i].content);
                }
                if (s.size !== arr.length) {
                    return false;
                }
                return true;
            }
        },
        mounted() {
            this.getTrainingMajor();
            this.getDegreeList();
            this.getAllDeptList();

            this.queryTrainList(); // 查询设置的培训专业列表
            this.queryStageNum();
        }
    }
</script>

<style lang="scss" scoped>
    .wapper {
        padding: 0 20px;
    }

    .content {
        margin-top: 10px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
    }

    .left-box {
        width: 48%;
    }

    .right-box {
        width: 50%;
    }

    .stage-box {
        width: 100%;
        margin-bottom: 16px;
    }

    .title {
        background: #F2F2F2;
        border: 1px solid #eef1f6;
        width: calc(100% - 2px);
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
    }

    .stage-table /deep/ th {
        background: #fff;
    }

    .stage-table /deep/ .cell {
        background: #fff;
        height: 40px;
        line-height: 40px;
    }

    .add-icon {
        width: 32px;
        height: 32px;
        margin: 10px auto;
        display: block;
        cursor: pointer;
    }

    .addEdit-box {
        width: 80%;
        margin: 0 auto;
    }

    .fun-footer-box {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .fun-footer-box button {
        margin-right: 5px;
    }

    /* 轮转手册 */
    .turn-book-box /deep/ .el-dialog--large {
        width: 80%;
    }

    .item-box {
        display: flex;
        align-items: center;
    }

    .turn-book-content {
        width: 100%;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-top: 10px;
    }

    .turn-left-box {
        width: 30%;
    }

    .turn-right-box {
        width: 68%;
        border: 1px solid #C9C9C9;
        padding-bottom: 40px;
    }

    .turn-title {
        background: #F2F2F2;
        border-bottom: 1px solid #C9C9C9;
        width: calc(100% - 20px);
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        font-weight: 600;
        padding-left: 20px;
    }

    .base-title {
        font-weight: 600;
    }

    .base-set-box,
    .higher-set-box {
        margin: 12px 0 20px 30px;
    }

    .row-box {
        margin: 10px 0;
    }

    .row-box span {
        margin-right: 6px;
    }

    .add-box {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 16px;
    }

    .case-func-box {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin: 10px 20px 0 0;
    }

    .case-tip {
        margin: 10px 0 0 0;
    }

    .set-box {
        height: 100px;
        width: 500px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    .set-box-title {
        font-weight: 600;
        padding-bottom: 3px;
    }

    .set-item-box span {
        margin-right: 6px;
    }
</style>