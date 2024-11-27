<template>
    <div class="g-main">
        <ul class="doctorlist" v-if="data.length > 0">
            <li class="title">
                <span>姓名</span>
                <span>护培学号</span>
                <span>出科日期</span>
            </li>
            <li class="item" v-for="(value,index) in data">
                <input type="checkbox" v-model="selectlist" :value="value.id" class="checkbox" />
                <div @click="showdetail(value.id)">
                <span>
                    <div class="stuname">{{value.stuname}}</div>
                    <s :class="{'exam':value.examflag == 2}"></s>
                </span>
                <span>{{value.stuno}}</span>
                <span>{{value.ckdate}}</span>
                <i class="icon"></i>
                </div>
            </li>
        </ul>
        <!-- <div class="all"  v-if="data.length > 0">
            <input class="checkbox" type="checkbox" :checked="data.length === selectlist.length" @click='checkedAll()'>
            <span>全选</span>
            <div>
                <a class="refuse" @click="refuse()">拒绝</a>
                <a class="adopt" @click="sure()">通过</a>
            </div>
        </div> -->
        <div v-show="refusedoctor" class="refusecontent">
            <c-header>
                <div slot="headerLeft">
                    <a @click="back()" class="header-back-btn">
                        <img src="../../../assets/images/icon_fanhui.png" />
                    </a>
                </div>
                出科考试报名审核
            </c-header>
            <textarea v-model="approvemsg" placeholder="请输入您的理由，以便学生知道详情...">

            </textarea>
            <a class="refusebtn" @click="refusesubmit()">提交</a>
        </div>
        <no-content v-show="data.length <= 0" :txtdescription="txtdescription"></no-content>
    </div>
</template>
<script>
    import methods from '../../../methods';
    import { mapState, mapActions } from 'vuex';
    import noContent from '../../no_content.vue';
    import cHeader from '../../header';
    export default {
        props: ['active'],
        data() {
            return {
                txtdescription:'暂无待审核的报名记录~',
                data:'',
                selectlist:[],
                isCheckedAll: false,
                refusedoctor: false,
                approvemsg:'',
                base:[],
                doctoroffice:[]
            }
        },
        components: {
            noContent,
            cHeader
        },
        computed: {

        },
        watch: {
            'active': function (val, oldVal) {
                if (val) {
                    this.initeachrole()
                }
            }
        },
        created() {

        },
        mounted() {
            this.initeachrole();
        },
        methods: {
            ...methods,
            ...mapActions([
                'showConfirm',
                'toast'
            ]),
            initeachrole(){
                let self = this;
                this.post('/turnbaseinfo/getusermanagerdepttree',{
                    command: 'turnbaseinfo/getusermanagerdepttree',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    uid:$.cookie('uid')
                }).done(res => {
                    if(res&&res.errcode==0){
                        self.base = [];
                        self.doctoroffice = [];
                        res.depttree.childlist.map( val => {
                            self.base.push(val.id);
                            val.childlist.map( value => {
                                self.doctoroffice.push( value.id);
                                // value.childlist.map( item => {
                                //     self.area.push( item.id)
                                // })
                            })
                        });
                        self.init();
                    }
                })
            },
            init(){
                let self=this;
                this.post('/turnexam/queryturnexaminationlist',{
                    command: 'turnexam/queryturnexaminationlist',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    // approveid:$.cookie('uid'),
                    type:1,
                    status:5,
                    page:'',
                    reqnum:'',
                    baseidlist:self.base,
                    officeidlist:self.doctoroffice
                }).done((data)=>{
                    if(data&&data.errcode ==0){
                        self.data = data.beanlist;
                    }
                })
            },
            checkedAll () {
                this.isCheckedAll = !this.isCheckedAll;
                if (this.isCheckedAll) {
                    // 全选时
                    this.selectlist = [];
                    this.data.forEach(function (val) {
                        this.selectlist.push(val.id)
                    }, this)
                } else {
                    this.selectlist = []
                }
            },
            showdetail(param){
                this.$router.push({
                    name: "fdDoctorDetail",
                    query: {
                        id: param,
                    }
                });

            },
            // 通过审核
            sure(){
                let self = this;
                if(self.selectlist.length > 0){
                    this.showConfirm({
                        title: '审核确认',
                        msg: '是否确认已选学员通过审核？',
                        theme: 'modal-confirm modal-white',
                        cancel: function () {},
                        ok: function () {
                            self.post('/turnexam/approvetrunexaminition', {
                                command: 'turnexam/approvetrunexaminition',
                                sessionid:$.cookie('sid'),
                                loginid:$.cookie('uid'),
                                approveid:$.cookie('uid'),
                                idlist:self.selectlist,
                                status:10,
                                approvemsg:'通过'
                            }).done(function (data) {
                                if(data&&data.errcode ==0){
                                    self.selectlist = [];
                                    self.toast('审核成功~');
                                    self.init();
                                }else{
                                    self.toast(data.errdesc);
                                }
                            }).fail(function (error) {

                            })
                        },
                    })
                }else {
                    self.toast('请选择学员~');
                }
            },
            //不通过
            refuse(){
                let self = this;
                if(self.selectlist.length > 0){
                    self.refusedoctor = true;
                }else {
                    self.toast('请选择学员~');
                }
            },
            refusesubmit(){
                let self = this;
                if(self.approvemsg){
                    this.post('/turnexam/approvetrunexaminition', {
                        command: 'turnexam/approvetrunexaminition',
                        sessionid:$.cookie('sid'),
                        loginid:$.cookie('uid'),
                        approveid:$.cookie('uid'),
                        idlist:self.selectlist,
                        status:-1,
                        approvemsg:self.approvemsg
                    }).done(function (data) {
                        if(data&&data.errcode ==0){
                            self.selectlist = [];
                            self.refusedoctor = false;
                            self.toast('审核成功~');
                            self.init();
                        }else{
                            self.toast(data.errdesc);
                        }
                    }).fail(function (error) {

                    })
                }else {
                    self.toast('请填写不通过的理由~');
                }
            },
            back(){
                this.refusedoctor = false;
            }
        }
    }
