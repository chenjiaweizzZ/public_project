<template>
    <div class="g-main">
        <template v-if="!showdetails">
            <ul class="month" v-if="flag == 0">
                <li v-for="(value,index) in monthlist" @click="monthdetail(value)">
                    <span>{{value}}出科考试报名审核名单</span>
                    <i class="icon"></i>
                </li>
            </ul>
            <ul class="doctorlist" v-else>
                <li class="title" v-if='data.length > 0'>
                    <span>姓名</span>
                    <span>护培学号</span>
                    <span>出科日期</span>
                </li>
                <li class="item" v-for="(value,index) in data" @click="getdetail(value.id)">
                    <span>
                        <div class="stuname">{{value.stuname}}</div>
                        <s :class="{'exam':value.examflag == 2}"></s>
                    </span>
                    <span>{{value.stuno}}</span>
                    <span>{{value.ckdate}}</span>
                    <i class="icon"></i>
                </li>
            </ul>
        </template>
        <template v-else>
            <div class="g-wrapper details  exam_results_content">
                <c-header>
                    <div slot="headerLeft">
                        <a @click="back()" class="header-back-btn">
                            <img src="../../../assets/images/icon_fanhui.png" />
                        </a>
                    </div>
                    {{type == 1 ? '审核' : '审核详情'}}
                    <!-- <div slot='headerRight' style="font-size: 0.3rem;" @click="enterSubmit" v-if="type == 1">提交</div> -->
                </c-header>
                <div class="subject_content">
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
                            <div>报名时所在科室: {{detail.turndeptname}}</div>
                            <div>报名日期: {{detail.createdatestr}}</div>
                            <div>备&emsp;&emsp;注:
                                <p class="remarks"> {{detail.remark}}</p>
                            </div>
                            <div class="checkButton" v-if="detail.status == 5">
                                <span class="refuse" @click="refuse">不通过</span>
                                <span class="sure" @click="checkSumbit(1)">通过</span>
                            </div>
                        </li>
                        <li class="e-span"></li>


                    </ul>
                    <div class="subject_wrap" v-if="type != 1">
                        <div class="detailCheck">
                            <p v-if="detail.status == 10">
                                <span>审核结果：</span>
                                <span>通过</span>
                            </p>
                            <p v-if="detail.status == -1">
                                <span>不通过理由：</span>
                                <span>{{detail.approvemsg == null || !detail.approvemsg ? '' : detail.approvemsg}}</span>
                            </p>
                        </div>

                        <!-- <div class="subject_title subject_results_title">
                            出科考试成绩
                    </div>
                    <div class="subject_items_results formalScore">
                        <div><label for="">理论成绩：</label> <input type="text" v-model="getScore[0].theoryscore" @focus='textareaFocus(".subject_content")'
                                @blur='textareaBlur(".subject_content")'></div>
                        <div><label for="">技能成绩：</label> <input type="text" v-model="getScore[0].skillscore" @focus='textareaFocus(".subject_content")'
                                @blur='textareaBlur(".subject_content")' :disabled="true"></div>
                        <div><label for="">综合成绩：</label> <input type="text" v-model="getScore[0].comprescore" @focus='textareaFocus(".subject_content")'
                                @blur='textareaBlur(".subject_content")' :disabled="true"></div>
                    </div>
                    <div class="bk_content">
                        <div class="bk_exam" v-if="enlisttype==2">
                            出科考试补考成绩
                        </div>
                        <div class="subject_items_results bkScore">
                            <div v-for="(item,index) in getBkScore"><label for="">{{item.examtype|examtypeFilter}}：</label>
                                <input type="text" @focus='textareaFocus(".subject_content")' @blur='textareaBlur(".subject_content")'
                                    :disabled="item.examtype!=1 ? true : false"></div>
                        </div>
                    </div> -->
                    </div>
                </div>
            </div>
        </template>
        <no-content v-if="ifshow" :txtdescription="txtdescription"></no-content>
        <van-dialog v-model:show="showRefucse" title="不通过理由" show-cancel-button class="refuceReason" @confirm="checkSumbit">
            <textarea v-model="approvemsg" border class="beizhuinfo" maxlength="250"></textarea>
            <span>{{approvemsg.length}}/250</span>
        </van-dialog>
    </div>
