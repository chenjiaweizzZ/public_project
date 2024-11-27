<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            <p  class="title-top" :class="{long:$route.query.examitemname.length>6}">{{$route.query.examitemname}}</p>

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
                    <p> {{$route.query.examitemname}}</p>
                </div>
                <div class="right">
                    <p>平均分：{{$route.query.averagescore}}分</p>
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
                <ul class="list-content" v-for="(item,i) of scorelist" :key="i">
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
        name: "assessmentpage",
        data(){
          return{
              loading:true,
              scorelist:[],
              stdinfo:{}
          }
        },
        components:{
            cHeader,
        },
        mounted(){
            this.init();
            this.getStdInfo();
            this.registerToNative('goBack', function (data) {
                this.back()
            });
            console.log(this.$route.query.seiid)
        },
        computed:{

        },
        methods:{
            ...methods,
            getStdInfo(){
                this.post('/turnExamInfo/queryexamineeinfo',{
                    command: 'turnExamInfo/queryexamineeinfo',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    examineeid:this.$route.query.stuid,
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
            init(){
                this.loading=true;
                this.post('/turnExamInfo/querystuitemgradescorelist',{
                    command: 'turnExamInfo/querystuitemgradescorelist',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    stuid:this.$route.query.stuid,
                    examid:this.$route.query.examid,
                    examitemid:this.$route.query.examitemid,
                    seiid:this.$route.query.seiid
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
            enterSheetDetail(item){
                this.$router.push({
                    name: 'assessmentdetail',
                    // path:'/extranceExam/assessmentdetail',
                    query:{
                        turnexamscoreid:item.turnexamscoreid,
                        stuid:this.$route.query.stuid,
                        examinername:item.examinername,
                        signature:item.signature,
                        examitemname:item.examitemname
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
                    font-size:0.22rem;
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
            li:nth-child(2n){
                justify-content: flex-end;
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
    .title-top{width: 60%;word-break: break-all;display: block;white-space: normal;}
    .title-top.long{font-size:0.22rem;}
</style>
