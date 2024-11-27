<template>
    <div class="g-wrapper">
        <c-header  v-if="!issignatureshow">
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            <p>{{examitemname}}</p>
        </c-header>
        <div class="top" v-if="!issignatureshow">

            <!--<div class="cw-count" @touchstart.stop="keyboardFn('bed')">分管床位数：-->
                <!--<p >{{bedcount}}</p>-->
            <!--</div>-->
            <div class="score"  v-if="!isHasComment">
                <div class="left">
                    <p>总分：{{defaultscore}}分</p>
                </div>
                <div class="right" @touchstart.stop="keyboardFn('score')">
                    <p>得分：{{customscore}}</p>
                    <span>
                         <img src="../../assets/images/bnt_xiangyou.png"  >
                    </span>
                </div>
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
                    <score-item v-for="(item,i) of itemlist" :datalist="item" :key="i" @get_result_all="get_result_all" ></score-item>
                </div>
                <div class="comment">
                    <p>评语：</p>
                    <div class="textarea_box">
                        <textarea v-model="comment" @focus='textareaFocus()' @blur='textareaBlur()'></textarea>
                    </div>
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
        props:{
            examitemid:{},
            examitemname:{}
        },
        data(){
            return {
                issignatureshow:false,//签名页面展示
                comment:"",
                isHasComment:false,
                keyboardshow:false,
                itemlist:[],
                totalscore:0,
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
            }
        },
        mounted(){
            this.init();
            this.getdefalutscore();
            this.registerToNative('goBack', function (data) {
                self.back()
            });
        },
        watch:{
            totalscore(val){
                this.datalist.score=val+'分';
            },
        },
        methods:{
            ...methods,
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
            //床位数目
            keyboardFn(param){
                this.numberdistinction=param;
                this.keyboardshow=true;
            },
            getInfo(param){
                this.issignatureshow=param;
            },
            //获取评分表
            init(){
                this.loading=true;
                this.post('/turnannualresult/queryinfoitem',{
                    command: 'turnannualresult/queryinfoitem',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    examitemid:this.examitemid
                }).done(res => {
                    this.loading=false;
                    if(res&&res.errcode==0){
                        this.loading=false;
                        this.itemlist=res.list;
                        if(this.itemlist.length==0){
                            this.isHasComment=false;
                        }else{
                            this.isHasComment=true;
                        }
                        this.gettotalscore();
                    }else if(res.errdesc){
                        this.$toast(res.errdesc)
                    }else {
                        this.$toast('服务器错误，请联系管理员。')
                    }
                });
            },
            submitItem(){//提交评分项
                if(!this.comment){
                    this.$toast("请填写评语");
                    return;
                }
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
               this.$emit('setPreviewVisible',false);
            },
            onInput(value) {
                if(this.numberdistinction=='score'){
                    this.customscore = (this.customscore + value).slice(0, 6);
                    if(this.customscore>=105){
                        this.customscore=105;
                    }
                }

            },
            onDelete(value){
                this.customscore=String(this.customscore);
                this.customscore = this.customscore.slice(0, this.customscore.length - 1);
            },
            stringToArray(inputString) {
                const array = inputString.split(',');
                return array;
            },
            submit(signature){
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
                }else{
                    if(!this.customscore){
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
                        total:this.customscore,
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
    .g-wrapper{
        position: fixed;
        top:0;
        left: 0;
        width: 100%;
        z-index: 10000;
        background: #fff;
    }
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
                padding-right:0.2rem;
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
                height: 1rem;
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
</style>
