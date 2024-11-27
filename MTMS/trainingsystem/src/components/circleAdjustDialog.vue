<template>
    <div>
        <el-dialog title="添加学员" :visible.sync="dialogAddNewStu" @close="closeAddStu" class="tjxy-dialog">
            <el-form :model="addStuForm" :inline="true" ref="addStuForm" label-width="120px" :rules="rules">
                <el-form-item label="学号" prop="mobile" style="margin-right: 0">
                    <el-select v-model="addStuForm.mobile" filterable :disabled="mode == 1" :clearable="true" remote placeholder="请输入学号" :remote-method="queryStuByMobile"
                        :loading="loading" @change="setName">
                        <el-option v-for="item in mobileOptions" :key="item.username" :label="item.username" :value="item.username">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="姓名" prop="name" style="margin-right: 0">
                    <el-input :disabled="true" v-model="addStuForm.name"></el-input>
                </el-form-item>
                <!--是否分阶段-->
                <el-form-item style="margin-right: 0">
                    <el-form :model="isstage" ref="isstageform" class="ishasStage">
                        <el-form-item prop="sign" :rules="{ required: true, message: '请选择是否分阶段' }" label="是否分阶段" label-width="120px">
                            <el-select v-model="isstage.sign" :disabled="isstage.disabled" >
                                <el-option v-for="(item, index) in  stagesignarr" :key="index + 's'" :value="item.value" :label="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </el-form-item>
                <!--不分阶段-->
                <div class="nostage" v-if="!isstage.sign">
                    <div v-for="(item, index) in addStuForm.detail" class="circleRoomInfo">
                        <h4 class="inline">第{{ index + 1 }}行</h4>
                        <el-form-item class="circleRoom" label="轮转科室" :prop="'detail[' + index + '].deptid'" :rules="{ required: true, validator: checkDept, trigger: 'change' }">
                            <el-select :disabled="item.status > 0" filterable :filter-method="($event) => searchDept($event, index)" v-model="item.deptid"
                                placeholder="请选择" @visible-change="visibleChange($event,index)">
                                <el-option hidden key="id" :value="item.deptid" :label="item.deptname" />
                                <el-tree ref="treeDom" :data="deptListTree" node-key="id" :check-strictly="true" :expand-on-click-node="true" :props="defaultProps"
                                    @node-click="nodeClick($event, index)" class="selfTree" :filter-node-method="filterNode"></el-tree>
                            </el-select>
                            <span :style="{ 'color': turnColor(item) }">{{ '(' + turnTitle(item) + ')' }}</span>
                        </el-form-item>

                        <el-form-item class="selectDate" label="轮转开始时间" :prop="'detail[' + index + '].turnstarttime'" :rules="{ required: true, validator: checkDateRange, trigger: 'change' }">
                            <el-date-picker :disabled="item.status > 0 || editDisabled" v-model="item.turnstarttime" type="date" :picker-options="pickerOptions"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item class="selectDate" label="轮转结束时间" :prop="'detail[' + index + '].turnendtime'" :rules="{ required: true, validator: turnendtimeRange, trigger: 'change' }">
                            <el-date-picker :disabled="item.status == 4 || item.status == 3 || editDisabled" v-model="item.turnendtime" type="date" :picker-options="pickerOptions"
                                placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-button type="primary" v-if="mode == 1 && item.addflag == true" @click="addRoomInfo(index)" size="small" :disabled="editDisabled">添加</el-button>
                        <el-button v-if="item.status === 0" type="primary" @click="delRoomInfo(index)" size="small" :disabled="editDisabled">删除</el-button>
                        <el-button v-if="item.status === 0 && item.deptid" type="primary" @click="delayOpen(0, index)" size="small">顺延</el-button>
                    </div>

                    <div class="addBtn" v-if="mode == 0">
                        <el-button type="primary" @click="addRoomInfo('')" :disabled="editDisabled">添加</el-button>
                    </div>
                </div>
                <!--分阶段-->
                <div class="nostage" v-if="isstage.sign">
                    <el-form :model="stageListData" ref="stageform">
                        <div class="stageitem" v-for="(stage, stageIndex) in stageListData.stageList">
                            <h4 class="inline">第{{ stageIndex + 1 }}阶段</h4>
                            <div v-for="(item, index) in stage.detail" class="circleRoomInfo">
                                <el-form-item class="circleRoom" label="轮转科室" :prop="'stageList[' + stageIndex + '].detail[' + index + '].deptid'" :rules="{ required: true, validator: checkDept, trigger: 'change' }"
                                    label-width="120px">
                                    <el-select :disabled="item.status>0" filterable :filter-method="($event)=>searchDeptCopy($event,stageIndex,index)" v-model="item.deptid"
                                        placeholder="请选择" @visible-change="visibleChange($event,stageIndex,index)">
                                        <el-option hidden key="id" :value="item.deptid" :label="item.deptname" />
                                        <el-tree :ref="'treeDom'+'_'+stageIndex+'_'+index" :data="deptListTree" :filter-node-method="filterNode" node-key="id" :check-strictly="true"
                                            :expand-on-click-node="true" :props="defaultProps" @node-click="nodeClickStage($event, index, stageIndex)"
                                            class="selfTree"></el-tree>
                                    </el-select>
                                    <span :style="{ 'color': turnColor(item) }">{{ '(' + turnTitle(item) + ')' }}</span>
                                </el-form-item>

                                <el-form-item class="selectDate" label="轮转开始时间" :prop="'stageList[' + stageIndex + '].detail[' + index + '].turnstarttime'"
                                    :rules="{ required: true, validator: checkDateRange, trigger: 'change' }" label-width="120px"
                                    style="margin-left:0">
                                    <el-date-picker :disabled="item.status > 0 || editDisabled" v-model="item.turnstarttime" type="date" :picker-options="pickerOptions"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item class="selectDate" label="轮转结束时间" :prop="'stageList[' + stageIndex + '].detail[' + index + '].turnendtime'"
                                    :rules="{ required: true, validator: turnendtimeRange, trigger: 'change' }">
                                    <el-date-picker :disabled="item.status == 4 || item.status == 3 || editDisabled" v-model="item.turnendtime" type="date" :picker-options="pickerOptions"
                                        placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                                <el-button type="primary" v-if="mode == 1 && item.addflag == true" size="small" @click="addstageRoomInfoL(stageIndex, index)"
                                    :disabled="editDisabled">添加</el-button>
                                <el-button v-if="item.status === 0" type="primary" size="small" @click="delStageRoomInfo(stageIndex, index)" :disabled="editDisabled">删除</el-button>
                                <el-button v-if="item.status === 0 && item.deptid" type="primary" size="small" @click="delayOpen(stageIndex, index)">顺延</el-button>
                            </div>

                            <div class="addBtn">
                                <el-button type="primary" @click="addStageRoomInfo(stageIndex)" :disabled="editDisabled">添加</el-button>
                            </div>
                        </div>
                    </el-form>
                </div>
                <el-row type="flex" justify="center" style="width: 100%;">
                    <el-button type="primary" @click="handleSubmitAddStu" class="bottomBtnsSure" style="margin-left:0;" :disabled="editDisabled">确认</el-button>
                    <el-button @click="dialogAddNewStu = false" class="bottomBtns">取消</el-button>
                </el-row>
            </el-form>
            </el-dialog>
            <el-dialog title="轮转顺延" :visible.sync="delayVisible" width="30%" >
                <div>
                    <el-form :model="delayForm" ref="delayValidateForm" label-width="130px" class="demo-ruleForm">
                        <el-form-item label="请选择顺延时间" prop="delay" :rules="[
                            { required: true, message: '顺延时间不可为空' },
                            { type: 'number', min: 1, max: 365, message: '只可输入1-365的整数' },
                        ]">
                            <el-input type="age" v-model.number="delayForm.delay" placeholder="请输入" autocomplete="off"></el-input><span>天</span>
                        </el-form-item>
                    </el-form>
                    <p style="color: red;">该科室后（包括该科室）的计划集体顺延</p>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="delayVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitDelayForm">确 定</el-button>
                </span>
            </el-dialog>
    </div>
