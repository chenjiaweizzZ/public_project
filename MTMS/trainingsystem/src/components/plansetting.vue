<template>
    <div class="train-major">
        <el-dialog :visible.sync="datalist.visible" :title="datalist.title" size="large" class="changeSize">
            <div class="group-box">
                <el-row :gutter="20">
                    <el-col :span="7">
                        <div class="funcTools">
                            <el-button type="primary" @click="addTrainMajor" size="small">添加</el-button>
                            <el-button type="primary" size="small" @click.stop="editTrainMajor"> 编辑</el-button>
                            <el-button type="primary" size="small" @click.stop="deleteTrainMajor">删除</el-button>
                        </div>
                        <!--专业列表-->
                        <div class="train-major-list">
                            <el-table ref="trainmajortable" :data="trainMajorList" :row-class-name="tableRowClassName"
                                v-loading="loading" @row-click="getTrainingprogrammeSet"
                                @selection-change="trainMajorSelect">
                                <el-table-column type="selection" label="序号">

                                </el-table-column>
                                <el-table-column label="序号" type="index">

                                </el-table-column>
                                <el-table-column label="培训专业" prop="majorname">

                                </el-table-column>
                                <el-table-column label="是否分阶段" prop="isphase">
                                    <template slot-scope="scope">
                                        {{ scope.row.isphase == 1 ? '是' : '否' }}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-col>
                    <!--阶段-->

                    <el-col :span="17">
                        <el-form :model="stageListData" ref="stageListForm" v-loading="stageloading">
                            <div class="stage-c">
                                <div class="stage" v-for="(stage, stageIndex) in stageListData.stageList"
                                    :key="stageIndex + 's'">
                                    <div class="step" v-if="selectedMajor.isphase">
                                        第{{ stageIndex + 1 }}阶段
                                    </div>
                                    <table class="table-wrap">
                                        <tr v-if="stage.grouplist && stage.grouplist.length > 0">
                                            <td class="td-index">序号</td>
                                            <td>轮转科室</td>
                                            <td>轮转周期/月</td>
                                            <td>必转科室数量</td>
                                        </tr>
                                        <tr v-for="(dept, outerIndex) in stage.grouplist" :key="dept.id">
                                            <td>{{ outerIndex + 1 }}</td>
                                            <td>
                                                <div class="rotation-w" v-for="(deptInner, innerIndex) in dept.deptlist">
                                                    <el-form-item class="dept-form-item" :rules="deptrules.deptid"
                                                        :prop="'stageList[' + stageIndex + '].grouplist[' + outerIndex + '].deptlist[' + innerIndex + '].deptid'">
                                                        <el-select filterable
                                                            :filter-method="($event) => searchDept($event, stageIndex, outerIndex, innerIndex)"
                                                            @visible-change="visibleChange($event, stageIndex, outerIndex, innerIndex)"
                                                            v-model="deptInner.deptid" placeholder="请选择"
                                                            style="width: 100%">
                                                            <el-option hidden key="id" :value="deptInner.deptid"
                                                                :label="deptInner.deptname" />
                                                            <el-tree
                                                                :ref="'treeDom_' + outerIndex + '_' + stageIndex + '_' + innerIndex"
                                                                :data="doctorOfficeList" node-key="id"
                                                                :check-strictly="true" :expand-on-click-node="true"
                                                                :props="defaultProps"
                                                                @node-click="updateSingleDept($event, stageIndex, outerIndex, innerIndex)"
                                                                class="selfTree" :filter-node-method="filterNode"></el-tree>
                                                            <template>
                                                                <el-button type="primary" size="small"
                                                                    @click="addDepartment(stageIndex, outerIndex, innerIndex)">添加
                                                                </el-button>
                                                                <el-button type="primary"
                                                                    @click="removeDepartment(stageIndex, outerIndex, innerIndex)"
                                                                    size="small">删除
                                                                </el-button>
                                                            </template>
                                                        </el-select>
                                                    </el-form-item>
                                                </div>
                                            </td>
                                            <!--轮转周期-->
                                            <td>
                                                <div class="rotation-w">
                                                    <el-form-item
                                                        :prop="'stageList[' + stageIndex + '].grouplist[' + outerIndex + '].cycle'"
                                                        :rules="deptrules.cycle">
                                                        <el-select size="small" v-model="dept.cycle">
                                                            <el-option v-for="cycle in turncycle"
                                                                :value="cycle.paramvalue"></el-option>
                                                        </el-select>
                                                    </el-form-item>

                                                </div>
                                            </td>
                                            <!--必转科室数量-->
                                            <td>
                                                <div class="rotation-w">
                                                    <el-form-item
                                                        :prop="'stageList[' + stageIndex + '].grouplist[' + outerIndex + '].turndeptcount'"
                                                        :rules="deptrules.turndeptcount">
                                                        <el-select size="small" v-model="dept.turndeptcount">
                                                            <el-option v-for="(item, count) in dept.deptcount"
                                                                :value="item"></el-option>
                                                        </el-select>
                                                    </el-form-item>

                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    <div class="add-div" v-if="trainMajorList.length > 0">
                                        <span class="icon addIcon" @click.stop="addDepartmentList(stageIndex)"></span>
                                        <span class="icon removeIcon" @click.stop="removeDepartmentList(stageIndex)"
                                            v-if="stage.grouplist && stage.grouplist.length > 0"></span>
                                    </div>
                                </div>
                            </div>
                        </el-form>
                    </el-col>
                </el-row>
                <div class="fun-t">
                    <el-button type="primary" @click="cancel" size="small">取消</el-button>
                    <el-button type="primary" @click.stop="submit('add', 'trainingprogramme/set')" v-if="!isedit"
                        :class="{ noclick: issubmit }" size="small" v-loading="submitloading">保存</el-button>
                    <el-button type="primary" @click.stop="submit('edit', 'trainingprogramme/edittrain')" v-if="isedit"
                        :class="{ noclick: issubmit }" size="small" v-loading="submitloading">保存</el-button>

                </div>
            </div>
        </el-dialog>
        <!--添加培训专业弹框-->
        <el-dialog :visible.sync="trainMajor.visible" :title="trainMajor.title">
            <div class="add-train-major">
                <el-form ref="add-train-major" :model="trainMajor" :rules="trainMajorRules">
                    <el-form-item label="培训专业:" label-width="100px" prop="baseid">
                        <el-select v-model="trainMajor.baseid" filterable placeholder="请选择">
                            <el-option v-for="item in majorList" :value="item.key" :label="item.name" :key="item.key"
                                :disabled="item.isselect">

                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否分阶段:" label-width="100px" class="enableform" prop="isphase">
                        <el-radio-group v-model="trainMajor.isphase">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item align="right">
                        <el-button @click="cancelMajorDialog">取消</el-button>
                        <el-button type="primary" @click.stop="addMajorSubmit" :class="{ noclick: issubmit }"
                            v-loading="btnloading" v-if="!trainMajor.isedit">确定</el-button>
                        <el-button type="primary" @click.stop="editMajorSubmit" :class="{ noclick: issubmit }"
                            v-loading="btnloading" v-if="trainMajor.isedit">确定</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { currentYear, getCookie, post, exportExcel, get } from '../config/util'
