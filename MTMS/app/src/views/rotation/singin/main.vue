<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <!-- <router-link class="header-back-btn" to="/rt/rotation_teacher"> -->
                <router-link class="header-back-btn" :to="{ name: 'fdRotation_teacher' }">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </router-link>
            </div>
            考勤
            <div slot="headerRight">
                <!-- <router-link class="right-icon" to="/rt/rotation_doctor/analysis"> -->
                <router-link class="header-back-btn" :to="{ name: 'fdRotation_doctor_analysis' }">
                    <img src="../../../assets/images/analysis.png" />
                </router-link>
            </div>
        </c-header>
        <div class="header-date" @click="timeconfig.show = true">
            <span>{{ checkdDate }}</span>
            <span>日期</span>
        </div>
        <div class="g-main">
            <ul v-for="(item, index) in list" v-show="!noContent" :key="index">
                <li class="date-flag">
                    <p>
                        {{ now | substr(0, 4) }}年{{ now | substr(5, 2) }}月&emsp;{{ turninfo.stuname }}
                    </p>
                    <span>平均签到率{{ item.averagerate | rate }}</span>
                </li>
                <li :class="{ 'noclick': val.editflag == 0 }" v-for="(val, indez) in item.beanlist"
                    @click="status.show = true, id = val.id" :key="indez">
                    <span>{{ val.workdatestr | substr(0, 4) }}年{{ val.workdatestr | substr(5, 2) }}月{{ val.workdatestr |
                        substr(8, 2) }}日</span>
                    <span :class="{ 'choice': val.editflag == 1 }">{{ val.workattendancename }}</span>
                </li>
            </ul>
        </div>
        <!--时间选择-->
        <add-group :config='timeconfig' :data-list="timelist" @confirm="timeselect">

        </add-group>
        <!--更新状态-->
        <c-picker :config="status" @confirm="changeSinginStatus">

        </c-picker>
        <no-content v-if='noContent'></no-content>
        <van-popup v-model="listShow" :lazy-render="false" :close-on-click-overlay="false" position="bottom">
            <van-picker ref="van_picker" show-toolbar :title="workattendanceType == '3' ? '旷工' : (workattendanceType == '4' ? '迟到' : (workattendanceType === '5' ? '早退' : '其他'))" :columns="columns" @cancel="onCancel" @confirm="onConfirm">
                <template #option="option">
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div>{{ option }}{{ workattendanceType == '3' ? '天' : '分钟' }}</div>
                    </div>
                </template>
            </van-picker>
        </van-popup>
    </div>