</template>

<script>
    import moment from 'moment'
    import { post, getCookie, exportExcel } from '../config/util'
    import { mapState, mapActions } from 'vuex'
    import selectTree from "./selectTree.vue"
    const _ = require('lodash');
    export default {
        props: {
            selectItems: {
                type: Array,
                default: []
            }
        },
        data() {

            return {
                dialogAddNewStu: false,
                editDisabled: false,
                isstage: { sign: 0, disabled: false },
                //分阶段数据
                stageListData: {
                    stageList: [],
                },
                stagesignarr: [{ name: '否', value: 0 }, { name: '是', value: 1 }],
                addStuForm: {
                    mobile: '',
                    name: '',
                    detail: [{ deptname: '', deptid: '', dateRange: [], turnstarttime: '', turnendtime: '', }]
                },
                mode: 0,//添加状态
                turnstartdate: '',
                // selectItems: [],
                planDetailsDatas: [],
                planyearmontlist: [],
                page: 1,
                reqnum: 10,
                exportOptions: {},
                totalPages: 0,
                rowHeight: 0,
                rules: {
                    name: [{ required: true, message: '请输入姓名', trigger: 'change' },],
                    mobile: [{ required: true, message: '请输入学号', trigger: 'change' }],
                },
                mobileOptions: [],
                rooms: [],
                queryForm: {
                    hospitalId: "",
                    plan_id: '',
                    base_id: '',
                    stud_dept_id: '',
                    degre_id: '',
                    type_id: '',
                    turn_dept_id: '',
                    dateRange: '',

                    newbaseid: [],
                    newdepartment: [],
                    newarea: [],
                    hospitalIdForBase: ""
                },
                //全部
                isnewbaseid: '',
                isnewdepartment: '',
                isnewarea: '',

                baseidlist: [],
                officeidlist: [],
                areaidlist: [],

                newroomList: [],
                deptListTree: [],
                newdeptList: [],
                newareaList: [],
                defaultProps: {
                    label: 'name',
                    children: 'childrens'
                },
                pickerOptions: {
                    minTime: '',
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                usePage: false,
                studentDegreeList: [],
                delayVisible: false, //顺延弹窗
                delayForm: {
                    delay: ''
                },
                stagecount: 0,
                loading: false,
                delayIndex: 0,
                delayStageIndex: 0,
            }
        },
        methods: {
            ...mapActions(['initGradeList', 'initDeptBaseList', 'initOptionList', 'initAllOptionListUG', 'initStagecount']),
            searchDept(val, index) {
                if (this.$refs.treeDom == undefined || this.$refs.treeDom.length == 0) {
                    return false
                }
                this.$refs.treeDom[index].filter(val);
            },
            searchDeptCopy(val, index, cinedx) {
                let str = `treeDom_${index}_${cinedx}`
                this.$refs[str][0].filter(val);
            },
            visibleChange(e, index, cindex = null) {
                if (!e) {
                    if (cindex !== null) {
                        let str = `treeDom_${index}_${cindex}`
                        this.$refs[str][0].filter()
                    } else {
                        this.$refs.treeDom[index].filter()
                    }
                }
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },

            init(type, selectItems) {
                this.getStageCount(type, selectItems)
            },
            //阶段默认配置
            getStageCount(type, selectItems) {
                post('/commparaconf/querycommparaconflist', {
                    command: 'commparaconf/querycommparaconflist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    paramcode: 'turn_phase'
                }).then(res => {
                    if (res && res.errcode == 0) {
                        let data = res.commparaconflist;
                        this.stagecount = Number(data[0].paramvalue);
                        this.stageListData.stageList = [];
                        //初始化默认几个阶段
                        for (let i = 0; i < this.stagecount; i++) {
                            this.stageListData.stageList.push({
                                detail: []
                            })
                        }
                        this.initStagecount({ k: 'stagecount', v: this.stagecount })
                        if (type == 0) {
                            this.openAddDialog()
                        } else {
                            this.editStu(selectItems)
                        }
                        console.log('stagecount', this.stagecount);
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.errdesc
                        })
                    }
                })
            },
            openAddDialog() {
                this.mode = 0;
                this.isstage.sign = 0;
                this.isstage.disabled = false;
                this.addStuForm = { mobile: '', name: '', detail: [{ deptname: '', deptid: '', dateRange: [], turnstarttime: '', turnendtime: '', status: 0 }] };
                this.rightNowClear = this.rightNowClear + 1
                // this.selectItems=[];
                this.getDeptList()
                this.mobileOptions = []
                this.dialogAddNewStu = true;
            },
            editStu(selectItems) {
                this.selectItems = selectItems
                console.log('selectItems', this.selectItems, selectItems);
                if (this.selectItems.length !== 1) {
                    this.$message({
                        showClose: true,
                        message: '请勾选一个编辑项！',
                        type: 'warning'
                    });
                    return;
                }
                let option = {
                    name: this.selectItems[0].name,
                    mobile: this.selectItems[0].username,
                    interId: this.selectItems[0].interId,
                    detail: this.selectItems[0].detail
                };
                this.editDisabled = this.selectItems[0].isGraduation == 2
                this.dialogAddNewStu = true;
                this.mobileOptions = []
                this.mode = 1;//编辑状态
                this.isstage.disabled = true;//编辑状态下不能修改是否分阶段
                let _list = option.detail;
                this.isstage.sign = 0;
                this.getDeptList()
                // this.queryStuByMobile()
                _list.map(item => {
                    item.addflag = true;
                    if (item.phase !== '') {
                        this.isstage.sign = 1;
                    }
                })
                for (let i = 0; i < _list.length; i++) {
                    _list[i].addflag = true;
                    if (i > 0 && (_list[i].turn_status == 3 || _list[i].turn_status == 1 || _list[i].turn_status == 4)) {
                        _list[(i - 1)].addflag = false
                    }
                    for (var j = 0; j < _list.length - 1 - i; j++) {
                        if (_list[j].turn_status == 3 && _list[j + 1].turn_status == 3 || _list[j].turn_status == 3 && _list[j + 1].turn_status == 1 || _list[j].turn_status == 3 && _list[j + 1].turn_status == 4) {
                            _list[j].addflag = false
                        }
                        if (_list[j].turn_status == 4 && _list[j + 1].turn_status == 3 || _list[j].turn_status == 4 && _list[i + 1].turn_status == 4) {
                            _list[j].addflag = false
                        }
                    }

                };
                //不分阶段获取的学生数据
                if (this.isstage.sign === 0) {
                    option.detail = _list.map((item, index) => {
                        return {
                            deptid: item.dept_id,
                            deptname: item.dept_name || item.deptname,
                            //            dateRange:[moment(item.begin_time),moment(item.end_time)],
                            turnstarttime: moment(item.begin_time),
                            turnendtime: moment(item.end_time),
                            status: item.turn_status,
                            addflag: item.addflag
                        };

                    });
                    this.addStuForm = option;
                } else {
                    option.detail = _list.map((item, index) => {
                        return {
                            deptid: item.dept_id,
                            deptname: item.dept_name || item.deptname,
                            //            dateRange:[moment(item.begin_time),moment(item.end_time)],
                            turnstarttime: moment(item.begin_time),
                            turnendtime: moment(item.end_time),
                            status: item.turn_status,
                            addflag: item.addflag,
                            phase: item.phase
                        };

                    });
                    this.addStuForm.mobile = option.mobile;
                    this.addStuForm.name = option.name;
                    this.stageListData.stageList = [];
                    for (let i = 0; i < this.stagecount; i++) {
                        this.stageListData.stageList.push({
                            detail: []
                        })
                    }
                    console.log('stageListData', this.stageListData.stageList);
                    let map = {}
                    for (let i = 0; i < option.detail.length; i++) {
                        let ai = option.detail[i];
                        if (!map[ai.phase]) {
                            this.stageListData.stageList[ai.phase].detail = [ai];
                            map[ai.phase] = true;
                        } else {
                            for (let j = 0; j < this.stageListData.stageList.length; j++) {
                                let aj = this.stageListData.stageList[j];
                                if (aj.detail[0] && aj.detail[0].phase == ai.phase) {
                                    this.stageListData.stageList[j].detail.push(ai);
                                    break;
                                }

                            }
                        }
                    }
                }
            },
            closeAddStu() {
                this.$refs.addStuForm.resetFields();
            },
            handleSubmitAddStu() {
                if (!this.isstage.sign) {
                    // 不分阶段
                    this.$refs.addStuForm.validate((valid) => {
                        if (valid) {
                            let self = this;
                            let option = { ...this.addStuForm };
                            option.detail = self.addStuForm.detail.map((item, index) => {
                                if (moment(item.turnstarttime, 'YYYY-MM-DD HH:mm:ss').valueOf() > moment(item.turnendtime, 'YYYY-MM-DD HH:mm:ss').valueOf()) {
                                    self.$message({
                                        type: 'warning',
                                        message: '轮转计划第' + (index + 1) + '行，轮转结束时间不能小于轮转开始时间'
                                    });
                                    return
                                }
                                if (item.turnstarttime) {
                                    return {
                                        deptid: item.deptid, deptname: item.deptname, turnstatus: item.status,
                                        begintime: moment(item.turnstarttime).format('YYYY-MM-DD'),
                                        endtime: moment(item.turnendtime).format('YYYY-MM-DD'),
                                    }
                                } else {
                                    return { deptid: item.deptid, deptname: item.deptname, turnstatus: item.status, begintime: '', endtime: '' }
                                }

                            });
                            if (this.selectItems[0] && this.selectItems[0].interId) {
                                post('/turn/updateturnplandetail', {
                                    command: 'turn/updateturnplandetail',
                                    sessionid: getCookie('sid'),
                                    loginid: getCookie('uid'),
                                    ...option,
                                }).then((data) => {
                                    if (data && data.errcode == 0) {
                                        self.$message({
                                            type: 'success',
                                            message: '编辑成功!'
                                        });
                                        self.dialogAddNewStu = false;
                                        this.$emit('resertList', true)
                                    } else {
                                        const h = self.$createElement;
                                        self.$msgbox({
                                            title: '错误提示',
                                            message: h('p', null, self.createElement(data.errorlist)),
                                            type: 'error',
                                            confirmButtonText: '确定',
                                        });
                                    }
                                }).catch(() => {
                                    self.$message({
                                        type: 'error',
                                        message: '编辑失败!'
                                    });
                                })
                            } else {
                                post('/turn/addturnplandetail', {
                                    command: 'turn/addturnplandetail',
                                    sessionid: getCookie('sid'),
                                    loginid: getCookie('uid'),
                                    plandetaillist: [{ ...option, planId: self.$route.params.plan_id }]
                                }).then((data) => {
                                    if (data && data.errcode == 0) {
                                        self.$message({
                                            type: 'success',
                                            message: '新增成功!'
                                        });
                                        self.dialogAddNewStu = false;
                                        this.$emit('resertList')
                                    } else {
                                        const h = self.$createElement;
                                        self.$msgbox({
                                            title: '错误提示',
                                            message: h('p', null, self.createElement(data.errorlist)),
                                            type: 'error',
                                            confirmButtonText: '确定',
                                        });
                                    }
                                }).catch(() => {
                                    self.$message({
                                        type: 'error',
                                        message: '新增失败!'
                                    });
                                })
                            }
                        }
                    });
                } else {
                    // 分阶段
                    this.$refs.isstageform.validate((isstagevalid) => {
                        if (isstagevalid) {
                            this.$refs.stageform.validate((valid) => {
                                if (valid) {
                                    let self = this;
                                    let isempty = this.stageListData.stageList.some(item => {
                                        if (item.detail.length > 0) {
                                            return true;
                                        }
                                    })
                                    if (!isempty) {
                                        this.$message({
                                            type: "warning",
                                            message: "请填写阶段信息 "
                                        })
                                    }
                                    let stageForm = { mobile: this.addStuForm.mobile, name: this.addStuForm.name, detail: [] };
                                    this.stageListData.stageList.map((item, count) => {
                                        item.detail.map(innerItem => {
                                            if (innerItem.turnstarttime) {
                                                this.$set(innerItem, 'turnstarttime', moment(innerItem.turnstarttime).format('YYYY-MM-DD'));
                                                this.$set(innerItem, 'turnendtime', moment(innerItem.turnendtime).format('YYYY-MM-DD'));
                                                this.$set(innerItem, 'phase', count);
                                                stageForm.detail.push({
                                                    deptid: innerItem.deptid || innerItem.dept_id,
                                                    deptname: innerItem.dept_name || innerItem.deptname,
                                                    begintime: innerItem.turnstarttime,
                                                    endtime: innerItem.turnendtime,
                                                    phase: innerItem.phase,
                                                    turnstatus: innerItem.status
                                                })

                                            } else {
                                                this.$set(innerItem, 'turnstarttime', moment(innerItem.turnstarttime).format('YYYY-MM-DD'));
                                                this.$set(innerItem, 'turnendtime', moment(innerItem.turnendtime).format('YYYY-MM-DD'));
                                                this.$set(innerItem, 'phase', count);
                                                stageForm.detail.push({
                                                    deptid: innerItem.deptid || innerItem.dept_id,
                                                    deptname: innerItem.dept_name || innerItem.deptname,
                                                    begintime: innerItem.turnstarttime,
                                                    endtime: innerItem.turnendtime,
                                                    phase: innerItem.phase,
                                                    turnstatus: 0
                                                })
                                            }

                                        })
                                    })
                                    if (this.selectItems[0] && this.selectItems[0].interId) {
                                        post('/turn/updateturnplandetail', {
                                            command: 'turn/updateturnplandetail',
                                            sessionid: getCookie('sid'),
                                            loginid: getCookie('uid'),
                                            interId: this.selectItems[0].interId,
                                            ...stageForm
                                        }).then((data) => {
                                            if (data && data.errcode == 0) {
                                                self.$message({
                                                    type: 'success',
                                                    message: '编辑成功!'
                                                });
                                                self.dialogAddNewStu = false;
                                                this.$emit('resertList', true)
                                            } else {
                                                const h = self.$createElement;
                                                self.$msgbox({
                                                    title: '错误提示',
                                                    message: h('p', null, self.createElement(data.errorlist)),
                                                    type: 'error',
                                                    confirmButtonText: '确定',
                                                });
                                            }
                                        }).catch(() => {
                                            self.$message({
                                                type: 'error',
                                                message: '编辑失败!'
                                            });
                                        })
                                    } else {
                                        let plandetaillist = [{ ...stageForm, planId: self.$route.params.plan_id }]
                                        post('/turn/addturnplandetail', {
                                            command: 'turn/addturnplandetail',
                                            sessionid: getCookie('sid'),
                                            loginid: getCookie('uid'),
                                            plandetaillist: plandetaillist

                                        }).then((data) => {
                                            if (data && data.errcode == 0) {
                                                self.$message({
                                                    type: 'success',
                                                    message: '新增成功!'
                                                });
                                                self.dialogAddNewStu = false;
                                                this.$emit('resertList')
                                            } else {
                                                const h = self.$createElement;
                                                self.$msgbox({
                                                    title: '错误提示',
                                                    message: h('p', null, self.createElement(data.errorlist)),
                                                    type: 'error',
                                                    confirmButtonText: '确定',
                                                });
                                            }
                                        }).catch(() => {
                                            self.$message({
                                                type: 'error',
                                                message: '新增失败!'
                                            });
                                        })
                                    }

                                }
                            })
                        }
                    });
                }

            },
            createElement(errlist) {
                const h = this.$createElement;
                let res = [];
                let err4008 = [];
                let err4007 = [];
                let err9903 = [];
                for (let i = 0; i < errlist.length; i++) {
                    if (errlist[i][4008]) {
                        err4008.push(errlist[i][4008]);
                    }
                    if (errlist[i][4007]) {
                        err4007.push(errlist[i][4007]);
                    }
                    if (errlist[i][9903]) {
                        err9903.push(errlist[i][9903]);
                    }

                }
                err4008.length > 0 && res.push(h('p', null, err4008.join('、') + '设置的轮转时间有冲突'));
                err4007.length > 0 && res.push(h('p', null, err4007.join('、') + '轮转时间超出轮转计划时间'));
                err9903.length > 0 && res.push(h('p', null, err9903.join('、')));
                return res;
            },
            addStageRoomInfo(index) {
                this.stageListData.stageList[index].detail.push({ deptid: '', dateRange: [], turnstarttime: '', turnendtime: '', status: 0 });
            },
            delStageRoomInfo(stageIndex, index) {
                this.stageListData.stageList[stageIndex].detail.splice(index, 1);
            },
            addRoomInfo(index) {
                //20181008 轮转中的时侯在中间添加轮转科室
                if (this.mode == 1) {
                    this.addStuForm.detail.splice((index + 1), 0, { deptid: '', deptname: '', dateRange: [], turnstarttime: '', turnendtime: '', status: 0, addflag: true })
                } else {
                    this.addStuForm.detail.push({ deptid: '', deptname: '', dateRange: [], turnstarttime: '', turnendtime: '', status: 0 })
                }
            },
            //编辑状态科室之间的添加
            addstageRoomInfoL(stageIndex, index) {
                this.stageListData.stageList[stageIndex].detail.splice(index + 1, 0, { deptid: '', dateRange: [], turnstarttime: '', turnendtime: '', status: 0, addflag: true });
            },
            getDeptList() {
                this.deptList = []
                post("/base/dept/getMyDeptTree", {
                    showHospital: 1,
                    showNoDeptHospital: 0,
                    needBaseDept: false
                    // menusId: this.menuId
                }).then(data => {
                    if (data && data.resCode == 200) {
                        this.deptListTree = data.model;
                    }
                });
            },

            nodeClick(node, index) {
                if (node.deptlevel == 1 || node.havePermission != 1) {
                    return false;
                }
                let temp = this.addStuForm.detail[index]
                temp.deptid = node.id
                temp.deptname = node.name
                this.$set(this.addStuForm.detail, index, temp)
            },
            nodeClickStage(val, index, stagIndex) {
                if (val.deptlevel == 1 || val.havePermission != 1) {
                    return false;
                }
                let temp = this.stageListData.stageList[stagIndex]
                let ctemp = temp.detail[index]
                ctemp.deptid = val.id
                ctemp.deptname = val.name
                temp.detail.splice(index, index + 1, ctemp)
                this.$set(this.stageListData.stageList, stagIndex, temp)
            },
            turnColor(item) {
                if (item.status == 3) {
                    return '#d3dce6';
                } else if (item.status == 1) {
                    return '#20db9a';
                } else if (item.status == 0) {
                    return '#f99e1c';
                } else if (item.status == 4) {
                    return '#F56C6C'
                } else {
                    return '#d3dce6';
                }
            },
            turnTitle(item) {
                if (item.status == 3) {
                    return '已轮转';
                } else if (item.status == 1) {
                    return '轮转中';
                } else if (item.status == 0) {
                    return '待入科';
                } else if (item.status == 4) {
                    return '未轮转'
                } else {
                    return ''
                }
            },
            delayOpen(stageIndex, delayIndex) {
                this.delayVisible = true
                this.delayIndex = delayIndex
                this.delayStageIndex = stageIndex
                this.delayForm.delay = ''
            },
            submitDelayForm() {
                let self = this
                this.$refs['delayValidateForm'].validate((valid) => {
                    if (valid) {
                        let deptName = ''
                        if (!this.isstage.sign) {
                            deptName = this.addStuForm.detail[this.delayIndex].deptname
                        } else {
                            deptName = this.stageListData.stageList[this.delayStageIndex].detail[this.delayIndex].deptname
                        }
                        this.$confirm(`学员${this.addStuForm.name}在${deptName}及之后的计划将集体顺延${this.delayForm.delay}天，确定继续操作？`, '轮转顺延', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            // 不分阶段
                            if (!this.isstage.sign) {
                                this.addStuForm.detail.map((item, index) => {
                                    if (index >= this.delayIndex && item.deptid) {
                                        item.turnstarttime = item.turnstarttime? moment(item.turnstarttime).add(this.delayForm.delay, 'd') :'';
                                        item.turnendtime = item.turnendtime? moment(item.turnendtime).add(this.delayForm.delay, 'd'):'';
                                    }
                                })
                            } else {
                                this.stageListData.stageList.map((itemA, indexA) => {
                                    if (indexA == this.delayStageIndex) {
                                        itemA.detail.map((item, index) => {
                                            if (index >= this.delayIndex && item.deptid) {
                                                item.turnstarttime = item.turnstarttime?moment(item.turnstarttime).add(this.delayForm.delay, 'd'):'';
                                                item.turnendtime = item.turnendtime?moment(item.turnendtime).add(this.delayForm.delay, 'd'):'';
                                            }
                                        })
                                    } else if (indexA > this.delayStageIndex) {
                                        itemA.detail.map((item, index) => {
                                            if (item.deptid) {
                                                item.turnstarttime = item.turnstarttime?moment(item.turnstarttime).add(this.delayForm.delay, 'd'):'';
                                                item.turnendtime = item.turnendtime?moment(item.turnendtime).add(this.delayForm.delay, 'd'):'';
                                            }
                                        })
                                    }
                                })
                            }
                            self.$message({
                                type: 'success',
                                message: '顺延成功!'
                            });
                            this.delayForm.delay = ''
                        }).catch(() => {
                            this.delayForm.delay = ''
                        });
                        
                        this.delayVisible = false
                    }
                });
            },
            queryStuByMobile(query) {
                let self = this;
                if (query !== '') {
                    self.mobileOptions = []
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        post('/turn/queryturndoctorinfo', {
                            command: 'turn/queryturndoctorinfo',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            username: query,
                        }).done(function (data) {
                            if (data && data.errcode == 0) {
                                self.mobileOptions = data.doctorinfolist;
                            }
                        })
                    }, 200);
                } else {

                }
            },
            setName(val) {
                this.mobileOptions.forEach((item) => {
                    if (item.username === val) {
                        this.addStuForm.name = item.name;
                    }
                })
            },
            delRoomInfo(index) {
                this.addStuForm.detail.splice(index, 1);
            },
            checkDept(rule, value, callback) {
                if (value === '') {
                    callback(new Error('请选择轮转科室'));
                } else {
                    callback();
                }
            },
            checkDateRange(rule, value, callback) {
                if (!value) {
                    callback(new Error('请选择轮转开始时间'));
                } else {
                    callback();
                }
            },
            turnendtimeRange(rule, value, callback) {
                if (!value) {
                    callback(new Error('请选择轮转结束时间'));
                } else {
                    callback();
                }
            },
        },
    }
