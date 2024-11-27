<template>
    <div class="g-wrapper">
        <c-header  v-if="!issignatureshow">
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            <p class="nav-title" :class="{bigT:$route.query.examitemname.length>8}">{{$route.query.examitemname}}</p>
            <div slot="headerRight" v-if="!$route.query.detail">
                <span style="font-size: 0.3rem" @click="submitItem" :class="{noclick:issubmit}">提交</span>
            </div>
            <div slot="headerRight" v-if="$route.query.detail">
                <span style="font-size: 0.3rem" @click="submitModify" :class="{noclick:issubmit}">提交</span>
            </div>
        </c-header>
        <sig-nature v-if="issignatureshow" :datalist="datalist" @getInfo="getInfo" @getsubmit="submit"></sig-nature>
        <div class="top" v-if="!issignatureshow">
            <ul>
                <li><label for="">姓名：</label>{{datalist.name}}</li>
                <li><label for="">护培学号：</label>{{datalist.username}}</li>
                <li><label for="">专业基地：</label>{{datalist.userbasename}}</li>
                <li><label for="">科室/病区：</label>{{datalist.turnofficename}}</li>
                <li><label for="">轮转周期：</label>{{datalist.begindate}}——{{datalist.enddate}}</li>
            </ul>
            <div class="score"  v-if="!isHasComment">
                <div class="left">
                    <p>总分：{{defaultscore}}分</p>
                    <p>附加分：5分</p>
                </div>
                <div class="right" @touchstart.stop="keyboardFn('score')">
                    <p>得分：{{totalscore}}</p>
                    <span>
                         <img src="../../assets/images/bnt_xiangyou.png"  >
                    </span>
                </div>
            </div>
            <div class="noComment"  v-if="isHasComment">
                <p>总分：{{initscore}}分</p>
                <p class="score-zdy">
                    <span>得分：</span>
                    <span>
                        {{totalscore}}分
                    </span>

                </p>
            </div>
        </div>
        <!--数字键盘-->
        <van-number-keyboard
            :show="keyboardshow"
            close-button-text="完成"
            @blur="keyboardshow = false"
            @input="onInput"
            extra-key="."
            @delete="onDelete"
        />
        <div class="g-main">
            <van-loading color="#1989fa" v-if="loading"/>
            <div class="score-content"  v-if="!loading">
                <div class="scoreItem reset">
                    <score-item v-for="(item,i) of itemlist" :datalist="item" :key="i" @get_result_all="get_result_all" :step="step" ></score-item>
                </div>
                <div class="comment">
                    <p>评语：</p>
                    <div class="textarea_box">
                        <textarea v-model="comment" @focus='textareaFocus()' @blur='textareaBlur()'></textarea>
                    </div>
                </div>
                <img :src="imgurl" alt="">
                <div class="signature-btn"  @click="submitItem">
                    <!-- <button id="clearCanvas" ref="clearCanvas" style="margin-left:0.2rem" @click="submitItem">重新签名</button> -->
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import $ from 'jquery'
    import cHeader from '@/views/header'
    import methods from '@/methods'
    import { mapState,mapActions } from 'vuex'
    import scoreItem from './components/scoreItem'
    import sigNature from './signature'
    export default {
        name: "scoreSheet",
        components:{
            cHeader,
            scoreItem,
            sigNature
        },
        data(){
            return {
                issignatureshow:false,//签名页面展示
                comment:"",
                isHasComment:false,
                keyboardshow:false,
                itemlist:[],
                totalscore:'',
                customscore:'',
                initscore:0,
                loading:false,
                issubmit:false,
                itemlistL:[],
                info:{},
                examstarttime:'',
                examendtime:'',
                number:[],
                datalist:{score:''},
                defaultscore:0,
                numberdistinction:'',
                bedcount:'',
                step:0,
                detailinfo:{},
                imgurl:''
            }
        },
        mounted(){
            if(!this.$route.query.detail){
                this.init();
            }else{
                this.getscoresheetdetail();
            }
            this.getdefalutscore();
            this.stdInfo();
            this.getStep();
            this.getDetailInfo();
            this.examstarttime=this.getTime();//考官评分开始时间

        },
        watch:{
            totalscore(val){
                this.datalist.score=val+'分';
            },
            itemlist(val){

            }
        },
        methods:{
            ...methods,
            submitModify(){
              this.submit(this.detailinfo.imgurl);
            },
            getscoresheetdetail(){
                let self=this;
                this.post('/turnExamInfo/querystuitemgradescorelist',{
                    command: 'turnExamInfo/querystuitemgradescorelist',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    stuid:this.$route.query.examineeid,
                    examid:this.$route.query.examid,
                    examitemid:this.$route.query.examitemid
                }).done(res => {
                    if (res && res.errcode == 0) {
                         res.itemscorelist.map((item,index)=>{
                            if(item.examinerid==$.cookie('uid')){
                                if(item.examinerid==$.cookie('uid')){
                                    self.detailinfo=item;
                                }
                                self.comment=self.detailinfo.comment;
                                self.imgurl=self.detailinfo.signature;
                                //查询考官已评分的数据
                                this.post('/turnExamInfo/queryturnexamscore',{
                                    command: 'turnExamInfo/queryturnexamscore',
                                    sessionid:$.cookie('sid'),
                                    loginid:$.cookie('uid'),
                                    turnexamscoreid:item.turnexamscoreid
                                }).done(res => {
                                    this.loading=false;
                                    if (res && res.errcode == 0) {
                                         self.itemlist=res.itemlist
                                         self.totalscore=res.total;
                                         self.itemlist.map(item=>{
                                             item.value.map(inneritem=>{
                                                 self.$set(inneritem,'gradeitemscore',Number(inneritem.score))
                                             })
                                         })
                                    } else if (res.errdesc) {
                                        this.toast(res.errdesc)
                                    } else {
                                        this.toast('服务器错误，请联系管理员。')
                                    }
                                })
                            }
                         });
                    } else if (res.errdesc) {
                        this.toast(res.errdesc)
                    } else {
                        this.toast('服务器错误，请联系管理员。')
                    }
                })
            },
            getStep(){
                this.post('/commparaconf/querycommparaconflist',{
                    command: 'commparaconf/querycommparaconflist',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    paramcode:'turnexam_gradetype'
                }).done(res => {
                    if(res&&res.errcode==0){
                          this.step=Number(res.commparaconflist[0].param1);
                    }else if(res.errdesc){
                        this.$toast(res.errdesc)
                    }else {
                        this.$toast('服务器错误，请联系管理员。')
                    }
                })
            },
            stdInfo(){
                this.post('/turnExamInfo/queryexamineeinfo',{
                    command: 'turnExamInfo/queryexamineeinfo',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    examineeid:this.$route.query.examineeid,
                    examId:this.$route.query.examId,
                }).done(res => {
                    if(res&&res.errcode==0){
                      this.datalist.name=res.name;
                      this.$set(this.datalist,'username',res.username);
                      this.$set(this.datalist,'userbasename',res.userbasename);
                      this.$set(this.datalist,'turnofficename',res.turnofficename);
                      this.$set(this.datalist,'begindate',res.begindate);
                      this.$set(this.datalist,'enddate',res.enddate);
                    }else if(res.errdesc){
                        this.$toast(res.errdesc)
                    }else {
                        this.$toast('服务器错误，请联系管理员。')
                    }
                });
            },
            //床位数目
            keyboardFn(param){
                this.numberdistinction=param;
                this.keyboardshow=true;
            },
            getInfo(param){
                this.issignatureshow=param;
            },
            getdefalutscore(){
                this.post('/commparaconf/querycommparaconflist',{
                    command: 'commparaconf/querycommparaconflist',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    paramcode:'turnexam_default_fullscore'
                }).done(res => {
                    if(res&&res.errcode==0){

                        this.defaultscore=res.commparaconflist[0].paramvalue;
                    }else if(res.errdesc){
                        this.$toast(res.errdesc)
                    }else {
                        this.$toast('服务器错误，请联系管理员。')
                    }
                })
            },
            //获取评分表
            init(){
                let self=this;
                this.loading=true;
                this.post('/turnannualresult/queryinfoitem',{
                    command: 'turnannualresult/queryinfoitem',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    examitemid:this.$route.query.examitemid
                }).done(res => {
                    this.loading=false;
                    if(res&&res.errcode==0){
                        this.loading=false;
                        this.itemlist=res.list;
                        if(this.itemlist.length==0){
                            this.isHasComment=false;
                            // this.getdefalutscore();
                        }else{
                            this.isHasComment=true;
                        }

                    }else if(res.errdesc){
                        this.$toast(res.errdesc)
                    }else {
                        this.$toast('服务器错误，请联系管理员。')
                    }
                });
            },
            getDetailInfo(){
                this.post('/turnannualresult/queryinfoitem',{
                    command: 'turnannualresult/queryinfoitem',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    examitemid:this.$route.query.examitemid
                }).done(res => {
                    this.loading=false;
                    if(res&&res.errcode==0){
                        this.loading=false;
                        this.itemlist=res.list;
                        if(this.itemlist.length==0){
                            this.isHasComment=false;
                            // this.getdefalutscore();
                        }else{
                            this.isHasComment=true;
                            this.gettotalscore();
                        }
                    }else if(res.errdesc){
                        this.$toast(res.errdesc)
                    }else {
                        this.$toast('服务器错误，请联系管理员。')
                    }
                });
            },
            submitItem(){//提交评分项
                this.issignatureshow=true;
            },
            get_result_all(){
                this.gettotalscore();
            },
            gettotalscore(){
                this.totalscore=0;
                this.initscore=0;
                this.itemlist.map(item=>{
                    item.value.map(item=>{
                        this.totalscore+=Number(item.gradeitemscore);
                        this.initscore+=Number(item.maxscore);
                    })
                });
            },
            getAllItems(){
                this.itemlistL=[];
                this.itemlist.map(item=>{
                    item.value.map(item=>{
                        this.itemlistL.push({score:item.gradeitemscore,infoitemid:item.infoitemid})
                    })
                });
            },
            back(){
              window.history.back();
            },
            onInput(value) {
                if(this.numberdistinction=='score'){
                    this.totalscore = (this.totalscore + value).slice(0, 6);
                    if(this.totalscore>=105){
                        this.totalscore=105;
                    }
                }
                if(this.numberdistinction=='bed'){
                    this.bedcount = (this.bedcount + value).slice(0, 6);
                }

            },
            onDelete(value){
                this.totalscore=String(this.totalscore);
                this.totalscore = this.totalscore.slice(0, this.totalscore.length - 1);
            },
            stringToArray(inputString) {
                const array = inputString.split(',');
                return array;
            },
            submit(signature){
                if(!signature){
                    signature=this.imgurl;
                }
                if(this.totalscore===''){
                    this.$toast('请填写得分');
                    return;
                }
                let tempTotal = this.isHasComment ? this.initscore : (Number(this.defaultscore) + 5)
                if(Number(this.totalscore)>tempTotal){
                    this.$toast("分数不能大于总分");
                    return ;
                }
                if(!this.comment){
                    this.$toast("请填写评语");
                    return;
                }
                this.issubmit=true;
                this.$toast('正在提交...');
                this.examendtime=this.getTime();//评分结束时间
                if(this.isHasComment){
                    this.getAllItems();//获取评分项
                    if(!this.comment){
                        this.$toast("请输入评语");
                    }
                    let seiIds = []
                    if(typeof(this.$route.query.seiid) === "string") {
                        seiIds = this.stringToArray(this.$route.query.seiid)
                    }else {
                        seiIds = this.$route.query.seiid
                    }
                    this.post('/turnExamInfo/submitturnexamscore',{
                        command: 'turnExamInfo/submitturnexamscore',
                        sessionid:$.cookie('sid'),
                        loginid:$.cookie('uid'),
                        endtime: this.examendtime,
                        begintime:this.examstarttime,
                        examitemid:this.$route.query.examitemid,
                        examid:this.$route.query.examid,
                        examinerid:$.cookie('uid'),
                        signature:signature,
                        examid:this.$route.query.examid,
                        comment:this.comment,
                        examineeid:this.$route.query.examineeid,
                        itemlist:this.itemlistL,
                        total:this.totalscore,
                        // seiid:this.$route.query.seiid,
                        seiIds:seiIds
                    }).done(res => {
                        this.loading=false;
                        this.issubmit=false;
                        if(res&&res.errcode==0){
                            window.history.back();
                        }else if(res.errdesc){
                            this.$toast(res.errdesc)
                        }else {
                            this.$toast('服务器错误，请联系管理员。')
                        }
                    });
                }else{
                    if(this.totalscore===''){
                        this.$toast("请输入得分");
                        return;
                    }
                    if(!this.comment){
                        this.$toast("请输入评语");
                        return;
                    }
                    let seiIds = []
                    if(typeof(this.$route.query.seiid) === "string") {
                        seiIds = this.stringToArray(this.$route.query.seiid)
                    }else {
                        seiIds = this.$route.query.seiid
                    }
                    this.post('/turnExamInfo/submitturnexamscore',{
                        command: 'turnExamInfo/submitturnexamscore',
                        sessionid:$.cookie('sid'),
                        loginid:$.cookie('uid'),
                        endtime: this.examendtime,
                        begintime:this.examstarttime,
                        examitemid:this.$route.query.examitemid,
                        examid:this.$route.query.examid,
                        examinerid:$.cookie('uid'),
                        signature:signature,
                        examid:this.$route.query.examid,
                        comment:this.comment,
                        examineeid:this.$route.query.examineeid,
                        total:this.totalscore,
                        seiid:seiIds
                    }).done(res => {
                        this.loading=false;
                        this.issubmit=false;
                        if(res&&res.errcode==0){
                            window.history.back();
                        }else if(res.errdesc){
                            this.$toast(res.errdesc)
                        }else {
                            this.$toast('服务器错误，请联系管理员。')
                        }
                    });
                }

            }
        }

    }