</template>
<script>
    import methods from '../../../methods';
    import cHeader from '../../header';
    import { mapState, mapActions } from 'vuex';
    import noContent from '../../no_content.vue';
    export default {
        props: ['active', 'status', 'type'],
        data() {
            return {
                sureFlag: true,
                showRefucse: false,
                approvemsg: "",
                txtdescription: '暂无已审核的报名记录~',
                data: '',
                monthlist: '',
                flag: 0,//0代表按月份查看，1表示看某个月份详细的
                now: '',
                detail: '',
                base: '',
                doctoroffice: '',
                showdetails: false,
                ifshow: false,
                entering: false,//是否启动录入成绩,
                getScore: [],
                turnscoredetaillist: [],
                getBkScore: [],
                enlisttype: 0,//正常考试等于1 补考等于2
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
                    this.flag = 0;
                    this.init();
                }
            },
            'flag': function (val) {
                if (val) {
                    this.$emit('changestatus', val);
                }
            },
            'status.val': function (value) {
                this.flag = 0;
            },
            'data': function (value) {
                this.ifshow = value.length == 0 ? true : false
            },
            type: function (newVal, oldVal) {
                this.flag = 0;
                this.init();
            }
        },
        filters: {
            examtype: function (value) {
                return value == 0 ? '全部科目' : value == 1 ? '理论考试' : value == 2 ? '技能考试' : value == 3 ? '综合考试' : ''
            },
            examtypeFilter(val) {
                let temp = ''
                switch (val) {
                    case '1':
                        temp = '理论成绩';
                        break;
                    case '2':
                        temp = '技能成绩';
                        break;
                    case '3':
                        return '综合成绩';
                        break;
                }
                return temp;
            }
        },
        created() {

        },
        mounted() {
            this.init();

        },
        methods: {
            ...methods,
            ...mapActions([
                'showConfirm',
                'toast',
                'showAlert'
            ]),
            refuse() {
                this.showRefucse = true;
                this.approvemsg = ""
            },
            checkSumbit(flag) {
                if (!this.sureFlag) {
                    return false;
                }
                this.sureFlag = false;
                let self = this;
                let tips = "审核成功！"
                if (flag) {
                    self.approvemsg = "通过",
                        tips = "审核通过成功!"
                }
                if (self.approvemsg) {
                    self.post('/turnexam/approvetrunexaminition', {
                        command: 'turnexam/approvetrunexaminition',
                        sessionid: $.cookie('sid'),
                        loginid: $.cookie('uid'),
                        approveid: $.cookie('uid'),
                        idlist: [self.detail.detailId],
                        status: flag ? 10 : -1,
                        approvemsg: self.approvemsg
                    }).done(function (data) {
                        if (data && data.errcode == 0) {
                            // self.selectlist = [];
                            self.showRefucse = false;
                            self.approvemsg = ""
                            self.toast(tips);
                            self.monthdetail(self.now);
                            self.back();
                        } else {
                            self.toast(data.errdesc);

                        }
                        self.sureFlag = true;
                    }).fail(function (error) {
                        self.sureFlag = true;
                    })

                } else {
                    if (flag != 1) {
                        self.toast('请填写不通过的理由~');
                        self.sureFlag = true;
                    }


                }
            },
            init() {
                let self = this;
                this.post('/turnbaseinfo/getturnexaminationyearmonth', {
                    command: 'turnbaseinfo/getturnexaminationyearmonth',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid: $.cookie('uid'),
                    status: this.type == 1 ? 5 : (this.type == 2 ? 10 : -1),
                }).done((data) => {
                    if (data && data.errcode == 0) {
                        self.monthlist = data.beanlist;
                    }
                });
            },
            getScoreData() {
                let self = this;
                self.turnscoredetaillist = [];
                for (let i = 0; i < 1; i++) {
                    self.turnscoredetaillist.push({
                        theoryscore: self.getScore[i].theoryscore,
                        skillscore: self.getScore[i].skillscore,
                        comprescore: self.getScore[i].comprescore,
                        turnscoreid: self.getScore[i].turnscoreid,
                        id: self.getScore[i].id
                    });
                };
                for (let j = 0; j < self.getBkScore.length; j++) {
                    if (self.getBkScore[j].examtype == 1) {
                        self.turnscoredetaillist.push({
                            theoryscore: $(".bkScore input").eq(j).val(),
                            turnscoreid: self.getBkScore[j].turnscoreid,
                            id: self.getBkScore[j].id
                        });
                    }
                    if (self.getBkScore[j].examtype == 2) {
                        self.turnscoredetaillist.push({
                            skillscore: $(".bkScore input").eq(j).val(),
                            turnscoreid: self.getBkScore[j].turnscoreid,
                            id: self.getBkScore[j].id
                        });
                    }
                    if (self.getBkScore[j].examtype == 3) {
                        self.turnscoredetaillist.push({
                            comprescore: $(".bkScore input").eq(j).val(),
                            turnscoreid: self.getBkScore[j].turnscoreid,
                            id: self.getBkScore[j].id
                        });
                    }

                }
                return self.turnscoredetaillist;

            },
            // 成绩提交
            enterSubmit() {
                let self = this;
                this.showConfirm({
                    title: '温馨提示',
                    msg: "确定提交",
                    ok: function () {
                        self.post('/turnscore/updateturnscore', {
                            command: 'turnscore/updateturnscore',
                            sessionid: $.cookie('sid'),
                            loginid: $.cookie('uid'),
                            turnscoreid: self.getScore[0].turnscoreid,
                            turnscoredetaillist: self.getScoreData()
                        }).done((data) => {
                            if (data && data.errcode == 0) {
                                self.showdetails = false;
                                self.init()
                            }
                        });
                    }
                });
            },
            monthdetail(param) {
                let self = this;
                this.post('/turnexam/queryturnexaminationlist', {
                    command: 'turnexam/queryturnexaminationlist',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    approveid: $.cookie('uid'),
                    statuslist: [this.type == 1 ? 5 : (this.type == 2 ? 10 : -1)],
                    status: this.type == 1 ? 5 : (this.type == 2 ? 10 : -1),
                    approveyearmonth: param,
                    // baseidlist:self.base,
                    // officeidlist:self.doctoroffice,
                    type: self.type,
                    page: '',
                    reqnum: ''
                }).done((data) => {
                    if (data && data.errcode == 0) {
                        self.flag = 1;
                        self.now = param;
                        self.data = data.beanlist;
                    }
                });
            },
            getdetail(param) {
                let self = this;
                self.getBkScore.length = 0;
                this.post('/turnexam/getturnexaminitiondetail', {
                    command: 'turnexam/getturnexaminitiondetail',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    id: param,
                }).done((data) => {
                    if (data && data.errcode == 0) {
                        self.enlisttype = data.enlisttype;
                        self.detail = data;
                        self.showdetails = true;
                        self.ifshow = false;
                        self.getScore = data.turnscoredetaillist;
                        for (let i = 1; i < self.getScore.length; i++) {
                            self.getBkScore.push(self.getScore[i]);
                        }
                        self.$nextTick(function () {
                            for (let j = 0; j < self.getBkScore.length; j++) {
                                if (self.getBkScore[j].examtype == 1) {
                                    $('.bkScore input').eq(j).val(self.getBkScore[j].theoryscore)
                                }
                                if (self.getBkScore[j].examtype == 2) {
                                    $('.bkScore input').eq(j).val(self.getBkScore[j].skillscore)
                                }
                                if (self.getBkScore[j].examtype == 3) {
                                    $('.bkScore input').eq(j).val(self.getBkScore[j].comprescore)
                                }
                            }
                        });
                        //传递父组件的值--显示父组件的箭头隐藏显示;
                        self.$emit('getShowArrows', self.showdetails);
                    }
                });

            },
            back() {
                this.showdetails = false;
                this.$emit('getShowArrows', this.showdetails);
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import '../../../scss/mixin.scss';
    .month li {
        padding: 0.15rem 0.2rem;
        background: #fff;
        border-top: 1px solid #eee;
        color: $wordColor;
        position: relative;
    }

    .month li:first-child {
        border-top: 0;
        margin-top: 0.2rem;
    }

    li.item {
        padding: 0 0.5rem;
        height: .6rem;
        width: 100%;
        color: $wordColor;
        font-size: 0.25rem;
        background: #fff;
        border-bottom: 1px solid #aaa;
        position: relative;
        span {
            display: inline-block;
            line-height: .6rem;
            text-align: center;
            width: 32%;
            .stuname {
                display: inline-block;
                width: 70%;
                line-height: .3rem;
                margin-top: 7px;
                overflow: hidden;
                text-overflow: ellipsis;
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
        margin: 0.175rem 0.175rem;
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

    .details {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
    }

    ul.studentdetail {
        background: #fff;
        color: $wordColor;

        li:first-child {
            border: 0;
            height: .8rem;
            line-height: .8rem;
        }
        li {
            height: 0.5rem;
            line-height: 0.5rem;
            padding: 0rem 0.2rem;
            border-top: 1px solid $borderColor;
            border-bottom: 1px solid $borderColor;
        }
        li:nth-child(3) {
            width: 100%;
            height: auto;
            display: flex;
            p {
                width: 50%;
                display: inline-block;
                span {
                    width: 100%;
                    margin: 0.1rem 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
        li:nth-child(5) {
            width: 100%;
            height: auto;
            div {
                width: 100%;
                margin: 0.2rem 0;
            }
            .remarks {
                border: 1px solid $borderColor;
                min-height: 1rem;
                padding: 10px;
                margin-top: 0.1rem;
                word-break: break-all;
            }
        }
        .e-span {
            width: 100%;
            height: .2rem;
            border: .1rem solid #F8F8F8;
            background-color: #F8F8F8;
        }


    }

    s {
        text-decoration: none;
    }

    s.exam:after {
        content: '补';
        font-size: 0.2rem;
        border-radius: 50%;
        padding: 0.05rem;
        background: red;
        color: #fff;
        margin-left: 0.1rem;
        margin-top: 0.1rem;
        float: right;
    }

    .subject_wrap {
        /*margin-top:0.2rem;*/
    }

    .detailCheck {
        padding: 12px;
    }

    .checkButton {
        margin-top: 20px;
        text-align: right;
        padding: 12px;
        span {
            display: inline-block;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-radius: 4px;
        }
        .refuse {
            width: 90px;
            border: 1px solid #dcdfe6;
            font-size: 14px;
            color: #606266,

        }
        .sure {
            width: 90px;
            font-size: 14px;
            color: #fff;
            margin-left: 20px;
            background-color: #409eff;


        }
    }

    .beizhuinfo {
        width: 100%;
        height: 70px;
    }
</style>

<style lang="scss">
    @import '../../../scss/mixin.scss';
    .exam_results_content {
        background: #fff;
    }

    .subject_content {
        height: 100%;
        overflow-y: scroll;
        .subject_wrap {
            background: #fff;
            .subject_results_title {
                border-top: 1px solid $borderColor;
                border-bottom: 1px solid $borderColor;
                height: 0.8rem;
                background: #fff;
                line-height: 0.8rem;
                padding: 0 0.2rem;
            }
            .subject_items_results {
                @include sexy-flex();
                flex-flow: column nowrap;
                padding: 0.4rem 0.3rem;
                padding-bottom: 0.1rem;
                background: #fff;
                &>div {
                    @include flex1(1);
                    @include sexy-flex();
                    flex-flow: row nowrap;
                    align-items: center;
                    margin-bottom: 0.2rem;
                    &>input {
                        flex: 1;
                        border-bottom: 1px solid $borderColor;
                    }
                }
            }
            .bk_exam {
                padding-left: 0.3rem;
            }
        }
    }

    .refuceReason {
        .van-dialog__content {
            position: relative;
            padding: 10px;
            margin: 12px;
            padding-bottom: 22px;
            border: 1px solid #dcdfe6;
            span {
                position: absolute;
                right: 19px;
            }
            textarea {
                height: 98px;
            }
        }
    }
</style>