<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            活动详情
            <template>
                <div class="btn-group" v-show="showadd" slot="headerRight">
                    <img @click="addconfig.show = true" src="../../assets/images/icon_zengjia.png" />
                </div>
            </template>
        </c-header>
        <!--add content-->
        <add-group :config='addconfig' :data-list="addlist" @confirm="addselect">

        </add-group>
        <!--二维码-->
        <i class="shade" v-show="code"></i>
        <div class="codecontent" v-show="code" @click="closecode">
            <div id="code"></div>
        </div>

        <!-- <div class="g-main">
            <ul class="main">
                <li>
                    <label>活动级别</label>
                    <span>{{detail.actionlevelname}}</span>
                </li>
                <li>
                    <label>{{detail.actionplanlevel | levelname}}</label>
                    <span>{{detail.showofficename}}</span>
                </li>
                <li>
                    <label>活动主题</label>
                    <span>{{detail.theme}}</span>
                </li>
                <li>
                    <label>活动类型</label>
                    <span>{{detail.typename}}</span>
                </li>
                <li>
                    <label>开始时间</label>
                    <span>{{ detail.starttimestr }}</span>
                </li>
                <li>
                    <label>结束时间</label>
                    <span>{{ detail.endtimestr }}</span>
                </li>
                <li>
                    <label>活动地点</label>
                    <span>{{detail.place}}</span>
                </li>
                <li @click="toshowlist(1)">
                    <label>主讲人</label>
                    <p class="choice">
                        <i v-for='(val,index) in detail.speakerlist'>{{val.uname}}</i>
                    </p>
                </li>
                <li @click="toshowlist(2)" v-if="detail.actionplanlevel != 'hospital' ">
                    <label>参与人员</label>
                    <span class="choice">{{detail.attendercount}}人</span>
                </li>
                <li v-if="detail.actionplanlevel == 'hospital' ">
                    <label>参与人员</label>
                    <span>{{detail.attendercount}}人</span>
                </li>
                <li v-show="detail.remark">
                    <label>备注</label>
                    <span>{{detail.remark}}</span>
                </li>
                <li class="add" v-show="detail.fileuploadlist && detail.fileuploadlist.length>0">
                    <div class="all">
                        <label>附件</label>
                        <div class="video">
                            <a v-for='(val,index) in detail.fileuploadlist' v-if="val.type == 1" @click="dowmload(fdfsurl + '/' + val.fileurl,val.filename)">{{val.filename}}</a>
                        </div>
                    </div>
                </li>
                <li class="add" v-show="videolist.length > 0">
                    <div class="all">
                        <label>视频</label>
                        <div class="video">
                            <a target="_blank" href="javascript:void(0)" v-for='(val,index) in videolist' v-if="val.type == 7" @click="vedioOpen(val)">{{val.filename}}</a>
                        </div>
                    </div>
                </li>
            </ul>
        </div> -->
        <div class="g-main">

            <div class="teachingPlan-detail">
                <div class="topDetail">
                    <p class="theme">
                        <span class="title">{{ detail.theme }}</span>
                        <span class="typeTips">{{ detail.typename }}</span>
                    </p>
                    <p class="info">
                        <span>{{ detail.speakers }}&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                        <span>{{ detail.actionlevelname }}&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                        <span>{{ detail.showofficename }}</span>
                    </p>
                </div>
                <div class="baseInfo activeTime">
                    <div class="title">

                        <div class="left">
                            <img src="../../assets/images/baseinfo.png">
                            <span>基本信息</span>
                        </div>
                        <span class="detailBtn" @click="toshowlist(2)">查看详情</span>
                    </div>
                    <p class="address">活动地点：{{ detail.place }}</p>
                    <p>参与人员：{{ detail.attendercount }}人</p>
                    <p>{{ detail.period ? '学时: ' + detail.period : '' }}</p>
                </div>
                <div class="activeTime">
                    <div class="title">
                        <div class="left">
                            <img src="../../assets/images/activetime.png">
                            <span>活动时间</span>
                        </div>
                        <span class="detailBtn" @click="checkTime">查看详情</span>
                    </div>
                    <div class="timeBox" v-if="detail.showTime && detail.showTime.length > 0">
                        <div class="boxItem" v-for="(item, index) in detail.showTime" :key="index">
                            <p>{{ item.date }}</p>
                            <p>{{ item.startTime }}-{{ item.endTime }}</p>
                        </div>
                    </div>
                </div>
                <div class="baseInfo psinfo" v-show="detail.remark">
                    <div class="title">
                        <img src="../../assets/images/psinfo.png">
                        <span>备注</span>
                    </div>
                    <p class="p-title">{{ detail.remark }}</p>
                </div>
                <div class="baseInfo psinfo otherFils" v-if="detail.fileuploadlist && detail.fileuploadlist.length > 0">
                    <div class="title">
                        <img src="../../assets/images/otherInfo.png">
                        <span>附件</span>
                    </div>
                    <p v-for='(val, index) in detail.fileuploadlist' class="otherItem"
                        @click="dowmload(fdfsurl + '/' + val.fileurl, val.filename)">{{ val.filename }}</p>
                </div>
                <div class="baseInfo psinfo otherFils" v-if="videolist.length > 0">
                    <div class="title">
                        <img src="../../assets/images/vedio.png">
                        <span>视频</span>
                    </div>
                    <a target="_blank" href="javascript:void(0)" class="otherItem" v-for='(val, index) in videolist'
                        @click="vedioOpen(val)">{{ val.filename }}</a>
                </div>
            </div>

        </div>
        <van-dialog v-model="showTime" :title="dialogTitle" className="timeDialog-detail">
            <van-steps direction="vertical" :active="-1" class="detailTime">
                <van-step v-if="pastTime.length > 1">
                    <p class="pastTime">
                        <span>{{ pastTime.length }}个已过时段</span>
                        <span class="actionBtn" v-if="!isShowDetail" @click="toggleArrow">展开<van-icon name="arrow-down"
                                color="#2F7DCD" size="15px"></van-icon></span>
                        <span class="actionBtn" v-else @click="toggleArrow">收起<van-icon name="arrow-up" color="#2F7DCD"
                                size="15px"></van-icon></span>
                    </p>
                    <div class="pastBox" v-if="isShowDetail">
                        <p v-for="(item, index) in pastTime" :key="indx">{{ item.dateStr }}</p>
                    </div>
                </van-step>
                <van-step v-if="pastTime.length == 1">
                    <p>{{ pastTime[0].dateStr }}</p>
                </van-step>
                <van-step v-for="(item, index) in currentTime" :key="indx">
                    <p :class="index == 0 ? 'firstItem' : ''"> <img src="../../assets/images/entime.png" class="timeicon"
                            v-if="index == 0" width="18" /><span>{{ item.dateStr }}</span></p>
                </van-step>
            </van-steps>
        </van-dialog>

        <!--查看已选参与人员 -->
        <c-modal :config="showdetail">
            <div class="flex-item class-sel-list">
                <div class="list info-list list-inner">
                    <ul class="doctorupdata">
                        <li v-for="(val, index) in showlist">
                            <span>
                                {{ val.name }}
                                <!-- <span v-if="val.username">-{{val.username}}</span> -->
                                <span v-if="val.count">(人)</span>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </c-modal>

    </div>
