<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            出科报名人员详情
        </c-header>
        <ul class="studentdetail">
            <li v-if="detail.examtype"><span>补考科目</span>{{detail.examtype | examtype}}</li>
            <li v-else style="height: 0rem"></li>
            <li class="e-span"></li>
            <li>
                <p>
                    <span>{{detail.name}} - {{detail.username}}</span>
                    <span>{{detail.basename}}</span>
                </p>
                <p>

                    <span>{{detail.mobile}}</span>
                    <span>{{detail.turngrade}}</span>
                </p>
            </li>
            <li class="e-span"></li>
            <li>
                <div>出科科室: {{detail.ckdeptname}} ( {{detail.rkdate}} - {{detail.ckdate}} )</div>
                <div>报名时轮转科室: {{detail.turndeptname}}</div>
                <div>报名日期: {{detail.createdatestr}}</div>
                <div class="e-span-content">备&emsp;&emsp;注: {{detail.remark}}</div>
            </li>
        </ul>
    </div>
</template>
<script>
    import cHeader from '../../header';
    import methods from '../../../methods';
    export default {
        data() {
            return {
                detail:'',
                id:''
            }
        },
        components: {cHeader},
        computed: {},
        watch: {},
        filters: {
            examtype:function(value){
                return value == 0 ? '全部科目' : value == 1 ? '理论考试' : value == 2 ? '技能考试' : value == 3 ? '综合考试' : ''
            }
        },
        created() {
            this.id = this.$route.query.id;
            this.from = this.$route.query.from ? this.$route.query.from : '';
        },
        mounted() {
            let self = this;
            this.registerToNative('goBack', function (data) {
                self.back()
            });
            this.init();
        },
        methods: {
            ...methods,
            init(){
                let self=this;
                this.post('/turnexam/getturnexaminitiondetail',{
                    command: 'turnexam/getturnexaminitiondetail',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    id:self.id,
                }).done((data)=>{
                    if(data&&data.errcode ==0){
                        self.detail = data;
                    }
                })
            },
            back(){
                let self = this;
                this.$router.push({
                    // path: "secretary_signup",
                    name: "secretary_signup",
                    query:{
                        from:self.from,
                    }
                });
            },
        }
    }
</script>
<style lang="scss" scoped>
.e-span-content {
    word-break: break-all;
}
    ul.studentdetail {
        margin-top: 0.2rem;
        background: #fff;
        color:#999;

        li:first-child {
            border:0;
            height: .8rem;
            line-height: .8rem;
        }
        li {
            height: 0.5rem;
            line-height: 0.5rem;
            padding:0rem 0.2rem;
            border-top: 1px solid #eee;
        }
        li:nth-child(3){
            width: 100%;
            height: auto;
            display: flex;
            p {
                width: 50%;
                display: inline-block;
                span{
                    width: 100%;
                    margin: 0.1rem 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
        li:nth-child(5){
            width: 100%;
            height: auto;
            div{
                width: 100%;
                margin: 0.1rem 0;
            }
        }
        .e-span {
            width: 100%;
            height: .2rem;
            border: .1rem solid #F8F8F8;
            background-color: #F8F8F8;
        }
    }
</style>
