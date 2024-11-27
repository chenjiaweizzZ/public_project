<template>
    <div class="g-main">
        <no-content v-if="cansubmit == 0 && notshow"></no-content>
        <div v-else>
            <!--出科考核单填信息-->
            <div v-if="ckexamshowflag == 1 ">
                <ul class="main">
                    <li @click="cansubmit == 1 ? ( seltype.show = true ) : false">
                        <label><span class="red">*</span>出科考核类型 : </label>
                        <span class="choice">{{typename.name}}</span>
                    </li>
                    <li v-show="typename.order == 1 ">
                        <label><span class="red">*</span>考核项目 : </label>
                        <span>
                            <input maxlength="99" type="text" v-model="projectname" placeholder="请输入考核项目" autofocus :disabled = "cansubmit ==1 ? false : 'disabled' ">
                        </span>
                    </li>
                    <li @click="selectteacher.show = true">
                        <label>考核老师 : </label> <span class="choice">{{actiondetail.speakerlist.length}}人</span>
                    </li>
                    <li @click="selectDoctor.show = true">
                        <label>被考核学员 : </label> <span class="choice">{{actiondetail.attendercount}}人</span>
                    </li>
                    <li>
                        <label>考核时间 : </label> {{actiondetail.starttimestr}} - {{actiondetail.endtimestr}}
                    </li>
                    <li>
                        <label>考核地点 : </label> {{actiondetail.place}}
                    </li>
                    <li><!--技能考评 type=4-->
                        <p>成绩汇总表</p>
                           <vue-cuploader v-if="cansubmit == 1" class="add_picture" :imgList='filelist' :fdfsurl="fdfsurl" :type=4 :uploadIndex=4 :uploadflag="uploadflag" :newtype="newtype" @getFilelist="getFilelist"></vue-cuploader>
                           <vue-cuploader v-if="cansubmit == 0" class="add_picture" :imgList='filelist' :fdfsurl="fdfsurl" :type=4 :uploadIndex=4 :uploadflag="uploadflag" :newtype="newtype" @getFilelist="getFilelist" :isupload="false" :isuploadflag="false"></vue-cuploader>
                    </li>

                    <li>
                        <p v-if="typename.order == 1 ">技能考核评分原始表</p>
                        <p v-else>综合面对面考核评分原始表</p>
                           <vue-cuploader v-if="cansubmit == 1"  class="add_picture" :imgList='filelist' :fdfsurl="fdfsurl" :type=5 :uploadIndex=5 :uploadflag="uploadflag" :newtype="newtype" @getFilelist="getFilelist"></vue-cuploader>
                           <vue-cuploader v-if="cansubmit == 0"  class="add_picture" :imgList='filelist' :fdfsurl="fdfsurl" :type=5 :uploadIndex=5 :uploadflag="uploadflag" :newtype="newtype" @getFilelist="getFilelist" :isupload="false" :isuploadflag="false"></vue-cuploader>
                    </li>

                    <li>
                        <p v-if="typename.order == 1 ">技能考核现场图片</p>
                        <!--type=6-->
                        <p v-else>综合面对面考核现场图片</p>
                          <vue-cuploader v-if="cansubmit == 1"  class="add_picture" :imgList='filelist' :fdfsurl="fdfsurl" :type=6 :uploadIndex=6 :uploadflag="uploadflag" :newtype="newtype" @getFilelist="getFilelist"></vue-cuploader>
                          <vue-cuploader v-if="cansubmit == 0"  class="add_picture" :imgList='filelist' :fdfsurl="fdfsurl" :type=6 :uploadIndex=6 :uploadflag="uploadflag" :newtype="newtype" @getFilelist="getFilelist" :isupload="false" :isuploadflag="false"></vue-cuploader>
                    </li>

                    <li>
                        <div class="remark">
                            <p><span class="red"></span>活动纪要：</p>
                            <textarea cols="30"  v-model="remark" maxLength="180" placeholder="请输入现场记录" @focus='textareaFocus' @blur='textareaBlur' :disabled = "cansubmit ==1 ? false : 'disabled' "></textarea>
                        </div>
                    </li>
                </ul>

            </div>
            <!--非出科考核类型填写信息-->
            <div v-else class="seance">
                <vue-cuploader v-if="cansubmit != 0" class="add_picture" :imgList='filelist' :fdfsurl="fdfsurl" :type=2 :uploadIndex=2 :uploadflag="uploadflag" :newtype="newtype" @getFilelist="getFilelist"></vue-cuploader>
                <div v-if="cansubmit == 0" >
                    <p>现场图片：</p>
                    <div>
                        <vue-cuploader class="add_picture" :imgList='filelist' :fdfsurl="fdfsurl" :type=2 :uploadIndex=2 :uploadflag="uploadflag" :newtype="newtype" @getFilelist="getFilelist" :isupload="false" :isuploadflag="false"></vue-cuploader>
                    </div>
                </div>
                <div class="remark">
                    <p v-show="cansubmit != 0"><span style="color: red;">*</span>请注意：上传的图片中必须包含主讲的PPT和主讲人，至少上传一张图片。</p>
                    <p><span class="red" v-if="actiondetail.typename !== '小讲课' "></span>活动纪要：</p>
                    <textarea cols="30" v-model="remark" maxLength="180" placeholder="请输入现场记录" @focus='textareaFocus' @blur='textareaBlur' :disabled = "cansubmit == 1 ? false : 'disabled' "></textarea>
                </div>
                <s class="shade" v-show="show" @click=" nowurl = ' ' ; show = false"></s>
            </div>
            <!--病历讨论或教学查房加填信息-->
            <div class="case" v-show = 'caseinfoshowflag == 1'>
                <p>病例资料简介（若活动为病例讨论和教学查房，请填写以下信息）</p>
                <ul>
                    <li>
                        <label><span class="red">*</span>住院号：</label>
                        <input type="text" :disabled = "cansubmit == 1 ? false : 'disabled' " @focus='textareaFocus' @blur='textareaBlur' v-model="inpatientno">
                    </li>
                    <li>
                        <label><span class="red">*</span>床号：</label>
                        <input type="text" :disabled = "cansubmit == 1 ? false : 'disabled' " @focus='textareaFocus' @blur='textareaBlur' v-model="bedno">
                    </li>
                    <li>
                        <label><span class="red">*</span>主要诊断：</label>
                        <input type="text" :disabled = "cansubmit == 1 ? false : 'disabled' " @focus='textareaFocus' @blur='textareaBlur' v-model="maindiagnosis">
                    </li>
                </ul>
                <p><span class="red">*</span>病情简介</p>
                <div class="text-bottom remark">
                    <textarea cols="30" v-model="caseinfo" placeholder="请输入主要讨论记录及住院医发言" @focus='textareaFocus' @blur='textareaBlur' :disabled = "cansubmit == 1 ? false : 'disabled'  "></textarea>
                     <vue-cuploader v-if="cansubmit != 0" class="add_picture" :imgList='filelist' :fdfsurl="fdfsurl" :type=3 :uploadIndex=3></vue-cuploader>
                     <vue-cuploader v-if="cansubmit == 0" class="add_picture" :imgList='filelist' :fdfsurl="fdfsurl" :type=3 :uploadIndex=3 :isupload="false" :isuploadflag="false"></vue-cuploader>
                </div>
            </div>

            <!--查看考核老师-->
            <c-modal :config="selectteacher">
                <div class="flex-item class-sel-list">
                    <div class="list info-list list-inner">
                        <ul class="doctorupdata">
                            <li v-for="(val,index) in actiondetail.speakerlist" >
                                <span>
                                    <template>
                                         {{val.uname}}
                                    </template>
                                </span>
                                <!--<i  v-if="val.type !==1" class="deleteitem" @click="deletedoctor(val.id,1,val.type)">删&emsp;除</i>-->
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
                            <li v-if="actiondetail.actionplanlevel != 'hospital' " v-for="(val,index) in actiondetail.attendinfolist" >
                                <span>
                                    <template>
                                         {{val.attendbusinfo}}
                                    </template>
                                </span>
                                <!--<i  v-if="val.type !==1" class="deleteitem" @click="deletedoctor(val.id,1,val.type)">删&emsp;除</i>-->
                            </li>
                            <li v-if="actiondetail.actionplanlevel == 'hospital' ">
                                {{actiondetail.attendercount}}人
                            </li>
                        </ul>
                    </div>
                </div>
            </c-modal>

        </div>

        <!--选择出科考核类型-->
        <t-picker :config="seltype" @confirm="selecttype">

        </t-picker>
    </div>
