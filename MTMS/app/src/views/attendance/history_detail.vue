<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            考勤
        </c-header>
        <div class="g-main">
            <p class="workdate">{{ workdate | substr(0, 4) }}年{{ workdate | substr(5, 2) }}月{{ workdate | substr(8, 2) }}日
            </p>
            <div class="census-content">
                <div id="echart"></div>
            </div>
            <div class="info">
                <ul class="getinfo">
                    <li>
                        <span :class="{ 'active': i == 0 }" @click="i = 0; showlist = signinlist">已签到({{ signinlist.length
                        }})</span>
                    </li>
                    <li>
                        <span :class="{ 'active': i == 1 }" @click="i = 1; showlist = notsignlist">未签到({{ notsignlist.length
                        }})</span>
                    </li>
                </ul>
                <ul class="stu-list">
                    <li>
                        <span>姓名</span>
                        <span>学号</span>
                        <span>带教老师</span>
                        <span>出勤情况</span>
                    </li>
                    <template v-show='showlist && showlist.length > 0'>
                        <li :class="{ 'choice': item.editflag == 1, 'noclick': item.editflag == 0 }"
                            @click="status.show = true, id = item.id" v-for="(item, index) in showlist">
                            <span>{{ item.name }}</span>
                            <span>{{ item.username }}</span>
                            <span>{{ item.workusername }}</span>
                            <span>{{ item.workattendancename }}</span>
                        </li>
                    </template>
                    <li v-show='showlist.length == 0'>
                        <span>
                            暂无内容
                        </span>
                    </li>
                </ul>
            </div>
            <!--更新状态-->
            <c-picker :config="status" @confirm="changeSinginStatus">

            </c-picker>
            <van-popup v-model="listShow" :lazy-render="false" :close-on-click-overlay="false" position="bottom">
                <van-picker ref="van_picker" show-toolbar
                    :title="workattendanceType == '3' ? '旷工' : (workattendanceType == '4' ? '迟到' : (workattendanceType === '5' ? '早退' : '其他'))"
                    :columns="columns" @cancel="onCancel" @confirm="onConfirm">
                    <template #option="option">
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div>{{ option }}{{ workattendanceType == '3' ? '天' : '分钟' }}</div>
                        </div>
                    </template>
                </van-picker>
            </van-popup>
        </div>
    </div>
