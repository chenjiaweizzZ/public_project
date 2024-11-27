<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            新增教学活动计划
            <div slot="headerRight" @click="submit" style="font-size: 0.3rem">
                提交
            </div>
        </c-header>
        <div class="g-main">
            <ul class="main">
                <li>
                    <label>活动级别</label>
                    <div>
                        <span class="radio-box" @click="selectlevel(item)" :class="{'radio-active':item.checkflag,'radio-disabled' : item.levelvalue == 0}" v-for="(item,index) in levellist">{{item.levelname}}</span>
                    </div>
                </li>
                <li @click="sellevel()" >
                    <label>{{levelname}}</label>
                    <span class="choice">{{selectlevels.deptname || selectlevels.name}}</span>
                </li>
                <li>
                    <label>活动主题</label>
                    <input type="text" v-model="theme" placeholder="请输入活动主题" autofocus>
                </li>
                <li @click="seltype.show = true">
                    <label>活动类型</label>
                    <span class="choice">{{typename.name}}</span>
                </li>
                <li @click="getstarttime.show = true;">
                    <label>开始时间</label>
                    <span class="choice">{{ starttime }}</span>
                </li>
                <li @click="getendtime.show = true;">
                    <label>结束时间</label>
                    <span class="choice">{{ endtime }}</span>
                </li>
                <li>
                    <label>活动地点</label>
                    <input type="text" v-model="placename" placeholder="请输入活动地点" autofocus>
                </li>
                <li @click="initteacher()">
                    <label>主讲人</label>
                    <p class="choice">
                        <i v-for='(val,index) in teacher'>{{val.name}}</i>
                    </p>
                </li>
                <li @click="initstudent">
                    <label>参与人员</label>
                    <p class="choice">
                        <i v-for='(val,index) in student'>{{val.name}}</i>
                        <i v-for='(val,index) in student_turndoctor'>{{val.name}}</i>
                        <i v-for='(val,index) in student_trainee'>{{val.name}}</i>
                    </p>
                </li>
                <li>
                    <label>备注</label>
                    <textarea cols="30" rows="20" v-model="remark" placeholder="请输入备注" @focus='textareaFocus' @blur='textareaBlur'></textarea>
                </li>
            </ul>

            <!--查看已选主讲人 -->
            <c-modal :config="selectTeacher">
                <div class="flex-item class-sel-list">
                    <div class="list info-list list-inner">
                        <ul class="doctorupdata">
                            <li v-for="(val,index) in teacher">
                                {{val.name}}
                                <template v-if = "val.username">
                                    -{{val.username}}
                                </template>
                                <i class="deleteitem" @click="deletedoctor(val.id,0)">删&emsp;除</i>
                            </li>
                        </ul>
                    </div>
                </div>
            </c-modal>
            <!--查看已选参与人员 -->
            <c-modal :config="selectDoctor">
                <div class="flex-item class-sel-list">
                    <div class="list info-list list-inner">
                        <ul class="doctorupdata">
                            <li v-for="(val,index) in student" >
                                <span>
                                    {{val.name}}
                                    <template v-if = "val.username">
                                        -{{val.username}}
                                    </template>
                                    <template v-if = "val.count">
                                    ({{val.count}}人)
                                    </template>
                                </span>
                                <i  v-if="val.type !==1" class="deleteitem" @click="deletedoctor(val.id,1,val.type)">删&emsp;除</i>
                            </li>
                        </ul>
                        <template  v-if="surelevel.levelcode == 'office'">
                            <ul class="doctorupdata">
                                <li v-for="(val,index) in student_turndoctor" >
                                <span>
                                    {{val.name}}
                                    <template v-if = "val.username">
                                        -{{val.username}}
                                    </template>
                                    <template v-if = "val.count">
                                    ({{val.count}}人)
                                    </template>
                                </span>
                                    <i  v-if="val.type !==1" class="deleteitem" @click="deletedoctor(val.id,1,val.type)">删&emsp;除</i>
                                </li>
                            </ul>
                            <ul class="doctorupdata">
                                <li v-for="(val,index) in student_trainee" >
                                <span>
                                    {{val.name}}
                                    <template v-if = "val.username">
                                        -{{val.username}}
                                    </template>
                                    <template v-if = "val.count">
                                    ({{val.count}}人)
                                    </template>
                                </span>
                                    <i  v-if="val.type !==1" class="deleteitem" @click="deletedoctor(val.id,1,val.type)">删&emsp;除</i>
                                </li>
                            </ul>
                        </template>
                    </div>
                </div>
            </c-modal>
            <!--选择主讲人 -->
            <transition enter-active-class="animated slideInRight" leave-active-class="animated fadeOut" >
                <div v-show="choiceteacher" class="department g-wrapper">
                    <c-header>
                        <div slot="headerLeft">
                            <a @click="choiceteacher = false" class="header-back-btn">
                                <img src="../../assets/images/icon_fanhui.png" />
                            </a>
                        </div>
                        选择主讲人
                        <div slot="headerRight" @click="closeteacher" style="font-size: 0.3rem">
                            确定
                        </div>
                    </c-header>
                    <div class="g-main">
                        <div class="search">
                            <input type="text" v-model="searchname" placeholder="搜索">
                            <i @click="searchteacher()"></i>
                        </div>
                        <div class="flex-item class-sel-list" style="padding-bottom: 0.6rem;">
                            <div class="list info-list list-inner">
                                <div class="item" v-for="item in teacherlist">
                                    <label class="flex flex-start flex-row">
                                        <div class="fitem">{{item.name}}-{{item.username}}</div>
                                        <input class="checkbox" type="checkbox" :value="item" v-model="teacher">
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="result" @click="selectTeacher.show = true">
                        <p>已选主讲人（{{teacher.length}}）</p>
                    </div>
                </div>
            </transition>
            <!--选择参与人员 -->
            <transition enter-active-class="animated slideInRight" leave-active-class="animated fadeOut" >
                <div v-show="choicestudent" class="department g-wrapper">
                    <c-header>
                        <div slot="headerLeft">
                            <a @click="choicestudent = false" class="header-back-btn">
                                <img src="../../assets/images/icon_fanhui.png" />
                            </a>
                        </div>
                        选择参与人员
                    </c-header>
                    <div class="g-main">
                        <div class="search">
                            <input type="text" v-model="studentname" placeholder="搜索">
                            <i @click="searchstudent()"></i>
                        </div>
                        <template v-if="surelevel.levelcode == 'hospital'">
                            <ul>
                                <li class="choice"  @click = 'getgradelist(gradelist,"grade","hospital")'>根据年级选择</li>
                                <li class="choice" @click = 'getgradelist(stutypelist,"type","hospital")'>根据学员类型选择</li>
                            </ul>
                        </template>
                        <template v-else-if="surelevel.levelcode == 'base'">
                            <ul>
                                <li class="checkbase" :class="{'checkbase-active':item.ischecked}" @click="checkbase(item)" v-for="(item,index) in basechecklist">{{item.name}}({{item.count}}人)</li>
                            </ul>
                        </template>
                        <template v-else>
                            <ul>
                                <li class="choice" @click="initstudentlist('turndoctor')">住院医</li>
                                <li class="choice" @click="initstudentlist('trainee')">实习生</li>
                            </ul>
                        </template>
                        <!--hospital-choice-->
                        <c-modal :config='selhospital'>
                            <div class="flex-item class-sel-list">
                                <div class="list info-list list-inner">
                                    <div class="item" v-for="it in studentlist">
                                        <label class="flex flex-start flex-row">
                                            <div class="fitem">{{it.name}}<template v-if="it.count">({{it.count}}人)</template></div>
                                            <input type="checkbox" v-model="student" :value="it" class="checkbox" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <template slot="buttons">
                                <button type="button" class="btn" @click="selhospital.show = false;">确定</button>
                            </template>
                        </c-modal>
                        <!--office-choice-->
                        <c-modal :config='seloffice'>
                            <div class="flex-item class-sel-list">
                                <div class="list info-list list-inner">
                                    <div class="item" @click="choiceall('turndoctor')">
                                        <label class="flex flex-start flex-row">
                                            <div class="fitem">全部</div>
                                            <input type="checkbox" :checked="student_turndoctor.length == selofficelist.length" class="checkbox" />
                                        </label>
                                    </div>
                                    <div class="item" v-for="it in selofficelist">
                                        <label class="flex flex-start flex-row">
                                            <div class="fitem">{{it.name}}-{{it.username}}</div>
                                            <input type="checkbox" v-model="student_turndoctor" :value="it" class="checkbox" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <template slot="buttons">
                                <button type="button" class="btn" @click="seloffice.show = false;">确定</button>
                            </template>
                        </c-modal>

                        <c-modal :config='selofficetrainee'>
                            <div class="flex-item class-sel-list">
                                <div class="list info-list list-inner">
                                    <div class="item" @click="choiceall('trainee')">
                                        <label class="flex flex-start flex-row">
                                            <div class="fitem">全部</div>
                                            <input type="checkbox" :checked="student_trainee.length == selofficetraineelist.length" class="checkbox" />
                                        </label>
                                    </div>
                                    <div class="item" v-for="it in selofficetraineelist">
                                        <label class="flex flex-start flex-row">
                                            <div class="fitem">{{it.name}}-{{it.username}}</div>
                                            <input type="checkbox" v-model="student_trainee" :value="it" class="checkbox" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <template slot="buttons">
                                <button type="button" class="btn" @click="selofficetrainee.show = false;">确定</button>
                            </template>
                        </c-modal>
                        <!--search-choice-->
                        <c-modal :config='searchconfig'>
                            <div class="flex-item class-sel-list">
                                <div class="list info-list list-inner">
                                    <div class="item" v-for="it in searchlist">
                                        <label class="flex flex-start flex-row">
                                            <div class="fitem">{{it.name}}-{{it.username}}</div>
                                            <input type="checkbox" v-model="student" :value="it" class="checkbox" />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <template slot="buttons">
                                <button type="button" class="btn" @click="searchconfig.show = false;">确定</button>
                            </template>
                        </c-modal>
                    </div>
                    <div class="result"  @click="selectDoctor.show = true">
                        <p>
                            已选参与人
                            <template v-if="surelevel.levelcode == 'office'">({{ Number(student.length) + Number(student_turndoctor.length) + Number(student_trainee.length)}})</template>
                            <template v-else>({{student.length}})</template>
                        </p>
                    </div>
                </div>
            </transition>
        </div>

        <!--选择科室-->
        <c-picker :config="seldept" @confirm="selectdept">

        </c-picker>
        <!--选择活动类型 -->
        <c-picker :config="seltype" @confirm="selecttype">

        </c-picker>

        <!--选择开始时间-->
        <c-timepicker :config="getstarttime" @confirm="selectstarttime"></c-timepicker>

        <!--选择结束时间-->
        <c-timepicker :config="getendtime" @confirm="selectendtime"></c-timepicker>
    </div>