</template>
<script>
import methods from '../../methods';
import cHeader from '../header';
import $ from 'jquery';
import addGroup from '../../components/add-group';
import cModal from '../../components/modal';
import { mapState, mapActions } from 'vuex'
export default {
    data() {
        return {
            isShowDetail: false,
            pastTime: [],
            currentTime: [],
            dialogTitle: "",
            showTime: false,
            showadd: false,//加号
            code: false,//二维码
            detailid: '',
            detail: '',
            fdfsurl: '',
            showlist: [],
            showdetail: {
                show: false,
                title: '查看主讲人',
                hideOnClickOut: true,
            },
            addconfig: {
                show: false,
                label: 'name',
                fixedtop: '.8rem',
                fixedright: '.1rem'
            },
            addlist: [
                {
                    name: '编辑',
                    key: 'editflag',
                    router: "fdAction_edit",
                    isused: false
                },
                {
                    name: '二维码',
                    key: 'ercode',
                    isused: false
                },
                {
                    name: '记录',
                    key: 'statistics',
                    router: "fdAction_census",
                    isused: false
                },
                {
                    name: '反馈',
                    key: 'evaluate',
                    router: "fdAction_tickling",
                    isused: false
                }
            ],
            videofdfsurl: '',
            videolist: [],
        }
    },
    components: {
        cHeader,
        addGroup,
        cModal
    },
    computed: {

    },
    watch: {

    },
    filters: {
        'levelname': function (val) {
            return val == 'hospital' ? '医院' : val == 'base' ? '基地' : '科室'
        },
        'name': function (val) {
            return val == 'base' ? '正在该基地轮转的学员' : val == 'trun' ? '专业在该基地的学员' : ''
        }
    },
    created() {
        this.detailid = this.$route.query.id;
    },
    mounted() {
        let self = this;
        this.initcodelist();
        this.$nextTick(function () {
            require('../../config/jquery.qrcode.min.js');
        });
        this.registerToNative('goBack', function (data) {
            self.back()
        });
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
        toggleArrow() {
            this.isShowDetail = !this.isShowDetail
        },
        //视频展示
        initvideo() {
            this.post('/actionplan/getuploadpicinfo', {
                command: 'actionplan/getuploadpicinfo',
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                actionplanid: this.detailid,
                searchflag: 1,//0查询暂存    1：查询实际提交信息
            }).done(res => {
                this.videolist = res.bean.piclist ? res.bean.piclist : [];
                this.videolist = this.videolist.filter(item => { return item.type == 7 })
                this.videofdfsurl = res.fdfsurl;
            });
        },
        //
        vedioOpen(item) {
            this.invokeNative('OpenDocument', {
                url: this.videofdfsurl + item.fileurl,
                filename: item.filename
            });
        },
        initcodelist() {//获取权限
            let self = this;
            this.post('/actionplanbase/getjurisdictionbycoode', {
                command: 'actionplanbase/getjurisdictionbycoode',
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                beanlist: [
                    {
                        uid: $.cookie('uid'),
                        jurisdiccode: 'ercode',
                        id: self.detailid
                    }, {
                        uid: $.cookie('uid'),
                        jurisdiccode: 'statistics',
                        id: self.detailid
                    }, {
                        uid: $.cookie('uid'),
                        jurisdiccode: 'evaluate',
                        id: self.detailid
                    },
                ]
            }).done((data) => {
                if (data && data.errcode == 0) {
                    data.jurisdiclist.map(value => {
                        self.addlist.map(val => {
                            if (value.jurisdiccode == val.key) {
                                val.isused = value.jurisdicvalue
                            }
                        })
                    });
                    this.init()
                } else if (data.errdesc) {
                    self.toast(data.errdesc)
                } else {
                    self.toast('服务器错误，请联系管理员。')
                }
            })
        },
        checkTime() {
            this.showTime = true
            this.detail.actiontime.forEach(item => {
                let dateTemp = item.date.split("-");
                let startTime = item.startTime.split(":").slice(0, 2).join(":")
                let endTime = item.endTime.split(":").slice(0, 2).join(":")
                item.dateStr = dateTemp[0] + "月" + dateTemp[1] + "日 " + startTime + "-" + endTime
            })
            // this.allTime = item.actiontime
            this.pastTime = this.detail.actiontime.filter(fitem => {
                return fitem.subtract <= 0
            }).sort((a, b) => {
                return a.subtract - b.subtract
            })
            this.currentTime = this.detail.actiontime.filter(fitem => {
                return fitem.subtract > 0
            }).sort((a, b) => {
                return a.subtract - b.subtract
            })
            console.log(this.pastTime, this.currentTime, "----")
            this.dialogTitle = this.detail.theme
        },
        init() {//获取详情
            let self = this;
            this.post('/actionplan/getactionplandetail', {
                command: 'actionplan/getactionplandetail',
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                uid: $.cookie('uid'),
                actionplanid: self.detailid,
                clientflag: 1
            }).done(res => {
                console.log("fafaaf", res)
                // if(res.bean.actionplanlevel == "hospital") {
                //     for(let i = 0;i<res.bean.attendinfolist.length;i++) {
                //         if(res.bean.attendinfolist[i].bustype != "grade") {
                //             res.bean.attendinfolist.splice(i,1)
                //             i--
                //         }
                //     }
                // }
                self.addlist[0].isused = res.bean.editflag;
                for (let i = 0; i < self.addlist.length; i++) {
                    if (self.addlist[i].isused == 1) {
                        self.showadd = true;
                        break
                    }
                }

                res.bean.actiontime = JSON.parse(res.bean.actiontime)
                console.log(res.bean.actiontime)
                let timeArr = []
                let current = (new Date()).getTime();
                res.bean.actiontime.forEach(titem => {
                    let temp = titem.date.replace(/-/g, "/")
                    console.log(titem, "---")
                    let timeTemp = new Date(temp + " " + titem.endTime).getTime();
                    let subtract = Number(timeTemp) - Number(current)
                    let tempDate = titem.date.split("-")
                    titem.date = tempDate[1] + "-" + tempDate[2]
                    titem.startTime = titem.startTime.split(":").slice(0, 2).join(":")
                    titem.endTime = titem.endTime.split(":").slice(0, 2).join(":")
                    titem.subtract = subtract
                    timeArr.push({
                        subtract,
                        ...titem
                    })
                })
                let stemp = []
                res.bean.speakerlist.forEach(item => {
                    stemp.push(item.uname)
                })
                res.bean.fileuploadlist = res.bean.fileuploadlist.filter(item => { return item.type == 1 })
                res.bean.speakers = stemp.join("、")
                res.bean.showTime = timeArr.filter(fitem => { return fitem.subtract > 0 }).sort((a, b) => {
                    return a.subtract - b.subtract
                })
                if (res.bean.showTime.length > 3) {
                    res.bean.showTime = res.bean.showTime.slice(0, 2);
                }
                self.detail = res.bean;
                self.fdfsurl = res.fdfsurl;
            });
            this.initvideo();
        },
        update() {//修改
            let self = this;
            this.$router.push({
                name: 'fdAction_edit',
                query: {
                    id: self.detailid,
                    ishistory: self.$route.query.ishistory
                }
            })
        },

        toshowlist(param) {
            this.showlist = [];
            if (param == 1) {
                this.showdetail.title = '查看主讲人';
                this.detail.speakerlist.map(value => {
                    this.showlist.push({ name: value.uname, username: value.username, id: value.uid })
                });
            } else {
                this.showdetail.title = '查看参与人员';
                this.detail.attendinfolist.map(value => {
                    if (value.type == 1) {
                        // this.showlist.push({ name: value.attendbusinfo.split('-')[0], count: value.attendbusinfo.split('-')[1], type: value.type, id: value.attendbusid })
                        this.showlist.push({ name: value.attendbusinfo, count: true, type: value.type, id: value.attendbusid })
                    } else {
                        this.showlist.push({ name: value.attendbusinfo, count: false, type: value.type, id: value.attendbusid })
                    }
                });
            }
            this.showdetail.show = true;
        },

        census() {//统计
            let self = this;
            this.$router.push({
                name: 'fdAction_census',
                query: {
                    id: self.detail.id,
                    ishistory: self.$route.query.ishistory,
                    status: this.detail.status,
                }
            })
        },
        qrcode() {//二维码
            let self = this;
            let result = JSON.stringify({
                type: 10,
                actionplanid: this.detail.id
            });
            $("#code").qrcode({
                text: result,
                width: 200,
                height: 200,
            });
            self.code = true;
        },
        closecode() {
            this.code = false;
            $('#code').html("")
        },
        torecord() {//验证是否可评价
            let self = this;
            self.post('/turnevaluate/validatevaluate', {
                command: 'turnevaluate/validateEvaluate',
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                uid: $.cookie('uid'),
                businessid: self.detailid,
                type: 6
            }).done(function (data) {
                if (data && data.errcode == 0) {
                    // self.$router.push({
                    //     name: 'fdAction_tickling',
                    //     query: {
                    //         id: self.detailid,
                    //         ishistory: self.$route.query.ishistory
                    //     }
                    // })
                    self.$router.push({
                        name: "scoreTableActivies",
                        query: {
                            businessId: self.$route.query.id,
                            routeTitleName: "反馈",
                            category: 5,
                            type: self.detail.type,
                            deptId: self.detail.deptid,
                            saveShow: false
                        }
                    })
                } else if (data.errcode == 400102) {
                    // self.$router.push({
                    //     name: 'fdAction_tickling',
                    //     query: {
                    //         id: self.detailid,
                    //         ishistory: self.$route.query.ishistory,
                    //         from: true
                    //     }
                    // })
                    self.$router.push({
                        name: "scoreTableActivies",
                        query: {
                            businessId: self.$route.query.id,
                            routeTitleName: "反馈",
                            category: 5,
                            type: self.detail.type,
                            deptId: self.detail.deptid,
                            saveShow: false
                        }
                    })
                } else {
                    self.toast(data.errdesc)

                }
            });
        },
        dowmload(param, name) {//查看文件
            this.invokeNative('OpenDocument', {
                url: param, filename: name
            })
        },
        addselect(param) {
            let self = this;
            this.addconfig.show = false;
            if (param.key == 'ercode') {
                self.qrcode();
            } else if (param.key == 'editflag') {
                self.update(param.router)
            } else if (param.key == 'statistics') {
                self.census(param.router)
            } else if (param.key == 'evaluate') {
                self.torecord(param.router)
            }
        },
        back() {
            if (localStorage.getItem("entrance") && localStorage.getItem("entrance") == "wxHome") {
                window.location.href = "/pages/futuredoctorapp/index.html/#/wxIndex";
            } else {
                if (this.$route.query.ishistory == true) {
                    this.$router.push({
                        name: 'fdAction_history',
                    })
                } else {
                    this.$router.push({
                        name: 'fdAction_list',
                    })
                }
            }

        },
    }
}
</script>
<style>
.timeDialog-detail .van-step--vertical:not(:last-child):after {
    border-bottom-width: 0px !important;
}

