<template>
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div class="main" v-show="config.show" @click="shadowlayer($event)">
            <div id="time-picker" v-show="config.show">
                <div class="header">
                    <span @click="cancle">重置</span>
                    <span @click="sure">确定</span>
                </div>
                <div class="content">
                    <div class="on"></div>
                    <picker :defaultVal=curYear  @changeCurVal=changeCurVal :dataList = year type="year">
                    </picker>
                    <picker :defaultVal=curMonth  @changeCurVal=changeCurVal :dataList = month type="month" v-if="">
                    </picker>
                    <picker :defaultVal=curDay  @changeCurVal=changeCurVal :dataList = day type="day" v-if="config.isday">
                    </picker>
                    <picker :defaultVal=curHour  @changeCurVal=changeCurVal :dataList = hour type="hour" v-if="config.istime">
                    </picker>
                    <picker :defaultVal=curMinute  @changeCurVal=changeCurVal :dataList = minute type="minute" v-if="config.istime">
                    </picker>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    /*
        @param 新增只选择年月  因为只选年月肯定不选时分  所以此处未做处理  只选年月的时候   istime和isday必须同时为false
        @param 因为每个月的天数是不固定的  所以从父级传过来的  day数组  需要在当前组件修改（props通信）   待解决

    */
    import picker from '@/components/picker.vue'
    export default {
        name: "time-picker",
        components:{
            picker
        },
        data () {
            return {
                result:'',//选中的时间
                curYear:'',//默认年份
                curMonth:'',//默认月份
                curDay:'',//默认日期
                curHour:'',//默认时间
                curMinute:'',//默认时间
                nowyear:'',//当前年
                nowmonth:'',//当前月
                nowhours:'',//当前时
                nowminutes:'',//当前分
                days:31,//当前月有多少天
                defultyear:'',
                defultmonth:'',
                defultday:'',
                defulthour:'',
                defultminute:'',
            }
        },
        props: {
            config: {
                default: function(){
                    return {
                        show: true,//是否显示
                        istime:true,//是否需要时分
                        isday:true,//是否需要天
                        custom:false//是否传入自定义时间
                    }
                }
            },
            year: {
                type: Array,
                default() {
                    return [new Date().getFullYear(),new Date().getFullYear() + 10];
                }
            },
            month: {
                type: Array,
                default() {
                    return [new Date().getMonth()+1,12];
                }
            },
            day: {
                type: Array,
                default() {
                    return [new Date().getDate(),(new Date(new Date().getFullYear(),new Date().getMonth()+1,0)).getDate()];
                }
            },
            hour: {
                type: Array,
                default() {
                    return [new Date().getHours(),23];
                }
            },
            minute: {
                type: Array,
                default() {
                    return [new Date().getMinutes(),59];
                }
            },
        },
        watch:{

        },
        filters: {

        },
        computed:{
            defultvalue(){
                let self = this;
                const {defultyear , defultmonth , defultday , defulthour , defultminute} = this;

                this.defultyear = this.year;
                this.itemLength = a.length;

                return a

            }
        },
        mounted () {
            let now = new Date();
            this.nowyear = parseInt(now.getFullYear());//当前年
            this.nowmonth = parseInt(now.getMonth()+1);//当前月
            this.nowday = parseInt(now.getDate());//当前日
            this.nowhours = parseInt(now.getHours());//当前时
            this.nowminutes = parseInt(now.getMinutes());//当前分

            // 给传入值赋值
            this.curYear = this.config.custom ? this.year[0] : this.nowyear;
            this.curMonth = this.config.custom ? this.month[0] : this.nowmonth;
            this.curDay = this.config.custom ? this.day[0] : this.nowday;
            this.curHour = this.config.custom ? this.hour[0] : this.nowhours;
            this.curMinute = this.config.custom ? this.minute[0] : this.nowminutes;
        },
        methods:{
            cancle(){
                this.config.show = false;
                this.$emit('confirm','');//传给父组件
            },
            sure(){
                this.config.show = false;
                let d = this.curYear+'-'+this.curMonth+'-'+this.curDay;
                let _curMonth = this.curMonth < 10 ? '0' + this.curMonth : this.curMonth;
                let _curDay = this.curDay < 10 ? '0' + this.curDay : this.curDay;
                let _curHour = this.curHour < 10 ? '0' + this.curHour : this.curHour;
                let _curMinute = this.curMinute < 10 ? '0' + this.curMinute : this.curMinute;
                if(this.config.isday && this.config.istime){
                    this.result = this.curYear+'-'+_curMonth+'-'+_curDay+' '+_curHour+':'+_curMinute + ':' + '00'
                } else if(!this.config.istime && this.config.isday){
                    this.result = this.curYear+'-'+_curMonth+'-'+_curDay
                }else if(!this.config.isday){
                    this.result = this.curYear+'-'+_curMonth
                }
                this.$emit('confirm',this.result);//传给父组件
            },
            changeDataList(type){
                let d = new Date(this.curYear,this.curMonth , 0);
                this.days =  d.getDate();//获取当前月有多少天
                if(this.config.custom){
                    this.day = [1,this.days];
                }else {
                    switch (type){
                        case 'year':
                            this.month = this.curYear == this.nowyear ? [this.nowmonth,12] : [1,12];
                            this.day = this.curYear == this.nowyear && this.curMonth == this.nowmonth ? [this.nowday,this.days] : [1,this.days];
                            this.hour = this.curYear == this.nowyear && this.curMonth == this.nowmonth && this.curDay == this.nowday ? [this.nowhours,23] : [0,23];
                            this.minute = (this.curYear == this.nowyear && this.curMonth == this.nowmonth && this.curDay == this.nowday && this.curHour == this.nowhours) ? [this.nowminutes,59] : [0,59];
                            break;
                        case 'month':
                            this.day = this.curYear == this.nowyear && this.curMonth == this.nowmonth ? [this.nowday,this.days] : [1,this.days];
                            this.hour = this.curYear == this.nowyear && this.curMonth == this.nowmonth && this.curDay == this.nowday ? [this.nowhours,23] : [0,23];
                            this.minute = (this.curYear == this.nowyear && this.curMonth == this.nowmonth && this.curDay == this.nowday && this.curHour == this.nowhours) ? [this.nowminutes,59] : [0,59];
                            break;
                        case 'day':
                            this.hour = this.curYear == this.nowyear && this.curMonth == this.nowmonth && this.curDay == this.nowday ? [this.nowhours,23] : [0,23];
                            this.minute = (this.curYear == this.nowyear && this.curMonth == this.nowmonth && this.curDay == this.nowday && this.curHour == this.nowhours) ? [this.nowminutes,59] : [0,59];
                            break;
                            case 'hour':
                            this.minute = (this.curYear == this.nowyear && this.curMonth == this.nowmonth && this.curDay == this.nowday && this.curHour == this.nowhours) ? [this.nowminutes,59] : [0,59];
                            break;
                    }
                }
            },
            shadowlayer($event){
                if($event.srcElement.className=='main'){
                     this.config.show = false;
                }
            },
            changeCurVal(type,val){
                switch (type){
                    case 'year':
                        this.curYear = val;
                        this.changeDataList(type);
                        break;
                    case 'month':
                        this.curMonth = val;
                        this.changeDataList(type);
                        break;
                    case 'day':
                        this.curDay = val;
                        this.changeDataList(type);
                        break;
                    case 'hour':
                        this.curHour = val;
                        this.changeDataList(type);
                        break;
                    case 'minute':this.curMinute = val;break;
                    default: this.curYear = val;
                }
                if(!this.config.custom){
                    this.changeDataList(type)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    #time-picker {
        width:100%;
        height: 315px;
        position: fixed;
        bottom: 0;
        background: #fff;
        z-index: 199;
        color: #666;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    .content {
        padding:0;
        display:flex;
        flex-direction:row;
        justify-content: space-between;
        flex: 1;
        align-items:flex-end;
        width: 100%;
    }
    .on {
        width: 100%;
        height: 45px;
        border-top: 1px solid #eaeaea;
        border-bottom: 1px solid #eaeaea;
        position: absolute;
        bottom: 135px;
        z-index: 100;
        pointer-events: none;
    }
    .header {
        border-bottom: 1px solid #eaeaea;
        padding: 0 .25rem;
        color: #3499db;
        display: flex;
        span {
            flex: 1;
            width: 0;
            text-align: center;
            padding: .2rem 0;
        }
    }
    .main {
        height: 100%;
        width: 100%;
        min-width: 100%;
        min-height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
        margin: 0!important;
        padding: 0!important;
    }
</style>