</template>
<script>
    import Vue from 'vue';
    import moment from 'moment';
    import methods from '../../methods';
    import cHeader from '../header';
    import cModal from '../../components/modal';
    import cTab from '../../components/tab';
    import cTabs from '../../components/tabs';
    import cTimepicker from '../../components/timepicker';
    import cPicker from '../../components/default-picker'
    import { mapState, mapActions } from 'vuex'
    let bus = new Vue();
    export default {
        components:{
            cHeader,
            cModal,
            cTab,
            cTabs,
            cTimepicker,
            cPicker
        },
        data(){
            return{
                bus:bus,
                data:'',
                levellist:[],//活动级别
                levelname:'科室',//显示当前在选择什么
                surelevel:'',//选择的活动级别
                hospitallist:'',//医院列表
                selectlevels:'',//选中的科室
                baselist:'',//基地列表
                officelist:'',//科室列表
                isstutype:'grade',
                getstarttime:{
                    show:false,
                    istime:true,
                    isday:true
                },
                getendtime:{
                    show:false,
                    istime:true,
                    isday:true
                },
                seldept:{
                    show:false,
                    mainlist:[],
                    valueKey:function(value){
                        return value.deptname || value.name
                    }
                },
                seltype:{
                    show:false,
                    mainlist:[],
                    valueKey:'name'
                },
                selhospital: {
                    show: false,
                    title: '选择参与人员',
                    hideOnClickOut: true,
                },
                isallseloffice:false,
                isallselofficetrainee:false,
                student_turndoctor:[],
                student_trainee:[],
                selofficelist:[],
                selofficetraineelist:[],
                seloffice: {
                    show: false,
                    title: '选择住院医',
                    hideOnClickOut: true,
                },
                selofficetrainee: {
                    show: false,
                    title: '选择实习生',
                    hideOnClickOut: true,
                },
                searchname:'',
                studentname:'',
                choiceteacher:false,//选择主讲人
                choicestudent:false,//选择参与人员
                theme:'',//活动主题
                starttime:'',//选择的开始时间
                endtime:'',//选择的结束时间
                typename:'',//选择的活动类型
                placename:'',//选择的活动地点
                teacher:[],//选择的主讲人
                student:[],//选择的学生
                remark:'',//备注
                teacherlist:[],//老师列表
                studentlist:[],//学生列表
                selectDoctor: {
                    show: false,
                    title: '已选参与人员'
                },
                selectTeacher: {
                    show: false,
                    title: '已选主讲人'
                },
                selectStudent: {
                    show: false,
                    title: '选择参与人员'
                },
                typelist :'',
                technicallist :[],
                gradelist:[],
                stutypelist:[],
                basechecklist:[
                    {
                        name:'正在该基地轮转的学员',
                        id:'',
                        attendbusinfo:'base',
                        type:1,
                        count:'',
                        ischecked:false
                    },{
                        name:'专业在该基地的学员',
                        id:'',
                        attendbusinfo:'turn',
                        type:1,
                        count:'',
                        ischecked:false
                    }
                ],
                isCheckedAll_a:false,
                isCheckedAll_b:false,
                searchconfig: {
                    show: false,
                    title: '选择搜索的参与人员'
                },
                searchlist:[],
                hospitalbusidlist:"",
                hospitalattend:'',
            }
        },
        computed:{

        },
        watch:{
            'surelevel':function(val){
                if(val){
                    this.teacherlist = [];
                    this.studentlist = [];
                    this.teacher = [];
                    this.student = [];
                }
            },
            'teacher':function(val){
                if(val.length == 0){
                    this.selectTeacher.show = false;
                }
            },
            'student':function(val){
                if(val.length == 0){
                    this.selectDoctor.show = false;
                }
            },
        },
        created(){

        },
        mounted(){
            var self = this;
            this.initgrade();
            this.initstutype();
            this.initalldept();
            this.inittypelist();
            this.registerToNative('goBack', function (data) {
                self.back()
            })
        },
        methods:{
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            ...methods,
            //获取开始时间
            selectstarttime(data){
                this.starttime = data;
            },
            //获取结束时间
            selectendtime(data){
                this.endtime = data;
            },
            //获取所在的节点
            initalldept(){
                let self = this;
                this.post('/actionplanbase/getusermanagerdept',{
                    command: 'actionplanbase/getusermanagerdept',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    uid:$.cookie('uid'),
                    paramcode:"actionplanaddroles",//只在教学计划中增加的参数
                }).done(res => {
                    if(res&&res.errcode==0){
                        self.hospitallist = res.beanlist.hospitallist;
                        self.baselist = res.beanlist.baselist;
                        self.officelist = res.beanlist.officelist;
                        self.initlevellist();
                    }else if(res.errdesc){
                        self.toast(res.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                })
            },
            //获取活动级别列表
            initlevellist(){
                let self = this;
                this.post('/actionplanbase/getactionplanlevel',{
                    command: 'actionplanbase/getactionplanlevel',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    uid:$.cookie('uid')
                }).done(res => {
                    if(res && res.errcode==0){
                        let _levellist = res.actionplanlevellist ;
                        let hospital , base;
                        _levellist.map(value => {
                            this.$set(value, 'checkflag', false);
                            if(value.levelcode == 'hospital'){
                                hospital = value
                            }
                            if(value.levelcode == 'base'){
                                base = value
                            }
                        });
                        if(hospital.levelvalue == 0 && base.levelvalue == 0 ){
                            self.selectlevels = self.officelist[0];
                            self.seldept.mainlist = self.officelist;
                            self.initteacherlist(self.selectlevels.id);
                            _levellist.map(value => {
                                if(value.levelcode == 'office'){
                                    value.checkflag = true ;
                                    self.surelevel = value;
                                }
                            });
                        }
                        self.levellist = _levellist;
                    }else if(res.errdesc){
                        self.toast(res.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                })
            },
            //获取活动类型
            inittypelist(){
                let self=this;
                this.post('/turnbaseinfo/turnbaseinfolevel',{
                    command: 'turnbaseinfo/turnbaseinfolevel',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    code:'teachtype',
                }).done((data)=>{
                    if(data&&data.errcode ==0){
                        self.seltype.mainlist = JSON.parse(data.baseinfolevellist);
                    }else if(data.errdesc){
                        self.toast(data.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                })
            },
            //start 选择科室
            sellevel(){
                if(!this.surelevel){
                    this.toast('请先选择活动级别')
                }else {
                    this.seldept.show = true
                }

            },
            //end 选择科室
            selectdept(data){
                this.selectlevels = data ;
                this.teacherlist = [];
                this.teacher = [];
                this.studentlist = [];
                this.student = [];
                this.student_turndoctor = [];
                this.student_trainee = [];
                if(this.surelevel.levelcode == 'office'){
                    this.initteacherlist(this.selectlevels.id);
                }else if(this.surelevel.levelcode == 'base'){
                    this.basechecklist.map(value => {
                        value.id = this.selectlevels.id;
                    })
                }
                this.seldept.show = false ;
            },
            //选择活动级别
            selectlevel(param){
                let self = this;
                if(param == this.surelevel){
                    return
                }
                this.teacherlist = [];
                this.teacher = [];
                this.studentlist = [];
                this.student = [];
                this.selectlevels = '';
                this.surelevel = param;
                this.levellist.map(value => {
                    if(value.levelcode == param.levelcode){
                        value.checkflag = true;
                    }else {
                        value.checkflag = false;
                    }
                });
                if(param.levelcode == 'hospital'){
                    this.levelname = '院校' ;
                    self.seldept.mainlist = self.hospitallist;
                    self.selectlevels = self.hospitallist[0];
                }else if(param.levelcode == 'base'){
                    this.levelname = '基地' ;
                    self.seldept.mainlist = self.baselist;
                    self.selectlevels = self.baselist[0];
                }else {
                    this.levelname = '科室' ;
                    self.seldept.mainlist = self.officelist;
                    self.selectlevels = self.officelist[0];
                    self.initteacherlist(self.selectlevels.id);
                }
            },
            //选择活动类型
            selecttype(data){
                this.typename = data ;
                this.seltype.show = false ;
            },
            //start 选择主讲人
            initteacher(){
                if(!this.selectlevels.id){
                    this.toast('请先选择科室');
                }else {
                    this.choiceteacher = true ;
                }
            },
            //end 选择主讲人
            closeteacher(){
                if(this.teacher.length <= 0){
                    this.toast('请选择主讲人')
                }else {
                    this.choiceteacher = false;
                }
            },
            //获取主讲人
            initteacherlist(param){
                let self=this;
                this.post('/actionplanbase/getspeaker',{
                    command: 'actionplanbase/getspeaker',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    actionplanlevel:'office',
                    deptid: param
                }).done((data)=>{
                    if(data && data.errcode ==0){
                        self.teacherlist = data.speakerlist;
                    }else if(data.errdesc){
                        self.toast(data.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                })
            },
            //搜索主讲人
            searchteacher(){
                let self=this;
                if(self.searchname == '' && self.surelevel.levelcode == 'office'){
                    self.initteacherlist(self.selectlevels.id);
                }else if(!self.searchname){
                    this.toast('请输入您要搜索的内容');
                    return
                }else {
                    this.post('/actionplanbase/getspeakerforsearch',{
                        command: 'actionplanbase/getspeakerforsearch',
                        sessionid:$.cookie('sid'),
                        loginid:$.cookie('uid'),
                        actionplanlevel:self.surelevel.levelcode,
                        speakername: self.searchname
                    }).done((data)=>{
                        if(data && data.errcode ==0){
                            self.teacherlist = [];
                            data.attendlist.map(value => {
                                self.teacherlist.push({name:value.name,id:value.id,username:value.username})
                            })
                            if(self.teacherlist.length == 0){
                                self.toast('未搜索到哟~')
                            }
                        }else if(data.errdesc){
                            self.toast(data.errdesc)
                        }else {
                            self.toast('服务器错误，请联系管理员。')
                        }
                    })
                }
            },
            //start 选择参与人
            initstudent(){
                if(!this.selectlevels.id){
                    this.toast('请先选择科室');
                    return
                }else if (!this.starttime || !this.endtime){
                    this.toast('请先选择活动时间');
                    return
                }else {
                    if(this.surelevel.levelcode == 'base'){
                        this.getgradelist(this.selectlevels.id,'base','base');
                        this.getgradelist(this.selectlevels.id,'turn','base');
                    }
                    this.choicestudent = true;
                }
            },
            //获取年级信息
            initgrade(){
                let self=this;
                this.post('/turnbaseinfo/turnbaseinfolevel',{
                    command: 'turnbaseinfo/turnbaseinfolevel',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    code:'turngrade'
                }).done((data)=>{
                    if(data && data.errcode ==0){
                        self.gradelist = [] ;
                        let _data = JSON.parse(data.baseinfolevellist);
                        _data.map(value => {
                            self.gradelist.push(value.id);
                        })
                    }else if(data.errdesc){
                        self.toast(data.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                })
            },
            //获取学员类型信息
            initstutype(){
                let self=this;
                this.post('/hr/querylevellist',{
                    command: 'hr/querylevellist',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    code:'stud_type'
                }).done((data)=>{
                    if(data && data.errcode ==0){
                        self.stutypelist = [] ;
                        let _data = data.levellist;
                        _data.map(value => {
                            self.stutypelist.push(value.key);
                        })
                    }else if(data.errdesc){
                        self.toast(data.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                })
            },
            //获取年级或者学员
            getgradelist(param,params,type){
                let self = this;
                self.studentlist = [];
                self.hospitalattend = params;
                self.hospitalbusidlist = param;
                if(self.surelevel.levelcode == 'hospital' && self.isstutype !== params){
                    self.isstutype = params;
                    if(self.student && self.student.length > 0){
                        for(let i = self.student.length-1 ; i >= 0 ; i--){
                            if(self.student[i].type == 1){
                                self.student.splice(i,1)
                            }
                        }
                    }
                }
                let opitions = {};
                if(type == 'hospital'){
                    opitions.hospitalbusidlist = param;
                    opitions.hospitalattend = params;
                }else if(type == 'base'){
                    opitions.deptid = param;
                    opitions.baseattend = params;
                }
                this.post('/actionplanbase/getattender',{
                    command: 'actionplanbase/getattender',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    actionplanlevel: type,
                    starttime:self.starttime,
                    endtime:self.endtime,
                    ...opitions
                }).done((data)=>{
                    if(data && data.errcode ==0){
                        if(type == 'hospital'){
                            if(data.result.grouplist && data.result.grouplist.length > 0){
                                data.result.grouplist.map(value => {
                                    self.studentlist.push({name:value.name,id:value.id,count:value.count,type:1})
                                });
                                self.selhospital.show = true ;
                            }
                        }else if(type == 'base' && params == 'base'){
                            self.basechecklist[1].count = data.result.grouplist[0].count
                        }else if(type == 'base' && params == 'turn'){
                            self.basechecklist[0].count = data.result.grouplist[0].count
                        }
                    }else if(data.errdesc){
                        self.toast(data.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                })
            },
            //获取参与人
            initstudentlist(param){
                let self=this;
                this.post('/actionplanbase/getattender',{
                    command: 'actionplanbase/getattender',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    actionplanlevel:'office',
                    officeattend:param,
                    starttime:self.starttime,
                    endtime:self.endtime,
                    deptid:self.selectlevels.id
                }).done((data)=>{
                    if(data&&data.errcode ==0){
                        self.studentlist = [];
                        self.selofficelist = [];
                        self.selofficetraineelist = [];
                        if(data.result.attendlist && data.result.attendlist.length > 0){
                            if(param == 'turndoctor'){
                                data.result.attendlist.map(value => {
                                    self.selofficelist.push({
                                        type:2,
                                        id:value.id,
                                        name:value.name,
                                        username:value.username
                                    });
                                });
                                self.seloffice.show = true;
                            }else if(param == 'trainee'){
                                data.result.attendlist.map(value => {
                                    self.selofficetraineelist.push({
                                        type:3,
                                        id:value.id,
                                        name:value.name,
                                        username:value.username
                                    })
                                });
                                self.selofficetrainee.show = true;
                            }
                        }else {
                            self.toast('当前没有查询到该类型的学员。')
                        }
                    }
                })
            },
            //全选参与人
            choiceall(param){
                let self = this;
                if(param == 'turndoctor'){
                    this.isCheckedAll_a = !this.isCheckedAll_a;
                    if (this.isCheckedAll_a) {
                        // 全选时
                        self.student_turndoctor = self.selofficelist;
                    } else {
                        self.student_turndoctor = [];
                    }
                }else if(param == 'trainee') {
                    this.isCheckedAll_b = !this.isCheckedAll_b;
                    if (this.isCheckedAll_b) {
                        // 全选时
                        self.student_trainee = self.selofficetraineelist;
                    } else {
                        self.student_trainee = [];
                    }
                }
            },
            //搜索参与人
            searchstudent(){
                let self=this;
                if(!self.studentname){
                    this.toast('请输入搜索内容');
                    return
                }
                this.post('/actionplanbase/getattenderforsearch',{
                    command: 'actionplanbase/getattenderforsearch',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    actionplanlevel: self.surelevel.levelcode,
                    attendername: self.studentname
                }).done(res => {
                    if(res && res.errcode ==0){
                        self.searchlist = [];
                        if(res.attendlist && res.attendlist.length > 0){
                            res.attendlist.map(value => {
                                self.searchlist.push({
                                    type:0,
                                    id:value.id,
                                    name:value.name,
                                    username:value.username
                                })
                            });
                        }
                        if(self.searchlist.length == 0){
                            self.toast('未搜索到哟~')
                        }else {
                            self.searchconfig.show = true;
                        }
                    }
                })
            },
            //删除参与人
            deletedoctor(param,params,type){
                let self= this;
                if(params){
                    this.showConfirm({
                        title: '温馨提示',
                        msg: '您是否要删除当前参与人员？',
                        theme: 'modal-confirm modal-white',
                        cancel: function () {},
                        ok: function () {
                            if(type == 0){
                                self.student.map((val,index) => {
                                    if(val.id == param){
                                        self.student.splice(index, 1);
                                    }
                                })
                            }else if(type == 2){
                                self.student_turndoctor.map((val,index) => {
                                    if(val.id == param){
                                        self.student_turndoctor.splice(index, 1);
                                    }
                                })
                            }else if(type == 3){
                                self.student_trainee.map((val,index) => {
                                    if(val.id == param){
                                        self.student_trainee.splice(index, 1);
                                    }
                                })
                            }
                        },
                    })
                }else {
                    this.showConfirm({
                        title: '温馨提示',
                        msg: '您是否要删除当前选中主讲人？',
                        theme: 'modal-confirm modal-white',
                        cancel: function () {},
                        ok: function () {
                            self.teacher.map((val,index) => {
                                if(val.id == param){
                                    self.teacher.splice(index, 1);
                                }
                            })
                        },
                    })
                }
            },
            //end 基地选择
            checkbase(param){
                this.hospitalattend = param.attendbusinfo;
                this.student.map((value,index) => {
                    if(value.type == 1){
                        this.student.splice(index, 1);
                    }
                })
                this.student.push(param);
                this.basechecklist.map(value => {
                    if(value.attendbusinfo == param.attendbusinfo){
                        value.ischecked = true;
                    }else {
                        value.ischecked = false;
                    }
                })
            },
            // 提交
            submit(){
                let self = this;
                if(!self.selectlevels.id){
                    self.toast('请选择科室！');
                    return
                }else if(!self.typename){
                    self.toast('请选择活动类型！');
                    return
                }else if(!self.theme){
                    self.toast('请输入活动主题！');
                    return
                }else if(this.teacher.length <= 0){
                    self.toast('请选择主讲人！');
                    return
                }else if(!self.placename){
                    self.toast('请选择活动地点！');
                    return
                }else if(!self.starttime){
                    self.toast('请选择活动开始时间！');
                    return
                }else if(!self.endtime){
                    self.toast('请选择活动结束时间！');
                    return
                }
                if(moment(self.endtime).format('X') <= moment(self.starttime).format('X') ){
                    self.toast('结束时间必须大于开始时间！');
                    return
                }
                let attendinfolist = [];
                let _student = [];
                if(self.surelevel.levelcode == 'office'){
                    _student = self.student.concat(self.student_turndoctor).concat(self.student_trainee);
                }else {
                    _student = self.student ;
                }
                if(_student){
                    _student.map(val => {
                        if(self.surelevel.levelcode == 'hospital' || self.surelevel.levelcode == 'base'){
                            if(val.type == 1){
                                attendinfolist.push({
                                    attendbusid: val.id,
                                    attendbusinfo: val.name + '-' + val.count ,
                                    bustype:self.hospitalattend ,
                                    type: val.type
                                })
                            }
                        }else {
                            attendinfolist.push({
                                attendbusid: val.id,
                                attendbusinfo: val.name + '-' + val.username,
                                bustype:'' ,
                                type: val.type
                            })
                        }
                    })
                }
                let _teacher = [];
                if(self.teacher){
                    self.teacher.map(val => {
                        _teacher.push({'uid':val.id})
                    })
                }
                let opitions ={attendinfo:{}};
                if(_student.length > 0){
                    opitions.attendinfo.actionplanlevel = self.surelevel.levelcode;
                    opitions.attendinfo.deptid = self.selectlevels.id;
                    opitions.attendinfo.starttime = self.starttime;
                    opitions.attendinfo.endtime = self.endtime;
                    if(self.surelevel.levelcode == 'hospital'){
                        opitions.attendinfo.hospitalattend = self.hospitalattend;
                        if(self.student && self.student.length > 0){
                            opitions.attendinfo.hospitalbusidlist = []
                            self.student.map(value => {
                                if(value.type == 1){
                                    opitions.attendinfo.hospitalbusidlist.push(value.id)
                                }
                            })
                        }
                    }else if(self.surelevel.levelcode == 'base'){
                        for(let i = 0 ; i < self.basechecklist.length ; i++){
                            if(self.basechecklist[i].ischecked == true){
                                opitions.attendinfo.baseattend = self.basechecklist[i].attendbusinfo;
                                break;
                            }
                        }
                    }
                }
                this.showConfirm({
                    title: '温馨提示',
                    msg: '您是否确认提交？',
                    theme: 'modal-confirm modal-white',
                    cancel: function () {},
                    ok: function () {
                        self.post('/actionplan/addactionplan',{
                            command:'actionplan/addactionplan',
                            sessionid:$.cookie('sid'),
                            loginid:$.cookie('uid'),
                            uid:$.cookie('uid'),
                            actionplanlevel:self.surelevel.levelcode,
                            theme:self.theme,
                            type:self.typename.id,
                            deptid:self.selectlevels.id,
                            place:self.placename,
                            starttime:self.starttime,
                            endtime:self.endtime,
                            attendinfolist:attendinfolist,
                            speakerlist:_teacher,
                            remark:self.remark,
                            ...opitions
                        }).done(function(data){
                            if (data && data.errcode==0) {
                                self.toast('新增成功~');
                                setTimeout(() => {
                                    self.$router.push({
                                        name: 'fdAction_list'
                                    })
                                },500)
                            }else if(data.errdesc){
                                self.toast(data.errdesc)
                            }else {
                                self.toast('服务器错误，请联系管理员。')
                            }
                        }).fail(function(error){

                        })

                    },
                })

            },

            textareaFocus(){
                $('.g-main').css("padding-bottom",'6rem')
            },
            textareaBlur(){
                $('.g-main').css("padding-bottom",'0')
            },

            back(){
                let self = this;
                this.showConfirm({
                    title: '温馨提示',
                    msg: '你当前操作尚未提交保存，是否确认返回？',
                    theme: 'modal-confirm modal-white',
                    cancel: function () {},
                    ok: function () {
                        self.$router.push({
                            name: 'fdAction_list'
                        })
                    },
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
    .shade {
        height: 100%;
        width: 100%;
        min-width: 100%;
        min-height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
    }
    .main {
        margin-top:0.1rem;
        padding-bottom: 0.6rem;
        li:nth-child(3) , li:nth-child(5) , li:nth-child(8){
            border-bottom: 1px solid #eee;
            margin-bottom:0
        }
        li:last-child {
            height:1.6rem;
            display:flex;
            align-items:center;
        }

    }
    li {
        background:#fff;
        height: .65rem;
        line-height:.65rem;
        padding:0 0.4rem;
        position: relative;
        color: #666;
        font-size: 0.26rem;
        font-family: "Microsoft YaHei";
        margin-bottom:0.1rem;
        display: flex;
        label {
            flex: 1;
            line-height:0.65rem;
            text-align:justify;
            text-align-last:justify;
            margin-right:0.3rem;
            vertical-align: top;
        }
        >textarea {
            display: flex;
            flex: 3;
        }
        >div , >span , >input {
            display: flex;
            flex: 3;
            height: .62rem;
            line-height: .62rem;
            overflow: hidden;
            span {
                flex: 1;
                width: 0;
                line-height: .62rem;
            }
        }
        >p {
            flex: 3;
            height: .62rem;
            padding-right: .2rem;
            overflow: hidden;
            i {
                overflow: hidden;
            }
        }
    }
    .choice:after {
        content:'';
        display:inline-block;
        width:0.3rem;
        height:0.3rem;
        background: url("../../assets/images/you-jiantou.png") 0 0 no-repeat;
        background-size:100% 100%;
        position: absolute;
        right: 0.3rem;
        top: 0.15rem;
    }
    .radio-box:before {
        content: '';
        display: inline-block;
        width: .25rem;
        height: .25rem;
        margin-right: .05rem;
        border-radius: 50%;
        box-shadow: #dfdfdf 0 0 0 0 inset;
        background-image: url('../../assets/images/gouxuan.png');
        background-size: cover;

    }
    .radio-active:before {
        background-image: url('../../assets/images/gouxuan_on.png');
        background-size: cover;
    }
    .radio-disabled {
        pointer-events: none;
        color: #aaa;
    }
    .checkbase:after {
        position: absolute;
        right: .2rem;
        top: .15rem;
        content: '';
        display: inline-block;
        width: .35rem;
        height: .35rem;
        margin-right: .05rem;
        border-radius: 50%;
        box-shadow: #dfdfdf 0 0 0 0 inset;
        background-image: url('../../assets/images/gouxuan.png');
        background-size: cover;
    }
    .checkbase-active:after {
        background-image: url('../../assets/images/gouxuan_on.png');
        background-size: cover;
    }
    p {
        margin :0
    }
    i {
        font-style: normal;
        line-height: .65rem;
        padding-right: .1rem;
    }
    textarea {
        display:inline-block;
        width: calc(100% - 2rem);
        height:1.4rem;
        margin-top:0.1rem;
        align-self:flex-start;
    }
    .department {
        width:100vw;
        height:100vh;
        background:#F8F8F8;
        position:absolute;
        top:0;
        z-index: 999;
    }
    .type {
        background:#fff;
        width:100%;
        /*z-index: 10000;*/
        text-align: center;
    }
    .search {
        position:relative;
        margin: .1rem .2rem;
        border: 1px solid #eee;
        border-radius: 0.3rem;
        height: 0.6rem;
        input {
            margin: 0.1rem 0 0.1rem 0.2rem;
            height: 0.4rem;
            width: calc(100% - 1rem);
            background: transparent;
            display:inline-block;
        }
        i {
            display:inline-block;
            width:0.4rem;
            height:0.4rem;
            margin:0.1rem;
            background:url('../../assets/images/icon-search.png') 0 0 no-repeat;
            background-size:100% 100%;
            cursor:pointer;
            vertical-align: middle;
            z-index:99;
        }
    }
    s {
        text-decoration: none;
    }
    .students , .remark {
        height: auto;
        p {
            height: auto;
            min-width: 100%;
        }
        span {
            line-height:0.35rem;
        }
    }
    li.add {
        height: auto;
        input {
            opacity: 0;
            position: absolute;
            left: 2rem;
            width: calc(100% - 5.4rem);
            height: 100%;
        }
        p {
            height: auto;
        }
        s {
            display:inline-block;
            width:0.4rem;
            height:0.4rem;
            background:url('../../assets/images/attachment.png') 0 0 no-repeat;
            background-size:100% 100%;
            vertical-align: middle;
        }
        i {
            font-style: normal;
            color: #3499db;
            padding-left: 0.2rem;
        }
    }
    .result {
        display: inline-block;
        width: 100%;
        height: 0.6rem;
        background: #fff;
        position: absolute;
        bottom: 0;
        padding: 0 0.4rem;
        color: #666;
        z-index: 999;
        border-top: 1px solid #eee;
        p {
            height: 0.6rem;
            line-height: 0.6rem;
            font-size: 0.25rem;
        }
        p:after {
            content:'';
            display:inline-block;
            width:0.3rem;
            height:0.3rem;
            background: url("../../assets/images/you-jiantou.png") 0 0 no-repeat;
            background-size:100% 100%;
            position: absolute;
            right: 0.3rem;
            top: 0.15rem;
        }
    }
    .doctorupdata {
        li {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
    i.deleteitem {
        display: inline-block;
        height: 0.5rem;
        line-height: 0.5rem;
        font-style: normal;
        color: #fff;
        padding: 0 0.1rem;
        text-align: center;
        background: #f56c6c;
        border-radius: 5px;
    }
</style>