</template>
<script>
    import $ from 'jquery'
    import cHeader from '../../header';
    import methods from '../../../methods';
    import { mapState, mapActions } from 'vuex';
    import noContent from '../../no_content.vue';
    import tPicker from '../../../components/default-picker';
    import cModal from '../../../components/modal';
    import vueCuploader from '@/components/vue_cuploader'
    export default {
        props: ['active','issubmit','cansubmit'],
        components: {
            cHeader,
            cModal,
            noContent,
            tPicker,
            vueCuploader
        },
        data() {
            return {
                fdfsurl:'',
                detailid:'',
                remark:'',
                nowurl:'',
                show:false,
                filelist:[],
                isupload:true,
                isupload2:true,
                uploadflag:'',
                len:'',//初始化已有图片
                len2:'',//初始化已有图片
                lenresult:'',
                lenresult2:'',
                description:false,
                notshow:true,
                caseinfoshowflag:'',
                maindiagnosis:'',//主要诊断
                bedno:'',//床号
                inpatientno:'',//住院号
                caseinfo:'',//病情简介
                filelistattend1:'',
                filelistattend2:'',
                //0914增
                typename:{
                    name:'',
                    order:0,
                },
                projectname:'',
                actiondetail:[],
                seltype:{
                    show:false,
                    mainlist:[],
                    valueKey:'name'
                },
                selectteacher:{
                    show:false,
                    title:'查看考核老师'
                },
                selectDoctor: {
                    show: false,
                    title: '查看被考核人员'
                },
                student:[],//参与学生
                uploadlist:[],
                newtype:'',
                ckexamshowflag:'',
                sliderImg:{},//轮播图片集
                index:'',//点击图片的序号;
                sliderVisible:"",//图片轮播幻灯片的显示
                isinputsubmit : false,
                isteacherspeak:'',
            }
        },

        watch:{
            'active': function (val, oldVal) {
                if (val) {
                    this.init()
                }
            },
            'issubmit': function (val, oldVal) {
                if (val == 1) {
                    this.init();
                    this.filelist = [];
                }
            },
            'filelist':function(val,oldval){
                if(val){
                    let a = [] ;
                    let b = [] ;
                    if(val && val.length > 0){
                        val.map(value => {
                            if(value.type == 2){
                                a.push(value)
                            }else if(value.type == 3){
                                b.push(value)
                            }
                        })
                    }
                    this.lenresult = Number(a.length);
                    this.lenresult2 = Number(b.length);
                    this.$emit('getlist',val,this.caseinfoshowflag,this.ckexamshowflag,this.isteacherspeak);
                }
            },
            'lenresult':function(val,oldval){
                this.isupload = val == 30 ? false : true;
            },
            'lenresult2':function(val,oldval){
                this.isupload2 = val == 5 ? false : true;
            },
            'remark':function(val,oldval){
                if(val){
                    this.$emit('getremark',val)
                }else {
                    this.$emit('getremark','')
                }
            },
            'inpatientno':function(val,oldval){
                if(val){
                    this.$emit('inpatientno',val)
                }else {
                    this.$emit('inpatientno','')
                }
            },
            'bedno':function(val,oldval){
                if(val){
                    this.$emit('bedno',val)
                }else {
                    this.$emit('bedno','')
                }
            },
            'maindiagnosis':function(val,oldval){
                if(val){
                    this.$emit('maindiagnosis',val)
                }else {
                    this.$emit('maindiagnosis','')
                }
            },
            'caseinfo':function(val,oldval){
                if(val){
                    this.$emit('caseinfo',val)
                }else {
                    this.$emit('caseinfo','')
                }
            },
            'student':function(val,oldval){
                if(val.length == 0){
                    this.selectDoctor.show = false;
                }
            },
            'typename.order':function(val,oldval){     //出科考核类型
                if(oldval && val != oldval){
                    this.filelist = [];
                };
                if(val){
                    this.$emit('ckkey',val)
                }else {
                    this.$emit('ckkey','')
                }
            },
            'projectname':function(val,oldval){
                if(val && this.typename.order == 1){
                    if(val){
                        this.$emit('projectname',val)
                    }else{
                        this.$emit('projectname','')
                    }
                }
            },
        },
        created() {
            this.detailid = this.$route.query.id;
        },
        mounted() {
            this.initactionplandetail();
            this.init();
            this.inittypelist();
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

            //获取出科考核类型
            inittypelist(){
                let self=this;
                this.post('/turnbaseinfo/turnbaseinfolevel',{
                    command: 'turnbaseinfo/turnbaseinfolevel',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    code:'actionplancktype',
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
            //选择出科考核类型
            selecttype(data){
                this.typename = data ;
                this.seltype.show = false ;
            },
            //获取详情
            initactionplandetail(){
                let self = this;
                this.post('/actionplan/getactionplandetail',{
                    command:'actionplan/getactionplandetail',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    uid:$.cookie('uid'),
                    actionplanid:self.detailid,
                    clientflag:1
                }).done( res => {
                    self.actiondetail = res.bean;
                    if(res.bean.type == 610){
                        self.isteacherspeak = 1;
                    }
                });
            },

            init(){
                let self = this;
                let _temporarysave = '';
                this.post('/actionplan/getuploadpicinfo',{
                    command:'actionplan/getuploadpicinfo',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    actionplanid:self.detailid,
                }).done( res => {
                    self.fdfsurl = res.fdfsurl;
                    self.caseinfoshowflag = res.bean.caseinfoshowflag;
                    self.ckexamshowflag = res.bean.ckexamshowflag;
                    self.filelist = [];
                    self.filelistattend1 = [];
                    self.filelistattend2 = [];
                    self.len = '';
                    self.len2 = '';
                    self.description = false;
                    self.uploadflag = res.bean.uploadflag;
                    self.remark = res.bean.description;
                    self.inpatientno = res.bean.inpatientno;
                    self.bedno = res.bean.bedno;
                    self.maindiagnosis = res.bean.maindiagnosis;
                    self.caseinfo = res.bean.caseinfo;
                    self.typename.order = res.bean.cktype;
                    self.typename.name = res.bean.cktypename;
                    self.projectname = res.bean.ckproname;
                    self.notshow = !res.bean.description && !res.bean.inpatientno && !res.bean.bedno && !res.bean.maindiagnosis && !res.bean.caseinfo && !res.bean.piclist ? true : false ;
                    _temporarysave = res.bean.temporarystorageflag;
                    if(res.bean.piclist && res.bean.piclist.length > 0){
                        let _filelist = res.bean.piclist;
                        _filelist.map(val => {
                            self.filelist.push({fileurl:val.fileurl,type:val.type})
                            if(val.type == 2){
                                self.filelistattend1.push({fileurl:val.fileurl,type:val.type})
                            }else if(val.type == 3){
                                self.filelistattend2.push({fileurl:val.fileurl,type:val.type})
                            }
                        })
                    }
                    self.len = self.filelistattend1.length;
                    self.len2 = self.filelistattend2.length;

                    if(self.len >= 30){
                        this.isupload = false
                    }

                    if(self.len2 >= 5){
                        this.isupload2 = false
                    }
                    if(self.uploadflag != 1){
                        self.description = true;
                    }
                    this.$nextTick(function(){
                        $('textarea').each(function () {
                            $(this).css('height', $(this).prop('scrollHeight') + 'px')
                            $(this).on('input', function () {
                                this.style.height = 'auto'
                                this.style.height = this.scrollHeight + 'px'
                            })
                        })
                    })

                    this.$emit('maxrole',{uploadflag:self.uploadflag,temporarysave:_temporarysave});
                });

            },
            deletepic(param){
                // this.nowurl = param;
                // this.show = true ;
                this.sliderVisible=true;
            },
            deleteitems(param){
                let self= this;
                this.showConfirm({
                    title: '温馨提示',
                    msg: '您是否要删除当前上传的图片？',
                    theme: 'modal-confirm modal-white',
                    cancel: function () {},
                    ok: function () {
                        if(self.filelist){
                            self.filelist.map((value,index) => {
                                if(value.fileurl == param){
                                    self.filelist.splice(index, 1);
                                }
                            })
                        }
                    },
                })
            },
            // 获取组件传递过来的filelist数组
            getFilelist(val){
                this.filelist=val;
            },
            uploadimg(param){
                console.log("1111111")
                if(this.uploadflag == 1){
                    if(param == 1){
                        this.invokeNative('TakeAndUploadPhoto',{ currentImg: this.filelist.length },this.geturl)
                    } else {
                        this.newtype = param;
                        this.invokeNative('TakeAndUploadPhoto',{ currentImg: this.filelist.length },this.geturlcase)
                    }
                }else if(this.uploadflag == 2){
                    this.toast('当前计划尚未到记录时间~')
                }else if(this.uploadflag == 3){
                    this.toast('当前计划已超过记录时间~')
                }
            },
            geturl(data){
                let me = JSON.parse(data);
                if(me.status == 1){
                    this.filelist.push({fileurl:me.uri,type:2});
                }else if(me.status == 0){
                    this.toast('上传失败！')
                }
            },
            geturlcase(data){
                let me = JSON.parse(data);
                if(me.status == 1){
                    this.filelist.push({fileurl:me.uri,type:this.newtype});
                }else if(me.status == 0){
                    this.toast('上传失败！')
                }
            },
            textareaFocus(){
                $('.g-main').css("padding-bottom",'6rem')
            },
            textareaBlur(){
                $('.g-main').css("padding-bottom",'0')
            },
        }
    }
</script>
<style lang="scss" scoped>
    .upload {
        display: flex;
        border-bottom: 1px solid #eee;
        .icon {
            display: inline-block;
            margin: 0.2rem;
            width: 1rem;
            height: 1rem;
            background: url("../../../assets/images/addpicture.png") 0 0 no-repeat;
            background-size: 100% 100%;
        }
        span {
            width: 1.4rem;
            text-align: center;
        }
    }
    img {
        width: 1rem;
        height: 1rem;
        margin: 0.2rem;
        background: #fff;
        border-radius: 10px;
    }
    .imgitem {
        display: inline-block;
        position: relative;
        z-index: 100;
        i {
            display: inline-block;
            width: 1rem;
            height: 1rem;
            position: absolute;
            top: 0.2rem;
            left: 0.2rem;
            background: rgba(255,255,255,0.3);
            border-radius: 10px;
            span {
                width: 100%;
                height: 50%;
                line-height: 0.5rem;
                text-align: center;
                color: #333;
                font-weight: bold;
            }
            span:first-child {
                border-bottom: 1px solid #eee;
            }
        }
    }
    .remark {
        color: #666;
        p {
            margin: 0.1rem 0;
            line-height: 0.5rem;
        }
        p:first-child {
            line-height: 0.3rem;
            font-size: .25rem;
        }
        textarea{min-height: 1rem!important;padding: 0.1rem;}
    }
    textarea {
        display: inline-block;
        width: 100%;
        min-height:.2rem;
        border: 1px solid #eee;
        margin: 0 0 0.2rem;
      //  padding: 0.1rem;
        background: #F8F8F8;
    }
    .text-bottom textarea {
        display: inline-block;
        width: 100%;
        min-height:.4rem;
        border: 1px solid #eee;
        margin: 0 0 0.2rem;
        //  padding: 0.1rem;
        background: #F8F8F8;
    }
    .shade {
        height: 100%;
        width: 100%;
        min-width: 100%;
        min-height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
    }
    .imglist {
        display: flex;
        flex-direction: row;
        flex-wrap:wrap;
    }
    .pic {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        z-index: 1000;
        top: 0;
        left: 0;
        background:rgba(0,0,0,0.2);
        img {
            width: 80vw;
            height: auto;
            z-index: 101;
        }
    }
    i.del {
        display: inline-block;
        width: 0.35rem;
        height: 0.35rem;
        background: url("../../../assets/images/delete.png") 0 0 no-repeat;
        background-size: 100% 100%;
        position: absolute;
        top: 0.1rem;
        left: 1rem;
    }
    .seance {
        background: #fff;
        padding: .2rem;
    }
    .case {
        padding: .2rem;
        background: #fff;
        color:#666;
        li {
            display: flex;
            label {
                flex: 1;
                line-height: .6rem;
            }
            input {
                flex: 3;
                line-height: .6rem;
                border-bottom: 1px solid #aaa;
            }
        }
    }
    .red{
        color: red;
    }
    .main {
        background-color: #F8F8F8;
        margin-top:0.1rem;
        padding-bottom: 0.6rem;
        li{
            position: relative;
            background-color: #fff;
            margin: .1rem;
            padding: .1rem 0;
        }
        /*li:nth-child(3) , li:nth-child(5) , li:nth-child(8){
            border-bottom: 1px solid #eee;
            margin-bottom:0
        }
        li:last-child {
            height:1.6rem;
            display:flex;
            align-items:center;
        }*/
    }
    .choice:after {
        content:'';
        display:inline-block;
        width:0.3rem;
        height:0.3rem;
        background: url("../../../assets/images/you-jiantou.png") 0 0 no-repeat;
        background-size:100% 100%;
        position: absolute;
        right: 0.3rem;
        top: 0.15rem;
    }
    .doctorupdata {
        background-color: #F8F8F8 ;
        li {
            margin: .2rem 0;
            background: #fff;
            padding: .2rem;
        }
    }
</style>