</script>

<style scoped lang="scss">
    @import "../../scss/mixin.scss";
    div.top{
        background: $bgColor;
        font-size:0.22rem;
        border-bottom:1px solid $borderColor;
        .cw-count{
            height: 0.6rem;
            margin-top:0.2rem;
            padding: 0.2rem;
            background: #fff;
            border-bottom:1px solid $borderColor;
            display: flex;
            flex-flow: row nowrap;
            p{
                flex:1;
                height: 100%;
                text-align: right;
            }
        }
        .noComment{
            background: #fff;
            display: flex;
            flex-flow: row nowrap;
            p{
                height: 0.6rem;
                line-height: 0.6rem;
                padding: 0 0.2rem;
                border-bottom: 1px solid $borderColor;
                flex:1
            }
            p.score-zdy{
                display:flex;
                justify-content:flex-end;
                align-items: center;
                img{width: 0.3rem;height: 0.3rem;vertical-align: middle;}
                span{
                    margin-left:0.1rem;
                }
            }
        }
        .score{
            background:#fff;
            margin-top:0.2rem;
            display:flex;
            flex-flow:row;
            img{
                width: 0.3rem;
                height:0.3rem;
            }
            &>div{
                flex:1;
                height: 0.6rem;
                justify-content: space-around;
            }
            &>div.left{
                display:flex;
                flex-flow:row nowrap;
                justify-content: space-around;
                p{
                    flex:1;
                    margin: 0;
                    padding-left:0.2rem;
                    display:flex;
                    align-items: center;
                }
            }
            &>div.right{
                display: flex;
                align-items: center;
                justify-content: flex-end;
                p{padding-right: 0.2rem;}
                padding-right: 0.2rem;
            }


        }
        ul{
            display: flex;
            background: #fff;
            flex-flow:row wrap;
            padding:0.2rem;
            border-bottom:1px solid $borderColor;
            li{
                width: 50%;
                font-size: 0.22rem;
                display: flex;
                margin-bottom: 10px;
                label{
                    min-width: 70px;
                    text-align: right;
                }
                justify-content:left;
            }
            li:nth-child(2n){
                justify-content: flex-end;
            }
            li:nth-last-child(1){
                width: 100%;
            }
        }
    }
    .score-content{
        .comment{
            background: #fff;
            padding: 0.2rem;
            .textarea_box{
                border:1px solid $borderColor;
                height: 1.5rem;
                padding: 0.2rem;
            }
        }

    }
    .nav-title.bigT{
        font-size:0.22rem;
        word-break: break-all;
        width: 50%;
        margin: 0;

    }
    .signature-btn{
        display:flex;
        justify-content: flex-end;
        border:none;
        margin-top:0.2rem;
        padding: 0.2rem;
        padding-bottom: 0.4rem;
        button{
            padding: 0.1rem;
            border:1px solid $activeColor;
            text-align: center;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
            color:$activeColor;
            border-radius: 5px;
            background:#fff;

        }
    }
</style>
