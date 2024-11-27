<template>
    <div id="personal">
        <!--<div class="t-titlebtn">
            <el-button type ="primary" @click="importpdf">导出PDF</el-button>
        </div>-->
        <el-row :gutter="24" class="t-line">
            <p>个人基本信息</p>
        </el-row>
        <el-row :gutter = "24">
            <el-col :span= "6">
                <span>姓名 : {{personalData.turndoctorinfobean.name}}</span>
            </el-col>
            <el-col :span= "6">
                <span>学号 : {{personalData.turndoctorinfobean.username}}</span>
            </el-col>
            <el-col :span= "6">
                <span>专业基地 : {{personalData.turndoctorinfobean.basename}}</span>
            </el-col>
            <el-col :span= "6">
                <span>学员类型 : {{personalData.turndoctorinfobean.typename}}</span>
            </el-col>
        </el-row>
        <el-row :gutter = "24">
            <el-col :span= "6">
                <span>导师 : {{personalData.turndoctorinfobean.tutorname}}</span>
            </el-col>
            <el-col :span= "6">
                <span>学位性质 : {{personalData.turndoctorinfobean.degreetypename}}</span>
            </el-col>
            <el-col :span= "6">
                <span>最高学历 : {{personalData.turndoctorinfobean.educationalname}}</span>
            </el-col>
            <el-col :span= "6">
                <span>最高学位 : {{personalData.turndoctorinfobean.degreename}}</span>
            </el-col>
        </el-row>
        <el-row :gutter = "24">
            <el-col :span= "6">
                <span>本科毕业时间 : {{personalData.turndoctorinfobean.bachelorgraduate}}</span>
            </el-col>
            <el-col :span= "6">
                <span>硕士毕业时间 : {{personalData.turndoctorinfobean.mastergraduate}}</span>
            </el-col>
            <el-col :span= "6">
                <span>博士毕业时间 : {{personalData.turndoctorinfobean.doctorgraduate}}</span>
            </el-col>
        </el-row>

        <el-row :gutter="24" class="t-line">
            <p>培训情况</p>
        </el-row>
        <el-row :gutter = "24">
            <el-col :span= "12">
                <span>1.参加教学查房（次数）: {{personalData.turndoctortraininfobean.teachingrounds}}</span>
            </el-col>
            <el-col :span= "12">
                <span>2.参加病历讨论（次数）: {{personalData.turndoctortraininfobean.casediscussioncount}}</span>
            </el-col>
            <el-col :span= "12">
                <span>3.参加小讲课（次数）: {{personalData.turndoctortraininfobean.lecturecount}}</span>
            </el-col>
            <el-col :span= "12">
                <span>4.主讲病历讨论（次数）（附PPT讲义打印稿）: {{personalData.turndoctortraininfobean.lecturecasediscussioncount}}</span>
            </el-col>
            <el-col :span= "12">
                <span>5.综合评价: {{personalData.turndoctortraininfobean.comprehensiveevaluate}}</span>
                <div>（科主任、护士长、带教老师、轮科医师、实习生等反馈，分为优、良、中、差）</div>
            </el-col>
            <el-col :span= "12">
                <span>6.护培生培训专设讲座出勤率（要求100%）: {{personalData.turndoctortraininfobean.turndoctorworkattend}}</span>
            </el-col>
        </el-row>

        <el-row :gutter="24" class="t-line">
            <p>考核情况</p>
        </el-row>
        <el-row :gutter = "24">
            <el-col :span= "12">
                <span v-if="personalData.turnpersonalevaluatebean.yearflag == 1">
                    7.病历书写专项考 : {{personalData.turndoctorassessmentbean.basewritescore}}
                </span>
                <span v-if="personalData.turnpersonalevaluatebean.yearflag == 2">
                    7.第二年年度考核理论成绩 : {{personalData.turndoctorassessmentbean.theoryscore}}
                </span>
            </el-col>
            <el-col :span= "12">
                <span>8.第{{personalData.turnpersonalevaluatebean.yearflag}}年中期考核 : {{personalData.turndoctorassessmentbean.examstatusname}}</span>
            </el-col>
        </el-row>

        <el-row :gutter="24" class="t-line">
            <p>学员填写信息</p>
        </el-row>
        <el-row :gutter = '24'>
            <el-col :span= "12">
                <span>9.旷工天数 : {{personalData.turnpersonalevainfobean.absenteeismdays}}</span>
            </el-col>
            <el-col :span= "12">
                <span>10.医疗事故（要求无）: {{personalData.turnpersonalevainfobean.malpracticeflag | handle}}</span>
            </el-col>
            <el-col :span= "12">
                <span>11.医疗纠纷和投诉（次数）: {{personalData.turnpersonalevainfobean.medicaldisputescounts}}</span>
            </el-col>
            <el-col :span= "12">
                <span>12.管理病人数、病种数、临床操作是否达到要求 : {{personalData.turnpersonalevainfobean.clinicaloperationflag | shifou}}</span>
            </el-col>
        </el-row>
        <el-row :gutter = '24'>
            <el-col :span= "12">
                <span>13.发表相关论文数：全年统计源期刊篇， SCI篇（限第一作者）: </span>
                <template v-for="(item,index) in personalData.uploaddescplist">
                    <div v-if="item.detailtype == 1 && item.type == 1">
                       SCI : {{item.content}}
                    </div>
                    <div v-if="item.detailtype == 2 && item.type == 1">
                        统计源核心 : {{item.content}}
                    </div>
                    <div v-if="item.detailtype == 3 && item.type == 1">
                        其他（学术/非学术均可） : {{item.content}}
                    </div>
                </template>
                <template v-for="item in personalData.descpdetaillist">
                    <div class="my-content" v-if="item.type == 1 && item.content">
                        {{item.content}}
                    </div>
                </template>
                <div class="pictrue">
                    <span v-for="(item,index) in personalData.uploadlist">
                        <img v-if="item.type == 1" :src="urltitle + item.fileurl" @click="showbigpic(item.type)"  />
                    </span>
                </div>
            </el-col>
            <el-col :span= "12">
                <span>14.主持相关课题数量（前3者）：上传课题批准文件照片 : </span>
                <template v-for="(item,index) in personalData.uploaddescplist">
                    <div v-if="item.detailtype == 1 && item.type == 2">
                        国家级 : {{item.content}}
                    </div>
                    <div v-if="item.detailtype == 2 && item.type == 2">
                        省级 : {{item.content}}
                    </div>
                    <div v-if="item.detailtype == 3 && item.type == 2">
                        校级 : {{item.content}}
                    </div>
                    <div v-if="item.detailtype == 4 && item.type == 2">
                        院级 : {{item.content}}
                    </div>
                </template>
                <template v-for="item in personalData.descpdetaillist">
                    <div class="my-content" v-if="item.type == 2 && item.content">
                        {{item.content}}
                    </div>
                </template>
                <div class="pictrue">
                    <span v-for="(item,index) in personalData.uploadlist">
                        <img v-if="item.type == 2" :src="urltitle + item.fileurl" @click="showbigpic(item.type)"  />
                    </span>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter = '24'>
            <el-col :span= "12">
                <span>15.参与相关课题数量（前3者）,上传课题批准文件照片 : </span>
                <template v-for="(item,index) in personalData.uploaddescplist">
                    <div v-if="item.detailtype == 1 && item.type == 3">
                        国家级 : {{item.content}}
                    </div>
                    <div v-if="item.detailtype == 2 && item.type == 3">
                        省级 : {{item.content}}
                    </div>
                    <div v-if="item.detailtype == 3 && item.type == 3">
                        校级 : {{item.content}}
                    </div>
                    <div v-if="item.detailtype == 4 && item.type == 3">
                        院级 : {{item.content}}
                    </div>
                </template>
                <template v-for="item in personalData.descpdetaillist">
                    <div class="my-content" v-if="item.type == 3 && item.content">
                        {{item.content}}
                    </div>
                </template>
                <div class="pictrue">
                    <span v-for="(item,index) in personalData.uploadlist">
                        <img v-if="item.type == 3" :src="urltitle + item.fileurl" @click="showbigpic(item.type)"  />
                    </span>
                </div>
            </el-col>
            <el-col :span= "12">
                <span>16.所获奖励 : </span>
                <template v-for="(item,index) in personalData.uploaddescplist">
                    <div v-if="item.detailtype == 1 && item.type == 4">
                        国家级 : {{item.content}}
                    </div>
                    <div v-if="item.detailtype == 2 && item.type == 4">
                        省级 : {{item.content}}
                    </div>
                    <div v-if="item.detailtype == 3 && item.type == 4">
                        校级 : {{item.content}}
                    </div>
                    <div v-if="item.detailtype == 4 && item.type == 4">
                        院级 : {{item.content}}
                    </div>
                </template>
                <template v-for="item in personalData.descpdetaillist">
                    <div class="my-content" v-if="item.type == 4 && item.content">
                        {{item.content}}
                    </div>
                </template>
                <div class="pictrue">
                    <span v-for="(item,index) in personalData.uploadlist">
                        <img v-if="item.type == 4" :src="urltitle + item.fileurl " @click="showbigpic(item.type)"  />
                    </span>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter = '24'>
            <el-col :span= "12">
                <span>17.惩罚情况 : </span>
                <template v-for="item in personalData.descpdetaillist">
                    <div class="my-content" v-if="item.type == 5 && item.content">
                        {{item.content}}
                    </div>
                </template>
                <div class="pictrue">
                    <span v-for="(item,index) in personalData.uploadlist">
                        <img v-if="item.type == 5" :src="urltitle + item.fileurl " @click="showbigpic(item.type)"  />
                    </span>
                </div>
            </el-col>
            <el-col :span= "12">
                <span>18.执业医师通过情况 : {{personalData.turnpersonalevainfobean.practitionerflag | onpass}}</span>
                <div v-if="personalData.turnpersonalevainfobean.practitionerflag">
                    职业医师资格证号 : {{personalData.turnpersonalevainfobean.practitionercode}}
                </div>
            </el-col>
        </el-row>

        <el-row :gutter="24" class="t-line">
            <p>自我鉴定</p>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="8">请填写关于政治思想、遵纪守法、医德医风、工作成绩：</el-col>
            <el-col :span="16">
                <template v-if="personalData.turnpersonalevainfobean.stdstatus == 0">未完成</template>
                <template v-if="personalData.turnpersonalevainfobean.stdstatus == 5">已提交</template>
            </el-col>
            <el-col :span="24">
                <div class="my-content" style="min-height:20px;">
                    {{personalData.turnpersonalevainfobean.stdcontent}}
                </div>
            </el-col>
        </el-row>

        <div v-if="personalData.turnpersonalevaluatebean.stdstatus == 5">
            <template v-if="personalData.baseJustics == 1  || (personalData.baseJustics == 1 && personalData.hospitalJustics == 1)"><!--是否有基地权限-->
                <el-row :gutter="24" class="t-line">
                    <el-col :span="6" style="padding-left: 0px">
                        <p>专业基地鉴定</p>
                    </el-col>
                    <el-col :span="12">
                        <template v-if="personalData.turnpersonalevaluatebean.basestatus == 0">
                            <el-radio class="radio" v-model="basefail" :label="5">不通过</el-radio>
                            <el-radio class="radio" v-model="basefail" :label="10">通过</el-radio>
                        </template>
                        <template v-else>
                            <el-radio class="radio" disabled="disabled" v-model="personalData.turnpersonalevaluatebean.basestatus" :label="5">不通过</el-radio>
                            <el-radio class="radio" disabled="disabled" v-model="personalData.turnpersonalevaluatebean.basestatus" :label="10">通过</el-radio>
                        </template>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <div v-if="personalData.turnpersonalevaluatebean.basestatus == 0">
                            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入基地审核原因" :maxlength="300" v-model="basetextarea"></el-input>
                        </div>
                        <div v-else class="my-content">{{personalData.turnpersonalevainfobean.basecontent}}</div>
                    </el-col>
                </el-row>
            </template>

            <!--教办没有基地的权限；且基地已完成-->
            <template v-if="personalData.turnpersonalevaluatebean.basestatus == 10 && personalData.baseJustics == 0">
                <el-row :gutter="24" class="t-line">
                    <el-col :span="6" style="padding-left: 0px">
                        <p>专业基地鉴定</p>
                    </el-col>
                    <el-col :span="12">
                            <el-radio class="radio" disabled="disabled" v-model="personalData.turnpersonalevaluatebean.basestatus" :label="5">不通过</el-radio>
                            <el-radio class="radio" disabled="disabled" v-model="personalData.turnpersonalevaluatebean.basestatus" :label="10">通过</el-radio>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <div class="my-content">{{personalData.turnpersonalevainfobean.basecontent}}</div>
                    </el-col>
                </el-row>
            </template>

            <template v-if="personalData.hospitalJustics == 1 ">
                <el-row :gutter="24" class="t-line" v-if="personalData.turnpersonalevaluatebean.basestatus != 0">
                    <el-col :span="6" style="padding-left: 0px">
                        <p>教学办公室护培办鉴定</p>
                    </el-col>
                    <el-col :span="12">
                        <template><!-- v-if="personalData.turnpersonalevaluatebean.teachofficestatus == 0"-->
                            <el-radio class="radio" v-model="officefail" :label="5">不通过</el-radio>
                            <el-radio class="radio" v-model="officefail" :label="10">通过</el-radio>
                        </template>
                        <!--<template v-else>
                            <el-radio class="radio" disabled="disabled" v-model="personalData.turnpersonalevaluatebean.teachofficestatus" :label="5">不通过</el-radio>
                            <el-radio class="radio" disabled="disabled" v-model="personalData.turnpersonalevaluatebean.teachofficestatus" :label="10">通过</el-radio>
                        </template>-->
                    </el-col>
                </el-row>
                <el-row v-if="personalData.turnpersonalevaluatebean.basestatus != 0">
                    <el-col :span="24">
                        <div>
                            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" :maxlength="300" v-model="officetextarea"></el-input></div>
                        <!--<div v-else class="my-content">{{personalData.turnpersonalevainfobean.teachofficecontent}}</div>-->
                    </el-col>
                </el-row>
            </template>

            <el-row :gutter="24"
                    v-if="( personalData.baseJustics == 1 && personalData.turnpersonalevaluatebean.teachofficestatus == 0 ) ||
                    (personalData.hospitalJustics == 1 && personalData.turnpersonalevaluatebean.basestatus != 0 ) ">
                <div class="onsubmit">
                    <el-button type="primary" @click="submit">保存</el-button>
                    <el-button @click="close" >取消</el-button>
                </div>
            </el-row>
        </div>
    </div>
