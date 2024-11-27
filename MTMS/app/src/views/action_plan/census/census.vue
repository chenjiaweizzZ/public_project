<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            统计

            <div slot="headerRight" v-show=" istemporarysave == 0  && isshow && cansubmit == 1 " @click="submitsaveflag = 1;submit()">
                 <span>提交</span>
            </div>
            <div slot="headerRight" v-show=" istemporarysave == 1  && isshow && cansubmit == 1" @click="submitconfig.show = true">
                <img src="../../../assets/images/icon_zengjia.png" style="width: 25px;height: 25px;" />
            </div>
        </c-header>

        <!-- submit_list -->
        <add-group :config = 'submitconfig' :data-list="submitlist" @confirm = "submitselect"></add-group>

        <c-tabs :bus="bus" @change-tab="changeTab">
            <c-tab title="签到" :active="type == 1" :bus="bus" data="1">

            </c-tab>
            <c-tab title="现场记录" :active="type == 2" :bus="bus" data="2">

            </c-tab>
            <c-tab title="意见反馈" :active="type == 3"  :bus="bus" data="3">

            </c-tab>
        </c-tabs>
        <div class="g-main">
            <div v-if='type == 1'>
                <census-signin :active="type == 1"></census-signin>
            </div>
            <div v-if='type == 2'>
                <census-record :active="type == 2" :refs="uploadpiclist" :cansubmit = 'cansubmit' :issubmit ='submitok' @getlist="getimages"
                               @getremark="getremark" @caseinfo="getcaseinfo" @maindiagnosis="getmaindiagnosis"
                               @bedno="getbedno" @inpatientno="getinpatientno"  @maxrole="maxrole" @ckkey="chuketypekey" @projectname="getpjname"></census-record>
            </div>
            <div v-if='type == 3'>
                <census-tickling :active="type == 3"></census-tickling>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import methods from '../../../methods';
    import cHeader from '../../header';
    import noContent from '../../no_content.vue';
    import addGroup from '../../../components/add-group';
    import cTab from '../../../components/tab';
    import cTabs from '../../../components/tabs';
    import censusSignin from './census_signin';
    import censusRecord from './census_record';
    import censusTickling from './census_tickling';
    import { mapState, mapActions } from 'vuex';
    let bus = new Vue();
    export default {
        data() {
            return {
                type: 1,
                detailid:'',//统计的id
                bus:bus,
                from:'',
                list:[],
                remark:'',
                submitok:0,
                isshow:false,
                cansubmit:0,
                caseinfo:'',
                maindiagnosis:'',
                bedno:'',
                inpatientno:'',
                examstatusname:'',
                cktype:'',
                pjname:'',
                piclist:'',
                ckexamshowflag:'',
                caseinfostandard:false,
                isteacherspeak:'',//1小讲课
                //19-01-04 增加缓存
                istemporarysave:'', //是否显示暂存
                submitconfig:{
                    show:false,
                    label:'name',
                    fixedtop:'.8rem',
                    fixedright:'.1rem'
                },
                submitlist:[
                    {
                        name:'暂存',
                        key:1,
                        isused:true
                    },
                    {
                        name:'提交',
                        key:2,
                        isused:true
                    }
                ],
                submitsaveflag:'',
            }
        },
        components: {
            cHeader,
            noContent,
            cTab,
            cTabs,
            censusSignin,
            censusRecord,
            censusTickling,
            addGroup
        },
        computed:{},
        watch:{

        },
        created() {
            this.detailid = this.$route.query.id;
        },
        mounted() {
            let self = this;
            this.initcodelist();
            this.registerToNative('goBack', function (data) {
                self.back()
            });
        },
        methods: {
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),

            initcodelist(){//获取权限
                let self=this;
                this.post('/actionplanbase/getjurisdictionbycoode',{
                    command: 'actionplanbase/getjurisdictionbycoode',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    beanlist:[
                        {
                            uid:$.cookie('uid'),
                            jurisdiccode:'uploadpic',
                            id:self.detailid
                        }
                    ]
                }).done((data)=>{
                    if(data&&data.errcode ==0){
                        self.cansubmit = data.jurisdiclist[0].jurisdicvalue;
                    }else if(data.errdesc){
                        self.toast(data.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                })
            },

            back(){//返回上一级
                let self = this;
                if(self.$route.query.isOverseer) {
                    this.$router.push({
                    name: 'activity_detail',
                    query: {
                        id: self.$route.query.id,
                        ishistory: false,
                        isOverseer: true,
                        grade: self.$route.query.grade
                    }
                })
                }
                else {
                    if(self.$route.query.message){
                    location.href = '/pages/futuredoctorapp/todo.html?view=task';
                } else {
                    self.$router.push({
                        name: 'fdAction_detail',
                        query: {
                            id:self.detailid,
                            ishistory:self.$route.query.ishistory
                        }
                    })
                }
                }
                
            },
            chuketypekey(data){     //出科考核类型
                this.cktype = data;
            },
            getimages(data,examstatusname,ckexamshowflag,teachspeak){
                this.list = data;
                this.examstatusname = examstatusname;
                this.ckexamshowflag = ckexamshowflag;
                this.isteacherspeak = teachspeak;
            },
            getremark(data){
                this.remark = data;
            },
            getpjname(data){    //出科考核考核项目
                this.pjname = data;
            },
            getcaseinfo(data){
                this.caseinfo = data;
                /*if(this.caseinfo.length>100&&this.caseinfo.length<1000){
                    this.caseinfostandard=true;
                }else{
                      this.caseinfostandard=false;
                }*/
            },
            getmaindiagnosis(data){
                this.maindiagnosis = data;
            },
            getbedno(data){
                this.bedno = data;
            },
            getinpatientno(data){
                this.inpatientno = data;
            },
            maxrole(data){
                this.isshow = (data.uploadflag == 1 && Number(this.type) == 2 ) ? 1 : 0 ;
                this.istemporarysave = data.temporarysave ;
            },
            uploadpiclist(){

            },
            submit(){
                let self = this;
                // if(self.list.length <= 0){
                //     self.toast('请至少上传一张照片！');
                //     return
                // }
                self.submitok = 0;
                let result = [];
                let _piclist = [];
                let _toppiclist = [];
                self.list.map(v => {
                    if(v.type == 3){
                        _piclist.push(v)
                    }else if(v.type == 2){
                        _toppiclist.push(v)
                    };
                })
                if(this.examstatusname == 1 ){      //病历讨论和教学查房
                    if(self.list.length == 0 || _toppiclist.length == 0){
                        self.toast('请上传现场图片！');
                    }else if(this.examstatusname == 1 && !self.inpatientno){
                        self.toast('请填写住院号！');
                    }else if(this.examstatusname == 1 && !self.bedno){
                        self.toast('请填写床号！');
                    }else if(this.examstatusname == 1 && !self.maindiagnosis){
                        self.toast('请填写主要诊断！');
                    }
                    // else if(this.examstatusname == 1 && (self.caseinfo.length < 100 && _piclist.length <= 0) ){
                    //     self.toast('请填写病情简介,字数大于100;或上传现场图片!');
                    // }
                    else{
                        this.realsubmit();
                    }
                }else if(this.ckexamshowflag == 1){ //出科考核
                    if(!self.cktype){
                        self.toast('请选择出科考核类型！');
                    }else if(!self.pjname && self.cktype == 1 ){
                        self.toast('请填写考核项目！');
                    }else if(self.list.length == 0 || self.list.length > 0){
                        let _val4 = 0;
                        let _val5 = 0;
                        let _val6 = 0;
                        for(let i=0;i<self.list.length;i++){
                            if(self.list[i].type == 4 ){
                                _val4 += 1
                            }else if(self.list[i].type == 5){
                                _val5 += 1
                            }else if(self.list[i].type == 6){
                                _val6 += 1
                            }
                        }

                        if(_val4 == 0 ){
                            self.toast('请上传成绩汇总表！');
                        }else if(_val5 == 0 ){
                            self.cktype == 1 ? self.toast('请上传技能考核评分原始表！') : self.toast('请上传面对面考核评分原始表！');
                        }else if(_val6 == 0 ){
                            self.cktype == 1 ? self.toast('请上传技能考核现场图片！') : self.toast('请上传面对面考核现场图片！');
                        }
                        else if(!self.remark){
                            self.toast('请填写活动纪要！');
                        }
                        //else if(self.remark && self.remark.length > 180 ){
                        //     self.toast('活动纪要不能超出180个字符！');
                        // }
                        else{
                            this.realsubmit();
                        }
                    }
                }else if(this.examstatusname != 1 && this.ckexamshowflag != 1){
                    /*if(self.list.length == 0){
                        self.toast('请上传现场图片！');
                    }else */if(!self.remark && self.isteacherspeak != 1){
                        self.toast('请填写活动纪要！');
                    }
                    // else if(self.remark && self.remark.length > 180 ){
                    //     self.toast('活动纪要不能超出180个字符！');
                    // }
                    else{
                        this.realsubmit();
                    }
                }
            },

            realsubmit(){
                let self = this;
                let result = [];
                self.submitok = 0;
                if(self.list.length > 0){
                    self.list.map(val => {
                        if(self.ckexamshowflag == 1) {
                            if(val.type == 4 || val.type == 5 || val.type == 6) {
                                result.push({
                                    uid:$.cookie('uid'),
                                    actionplanid: self.detailid,
                                    fileurl: val.fileurl,
                                    type: val.type
                                })
                            }
                        }else {
                            if(self.examstatusname == 1) {
                                //病历讨论
                                if(val.type == 2 || val.type == 3) {
                                    result.push({
                                        uid:$.cookie('uid'),
                                        actionplanid: self.detailid,
                                        fileurl: val.fileurl,
                                        type: val.type
                                    })
                                }
                            }else {
                                if(val.type == 2) {
                                    result.push({
                                        uid:$.cookie('uid'),
                                        actionplanid: self.detailid,
                                        fileurl: val.fileurl,
                                        type: val.type
                                    })
                                }
                            }
                        }
                    });
                }
                this.showLoading('正在提交记录，请稍候~');
                this.post('/actionplan/uploadpic',{
                    command:'actionplan/uploadpic',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    actionplanid:self.detailid,
                    description:self.remark,     //备注
                    caseinfo:self.caseinfo,     //病情简介
                    maindiagnosis:self.maindiagnosis,//主要诊断
                    bedno:self.bedno,           //床号
                    inpatientno:self.inpatientno,//住院号
                    piclist:result,             //照片列表
                    cktype:self.cktype,         //考核类型
                    ckproname: self.pjname,   //输入的考核项目
                    deltypelist:[2,3,4,5,6],     // 上传的照片类型
                    subflag:self.submitsaveflag, // 0暂存 ； 1 提交
                }).done( res => {
                    if(res && res.errcode == 0){
                        self.hideLoading();
                        if(self.submitsaveflag == 0){
                            self.toast('暂存成功！');
                        };
                        if(self.submitsaveflag == 1){
                            self.toast('保存成功！');
                        };
                        self.submitok = 1;
                    }
                    else if(data.errdesc){
                        self.hideLoading();
                        self.toast(data.errdesc);
                    }else {
                        self.hideLoading();
                        self.toast('服务器错误，请联系管理员。');
                    }
                }).fail(err=>{
                    self.hideLoading();
                })
                self.submitconfig.show = false;
            },
            changeTab(tab) {
                this.type = tab.data;
                if(Number(this.type) !== 2){
                    this.isshow = false;
                }
            },

            // 2019-01-04
            submitselect(param) {
                if(param){
                    if(param.key == 1){  // 暂存
                        this.submitsaveflag = 0;
                        this.realsubmit()
                    }else if(param.key == 2){  //提交
                        this.submitsaveflag = 1 ;
                        this.submit()
                    }else{
                        return
                    }
                }
            },
        }
    }
</script>