import { mapState, mapActions } from 'vuex'
import selectTree from "./selectTree"
let sample = {
    grouplist: [
        {
            deptcount: '',
            phase: 1,
            cycle: '',
            deptcount: '',//包含科室数量
            turndeptcount: '',//必转科室数量
            deptlist: [
                {
                    deptid: '',
                    deptname: ""
                }
            ]
        }
    ]
}
export default {
    name: "plansetting",
    props: {
        datalist: {}
    },
    data() {
        return {
            defaultProps: {
                label: 'name',
                children: 'childrens'
            },
            doctorOfficeList: [],
            hasBase: true,
            isAll: true,
            single: true,
            submitloading: false,
            isedit: false,
            stageloading: false,
            deptcount: '',
            issubmit: false,
            btnloading: false,
            selectedMajor: {
                majorid: "",
                isphase: '',
                id: ''
            },
            course: [{ iscompulsory: 1, name: '必修' }, { iscompulsory: 0, name: '选修' }],
            selectTrainMajor: [],
            // deptList:[],
            majorList: [],
            turncycle: [],
            grouplist: [],
            stageListData: {
                stageList: [

                ],
            },
            loading: false,
            isthisMajorList: [{ key: 1, name: '是' }, { key: 0, name: '否' }],
            trainMajor: {
                visible: false,
                title: '添加培训专业',
                baseid: '',
                isphase: '',
                isedit: false
            },
            trainMajorList: [],
            trainMajorRules: {
                baseid: [{ required: true, message: "培训专业不能为空", trigger: 'change' }],
                isphase: [{ required: true, message: "请选择是否分阶段", trigger: 'change', type: "number" }],
            },
            deptrules: {
                deptid: [{ required: true, message: "科室不能为空", trigger: 'change', type: 'number' }],
                cycle: [{ required: true, message: "周期不能为空", trigger: 'change', type: 'number' }],
                iscompulsory: [{ required: true, message: "必修选修不能为空", trigger: 'change', type: 'number' }],
                turndeptcount: [{ required: true, message: "科室数量不能为空", trigger: 'change', type: 'number' }],
                ismajor: [{ required: true, message: "选择是否为本专业", trigger: 'change', type: 'number' }]
            }
        }
    },
    computed: {
        ...mapState([
            'stagecount', 'deptList'
        ]),
    },
    components: {
        selectTree
    },
    mounted() {
        //获取轮转周期
        this.getTurnCycle();
        //获取所有的科室和病区
        this.getDeptList();
        this.getAddMajorList();
        // 是否分阶段
        this.isPhaseFn();
    },
    methods: {
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },

        searchDept(val, index, lindex, cinedx) {
            let str = `treeDom_${lindex}_${index}_${cinedx}`
            console.log(this.$refs[str])
            this.$refs[str][0].filter(val);
        },
        visibleChange(e, index, lindex, cindex) {
            if (!e) {
                let str = `treeDom_${lindex}_${index}_${cindex}`
                this.$refs[str][0].filter()
            }
        },
        getDeptList() {
            this.doctorOfficeList = []
            post("/base/dept/getDeptTree", {
                showHospital: 1,
                showNoDeptHospital: 0,
                needBaseDept: false,
                // menusId: this.menuId
            }).then(data => {
                if (data && data.resCode == 200) {
                    this.doctorOfficeList = data.model;
                }
            });
        },
        updateSingleDept(node, stageIndex, index, cindex) {
            if (node.deptlevel == 1) {
                return false
            }
            let stageTemp = this.stageListData.stageList[stageIndex]
            let groupTemp = stageTemp.grouplist[index]
            let deptTemp = groupTemp.deptlist[cindex]
            deptTemp.deptid = node.id
            deptTemp.deptname = node.name
            groupTemp.deptlist[cindex] = deptTemp
            stageTemp.grouplist[index] = groupTemp
            this.stageListData.stageList[stageIndex] = groupTemp
            this.$set(this.stageListData.stageList, stageIndex, stageTemp)

            let deptcount = this.stageListData.stageList[stageIndex].grouplist[index].deptlist.length;
            this.$set(this.stageListData.stageList[stageIndex].grouplist[index], 'deptcount', deptcount);
            this.$set(this.stageListData.stageList[stageIndex].grouplist[index], 'turndeptcount', 1);
        },

        //选择科室
        getDeptCount(stageIndex, outerIndex) {
            let deptcount = this.stageListData.stageList[stageIndex].grouplist[outerIndex].deptlist.length;
            this.$set(this.stageListData.stageList[stageIndex].grouplist[outerIndex], 'deptcount', deptcount);
            this.$set(this.stageListData.stageList[stageIndex].grouplist[outerIndex], 'turndeptcount', 1);
        },
        getTurnCycle() {
            post('/commparaconf/querycommparaconflist', {
                command: 'commparaconf/querycommparaconflist',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                paramcode: "turn_cycle"
            }).then(res => {
                this.issubmit = false;
                this.btnloading = false;
                if (res && res.errcode) {
                    if (res.errcode == 0) {
                        this.turncycle = res.commparaconflist;
                        this.turncycle.map(item => {
                            this.$set(item, 'paramvalue', Number(item.paramvalue))
                        })
                    }

                } else {
                    this.$message({
                        type: 'warning',
                        message: res.errdesc
                    })
                }
            }).catch(() => {
                this.issubmit = false;
                this.btnloading = false;
            })
        },
        addSubmit() {
            post('/traineestudent/queryDictionaryList', {
                command: 'traineestudent/queryDictionaryList',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                code: "base"
            }).then(res => {
                if (res && res.errcode) {
                    if (res.errcode == 0) {

                    }

                } else {
                    this.$message({
                        type: 'warning',
                        message: res.errdesc
                    })
                }
            });
        },
        //编辑培训专业
        editTrainMajor() {
            if (this.selectTrainMajor.length == 0 || this.selectTrainMajor.length > 1) {
                this.$message({
                    type: "warning",
                    message: "请选择一个培训专业编辑"
                })
            } else {
                
                //获取培训专业
                this.getTrainingMajor();
                this.trainMajor = {
                    isedit: true,
                    visible: true,
                    baseid: String(this.selectTrainMajor[0].baseid),
                    isphase: this.selectTrainMajor[0].isphase,

                }
            }

        },
        //过滤已选的培训专业
        filterTrainMajor() {
            for (let i = 0; i < this.majorList.length; i++) {
                if (this.trainMajorList.length > 0) {
                    for (let j = 0; j < this.trainMajorList.length; j++) {
                        if (this.majorList[i].key == this.trainMajorList[j].baseid) {
                            this.majorList[i].isselect = true;
                            break;
                        } else {
                            this.majorList[i].isselect = false;
                        }
                    }
                } else {
                    this.majorList[i].isselect = false;
                }

            }

        },
        addTrainMajor() {
            this.trainMajor.visible = true;
            this.trainMajor.isphase = '';
            this.trainMajor.baseid = '';
            this.trainMajor.isedit = false;
            this.filterTrainMajor();
              //获取培训专业
            this.getTrainingMajor();
        },
        tableRowClassName(row, index) {
            if (row.baseid == this.selectedMajor.majorid) {
                return 'activeBgColor'
            }
            return '';

        },
        //编辑培训专业
        editMajorSubmit() {
            this.$refs['add-train-major'].validate(valid => {
                if (valid) {
                    this.issubmit = true;
                    this.btnloading = true;
                    post('/trainingprogramme/editturnmajor', {
                        command: 'trainingprogramme/editturnmajor',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        baseid: this.trainMajor.baseid,
                        isphase: this.trainMajor.isphase,
                        id: this.selectTrainMajor[0].id
                    }).then(res => {
                        this.issubmit = false;
                        this.btnloading = false;
                        if (res && res.errcode) {
                            if (res.errcode == 0) {
                                this.getAddMajorList();
                                this.$message({
                                    type: 'success',
                                    message: "编辑成功 "
                                });
                                this.trainMajor.visible = false;
                            }

                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.errdesc
                            })
                        }
                    }).catch(() => {
                        this.issubmit = false;
                        this.btnloading = false;
                    })
                }
            });
        },
        //添加培训专业
        addMajorSubmit() {
            this.$refs['add-train-major'].validate(valid => {
                if (valid) {
                    this.issubmit = true;
                    this.btnloading = true;
                    post('/trainingprogramme/addturnmajor', {
                        command: 'trainingprogramme/addturnmajor',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        baseid: this.trainMajor.baseid,
                        isphase: this.trainMajor.isphase,
                        trainid: this.datalist.id
                    }).then(res => {
                        this.issubmit = false;
                        this.btnloading = false;
                        if (res && res.errcode) {
                            if (res.errcode == 0) {
                                this.getAddMajorList();
                                this.$message({
                                    type: 'success',
                                    message: "添加成功 "
                                });
                                this.trainMajor.visible = false;
                            }

                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.errdesc
                            })
                        }
                    }).catch(() => {
                        this.issubmit = false;
                        this.btnloading = false;
                    })
                }
            });
        },
        //根据培训专业id查询方案详情
        getQueryTraininfobyMajorid(id) {
            this.stageloading = true;
            post('/trainingprogramme/querytraininfobymajorid', {
                command: 'trainingprogramme/querytraininfobymajorid',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                id: id
            }).then(res => {
                this.stageloading = false;
                if (res && res.errcode) {
                    if (res.errcode == 0) {
                        if (res.majorlist.length > 0) {
                            let map = {}, dest = [];
                            let majorlist = res.majorlist;
                            if (majorlist.length > 0) {
                                this.isedit = true;
                                for (let i = 0; i < majorlist.length; i++) {
                                    let ai = majorlist[i];
                                    //分阶段
                                    if (ai.phase) {
                                        if (!map[ai.phase]) {
                                            this.stageListData.stageList[ai.phase].grouplist = [ai];
                                            map[ai.phase] = true;
                                        } else {
                                            for (let j = 0; j < this.stageListData.stageList.length; j++) {
                                                let aj = this.stageListData.stageList[j];
                                                if (aj.grouplist[0] && aj.grouplist[0].phase == ai.phase) {
                                                    this.stageListData.stageList[j].grouplist.push(ai);
                                                    break;
                                                }

                                            }
                                        }
                                        //不分阶段
                                    } else {
                                        this.stageListData.stageList[0].grouplist.push(ai);
                                    }


                                }
                            } else {
                                this.isedit = false;
                            }

                            // if(this.selectedMajor.isphase){
                            //     for(let i=this.stageListData.stageList.length;i<this.stagecount;i++){
                            //         this.stageListData.stageList.push({
                            //             grouplist:[]
                            //         });
                            //     }
                            // }
                        }
                    }
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.errdesc
                    })
                }
            });
        },
        //互斥 科室
        isSelect(optionValue, value, stageIndex, outerIndex) {
            if (optionValue == value) {
                return true;
            }
            for (let j of this.stageListData.stageList[stageIndex].grouplist[outerIndex].deptlist) {
                if (j.deptid == optionValue) {
                    return false;
                }
            }
            return true
        },
        //判断是否显示阶段
        isPhaseFn() {
            this.stageListData.stageList = [];
            if (this.selectedMajor.isphase == 1) {
                for (let i = 0; i < this.stagecount; i++) {
                    this.stageListData.stageList.push(
                        { grouplist: [] }
                    )
                }
            } else {
                this.stageListData.stageList = [
                    { grouplist: [] }
                ];
            }
        },
        //根据培训方案id查询培训专业
        getAddMajorList() {
            this.loading = true;
            post('/trainingprogramme/queryturnmajorbyturntrainid', {
                command: 'trainingprogramme/queryturnmajorbyturntrainid',
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                id: this.datalist.id
            }).then(res => {
                this.loading = false;
                if (res && res.errcode) {
                    if (res.errcode == 0) {
                        this.trainMajorList = res.majorlist;
                        if (this.trainMajorList.length > 0) {
                            this.selectedMajor.majorid = this.trainMajorList[0].baseid;
                            this.selectedMajor.isphase = this.trainMajorList[0].isphase;
                            this.selectedMajor.id = this.trainMajorList[0].id;

                            this.isPhaseFn()
                            this.getQueryTraininfobyMajorid(this.selectedMajor.id);//默认查询第一个专业的方案详情
                        } else {
                            this.stageListData.stageList = [];
                        }

                    }
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.errdesc
                    })
                }
            });
        },
        cancelMajorDialog() {
            this.trainMajor.visible = false;
        },
        cancel() {
            this.datalist.visible = false;
        },
        deleteTrainMajor() {
            if (this.selectTrainMajor.length == 0 || this.selectTrainMajor.length > 1) {
                this.$message({
                    type: "warning",
                    message: "请选择一个培训专业删除"
                })
                return;
            } else {
                this.$confirm('是否删除' + this.selectTrainMajor[0].majorname + '专业?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    post('/trainingprogramme/deleteturnmajor', {
                        command: 'trainingprogramme/deleteturnmajor',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        id: this.selectTrainMajor[0].id
                    }).then(res => {
                        if (res && res.errcode) {
                            if (res.errcode == 0) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功'
                                });
                                this.filterTrainMajor();
                                this.getAddMajorList();
                            }

                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.errdesc
                            })
                        }
                    });
                });
            }
        },
        // 培训专业选择（用于编辑）
        trainMajorSelect(val) {
            this.selectTrainMajor = val;

        },
        //根据培训方案查询方案
        getTrainingprogrammeSet(row, event, column) {
            let nodeName = event.hasOwnProperty('target') && event.target.hasOwnProperty('nodeName') ? event.target.nodeName : ""
            if (nodeName == "" || nodeName != "INPUT") {
                this.selectedMajor.majorid = row.baseid;
                this.selectedMajor.isphase = row.isphase;
                this.selectedMajor.id = row.id;
                this.isPhaseFn();//判断是否分阶段
                this.getQueryTraininfobyMajorid(this.selectedMajor.id);
            }
        },
        //获取培训专业
        getTrainingMajor() {
            get(`/base/level/getByCode?code=pubBase`, {
            }).then(res => {
                if (res.resCode == 200) {
                    this.majorList = res.model
                    this.filterTrainMajor();
                } else {
                    this.$message({
                        message: '请求失败',
                        type: 'error'
                    });
                }
            });
    },
    //增加轮转科室
    addDepartment(stageIndex, outerIndex, index) {
        this.stageListData.stageList[stageIndex].grouplist[outerIndex].deptlist.push({

        });
    },
    //移除轮转科室
    removeDepartment(stageIndex, outerIndex, index) {
        if (this.stageListData.stageList[stageIndex].grouplist[outerIndex].deptlist.length == 1) {
            this.stageListData.stageList[stageIndex].grouplist[outerIndex].deptlist.splice(index, 1);
            this.stageListData.stageList[stageIndex].grouplist.splice(outerIndex, 1);
        } else {
            this.stageListData.stageList[stageIndex].grouplist[outerIndex].deptlist.splice(index, 1);
            this.getDeptCount(stageIndex, outerIndex);
        }
        if (this.stageListData.stageList[stageIndex].grouplist[outerIndex].deptlist.length > 0) {
            this.getDeptCount(stageIndex, outerIndex);
        }


    },
    // 增加轮转科室序号
    addDepartmentList(stageIndex) {
        this.stageListData.stageList[stageIndex].grouplist.push(
            {
                deptcount: '',
                cycle: '',
                deptcount: '',//包含科室数量
                turndeptcount: '',//必转科室数量
                deptlist: [
                    {
                        deptid: '',
                        deptname: ""
                    }
                ]
            }
        );
    },
    //移除轮转科室序号
    removeDepartmentList(stageIndex) {
        this.stageListData.stageList[stageIndex].grouplist.pop();
    },
    submit(sign, url) {
        this.grouplist = [];
        this.$refs['stageListForm'].validate((valid) => {
            if (valid) {
                this.stageListData.stageList.map((item, outerIndex) => {
                    item.grouplist.map((outerItem, index) => {
                        this.$set(outerItem, 'orderflag', index);
                        if (this.selectedMajor.isphase == 1) {
                            this.$set(outerItem, 'phase', outerIndex)
                        } else {
                            this.$set(outerItem, 'phase', '')
                        }
                    });
                    if (item.grouplist.length > 0) {
                        item.grouplist.map((item, index) => {
                            this.grouplist.push(item);
                        });
                    }
                });
                let isgroupempty = false;
                isgroupempty = this.stageListData.stageList.some(item => {
                    return item.grouplist.length > 0
                });

                if (isgroupempty) {
                    this.issubmit = true;
                    this.submitloading = true;
                    post('/' + url, {
                        command: url,
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        majorid: this.selectedMajor.id,
                        grouplist: this.grouplist
                    }).then(res => {
                        this.issubmit = false;
                        this.submitloading = false;
                        if (res && res.errcode) {
                            if (res.errcode == 0) {
                                this.$message({
                                    type: "success",
                                    message: "方案保存成功"
                                })
                            }

                        } else {
                            this.$message({
                                type: 'warning',
                                message: res.errdesc
                            })
                        }
                    })
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请填写阶段内容'
                    })
                }

            }

        })
    },
    //增加阶段
    addStage(stageIndex) {

    },
    //移除阶段
    removeStage() {
        let length = this.stageList.length;
        this.stageListData.stageList.splice(length - 1, 1);
        // this.stageList.
    }
}
}
</script>