</script>

<style scoped lang="scss">
    th {
        box-sizing: border-box
    }

    .scrollFixed {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 4;
    }

    .table-wrapper {
        /* height: 460px; */
        overflow-y: auto;
    }

    .custom-table /deep/ .el-table__fixed {
        /* height: 442px !important; */
        overflow-y: auto;
    }

    .custom-table /deep/ .el-table__fixed::-webkit-scrollbar {
        display: none;
    }

    // .table-wrapper /deep/ .el-table__header{
    // position: absolute;
    // top: 0;
    // left: 0;
    // z-index: 999;
    // }
    .topTitle {
        width: 100%;
        height: 30px;
    }

    .backBtn {
        width: 100px;
        float: left;
    }

    .titleMessage {
        float: left;
        width: 1000px;
        text-align: center;
        font-size: 20px;
        line-height: 30px;
    }

    .btnTools {
        padding: 10px 0px;
        margin: 10px 0px;
        border-top: 1px solid #d3dce6;
        border-bottom: 1px solid #d3dce6;
        clear: both;
    }

    .queryTools {
        /* float:left; */
        /* width: 74%; */
    }

    .searchBtn {
        float: left;
        margin-left: 10px;
        margin-top: 26px;
    }

    .searchTools {
        float: right;
        margin-bottom: 15px;
    }

    .queryTools .el-form-item {
        width: 200px;
        margin-bottom: 10px;
    }

    .el-select {
        width: 120px;
    }

    .detailTable {
        width: 100%;
        overflow: hidden;
    }

    .el-dialog .el-select {
        width: 196px;
    }

    .circleRoomInfo {
        padding-top: 20px;
        padding-bottom: 10px;
        border-top: 1px solid #d3dce6;
    }

    .circleRoom {
        margin-right: 300px;
    }

    .selectDate .el-date-editor {
        width: 196px;
    }

    .addBtn {
        padding-top: 20px;
        border-top: 1px solid #d3dce6;
    }

    .rowHeight {
        height: 40px;
    }

    .el-table__body-wrapper {
        overflow-x: hidden;
    }

    .custom-table {
        position: static !important;
    }

    .show-color {
        width: 100%;
        margin: 15px 0px;
    }

    .show-color div {
        display: inline-block;
        margin-right: 20px;
        line-height: 20px;
    }

    .show-color span {
        display: inline-block;
        width: 40px;
        height: 15px;
        margin-right: 10px;
    }

    #plan-content {
        width: 6000px;
    }

    .inline {
        text-align: center;
        margin: 0px 0px 10px 0px;
    }

    .el-table /deep/ td {
        height: 40px;
    }

    .tjxy-dialog {
        & /deep/ .el-dialog {
            width: 900px;
        }
    }

    .stageitem {
        & /deep/ .el-form-item__content {
            margin-left: 0 !important;
        }
    }

    .flexForm {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
    }
</style>
<style>
    .ishasStage .el-form-item__content {
        margin-left: 0 !important;
    }
</style>