</template>
<script>
import methods from '../../methods';
import { mapState, mapActions } from 'vuex'
import cHeader from '../header';
import cPicker from '../../components/default-picker'
import echarts from 'echarts/lib/echarts';
import { Toast } from 'vant';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/pie'
export default {
    props: ['active'],
    data() {
        return {
            id: '',
            opinion: ['签到', '请假', '旷工', '迟到', '早退'],
            opinionData: [],
            deptid: '',
            deptlist: '',
            signinlist: [],
            notsignlist: [],
            i: 0,
            showlist: [],
            status: {
                show: false,
                mainlist: [],
                valueKey: 'name'
            },
            colTitle: '',
            listShow: false,
            workattendanceType: '',
            columns: [],
            day_columns: [1, 0.5]
        }
    },
    components: {
        cPicker,
        cHeader
    },
    watch: {

    },
    filters: {
        rate: function (value) {
            return Number(value).toFixed(2);
        },
    },
    computed: {
        ...mapState([
            'turninfo',
            'systype',
            'singindept',
            'turnstatus'
        ]),
    },
    created() {
        this.workdate = this.turninfo.workdate;
    },
    mounted() {
        let self = this;
        this.init();
        this.getstulist();
        this.initstatus();
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
            'toast',
            'setSystype',
            'setSingindept',
        ]),
        initstatus() {
            let self = this;
            this.post('/traineestudent/queryDictionaryList', {
                command: 'traineestudent/queryDictionaryList',
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                // code:'workattendancetype'
                code: 'workattendancetype_pub'
            }).done(res => {
                if (res && res.errcode) {
                    if (res.errcode == 0) {
                        self.status.mainlist = res.dic_list;
                    } else {
                        self.toast(res.errdesc);
                    }
                } else {
                    self.toast('系统错误，请联系管理员~')
                }
            });
        },
        init() {
            let self = this;
            this.post('/workattendance/workattendancedayanalysis', {
                command: 'workattendance/workattendancedayanalysis',
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                systype: self.systype,
                deptid: self.singindept,
                workdate: self.workdate,
                stdtype: self.turnstatus
            }).done(res => {
                if (res && res.errcode == 0) {
                    self.opinionData = '';
                    self.opinionData = [
                        { 'value': res.bean.signpercent, 'name': '签到' },
                        { 'value': res.bean.leavepercent, 'name': '请假' },
                        { 'value': res.bean.absencepercent, 'name': '旷工' },
                        { 'value': res.bean.latepercent, 'name': '迟到' },
                        { 'value': res.bean.earlyretreatpercent, 'name': '早退' },
                        // {'value':res.bean.otherpercent,'name':'其他'},
                    ];
                    self.$nextTick(function () {
                        self.drawGraph('echart')
                    }
                    );
                } else if (res.errdesc) {
                    self.toast(res.errdesc)
                } else {
                    self.toast('服务器错误，请联系管理员。')
                }
            });
        },
        drawGraph: function (id) {
            //饼图
            let self = this;
            self.chart = echarts.init(document.getElementById(id));
            this.chart.showLoading();
            self.chart.setOption({
                title: {
                    text: '考勤分析',
                    x: 'center',
                },
                tooltip: {
                    trigger: 'item',
                    show: false,
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    bottom: 0,
                    left: 'center',
                    data: self.opinion,
                    itemHeight: 10,
                    itemWidth: 10,
                    itemGap: 6,
                    textStyle: { fontSize: 12 }
                },
                series: [
                    {
                        type: 'pie',
                        center: ['50%', '50%'],
                        radius: ['35%', '50%'],
                        data: self.opinionData,
                        label: {
                            normal: {
                                formatter: '{b}：{d}%  ',
                            }
                        },
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ],
                color: ['#c7f316', '#38ce9b', '#ebb600', '#00b4f4', '#f97a1c', '#a550f5']
            });
            this.chart.hideLoading();
        },
        //获取人员列表
        getstulist() {
            let self = this;
            this.post('/workattendance/getworkattendanceforsecretary', {
                command: 'workattendance/getworkattendanceforsecretary',
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                uid: $.cookie('uid'),
                systype: self.systype,
                deptid: self.singindept,
                workdate: self.workdate,
                stdtype: self.turnstatus
            }).done(res => {
                if (res && res.errcode == 0) {
                    self.signinlist = res.result.signlist;
                    self.notsignlist = res.result.notsignlist;
                    self.showlist = self.i == 0 ? res.result.signlist : res.result.notsignlist;
                } else if (res.errdesc) {
                    self.toast(res.errdesc)
                } else {
                    self.toast('服务器错误，请联系管理员。')
                }
            });
        },
        // 修改状态
        changeSinginStatus(data) {
            let self = this;
            self.workattendanceType = data.key;
            if (data.key == "3") {
                self.columns = self.day_columns
                self.listShow = true
                return
            } else if (data.key == '4' || data.key == '5') {
                self.columns = self.generateArray()
                self.listShow = true
                return
            }
            this.post('/workattendance/updateworkattendance', {
                command: 'workattendance/updateworkattendance',
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                id: self.id,
                workattendancetype: data.key
            }).done(res => {
                if (res && res.errcode) {
                    if (res.errcode == 0) {
                        self.status.show = false;
                        self.toast('修改成功~');
                        self.getstulist();
                        self.init();
                    } else {
                        self.toast(res.errdesc);
                    }
                } else {
                    self.toast('系统错误，请联系管理员~')
                }
            });
        },
        back() {
            this.$router.push({
                name: 'fdAttendance_history',
            })
        },
        onCancel() {
            let self = this;
            self.$refs.van_picker.setIndexes([0])
            self.listShow = false
        },
        onConfirm(value) {
            let self = this
            console.log(value)
            console.log(self.workattendanceType)
            this.post("/workattendance/updateworkattendance", {
                command: "workattendance/updateworkattendance",
                sessionid: $.cookie("sid"),
                loginid: $.cookie("uid"),
                id: self.id,
                // workattendancetype: data.key
                workattendancetype: self.workattendanceType,
                timeLength: value,
                timeUnit: self.workattendanceType == '3' ? 4 : 2
            }).done(res => {
                if (res && res.errcode) {
                    if (res.errcode == 0) {
                        self.status.show = false;
                        self.listShow = false;
                        self.$refs.van_picker.setIndexes([0])
                        Toast("修改成功~");
                        self.getstulist();
                        self.init();
                    } else {
                        self.toast(res.errdesc);
                    }
                } else {
                    self.toast("系统错误，请联系管理员~");
                }
            });
        },
        generateArray() {
            const array = [];
            for (let i = 1; i <= 120; i++) {
                array.push(i);
            }
            return array;
        },
    }
}
</script>
<style lang="scss" scoped>
.census-content {
    display: flex;
    height: 5rem;
    padding: 0.2rem;
    background: #fff;

    #echart {
        /*需要制定具体高度，以px为单位*/
        height: 100%;
        width: 100%;
    }
}

.info {
    background: #fff;
    margin-top: 0.2rem;

    ul.getinfo {
        display: flex;
        border-bottom: 1px solid #eee;

        li {
            width: 0;
            flex: 1;
            text-align: center;
            line-height: .7rem;
            color: #888;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        span {
            line-height: .7rem;
            font-size: .22rem;
        }

        span.active {
            border-bottom: 2px solid #3499db;
            color: #3499db;
        }
    }

}

ul.stu-list {
    color: #666;
    background: #fff;

    li {
        display: flex;
        border-bottom: 1px solid #eee;
        line-height: .6rem;
        text-align: center;
        padding: 0 .2rem;
        position: relative;

        span {
            line-height: .6rem;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            flex: 1;
            width: 0;
        }
    }
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

.workdate {
    line-height: .65rem;
    padding: 0 .2rem;
}
</style>