.timeDialog-detail {
    border-radius: 8px !important;
    /* min-height: 200px; */
}

.timeDialog-detail .van-dialog__content {
    min-height: 320px;
    max-height: 370px;
    overflow-y: scroll;
    margin-top: 16px;
}

.timeDialog-detail .van-dialog__header {
    font-weight: bold;
    font-size: 18px;
    color: #111;
}
</style>
<style lang="scss" scoped>
.p-title {
    overflow-wrap: anywhere;
}

.pastTime {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.pastTime:nth-child(1) {
    font-size: 16px;
    color: #111;
}

.pastTime .actionBtn {
    font-size: 14px;
    color: #2F7DCD;
}

.pastTime .actionBtn i {
    margin-left: 3px;
    vertical-align: middle;
}

.pastBox {
    background: #F6F6F6;
    padding: 12px;
    margin-top: 10px;
}

.firstItem {
    font-size: 16px;
    color: #2F7DCD;
    font-weight: bold;
}

.timeicon {
    margin-right: 8px;
    vertical-align: middle;
}

.pastBox p {
    line-height: 24px;
}

.g-main {
    /* padding-top: 6px; */
    margin-top: 0 !important;
}

.btn-group {
    height: .76rem;

    img {
        width: .4rem;
        height: .4rem;
        margin-top: .18rem;
        margin-left: .15rem;
    }
}

.g-main {
    margin-top: 0.1rem;

    li:nth-child(2),
    li:nth-child(4),
    li:nth-child(7) {
        border-bottom: 1px solid #eee;
        margin-bottom: 0
    }
}

li {
    background: #fff;
    height: .65rem;
    line-height: .65rem;
    padding: 0 0.4rem;
    position: relative;
    color: #666;
    font-size: 0.26rem;
    font-family: "Microsoft YaHei";
    margin-bottom: 0.1rem;
    display: flex;

    label {
        flex: 1;
        line-height: 0.65rem;
        text-align: justify;
        text-align-last: justify;
        margin-right: 0.3rem;
        vertical-align: top;
    }

    >textarea {
        display: flex;
        flex: 3;
    }

    >div,
    >span,
    >input {
        display: flex;
        flex: 3;
        height: .62rem;
        line-height: .62rem;
        overflow: hidden;

        span {
            flex: 1;
            width: 0;
            line-height: .62rem;
        }
    }

    >p {
        flex: 3;
        height: .62rem;
        padding-right: .2rem;
        overflow: hidden;

        i {
            overflow: hidden;
        }
    }

    i {
        font-style: normal;
        line-height: .65rem;
        padding-right: .1rem;
    }
}

p {
    margin: 0
}

s {
    text-decoration: none;
}

.students,
.remark {
    height: auto;

    p {
        height: auto;
        min-width: 100%;
    }

    span {
        line-height: 0.35rem;
    }
}

.codecontent {
    display: flex;
    width: 100%;
    height: calc(100% - .9rem);
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: 1000;

    #code {
        background: #fff;
        padding: 0.2rem;
        border-radius: 0.2rem;
    }

}