</template>
<script>
import methods from '../../../methods';
import { mapState, mapActions } from 'vuex'
import cHeader from '../../header';
import cPicker from '../../../components/default-picker';
import addGroup from '../../../components/add-group';
import noContent from '../../no_content';
import { Toast } from "vant";
export default {
    props: ['active'],
    data() {
        return {
            id: '',
            stuid: '',
            plandetailid: '',
            list: '',
            checkdDate: '选择日期',
            now: '',
            status: {
                show: false,
                mainlist: [],
                valueKey: 'name'
            },
            timeconfig: {
                show: false,
                label: 'name',
                fixedtop: '1.5rem',
                fixedright: '.1rem'
            },
            timelist: [

            ],
            noContent: false,
            colTitle: '',
            listShow: false,
            workattendanceType: '',
            columns: [],
            day_columns: [1, 0.5]
        }
    },
    components: {
        cPicker,
        addGroup,
        noContent,
        cHeader
    },
    watch: {
        'now': function (val, oldval) {
            if (val !== oldval) {
                this.setTurninfo({ k: 'signindata', v: this.now });
            }
        }
    },
    filters: {
        'rate': function (value) {
            return Number(value).toFixed(2) + '%';
        }
    },
    computed: {
        ...mapState([
            'turninfo'
        ]),
    },
    created() {
        let self = this;
        let lastmonth = '';
        let _year = new Date().getFullYear();
        let _month = new Date().getMonth() + 1;
        let month = _month < 10 ? '0' + _month : _month;
        this.now = (new Date().getFullYear()) + '-' + month;
        for (let i = 0; i < month; i++) {
            if (Number(month) - i < 10) {
                lastmonth = '0' + (Number(month) - i);
            } else if (Number(month) - i == 0) {
                lastmonth = Number(month) - i
            } else {
                lastmonth = Number(month) - i
            }
            self.timelist.push(
                {
                    name: _year + '年' + lastmonth + '月',
                    value: _year + '-' + lastmonth,
                    isused: 1
                }
            )
        }
    },
    mounted() {
        let self = this;
        this.initstatus();
        this.registerToNative('goBack', function (data) {
            self.$router.push({
                name: 'fdRotation_teacher',
            })
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
            'setTurninfo'
        ]),
        generateArray() {
            const array = [];
            for (let i = 1; i <= 120; i++) {
                array.push(i);
            }
            return array;
        },
        init() {
            let self = this;
            this.post('/workattendance/getuserworkattendance', {
                command: 'workattendance/getuserworkattendance',
                sessionid: $.cookie('sid'),
                loginid: $.cookie('uid'),
                uid: this.turninfo.stuid,
                businessid: this.turninfo.actionplanid,
                yearmonth: self.now
            }).done(res => {
                if (res && res.errcode) {
                    if (res.errcode == 0) {
                        self.list = res.list;
                        self.timeconfig.show = false;
                        if (res.list[0].beanlist.length == 0) {
                            self.noContent = true;
                        } else {
                            self.noContent = false;
                        }
                    } else {
                        self.toast(res.errdesc);
                    }
                } else {
                    self.toast('系统错误，请联系管理员~')
                }
            });
        },
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
                        self.init();
                    } else {
                        self.toast(res.errdesc);
                    }
                } else {
                    self.toast('系统错误，请联系管理员~')
                }
            });
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
            this.post('/workattendance/updateworkattendance',{
                command:'workattendance/updateworkattendance',
                sessionid:$.cookie('sid'),
                loginid:$.cookie('uid'),
                id:self.id,
                workattendancetype:self.workattendanceType,
                timeLength: value,
                timeUnit: self.workattendanceType == '3' ? 4 : 2
            }).done( res => {
                if(res && res.errcode){
                    if(res.errcode == 0){
                        self.status.show = false;
                        self.listShow = false;
                        self.$refs.van_picker.setIndexes([0])
                        // self.toast('修改成功~');
                        Toast("修改成功~");
                        self.init();
                    }else {
                        self.toast(res.errdesc);
                    }
                }else {
                    self.toast('系统错误，请联系管理员~')
                }
            });
        },
        // 修改状态
        changeSinginStatus(data) {
            console.log(data)
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
            this.post('/workattendance/updateworkattendance',{
                command:'workattendance/updateworkattendance',
                sessionid:$.cookie('sid'),
                loginid:$.cookie('uid'),
                id:self.id,
                workattendancetype:data.key
            }).done( res => {
                if(res && res.errcode){
                    if(res.errcode == 0){
                        self.status.show = false;
                        self.toast('修改成功~');
                        self.init();
                    }else {
                        self.toast(res.errdesc);
                    }
                }else {
                    self.toast('系统错误，请联系管理员~')
                }
            });
        },
        //时间选择
        timeselect(data) {
            this.now = data.value;
            this.init();
        },
    }
}
</script>
<style lang="scss" scoped>
p {
    margin: 0;
    padding: 0;
}

.right-icon {
    img {
        width: .35rem;
    }
}

.header-date {
    display: flex;
    justify-content: space-between;
    padding: 0 .2rem;
    background: #fff;
    margin-bottom: .2rem;

    span {
        line-height: .65rem;
    }

    span:last-child {
        color: #3499db;
    }
}

ul {
    background: #fff;
    margin-bottom: .15rem;
    color: #666;

    li {
        display: flex;
        position: relative;
        border-bottom: 1px solid #eee;

        span {
            flex: 1;
            width: 0;
            line-height: .7rem;
            text-align: center;
        }
    }

    .date-flag {
        display: flex;
        flex-direction: column;
        padding: 0 .2rem;

        span {
            width: 100%;
            line-height: .5rem;
            text-align: left;
        }

        p {
            line-height: .5rem;
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
    background: url("../../../assets/images/you-jiantou.png") 0 0 no-repeat;
    background-size: 100% 100%;
    position: absolute;
    right: 0.2rem;
    top: 0.15rem;
}

.noclick {
    pointer-events: none;
}
</style>
