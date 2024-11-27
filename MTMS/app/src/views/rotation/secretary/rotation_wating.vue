<template>
    <div class="g-wrapper">
        <div class="title">
            <span>{{condition}}</span>
            <img @click.stop='gettime.show = true' src="../../../assets/images/icon_rili.png" alt="">
        </div>
        <div class="g-main" v-if='!noContent'>
            <div v-for='(item,key) in turndoctors' class="list">
                <ul @click='plan(item)'>
                    <li class="head">
                        <div class="headDiv">
                            <img src="../../../assets/images/icon_morentoux-.png" alt="">
                            <div>
                                <p class="headerName">
                                    <span>{{item.name}}</span>
                                    <span>{{item.period}}</span>
                                </p>
                                <p class="headerName">
                                    <span>{{item.base}}</span>
                                    <span>{{item.mobile}}</span>
                                </p>
                            </div>
                        </div>
                    </li>
                    <!--<li>
                        <span>专业基地：{{item.base}}</span>
                    </li>
                    <li>
                        <span>科&emsp;&emsp;室：{{item.dept}}</span>
                    </li>
                    <li>
                        <span>带教老师：{{item.teaching}}</span>
                    </li>-->
                    <li>
                        <span>轮转科室 ：{{item.dept}} </span>
                    </li>
                    <li>
                        <span>轮转周期 ：{{item.begintime | date}}-{{item.endtime | date}}</span>
                    </li>
                </ul>
                <div class="footerBtn">
                    <a v-if="shownotturn" @click='confirmTurn(item)' style="margin-right: .2rem">未轮转</a>
                    <a :class="{noclick:issubmit}" @click='confirmCourse(item)' v-if="!issubmit && roleAuthority['app:wait:confirmInDept'] && item.isGraduation!=2">入科确认</a>
                    <a :class="{noclick:issubmit}" v-if="issubmit && roleAuthority['app:wait:confirmInDept']&& item.isGraduation!=2" >入科确认</a>
                </div>
            </div>
        </div>

        <!--未轮转理由-->
        <div class="for-reason" v-if="showreason">
            <div class="reason-content">
                <header>
                    请选择未轮转原因
                </header>
                <section>
                    <label v-for='(v,index) in reasonlist' @click.prevent="getchecked(v.key)"><input type="checkbox" class="radio"
                            :checked="v.ischecked == true">{{v.name}}</label>
                    <textarea v-model='reason' placeholder="您可以输入具体原因"></textarea>
                </section>
                <footer>
                    <a @click="changTurnStatus">确定</a>
                    <a @click="showreason = false">取消</a>
                </footer>
            </div>
        </div>
        
        <van-popup v-model="timeShow" position="bottom">
            <div style="width: 100%;">
                <div style="display: flex;justify-content: space-between;align-items: center;margin: 10px 0;">
                <button type="button" class="van-picker__cancel" @click="timeShow=false">取消</button>
                <div class="van-ellipsis van-picker__title" style="font-weight: bold;">确认该住院医生入科吗?</div>
                <button type="button" class="van-picker__confirm" @click="timeConfirm">确认</button>
                </div>
                <p style="text-align: center;margin: 5px 0;color: #898989 !important;font-size: 15px;">请选择实际入科时间 </p>
            </div>
            <van-datetime-picker
                v-model="realBeginTime" :show-toolbar="false"
                type="date"  :formatter="formatter"
                :min-date="minDate"
                :max-date="maxDate"
            >
            </van-datetime-picker>
        </van-popup>

        <!--选择要看的时间-->
        <c-timepicker :config="gettime" @confirm="selecttime" :year="defaultyears" :month="months">

        </c-timepicker>

        <no-content v-if='noContent'>

        </no-content>
    </div>

