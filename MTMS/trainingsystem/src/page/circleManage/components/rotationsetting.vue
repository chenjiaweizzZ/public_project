<template>
    <div class="rotation-wrap">
        <el-dialog :visible.sync="datalist.visible" :title="datalist.title" class="ruleSettingSelf">
            <div class="rotation-c">
                <el-form ref="rotationForm" :model="rotationruledata" :rules="rotationrule" class="turnbaseinfo">
                    <el-form-item label="规则名称:" prop="name" label-width="130px">
                        <el-input v-model="rotationruledata.name" :disabled="datalist.isdetail" type="textarea" :maxlength="50" :rows="1"></el-input>
                    </el-form-item>
                    <el-form-item label="描述:" label-width="130px">
                        <el-input v-model="rotationruledata.description" :disabled="datalist.isdetail"></el-input>
                    </el-form-item>
                    <el-form-item label="选择培训方案:" label-width="130px" prop="trainlist">
                        <el-select multiple v-model="rotationruledata.trainlist" value-key="id" @visible-change="selectTrainDept" :disabled="datalist.isdetail">
                            <el-option v-for="item in  trainingprogrammelist" :value="{id:item.id}" :label="item.name" :key="item.id" :disabled="item.isselect"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="科室每月误差最大人数:" label-width="130px" prop="maxerror">
                        <el-select v-model="rotationruledata.maxerror" class="maxerror-select" size="small" :disabled="datalist.isdetail">
                            <el-option v-for="item in maxerrorlist" :value="item" :key="item">
                            </el-option>
                        </el-select>
                        <el-checkbox style="margin-left:10px;" v-model="specialset" :disabled="datalist.isdetail">特殊科室设置</el-checkbox>
                    </el-form-item>
                    <el-form-item class="special-dept" v-if="specialset">
                        <el-row v-for="(item,index) in rotationruledata.errorlist" style="margin-bottom:10px;">
                            <el-col :span="8">
                                <el-form-item label="科室:" label-width="130px" :prop="'errorlist['+index+'].deptid'" :rules="deptrules.deptid">
                                    <el-select v-model="item.deptid" size="small" :disabled="datalist.isdetail" placeholder="请先选择培训方案">
                                        <el-option v-for="dept in specialdept" :value="dept.deptid" :label="dept.deptname" v-show="specialSetShow(dept.deptid,item.deptid,rotationruledata.errorlist)">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="每月误差最大人数:" label-width="140px" :prop="'errorlist['+index+'].maxerror'" :rules="deptrules.maxerror">
                                    <el-select v-model="item.maxerror" class="maxerror-select" size="small" :disabled="datalist.isdetail">
                                        <el-option v-for="value in maxerrorlist" :value="value" :key="value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4" class="kswc-add">
                                <el-button type="primary" size="small" @click.stop="addspecialDept(index)" :disabled="datalist.isdetail">添加</el-button>
                                <el-button type="primary" size="small" @click.stop="removespecialDept(index)" v-if="index>=1" :disabled="datalist.isdetail">删除</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="科室轮转人数:" label-width="130px" prop="fixedpersonsign">
                        <el-radio-group v-model="rotationruledata.fixedpersonsign" :disabled="datalist.isdetail">
                            <el-radio :label="0">带教师生比</el-radio>
                            <el-radio :label="1">固定人数</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!--带教师生比-->
                    <el-form-item class="special-dept" v-if="rotationruledata.fixedpersonsign===0">
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="本专业师生比:" label-width="130px" prop="majorratio">
                                    <el-select v-model="rotationruledata.majorratio">
                                        <el-option v-for="value in teacherstudentratiolist" :value="value" :key="value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="非本专业师生比:" label-width="140px" prop="nomajorratio">
                                    <el-select v-model="rotationruledata.nomajorratio">
                                        <el-option v-for="value in fteacherstudentratiolist" :value="value" :key="value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                （师生比：1个老师可以带学员的比例）
                            </el-col>
                        </el-row>
                        <!--特殊科室人数设置-->
                        <el-row class="tsks-c">
                            <el-col :span="20">
                                <el-form-item label="特殊科室人数设置:" label-width="130px">
                                    <el-row v-for="(item,ratiolistindex) in rotationruledata.ratiolist" :key="ratiolistindex" style="margin-bottom: 10px;">
                                        <el-col :span="6">
                                            <el-form-item label="科室：" label-width="70px" :prop="'ratiolist['+ratiolistindex+'].deptid'" :rules="deptrules.ratiolistdeptid">
                                                <el-select class="" v-model="item.deptid" :disabled="datalist.isdetail" placeholder="请先选择培训方案">
                                                    <el-option v-for="dept in specialdept" :value="dept.deptid" :label="dept.deptname" v-show="specialSetShow(dept.deptid,item.deptid,rotationruledata.ratiolist)">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="本专业学员生师比:" label-width="130px" :prop="'ratiolist['+ratiolistindex+'].majorratio'" :rules="deptrules.ratiolistmajorratio">
                                                <el-select v-model="item.majorratio" :disabled="datalist.isdetail">
                                                    <el-option v-for="value in teacherstudentratiolist" :value="value" :key="value"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item label="非本专业学员生师比:" label-width="130px">
                                                <el-select v-model="item.nomajorratio" :disabled="datalist.isdetail">

                                                    <el-option v-for="value in fteacherstudentratiolist" :value="value" :key="value"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="2">
                                            <el-form-item label="非本专业学员生师比:" label-width="130px">
                                                <el-button type="primary" size="small" @click.stop="removeRatioList" :disabled="datalist.isdetail">删除</el-button>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-button type="primary" size="small" @click.stop="addRatioList" :disabled="datalist.isdetail">添加</el-button>
                                    </el-row>
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-form-item>
                    <!--固定人数-->
                    <el-form-item class="special-dept" v-if="rotationruledata.fixedpersonsign==1">
                        <el-row>
                            <el-col :span="16">
                                <el-form-item label="批量设置科室人数:" label-width="130px" style="margin-bottom: 20px;" prop="fixedperson">
                                    <el-row>
                                        <el-col :span="10">
                                            <el-select v-model="rotationruledata.fixedperson" :disabled="datalist.isdetail">
                                                <el-option v-for="people in 100 " :value="people">

                                                </el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="6">
                                            人
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <el-form-item label="特殊科室人数设置:" label-width="130px">
                                    <el-row v-for="(item,fixedlistindex)  in rotationruledata.fixedlist">
                                        <el-col :span="10">
                                            <el-form-item label="科室:" :prop="'fixedlist['+fixedlistindex+'].deptid'" :rules="deptrules.fixedlistdeptid" label-width="50px"
                                                style="margin-bottom: 20px;">
                                                <el-select v-model="item.deptid" :disabled="datalist.isdetail" placeholder="请先选择培训方案">
                                                    <el-option v-for="dept in specialdept" :value="dept.deptid" :label="dept.deptname" v-show="isSelectFixed(dept.deptid,item.deptid,rotationruledata.fixedlist)">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="10">
                                            <el-form-item label="科室人数:" :prop="'fixedlist['+fixedlistindex+'].fixedperson'" :rules="deptrules.fixedlistfixedperson" label-width="80px">
                                                <el-select v-model="item.fixedperson" :disabled="datalist.isdetail">
                                                    <el-option v-for="item in  100" :value="item"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-button type="primary" size="small" @click.stop="deleteFixDept" style="margin-left: 10px" :disabled="datalist.isdetail">删除</el-button>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col>
                                            <el-button type="primary" size="small" @click.stop="addFixDept" :disabled="datalist.isdetail">添加</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
                <!--科室联动方案设置-->
                <el-tabs v-model="planname" @tab-click="handleClick">
                    <el-tab-pane :label="item.name" v-for="(item,index) in selecttrainingprogrammelist">
                        <dept-link :ref="'rule'+index" :trainturnlist="item.trainturnlist" :isdetail="datalist.isdetail" :deptruledata="deptruledata"
                            :majorlist="item.majorlist">
                        </dept-link>
                    </el-tab-pane>
                </el-tabs>
                <div class="btn-c">
                    <el-button type="primary" size="small" @click.stop="cancel" :disabled="datalist.isdetail">取消</el-button>
                    <el-button type="primary" size="small" @click.stop="submit('add','turnrule/add')" v-if="!datalist.isedit" :disabled="datalist.isdetail"
                        v-loading="isbtnloading" :class="{noclick:issubmit}">保存</el-button>
                    <el-button type="primary" size="small" @click.stop="submit('edit','turnrule/edit')" v-if="datalist.isedit" :disabled="datalist.isdetail"
                        v-loading="isbtnloading" :class="{noclick:issubmit}">编辑</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import deptLink from './deptlink';
    import { currentYear, getCookie, post, exportExcel } from '../../../config/util'
    import { mapState, mapActions } from 'vuex'
    export default {
        name: "rotationsetting",
        props: {
            datalist: [Array, Object],
            detailshow: [Array, Object],
            rulelist: [Array, Object],
            ruledetaildata: [Array, Object],

        },
        components: {
            deptLink
        },
        computed: {
            ...mapState([
                'stagecount'
            ]),
        },
        data() {
            //判断培训方案是否重名
            return {
                initrulename: '',
                name: '',
                isbtnloading: false,
                specialset: false,
                studentteacherratio: 2,
                planname: 0,
                selecttrainingprogrammelist: [],
                trainingprogrammelist: [],
                maxerrorlist: [],
                specialdeptlist: [{}],
                teacherstudentratiolist: [],//本专业师生比
                fteacherstudentratiolist: [],//分本专业师生比
                specialdept: [],//特殊科室列表
                fixedperson: '',
                deptruledata: [],
                edittrainturnlist: [],
                errorwarning: { name: '', message: '' },
                issubmit: false,
                rotationruledata: {
                    fixedpersonsign: '',
                    name: '',//方案名字
                    description: '',//方案描述
                    trainlist: [],//选择方案
                    maxerror: '',//人数差
                    fixedperson: '',
                    majorratio: '',
                    nomajorratio: '',
                    fixedlist: [],
                    ratiolist: [],
                    errorlist: [{}]//特殊科室设置
                },
                //规则验证
                rotationrule: {
                    name: [{ required: true, trigger: 'blur', message: "轮转规则不能为空" }],
                    trainlist: [{ required: true, message: '培训方案不能为空' }],
                    maxerror: [{ required: true, message: '误差最大人数不能为空', trigger: 'change', type: 'number' }],
                    fixedpersonsign: [{ required: true, message: '请选择科室轮转人数', trigger: 'change', type: 'number' }],
                    major_first: [{ required: true, message: '请选择科室轮转人数', trigger: 'change', type: 'number' }],
                    compulsory_first: [{ required: true, message: '请选择本专业轮转顺序', trigger: 'change', type: 'number' }],
                    fixedperson: [{ required: true, message: '批量设置科室人数', trigger: 'change', type: 'number' }],
                    majorratio: [{ required: true, message: '本专业师生比不能为空', trigger: 'change', type: 'number' }],
                    nomajorratio: [{ required: true, message: '非本专业师生比不能为空', trigger: 'change', type: 'number' }]
                },
                deptrules: {
                    deptid: [{ required: true, message: "特殊科室不能为空", trigger: 'change', type: 'number' }],
                    ratiolistdeptid: [{ required: true, message: "特殊科室不能为空", trigger: 'change', type: 'number' }],
                    fixedlistdeptid: [{ required: true, message: "特殊科室不能为空", trigger: 'change', type: 'number' }],
                    fixedlistfixedperson: [{ required: true, message: "科室人数不能为空", trigger: 'change', type: 'number' }],
                    maxerror: [{ required: true, message: "误差最大人数不能为空", trigger: 'change', type: 'number' }],
                    ratiolistmajorratio: [{ required: true, message: "师生比不能为空", trigger: 'change', type: 'number' }],
                }
            }
        },
        methods: {
            handleClick(tab, e) {
                this.queryturnmajorbyturnTrainid(tab.index, this.selecttrainingprogrammelist[tab.index].id)
            },
            //对象去空
            filterParams(obj) {
                var _newPar = {};
                for (var key in obj) {
                    if ((obj[key] === 0 || obj[key] === false || obj[key]) && obj[key].toString().replace(/(^\s*)|(\s*$)/g, '') !== '') {
                        _newPar[key] = obj[key];
                    }
                }
                return _newPar;
            },
            specialSetShow(optionValue, value, deptlist) {
                if (optionValue == value) {
                    return true
                }
                for (let i = 0; i < deptlist.length; i++) {
                    let ai = deptlist[i];
                    if (ai.deptid == optionValue) {
                        return false
                    }
                }
                return true
            },
            //根据培训方案id查询相关的专业
            queryturnmajorbyturnTrainid(index, id) {
                post('/trainingprogramme/queryturnmajorbyturntrainid', {
                    command: 'trainingprogramme/queryturnmajorbyturntrainid',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: id
                }).then(res => {
                    if (res && res.errcode == 0) {
                        this.$set(this.selecttrainingprogrammelist[index], 'majorlist', res.majorlist)
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.errdesc
                        })
                    }
                });
            },
            //带教师生特殊科室设置
            addRatioList() {
                this.rotationruledata.ratiolist.push({ deptid: "", majorratio: '', nomajorratio: '' })
            },
            removeRatioList() {
                this.rotationruledata.ratiolist.pop();
            },
            //添加特殊科室
            addspecialDept(index) {
                index = index + 1;
                this.rotationruledata.errorlist.splice(index, 0, {});
            },
            removespecialDept(index) {
                this.rotationruledata.errorlist.splice(index, 1);
            },
            //获取方案下的数组科室
            selectTrainDept(sign) {
                if (!sign) {
                    if (this.rotationruledata.trainlist.length > 0) {
                        this.getDeptlistbyTrainid();
                        this.queryturnmajorbyturnTrainid(0, this.selecttrainingprogrammelist[0].id)//初始化查询培训方案相关专业
                    }
                }
            },
            //互斥 科室
            isSelect(optionValue, value) {
                if (optionValue == value) {
                    return true;
                }
                for (let i = 0; i < this.specialdeptlist.length; i++) {
                    if (this.specialdeptlist[i].deptid == optionValue) {
                        return false;
                    }
                }
                return true;

            },
            isSelectFixed(optionValue, value, data) {
                if (optionValue == value) {
                    return true;
                }
                for (let i = 0; i < data.length; i++) {
                    if (data[i].deptid == optionValue) {
                        return false;
                    }
                }
                return true;
            },
            init() {
                this.trainingprogrammelist.map(item => {
                    this.$set(item, 'isselect', false);
                    this.rotationruledata.trainlist.map(selectVal => {
                        if (selectVal.id == item.id) {
                            this.selecttrainingprogrammelist.push({
                                id: item.id,
                                name: item.name,
                                degreelist: item.degreelist,
                                majorlist: [],
                                trainturnlist: {
                                    trainid: item.id,
                                    linkage: [],
                                    first: [],
                                    special: []
                                },
                            });
                            //获取方案下的科室
                            this.getDeptlistbyTrainid();
                            this.edittrainturnlist.map(edittrain => {
                                this.selecttrainingprogrammelist.map(selecttrain => {
                                    if (edittrain.trainid == selecttrain.id) {
                                        selecttrain.trainturnlist = {
                                            trainid: selecttrain.id,
                                            linkage: edittrain.linkage ? edittrain.linkage : [],
                                            first: edittrain.first ? edittrain.first : [],
                                            special: edittrain.special ? edittrain.special : []
                                        }
                                    }
                                })

                            })
                            //根据majorid查询科室
                            this.selecttrainingprogrammelist.map((selecttrain, msIndex) => {
                                for (let key in selecttrain.trainturnlist) {
                                    if (key != 'trainid') {
                                        selecttrain.trainturnlist[key].map((major, majorIndex) => {
                                            let res = this.querytraininfobymajorid(major.majorid);
                                            this.$set(selecttrain.trainturnlist[key][majorIndex], 'deptdata', res.deptList);
                                            this.$set(selecttrain.trainturnlist[key][majorIndex], 'time', res.time);
                                        })
                                    }

                                }
                                //根据方案id查询相关专业
                                this.queryturnmajorbyturnTrainid(msIndex, selecttrain.id)
                            })
                        }
                    });
                    this.selecttrainingprogrammelist.map(selectItem => {
                        selectItem.degreelist.map(selectItemDegree => {
                            item.degreelist.every(innerItem => {
                                if (innerItem.id == selectItemDegree.id) {
                                    this.$set(item, 'isselect', true);
                                    return false;
                                }
                            })
                        })
                    })
                })
            },
            getDeptlistbyTrainid() {
                this.specialdept = [];
                let trainlist = [];
                this.rotationruledata.trainlist.map(item => {
                    trainlist.push(item.id)
                });
                post('/trainingprogramme/querydeptlistbytrainid', {
                    command: 'trainingprogramme/querydeptlistbytrainid',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    list: trainlist
                }).then(res => {
                    if (res && res.errcode) {
                        if (res.errcode == 0) {
                            this.specialdept = res.list;
                        }
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.errdesc
                        })
                    }
                });
            },
            getMaxerror() {
                post('/commparaconf/querycommparaconflist', {
                    command: 'commparaconf/querycommparaconflist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    paramcode: "turn_maxerror"
                }).then(res => {
                    if (res && res.errcode) {
                        if (res.errcode == 0) {
                            let data = res.commparaconflist;
                            this.maxerrorvalue = Number(data[0].paramvalue);
                            for (let i = 1; i <= this.maxerrorvalue; i++) {
                                this.maxerrorlist.push(i)
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
            //删除固定的特殊科室
            deleteFixDept() {
                this.rotationruledata.fixedlist.pop();
            },
            //增加固定的特殊科室
            addFixDept() {
                this.rotationruledata.fixedlist.push(
                    { deptid: '', fixedperson: '' }
                );
            },
            getTrainingProgrammeList() {
                post('/trainingprogramme/list', {
                    command: 'trainingprogramme/list',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    name: "",
                }).then(res => {
                    if (res && res.errcode) {
                        if (res.errcode == 0) {
                            this.trainingprogrammelist = res.list;
                            this.init()
                        }
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.errdesc
                        })
                    }
                });
            },
            //本专业师生比
            getTeacherstudentatiolist() {
                post('/commparaconf/querycommparaconflist', {
                    command: 'commparaconf/querycommparaconflist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    paramcode: "turn_majorratio"
                }).then(res => {
                    if (res && res.errcode) {
                        if (res.errcode == 0) {
                            let data = res.commparaconflist;
                            this.fteacherstudentratiolist = Number(data[0].paramvalue);
                        }
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.errdesc
                        })
                    }
                });
            },

            getfTeacherstudentatiolist() {
                post('/commparaconf/querycommparaconflist', {
                    command: 'commparaconf/querycommparaconflist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    paramcode: "turn_majorratio"
                }).then(res => {
                    if (res && res.errcode) {
                        if (res.errcode == 0) {
                            let data = res.commparaconflist;
                            this.teacherstudentratiolist = Number(data[0].paramvalue);
                        }
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.errdesc
                        })
                    }
                });
            },
            //取消
            cancel() {
                this.datalist.visible = false;
            },
            querytraininfobymajorid(baseid, sign, index) {
                let mapdest = {}, destList_l = [];
                let map = {}, dest = [], deptList = [], totalTime = [], init_time = 0, timeArr = [];
                post('/trainingprogramme/querytraininfobymajorid', {
                    command: 'trainingprogramme/querytraininfobymajorid',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: baseid
                }).then(res => {
                    if (res && res.errcode) {
                        if (res.errcode == 0) {
                            let majorlist = res.majorlist;
                            for (let i = 0; i < majorlist.length; i++) {
                                let ai = majorlist[i];
                                if (!map[ai.phase]) {
                                    dest.push({
                                        phase: ai.phase,
                                        cycle: ai.cycle,
                                        deptlist: ai.deptlist
                                    })
                                    map[ai.phase] = true;
                                } else {
                                    for (let j = 0; j < dest.length; j++) {
                                        let aj = dest[j];
                                        if (aj.phase == ai.phase) {
                                            for (let k = 0; k < ai.deptlist.length; k++) {
                                                let ak = ai.deptlist[k];
                                                aj.deptlist.push({
                                                    deptid: ak.deptid,
                                                    deptname: ak.deptname,
                                                    deptindex: ak.deptindex
                                                })
                                            }
                                            break;
                                        }
                                    }
                                }

                            }
                            // 计算每个阶段的时间cycle
                            for (let j = 0; j < this.stagecount; j++) {
                                timeArr.push([]);
                                for (let i = 0; i < majorlist.length; i++) {
                                    let ai = majorlist[i];
                                    if (ai.phase !== '' && ai.phase != null) {
                                        if (ai.phase == j) {
                                            init_time += ai.cycle * ai.turndeptcount;
                                        }
                                    } else {
                                        init_time += ai.cycle * ai.turndeptcount;
                                    }

                                }
                                totalTime.push(parseInt(init_time));
                            }
                            for (let i = 0; i < totalTime.length; i++) {
                                if (i == 0) {
                                    for (let j = 1; j <= totalTime[i]; j++) {
                                        timeArr[i].push(j)
                                    }
                                } else {
                                    for (let j = totalTime[i - 1] + 1; j <= totalTime[i]; j++) {
                                        timeArr[i].push(j)
                                    }
                                }

                            }
                            //科室信息
                            for (let i = 0; i < dest.length; i++) {
                                let ai = dest[i];
                                for (let j = 0; j < ai.deptlist.length; j++) {
                                    let aj = ai.deptlist[j];
                                    deptList.push({
                                        deptname: aj.deptname,
                                        deptid: aj.deptid,
                                        phase: ai.phase,
                                        cycle: ai.cycle,
                                    })
                                }
                            }
                            //deptList去重
                            // for(let kk=0;kk<deptList.length;kk++){
                            //     let ki=deptList[kk];
                            //     if(!mapdest[ki.deptid]){
                            //         destList_l.push({
                            //             deptname:ki.deptname,
                            //             deptid:ki.deptid,
                            //             phase:ki.phase,
                            //             cycle:ki.cycle
                            //         })
                            //         mapdest[ki.deptid]=true;
                            //     }
                            // }


                        }
                    } else {
                        self.toast(res.errdesc)
                    }
                })
                return { deptList: deptList, time: timeArr }
            },
            submit(sign, url) {
                let degreelist = [];
                this.selecttrainingprogrammelist.map((item) => {
                    this.$set(item, 'turninfolist', []);
                    this.$set(item, 'trainid', item.id);
                    var trainturnIndex = -1;
                    for (let key in item.trainturnlist) {
                        if (key == 'linkage') {
                            item.trainturnlist[key].map((innerItem, innerIndex) => {
                                trainturnIndex++;
                                let phases = 0;
                                for (let i = 0; i < innerItem.count.length; i++) {
                                    let ai = innerItem.count[i];
                                    if (ai.dept.length > 0) {
                                        if (ai.isphase !== 0) {
                                            for (let j = 0; j < ai.dept.length; j++) {
                                                let aj = ai.dept[j];
                                                phases = ai.key;
                                            }
                                        } else {
                                            phases = 1;
                                        }

                                    }
                                }
                                item.turninfolist.push({
                                    code: key,
                                    majorid: innerItem.majorid,
                                    phases: phases,
                                    deptlist: []
                                })
                                innerItem.count.map(deptlist => {
                                    deptlist.dept.map(dept => {
                                        if (dept.deptid) {
                                            item.turninfolist[trainturnIndex].deptlist.push(dept);
                                        }
                                    })
                                })
                            });
                        }
                        if (key == 'first') {
                            item.trainturnlist[key].map((innerItem, innerIndex) => {
                                trainturnIndex++
                                let phases = 0;
                                for (let i = 0; i < innerItem.count.length; i++) {
                                    let ai = innerItem.count[i];
                                    if (ai.adddeptdata.length > 0) {
                                        if (ai.isphase !== 0) {
                                            for (let j = 0; j < ai.adddeptdata.length; j++) {
                                                let aj = ai.adddeptdata[j];
                                                phases = ai.key;
                                            }
                                        } else {
                                            phases = 1;
                                        }

                                    }
                                }

                                item.turninfolist.push({
                                    code: key,
                                    majorid: innerItem.majorid,
                                    phases: phases,
                                    deptlist: []
                                })
                                innerItem.count.map(deptlist => {
                                    deptlist.adddeptdata.map(dept => {
                                        if (dept.dept.deptid) {
                                            item.turninfolist[trainturnIndex].deptlist.push(dept.dept)
                                        }

                                    })
                                })
                            });
                        }
                        if (key == 'special') {
                            item.trainturnlist[key].map((innerItem, innerIndex) => {
                                trainturnIndex++
                                let phases = 0;
                                for (let i = 0; i < innerItem.count.length; i++) {
                                    let ai = innerItem.count[i];
                                    if (ai.dept.deptid !== '' && ai.dept.deptid !== undefined) {
                                        phases = ai.key;
                                    }
                                }

                                item.turninfolist.push({
                                    code: key,
                                    majorid: innerItem.majorid,
                                    phases: phases,
                                    deptlist: []
                                })
                                innerItem.count.map(deptlist => {
                                    if (deptlist.dept.deptid) {
                                        item.turninfolist[trainturnIndex].deptlist.push({
                                            beginmonth: deptlist.beginmonth,
                                            endmonth: deptlist.endmonth,
                                            deptid: deptlist.dept.deptid,
                                            phase: deptlist.dept.phase,
                                            deptindex: deptlist.dept.deptindex
                                        });
                                    }

                                })
                            });
                        }

                    }
                })
                this.selecttrainingprogrammelist.map((item, index) => {
                    degreelist.push({ turninfolist: [] });//提交数据结构转换
                    degreelist[index].trainid = item.trainid;
                    item.turninfolist.map(innerItem => {
                        degreelist[index].turninfolist.push(innerItem);
                    })
                });
                this.$refs.rotationForm.validate(valid => {
                    let rotationruledata = this.rotationruledata;
                    if (rotationruledata.errorlist && rotationruledata.errorlist.length > 0) {
                        if (JSON.stringify(rotationruledata.errorlist[0]) == '{}') {
                            delete rotationruledata['errorlist'];
                        }
                    }

                    let validateArr = []
                    this.selecttrainingprogrammelist.map((item, index) => {
                        validateArr.push('validate' + index)
                    })
                    for (let i = 0; i < validateArr.length; i++) {
                        validateArr[i] = this.$refs['rule' + i][0].validateForm()
                    }
                    if (valid) {
                        let isvalid = true;
                        //方案子组件的验证
                        validateArr.every(item => {
                            if (!item) {
                                isvalid = false;
                                return false;
                            }
                        })
                        let option = {};
                        if (sign == 'edit') {
                            option.id = this.datalist.id;
                        }
                        if (isvalid) {
                            this.isbtnloading = true;
                            post('/' + url, {
                                command: url,
                                sessionid: getCookie('sid'),
                                loginid: getCookie('uid'),
                                trainturnlist: degreelist,
                                ...rotationruledata,
                                ...option
                            }).then(res => {
                                this.isbtnloading = false;
                                if (res && res.errcode == 0) {
                                    this.$message({
                                        type: 'success',
                                        message: "规则保存成功"
                                    });
                                    this.datalist.visible = false;
                                    this.$emit('getTurnruleList')
                                } else {
                                    this.$message({
                                        type: 'warning',
                                        message: res.errdesc
                                    })
                                }
                            });
                        }

                    }

                })
            },
        },

        mounted() {
            this.getTrainingProgrammeList();//获取培训方案
            this.getMaxerror();//获取科室误差最大人数
            this.getTeacherstudentatiolist();//师生比
            this.getfTeacherstudentatiolist();//非专业师生比
        },
        watch: {
            'rotationruledata.fixedpersonsign'(val) {
                if (val == 0) {
                    this.rotationruledata.fixedperson = '';
                    this.rotationruledata.fixedlist = [];
                }
                if (val == 1) {
                    this.rotationruledata.majorratio = '';
                    this.rotationruledata.nomajorratio = '';
                    this.rotationruledata.ratiolist = [];
                }

            },
            ruledetaildata(val) {
                if (val) {
                    let trainlist = [], gettrainlist = [];
                    val.trainlist.map(val => {
                        trainlist.push(val.id);
                        gettrainlist.push({ id: val.id });
                    });
                    //详情
                    this.rotationruledata.name = val.name;
                    this.initrulename = this.rotationruledata.name;//初始化的规则名字
                    this.rotationruledata.description = val.description;
                    this.rotationruledata.maxerror = val.maxerror;

                    if (val.fixedperson) {
                        this.rotationruledata.fixedpersonsign = 1
                        this.rotationruledata.fixedperson = val.fixedperson;
                    } else {
                        this.rotationruledata.fixedpersonsign = 0;
                    }
                    if (val.errorlist.length > 0) {
                        this.rotationruledata.errorlist = val.errorlist;
                        this.specialset = true;

                    }
                    if (val.fixedlist.length > 0) {
                        this.rotationruledata.fixedlist = val.fixedlist;
                    }
                    if (val.major_first != undefined || val.major_first !== '') {
                        this.rotationruledata.major_first = val.major_first;
                    }
                    if (val.compulsory_first != undefined || val.compulsory_first !== '') {
                        this.rotationruledata.compulsory_first = val.compulsory_first;
                    }
                    if (val.majorratio) {
                        this.rotationruledata.majorratio = val.majorratio;
                    }
                    if (val.nomajorratio) {
                        this.rotationruledata.nomajorratio = val.nomajorratio;
                    }
                    if (val.ratiolist.length > 0) {
                        this.rotationruledata.ratiolist = val.ratiolist;
                    }
                    this.deptruledata = val;
                    this.rotationruledata.trainlist = gettrainlist;
                    //详情数据转换成页面逻辑数据
                    if (this.deptruledata.trainturnlist && this.deptruledata.trainturnlist.length > 0) {
                        this.deptruledata.trainturnlist.map((item, index) => {
                            let map = {}, dest = [];//所有模式规则对象的数组
                            this.$set(this.edittrainturnlist, index, {});
                            this.$set(this.edittrainturnlist[index], 'trainid', item.trainid);
                            for (let i = 0; i < item.turninfolist.length; i++) {
                                let ai = item.turninfolist[i];
                                if (!map[ai.code]) {
                                    dest.push({
                                        code: ai.code,
                                        data: [ai]
                                    })
                                    map[ai.code] = true;
                                } else {
                                    for (let j = 0; j < dest.length; j++) {
                                        let aj = dest[j];
                                        if (aj.code == ai.code) {
                                            aj.data.push(ai);
                                        }
                                    }
                                }
                            }
                            dest.map(destItem => {
                                // destItem.data_l=[];
                                destItem.data.map(deptinnerItem => {
                                    deptinnerItem.data_l = [];
                                    let datamap = {};//根据阶段分类科室
                                    for (let h = 0; h < deptinnerItem.deptlist.length; h++) {
                                        let hi = deptinnerItem.deptlist[h];
                                        if (!datamap[hi.phase]) {
                                            deptinnerItem.data_l.push({
                                                phase: hi.phase,
                                                data: [hi]
                                            });
                                            datamap[hi.phase] = true;
                                        } else {
                                            for (let f = 0; f < deptinnerItem.data_l.length; f++) {
                                                let fi = deptinnerItem.data_l[f];
                                                if (fi.phase == hi.phase) {
                                                    fi.data.push(hi)
                                                }
                                            }
                                        }
                                    }
                                })
                            })
                            dest.map((item, destIndex) => {
                                //初始化模式数组
                                this.$set(this.edittrainturnlist[index], item.code, []);
                                //遍历每个模式下不同的专业
                                item.data.map((innerItem, innerIndex) => {
                                    if (innerItem.code == 'linkage') {
                                        let countContent = [];
                                        for (let i = 0; i < this.stagecount; i++) {
                                            countContent.push({
                                                key: i + 1, dept: [], isphase: innerItem.isphase
                                            })
                                        }
                                        this.edittrainturnlist[index][item.code].push({
                                            code: innerItem.code,
                                            majorid: innerItem.majorid,
                                            count: countContent
                                        })
                                        this.edittrainturnlist[index][item.code][innerIndex].count.map(count => {
                                            innerItem.data_l.map(tt => {
                                                tt.data.map(pp => {
                                                    if (pp.phase + 1 == count.key) {
                                                        count.dept.push({ phase: pp.phase, deptid: pp.deptid, deptindex: pp.deptindex });
                                                    }
                                                })

                                            })
                                        })
                                    }
                                    if (innerItem.code == 'first') {
                                        let countContent = [];
                                        for (let i = 0; i < this.stagecount; i++) {
                                            countContent.push({
                                                key: i + 1, adddeptdata: [], isphase: innerItem.isphase
                                            });
                                        }
                                        this.edittrainturnlist[index][item.code].push({
                                            code: innerItem.code,
                                            majorid: innerItem.majorid,
                                            count: countContent
                                        })
                                        this.edittrainturnlist[index][item.code][innerIndex].count.map(count => {
                                            innerItem.data_l.map(tt => {
                                                tt.data.map(pp => {
                                                    if (pp.phase + 1 == count.key) {
                                                        count.adddeptdata.push({ dept: { phase: pp.phase, deptid: pp.deptid, orderflag: pp.orderflag, deptindex: pp.deptindex } });
                                                    }
                                                })

                                            })
                                        })
                                    }
                                    if (innerItem.code == 'special') {
                                        let countContent = [];
                                        for (let i = 0; i < this.stagecount; i++) {
                                            countContent.push({
                                                key: i + 1, dept: {}, beginmonth: '', isphase: innerItem.isphase, endmonth: '', monthstate: ''
                                            })
                                        }
                                        this.edittrainturnlist[index][item.code].push({
                                            code: innerItem.code,
                                            majorid: innerItem.majorid,
                                            count: countContent
                                        })
                                        this.edittrainturnlist[index][item.code][innerIndex].count.map(count => {
                                            innerItem.data_l.map(tt => {
                                                tt.data.map(pp => {
                                                    if (pp.phase + 1 == count.key) {
                                                        count.dept = { phase: pp.phase, deptid: pp.deptid, deptindex: pp.deptindex }
                                                        count.beginmonth = pp.beginmonth
                                                        count.endmonth = pp.endmonth
                                                        if (count.beginmonth) {
                                                            count.monthstate = 1;
                                                        }
                                                        if (count.endmonth) {
                                                            count.monthstate = 2;
                                                        }
                                                    }
                                                })

                                            })
                                        })
                                    }
                                })
                            })
                            // this.edittrainturnlist.map(edittrainItem=>{
                            //
                            // })
                        })
                    }
                }
            },
            specialdeptlist(val) {
                // console.log(val)
            },
            'rotationruledata.trainlist': function (val) {
                this.selecttrainingprogrammelist = [];
                this.trainingprogrammelist.map(item => {
                    this.$set(item, 'isselect', false);
                    val.map(selectVal => {
                        if (selectVal.id == item.id) {
                            this.selecttrainingprogrammelist.push({
                                id: item.id,
                                name: item.name,
                                degreelist: item.degreelist,
                                majorlist: [],
                                trainturnlist: {
                                    trainid: item.id,
                                    linkage: [],
                                    first: [],
                                    special: []
                                },
                            });
                            //获取方案下的科室
                            this.getDeptlistbyTrainid();
                            this.edittrainturnlist.map(edittrain => {
                                this.selecttrainingprogrammelist.map(selecttrain => {
                                    if (edittrain.trainid == selecttrain.id) {
                                        selecttrain.trainturnlist = {
                                            trainid: selecttrain.id,
                                            linkage: edittrain.linkage ? edittrain.linkage : [],
                                            first: edittrain.first ? edittrain.first : [],
                                            special: edittrain.special ? edittrain.special : []
                                        }
                                    }
                                })

                            })
                            //根据majorid查询科室
                            this.selecttrainingprogrammelist.map((selecttrain, msIndex) => {
                                for (let key in selecttrain.trainturnlist) {
                                    if (key != 'trainid') {
                                        selecttrain.trainturnlist[key].map((major, majorIndex) => {
                                            let res = this.querytraininfobymajorid(major.majorid);
                                            this.$set(selecttrain.trainturnlist[key][majorIndex], 'deptdata', res.deptList);
                                            this.$set(selecttrain.trainturnlist[key][majorIndex], 'time', res.time);
                                        })
                                    }

                                }
                                //根据方案id查询相关专业
                                this.queryturnmajorbyturnTrainid(msIndex, selecttrain.id)
                            })
                        }
                    });
                    this.selecttrainingprogrammelist.map(selectItem => {
                        selectItem.degreelist.map(selectItemDegree => {
                            item.degreelist.every(innerItem => {
                                if (innerItem.id == selectItemDegree.id) {
                                    this.$set(item, 'isselect', true);
                                    return false;
                                }
                            })
                        })
                    })
                })
            },
            selecttrainingprogrammelist(val) {

            }
        }
    }
</script>

<style scoped lang="scss">
    .rotation-c {
        width: 100%;
        margin: 0 auto;
        .turnbaseinfo {
            width: 100%;
        }
        .el-select {
            width: 100%;
        }
        .maxerror-select {
            width: 222px;
        }
        & /deep/ .el-form-item__label {
            word-break: break-all;
            font-size: 12px;
        }
        .wc-value {
            width: 120px;
        }
        .special-dept {
            .el-select {
                width: 100%;
            }
            .dept-w {
                width: 120px;
            }
            .kswc-add {
                margin-left: 10px;
            }
            .tsks-c {
                margin-top: 20px;
            }
        }
    }

    .btn-c {
        text-align: right;
        button {
            cursor: pointer;
        }
    }
</style>
<style>
.rotation-wrap .ruleSettingSelf .el-dialog{
    width: 880px;
}

</style>