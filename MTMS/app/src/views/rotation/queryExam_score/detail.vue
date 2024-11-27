<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            成绩查询
        </c-header>
        <header>
            <span>
                {{title}}
            </span>
        </header>
        <div class="g-main">
            <div class="theory">
                <span>病例书写成绩</span>
                <span>{{medicalWritingScore}}分</span>
                <span v-if="secondtheoryscore">补考（{{medicalWritingResit}}分）</span>
            </div>
            <div class="theory">
                <span>理论成绩</span>
                <span>{{theoryscore}}分</span>
                <span v-if="secondtheoryscore">补考（{{secondtheoryscore}}分）</span>
            </div>
            <p class="score">技能成绩</p>
            <ul>
                <li>
                    <span>考站</span>
                    <span>考核项</span>
                    <span>得分</span>
                    <span>补考得分</span>
                </li>
                <li v-for="(item,index) in list">
                    <span>{{item.teststationname}}</span>
                    <span>{{item.examitemname}}</span>
                    <span>{{item.score | score}}</span>
                    <span>{{item.secondscore | score}}</span>
                </li>
            </ul>
            <div class="remark">
                <p>备注：</p>
                <span>若有一项考核成绩不合格，您此次年度考核成绩为不合格。</span>
            </div>
        </div>
    </div>
</template>
<script>
    import methods from '../../../methods';
    import cHeader from '../../header';
    export default {
        data() {
            return {
                detailid:'',
                theoryscore:'',
                title:'',
                list:'',
                secondtheoryscore: 0,
                medicalWritingScore:0,
                medicalWritingResit:''
            }
        },
        components: {
            cHeader,
        },
        filters:{
            score:function(val){
                if(val && val !== null){
                    return val
                }else {
                    return ''
                }
            }
        },
        computed: {},
        watch: {},
        created() {
            this.detailid = this.$route.query.detailid
        },
        mounted() {
            this.init()
        },
        methods: {
            ...methods,
            init() {
                let self = this;
                this.post('/turnannualresult/querystuannualscore', {
                    command: 'turnannualresult/querystuannualscore',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    id:self.detailid
                }).done(function (data) {
                    self.list = data.annualresult.detaillist;
                    self.title = data.annualresult.title;
                    self.theoryscore = data.annualresult.theoryscore;
                    self.secondtheoryscore = data.annualresult.secondtheoryscore;
                    self.medicalWritingScore = data.annualresult.medicalwritingscore;
                    self.medicalWritingResit = data.annualresult.medicalwritingresit;
                }).fail(function(){
                    self.toast('连接服务失败，请稍后再试');
                })
            },
            back(){
                let self = this;
                this.$router.push({
                    name: "fdRotation_examlist",
                    query:{
                        type:self.$route.query.type,
                        id:self.$route.query.id,
                    }
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
    header {
        text-align: center;
        background: #fff;
        color: #666;
        padding: 0.1rem 0.5rem;
        border-bottom: 1px solid #eee;
        span {
            line-height: 0.3rem;
        }
    }
    .theory {
        display: flex;
        padding: 0 0.5rem;
        background: #fff;
        border-bottom: 1px solid #eee;
        span {
            width:0;
            flex:1;
            text-align: center;
            line-height: 0.5rem;
        }
    }
    p.score {
        text-align: center;
        padding: 0;
        margin: 0;
        line-height: 0.5rem;
        background: #fff;
    }
    ul {
        margin-bottom: 0.2rem;
    }
    li {
        background: #fff;
        padding: 0.1rem 0.2rem;
        border-bottom: 1px solid #eee;
        display: flex;
        span {
            width: 0;
            flex: 1;
            text-align: center;
        }
    }
    .remark {
        background: #fff;
        padding: 0.2rem;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
    }
</style>