</template>
<script>
    import Vue from 'vue'
    import $ from 'jquery'
    import methods from '../../../methods'
    import cTimepicker from '../../../components/timepicker'
    import noContent from '../../no_content'
    import {
        mapState,
        mapActions
    } from 'vuex'
    import bus from '../../../bus.js'
    import moment from "moment";
    export default {
        props: ['active', 'shownotturn', 'titledeptid', 'deptname'],
        name: 'rotation_admin_right',
        components: {
            noContent,
            cTimepicker
        },
        filters: {
            date: function (value) {
                if (value) {
                    return value.split('-').join('.')
                } else {
                    return
                }

            }
        },
        data() {
            return {
                issubmit: false,
                turndoctors: [],
                showDate: false,
                gettime: {
                    show: false,
                    isday: false,
                    istime: false,
                    custom: true
                },
                defaultyears: [2018, 2025],
                months: [1, 12],
                condition: '入科日期选择',
                tpdid: 0,
                uid: '',
                num: '',
                year: 2000,
                month: 1,
                Year: 0,
                Month: 0,
                key: 0,
                showCurrentYear: true,
                showCurrentMonth: true,
                noContent: false,
                enterNum: 0,
                reasonlist: '',
                reason: '',
                showreason: false,
                data: '',
                timeShow:false,
                realBeginTime:new Date(),//入科时间
                maxDate:new Date(),
                minDate:new Date(1990, 0, 1),
                formatter(type, val) {
                  if (type === 'year') {
                    return val + '年';
                  }
                  if (type === 'month') {
                    return val + '月';
                  }
                  if (type === 'day') {
                    return val + '日';
                  }
                  return val;
                },
            }
        },
        watch: {
            'active': function (val, oldVal) {
                if (val) {
                    this.init()
                }
            },
            'showreason': function (val, oldval) {
                if (val == false) {
                    this.reason = '';
                    this.reasonlist.map(k => {
                        k.ischecked = false;
                    })
                }
            },
            'titledeptid': function (val, oldval) {
                if (val && oldval != val) {
                    this.init()
                }
            },
            'deptname': function (val, oldval) {
                if (val && val != oldval) {
                    this.deptname = val;
                }
            }
        },
        computed: {
            ...mapState(["roleAuthority"])
        },
        mounted() {
            this.getRoleAuthority(["app:wait:confirmInDept", "app:run:assignTeacher"]);
            if (this.$route.query.deptid && this.$route.query.where == 2) {
                this.titledeptid = this.$route.query.deptid
            };
            this.$nextTick(function () {
                let self = this
                //     self.init()
                self.initreason()
            })
        },
        methods: {
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast',
                'setTurninfo',
                "getRoleAuthority"
            ]),
            // 待入科数据
            init(date) {
                let self = this
                self.post('/turn/querytoturndoctors', {
                    command: 'turn/querytoturndoctors',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    // deptid: self.titledeptid,
                    deptIdList: !Array.isArray(self.titledeptid) ? [self.titledeptid] : self.titledeptid,
                    turnstatus: 0,//未轮转：4 ； 待入科：0 ；
                    month: date,
                    includeChildDeptFlag: "0"
                }).done(function (data) {
                    self.turndoctors = data.turndoctors
                    if (self.turndoctors.length == 0) {
                        self.noContent = true
                    } else {
                        self.noContent = false
                    }
                }).fail(function (error) {
                    self.noContent = true
                })
            },
            initreason() {
                let self = this
                self.post('/traineestudent/queryDictionaryList', {
                    command: 'traineestudent/queryDictionaryList',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    code: 'turnnotinfo'
                }).done(function (data) {
                    if (data && data.errcode == 0) {
                        data.dic_list.map(value => {
                            value.ischecked = false;
                        })
                    }
                    self.reasonlist = data.dic_list;
                })
            },
            // 处理日期
            checkdate: function (value) {
                if (val) {
                    return value.split('-').join('.')
                }
            },
            // 点击列表去计划页面
            plan: function (item) {
                this.setTurninfo({ k: 'stuid', v: item.id });
                this.$router.push({
                    name: 'fdRotation_doctor_plan',
                    query: {
                        where: 2,
                        type: 2,
                        deptid: this.titledeptid,
                        deptname: this.deptname,
                    }
                })
            },
            // 在月份小于10的情况下，前面加上0
            checkDate: function (date) {
                if (date < 10) {
                    return '0' + date
                } else {
                    return date
                }
            },
            selecttime(data) {
                this.condition = data;
                // this.endtime = data;
                this.init(data);
            },
            // 点击入科确认按钮
            confirmCourse: function (item) {
                let self = this
                self.tpdid = item.tpdid
                self.uid = item.id
                self.num = item.num
                // this.showConfirm({
                //     title: '入科确认',
                //     msg: '确认该住院医生入科吗？',
                //     theme: 'modal-confirm modal-white',
                //     cancel: function () { },
                //     ok: function () {
                //         // 入科确认
                //         self.confirm(self.tpdid, self.uid, self.num)
                //     },
                // })
                this.timeShow = true
            },
            timeConfirm(){
                console.log(this.realBeginTime,moment(this.realBeginTime).format("YYYY-MM-DD"));
                let self = this
                self.confirm(self.tpdid, self.uid, self.num)
                this.timeShow = false
            },
            confirm: function (tpdid, uid, num) {
                let self = this;
                self.issubmit = true;
                self.post('/turn/updateturnstatus', {
                    command: 'turn/updateturnstatus',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    turnstatus: 1,
                    tpdid: tpdid,
                    uid: uid,
                    num: num,
                    realBeginTime:moment(this.realBeginTime).format("YYYY-MM-DD")
                }).done((data) => {
                    if (data && data.errcode == 0) {
                        self.issubmit = false;
                        self.showAlert({
                            msg: '入科成功！',
                        });
                        self.init();
                    } else if (data && data.errdesc) {
                        self.issubmit = false;
                        self.showAlert({
                            msg: data.errdesc,
                        });
                    }
                }).fail(() => {
                    self.issubmit = false;
                    self.showAlert({
                        msg: '入科失败！',
                    });
                });
            },
            confirmTurn(item) {
                this.showreason = true;
                this.tpdid = item.tpdid;
                this.uid = item.id;
                this.num = item.num
            },
            changTurnStatus() {
                let self = this;
                let _turnnotkeylist = [];
                this.reasonlist.map(value => {
                    if (value.ischecked == true) {
                        _turnnotkeylist.push(value.key)
                    }
                });
                if (_turnnotkeylist.length == 0) {
                    this.toast('请选择未轮转原因！');
                    return
                }
                self.post('/turn/updateturnstatus', {
                    command: 'turn/updateturnstatus',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    tpdid: self.tpdid,
                    uid: self.uid,
                    num: self.num,
                    turnstatus: 4,
                    remark: self.reason,
                    turnnotkeylist: _turnnotkeylist
                }).done((data) => {
                    if (data && data.errcode == 0) {
                        self.toast('修改成功.');
                        self.showreason = false;
                        self.init();
                    } else if (data && data.errdesc) {
                        self.showAlert({
                            msg: data.errdesc,
                        });
                    }
                }).fail(() => {
                    self.showAlert({
                        msg: '修改失败！',
                    });
                });
            },
            getchecked(param) {
                this.reasonlist.map(value => {
                    if (value.key === param) {
                        value.ischecked = value.ischecked == false ? true : false;
                    }
                })
            },
        }
    }

