<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            选择轮转科室
            <div slot="headerRight" style="font-size: 0.3rem">
                提交
            </div>
        </c-header>
        <div class="g-main">
            <!--选择主讲人 -->
            <transition enter-active-class="animated slideInRight" leave-active-class="animated fadeOut" >
                <div class="department g-wrapper">
                    <c-header>
                        <div slot="headerLeft" @click="back">
                            <a class="header-back-btn">
                                <img src="../../../assets/images/icon_fanhui.png" />
                            </a>
                        </div>
                        选择轮转科室
                        <div @click="submit" slot="headerRight" style="font-size: 0.3rem">
                            提交
                        </div>
                    </c-header>
                    <div class="g-main">
                        <div class="search">
                            <input type="text" v-model="seachvalue" placeholder="搜索">
                            <i @click="toseach(seachvalue)"></i>
                        </div>
                        <div class="flex-item class-sel-list" style="padding-bottom: 0.6rem;">
                            <div class="list info-list list-inner">
                                <div class="item" v-for="item in officelist">
                                    <label class="flex flex-start flex-row">
                                        <div class="fitem">{{item.deptname}}</div>
                                        <input class="checkbox" type="radio" :value="item.id" v-model="electiveoffice" name="radio">
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import methods from '../../../methods';
    import cHeader from '../../header';
    import { mapState, mapActions } from 'vuex'
    let bus = new Vue();
    export default {
        components:{
            cHeader,
        },
        data(){
            return{
                electiveoffice:'', //选择的科室
                officelist:[],
                seachlist:[],
                seachvalue:'',
                checkbox:false
            }
        },
        computed:{},
        watch:{
        },
        created(){},
        mounted(){
            this.init('')
            this.registerToNative('goBack', function (data) {
                this.back()
            })
        },
        methods:{
            ...methods,
            ...mapActions([
                'toast',
                'setTurninfo'
            ]),
            //获取科室
            init(param){
                let self = this;
                self.post('/deptinfo/getdeptlist',{
                    command: 'deptinfo/getdeptlist',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    deptname: param,
                    deptcodelist: [
                        "office",
                        "inpatientarea"
                    ]
                }).done((data)=>{
                    if(data && data.errcode ==0){
                        if(data.beanlist && data.beanlist.length > 0){
                            /*data.beanlist.map(item =>{
                                item.electiveoffice = ''
                            })*/
                            self.officelist = data.beanlist;
                        }else{
                            self.officelist = []
                        }

                    }else if(data.errdesc){
                        self.toast(data.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                })
            },

            toseach(name){
                this.init(name)
            },

            submit(){
                let self = this;
                if(self.officelist.length > 0){
                    if(self.electiveoffice){
                        self.post('/turnedoctormain/changeturndept',{
                            command: 'turnedoctormain/changeturndept',
                            sessionid:$.cookie('sid'),
                            loginid:$.cookie('uid'),
                            deptid: self.electiveoffice,                        //选修科室id
                            id:self.$route.query.turnplanid,    //该条轮转计划id
                        }).done((data)=>{
                            if(data && data.errcode ==0){
                                self.back();
                            }else if(data.errdesc){
                                self.toast(data.errdesc)
                            }else {
                                self.toast('服务器错误，请联系管理员。')
                            }
                        })
                    }else{
                        self.toast('请选择要选修的科室或病区。')
                    }
                }
            },

            back(){
                this.setTurninfo({k:'stuid',v:$.cookie('uid')})
                this.$router.push({
                    name: "fdRotation_doctor_plan",
                    query: {
                        id:this.$route.query.turnplanid,
                        type:this.$route.query.type,
                    }
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
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
    .radio-box:before {
        content: '';
        display: inline-block;
        width: .25rem;
        height: .25rem;
        margin-right: .05rem;
        border-radius: 50%;
        box-shadow: #dfdfdf 0 0 0 0 inset;
        background-image: url('../../../assets/images/gouxuan.png');
        background-size: cover;

    }
    .radio-active:before {
        background-image: url('../../../assets/images/gouxuan_on.png');
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
        background-image: url('../../../assets/images/gouxuan.png');
        background-size: cover;
    }
    .checkbase-active:after {
        background-image: url('../../../assets/images/gouxuan_on.png');
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
            background:url('../../../assets/images/icon-search.png') 0 0 no-repeat;
            background-size:100% 100%;
            cursor:pointer;
            vertical-align: middle;
            z-index:99;
        }
    }
</style>