<style scoped lang="scss">
.train-major-list {
    margin-top: 20px;
}

.add-train-major {
    width: 80%;
    margin: 0 auto;
}

.stage-c {
    margin-top: 48px;

    .stage {

        /*float:right;*/
        .step {
            text-align: center;
            height: 40px;
            line-height: 40px;
            background: #eef1f6;
            border: 1px solid #dfe6ec;
            margin-top: 20px;
        }

        .table-wrap {
            border-top: 1px solid #bfcbd9;
        }
    }

    .add-div {
        margin-top: 10px;
        text-align: center;

        .icon {
            display: inline-block;
            width: 30px;
            height: 30px;
            background: url("../assets/images/add.png") no-repeat;
            background-size: 30px 30px;
            cursor: pointer;
            margin-left: 10px;
        }

        .removeIcon {
            display: inline-block;
            background: url("../assets/images/remove.png") no-repeat;
            background-size: 30px 30px;
        }
    }
}

.table-wrap {
    border-collapse: collapse;
    width: 100%;
    font-size: 12px;

    & /deep/ .el-form-item__error {
        left: 20px;
        top: 31px;
    }

    & /deep/ .dept-form-item .el-form-item__error {
        left: 45px;
    }

    td {
        text-align: center;
        border: 1px solid #bfcbd9;
        border-top: 0;
        padding: 5px 0;
        vertical-align: top;

        & /deep/ .el-select {
            width: 90px;

            .el-input {
                font-size: 12px;
            }
        }
    }

    td:nth-child(1) {
        vertical-align: middle;
    }

    td.td-index {
        width: 50px;
    }

    .rotation-w {
        .el-form-item {
            margin-bottom: 0;
        }

        padding: 5px 0;

        & /deep/ .el-select.dept-td {
            width: 160px;
        }

        .el-button+.el-button {
            margin-left: 0px;
        }

        & /deep/ .el-input--small .el-input__inner {
            font-size: 12px;
        }
    }
}

.fun-t {
    text-align: right;
}

.group-box /deep/ .activeBgColor {
    background: #eef1f6 !important;
}
</style>
<style>
.train-major .changeSize .el-dialog {
    width: 75%;
}
</style>