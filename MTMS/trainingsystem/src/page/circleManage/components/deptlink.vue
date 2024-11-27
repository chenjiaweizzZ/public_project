<template>
    <div class="deptlink-c">
        <el-form :model="trainturnlist" ref="trainturnlistform">
            <el-form-item label="科室联动轮转设置:" label-width="130px" class="formitemborder">
                <el-row v-show="trainturnlist.linkage.length>0">
                    <el-col :span="24">
                        <el-row v-for="(item,linkageIndex) in trainturnlist.linkage" style="margin-bottom: 20px;">
                            <el-col :span="2">
                                <el-button type="primary" size="small" @click.stop="removeLinkage(linkageIndex)" v-if="trainturnlist.linkage.length>0" :disabled="isdetail">删除</el-button>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="培训专业" :rules='trainturnlistrule.majorid' :prop="'linkage['+linkageIndex+'].majorid'">
                                    <el-select v-model="item.majorid" :disabled="isdetail" @change="querytraininfobymajorid(item.majorid,'linkage',linkageIndex)">
                                        <el-option v-for="item in majorlist" :value="item.id" :label="item.majorname">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="13">
                                <el-form-item :label="linkItem.isphase==1 ? '第'+(linkIndex+1)+'阶段：联动轮转科室' : '联动轮转科室:'" v-if="linkItem.isphase==1 ? true : linkIndex==0"
                                    :prop="'linkage['+linkageIndex+'].count['+linkIndex+'].dept'" label-width="160px" class="linkagedept errordept"
                                    v-for="(linkItem,linkIndex) in item.count">
                                    <el-select v-model="linkItem.dept" :disabled="isdetail" multiple value-key="deptindex">
                                        <el-option v-for="(inneritem,deptIndex) in trainturnlist['linkage'][linkageIndex].deptdata" :value="{deptid:inneritem.deptid,phase:inneritem.phase,deptindex:deptIndex}"
                                            :label="inneritem.deptname+' - '+deptIndex" v-show="inneritem.phase!=null&&inneritem.phase!==''? inneritem.phase==linkIndex:true">

                                        </el-option>

                                    </el-select>
                                </el-form-item>
                                <el-form-item :rules="trainturnlistrule.linkagecount" :prop="'linkage['+linkageIndex+'].count'">

                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item>
                            <el-button type="primary" size="small" @click="addLinkage" :disabled="isdetail">添加</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form-item>
            <!--科室优先设置-->
            <el-form-item label="科室优先设置:" label-width="130px" class="formitemborder">
                <el-row v-show="trainturnlist.first.length>0">
                    <el-col :span="24" class="pxzy">
                        <el-row v-for="(item,outerIndex) in trainturnlist.first" style="margin-bottom: 20px;">
                            <el-col :span="2">
                                <el-button type="primary" size="small" @click.stop="removeFirst(outerIndex)" :disabled="isdetail">删除</el-button>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="培训专业" :rules='trainturnlistrule.majorid' :prop="'first['+outerIndex+'].majorid'">
                                    <el-select v-model="item.majorid" :disabled="isdetail" @change="querytraininfobymajorid(item.majorid,'first',outerIndex)">
                                        <el-option v-for="item in majorlist" :value="item.id" :label="item.majorname">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="17">
                                <div>
                                    <el-form-item :label="count.isphase==1 ? '第'+(count.key)+'阶段：科室顺序' : '科室顺序:'" v-if="count.isphase==1 ? true : count.key==1"
                                        class="firstdept errordept" label-width="160px" v-for="(count,countIndex) in item.count">
                                        <div v-for="(adddept,adddeptindex) in count.adddeptdata" class="deptlink-item">
                                            <el-form-item :rules="trainturnlistrule.firstdept" :prop="'first['+outerIndex+'].count['+countIndex+'].adddeptdata['+adddeptindex+'].dept'">
                                                <el-select v-model="adddept.dept" :disabled="isdetail" value-key="deptindex">
                                                    <el-option v-for="(inneritem,index) in trainturnlist['first'][outerIndex].deptdata" :value="{deptid:inneritem.deptid,phase:inneritem.phase,orderflag:adddeptindex+1,deptindex:index}"
                                                        :label="inneritem.deptname+' -'+index" v-if="isSelect(inneritem.deptid,adddept.dept.deptid,outerIndex,countIndex,item.majorid)"
                                                        v-show="inneritem.phase!=null&&inneritem.phase!=='' ? inneritem.phase==countIndex : true">

                                                    </el-option>
                                                </el-select>
                                                <span class="arrow-right"><i class="el-icon-d-arrow-right"></i></span>

                                            </el-form-item>
                                        </div>
                                        <div class="funTools">
                                            <el-button class="group-btn remove-btn" @click.stop="removeDept(outerIndex,countIndex)" v-if="!isdetail"></el-button>
                                            <el-button class="group-btn add-btn" @click.stop="addDept(outerIndex,countIndex)" v-if="!isdetail"></el-button>
                                        </div>
                                    </el-form-item>
                                    <el-form-item :rules="trainturnlistrule.firstcount" :prop="'first['+outerIndex+'].count'">

                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item>
                            <el-button type="primary" size="small" @click.stop="addFirst" :disabled="isdetail">添加</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form-item>
            <!--特殊科室设置-->
            <el-form-item label="特殊规则设置:" label-width="130px">
                <el-row v-show="trainturnlist.special.length>0">
                    <el-col :span="24" class="pxzy">
                        <el-row v-for="(item,specialIndex) in trainturnlist.special" style="margin-bottom:20px;">
                            <el-col :span="2">
                                <el-button type="primary" size="small" @click.stop="removeSpecial(specialIndex)" :disabled="isdetail">删除</el-button>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="培训专业" :rules='trainturnlistrule.majorid' :prop="'special['+specialIndex+'].majorid'">
                                    <el-select v-model="item.majorid" :disabled="isdetail" small="size" @change="querytraininfobymajorid(item.majorid,'special',specialIndex)">
                                        <el-option v-for="item in majorlist" :value="item.id" :label="item.majorname">

                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="17">
                                <el-row v-for="(count,countIndex) in item.count">
                                    <el-col :span="8">
                                        <el-form-item class="specialdept" :label="count.isphase==1 ? '第'+(count.key)+'阶段：科室' : '科室:'" v-if="count.isphase==1 ? true : count.key==1">
                                            <el-select v-model="count.dept" value-key="deptindex" :disabled="isdetail" size="small">
                                                <el-option v-for="(inneritem,deptIndex) in trainturnlist['special'][specialIndex].deptdata" :value="{deptid:inneritem.deptid,phase:inneritem.phase,deptindex:deptIndex}"
                                                    :label="inneritem.deptname+' -'+deptIndex" v-if="isSpecialSelect(inneritem.deptid,count.dept.deptid,specialIndex,countIndex,item.majorid)"
                                                    v-show="inneritem.phase!=null&&inneritem.phase!=='' ? inneritem.phase==countIndex :true">

                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="16">
                                        <el-row>
                                            <el-col :span="8">
                                                <el-select v-model="count.monthstate" placeholder="请选择轮转时间" v-if="count.isphase==1 ? true : count.key==1">
                                                    <el-option :value=1 label="开始轮转"></el-option>
                                                    <el-option :value=2 label="结束轮转"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="12" v-show="count.monthstate==1">
                                                <el-form-item label="从第" class="timedept" v-if="count.isphase==1 ? true : count.key==1">
                                                    <el-select v-model="count.beginmonth" :disabled="isdetail" size="small" style="width: 90px" @visible-change="setRotationTime('endmonth',specialIndex,countIndex)">
                                                        <el-option v-for="(timeitem,timeIndex) in trainturnlist['special'][specialIndex].time[countIndex]" :value="timeitem" :label="timeitem"
                                                            :key="timeitem">
                                                        </el-option>
                                                    </el-select>
                                                    <span>个月后开始轮转</span>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="14" v-show="count.monthstate==2">
                                                <el-form-item label="到第" class="timedept" v-if="count.isphase==1 ? true : count.key==1">
                                                    <el-select v-model="count.endmonth" :disabled="isdetail" size="small" style="width: 90px" @visible-change="setRotationTime('beginmonth',specialIndex,countIndex)">
                                                        <el-option v-for="(timeitem,timeIndex) in trainturnlist['special'][specialIndex].time[countIndex]" :value="timeitem" :label="timeitem"
                                                            :key="timeitem">
                                                        </el-option>
                                                    </el-select>
                                                    <span>个月前结束轮转</span>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </el-col>
                                </el-row>

                            </el-col>

                            <el-form-item :rules="trainturnlistrule.specailcount" class="specialdept" :prop="'special['+specialIndex+'].count'">

                            </el-form-item>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item>
                            <el-button type="primary" size="small" @click.stop="addSpecial" :disabled="isdetail">添加</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { currentYear, getCookie, post, exportExcel } from '../../../config/util'
    import { mapState, mapActions } from 'vuex'
    export default {
        name: "deptlink",
        props: {
            isdetail: '',
            trainturnlist: {},
            majorlist: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            deptruledata: [Array, Object]
        },
        data() {
            //科室联动科室验证
            let linkagevalidate = (rule, value, callback) => {//这个地方验证有毒
                if (value.length != 0) {
                    if (value.length != 2) {
                        callback('请选择两个科室联动');
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            }
            let linkagecountvalidate = (rule, value, callback) => {
                let isempty = false;
                if (value.length > 0) {
                    value.map(item => {
                        if (item.dept.length > 0) {
                            isempty = true
                        }
                    })
                    if (!isempty) {
                        callback('请选择联动科室');
                    } else {
                        callback();
                    }
                }



                // if(value[0].dept.length==0&&value[1].dept.length==0&&value[2].dept.length==0){
                //     callback('请选择联动的科室')
                // }else{
                //     callback();
                // }

            }
            //科室优先验证
            let firstdeptvalidate = (rule, value, callback) => {
                if (!value.deptid) {
                    callback('科室不能为空');
                } else {
                    callback();
                }
            }

            let firstcountvalidate = (rule, value, callback) => {
                let isempty = false;
                if (value.length > 0) {
                    value.map(item => {
                        if (item.adddeptdata.length > 1) {
                            isempty = true
                        }
                    })
                    if (!isempty) {
                        callback('请选择优先科室');
                    } else {
                        callback();
                    }
                }

            }
            //特殊设置
            let specailvalidate = (rule, value, callback) => {
                if (!value.deptid) {
                    callback('科室不能为空');
                } else {
                    callback();
                }

            }
            let specailcountvalidate = (rule, value, callback) => {
                let isempty = false, ismore = true;
                value.map(item => {
                    if ((item.beginmonth && item.dept.deptid) || (item.endmonth && item.dept.deptid)) {
                        isempty = true
                    }
                    if ((item.beginmonth && !item.dept.deptid) || (item.endmonth && !item.dept.deptid) || ((item.dept.deptid && !item.beginmonth) && (item.dept.deptid && !item.endmonth))) {
                        isempty = false;
                    }
                    // if()
                })
                if (!isempty) {
                    callback('特殊科室/时间设置不能为空');
                } else {
                    callback();
                }
            }
            let specailtimevalidate = (rule, value, callback) => {
                if (!value) {
                    callback('请输入时间')
                } else {
                    callback();
                }
            }
            let otherspecailtimevalidate = (rule, value, callback) => {
                callback();
            }

            // 特俗规则设置
            return {
                deptList: [],
                adddeptdata: [],
                beginMonthShow: false,
                endMonthShow: false,
                monthstate: '',
                trainturnlistrule: {
                    majorid: [{ required: true, message: "培训专业不能为空" }],
                    linkagedept: [{ validator: linkagevalidate }],
                    linkagecount: [{ validator: linkagecountvalidate }],
                    firstdept: [{ validator: firstdeptvalidate }],
                    firstcount: [{ validator: firstcountvalidate }],
                    specaildept: [{ validator: specailvalidate }],
                    specailcount: [{ validator: specailcountvalidate }],
                    specailtime: [{ validator: specailtimevalidate }],
                    otherspecailtime: [{ validator: otherspecailtimevalidate }],

                }

            }
        },
        mounted() {

        },
        computed: {
            ...mapState([
                'stagecount',
            ]),
        },
        watch: {
            monthstate(val) {
                if (val == 1) {
                    this.beginMonthShow = true;
                    this.endMonthShow = false;
                }
                if (val == 2) {
                    this.beginMonthShow = false;
                    this.endMonthShow = true;
                }
            },
            trainturnlist: {
                deep: true,
                handler(val) {
                    // let data=val;
                    // if(data.code=='special'){
                    //     data.deptdata.map(item=>{
                    //
                    //     })
                    // }
                }
            },
            'trainturnlist.data': function (val) {

            },
        },
        methods: {
            //子组件的验证
            validateForm() {
                let flag = false;
                this.$refs['trainturnlistform'].validate((valid) => {
                    flag = valid
                })
                return flag
            },
            setRotationTime(sign, outerIndex, countIndex) {
                this.trainturnlist['special'][outerIndex].count[countIndex][sign] = '';
            },
            isLinkageSelect(optionValue, value, outerIndex, countIndex, majorid) {
                for (let i = 0; i < value.length; i++) {
                    if (optionValue == value.deptid) {
                        return true;
                    }
                }
                let deptlist = this.trainturnlist.linkage;
                for (let i = 0; i < deptlist.length; i++) {
                    let ai = deptlist[i];
                    if (ai.majorid == majorid) {
                        for (let j = 0; j < ai.count.length; j++) {
                            let aj = ai.count[j];
                            for (let k = 0; k < aj.dept.length; k++) {
                                let ak = aj.dept[k];
                                if (ak.deptid == optionValue && ak.phase == countIndex) {
                                    return false
                                }
                            }
                        }
                    }

                }
                return true;
            },
            isSpecialSelect(optionValue, value, outerIndex, countIndex, majorid) {
                if (optionValue == value) {
                    return true;
                }
                let deptdata = this.trainturnlist.special[outerIndex].deptdata;
                let deptlist = this.trainturnlist.special;
                for (let i = 0; i < deptlist.length; i++) {
                    let ai = deptlist[i];
                    if (ai.majorid == majorid) {
                        for (let j = 0; j < ai.count.length; j++) {
                            let aj = ai.count[j];
                            if (aj.dept.deptid == optionValue && countIndex + 1 == aj.dept.phase) {
                                return false;
                            }
                        }
                    }

                }
                return true;
            },
            isSelect(optionValue, value, outerIndex, countIndex, majorid) {
                if (optionValue == value) {
                    return true;
                }
                for (let j of this.trainturnlist.first[outerIndex].count[countIndex].adddeptdata) {
                    if (j.dept.deptid == optionValue) {
                        return false
                    }
                }
                return true;
            },
            //特殊轮转科室时间设置
            addSpecial() {
                this.trainturnlist.special.push(
                    {
                        code: "special",
                        majorid: '',
                        count: [],
                        deptdata: [],
                        // time:[[],[],[]],
                    }
                );
            },
            removeSpecial() {
                this.trainturnlist.special.pop();
            },
            addLinkage() {
                this.trainturnlist.linkage.push(
                    {
                        code: "linkage",
                        majorid: '',
                        count: [
                            // {key:1,dept:[]},
                            // {key:2,dept:[]},
                            // {key:3,dept:[]}
                        ],
                        deptdata: [],
                    }
                );
            },
            addFirst() {
                this.trainturnlist.first.push(
                    {
                        code: "first",
                        majorid: '',
                        deptdata: [],
                        count: [],
                    }
                );
            },
            removeFirst(index) {
                this.trainturnlist.first.splice(index, 1);
            },
            removeLinkage(linkageIndex) {
                this.trainturnlist.linkage.splice(linkageIndex, 1);
            },
            getisPhase(baseid, majorlist) {
                for (let i = 0; i < majorlist.length; i++) {
                    let mi = majorlist[i];
                    if (mi.id == baseid) {
                        return mi.isphase
                    }
                }
            },
            querytraininfobymajorid(baseid, sign, index) {
                let map = {}, dest = [], deptList = [], totalTime = [], init_time = 0, timeArr = [];
                post('/trainingprogramme/querytraininfobymajorid', {
                    command: 'trainingprogramme/querytraininfobymajorid',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: baseid
                }).then(res => {
                    if (res && res.errcode == 0) {
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
                                if (ai.phase != null && ai.phase != '') {
                                    if (ai.phase == j) {
                                        init_time += ai.cycle * ai.turndeptcount;
                                    }
                                } else {
                                    init_time += ai.cycle * ai.turndeptcount;
                                }

                            }
                            totalTime.push(parseInt(init_time))

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
                        for (let i = 0; i < dest.length; i++) {
                            let ai = dest[i];
                            for (let j = 0; j < ai.deptlist.length; j++) {
                                let aj = ai.deptlist[j];
                                deptList.push({
                                    deptname: aj.deptname,
                                    deptid: aj.deptid,
                                    phase: ai.phase,
                                    cycle: ai.cycle
                                })
                            }
                        }
                        if (sign == 'linkage') {
                            let majorid = this.trainturnlist[sign][index].majorid;
                            let isphase = this.getisPhase(majorid, this.majorlist);
                            this.$set(this.trainturnlist[sign][index], 'count', [])
                            for (let count = 0; count < this.stagecount; count++) {
                                this.trainturnlist[sign][index]['count'].push(
                                    { key: count + 1, dept: [], isphase: isphase }
                                )
                            }
                        }
                        if (sign == 'first') {
                            let majorid = this.trainturnlist[sign][index].majorid;
                            let isphase = this.getisPhase(majorid, this.majorlist);
                            this.$set(this.trainturnlist[sign][index], 'count', []);
                            for (let count = 0; count < this.stagecount; count++) {
                                this.trainturnlist[sign][index]['count'].push(
                                    { key: count + 1, adddeptdata: [], isphase: isphase }
                                )
                            }
                        }
                        if (sign == 'special') {
                            this.$set(this.trainturnlist[sign][index], 'time', timeArr);
                            let majorid = this.trainturnlist[sign][index].majorid;
                            let isphase = this.getisPhase(majorid, this.majorlist)
                            this.$set(this.trainturnlist[sign][index], 'count', []);
                            for (let count = 0; count < this.stagecount; count++) {
                                this.trainturnlist[sign][index]['count'].push(
                                    { key: count + 1, dept: {}, beginmonth: '', isphase: isphase, endmonth: '' },
                                )
                            }
                        }
                        this.$set(this.trainturnlist[sign][index], 'deptdata', deptList);//获取了每个培训专业相对应的科室

                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.errdesc
                        })
                    }
                })
            },
            addDept(outerIndex, countIndex) {
                let adddeptdata = this.trainturnlist.first[outerIndex].count[countIndex].adddeptdata, isempty = false;
                if (adddeptdata.length > 0) {
                    for (let i = 0; i < adddeptdata.length; i++) {
                        if (!adddeptdata[i].dept.deptid) {
                            isempty = true
                        }
                    }
                }
                if (!isempty) {
                    this.trainturnlist.first[outerIndex].count[countIndex].adddeptdata.push({
                        dept: {}
                    });
                }

            },
            removeDept(outerIndex, countIndex) {
                if (this.trainturnlist.first.length > 0) {
                    this.trainturnlist.first[outerIndex].count[countIndex].adddeptdata.pop();
                }

            }
        }
    }