.shade {
    height: 100%;
    width: 100%;
    min-width: 100%;
    min-height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
}

.choice {
    padding-right: 0.4rem;
}

.choice:after {
    content: '';
    display: inline-block;
    flex: 3;
    width: 0.3rem;
    height: 0.3rem;
    background: url("../../assets/images/you-jiantou.png") 0 0 no-repeat;
    background-size: 100% 100%;
    position: absolute;
    right: 0.2rem;
    top: 0.15rem;
}

.all>div {
    flex: 3;

}

.add {
    height: auto;

    .all {
        height: auto;

        .video {
            a {
                color: #3499db;
            }
        }
    }

    a {
        margin: .1rem 0;
    }
}

p {
    margin: 0;
}

.topDetail {
    background-image: linear-gradient(50deg, #78C2F5 0%, #1052D5 100%);
    color: #fff;
    padding: 16px 20px;
}

.topDetail .theme {
    font-size: 20px;
    color: #FFFFFF;
    letter-spacing: 0.24px;
    font-weight: bold;
    overflow-wrap: anywhere;
}

.typeTips {
    padding: 0 4px;
    line-height: 14px;
    border: 1px solid #fff;
    border-radius: 3px;
    margin-left: 8px;
    font-size: 12px;
    font-weight: normal;
}

.info {
    margin-top: 8px;
    opacity: 0.8;
    font-size: 13px;
    line-height: 23px;
}

.info span {
    display: inline;
}

.baseInfo,
.activeTime {
    padding: 16px 14px;
    background: #fff;
}

.baseInfo .title {
    margin-bottom: 10px;
}

.baseInfo .title span,
.activeTime .left span {
    line-height: 22px;
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    vertical-align: middle;
}

.baseInfo .title span.detailBtn {
    font-size: 12px;
    color: #2F7DCD;
    font-weight: normal;
}

.baseInfo .title img,
.activeTime .left img {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin-right: 8px;
    margin-top: -4px;
}

.baseInfo p {
    font-size: 14px;
    color: #666666;
    letter-spacing: 0.2px;
    line-height: 20px;
}

.baseInfo p.address {
    margin-bottom: 4px;
    word-wrap: break-word;
    word-break: break-all;
}


.activeTime,
.psinfo {
    margin-top: 6px;
    background: #fff;
}

.activeTime .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* padding-right: 14px; */
}

.detailBtn {
    font-size: 12px;
    color: #2F7DCD
}

.timeBox {
    margin-top: 12px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: scroll;
}

.timeBox .boxItem {
    flex-shrink: 0;
    padding: 2.5px 16px;
    border: 1px solid rgba(232, 232, 232, 1);
    border-radius: 4px;
    margin-right: 10px;
    text-align: center;
}

.timeBox .boxItem p {
    line-height: 21px;
}

.timeBox .boxItem p:nth-child(1) {
    font-size: 15px;
    color: #333333;
    font-weight: bold;
}

.timeBox .boxItem p:nth-child(2) {
    font-size: 12px;
    color: #999999;
}

/* .timeBox {
        position: relative;
    }

    .timeBox::after {
        position: relative;
        content: "/";
        display: inline-block;
        opacity: 0;

    } */

.timeBox::-webkit-scrollbar {
    display: none;
}

.timeicon {
    margin-right: 8px;
    vertical-align: middle;
}

.firstItem {
    font-size: 16px;
    color: #2F7DCD;
    font-weight: bold;
}

.otherFils .otherItem {
    font-size: 14px;
    color: #2F7DCD;
    margin-bottom: 4px;
}</style>