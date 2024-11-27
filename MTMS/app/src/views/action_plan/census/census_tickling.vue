<template>
    <div class="g-main">
        <template v-if="flag">
            <!-- <div class="title" v-show="!nocontent">
                <span>得分：{{list.score}}分/总分{{list.totalscore}}分</span>
                <span>反馈人数：{{list.evaluatepeoplecount}}人/总人数{{list.evaluatepeopletotalcount}}人</span>
            </div> -->
            <!-- <ul class="options" v-show="!nocontent">
                <li v-for="(item,index) in list.evaluationlist" @click="showdetail(item.id,item.title)" :key="index">
                    <span>{{item.title}}</span>
                    <span class="choice">{{item.avgscore | rate}}分</span>
                </li>
            </ul>
            <div class="evaluate" v-if="!nocontent">
                <p>收获和建议</p>
                <ul class="evaluatelist">
                    <li v-for="(item,index) in list.suglist">
                        <div>
                            <i>{{index+1}}.</i>
                            <div style="word-break: break-all">
                                {{item.advise}}
                            </div>
                        </div>
                        <p class="uname" style="margin-top:10px;">{{item.uname}}</p>
                    </li>
                </ul>
            </div> -->
            <div class="title" v-show="!nocontent">
                <span>得分：{{list.avgScore}}分/总分{{list.totalScore}}分</span>
                <span>反馈人数：{{list.hasScoreCount}}人/总人数{{list.totalScoreCount}}人</span>
            </div>
            <van-cell :title="item.uname" is-link :value="getFen(item.score)" v-for="(item,index) in list.scoreSubmitRecordDetails" :key="index" @click="getDetail(item)"/>
        </template>
        <template v-else>
            <div class="g-wrapper itemlist">
                <c-header>
                    <div slot="headerLeft">
                        <a @click="back()" class="header-back-btn">
                            <img src="../../../assets/images/icon_fanhui.png" />
                        </a>
                    </div>
                    {{title}}
                </c-header>
                <div class="g-main">
                    <div class="item">
                        <p v-for="(item,index) in list2">
                            <span>{{item.name}}</span>
                            <span>{{item.score}}分</span>
                        </p>
                    </div>
                </div>
                <no-content v-if='list2.length == 0'></no-content>
            </div>
        </template>
        <no-content v-if='nocontent'></no-content>
    </div>
</template>
<script>
    import cHeader from '../../header';
    import methods from '../../../methods';
    import noContent from '../../no_content';
    import { mapState, mapActions } from 'vuex'
    export default {
        props: ['active'],
        data() {
            return {
                detailid:'',
                list:'',
                nocontent:false,
                flag:true,
                title:'',
                list2:'',
            }
        },
        components: {noContent,cHeader},
        watch:{
            'active': function (val, oldVal) {
                if (val) {
                    this.init();
                }
            }
        },
        filters:{
            rate:function(value){
                return Number(value).toFixed(1);
            }
        },
        created(){
            this.detailid = this.$route.query.id;
        },
        mounted() {
            this.init();
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
            getFen(num) {
                return num + "分"
            },  
            getDetail(item) {
                let self =this
                self.$router.push({
                            name: "scoreDetail",
                            query: {
                                routeTitleName: "评分详情",
                                id: item.id,
                                category: "",
                                type: "",
                            }
                        })
            },
            init(){
                let self = this;
                this.post('/teachingactivityplan/teachingactionplancountV2',{
                    command:'teachingactivityplan/teachingactionplancountV2',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    teachingPlanId:self.detailid,
                    type:6
                }).done( res => {
                    if(res && res.errcode == 0){
                        self.list = res;
                        if(res.evaluatepeopletotalcount == 0){
                            self.nocontent = true;
                        }
                    }else {
                        self.toast(res.errdesc);
                        self.nocontent = true;
                    }
                }).fail(function (error) {
                    self.nocontent = true
                });
            },
            showdetail(param,params){
                let self = this;
                self.title = params;
                this.post('/teachingactivityplan/getturnevadetailscore',{
                    command:'teachingactivityplan/getturnevadetailscore',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    turnevaluateid:self.detailid,
                    itemid:param,
                }).done( res => {
                    if(res && res.errcode == 0) {
                        self.list2 = res.detailscore;
                        self.flag = false;
                    }
                })
            },
            back(){//返回上一级
                this.flag = true;
            },
        }
    }
</script>
<style lang="scss" scoped>
    .title {
        width: 100%;
        height: 0.6rem;
        background: #fff;
        color: #666;
        display: flex;
        justify-content: space-between;
        font-size: 0.24rem;
        padding: 0 0.2rem;
        span {
            line-height: 0.6rem;
        }
    }
    .options {
        margin-top: 0.15rem;
        li {
            background: #fff;
            height: .6rem;
            padding: 0 0.2rem;
            position: relative;
            color: #666;
            font-size: 0.26rem;
            font-family: "Microsoft YaHei";
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            span {
                line-height: .6rem;
            }
            span:first-child {
                width: 70%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            span.choice {
                padding-right: 0.4rem;
            }
            span.choice:after {
                content: '';
                display: inline-block;
                width: 0.3rem;
                height: 0.3rem;
                background: url("../../../assets/images/you-jiantou.png") 0 0 no-repeat;
                background-size: 100% 100%;
                position: absolute;
                right: 0.2rem;
                top: 0.15rem;
            }
        }
    }
    .evaluate {
        margin-top: 0.15rem;
        background: #fff;
        color: #666;
        overflow:hidden;
        >p {
            width: 100%;
            line-height: 0.6rem;
            padding: 0 0.2rem;
            border-bottom: 1px solid #eee;
        }
        .uname {
            display: flex;
            justify-content: flex-end;
            padding: 0 0.2rem;
        }
    }
    .evaluatelist {
        li {
            border-bottom: 1px solid #eee;
            >div {
                display: flex;
                padding: 0 0.2rem;
            }
            i {
                padding-right: 0.2rem;
                font-style: normal;
            }
        }
    }
    .itemlist {
        width: 100vw;
        height: 100vh;
        background: #f8f8f8;
        position: absolute;
        top: 0;
        z-index: 999;
    }
    .item {
        background: #fff;
        width: 100%;
        padding: 0;
        margin: 0;
        p {
            padding: 0.1rem 0.2rem;
            margin: 0;
            display: flex;
            justify-content: space-between;
            color: #666;
            border-bottom: 1px solid #eee;
        }
    }
</style>