</script>

<style scoped lang="scss">
    .pxzy {
        .el-select {
            width: 130px;
        }
        .group-btn {
            background: url('../../../assets/images/add.png') 0 -1px no-repeat;
            width: 30px;
            height: 30px;
            background-size: 29px 29px;
            border: none;
            margin-left: 10px;
        }
        .remove-btn {
            background: url('../../../assets/images/remove.png') no-repeat;
            background-size: 32px 32px;
        }
        .deptlink-item {
            display: inline-block;
            margin-bottom: 10px;
            float: left;
        }
        .funTools {
            float: left;
        }
    }

    .deptlink-c {
        & /deep/ .formitemborder {
            border-bottom: 1px solid #bfcbd9;
            padding-bottom: 20px;
        }
        & /deep/ .el-form-item {
            margin-bottom: 18px;
        }
        .linkagedept {
            .el-select {
                width: 100%;
            }
        }

        /deep/ .el-form-item__error {
            left: 66px;
        }
        /deep/ .linkagedept .el-form-item__error {
            left: 6px;
        }
        /deep/ .firstdept .el-form-item__error {
            left: 6px;
        }
        /deep/ .specialdept {
            clear: both;
        }
        /deep/ .specialdept .el-form-item__error {
            left: 312px;

        }
        /deep/ .timedept .el-form-item__error {
            left: 38px;
        }
        /deep/ .el-form-item__content {
            line-height: none;
        }
        /deep/ .el-input {
            font-size: 12px;
        }
    }
</style>