</script>
<style lang="scss" scoped>
    .g-main {
        height: 100vh;
        margin-top: 0.8rem;
        font-size: 0.22rem;
        background: #f8f7f9 !important;
        color: rgb(100, 100, 100);
    }

    .modal-body {
        text-align: center !important;
    }

    .title {
        height: 0.8rem;
        line-height: 0.8rem;
        background: rgb(253, 253, 253);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.2rem 0.3rem;
        position: fixed;
        top: 1.47rem;
        border-top: solid 1px #c3c3c3;
        z-index: 5;
        font-size: 0.24rem;
        width: 100%;
    }

    .title img {
        width: 0.4rem;
        height: 0.4rem;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: all .5s;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }

    .slide-enter-active,
    .slide-leave-active {
        transition: all .5s;
    }

    .slide-enter,
    .slide-leave-active {
        transform: translateY(100%);
        opacity: 0;
    }

    .date {
        position: fixed;
        top: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.2);
        z-index: 10;
    }

    .modelCont {
        width: 100%;
        height: 4rem;
        background: white;
        position: absolute;
        bottom: 0;
    }

    .modelHeader {
        width: 100%;
        height: 0.8rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: solid 1px #c3c3c3;
        padding: 0 0.2rem;
    }

    .modelHeader a:nth-last-of-type(1) {
        color: #3499db;
    }

    #centerp {
        border-top: solid 1px #c3c3c3;
        border-bottom: solid 1px #c3c3c3;
        width: calc(100% - 0.4rem);
        height: 0.6rem;
        position: absolute;
        z-index: 5000;
        bottom: 1.3rem;
        margin-bottom: 0;
        /*margin-right: 0.2rem;*/
    }

    .modelWating {
        width: 100%;
        height: 3.2rem;
        overflow: hidden;
        /*overflow-y: auto;*/
        display: flex;
        justify-content: center;
    }

    /*.first,.second{
        width: 32%;
        height: 3.2rem;
        overflow: auto;
        padding: 1.3rem 0;
    }*/
    .modelWating ul {
        width: 32%;
        /*height: 100%;*/
        height: 3.2rem;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 1.3rem 0;
    }

    .modelWating ul li {
        width: 100%;
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
        color: #c3c3c3;
        position: relative;
    }

    .active {
        color: black !important;
    }

    ::-webkit-scrollbar {
        display: none;
    }

    .list {
        padding-top: 0;
        background: rgb(252, 252, 252);
    }

    .list ul {
        /*background: white;*/
        padding: 0 0.3rem 0;
        /*font-size: 0.24rem;*/
    }

    .list ul p {
        margin: 0;
    }

    .list ul li {
        padding: 0.05rem 0;
    }

    .list ul li:nth-of-type(1) {
        border-bottom: solid 1px rgb(240, 240, 240);
        padding: 0.1rem 0;
    }

    .list ul li:nth-of-type(2) {
        padding-top: 0.1rem;
    }

    .list ul li:nth-last-of-type(1) {
        /*border-bottom: none;*/
        padding-bottom: 0.1rem;
    }

    .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .headDiv {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        /*padding: 0.05rem 0;*/
    }

    .headDiv div {
        width: calc(100% - 1rem);
    }

    .headerName {
        width: 100%;
    }

    .headerName span:nth-of-type(1) {
        margin-bottom: 0.1rem;
    }

    .headerName span:nth-of-type(2) {
        float: right;
    }

    .headDiv img {
        width: 0.66rem;
        height: 0.66rem;
        margin-right: 0.2rem;
    }

    .footerBtn {
        border-top: solid 1px rgb(240, 240, 240);
        text-align: right;
        padding: .1rem 0;
        margin: 0 0.3rem;
    }

    .footerBtn a {
        background: #3499db;
        color: white;
        padding: 0.1rem;
        border-radius: 0.1rem;
    }

    .for-reason {
        position: absolute;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        z-index: 99;
        background: rgba(0, 0, 0, 0.5);
        .reason-content {
            border-radius: 10px;
            width: 80%;
            background: #fff;
            z-index: 100;
            header {
                text-align: center;
                line-height: .5rem;
                padding: .2rem 0;
            }
            section {
                padding: 0 .2rem;
                label {
                    margin: .1rem;
                }
                textarea {
                    width: 100%;
                    border: 1px solid #eee;
                    padding: .1rem;
                    margin: .2rem 0;
                }
            }
            footer {
                display: flex;
                justify-content: space-around;
                padding: .1rem;
                border-top: .01rem solid #eee;
                a {
                    line-height: .5rem;
                    color: #3499db;
                }
            }
        }
    }

    .radio {
        width: .25rem;
        height: .25rem;
        position: relative;
        box-shadow: #dfdfdf 0 0 0 0 inset;
        border-radius: .15rem;
        border-top-left-radius: .15rem;
        border-top-right-radius: .15rem;
        border-bottom-left-radius: .15rem;
        border-bottom-right-radius: .15rem;
        background-clip: content-box;
        display: inline-block;
        -webkit-appearance: none;
        user-select: none;
        outline: none;

        background-image: url('../../../assets/images/gouxuan.png');
        background-size: cover;
        margin-right: 0.05rem;
    }

    .radio:checked {
        background-image: url('../../../assets/images/gouxuan_on.png');
        background-size: cover
    }

    .noclick {
        pointer-events: none;
    }
    
</style>