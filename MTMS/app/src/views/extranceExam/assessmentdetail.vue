<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            {{$route.query.examitemname}}
        </c-header>
        <div class="g-main">
            <div class="top">
                <ul>
                    <li><label for="">姓名：</label>{{stdinfo.name}}</li>
                    <li><label for="">护培学号：</label><span>{{stdinfo.username}}</span></li>
                    <li><label for="">考官：</label>{{$route.query.examinername}}</li>
                    <li><label for="">评分：</label><span>{{total}} 分</span></li>
                </ul>
            </div>
            <div class="item-c">
                <van-loading color="#1989fa" v-if="loading"/>
                <div v-if="!loading">
                    <div class="item-c-i" v-for="(item,i) of scorelistdetail" :key="i">
                        <p>{{i+1}}{{item.key}}（{{item.itemmaxscore}}）</p>
                        <div class="item-d" v-for="(innerItem,index) of item.value" :key="index">
                            <p>{{index+1}}、{{innerItem.rightoperation}} ({{innerItem.maxscore}}分)</p>
                            <h3>得分:{{innerItem.score}}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div class="signature-c">
                <p>考官签名: {{$route.query.examinername}}</p>
                <!-- <img :src="imgurl" alt=""> -->
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
        components:{
            cHeader,
        },
        data(){
            return{
                scorelistdetail:[],
                total:0,
                stdinfo:{},
                loading:false,
                imgurl:this.$route.query.signature
            }

        },
        mounted(){
            this.registerToNative('goBack', function (data) {
                this.back()
            });
            this.init();
            this.getStdInfo();//获取学员信息
        },
        methods:{
            ...methods,
            getStdInfo(){
                this.post('/turnExamInfo/queryexamineeinfo',{
                    command: 'turnExamInfo/queryexamineeinfo',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    examineeid:this.$route.query.stuid
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
            back(){
                window.history.back();
            },
            getsignature(stuid,examid,examitemid,examinerid){
                this.post('/turnExamInfo/querystuitemgradescorelist',{
                    command: 'turnExamInfo/querystuitemgradescorelist',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    stuid:stuid,
                    examid:examid,
                    examitemid:examitemid
                }).done(res => {
                    res.itemscorelist.map((item,index)=>{
                        if(item.examinerid==examinerid){
                            this.imgurl=item.signature;
                        }
                    })
                })
            },
            init(){
                this.loading=true;
                this.post('/turnExamInfo/queryturnexamscore',{
                    command: 'turnExamInfo/queryturnexamscore',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    turnexamscoreid:this.$route.query.turnexamscoreid
                }).done(res => {
                    this.loading=false;
                    if (res && res.errcode == 0) {
                        this.total=res.total;
                        this.scorelistdetail=res.itemlist;
                        this.getsignature(res.examineeid,res.examid,res.examitemid,res.examinerid)
                        this.scorelistdetail.map(item=>{
                            let itemmaxscore=0;
                            item.value.map(innerItem=>{
                                itemmaxscore+=Number(innerItem.maxscore);
                            });
                            this.$set(item,'itemmaxscore',itemmaxscore);
                        });
                    } else if (res.errdesc) {
                        this.toast(res.errdesc)
                    } else {
                        this.toast('服务器错误，请联系管理员。')
                    }
                })
            },
            getscore(examitemid){
                this.post('/turnannualresult/queryinfoitem',{
                    command: 'turnannualresult/queryinfoitem',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    examitemid:examitemid
                }).done(res => {
                    this.loading=false;
                    if (res && res.errcode == 0) {
                    } else if (res.errdesc) {
                        this.toast(res.errdesc)
                    } else {
                        this.toast('服务器错误，请联系管理员。')
                    }
                })
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
        font-size:0.22rem;
        border-bottom:1px solid $borderColor;

        ul{
            display: flex;
            background: #fff;
            flex-flow:row wrap;
            padding:0.2rem;
            border-bottom:1px solid $borderColor;
            li{
                width: 50%;
                font-size: 0.24rem;
                display: flex;
                height: 0.5rem;
                label{
                    min-width: 70px;
                    text-align: right;
                }
                justify-content:left;
                align-items: center;
            }
            li:nth-child(2n){
                label{
                    /*width:1rem;*/
                }
            }
        }
    }
    div.item-c{
        div.item-c-i{
            &>p{min-height: 0.6rem;background: $bgColor;line-height: 0.6rem;padding-left: 0.2rem;}
            div.item-d{
                p{padding-left: 0.2rem;margin-bottom: 0;line-height:1.3;word-break:
                    break-all;margin-bottom:0.2rem;
                    padding: 0.1rem;
                }
                h3{padding-left: 0.2rem;font-size:0.26rem;line-height:0.6rem;}
                border:1px solid $borderColor
            }
        }
    }
    .signature-c{
        p{
            padding: 0.2rem;
        }
        img{
            width: 100%;
        }

    }
</style>