</template>

<script>
    import {post,getCookie} from '../config/util';

    export default{
        name:"evaluationForm",
        props:{
            personalData:{},//父组件值
            urltitle:'',
        },
        components: {

        },
        data(){
            return{
//              学生是否提交(0，未提交；5;已提交) =>  {{personalData.turnpersonalevaluatebean.stdstatus}}<br />
//              基地权限（1；有权限）=>  {{personalData.baseJustics}} <br />
//              基地状态(0,未完成) =>  {{personalData.turnpersonalevaluatebean.basestatus}} <br />
//              教办权限（1；有权限） =>   {{personalData.hospitalJustics}} <br />
//              教办状态零(0,未完成) =>   {{personalData.turnpersonalevaluatebean.teachofficestatus}}
                isbasedisabled:true,
                isofficedisabled:true,
                basefail:'', //通过不通过
                officefail:'',
                basetextarea:'',//基地备注
                officetextarea:'',
            }
        },
        filters:{
            'onpass':function(str){
                if(String(str) === '0' || String(str) === '1'){
                    let onstr = String(str) == '0' ?  '不通过' : '通过'
                    return onstr
                }else{
                    return ''
                }
            },
            'handle':function(str){
                if(String(str) === '0' || String(str) === '1'){
                    let onstr = String(str) == '0' ?  '无' : '有'
                    return onstr
                }else{
                    return ''
                }
            },
            'shifou':function(str){
                if(String(str) === '0' || String(str) === '1'){
                    let onstr = String(str) == '0' ?  '否' : '是'
                    return onstr
                }else{
                    return ''
                }
            },
        },

        watch:{
            'bigpicture':function(val,oldval){
                if(val != oldval){
                    this.modelfalse =  val ? false: true
                }
            },
        },

        computed:{

        },
        mounted(){
            if(this.personalData.turnpersonalevaluatebean.teachofficestatus){
                this.officefail = this.personalData.turnpersonalevaluatebean.teachofficestatus;
            };
            if(this.personalData.turnpersonalevainfobean.teachofficecontent){
                this.officetextarea = this.personalData.turnpersonalevainfobean.teachofficecontent
            };
            this.isbasedisabled = this.personalData.turnpersonalevaluatebean.basestatus == 0 ? false : true;
            this.isofficedisabled = this.personalData.turnpersonalevaluatebean.teachofficestatus == 0 ? false : true;
        },
        destroyed() {   //销毁事件
            this.basefail = '' //通过不通过
            this.officefail = ''
            this.basetextarea = ''//基地备注
            this.officetextarea = ''
        },
        watch:{

        },
        methods:{
            submit(){
                if(
                    ( this.personalData.turnpersonalevaluatebean.basestatus == 0  && !Number(this.basefail) )
                    || (this.personalData.turnpersonalevaluatebean.basestatus != 0 && this.personalData.turnpersonalevaluatebean.teachofficestatus == 0 && !Number(this.officefail) )
                ){
                    this.$message({
                        message: '请选择审核状态，是否通过？',
                        type: 'warning'
                    });
                }else if( this.personalData.turnpersonalevaluatebean.basestatus == 0  && !this.basetextarea && this.basefail == 5
                    ){
                    // 教办情况；基地和教办通过可不需填原因，不通过必需填原因
                    console.log('zhezhezhe')
                    this.$message({
                        message: '请填写基地审核原因',
                        type: 'warning'
                    });
                }else if(this.personalData.turnpersonalevaluatebean.basestatus == 10 && !this.officetextarea && this.officefail == 5
                    ){
                    this.$message({
                        message: '请填写教办审核原因',
                        type: 'warning'
                    });
                }else{
                    let submitdata = {
                        id:this.personalData.turnpersonalevaluatebean.id,
                        type: this.personalData.turnpersonalevaluatebean.basestatus == 0 ? 2 : 3,            //基地2；教办3
                        status: this.personalData.turnpersonalevaluatebean.basestatus == 0 ? this.basefail : this.officefail,  //通过不通过
                        content: this.personalData.turnpersonalevaluatebean.basestatus == 0 ? this.basetextarea : this.officetextarea,
                    }
                    let incommand = this.personalData.turnpersonalevaluatebean.basestatus == 0 ? 'turnedoctormain/basepersonalevastatussub':'turnedoctormain/teachofficepersonalevastatussub'
                    this.$emit("submit1",submitdata,incommand)
                }
            },
            showbigpic(type){
                this.$emit("funshowbigpic",type)
            },
            close(){
                this.$emit("close1",false)
            },
            importpdf(){
                window.print()
            }
        }
    }
</script>

<style scoped lang="scss">
    .t-titlebtn{
        margin-bottom: 15px;
    }
    .t-line{
        width:100%;
        height:auto;
        padding:10px;
        margin: 10px 0px;
        border-top:1px solid #999;
        border-bottom: 1px solid #999;
        p{
            color: #333;
            font-weight: 900;
        }
    }
    .el-col{
        span{
            height:20px;
            margin: 5px 0px;
        }

    }
    .el-col-6{
        span{
            max-width:200px;
            white-space:nowrap;
            overflow: hidden;
            text-overflow:ellipsis;
        }
    }
    .my-content{
        width:98%;
        height: auto;
        border: 1px solid #999;
        border-radius: 3px;
        padding: 8px;
        margin: 10px 0px;
    }

    .el-row>.onsubmit{
        text-align:right;
        margin:20px;
    }
    .pictrue{
        img{
            width:100px;
            height:100px;
            margin: 5px;
        }
    }
    .bigpic{
        width: 500px;
        height: 290px;
        margin-left: 73px
    }
</style>
