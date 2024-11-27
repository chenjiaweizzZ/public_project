<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <!-- <a @click="back()" class="header-back-btn">
                    <img src="../assets/images/icon_fanhui.png" />
                </a> -->
            </div>
            <div style="width:70%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;">
                选择操作
            </div>
        </c-header>
        <div class="g-main">
            <p v-if="list.length" style="margin:.2rem;">请选择操作</p>
            <div style="padding:.1rem .5rem;">
                <div v-for="(item,index) in list" @click="selectRadio(item,index)" style="display:inline-block;padding-right:.5rem;">
                    <input type="radio" :name='index' class="radio" :class="{'checked':item.checked}">
                    <span style="padding-left:.1rem">{{ item.label }}</span><br/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
import cHeader from './header'
import methods from '../methods'
import { mapState, mapActions } from 'vuex'
import cModal from '../components/modal';
import { setTimeout } from 'timers';
export default {
    data () {
        return {
            list: [
                // {label:'预约'},{label:'签到'},{label:'评教'}
            ],
        }
    },
    components: {
        cHeader,
        cModal,
    },
    mounted () {
        let self = this;
        // self.registerToNative('goBack', function (data) {
            // self.back();
        // });
        let scheduleid = this.$route.query.scheduleid || '';
        let courseid = this.$route.query.courseid || '';

        if($.cookie('sid') && $.cookie('uid')){
            this.tourEvaluate(scheduleid,courseid);
        }else{
            this.toast("未检测到用户信息，请先登录！",3000);
            setTimeout(()=>{
                 window.location.href = '/pages/futuredoctorapp/index.html/#/naire_login?scheduleid='+scheduleid+'&courseid='+courseid+'&scan=1';
            },1000)
        }
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
        back () {
            // window.location.href = "/pages/futuredoctorapp/todo.html?view=application&scan=1";
            window.location.href =
        "/pages/futuredoctorapp/index.html/#/wxIndex";
    //         if(this.$route.query.stem) {
    //     this.$router.push({
    //     name: "wxMenu",
    //     });
    //   }else {
    //     this.$router.push({
    //     name: "wxIndex",
    //     });
    //   }
        },
        selectRadio (item,index) {
            this.list.map((obj,i) => {
                if(index == i){
                    this.$set(this.list[i],'checked',true);
                }else{
                    this.$set(this.list[i],'checked',false);
                }
            })
        },
        tourEvaluate (scheduleid,courseid){
            let _courseid = courseid;
            let _scheduleid = scheduleid;
            this.post('/formeval/commonNaire/checkHasEvalOrNot',{
                command: "commonNaire/checkHasEvalOrNot",
                loginid: $.cookie('uid'),
                sessionid: $.cookie('sid'),
                userid: $.cookie('uid'),
                username: $.cookie('name'),
                courseid: _courseid,
                scheduleid: _scheduleid,
                evaluationtype: 'AdminEvalTeacher'  //管理员评价老师
            }).done(res => {
                if(res.errcode == 0){
                    if(res.jumpstatus){
                        if (res.jumpstatus == 1) { 
                            window.location.href = "/pages/futuredoctorapp/index.html#/naire_list?todo=true&scan=1'"; //任务列表
                        } else if(res.jumpstatus == 2) {
                            var nowstatus = 0;
                            if(res.status == 2){
                                nowstatus = 1;
                            }else{
                                nowstatus = 0;
                            }
                            var param = '?activityId=' + res.activity_id +'&naireId=' + res.naire_id + '&id=' + res.eval_id + '&evaled_id=' + res.evaled_id + '&status=' + nowstatus + '&scheduleid=' + _scheduleid + '&todo=true&scan=1';
                            window.location.href = "/pages/futuredoctorapp/index.html#/questionnaire" + param; //问卷详情
                        } else if (res.jumpstatus == 3) {
                            var param = '?activityId=' + res.activity_id + '&naireId=' + res.naire_id + '&scheduleid=' + _scheduleid+ '&&todo=true&scan=1';
                            window.location.href = "/pages/futuredoctorapp/index.html#/evaluated_list" + param; //被评价对象列表
                        }
                    }else{
                        this.toast("没有评价任务");
                    }
                } else if(res.errcode == 400){
                    this.toast(res.errdesc);

                    setTimeout(()=>{
                        this.$router.push({
                            name: 'naire_login',
                            query: {
                                scheduleid: _scheduleid,
                                courseid: _courseid,
                                scan: 1,
                            }
                        })
                    },2000)
                } else if(res.errcode == 9904){
                    this.toast("登录信息失效，请重新登录");
                    setTimeout(()=>{
                        window.location.href = '/pages/futuredoctorapp/index.html/#/naire_login?scheduleid='+_scheduleid+'&courseid='+_courseid+'&scan=1';
                    },2000)
                } else {
                    this.toast(res.errdesc);
                }
            }).fail(()=> {
                this.toast("连接服务失败，请稍后再试")
            })
        },
    },
}
</script>

<style scoped>
    .header {
        padding: 0.2rem;
        color: rgb(0, 0, 0);
        font-size: 0.26rem;
    }
    .radio{
        width: .3rem;
        height: .3rem;
        margin-right: .1rem;
        position: relative;
        top: .05rem;
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
        background-image: url('../assets/images/gouxuan.png');
        background-size: cover;
        margin-right: 0.05rem;
    }
    .checked {
        background-image: url('../assets/images/gouxuan_on.png');
        background-size: cover;
    }
</style>