</script>
<style lang="scss" scoped>
    ul {
        padding-bottom: .8rem;
    }
    li.item {
        padding: 0 0.5rem;
        height: .6rem;
        width: 100%;
        color: #999;
        font-size: 0.25rem;
        background: #fff;
        border-bottom: 1px solid #aaa;
        position: relative;
        span {
            display: inline-block;
            line-height: .6rem;
            text-align: center;
            width: 32%;
            .stuname{
                display: inline-block;
                width: 70%;
                line-height: .3rem;
                margin-top: 7px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
    }
    li.item input {
        display: inline-block;
        left: 0.125rem;
        top: 0.175rem;
        position: absolute;
    }
    li.active:before {
        content: '';
        display: inline-block;
        width: 0.25rem;
        height: 0.25rem;
        background: #3499db;
        border-radius: 50%;
        left: 0.125rem;
        top: 0.175rem;
        position: absolute;
    }
    li i.icon {
        display: inline-block;
        width: 0.25rem;
        height: 0.25rem;
        background: url("../../../assets/images/you-jiantou.png") 0 0 no-repeat;
        background-size: 100% 100%;
        margin:0.175rem 0.175rem;
        position: absolute;
        top: 0;
        right: 0;
    }
    .all {
        position: fixed;
        bottom: 0;
        width: 100%;
        padding: 0 0.5rem;
        height: 0.8rem;
        border-top: 1px solid #aaa;
        background: #fff;
        color: #3499db;
        font-size: 0.3rem;
        span {
            line-height: .8rem;
            margin-left: 0.1rem;
        }
        div {
            display: inline-block;
            float: right;
        }
        a {
            padding: 0.1rem 0.2rem;
            border-radius: 5px;
            margin-top: 0.1rem;
            margin-right: 0.1rem;
        }
        a.refuse {
            border: 1px solid #3499db;
            color: #3499db;
        }
        a.adopt {
            border: 1px solid #3499db;
            background: #3499db;
            color: #fff;
        }
    }
    .all input {
        left: 0.125rem;
        top: 0.255rem;
        position: absolute;
    }
    .title {
        padding: 0 0.5rem;
        width: 100%;
        color: #000;
        font-size: 0.25rem;
        background: transparent;
        border: 0;
        span {
            line-height: .6rem;
            width: 32%;
            text-align: center;
        }
    }
    .refusecontent {
        position: absolute;
        width: 100%;
        height: 100vh;
        background: #f2f2f2;
        top: 0;
        left: 0;
    }
    textarea {
        width: 96vw;
        height: 20vh;
        margin: 0.2rem 2vw;
        background: #fff;
        padding: 0.1rem;
    }
    a.refusebtn {
        width: 96vw;
        text-align: center;
        display: inline-block;
        background: #3297D8;
        margin: 2vw;
        padding: 0.2rem;
        color: #fff;
        border-radius: 5px;
    }
    s {
        text-decoration: none;
    }
    s.exam:after {
        display: inline-block;
        content: '补';
        font-size: 0.2rem;
        border-radius: 50%;
        padding: 0.05rem;
        background: red;
        color: #fff;
        margin-left: 0.1rem;
        float: right;
        margin-top: 0.1rem;
    }
</style>
