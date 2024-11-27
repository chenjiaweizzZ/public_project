<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
           {{$route.query.typename}}
        </c-header>
        <div class="top">
            <ul>
                <li><label for="">姓名：</label>{{stdinfo.name}}</li>
                <li><label for="">护培学号：</label>{{stdinfo.username}}</li>
                <li><label for="">专业基地：</label>{{stdinfo.userbasename}}</li>
                <li><label for="">科室/病区：</label>{{stdinfo.deptname}}</li>
                <li><label for="">轮转周期：</label>{{stdinfo.begindate}}-{{stdinfo.enddate}}</li>
            </ul>
            <div class="score">
                <div class="left">
                    <p>{{$route.query.typename}}平均分： </p>
                </div>
                <div class="right">
                    <p>{{averagescore}}分</p>
                </div>
            </div>
            <div class="scoreitemslist">
                <div v-for="(item,index) of scoreitemlist" class="scoreitems"  :class="{active:itemIndex==index}" :key="index" @click.stop="getItemscore(index)">
                    <!-- <p>{{$route.query.type==2 ? '出科考核综合':item.examitemname}}</p> -->
                    <p>{{item.examitemname}}</p>
                    <p v-if="item.score">{{item.score}}分</p>
                    <p v-else>&nbsp</p>
                </div>
            </div>
        </div>
        <!--单项评分列表-->
        <div class="score-content">
            <van-loading color="#1989fa" v-if="loading"/>
            <div class="score-list" v-if="!loading">
                <ul class="title">
                    <li>考官</li>
                    <li style="padding-right: 0.5rem">评分</li>
                </ul>
                <ul class="list-content" v-for="(item,i) in itemNewOrderScoreList" :key="i">
                    <li>{{item.examinername}}({{item.examinercode}})</li>
                    <li class="pf">{{item.score}}  <img src="../../assets/images/bnt_xiangyou.png"  @click="enterSheetDetail(item)" v-if="item.status"></li>
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
    import Vue from 'vue'
    import cHeader from '@/views/header'
    import methods from '@/methods'
    import { mapState,mapActions } from 'vuex'
    export default {
        name: "assessmentpagerelation",
        data(){
          return{
              loading:true,
              scorelist:[],
              scoreitemlist:[],
              averagescore:0,
              scoredata:{},
              itemIndex:0,
              stdinfo:{},
              itemGradeScoreList:[],
              newOrderScoreList:[],
              itemNewOrderScoreList:[],

          }
        },
        components:{
            cHeader,
        },
        mounted(){
            this.registerToNative('goBack', function (data) {
                this.back()
            });
            this.getStdInfo();
            this.getaveragescore(this.$route.query.type);
            console.log(this.scoreitemlist)

        },
        computed:{
            average(){
               let averagescore=0;
               let totalscore=0;
               for(let i of this.scorelist){
                   console.log(i)
                   totalscore+=i.score
               }
               return (totalscore/this.scorelist.length).toFixed(1);
            }
        },
        methods:{
            ...methods,
            getaveragescore(){
                this.post('/turnExamInfo/querystuscorebyseiid',{
                    command: 'turnExamInfo/querystuscorebyseiid',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    seiid:this.$route.query.seiid
                }).done(res => {
                    this.loading=false;
                    let data;
                    res.stuscores.map((item)=>{
                        if(item.examtype==this.$route.query.type){
                            data=item;
                        }
                    })
                    this.averagescore=data.score;
                    this.scoreitemlist=data.itemscorelist;
                    this.itemGradeScoreList=data.itemGradeScoreList;
                    for(let  i=0;i<this.scoreitemlist.length;i++){
                        this.$set(this.newOrderScoreList,i,[]);
                        for(let j=0;j<this.itemGradeScoreList.length;j++){
                            if(this.scoreitemlist[i].examitemid==this.itemGradeScoreList[j].examitemid){
                                this.newOrderScoreList[i].push({
                                    examinercode:this.itemGradeScoreList[j].examinercode,
                                    examinerid:this.itemGradeScoreList[j].examinerid,
                                    examinername:this.itemGradeScoreList[j].examinername,
                                    examitemid:this.itemGradeScoreList[j].examitemid,
                                    score:this.itemGradeScoreList[j].score,
                                    signature:this.itemGradeScoreList[j].signature,
                                    status:this.itemGradeScoreList[j].status,
                                    turnexamscoreid:this.itemGradeScoreList[j].turnexamscoreid,

                                })
                            }
                        }
                    }
                    this.itemNewOrderScoreList=this.newOrderScoreList[0];
                    if (res && res.errcode == 0) {
                    } else if (res.errdesc) {
                        this.$toast(res.errdesc)
                    } else {
                        this.toast('服务器错误，请联系管理员。')
                    }
                })
            },
            // 获取每项平均分老师评分
            getItemscore(index){
                this.itemNewOrderScoreList=this.newOrderScoreList[index];
                this.scorelist=[];
                this.itemIndex=index;
            },
            init(index){
                this.loading=true;
                this.post('/turnExamInfo/querystuitemgradescorelist',{
                    command: 'turnExamInfo/querystuitemgradescorelist',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    stuid:this.scoredata.stuid,
                    examid:this.$route.query.examid,
                    examitemid:this.scoreitemlist[index].examitemid
                }).done(res => {
                    this.loading=false;
                    if (res && res.errcode == 0) {
                        this.scorelist=res.itemscorelist;
                    } else if (res.errdesc) {
                        this.toast(res.errdesc)
                    } else {
                        this.toast('服务器错误，请联系管理员。')
                    }
                })
            },
            getStdInfo(){
                this.post('/turnExamInfo/queryexamineeinfo',{
                    command: 'turnExamInfo/queryexamineeinfo',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    examineeid:Number(this.$route.query.stuid),
                    examId: this.$route.query.examId
                }).done(res => {
                    this.loading=false;
                    if (res && res.errcode == 0) {
                        this.stdinfo=res;
                    } else if (res.errdesc) {
                        this.toast(res.errdesc)
                    } else {
                        this.toast('服务器错误，请联系管理员。')
                    }
                })
            },
            enterSheetDetail(item){
                this.$router.push({
                    name: 'assessmentdetail',
                    path:'/extranceExam/assessmentdetail',
                    query:{
                        turnexamscoreid:item.turnexamscoreid,
                        stuid:this.$route.query.stuid,
                        examinername:item.examinername,
                        signature:item.signature,
                        examitemname:this.$route.query.typename
                    }
                })
            },
            back(){
                window.history.back();
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../scss/mixin.scss";
    div.g-wrapper{
        background: #fff;
    }
    .scoreitemslist{
        overflow-x:auto;
        font-size:0;
        white-space: nowrap;
        background:#fff;
        .scoreitems{
            padding: 0.1rem 0;
            display:inline-block;
            font-size:0.24rem;
            width:33.33%;
            text-align: center;
            p{
                margin-bottom:0;
            }
        }
        .scoreitems.active{
            color:#3499db
        }

    }
    div.top{
        background: $bgColor;
        font-size:0.24rem;
        border-bottom:1px solid $borderColor;

        .cw-count{
            height: 0.6rem;
            margin-top:0.2rem;
            padding: 0.2rem;
            background: #fff;
        }
        .noComment{
            background: #fff;
            p{
                height: 0.6rem;
                line-height: 0.6rem;
                padding: 0 0.2rem;
                border-bottom: 1px solid $borderColor;
            }
            p.score-zdy{
                display:flex;
                justify-content: space-between;
                span{margin-top:0.1rem}
                img{width: 0.3rem;height: 0.3rem;vertical-align: middle;}
            }
        }
        .score{
            background:#fff;
            margin-top:0.2rem;
            display:flex;
            flex-flow:row;
            margin-bottom: 0.2rem;
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
            li:nth-last-child(1){
                width: 100%;
            }
        }
    }
    div.score-list{
        ul.title{
            display:flex;
            li{
                flex:1;
                height:0.6rem;
                display: flex;
                justify-content:center;
                align-items:center;
                background: $bgColor;
            }
            li:nth-child(2){
                justify-content:flex-end;
            }
        }
        ul.list-content{
            display: flex;
            li{
                flex:1;
                display:flex;
                justify-content: center;
                align-items:center;
                height: 0.6rem;
                border-bottom: 1px solid $borderColor;
                font-size:0.22rem;
            }
            li.pf{
                display:flex;
                justify-content:flex-end;
                align-items:center;
                height: 0.6rem;
                padding-right: 0.2rem;

                img{
                    width: 0.3rem;
                    height: 0.3rem;
                    margin-left:0.2rem;
                }
            }
        }
    }
</style>
